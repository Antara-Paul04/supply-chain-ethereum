import { expect } from "chai";
import { network } from "hardhat";

const { ethers } = await network.connect();

describe("CoffeeBatch Contract - Complete UX Flow", function () {
  let coffeeBatch;
  let admin, farmer, roaster, consumer;

  beforeEach(async function () {
    [admin, farmer, roaster, consumer] = await ethers.getSigners();
    
    coffeeBatch = await ethers.deployContract("CoffeeBatch");
    await coffeeBatch.waitForDeployment();
  });

  describe("User Registration Flow", function () {
    it("should register farmer with email login simulation", async function () {
      await coffeeBatch.registerUser(
        farmer.address,
        0, // UserRole.Farmer
        "José Martinez",
        "jose@sunrisefarm.gt",
        "Huehuetenango, Guatemala"
      );

      const userInfo = await coffeeBatch.getUserInfo(farmer.address);
      expect(userInfo.role).to.equal(0);
      expect(userInfo.name).to.equal("José Martinez");
      expect(userInfo.email).to.equal("jose@sunrisefarm.gt");
      expect(userInfo.isRegistered).to.be.true;
    });

    it("should register roaster with company account", async function () {
      await coffeeBatch.registerUser(
        roaster.address,
        1, // UserRole.Roaster
        "Blue Mountain Roasters",
        "ops@bluemountain.com",
        "Kingston, Jamaica"
      );

      const userInfo = await coffeeBatch.getUserInfo(roaster.address);
      expect(userInfo.role).to.equal(1);
      expect(userInfo.name).to.equal("Blue Mountain Roasters");
    });
  });

  describe("Farmer Dashboard Flow", function () {
    beforeEach(async function () {
      await coffeeBatch.registerUser(
        farmer.address,
        0,
        "José Martinez",
        "jose@sunrisefarm.gt",
        "Huehuetenango, Guatemala"
      );
    });

    it("should create coffee batch from farmer dashboard", async function () {
      await coffeeBatch.connect(farmer).createBatch(
        "Sunrise Coffee Farm",
        "Huehuetenango, Guatemala", 
        "Arabica - Bourbon",
        100
      );

      const batch = await coffeeBatch.getBatch(0);
      expect(batch.farmName).to.equal("Sunrise Coffee Farm");
      expect(batch.farmLocation).to.equal("Huehuetenango, Guatemala");
      expect(batch.coffeeVariety).to.equal("Arabica - Bourbon");
      expect(batch.quantity).to.equal(100n);
      expect(batch.farmer).to.equal(farmer.address);
      expect(batch.state).to.equal(0); // Harvested
    });

    it("should ship batch to roaster", async function () {
      await coffeeBatch.connect(farmer).createBatch(
        "Sunrise Coffee Farm",
        "Huehuetenango, Guatemala",
        "Arabica - Bourbon", 
        100
      );

      await coffeeBatch.connect(farmer).shipBatch(0);
      
      const batch = await coffeeBatch.getBatch(0);
      expect(batch.state).to.equal(1); // Shipped
    });

    it("should prevent non-farmer from creating batches", async function () {
      // Register consumer as non-farmer role first
      await coffeeBatch.registerUser(consumer.address, 1, "Consumer", "consumer@test.com", "Test Location"); // Roaster role
      
      await expect(
        coffeeBatch.connect(consumer).createBatch(
          "Fake Farm",
          "Nowhere", 
          "Fake Coffee",
          50
        )
      ).to.be.revertedWith("Only farmer or admin");
    });
  });

  describe("Roaster Dashboard Flow", function () {
    beforeEach(async function () {
      // Register users
      await coffeeBatch.registerUser(farmer.address, 0, "José Martinez", "jose@farm.gt", "Huehuetenango, Guatemala");
      await coffeeBatch.registerUser(roaster.address, 1, "Blue Mountain Roasters", "ops@bluemountain.com", "Kingston, Jamaica");
      
      // Create and ship a batch
      await coffeeBatch.connect(farmer).createBatch(
        "Sunrise Coffee Farm",
        "Huehuetenango, Guatemala",
        "Arabica - Bourbon",
        100
      );
      await coffeeBatch.connect(farmer).shipBatch(0);
    });

    it("should roast batch with profile data", async function () {
      await coffeeBatch.connect(roaster).roastBatch(
        0,
        "Blue Mountain Roasters",
        "Medium Roast - City+"
      );

      const batch = await coffeeBatch.getBatch(0);
      expect(batch.state).to.equal(2); // Roasted
      expect(batch.roasterName).to.equal("Blue Mountain Roasters");
      expect(batch.roastProfile).to.equal("Medium Roast - City+");
      expect(batch.roastDate).to.be.greaterThan(0);
    });

    it("should package batch with QR code generation", async function () {
      await coffeeBatch.connect(roaster).roastBatch(
        0,
        "Blue Mountain Roasters", 
        "Medium Roast - City+"
      );

      const qrCode = "QR_BATCH_0_2024";
      await coffeeBatch.connect(roaster).packageBatch(0, qrCode);

      const batch = await coffeeBatch.getBatch(0);
      expect(batch.state).to.equal(3); // Packaged
      expect(batch.qrCode).to.equal(qrCode);
    });

    it("should prevent roaster from roasting unshipped batches", async function () {
      await coffeeBatch.connect(farmer).createBatch(
        "Another Farm",
        "Colombia",
        "Typica",
        75
      );

      await expect(
        coffeeBatch.connect(roaster).roastBatch(
          1,
          "Blue Mountain Roasters",
          "Dark Roast"
        )
      ).to.be.revertedWith("Invalid state transition");
    });
  });

  describe("Consumer Verification Flow", function () {
    beforeEach(async function () {
      // Complete full supply chain flow
      await coffeeBatch.registerUser(farmer.address, 0, "José Martinez", "jose@farm.gt", "Huehuetenango, Guatemala");
      await coffeeBatch.registerUser(roaster.address, 1, "Blue Mountain Roasters", "ops@bluemountain.com", "Kingston, Jamaica");
      
      await coffeeBatch.connect(farmer).createBatch(
        "Sunrise Coffee Farm",
        "Huehuetenango, Guatemala",
        "Arabica - Bourbon",
        100
      );
      await coffeeBatch.connect(farmer).shipBatch(0);
      await coffeeBatch.connect(roaster).roastBatch(0, "Blue Mountain Roasters", "Medium Roast");
      await coffeeBatch.connect(roaster).packageBatch(0, "QR_BATCH_0_FINAL");
    });

    it("should verify coffee by QR code scan", async function () {
      const batchData = await coffeeBatch.getBatchByQR("QR_BATCH_0_FINAL");
      
      expect(batchData.farmName).to.equal("Sunrise Coffee Farm");
      expect(batchData.farmLocation).to.equal("Huehuetenango, Guatemala");
      expect(batchData.coffeeVariety).to.equal("Arabica - Bourbon");
      expect(batchData.roasterName).to.equal("Blue Mountain Roasters");
      expect(batchData.roastProfile).to.equal("Medium Roast");
      expect(batchData.state).to.equal(3); // Packaged
    });

    it("should verify coffee by batch ID lookup", async function () {
      const batch = await coffeeBatch.getBatch(0);
      
      expect(batch.farmName).to.equal("Sunrise Coffee Farm");
      expect(batch.state).to.equal(3); // Packaged
      expect(batch.qrCode).to.equal("QR_BATCH_0_FINAL");
    });

    it("should reject invalid QR codes", async function () {
      await expect(
        coffeeBatch.getBatchByQR("INVALID_QR_CODE")  
      ).to.be.revertedWith("Invalid QR code");
    });
  });

  describe("Role-Based Access Control", function () {
    beforeEach(async function () {
      await coffeeBatch.registerUser(farmer.address, 0, "José Martinez", "jose@farm.gt", "Huehuetenango, Guatemala");
      await coffeeBatch.registerUser(roaster.address, 1, "Blue Mountain Roasters", "ops@bluemountain.com", "Kingston, Jamaica");
    });

    it("should enforce farmer-only batch creation", async function () {
      await expect(
        coffeeBatch.connect(roaster).createBatch("Fake Farm", "Nowhere", "Fake", 50)
      ).to.be.revertedWith("Only farmer or admin");
    });

    it("should enforce roaster-only roasting operations", async function () {
      await coffeeBatch.connect(farmer).createBatch("Farm", "Location", "Variety", 100);
      await coffeeBatch.connect(farmer).shipBatch(0);

      await expect(
        coffeeBatch.connect(farmer).roastBatch(0, "Roaster", "Profile")
      ).to.be.revertedWith("Unauthorized role");
    });

    it("should enforce proper state transitions", async function () {
      await coffeeBatch.connect(farmer).createBatch("Farm", "Location", "Variety", 100);
      
      // Can't roast before shipping
      await expect(
        coffeeBatch.connect(roaster).roastBatch(0, "Roaster", "Profile")
      ).to.be.revertedWith("Invalid state transition");
    });
  });

  describe("Complete Supply Chain Journey", function () {
    it("should complete full coffee journey from farm to consumer", async function () {
      // 1. Register stakeholders (simulating email signup)
      await coffeeBatch.registerUser(farmer.address, 0, "María González", "maria@fincaelparaiso.gt", "Antigua, Guatemala");
      await coffeeBatch.registerUser(roaster.address, 1, "Artisan Coffee Co.", "hello@artisancoffee.com", "Seattle, USA");

      // 2. Farmer creates batch (from farmer dashboard)
      await coffeeBatch.connect(farmer).createBatch(
        "Finca El Paraíso",
        "Antigua, Guatemala",
        "Arabica - Geisha",
        50
      );

      let batch = await coffeeBatch.getBatch(0);
      expect(batch.state).to.equal(0); // Harvested
      expect(batch.farmName).to.equal("Finca El Paraíso");

      // 3. Farmer ships to roaster
      await coffeeBatch.connect(farmer).shipBatch(0);
      batch = await coffeeBatch.getBatch(0);
      expect(batch.state).to.equal(1); // Shipped

      // 4. Roaster processes coffee (from roaster dashboard)
      await coffeeBatch.connect(roaster).roastBatch(
        0,
        "Artisan Coffee Co.",
        "Light Roast - Floral Notes"
      );
      batch = await coffeeBatch.getBatch(0);
      expect(batch.state).to.equal(2); // Roasted

      // 5. Roaster packages with QR code
      const qrCode = "ARTISAN_GEISHA_BATCH_0_2024";
      await coffeeBatch.connect(roaster).packageBatch(0, qrCode);
      
      batch = await coffeeBatch.getBatch(0);
      expect(batch.state).to.equal(3); // Packaged
      expect(batch.qrCode).to.equal(qrCode);

      // 6. Consumer verifies via QR scan (no wallet needed)
      const verifiedBatch = await coffeeBatch.getBatchByQR(qrCode);
      expect(verifiedBatch.farmName).to.equal("Finca El Paraíso");
      expect(verifiedBatch.roasterName).to.equal("Artisan Coffee Co.");
      expect(verifiedBatch.roastProfile).to.equal("Light Roast - Floral Notes");
    });
  });
});