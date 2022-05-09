// deploy/00_deploy_your_contract.js

const { ethers } = require("hardhat");
const { getMnemonicWallet } = require("../utils/getMnemonicWallet");

const localChainId = "31337";

// const sleep = (ms) =>
//   new Promise((r) =>
//     setTimeout(() => {
//       console.log(`waited for ${(ms / 1000).toFixed(3)} seconds`);
//       r();
//     }, ms)
//   );

const verifierAddress = getMnemonicWallet();
module.exports = async ({ getNamedAccounts, deployments, getChainId }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = await getChainId();

  console.log(deployer);
  await deploy("Verifier", {
    // Learn more about args here: https://www.npmjs.com/package/hardhat-deploy#deploymentsdeploy
    from: deployer,
    args: [verifierAddress.address],
    log: true,
    waitConfirmations: 5,
  });
  const verifier = await ethers.getContract("Verifier", deployer);

  // Getting a previously deployed contract
  await deploy("ProjectFactory", {
    // Learn more about args here: https://www.npmjs.com/package/hardhat-deploy#deploymentsdeploy
    from: deployer,
    args: [verifier.address],
    log: true,
    waitConfirmations: 5,
  });
  // await deploy("GovernanceERC20", {
  //   // Learn more about args here: https://www.npmjs.com/package/hardhat-deploy#deploymentsdeploy
  //   from: deployer,
  //   // args: [deployer, "TestToken", "TT", ethers.utils.parseEther("1000000")],
  //   log: true,
  //   waitConfirmations: 5,
  // });
  // const token = await ethers.getContract("GovernanceERC20", deployer);
  // token.initialize(
  //   deployer,
  //   "TestToken",
  //   "TT",
  //   ethers.utils.parseEther("1000000")
  // );

  // Getting a previously deployed contract
  // const ProjectFactory = await ethers.getContract("ProjectFactory", deployer);
  /*  await ProjectFactory.setPurpose("Hello");
  
    To take ownership of yourContract using the ownable library uncomment next line and add the 
    address you want to be the owner. 
    // await yourContract.transferOwnership(YOUR_ADDRESS_HERE);

    //const yourContract = await ethers.getContractAt('ProjectFactory', "0xaAC799eC2d00C013f1F11c37E654e59B0429DF6A") //<-- if you want to instantiate a version of a contract at a specific address!
  */

  /*
  //If you want to send value to an address from the deployer
  const deployerWallet = ethers.provider.getSigner()
  await deployerWallet.sendTransaction({
    to: "0x34aA3F359A9D614239015126635CE7732c18fDF3",
    value: ethers.utils.parseEther("0.001")
  })
  */

  /*
  //If you want to send some ETH to a contract on deploy (make your constructor payable!)
  const yourContract = await deploy("ProjectFactory", [], {
  value: ethers.utils.parseEther("0.05")
  });
  */

  /*
  //If you want to link a library into your contract:
  // reference: https://github.com/austintgriffith/scaffold-eth/blob/using-libraries-example/packages/hardhat/scripts/deploy.js#L19
  const yourContract = await deploy("ProjectFactory", [], {}, {
   LibraryName: **LibraryAddress**
  });
  */

  // Verify from the command line by running `yarn verify`

  // You can also Verify your contracts with Etherscan here...
  // You don't want to verify on localhost
  // try {
  //   if (chainId !== localChainId) {
  //     await run("verify:verify", {
  //       address: ProjectFactory.address,
  //       contract: "contracts/ProjectFactory.sol:ProjectFactory",
  //       constructorArguments: [],
  //     });
  //   }
  // } catch (error) {
  //   console.error(error);
  // }
};
module.exports.tags = ["ProjectFactory"];
