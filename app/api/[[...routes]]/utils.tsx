/** @jsxImportSource frog/jsx */
import { UserInfo } from '@/app/type';
import { Redis } from '@upstash/redis';

export const mapXMin = 0;
export const mapXMax = 33;
export const mapYMin = 0;
export const mapYMax = 17;

export type State = {
  count: number;
  power: number;
  fishBeginTime: number;
  fishPowerUp: number;
  isShare: boolean;
};

export const loadAllEvent = async (client: Redis) => {
  const events = (await client.get('event')) as any;
  return events;
};

export const getGif = async (url: string) => {
  const response = await fetch(url);
  const res = await response.json();

  return res.base64Url;
};

export const getUsernameByFid = async (fid: number) => {
  const res = await fetch(`http://43.153.5.119:8000/users/info/${fid}`);

  const resJson = await res.json();

  const name = resJson.data[0].username;

  return name;
};

export const getRandomAward = () => {
  const randomNum = Math.random() * 100;
  if (randomNum < 10) {
    return 50; // 10%的概率 50金币
  } else if (randomNum < 25) {
    return 20; // 15%的概率 20金币
  } else if (randomNum < 45) {
    return 10; // 20%的概率 10金币
  } else if (randomNum < 70) {
    return 5; // 25%的概率 5金币
  } else {
    return null; // 30%的概率
  }
};

export async function getKeyByFid(fid: number, client: Redis) {
  let cursor = '0';
  let keys: string[] = [];
  let scanCount = 0;
  const maxScans = 100;
  const keyPattern = `*fid:${fid}*`;

  do {
    if (scanCount >= maxScans) {
      console.log(`Reached maximum scan count of ${maxScans}.`);
      break;
    }

    const result = await client.scan(cursor, { match: keyPattern, count: 100 });
    cursor = result[0];
    keys = keys.concat(result[1]);
    scanCount++;
  } while (cursor !== '0');

  console.log('🚀 ~ getUserInfoByFid ~ keys:', keys);
  return keys[0] || `x:12y:7fid:${fid}`;
}

export async function updatePosition(
  client: Redis,
  positionKey: string,
  newX: number,
  newY: number,
  fid: number,
  lastMoveTimestamp: number
) {
  const positionObject = await client.hgetall<UserInfo>(positionKey);

  if (positionObject) {
    positionObject.x = newX;
    positionObject.y = newY;
    positionObject.lastMoveTimestamp = lastMoveTimestamp;

    const newKey = `x:${newX}y:${newY}fid:${fid}`;

    await client.hset(newKey, positionObject);

    await client.del(positionKey);
  }
}
