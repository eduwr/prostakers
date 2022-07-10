import { expect } from "chai";
import { ethers } from "hardhat";
import { ProStakers } from "../typechain-types";
import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

describe("ProStakers", () => {
  let proStakers: ProStakers;

  let owner: SignerWithAddress;
  let staker: SignerWithAddress;

  beforeEach(async () => {
    const ProStakers = await ethers.getContractFactory("ProStakers");
    proStakers = (await ProStakers.deploy()) as ProStakers;
    await proStakers.deployed();

    [owner, staker] = await ethers.getSigners();
  });

  describe("Deployment", () => {
    it("Should deploy correctly", async () => {
      expect(proStakers.address).to.be.ok;
    });
  });

  describe("Deposit", () => {
    it("Stakers should be able to send ETH to the contract", async () => {
      const amount = ethers.utils.parseEther("0.1");
      const trX = await proStakers.connect(staker).deposit({ value: amount });
      await trX.wait();
      const balance = await ethers.provider.getBalance(proStakers.address);
      expect(balance).to.equal(ethers.utils.parseEther("0.1"));
    });
  });

  describe("Withdraw", () => {
    it("Stakers should be able to withdraw staked ETH from the contract", async () => {
      const amount = ethers.utils.parseEther("1");
      let trX = await proStakers.connect(staker).deposit({ value: amount });
      await trX.wait();
      let contractBalance = await ethers.provider.getBalance(
        proStakers.address
      );
      expect(contractBalance).to.equal(ethers.utils.parseEther("1"));
      const stakerBalance = await ethers.provider.getBalance(staker.address);

      trX = await proStakers.connect(staker).withdraw();
      await trX.wait();

      const stakerBalanceAfter = await ethers.provider.getBalance(
        staker.address
      );

      contractBalance = await ethers.provider.getBalance(proStakers.address);
      expect(stakerBalanceAfter > stakerBalance).to.be.true;
      expect(contractBalance).to.equal(0);
    });
  });
});
