/** @jsxImportSource frog/jsx */
import { TransactionContext, parseEther } from 'frog';
import { BlankInput } from 'hono/types';
import { State } from '../utils';
import fishAbi from '@/app/abi/ERC721Shop.json';


export const gameMint = async (
  c: TransactionContext<
    {
      State: State;
    },
    '/fish-go',
    BlankInput
  >
) => {
  const { inputText, frameData, buttonIndex } = c;
  const { fid, castId, url, state } = frameData || {};


  return c.contract({
    abi: fishAbi,
    chainId: `eip155:${process.env.CHAIN_ID as '8453' | '84532'}`,
    functionName: 'buy',
    args: [process.env.GAME_FINSHING_CONTRACT_ADDRESS!, 1],
    to: process.env.GAME_SHOP_CONTRACT_ADDRESS! as `0x${string}`,
    value: process.env.CHAIN_ID === '84532' ? parseEther('0.00001') : parseEther('0.012'),
    attribution: true,
  });
};
