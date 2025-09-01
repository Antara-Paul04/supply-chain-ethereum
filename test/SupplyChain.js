import { expect } from "chai";
import { network } from "hardhat";

const { ethers } = await network.connect();

describe("SupplyChain", function () {
  it("should add a product and manage ownership", async function () {
    const [owner, newOwner] = await ethers.getSigners();

    const supplyChain = await ethers.deployContract("SupplyChain");
    await supplyChain.waitForDeployment();

    // Add product
    await supplyChain.addProduct("Laptop");
    let product = await supplyChain.getProduct(0);
    expect(product[1]).to.equal("Laptop"); // name
    expect(product[2]).to.equal(owner.address); // owner
    expect(product[0]).to.equal(0n); // id

    // Check nextId incremented
    expect(await supplyChain.nextId()).to.equal(1n);

    // Transfer ownership
    await supplyChain.transferOwnership(0, newOwner.address);
    product = await supplyChain.getProduct(0);
    expect(product[2]).to.equal(newOwner.address); // new owner

    // Test ownership validation (should fail when non-owner tries to transfer)
    await expect(
      supplyChain.connect(owner).transferOwnership(0, owner.address)
    ).to.be.revertedWith("Not product owner");
  });

  it("should add multiple products with correct IDs", async function () {
    const supplyChain = await ethers.deployContract("SupplyChain");
    await supplyChain.waitForDeployment();

    // Add first product
    await supplyChain.addProduct("Product 1");
    let product1 = await supplyChain.getProduct(0);
    expect(product1[1]).to.equal("Product 1");
    expect(product1[0]).to.equal(0n);

    // Add second product
    await supplyChain.addProduct("Product 2");
    let product2 = await supplyChain.getProduct(1);
    expect(product2[1]).to.equal("Product 2");
    expect(product2[0]).to.equal(1n);

    // Verify nextId
    expect(await supplyChain.nextId()).to.equal(2n);
  });
});
