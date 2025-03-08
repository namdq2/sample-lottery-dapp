import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const DLotteryModule = buildModule("DLotteryModule", (m) => {
  const owner = m.getParameter("owner", "address");

  // Deploy implementation contract
  const dLotteryImplementation = m.contract("DLottery");

  // Deploy proxy admin
  const proxyAdmin = m.contract("@openzeppelin/contracts/proxy/transparent/ProxyAdmin", []);

  // Deploy proxy with implementation
  const proxy = m.contract(
    "@openzeppelin/contracts/proxy/transparent/TransparentUpgradeableProxy",
    [
      dLotteryImplementation,
      proxyAdmin,
      m.calldata("DLottery", "initialize", [owner]),
    ]
  );

  // Return the proxy address which now points to the implementation
  return { proxy, dLotteryImplementation, proxyAdmin };
});

export default DLotteryModule;