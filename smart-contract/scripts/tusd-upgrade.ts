import { ethers, upgrades } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Upgrading contracts with the account:", deployer.address);

  // The address of the proxy contract
  const proxyAddress = process.env.TUSD_PROXY_ADDRESS;
  if (!proxyAddress) {
    throw new Error("TUSD_PROXY_ADDRESS environment variable is not set");
  }

  // Deploy new implementation
  const TUSD = await ethers.getContractFactory("TUSD");
  const tusd = await upgrades.upgradeProxy(proxyAddress, TUSD);

  console.log("TUSD upgraded");
  console.log("New implementation address:", await upgrades.erc1967.getImplementationAddress(proxyAddress));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 