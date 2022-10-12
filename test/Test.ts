
import { expect } from "chai";
import { ethers } from "hardhat";
import {TokenSale} from "../typechain-types"

const TOKEN_RATIO =5
describe("NFT Shop", async () => {

    let tokenSaleContract: TokenSale;
    let address;
  beforeEach(async () => {
    const tokenSaleContractFactory = await ethers.getContractFactory("TokenSale")
    tokenSaleContract = await tokenSaleContractFactory.deploy(TOKEN_RATIO , ethers.constants.AddressZero) as TokenSale
    await tokenSaleContract.deployed()
  });

  describe("When the Shop contract is deployed", async () => {
    it("defines the ratio as provided in parameters", async () => {
        // Ratio may have some problems in differents implementations
        const ratio = await tokenSaleContract.ratio()
        expect(ratio).to.equal(TOKEN_RATIO)
    
    });

    it("uses a valid ERC20 as payment token", async () => {
      const paymentToken = await tokenSaleContract.paymentToken()
      const erc20contractfactory = await ethers.getContractFactory("MyERC20Token")
      const paymentTokenContract = erc20contractfactory.attach(paymentToken) // This attach a contract instant to that address
      //const totalSupply = 
    });
  });

  describe("When a user purchase an ERC20 from the Token contract", async () => {
    it("charges the correct amount of ETH", async () => {
      throw new Error("Not implemented");
    });

    it("gives the correct amount of tokens", async () => {
      throw new Error("Not implemented");
    });
  });

  describe("When a user burns an ERC20 at the Token contract", async () => {
    it("gives the correct amount of ETH", async () => {
      throw new Error("Not implemented");
    });

    it("burns the correct amount of tokens", async () => {
      throw new Error("Not implemented");
    });
  });

  describe("When a user purchase a NFT from the Shop contract", async () => {
    it("charges the correct amount of ETH", async () => {
      throw new Error("Not implemented");
    });

    it("updates the owner account correctly", async () => {
      throw new Error("Not implemented");
    });

    it("update the pool account correctly", async () => {
      throw new Error("Not implemented");
    });

    it("favors the pool with the rounding", async () => {
      throw new Error("Not implemented");
    });
  });

  describe("When a user burns their NFT at the Shop contract", async () => {
    it("gives the correct amount of ERC20 tokens", async () => {
      throw new Error("Not implemented");
    });
    it("updates the pool correctly", async () => {
      throw new Error("Not implemented");
    });
  });

  describe("When the owner withdraw from the Shop contract", async () => {
    it("recovers the right amount of ERC20 tokens", async () => {
      throw new Error("Not implemented");
    });

    it("updates the owner account correctly", async () => {
      throw new Error("Not implemented");
    });
  });
});