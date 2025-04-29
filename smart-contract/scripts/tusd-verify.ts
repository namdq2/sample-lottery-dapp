import { ethers } from "hardhat";
import hre from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Verifying contracts with the account:", deployer.address);

  // The address of the proxy contract
  const proxyAddress = process.env.TUSD_PROXY_ADDRESS;
  if (!proxyAddress) {
    throw new Error("TUSD_PROXY_ADDRESS environment variable is not set");
  }

  // Get the implementation address
  const implementationAddress = await hre.upgrades.erc1967.getImplementationAddress(proxyAddress);
  console.log("Implementation address:", implementationAddress);

  // Verify the implementation contract
  try {
    await hre.run("verify:verify", {
      address: implementationAddress,
      constructorArguments: [],
    });
    console.log("Implementation contract verified successfully");
  } catch (error) {
    console.error("Error verifying implementation contract:", error);
  }

  // Verify the proxy contract
  try {
    await hre.run("verify:verify", {
      address: proxyAddress,
      constructorArguments: [],
    });
    console.log("Proxy contract verified successfully");
  } catch (error) {
    console.error("Error verifying proxy contract:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 