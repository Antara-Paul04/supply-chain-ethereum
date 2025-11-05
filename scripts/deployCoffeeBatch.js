import { network } from "hardhat";

async function main() {
  console.log("Deploying CoffeeBatch contract...");
  
  const { ethers } = await network.connect();
  const CoffeeBatch = await ethers.getContractFactory("CoffeeBatch");
  const coffeeBatch = await CoffeeBatch.deploy();
  
  console.log("CoffeeBatch deployed to:", coffeeBatch.target);
  
  // Save deployment info
  const deploymentInfo = {
    address: coffeeBatch.target,
    network: network.name,
    deployedAt: new Date().toISOString()
  };
  
  console.log("Deployment info:", deploymentInfo);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});