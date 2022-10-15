
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { BigNumber } from "ethers";
import { ethers } from "hardhat";
import {MyERC20Token, MyERC20Token__factory, MyERC721, TokenSale} from "../typechain-types"
import { token } from "../typechain-types/@openzeppelin/contracts";

const TOKEN_RATIO =5
const NFT_PRICE = 0.1

describe("NFT Shop", async () => {

    let tokenSaleContract: TokenSale;
    let erc20TokenContract : MyERC20Token;
    let erc721TokenContract : MyERC721;
    let deployer : SignerWithAddress;
    let acc1 : SignerWithAddress;
    let acc2 : SignerWithAddress;
  beforeEach(async () => {
    [deployer , acc1 , acc2] = await ethers.getSigners()
    const erc20TokenContractFactory = await ethers.getContractFactory("MyERC20Token")
    const erc721TokenContractFactory = await ethers.getContractFactory("MyERC721")
    const tokenSaleContractFactory = await ethers.getContractFactory("TokenSale")
    erc20TokenContract = await erc20TokenContractFactory.deploy() as MyERC20Token
    await erc20TokenContract.deployed()
    tokenSaleContract = await tokenSaleContractFactory.deploy(TOKEN_RATIO , NFT_PRICE , erc20TokenContract.address , erc721TokenContract.address) as TokenSale
    await tokenSaleContract.deployed()
    erc721TokenContract = await erc721TokenContractFactory.deploy() as MyERC721 // U deploy the factory firsr NOTEEE
    await erc721TokenContract.deployed()
    
    const MINTER_ROLE = await erc20TokenContract.MINTER_ROLE()
    const grantRoleTx = await erc20TokenContract.grantRole(MINTER_ROLE , tokenSaleContract.address)
    await grantRoleTx.wait()
    // Give minter role to the tokensalecontract from the erc721one
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
      const totalSupply = await paymentTokenContract.totalSupply()
      expect(totalSupply).to.eq(0)
    });
  });

  describe("When a user purchase an ERC20 from the Token contract", async () => {
    const paymentAmount = ethers.utils.parseEther("1")
    let balanceBeforeBuyTokens : BigNumber
    let gasFeesBuyTokens : BigNumber
    beforeEach(async () => {
      balanceBeforeBuyTokens = await acc1.getBalance() // We can pass a block tag as an argument 
      console.log(balanceBeforeBuyTokens)
      const buyTokensTx = await tokenSaleContract.connect(acc1).buyTokens({value : paymentAmount}) // Here we declare the payment that we are passing
      const buyTokenReceipt = await buyTokensTx.wait()
      gasFeesBuyTokens = (buyTokenReceipt.gasUsed).mul(buyTokenReceipt.effectiveGasPrice)
    })
    it("charges the correct amount of ETH", async () => {
      const balanceAfterBuyTokens = await acc1.getBalance()
      const diff = balanceBeforeBuyTokens.sub(balanceAfterBuyTokens)
      const expectedcost = paymentAmount.add(gasFeesBuyTokens)
      expect(diff).to.equal(expectedcost)

    });

    it("Increase the token balance " , async () => {
      const balanceContract = await ethers.provider.getBalance(tokenSaleContract.address)
      expect(balanceContract).to.eq(paymentAmount)
    })

    it("gives the correct amount of tokens ", async () => {
      
    });
    describe("When a user burns an ERC20 at the Token contract ", async () => {
      let gasFeesBurnTokens: BigNumber
      const purchaseAmount = paymentAmount.div(TOKEN_RATIO)
      let gassFeesApproveTokens : BigNumber

      beforeEach(async () => {
        const approveTx = await erc20TokenContract.connect(acc1).approve(tokenSaleContract.address , purchaseAmount)
        const approveReceitp = await approveTx.wait()
        gassFeesApproveTokens = (approveReceitp.gasUsed).mul(approveReceitp.effectiveGasPrice)
        const burnTokensTx = await tokenSaleContract.connect(acc1).burnTokens(purchaseAmount) // We can override value or max fee per Gas Here
        const burnTokenReceipt = await burnTokensTx.wait()
        gasFeesBurnTokens = (burnTokenReceipt.gasUsed).mul(burnTokenReceipt.effectiveGasPrice)
      })
      it(" gives the correct amount of ETH", async () => {
        const balanceAfterBurnTokens = await acc1.getBalance()
        const diff = balanceBeforeBuyTokens.sub(balanceAfterBurnTokens)
        const expectediff = gasFeesBurnTokens.add(gasFeesBuyTokens).add(gassFeesApproveTokens)
        const error = diff.sub(expectediff)
        expect(error).to.eq(0)
      });
  
      it("burns the correct amount of tokens", async () => {
        const acc1Balance = await erc20TokenContract.balanceOf(acc1.address)
        expect(acc1Balance).to.eq(0)
        const totalSupply = await erc20TokenContract.totalSupply()
        expect(totalSupply).to.eq(0) // Since this fails we need to implement the burn from 
        
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
});