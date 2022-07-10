import { expect } from "chai";
import { ethers } from "hardhat";
import { ProStakers } from "../typechain-types";
import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

describe("ProStakers", () => {
  let proStakers: ProStakers;

  let owner: SignerWithAddress;
  let staker1: SignerWithAddress;
  let staker2: SignerWithAddress;

  beforeEach(async () => {
    const ProStakers = await ethers.getContractFactory("ProStakers");
    proStakers = (await ProStakers.deploy()) as ProStakers;
    await proStakers.deployed();

    [owner, staker1, staker2] = await ethers.getSigners();
  });

  describe("Deployment", () => {
    it("Should deploy correctly", async () => {
      expect(proStakers.address).to.be.ok;
    });
  });

  describe("Deposit", () => {
    it("Should not to throw when staker call stake function", async () => {
      const amount = ethers.utils.parseEther("0.1");
      expect(await proStakers.connect(staker1).deposit({ value: amount })).to
        .not.throw;
    });

    it("Stakers should be able to send ETH to the contract", async () => {
      const amount = ethers.utils.parseEther("0.1");
      const trX = await proStakers.connect(staker1).deposit({ value: amount });
      await trX.wait();
      const balance = await ethers.provider.getBalance(proStakers.address);
      expect(balance).to.equal(ethers.utils.parseEther("0.1"));
    });
  });
});
