import hre from "hardhat";
import DLotteryUpgradeModule from "../ignition/modules/DLotteryUpgrade";

async function main() {
  console.log("Upgrading DLottery contract...");

  // These values should be provided when running the script
  const proxyAddress = process.env.PROXY_ADDRESS;
  const proxyAdminAddress = process.env.PROXY_ADMIN_ADDRESS;

  if (!proxyAddress || !proxyAdminAddress) {
    console.error("Please provide PROXY_ADDRESS and PROXY_ADMIN_ADDRESS environment variables");
    process.exit(1);
  }

  try {
    const ignition = await hre.ignition.deploy(DLotteryUpgradeModule, {
      parameters: {
        proxyAddress,
        proxyAdminAddress
      }
    });

    console.log("DLottery upgraded successfully!");
    console.log(`New implementation address: ${ignition.newImplementation.address}`);
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