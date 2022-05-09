const { ethers } = require("hardhat");
const { use, expect } = require("chai");
const { solidity } = require("ethereum-waffle");
const { getMnemonicWallet } = require("../utils/getMnemonicWallet");

use(solidity);

function createHash([repo, address]) {
  return ethers.utils.solidityKeccak256(
    ["bytes"],
    [ethers.utils.solidityPack(["string", "address"], [repo, address])]
  );
}

describe("ProjectFactory", async function () {
  const verifierWallet = getMnemonicWallet();

  const repoName = "owner/repo-name";
  const vestingDuration = 3600 * 24 * 365; // 1 year

  let deployer;
  let owner;
  let funder;
  let factory;

  beforeEach(async () => {
    [deployer, owner, funder] = await ethers.getSigners();

    console.log("deployer ADDRESS", deployer.address);
    console.log("OWNER ADDRESS", owner.address);
    const Verifier = await ethers.getContractFactory("Verifier");
    const verifier = await Verifier.deploy(verifierWallet.address);
    const ProjectFactory = await ethers.getContractFactory("ProjectFactory");

    factory = await ProjectFactory.deploy(verifier.address);
  });

  async function createProject(repo) {
    const validHash = createHash([repoName, owner.address]);

    const sig = await verifierWallet.signMessage(
      ethers.utils.arrayify(validHash)
    );

    await expect(factory.connect(owner).create(repo, validHash, sig)).to.emit(
      factory,
      "ProjectCreated"
    );

    return factory.projects(repoName);
  }

  describe("Create Project", () => {
    it("should verify signatures", async () => {
      const validHash = createHash([repoName, owner.address]);
      const invalidHash = createHash(["INVALID", owner.address]);

      console.log(validHash);
      const sig = await verifierWallet.signMessage(
        ethers.utils.arrayify(validHash)
      );
      console.log(sig);

      await expect(
        factory.create(repoName, invalidHash, sig)
      ).to.be.revertedWith("Signature invalid");

      await expect(factory.create(repoName, validHash, sig)).to.emit(
        factory,
        "ProjectCreated"
      );
    });

    it("should store the project in a registry", async () => {
      const address = await createProject(repoName);
      const project = await factory.projects(repoName);

      expect(address).to.equal(project);
    });

    describe("Token", () => {
      it("should create a token with 10k minted to owner", async () => {
        const address = await createProject(repoName);
        const project = await ethers.getContractAt("Project", address);

        const tokenAddress = await project.token();
        const token = await ethers.getContractAt("ERC20Token", tokenAddress);

        // Owner gets 10k tokens
        expect((await token.balanceOf(owner.address)).toString()).to.equal(
          ethers.utils.parseEther("10000").toString()
        );

        // Token can be transfered
        await token
          .connect(owner)
          .transfer(deployer.address, ethers.utils.parseEther("2000"));

        expect((await token.balanceOf(owner.address)).toString()).to.equal(
          ethers.utils.parseEther("8000").toString()
        );
        expect((await token.balanceOf(deployer.address)).toString()).to.equal(
          ethers.utils.parseEther("2000").toString()
        );

        // Token can be minted
        await token
          .connect(owner)
          .mint(funder.address, ethers.utils.parseEther("1000"));
      });
    });

    describe("Vesting", () => {
      it("should be possible to fund", async () => {
        const address = await createProject(repoName);
        const project = await ethers.getContractAt("Project", address);

        const value = ethers.utils.parseEther("1");
        await funder.sendTransaction({ to: project.address, value });

        expect(ethers.utils.formatEther(await project.fundedAmount())).to.eq(
          "1.0"
        );
        const balanceBefore = await ethers.provider.getBalance(owner.address);

        // Move time forward to test vesting release
        await ethers.provider.send("evm_increaseTime", [vestingDuration / 2]);

        await project.withdraw();

        const balanceAfter = await ethers.provider.getBalance(owner.address);

        // Half the funded amount should be released
        expect(
          +ethers.utils
            .formatEther(balanceAfter.sub(balanceBefore))
            .substr(0, 4)
        ).to.eq(0.5);
      });
    });
  });
});
