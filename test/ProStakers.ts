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

  describe("Stake", () => {
    it("Should not to throw when staker call stake function", async () => {
      const amount = ethers.utils.parseEther("0.1");
      expect(await proStakers.connect(staker1).stake(amount)).to.not.throw;
    });
  });
});
