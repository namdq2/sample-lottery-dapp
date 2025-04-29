import { ethers, upgrades } from "hardhat";
import { TUSD } from "../typechain-types";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Deploy TUSD contract
  const TUSD = await ethers.getContractFactory("TUSD");
  const tusd = await upgrades.deployProxy(TUSD, [
    deployer.address, // defaultAdmin
    deployer.address, // pauser
    deployer.address, // minter
    deployer.address, // upgrader
  ], {
    initializer: "initialize",
    kind: "uups",
  });

  await tusd.waitForDeployment();
  const tusdAddress = await tusd.getAddress();

  console.log("TUSD deployed to:", tusdAddress);
  console.log("TUSD implementation address:", await upgrades.erc1967.getImplementationAddress(tusdAddress));
  console.log("TUSD admin address:", await upgrades.erc1967.getAdminAddress(tusdAddress));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 