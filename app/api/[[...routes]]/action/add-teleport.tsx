/** @jsxImportSource frog/jsx */
import { CastActionContext } from 'frog';
import { BlankInput } from 'hono/types';
import { State } from '../utils';

export const addTeleportAction = async (
  c: CastActionContext<
    {
      State: State;
    },
    '/add-teleport',
    BlankInput
  >
) => {
  console.log(`Cast teleport Action to ${JSON.stringify(c.actionData.castId)} from ${c.actionData.fid}`);
  return c.res({ type: 'frame', path: '/teleport' });
};
