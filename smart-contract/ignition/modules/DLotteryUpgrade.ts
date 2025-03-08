import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const DLotteryUpgradeModule = buildModule("DLotteryUpgradeModule", (m) => {
  // Get the existing proxy and admin addresses
  const proxyAddress = m.getParameter("proxyAddress", "address");
  const proxyAdminAddress = m.getParameter("proxyAdminAddress", "address");
  
  // Deploy the new implementation
  const newDLotteryImplementation = m.contract("DLottery");
  
  // Get the proxy admin contract instance
  const proxyAdmin = m.contractAt(
    "@openzeppelin/contracts/proxy/transparent/ProxyAdmin",
    proxyAdminAddress
  );
  
  // Upgrade the proxy to point to the new implementation
  const upgradeTransaction = m.transaction(
    proxyAdmin,
    "upgrade",
    [proxyAddress, newDLotteryImplementation]
  );
  
  return { newImplementation: newDLotteryImplementation, upgradeTransaction };
});

export default DLotteryUpgradeModule;