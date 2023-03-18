import { task } from "hardhat/config";
import hardhat from "hardhat";

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts: SignerWithAddress[] = await hardhat.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});
