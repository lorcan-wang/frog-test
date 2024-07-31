export type UserInfo = {
  fid: number;
  x: number;
  y: number;
  direction: string;
  name: string;
  map: 'base' | 'fish';
  lastMoveTimestamp: number;
  fishingRod: number;
  outfit: string;
  coin: number;
};
