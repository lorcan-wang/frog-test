/** @jsxImportSource frog/jsx */
import { TransactionContext } from 'frog';
import { BlankInput } from 'hono/types';
import { State } from '../utils';
import fishAbi from '@/app/abi/RPGFishingGame.json';


export const fishGo = async (
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
  // const fid = 260623;


  const address = await fetch(`${process.env.FID_GET_ADDRESS_SERVER_URL!}/${fid}`);
  const addressJson = await address.json();
  const fishContract = process.env.FISH_CONTRACT_ADDRESS!;
  console.log('🚀 ~ fishContract:', fishContract);

  let power = c.previousState.power;
  if (power > 100) {
    power = 100;
  }

  const params = new URLSearchParams({
    fid: fid!.toString(),
    player: addressJson.data[0].address,
    power: power.toString(),
    network: '8453',
  });
  console.log('🚀 ~ params:', fid, addressJson.data[0].address, power.toString());

  const response = await fetch(`${process.env.FISH_SERVER_URL!}?${params.toString()}`);
  const res = await response.json();
  console.log('🚀 ~ res:', res);

  return c.contract({
    abi: fishAbi,
    chainId: 'eip155:8453',
    functionName: 'play',
    args: [fid, res.data.vrf, res.data.power, res.data.signature],
    to: fishContract as `0x${string}`,
  });
};
