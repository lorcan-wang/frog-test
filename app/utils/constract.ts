import { ethers } from 'ethers';
import fishAbi from '@/app/abi/RPGFishingGame.json';

const fishContract = process.env.FISH_CONTRACT_ADDRESS!;
const provider = new ethers.JsonRpcProvider('https://base-sepolia.g.alchemy.com/v2/8wn_sF50dN9MXuMRRLZZkCzF9t7hC_rf');
const abi = fishAbi;

export async function playFishGame(fid: number, rodId: number, baitId: number, vrf: number, sig: any) {
  const contract = new ethers.Contract(fishContract, abi, sig);

  try {
    const tx = await contract.play(fid, rodId, baitId, vrf, sig);
    console.log('Transaction hash:', tx.hash);

    const receipt = await tx.wait();
    console.log('Transaction was mined in block:', receipt.blockNumber);
  } catch (error) {
    console.error('Error calling play method:', error);
  }
}
