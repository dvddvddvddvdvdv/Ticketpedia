import PocketBase from 'pocketbase';

const pbUrl = import.meta.env.VITE_PB_URL || 'https://db.zizazu.id';

export const pb = new PocketBase(pbUrl);git add .