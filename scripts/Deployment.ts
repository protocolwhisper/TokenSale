import {ethers} from "ethers"
import * as dotenv from "dotenv"

dotenv.config();


async function main(){
    const provider = ethers.getDefaultProvider("goerli")
    const wallet = ethers.Wallet.createRandom()
    const signer = wallet.connect(provider)
    
}