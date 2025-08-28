const { expect } = require("chai");

describe("SupplyChain", function () {
  it("should create, ship, and deliver an item", async function () {
    const [owner] = await ethers.getSigners();

    const SupplyChain = await ethers.getContractFactory("SupplyChain");
    const supplyChain = await SupplyChain.deploy();
    await supplyChain.waitForDeployment();

    // Create item
    await supplyChain.createItem("Laptop");
    let item = await supplyChain.items(0);
    expect(item.name).to.equal("Laptop");
    expect(item.state).to.equal(0); // Created

    // Ship item
    await supplyChain.shipItem(0);
    item = await supplyChain.items(0);
    expect(item.state).to.equal(1); // Shipped

    // Deliver item
    await supplyChain.deliverItem(0);
    item = await supplyChain.items(0);
    expect(item.state).to.equal(2); // Delivered
  });
});
