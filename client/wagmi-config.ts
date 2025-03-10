'use client';

import {createConfig, http} from 'wagmi';
import {mainnet, sepolia, localhost, polygonAmoy, bscTestnet} from 'wagmi/chains';

export const wagmiConfig = createConfig({
  chains: [bscTestnet, polygonAmoy, localhost, mainnet, sepolia],
  transports: {
    [bscTestnet.id]: http('https://data-seed-prebsc-1-s1.binance.org:8545'),
    [polygonAmoy.id]: http('https://rpc-amoy.polygon.technology'),
    [localhost.id]: http('http://127.0.0.1:8545/'),
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
})
