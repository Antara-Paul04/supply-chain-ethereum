import { network } from "hardhat";

async function main() {
  const { ethers } = await network.connect();
  const contract = await ethers.getContractAt("CoffeeBatch", "0x5FbDB2315678afecb367f032d93F642f64180aa3");
  
  try {
    const userInfo = await contract.getUserInfo("0x7ED26257cCf7202Ef9344583B31272469e775B1a");
    console.log("User info:", userInfo);
  } catch (error) {
    console.error("Error getting user info:", error.message);
  }
}

main();