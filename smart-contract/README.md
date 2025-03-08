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
```
# Install dependencies
npm install

# Compile contracts
npx hardhat compile

# Run tests
npx hardhat test
```

## Deployment
### Initial Deployment
To deploy the DLottery contract using Hardhat Ignition:
```
# Start a local node (in a separate terminal)
npx hardhat node

# Deploy to local network
npx hardhat run scripts/dlottery-deploy.ts --network localhost

# Deploy to testnet (e.g., Sepolia)
npx hardhat run scripts/dlottery-deploy.ts --network sepolia
```

The deployment script will output important addresses - make sure to save them:
- PROXY_ADDRESS: The address users will interact with
- PROXY_ADMIN_ADDRESS: The address that controls upgrades
- IMPLEMENTATION_ADDRESS: The address of the current logic contract

### Upgrading the Contract
When you need to update the contract logic:

1. Make changes to the DLottery.sol file
2. Compile the updated contract
3. Run the upgrade script:
```
PROXY_ADDRESS=<saved-proxy-address> PROXY_ADMIN_ADDRESS=<saved-admin-address> npx hardhat run scripts/dlottery-upgrade.ts --network <your-network>
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
```
npx hardhat verify --network <network> <implementation-address>
```

Note: Only the implementation contract needs verification, as the proxy is a standard OpenZeppelin contract.