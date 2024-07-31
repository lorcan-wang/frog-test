/** @jsxImportSource frog/jsx */
import { CastActionContext } from 'frog';
import { BlankInput } from 'hono/types';
import { State } from '../utils';

export const addMapAction = async (
  c: CastActionContext<
    {
      State: State;
    },
    '/add-map',
    BlankInput
  >
) => {
  console.log(`Cast map Action to ${JSON.stringify(c.actionData.castId)} from ${c.actionData.fid}`);
  return c.res({ type: 'frame', path: '/map' });
};
