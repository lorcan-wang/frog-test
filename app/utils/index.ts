import { headers } from 'next/headers';
import { ethers } from 'ethers';
import { Redis } from '@upstash/redis';

const provider = new ethers.JsonRpcProvider(process.env.PROVIDER_RPC);
const contractAddress = process.env.FISH_CONTRACT_ADDRESS!;
const abi = [`event Fishing(uint256 indexed fid, uint256 indexed fish, uint256 nonce)`];

export const getCurBaseUrl = () => {
  const headersData = headers();
  const host = headersData.get('host')!;
  const protocol = headersData.get('x-forwarded-proto') ?? (host.startsWith('localhost') ? 'http' : 'https');
  const apiBase = `${protocol}://${host}`;

  return apiBase;
};

export const generateRandomPosition = (
  existingPositions: any,
  existingEvents: any,
  blocks: any,
  mapMin: number,
  mapMax: number
) => {
  const tryLimit = 20; // 尝试限制次数
  for (let i = 0; i < tryLimit; i++) {
    const newX = Math.floor(Math.random() * (mapMax - mapMin + 1)) + mapMin;
    const newY = Math.floor(Math.random() * (mapMax - mapMin + 1)) + mapMin;
    const positionTaken =
      existingPositions.some((pos: any) => pos.position.x === newX && pos.position.y === newY) ||
      existingEvents.some((ev: any) => ev.position.x === newX && ev.position.y === newY) ||
      blocks.some((block: any) => block.x === newX && block.y === newY);
    if (!positionTaken) {
      return { x: newX, y: newY };
    }
  }

  // 如果在尝试限制次数内未找到合适位置，则继续随机生成位置直到找到合适位置
  let newX: any, newY: any, positionTaken;
  do {
    newX = Math.floor(Math.random() * (mapMax - mapMin + 1)) + mapMin;
    newY = Math.floor(Math.random() * (mapMax - mapMin + 1)) + mapMin;
    positionTaken =
      existingPositions.some((pos: any) => pos.position.x === newX && pos.position.y === newY) ||
      existingEvents.some((ev: any) => ev.position.x === newX && ev.position.y === newY) ||
      blocks.some((block: any) => block.x === newX && block.y === newY);
  } while (positionTaken);

  return { x: newX, y: newY };
};

export async function parseEventByHash(txHash: string) {
  // 获取交易收据
  const receipt = await provider.waitForTransaction(txHash);

  // 创建接口来解析日志
  const iface = new ethers.Interface(abi);

  let fish: string | undefined;

  // 解析日志
  receipt?.logs.forEach(log => {
    if (log.address.toLowerCase() === contractAddress.toLowerCase()) {
      try {
        const parsedLog = iface.parseLog(log);

        fish = parsedLog!.args.fish.toString();
      } catch (error) {
        console.error('Error parsing log:', error);
      }
    }
  });

  return fish;
}
