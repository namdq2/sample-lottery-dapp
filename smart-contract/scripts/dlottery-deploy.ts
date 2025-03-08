import { ethers } from "hardhat";
import hre from "hardhat";

async function main() {
  console.log("Deploying DLottery contract...");
  
  // Get the account to use as owner
  const [deployer] = await ethers.getSigners();
  console.log(`Deploying with account: ${deployer.address}`);
  
  try {
    const ignition = await hre.ignition.deploy("DLotteryModule", {
      parameters: { 
        owner: deployer.address 
      }
    });
    
    console.log("DLottery deployed successfully!");
    console.log(`Proxy address: ${ignition.proxy.address}`);
    console.log(`Implementation address: ${ignition.dLotteryImplementation.address}`);
    console.log(`Proxy Admin address: ${ignition.proxyAdmin.address}`);
    
    // Save these addresses for future upgrades
    console.log("\nSave these addresses for future upgrades:");
    console.log(`PROXY_ADDRESS=${ignition.proxy.address}`);
    console.log(`PROXY_ADMIN_ADDRESS=${ignition.proxyAdmin.address}`);
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