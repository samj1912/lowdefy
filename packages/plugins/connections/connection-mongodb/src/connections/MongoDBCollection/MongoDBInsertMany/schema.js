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

export default {
  $schema: 'http://json-schema.org/draft-07/schema#',
  title: 'Lowdefy Request Schema - MongoDBInsertMany',
  type: 'object',
  required: ['docs'],
  properties: {
    docs: {
      type: 'array',
      description: 'The array of documents to be inserted.',
      errorMessage: {
        type: 'MongoDBInsertMany request property "docs" should be an array.',
      },
      items: {
        type: 'object',
        errorMessage: {
          type: 'MongoDBInsertMany request property "docs" should be an array of documents to insert.',
        },
      },
    },
    options: {
      type: 'object',
      description: 'Optional settings.',
      errorMessage: {
        type: 'MongoDBInsertMany request property "options" should be an object.',
      },
    },
  },
  errorMessage: {
    type: 'MongoDBInsertMany request properties should be an object.',
    required: 'MongoDBInsertMany request should have required property "docs".',
  },
};
