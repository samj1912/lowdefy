/*
  Copyright 2020 Lowdefy, Inc

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

import { WebParser } from '@lowdefy/operators';

import Actions from './Actions';
import Blocks from './Blocks';
import Requests from './Requests';
import State from './State';
import getFieldValues from './getFieldValues';

const blockData = ({
  actions,
  areas,
  blockId,
  blocks,
  defaultValue,
  field,
  id,
  layout,
  meta,
  pageId,
  properties,
  requests,
  required,
  style,
  type,
  validate,
  visible,
}) => ({
  actions,
  areas,
  blockId,
  blocks,
  defaultValue,
  field,
  id,
  layout,
  meta,
  pageId,
  properties,
  requests,
  required,
  style,
  type,
  validate,
  visible,
});

const getContext = async ({ block, contextId, pageId, rootContext }) => {
  if (rootContext.contexts[contextId]) {
    rootContext.contexts[contextId].input = rootContext.input[contextId] || {};
    rootContext.contexts[contextId].urlQuery = rootContext.urlQuery;
    rootContext.contexts[contextId].lowdefyGlobal = rootContext.lowdefyGlobal;
    rootContext.contexts[contextId].menus = rootContext.menus;
    rootContext.contexts[contextId].config = rootContext.config;
    rootContext.contexts[contextId].update();
    return rootContext.contexts[contextId];
  }
  if (!block) {
    throw new Error('A block must be provided to get context.');
  }
  // eslint-disable-next-line no-param-reassign
  rootContext.contexts[contextId] = {
    id: contextId,
    pageId,
    actionLog: [],
    blockId: block.blockId,
    client: rootContext.client,
    config: rootContext.config,
    displayMessage: rootContext.displayMessage,
    document: rootContext.document,
    input: rootContext.input[contextId] || {},
    allInputs: rootContext.input,
    lowdefyGlobal: rootContext.lowdefyGlobal,
    menus: rootContext.menus,
    requests: {},
    rootBlock: blockData(block), // filter block to prevent circular loop structure
    routeHistory: rootContext.routeHistory,
    showValidationErrors: false,
    state: {},
    update: () => {}, // Initialize update since Requests might call it during context creation
    updateBlock: rootContext.updateBlock,
    urlQuery: rootContext.urlQuery,
    window: rootContext.window,
    updateListeners: new Set(),
  };
  const ctx = rootContext.contexts[contextId];
  ctx.parser = new WebParser({ context: ctx, contexts: rootContext.contexts });
  ctx.State = new State(ctx);
  ctx.Actions = new Actions(ctx);
  ctx.Requests = new Requests(ctx);
  const dVRequests = getFieldValues('_request', ...getFieldValues('defaultValue', ctx.rootBlock));
  await ctx.Requests.callRequests({
    requestIds: dVRequests,
  });
  ctx.RootBlocks = new Blocks({
    areas: { root: { blocks: [ctx.rootBlock] } },
    context: ctx,
  });
  ctx.RootBlocks.init();
  ctx.update = () => {
    ctx.RootBlocks.update();
    [...ctx.updateListeners].forEach((listenId) => {
      // Will loop infinitely if update is called on self
      if (!rootContext.contexts[listenId] || listenId === contextId) {
        ctx.updateListeners.delete(listenId);
      } else {
        rootContext.contexts[listenId].update();
      }
    });
  };
  ctx.update();
  await ctx.RootBlocks.map[ctx.blockId].callAction({ action: 'onInit', hideLoading: true });
  ctx.State.freezeState();
  return ctx;
};

export default getContext;
