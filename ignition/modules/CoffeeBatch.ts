import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("CoffeeBatchModule", (m) => {
  const coffeeBatch = m.contract("CoffeeBatch");

  return { coffeeBatch };
});
