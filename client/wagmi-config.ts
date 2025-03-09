'use client';

import { createConfig, http } from 'wagmi';
import { mainnet, sepolia, localhost, polygonAmoy } from 'wagmi/chains';

export const wagmiConfig = createConfig({
  chains: [polygonAmoy, localhost, mainnet, sepolia],
  transports: {
    [polygonAmoy.id]: http('https://rpc-amoy.polygon.technology'),
    [localhost.id]: http('http://127.0.0.1:8545/'),
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
})