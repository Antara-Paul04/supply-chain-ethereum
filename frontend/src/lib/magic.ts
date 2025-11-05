import { Magic } from 'magic-sdk';

const createMagic = () => {
  return typeof window !== 'undefined' && new Magic(process.env.NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY || 'pk_live_test');
};

export const magic = createMagic();