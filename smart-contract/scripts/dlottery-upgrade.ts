import { ethers, upgrades } from "hardhat";

async function main() {
  console.log("Upgrading DLottery contract...");

  // The proxy address from the previous deployment
  const proxyAddress = process.env.PROXY_ADDRESS;
  
  if (!proxyAddress) {
    console.error("Please provide PROXY_ADDRESS environment variable");
    process.exit(1);
  }

  // Get the contract factory for the new implementation
  const DLotteryV2 = await ethers.getContractFactory("DLottery");

  try {
    // Upgrade the proxy to the new implementation
    console.log(`Upgrading proxy at ${proxyAddress}...`);
    const upgraded = await upgrades.upgradeProxy(proxyAddress, DLotteryV2);
    
    // Wait for upgrade to complete
    await upgraded.waitForDeployment();
    
    // Get the new implementation address
    const newImplementationAddress = await upgrades.erc1967.getImplementationAddress(proxyAddress);
    
    console.log("DLottery upgraded successfully!");
    console.log(`New implementation address: ${newImplementationAddress}`);
  } catch (error) {
    console.error("Upgrade failed:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });