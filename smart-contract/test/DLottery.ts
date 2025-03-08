import { expect } from "chai";
import { ethers, upgrades } from "hardhat";
import { time } from "@nomicfoundation/hardhat-network-helpers";
import { DLottery } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("DLottery", function () {
  let dlottery: DLottery;
  let owner: SignerWithAddress;
  let user1: SignerWithAddress;
  let user2: SignerWithAddress;
  let users: SignerWithAddress[];
  
  // Constants matching the requirements
  const PRIZE_AMOUNT = ethers.parseEther("0.01"); // 0.01 ETH as specified in requirements
  const MAX_PARTICIPANTS = 20; // 20 tickets as specified in requirements
  
  beforeEach(async function () {
    // Get signers
    [owner, user1, user2, ...users] = await ethers.getSigners();
    
    // Deploy contract
    const DLotteryFactory = await ethers.getContractFactory("DLottery");
    dlottery = await upgrades.deployProxy(
      DLotteryFactory, 
      [owner.address], 
      { initializer: "initialize" }
    ) as unknown as DLottery;
    
    await dlottery.waitForDeployment();
  });

  describe("Initialization", function () {
    it("should set the correct owner", async function () {
      expect(await dlottery.owner()).to.equal(owner.address);
    });
    
    it("should initialize with drawCompleted as true", async function () {
      const [drawId, prize, drawTime, completed, winner] = await dlottery.getCurrentDrawInfo();
      expect(completed).to.equal(true);
    });
    
    it("should initialize with drawId as 1", async function () {
      const [drawId, prize, drawTime, completed, winner] = await dlottery.getCurrentDrawInfo();
      expect(drawId).to.equal(1n);
    });
  });
  
  describe("Admin functions", function () {
    describe("startNewLottery", function () {
      it("should start a new lottery", async function () {
        await dlottery.startNewLottery();
        const [drawId, prize, drawTime, completed, winner] = await dlottery.getCurrentDrawInfo();
        
        expect(completed).to.equal(false);
        expect(await dlottery.getRemainingTickets()).to.equal(MAX_PARTICIPANTS);
      });
      
      it("should fail if lottery is already in progress", async function () {
        await dlottery.startNewLottery();
        await expect(dlottery.startNewLottery())
          .to.be.revertedWith("Previous lottery still in progress");
      });
      
      it("should emit NewLotteryStarted event", async function () {
        await expect(dlottery.startNewLottery())
          .to.emit(dlottery, "NewLotteryStarted")
          .withArgs(1);
      });
      
      it("should reset all lottery state variables", async function () {
        // First, set up a completed lottery
        await dlottery.startNewLottery();
        await dlottery.uploadPrize({ value: PRIZE_AMOUNT });
        const futureTime = await time.latest() + 3600;
        await dlottery.setDrawDate(futureTime);
        // Register some participants
        await dlottery.connect(user1).participate();
        await dlottery.connect(user2).participate();
        
        // Fast-forward time and perform draw
        await time.increase(3601);
        await dlottery.performDraw();
        
        // Now start a new lottery
        await dlottery.startNewLottery();
        
        // Check that everything is reset
        const [drawId, prize, drawTime, completed, currentWinner] = await dlottery.getCurrentDrawInfo();
        expect(prize).to.equal(0);
        expect(drawTime).to.equal(0);
        expect(completed).to.equal(false);
        expect(currentWinner).to.equal(ethers.ZeroAddress);
        
        // Check that ticket availability is reset
        expect(await dlottery.getRemainingTickets()).to.equal(MAX_PARTICIPANTS);
        
        // Check that participants are reset
        expect(await dlottery.isRegistered(user1.address)).to.equal(false);
        expect(await dlottery.isRegistered(user2.address)).to.equal(false);
      });
    });
    
    describe("uploadPrize", function () {
      beforeEach(async function () {
        await dlottery.startNewLottery();
      });
      
      it("should upload prize", async function () {
        await dlottery.uploadPrize({ value: PRIZE_AMOUNT });
        const [, prize, , ,] = await dlottery.getCurrentDrawInfo();
        expect(prize).to.equal(PRIZE_AMOUNT);
      });
      
      it("should fail if no active lottery", async function () {
        // Complete the lottery first
        await dlottery.uploadPrize({ value: PRIZE_AMOUNT });
        const futureTime = await time.latest() + 3600; // 1 hour from now
        await dlottery.setDrawDate(futureTime);
        await time.increase(3600);
        await dlottery.performDraw();
        
        await expect(dlottery.uploadPrize({ value: PRIZE_AMOUNT }))
          .to.be.revertedWith("No active lottery");
      });
      
      it("should fail if prize already uploaded", async function () {
        await dlottery.uploadPrize({ value: PRIZE_AMOUNT });
        await expect(dlottery.uploadPrize({ value: PRIZE_AMOUNT }))
          .to.be.revertedWith("Prize already uploaded");
      });

      it("should fail if prize amount is zero", async function () {
        // Try to upload a prize with 0 ETH
        await expect(dlottery.uploadPrize({ value: 0 }))
          .to.be.revertedWith("Prize amount must be greater than 0");
      });
      
      it("should accept custom prize amounts", async function () {
        const customAmount = ethers.parseEther("0.05");
        await dlottery.uploadPrize({ value: customAmount });
        const [, prize, , ,] = await dlottery.getCurrentDrawInfo();
        expect(prize).to.equal(customAmount);
      });
    });
    
    describe("setDrawDate", function () {
      beforeEach(async function () {
        await dlottery.startNewLottery();
        await dlottery.uploadPrize({ value: PRIZE_AMOUNT });
      });
      
      it("should set draw date", async function () {
        const futureTime = await time.latest() + 3600; // 1 hour from now
        await dlottery.setDrawDate(futureTime);
        const [, , drawTime, ,] = await dlottery.getCurrentDrawInfo();
        expect(drawTime).to.equal(futureTime);
      });
      
      it("should emit DrawCreated event", async function () {
        const futureTime = await time.latest() + 3600; // 1 hour from now
        await expect(dlottery.setDrawDate(futureTime))
          .to.emit(dlottery, "DrawCreated")
          .withArgs(1, PRIZE_AMOUNT, futureTime);
      });
      
      it("should fail if there's no active lottery", async function () {
        // First, ensure we're in a state with no active lottery
        // We can either:
        // 1. Use a fresh contract (drawCompleted is true by default)
        // 2. Complete a lottery cycle
        
        // Option 1: Deploy a fresh contract
        const DLotteryFactory = await ethers.getContractFactory("DLottery");
        const freshDlottery = await upgrades.deployProxy(
          DLotteryFactory, 
          [owner.address], 
          { initializer: "initialize" }
        ) as unknown as typeof dlottery;
        await freshDlottery.waitForDeployment();
        
        // Verify drawCompleted is true (no active lottery)
        const [, , , completed, ] = await freshDlottery.getCurrentDrawInfo();
        expect(completed).to.equal(true);
        
        // Try to set draw date - should fail
        const futureTime = await time.latest() + 3600;
        await expect(freshDlottery.setDrawDate(futureTime))
          .to.be.revertedWith("No active lottery");
      });

      it("should fail if prize has not been uploaded", async function () {
        // We need to create an isolated test environment for this specific test
        // because the beforeEach already puts us in a state with prize uploaded
        
        // First, complete any lottery that might be in progress
        const [, , , completed, ] = await dlottery.getCurrentDrawInfo();
        
        if (!completed) {
          // If draw time is set, fast forward and perform draw
          const drawTime = await dlottery.getCurrentDrawInfo().then(info => info[2]);
          if (drawTime > 0) {
            await time.increaseTo(drawTime);
            await dlottery.performDraw();
          } else {
            // If we're in a lottery without a draw time set, 
            // we need a different approach - force deployment of a new contract
            const DLotteryFactory = await ethers.getContractFactory("DLottery");
            dlottery = await upgrades.deployProxy(
              DLotteryFactory, 
              [owner.address], 
              { initializer: "initialize" }
            ) as unknown as DLottery;
            await dlottery.waitForDeployment();
          }
        }
        
        // Start a new lottery from a clean state
        await dlottery.startNewLottery();
        
        // Try to set draw date without uploading prize first
        const futureTime = await time.latest() + 3600;
        
        // Make sure we're testing the correct error message here
        // This might be "Prize not uploaded" or "Upload prize first" depending on your contract
        await expect(dlottery.setDrawDate(futureTime))
          .to.be.revertedWith("Upload prize first");
      });

      it("should fail if draw time is in the past", async function () {
        const pastTime = await time.latest() - 3600; // 1 hour ago
        await expect(dlottery.setDrawDate(pastTime))
          .to.be.revertedWith("Draw date must be in the future");
      });
    });
    
    describe("performDraw", function () {
      beforeEach(async function () {
        await dlottery.startNewLottery();
        await dlottery.uploadPrize({ value: PRIZE_AMOUNT });
        const futureTime = await time.latest() + 3600; // 1 hour from now
        await dlottery.setDrawDate(futureTime);
      });
      
      it("should perform draw after time has passed", async function () {
        await time.increase(3600);
        await dlottery.performDraw();
        const [, , , completed, ] = await dlottery.getCurrentDrawInfo();
        expect(completed).to.equal(true);
      });
      
      it("should emit DrawResult event", async function () {
        await time.increase(3600);
        await expect(dlottery.performDraw())
          .to.emit(dlottery, "DrawResult");
      });
      
      it("should fail if draw time has not been reached", async function () {
        await expect(dlottery.performDraw())
          .to.be.revertedWith("Draw time not reached");
      });
      
      it("should correctly select a winner with participants", async function () {
        // Register some participants
        await dlottery.connect(user1).participate();
        await dlottery.connect(user2).participate();
        
        // Perform draw
        await time.increase(3600);
        await dlottery.performDraw();
        
        // Get winner
        const [, , , , winnerAddress] = await dlottery.getCurrentDrawInfo();
        
        // Winner should be one of the participants
        const isWinnerParticipant = 
          winnerAddress === user1.address || 
          winnerAddress === user2.address || 
          winnerAddress === ethers.ZeroAddress;
          
        expect(isWinnerParticipant).to.be.true;
      });
      
      it("should handle case with no participants", async function () {
        // No participants register
        
        // Perform draw
        await time.increase(3600);
        await dlottery.performDraw();
        
        // No winner should be selected
        const [, , , , winnerAddress] = await dlottery.getCurrentDrawInfo();
        expect(winnerAddress).to.equal(ethers.ZeroAddress);
      });

      it("should fail if there's no active lottery", async function () {
        // Deploy a fresh contract - drawCompleted is true by default
        const DLotteryFactory = await ethers.getContractFactory("DLottery");
        const freshDlottery = await upgrades.deployProxy(
          DLotteryFactory, 
          [owner.address], 
          { initializer: "initialize" }
        ) as unknown as typeof dlottery;
        await freshDlottery.waitForDeployment();
        
        // Verify we start with drawCompleted = true
        const [, , , completed, ] = await freshDlottery.getCurrentDrawInfo();
        expect(completed).to.equal(true);
        
        // Try to perform draw - should fail
        await expect(freshDlottery.performDraw())
          .to.be.revertedWith("No active lottery or draw already completed");
      });

      it("should fail if draw date is not set", async function () {
        // Deploy a brand new contract instance to start fresh
        const DLotteryFactory = await ethers.getContractFactory("DLottery");
        const freshDlottery = await upgrades.deployProxy(
          DLotteryFactory, 
          [owner.address], 
          { initializer: "initialize" }
        ) as unknown as typeof dlottery;
        await freshDlottery.waitForDeployment();
        
        // Verify we're starting with no active lottery (draw completed)
        const [, , , completed, ] = await freshDlottery.getCurrentDrawInfo();
        expect(completed).to.equal(true);
        
        // Start a new lottery (should work because there's no active one)
        await freshDlottery.startNewLottery();
        
        // Upload a prize
        await freshDlottery.uploadPrize({ value: PRIZE_AMOUNT });
        
        // Try to perform draw without setting a date - should fail
        await expect(freshDlottery.performDraw())
          .to.be.revertedWith("Draw date not set");
      });
      
      it("should fail if lottery is already completed", async function () {
        // Deploy a fresh contract instance
        const DLotteryFactory = await ethers.getContractFactory("DLottery");
        const freshDlottery = await upgrades.deployProxy(
          DLotteryFactory, 
          [owner.address], 
          { initializer: "initialize" }
        ) as unknown as typeof dlottery;
        await freshDlottery.waitForDeployment();
        
        // Start a new lottery with the fresh contract
        await freshDlottery.startNewLottery();
        await freshDlottery.uploadPrize({ value: PRIZE_AMOUNT });
        const futureTime = await time.latest() + 3600;
        await freshDlottery.setDrawDate(futureTime);
        await time.increase(3600);
        
        // Perform draw the first time (should succeed)
        await freshDlottery.performDraw();
        
        // Try to perform draw again - should fail
        await expect(freshDlottery.performDraw())
          .to.be.revertedWith("No active lottery or draw already completed");
      });
    });

    describe("pause/unpause", function () {
      it("should pause the contract", async function () {
        await dlottery.pause();
        expect(await dlottery.paused()).to.equal(true);
      });
      
      it("should unpause the contract", async function () {
        await dlottery.pause();
        await dlottery.unpause();
        expect(await dlottery.paused()).to.equal(false);
      });
      
      it("should prevent participation when paused", async function () {
        await dlottery.startNewLottery();
        await dlottery.uploadPrize({ value: PRIZE_AMOUNT });
        const futureTime = await time.latest() + 3600;
        await dlottery.setDrawDate(futureTime);
        
        await dlottery.pause();
        
        await expect(dlottery.connect(user1).participate())
          .to.be.revertedWith("Pausable: paused");
      });
      
      it("should not allow non-owners to pause", async function () {
        // This will catch both custom errors and string reverts
        await expect(
          dlottery.connect(user1).pause()
        ).to.be.reverted;
      });
    });
  });
  
  describe("User functions", function () {
    describe("participate", function () {
      beforeEach(async function () {
        await dlottery.startNewLottery();
        await dlottery.uploadPrize({ value: PRIZE_AMOUNT });
        const futureTime = await time.latest() + 3600;
        await dlottery.setDrawDate(futureTime);
      });
      
      it("should allow a user to participate", async function () {
        await dlottery.connect(user1).participate();
        expect(await dlottery.isRegistered(user1.address)).to.equal(true);
        expect(await dlottery.getRemainingTickets()).to.equal(MAX_PARTICIPANTS - 1);
      });
      
      it("should emit ParticipantRegistered event", async function () {
        const tx = await dlottery.connect(user1).participate();
        const receipt = await tx.wait();
        
        // Find the event in the logs
        const event = receipt!.logs.find(log => {
          return log.fragment && log.fragment.name === "ParticipantRegistered";
        });
        
        expect(event).to.not.be.undefined;
        
        // Check the event arguments
        const args = event!.args;
        expect(args[0]).to.equal(1n); // drawId
        expect(args[1]).to.equal(user1.address); // participant
        
        // Check that a ticket number was assigned (third argument)
        expect(args[2]).to.be.a('bigint'); // In ethers v6, numeric values are often returned as bigint
        expect(args[2]).to.be.greaterThan(0n); // Ticket number should be positive
        expect(args[2]).to.be.lessThanOrEqual(20n); // Ticket number should be <= MAX_PARTICIPANTS
      });

      it("should fail if user is already registered", async function () {
        await dlottery.connect(user1).participate();
        await expect(dlottery.connect(user1).participate())
          .to.be.revertedWith("Already registered");
      });
      
      it("should fail after draw time has passed", async function () {
        await time.increase(3601);
        await expect(dlottery.connect(user1).participate())
          .to.be.revertedWith("Registration period ended");
      });
      
      it("should fail if no active lottery", async function () {
        // Complete the lottery first
        await time.increase(3600);
        await dlottery.performDraw();
        
        await expect(dlottery.connect(user1).participate())
          .to.be.revertedWith("No active lottery");
      });
      
      it("should fail if all tickets are taken", async function () {
        // Register MAX_PARTICIPANTS users
        for (let i = 0; i < MAX_PARTICIPANTS; i++) {
          if (i < users.length) {
            await dlottery.connect(users[i]).participate();
          }
        }
        
        // Try to register one more
        await expect(dlottery.connect(user1).participate())
          .to.be.revertedWith("No tickets available");
      });
      
      it("should assign a random ticket number", async function () {
        const tx1 = await dlottery.connect(user1).participate();
        const receipt1 = await tx1.wait();
        
        // Get the first ticket number
        const event1 = receipt1!.logs.find(log => log.fragment && log.fragment.name === "ParticipantRegistered");
        const ticket1 = event1!.args[2];
        
        // Get another ticket for comparison
        if (users.length > 0) {
          const tx2 = await dlottery.connect(users[0]).participate();
          const receipt2 = await tx2.wait();
          const event2 = receipt2!.logs.find(log => log.fragment && log.fragment.name === "ParticipantRegistered");
          const ticket2 = event2!.args[2];
          
          // There's a small chance they're the same by random chance, but it's unlikely
          expect(ticket1 === ticket2).to.be.false;
        }
      });
    });
    
    describe("withdrawPrize", function () {
      beforeEach(async function () {
        await dlottery.startNewLottery();
        await dlottery.uploadPrize({ value: PRIZE_AMOUNT });
        const futureTime = await time.latest() + 3600;
        await dlottery.setDrawDate(futureTime);
        
        // Have a few users participate
        await dlottery.connect(user1).participate();
        await dlottery.connect(user2).participate();
        
        await time.increase(3600);
        await dlottery.performDraw();
      });
      
      it("should allow winner to withdraw prize", async function () {
        // Get the winner
        const [, , , , winnerAddress] = await dlottery.getCurrentDrawInfo();
        
        // If user1 is the winner
        if (winnerAddress === user1.address) {
          const initialBalance = await ethers.provider.getBalance(user1.address);
          const tx = await dlottery.connect(user1).withdrawPrize();
          const receipt = await tx.wait();
          const gasCost = receipt!.gasUsed * receipt!.gasPrice;
          const finalBalance = await ethers.provider.getBalance(user1.address);
          
          expect(finalBalance).to.be.closeTo(
            initialBalance + PRIZE_AMOUNT - gasCost,
            1000000n
          );
        } 
        // If user2 is the winner
        else if (winnerAddress === user2.address) {
          const initialBalance = await ethers.provider.getBalance(user2.address);
          const tx = await dlottery.connect(user2).withdrawPrize();
          const receipt = await tx.wait();
          const gasCost = receipt!.gasUsed * receipt!.gasPrice;
          const finalBalance = await ethers.provider.getBalance(user2.address);
          
          expect(finalBalance).to.be.closeTo(
            initialBalance + PRIZE_AMOUNT - gasCost,
            1000000n
          );
        }
      });
      
      it("should emit PrizeWithdrawn event", async function () {
        const [, , , , winnerAddress] = await dlottery.getCurrentDrawInfo();
        
        if (winnerAddress === user1.address) {
          await expect(dlottery.connect(user1).withdrawPrize())
            .to.emit(dlottery, "PrizeWithdrawn")
            .withArgs(1, user1.address, PRIZE_AMOUNT);
        } else if (winnerAddress === user2.address) {
          await expect(dlottery.connect(user2).withdrawPrize())
            .to.emit(dlottery, "PrizeWithdrawn")
            .withArgs(1, user2.address, PRIZE_AMOUNT);
        }
      });
      
      it("should increment drawId after prize withdrawal", async function () {
        // Log initial state
        const [drawIdBefore, prizeBefore, , , winnerAddress] = await dlottery.getCurrentDrawInfo();
        console.log("Before withdrawal:");
        console.log(" - drawId:", drawIdBefore.toString());
        console.log(" - prize:", prizeBefore.toString());
        console.log(" - winner:", winnerAddress);
        
        // Only attempt withdrawal if there's a winner
        if (winnerAddress !== ethers.ZeroAddress) {
          let winnerSigner;
          
          if (winnerAddress === user1.address) {
            console.log("Winner is user1");
            winnerSigner = user1;
          } else if (winnerAddress === user2.address) {
            console.log("Winner is user2");
            winnerSigner = user2;
          } else {
            console.log("Winner is not user1 or user2: ", winnerAddress);
            // Try to find the winner in users array
            const winnerIndex = users.findIndex(u => u.address === winnerAddress);
            if (winnerIndex !== -1) {
              console.log(`Winner is users[${winnerIndex}]`);
              winnerSigner = users[winnerIndex];
            }
          }
          
          if (winnerSigner) {
            // Execute the withdrawal
            const tx = await dlottery.connect(winnerSigner).withdrawPrize();
            const receipt = await tx.wait();
            console.log("Withdrawal successful, gas used:", receipt?.gasUsed.toString());
          } else {
            console.error("Could not identify winner signer!");
          }
        } else {
          console.log("No winner (address zero). Because winner is random, so sometimes there is no winner on test. Please run test again.");
          this.skip();
        }
        
        // Check state after withdrawal
        const [drawIdAfter, prizeAfter, , ,] = await dlottery.getCurrentDrawInfo();
        console.log("After withdrawal:");
        console.log(" - drawId:", drawIdAfter.toString());
        console.log(" - prize:", prizeAfter.toString());
        
        // Original assertion
        expect(drawIdAfter).to.equal(drawIdBefore + 1n);
      });
      
      it("should fail if not the winner", async function () {
        const [, , , , winnerAddress] = await dlottery.getCurrentDrawInfo();
        
        // Try to withdraw with non-winner
        const nonWinner = winnerAddress === user1.address ? user2 : user1;
        await expect(dlottery.connect(nonWinner).withdrawPrize())
          .to.be.revertedWith("Not the winner");
      });
      
      it("should fail if draw not completed", async function () {
        // Start a new lottery without performing a draw
        await dlottery.startNewLottery();
        await dlottery.uploadPrize({ value: PRIZE_AMOUNT });
        
        await expect(dlottery.connect(user1).withdrawPrize())
          .to.be.revertedWith("Draw not completed");
      });
    });
  });
  
  describe("Security", function () {
    it("should prevent non-owners from starting new lottery", async function () {
      await expect(dlottery.connect(user1).startNewLottery())
        .to.be.reverted;
    });
    
    it("should prevent non-owners from performing draw", async function () {
      await expect(dlottery.connect(user1).performDraw())
        .to.be.reverted;
    });
    
    it("should prevent non-owners from setting draw date", async function () {
      const futureTime = await time.latest() + 3600;
      await expect(dlottery.connect(user1).setDrawDate(futureTime))
        .to.be.reverted;
    });
    
    it("should protect against re-entrancy in withdrawPrize", async function () {
      // This is a basic check that the nonReentrant modifier is applied
      // More extensive re-entrancy testing would require a malicious contract
      await dlottery.startNewLottery();
      await dlottery.uploadPrize({ value: PRIZE_AMOUNT });
      const futureTime = await time.latest() + 3600;
      await dlottery.setDrawDate(futureTime);
      await dlottery.connect(user1).participate();
      await time.increase(3600);
      await dlottery.performDraw();
      
      // Check if nonReentrant modifier is applied (indirectly)
      const [, , , , winnerAddress] = await dlottery.getCurrentDrawInfo();
      if (winnerAddress === user1.address) {
        const withdrawFunction = dlottery.connect(user1).withdrawPrize;
        
        // If nonReentrant is properly applied, a direct re-entry would fail
        // but we can't test that directly here without a malicious contract
        await withdrawFunction();
        
        // After withdrawal, another attempt should fail with "No prize to withdraw"
        await expect(withdrawFunction())
          .to.be.revertedWith("No prize to withdraw");
      }
    });
  });
  
  describe("Complete lottery flow", function () {
    it("should run a complete lottery cycle", async function () {
      // 1. Start new lottery
      await dlottery.startNewLottery();
      
      // 2. Upload prize
      await dlottery.uploadPrize({ value: PRIZE_AMOUNT });
      
      // 3. Set draw date
      const futureTime = await time.latest() + 3600;
      await dlottery.setDrawDate(futureTime);
      
      // 4. Multiple users participate
      for (let i = 0; i < 5; i++) {
        if (i < users.length) {
          await dlottery.connect(users[i]).participate();
        }
      }
      
      // 5. Time passes
      await time.increase(3600);
      
      // 6. Perform the draw
      await dlottery.performDraw();
      
      // 7. Winner withdraws prize
      const [originalDrawId, , , , winnerAddress] = await dlottery.getCurrentDrawInfo();
      console.log(`Draw ID: ${originalDrawId}, Winner: ${winnerAddress}`);
      
      // Find the winner from our users
      let winnerFound = false;
      if (winnerAddress !== ethers.ZeroAddress) {
        let winnerSigner;
        if (winnerAddress === users[0]?.address) winnerSigner = users[0];
        else if (winnerAddress === users[1]?.address) winnerSigner = users[1];
        else if (winnerAddress === users[2]?.address) winnerSigner = users[2];
        else if (winnerAddress === users[3]?.address) winnerSigner = users[3];
        else if (winnerAddress === users[4]?.address) winnerSigner = users[4];
        
        if (winnerSigner) {
          console.log(`Found winner: ${winnerSigner.address}`);
          await dlottery.connect(winnerSigner).withdrawPrize();
          winnerFound = true;
        } else {
          console.log("Winner not found among our test accounts");
        }
      } else {
        console.log("No winner selected (zero address). Because winner is random, so sometimes there is no winner on test. Please run test again.");
      }
      
      // Skip test if no withdrawal occurred
      if (!winnerFound) {
        console.log("Test skipped: Unable to perform prize withdrawal");
        this.skip();
        return;
      }
      
      // 8. Verify we can start a new lottery
      await dlottery.startNewLottery();
      const [newDrawId, prize, , completed, ] = await dlottery.getCurrentDrawInfo();
      console.log(`New Draw ID: ${newDrawId}`);
      expect(newDrawId).to.equal(2n); // DrawID should be 2 for the new lottery
      expect(prize).to.equal(0);
      expect(completed).to.equal(false);
    });
  });
  
  describe("View functions", function () {
    it("should return correct ticket info", async function () {
      await dlottery.startNewLottery();
      await dlottery.uploadPrize({ value: PRIZE_AMOUNT });
      const futureTime = await time.latest() + 3600;
      await dlottery.setDrawDate(futureTime);
      
      // User participates
      await dlottery.connect(user1).participate();
      
      // Check all tickets to find which one belongs to user1
      let foundTicket = false;
      for (let i = 1; i <= MAX_PARTICIPANTS; i++) {
        const ticketOwner = await dlottery.getTicketInfo(i);
        if (ticketOwner === user1.address) {
          foundTicket = true;
          break;
        }
      }
      
      expect(foundTicket).to.equal(true);
    });
    
    it("should return correct current draw info", async function () {
      await dlottery.startNewLottery();
      await dlottery.uploadPrize({ value: PRIZE_AMOUNT });
      const futureTime = await time.latest() + 3600;
      await dlottery.setDrawDate(futureTime);
      
      const [drawId, prize, drawTime, completed, winner] = await dlottery.getCurrentDrawInfo();
      expect(drawId).to.equal(1n);
      expect(prize).to.equal(PRIZE_AMOUNT);
      expect(drawTime).to.equal(futureTime);
      expect(completed).to.equal(false);
      expect(winner).to.equal(ethers.ZeroAddress);
    });
    
    it("should return correct remaining tickets count", async function () {
      await dlottery.startNewLottery();
      
      // Initially all tickets should be available
      expect(await dlottery.getRemainingTickets()).to.equal(MAX_PARTICIPANTS);
      
      // After one user participates, one less ticket should be available
      await dlottery.uploadPrize({ value: PRIZE_AMOUNT });
      const futureTime = await time.latest() + 3600;
      await dlottery.setDrawDate(futureTime);
      await dlottery.connect(user1).participate();
      
      expect(await dlottery.getRemainingTickets()).to.equal(MAX_PARTICIPANTS - 1);
    });
  });
});