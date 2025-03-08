import { ethers, upgrades } from "hardhat";

async function main() {
  console.log("Deploying DLottery contract...");
  
  // Get the contract factory
  const DLottery = await ethers.getContractFactory("DLottery");
  
  // Get the account to use as owner
  const [deployer] = await ethers.getSigners();
  console.log(`Deploying with account: ${deployer.address}`);
  
  try {
    // Deploy the contract as upgradeable
    console.log("Deploying proxy...");
    const dlottery = await upgrades.deployProxy(DLottery, [deployer.address], {
      initializer: "initialize",
      kind: "transparent" 
    });
    
    // Wait for deployment to complete
    await dlottery.waitForDeployment();
    
    // Get deployment details
    const proxyAddress = await dlottery.getAddress();
    
    console.log("DLottery deployed successfully!");
    console.log(`Proxy address: ${proxyAddress}`);
    
    // Get implementation address
    const implementationAddress = await upgrades.erc1967.getImplementationAddress(proxyAddress);
    console.log(`Implementation address: ${implementationAddress}`);
    
    // Get proxy admin address
    const adminAddress = await upgrades.erc1967.getAdminAddress(proxyAddress);
    console.log(`Proxy admin address: ${adminAddress}`);
  } catch (error) {
    console.error("Deployment failed:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });