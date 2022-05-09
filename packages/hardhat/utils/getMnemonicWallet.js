const fs = require("fs");
const { ethers } = require("ethers");

module.exports.getMnemonicWallet = () => {
  try {
    return ethers.Wallet.fromMnemonic(
      fs.readFileSync("./mnemonic.txt").toString().trim()
    );
  } catch (error) {
    return "";
  }
};
