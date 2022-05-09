const fs = require("fs");
const path = require("path");
const { task } = require("hardhat");

task("docgen", "Generate NatSpec", async (taskArgs, hre) => {
  const config = hre.config.docgen || {
    ignore: ["console", "@openzeppelin"],
    path: ["..", "web", "contracts"],
    prettify: true,
  };
  const contractNames = await hre.artifacts.getAllFullyQualifiedNames();
  await Promise.all(
    contractNames
      .filter(
        (contractName) =>
          !(config.ignore || []).some((name) => contractName.includes(name))
      )
      .map(async (contractName) => {
        const [source, name] = contractName.split(":");
        const { metadata } = (await hre.artifacts.getBuildInfo(contractName))
          .output.contracts[source][name];

        const { abi, devdoc, userdoc } = JSON.parse(metadata).output;

        fs.writeFileSync(
          path.resolve(__dirname, ...config.path, `${name}.json`),
          JSON.stringify(
            { name, abi, devdoc, userdoc },
            null,
            config.prettify ? 2 : 0
          )
        );
        return { name, abi, devdoc, userdoc };
      })
  );
});

module.exports = {};
