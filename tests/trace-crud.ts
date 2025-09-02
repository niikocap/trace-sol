import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Trace } from "../target/types/trace";
import { expect } from "chai";

describe("trace-crud", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.Trace as Program<Trace>;
  const provider = anchor.getProvider();

  // Test accounts
  let chainActorKeypair: anchor.web3.Keypair;
  let productionSeasonKeypair: anchor.web3.Keypair;
  let milledRiceKeypair: anchor.web3.Keypair;
  let riceBatchKeypair: anchor.web3.Keypair;
  let chainTransactionKeypair: anchor.web3.Keypair;

  beforeEach(() => {
    chainActorKeypair = anchor.web3.Keypair.generate();
    productionSeasonKeypair = anchor.web3.Keypair.generate();
    milledRiceKeypair = anchor.web3.Keypair.generate();
    riceBatchKeypair = anchor.web3.Keypair.generate();
    chainTransactionKeypair = anchor.web3.Keypair.generate();
  });

  describe("ChainActor CRUD", () => {
    it("Creates a chain actor", async () => {
      const name = "Test Farmer";
      const actorType = "farmer";
      const assignedTps = new anchor.BN(1000);
      
      await program.methods
        .createChainActor(
          name,
          actorType,
          null, // farm_id
          null, // farmer_id
          assignedTps,
          { none: {} }, // organization
          null, // province_id
          null, // city_id
          "123 Farm Street" // address
        )
        .accounts({
          chainActor: chainActorKeypair.publicKey,
          user: provider.wallet.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([chainActorKeypair])
        .rpc();

      const chainActorAccount = await program.account.chainActor.fetch(
        chainActorKeypair.publicKey
      );
      
      expect(chainActorAccount.name).to.equal(name);
      expect(chainActorAccount.actorType).to.equal(actorType);
      expect(chainActorAccount.isActive).to.be.true;
      expect(chainActorAccount.balance.toNumber()).to.equal(0);
    });

    it("Updates a chain actor", async () => {
      // First create a chain actor
      await program.methods
        .createChainActor(
          "Test Farmer",
          "farmer",
          null,
          null,
          new anchor.BN(1000),
          { none: {} },
          null,
          null,
          "123 Farm Street"
        )
        .accounts({
          chainActor: chainActorKeypair.publicKey,
          user: provider.wallet.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([chainActorKeypair])
        .rpc();

      // Update the chain actor
      const newName = "Updated Farmer";
      const newBalance = new anchor.BN(500);
      
      await program.methods
        .updateChainActor(
          newName,
          null, // is_active
          newBalance,
          null, // pin
          null, // organization
          "456 New Farm Road" // address
        )
        .accounts({
          chainActor: chainActorKeypair.publicKey,
          user: provider.wallet.publicKey,
        })
        .rpc();

      const updatedAccount = await program.account.chainActor.fetch(
        chainActorKeypair.publicKey
      );
      
      expect(updatedAccount.name).to.equal(newName);
      expect(updatedAccount.balance.toNumber()).to.equal(500);
      expect(updatedAccount.address).to.equal("456 New Farm Road");
    });

    it("Deletes (deactivates) a chain actor", async () => {
      // First create a chain actor
      await program.methods
        .createChainActor(
          "Test Farmer",
          "farmer",
          null,
          null,
          new anchor.BN(1000),
          { none: {} },
          null,
          null,
          "123 Farm Street"
        )
        .accounts({
          chainActor: chainActorKeypair.publicKey,
          user: provider.wallet.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([chainActorKeypair])
        .rpc();

      // Delete the chain actor
      await program.methods
        .deleteChainActor()
        .accounts({
          chainActor: chainActorKeypair.publicKey,
          user: provider.wallet.publicKey,
        })
        .rpc();

      const deletedAccount = await program.account.chainActor.fetch(
        chainActorKeypair.publicKey
      );
      
      expect(deletedAccount.isActive).to.be.false;
    });
  });

  describe("ProductionSeason CRUD", () => {
    it("Creates a production season", async () => {
      const farmerId = new anchor.BN(1);
      const cropYear = "2024";
      
      await program.methods
        .createProductionSeason(
          farmerId,
          cropYear,
          "Jasmine Rice", // variety
          "Organic", // planned_practice
          null, // planting_date
          "Drip irrigation", // irrigation_practice
          "Organic compost", // fertilizer_used
          null // pesticide_used
        )
        .accounts({
          productionSeason: productionSeasonKeypair.publicKey,
          user: provider.wallet.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([productionSeasonKeypair])
        .rpc();

      const seasonAccount = await program.account.productionSeason.fetch(
        productionSeasonKeypair.publicKey
      );
      
      expect(seasonAccount.farmerId.toNumber()).to.equal(1);
      expect(seasonAccount.cropYear).to.equal(cropYear);
      expect(seasonAccount.variety).to.equal("Jasmine Rice");
      expect(seasonAccount.carbonSmartCertified).to.be.false;
    });

    it("Updates a production season", async () => {
      // First create a production season
      await program.methods
        .createProductionSeason(
          new anchor.BN(1),
          "2024",
          "Jasmine Rice",
          "Organic",
          null,
          "Drip irrigation",
          "Organic compost",
          null
        )
        .accounts({
          productionSeason: productionSeasonKeypair.publicKey,
          user: provider.wallet.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([productionSeasonKeypair])
        .rpc();

      // Update the production season
      const processedYield = new anchor.BN(1500);
      const totalYield = new anchor.BN(2000);
      
      await program.methods
        .updateProductionSeason(
          processedYield,
          null, // harvest_date
          totalYield,
          15, // moisture_content
          true, // carbon_smart_certified
          { validated: {} }, // validation_status
          new anchor.BN(2) // validator_id
        )
        .accounts({
          productionSeason: productionSeasonKeypair.publicKey,
          user: provider.wallet.publicKey,
        })
        .rpc();

      const updatedSeason = await program.account.productionSeason.fetch(
        productionSeasonKeypair.publicKey
      );
      
      expect(updatedSeason.processedYieldKg.toNumber()).to.equal(1500);
      expect(updatedSeason.totalYieldKg.toNumber()).to.equal(2000);
      expect(updatedSeason.carbonSmartCertified).to.be.true;
    });
  });

  describe("MilledRice CRUD", () => {
    it("Creates milled rice", async () => {
      const farmerId = new anchor.BN(1);
      const totalWeightKg = "1000";
      const millingType = "White Rice";
      const quality = "Premium";
      const moisture = 14;
      const processedWeight = 800;
      
      await program.methods
        .createMilledRice(
          farmerId,
          totalWeightKg,
          millingType,
          quality,
          moisture,
          processedWeight
        )
        .accounts({
          milledRice: milledRiceKeypair.publicKey,
          user: provider.wallet.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([milledRiceKeypair])
        .rpc();

      const milledRiceAccount = await program.account.milledRice.fetch(
        milledRiceKeypair.publicKey
      );
      
      expect(milledRiceAccount.farmerId.toNumber()).to.equal(1);
      expect(milledRiceAccount.totalWeightKg).to.equal(totalWeightKg);
      expect(milledRiceAccount.millingType).to.equal(millingType);
      expect(milledRiceAccount.quality).to.equal(quality);
      expect(milledRiceAccount.moisture).to.equal(moisture);
    });

    it("Updates milled rice", async () => {
      // First create milled rice
      await program.methods
        .createMilledRice(
          new anchor.BN(1),
          "1000",
          "White Rice",
          "Premium",
          14,
          800
        )
        .accounts({
          milledRice: milledRiceKeypair.publicKey,
          user: provider.wallet.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([milledRiceKeypair])
        .rpc();

      // Update the milled rice
      await program.methods
        .updateMilledRice(
          "Super Premium", // quality
          13, // moisture
          "https://example.com/photo.jpg" // photo_url
        )
        .accounts({
          milledRice: milledRiceKeypair.publicKey,
          user: provider.wallet.publicKey,
        })
        .rpc();

      const updatedMilledRice = await program.account.milledRice.fetch(
        milledRiceKeypair.publicKey
      );
      
      expect(updatedMilledRice.quality).to.equal("Super Premium");
      expect(updatedMilledRice.moisture).to.equal(13);
      expect(updatedMilledRice.photoUrl).to.equal("https://example.com/photo.jpg");
    });
  });

  describe("RiceBatch CRUD", () => {
    it("Creates a rice batch", async () => {
      const qrCode = "QR123456789";
      const batchWeight = new anchor.BN(50);
      const seasonId = new anchor.BN(1);
      
      await program.methods
        .createRiceBatch(
          qrCode,
          null, // milling_id
          batchWeight,
          14, // moisture_content
          seasonId,
          new anchor.BN(1), // current_holder_id
          new anchor.BN(25), // price_per_kg
          null, // drying_id
          null // validator
        )
        .accounts({
          riceBatch: riceBatchKeypair.publicKey,
          user: provider.wallet.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([riceBatchKeypair])
        .rpc();

      const riceBatchAccount = await program.account.riceBatch.fetch(
        riceBatchKeypair.publicKey
      );
      
      expect(riceBatchAccount.qrCode).to.equal(qrCode);
      expect(riceBatchAccount.batchWeightKg.toNumber()).to.equal(50);
      expect(riceBatchAccount.seasonId.toNumber()).to.equal(1);
    });

    it("Updates a rice batch", async () => {
      // First create a rice batch
      await program.methods
        .createRiceBatch(
          "QR123456789",
          null,
          new anchor.BN(50),
          14,
          new anchor.BN(1),
          new anchor.BN(1),
          new anchor.BN(25),
          null,
          null
        )
        .accounts({
          riceBatch: riceBatchKeypair.publicKey,
          user: provider.wallet.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([riceBatchKeypair])
        .rpc();

      // Update the rice batch
      await program.methods
        .updateRiceBatch(
          new anchor.BN(2), // current_holder_id
          new anchor.BN(30), // price_per_kg
          { stock: {} } // status
        )
        .accounts({
          riceBatch: riceBatchKeypair.publicKey,
          user: provider.wallet.publicKey,
        })
        .rpc();

      const updatedBatch = await program.account.riceBatch.fetch(
        riceBatchKeypair.publicKey
      );
      
      expect(updatedBatch.currentHolderId.toNumber()).to.equal(2);
      expect(updatedBatch.pricePerKg.toNumber()).to.equal(30);
    });
  });

  describe("ChainTransaction CRUD", () => {
    it("Creates a chain transaction", async () => {
      const batchIds = [new anchor.BN(1), new anchor.BN(2)];
      const toActorId = new anchor.BN(2);
      
      await program.methods
        .createChainTransaction(
          batchIds,
          new anchor.BN(1), // from_actor_id
          toActorId,
          new anchor.BN(25), // price_per_kg
          14, // moisture
          "Premium", // quality
          { cash: {} }, // payment_method
          "{\"lat\": 14.5995, \"lng\": 120.9842}" // geotagging
        )
        .accounts({
          chainTransaction: chainTransactionKeypair.publicKey,
          user: provider.wallet.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([chainTransactionKeypair])
        .rpc();

      const transactionAccount = await program.account.chainTransaction.fetch(
        chainTransactionKeypair.publicKey
      );
      
      expect(transactionAccount.batchIds.length).to.equal(2);
      expect(transactionAccount.toActorId.toNumber()).to.equal(2);
      expect(transactionAccount.quality).to.equal("Premium");
    });

    it("Updates a chain transaction", async () => {
      // First create a chain transaction
      await program.methods
        .createChainTransaction(
          [new anchor.BN(1)],
          new anchor.BN(1),
          new anchor.BN(2),
          new anchor.BN(25),
          14,
          "Premium",
          { cash: {} },
          "{\"lat\": 14.5995, \"lng\": 120.9842}"
        )
        .accounts({
          chainTransaction: chainTransactionKeypair.publicKey,
          user: provider.wallet.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([chainTransactionKeypair])
        .rpc();

      // Update the transaction
      await program.methods
        .updateChainTransaction(
          { completed: {} }, // status
          "TXN123456" // payment_reference
        )
        .accounts({
          chainTransaction: chainTransactionKeypair.publicKey,
          user: provider.wallet.publicKey,
        })
        .rpc();

      const updatedTransaction = await program.account.chainTransaction.fetch(
        chainTransactionKeypair.publicKey
      );
      
      expect(updatedTransaction.paymentReference).to.equal("TXN123456");
    });
  });
});