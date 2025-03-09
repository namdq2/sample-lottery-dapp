# DLottery Smart Contract
This project implements a decentralized lottery system on Ethereum using upgradeable smart contracts. It allows participants to enter a lottery and automatically selects winners in a transparent and fair way.

## Overview
DLottery is an upgradeable smart contract built with OpenZeppelin's transparent proxy pattern. Key features include:

- Lottery creation and management by admin
- Random ticket assignment for participants
- Transparent drawing mechanism
- Prize distribution to winners
- Upgradeable architecture for future improvements

## Contract Architecture
The project uses a three-contract architecture for upgradeability:

- Proxy Contract: The permanent address users interact with
- Implementation Contract: Contains the business logic (upgradeable)
- ProxyAdmin Contract: Manages the upgrade process securely

## Development
```shell
# Install dependencies
pnpm install

# Compile contracts
npx hardhat compile

# Run tests
npx hardhat test
```

## Deployment
### Initial Deployment
To deploy the DLottery contract using OpenZeppelin Upgrades:
```shell
# Start a local node (in a separate terminal)
npx hardhat node

# Deploy to local network
npx hardhat run scripts/dlottery-deploy.ts --network localhost

# Deploy to testnet (e.g., Sepolia)
npx hardhat run scripts/dlottery-deploy.ts --network sepolia
```

The deployment script will output important addresses - make sure to save them:
- PROXY_ADDRESS: The address users will interact with
- PROXY_ADMIN_ADDRESS: The address admin will interact with for upgrade operations
- IMPLEMENTATION_ADDRESS: The address of the current logic contract

### Upgrading the Contract
When you need to update the contract logic:

1. Make changes to the DLottery.sol file
2. Compile the updated contract
3. Run the upgrade script:
```shell
PROXY_ADDRESS=<saved-proxy-address> npx hardhat run scripts/upgrade-dlottery.ts --network <your-network>
```

## Using the Contract
After deployment:
1. Admin Functions:
- startNewLottery(): Begin a new lottery round
- uploadPrize(): Fund the lottery prize pool
- setDrawDate(): Set the date for the lottery drawing
- performDraw(): Execute the drawing process
2. User Functions:
- participate(): Enter the lottery (gets a random ticket)
- withdrawPrize(): Claim winnings after a draw

## Verification
To verify the contract on Etherscan:
```shell
npx hardhat verify --network <network> <implementation-address>
```

Note: Only the implementation contract needs verification, as the proxy is a standard OpenZeppelin contract.


```
Deploying DLottery contract...
Deploying with account: 0xd79Dc6Eeeb004cEebA6A1f6490B6d637d428Fec9
Deploying proxy...
DLottery deployed successfully!
Proxy address: 0xeE4A0335bCC0C92Ae27eE00E579aa812a887D2A7
Implementation address: 0xCbe78Abb561f4e2947bf839152bc5149e62e6347
Proxy admin address: 0xDd9a9D9D3Ee0926C6F07B8cF54eCC73e2AA3Fa22
```


Compiled 1 Solidity file successfully (evm target: paris).
Deploying DLottery contract...
Deploying with account: 0xd79Dc6Eeeb004cEebA6A1f6490B6d637d428Fec9
Deploying proxy...
DLottery deployed successfully!
Proxy address: 0x5E28E9Fc57339291c494796186B40aA369Dd9E9b
Implementation address: 0x6a76d5479A336605e4Cab2B5e877591d7c2A1B06
Proxy admin address: 0xeC393F221280CCED7F379C36FF9396A490F11808


Deploying DLottery contract...
Deploying with account: 0xd79Dc6Eeeb004cEebA6A1f6490B6d637d428Fec9
Deploying proxy...
DLottery deployed successfully!
Proxy address: 0x9AF48f6cA9B855DEa4b0468a0390b12A051888Ea
Implementation address: 0x6a76d5479A336605e4Cab2B5e877591d7c2A1B06
Proxy admin address: 0x2a3a21CCdf016736Cb6e903caF1252504209A8E3