/*
  Copyright 2020-2021 Lowdefy, Inc

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/

import http from 'http';
import https from 'https';

import axios from 'axios';
import { mergeObjects } from '@lowdefy/helpers';

import schema from '../AxiosHttpSchema.json';

async function axiosHTTP({ request, connection }) {
  try {
    const config = mergeObjects([connection, request]);
    if (config.httpAgentOptions) {
      config.httpAgent = new http.Agent(config.httpAgentOptions);
    }
    if (config.httpsAgentOptions) {
      config.httpsAgent = new https.Agent(config.httpsAgentOptions);
    }
    const res = await axios(config);
    const { status, statusText, headers, method, path, data } = res;
    return { status, statusText, headers, method, path, data };
  } catch (error) {
    if (error.response) {
      throw new Error(
        `${error.message}; Http response "${error.response.status}: ${
          error.response.statusText
        }"; Data: ${JSON.stringify(error.response.data)}.`
      );
    }
    throw error;
  }
}

export default { resolver: axiosHTTP, schema, checkRead: false, checkWrite: false };
