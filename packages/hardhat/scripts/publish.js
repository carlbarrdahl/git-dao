const fs = require("fs");
const path = require("path");
const chalk = require("chalk");

const graphDir = "../subgraph";
const deploymentsDir = "./deployments";
const publishDir = "../react-app/src/contracts";

function publishContract(contractName, networkName) {
  try {
    let contract = fs
      .readFileSync(`${deploymentsDir}/${networkName}/${contractName}.json`)
      .toString();
    contract = JSON.parse(contract);
    const graphConfigPath = `${graphDir}/config/config.json`;
    let graphConfig;
    try {
      if (fs.existsSync(graphConfigPath)) {
        graphConfig = fs.readFileSync(graphConfigPath).toString();
      } else {
        graphConfig = "{}";
      }
    } catch (e) {
      console.log(e);
    }

    graphConfig = JSON.parse(graphConfig);
    graphConfig[`${networkName}_${contractName}Address`] = contract.address;

    const folderPath = graphConfigPath.replace("/config.json", "");
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath);
    }
    fs.writeFileSync(graphConfigPath, JSON.stringify(graphConfig, null, 2));
    if (!fs.existsSync(`${graphDir}/abis`)) fs.mkdirSync(`${graphDir}/abis`);
    fs.writeFileSync(
      `${graphDir}/abis/${networkName}_${contractName}.json`,
      JSON.stringify(contract.abi, null, 2)
    );

    // Hardhat Deploy writes a file with all ABIs in react-app/src/contracts/contracts.json
    // If you need the bytecodes and/or you want one file per ABIs, un-comment the following block.
    // Write the contracts ABI, address and bytecodes in case the front-end needs them
    // fs.writeFileSync(
    //   `${publishDir}/${contractName}.address.js`,
    //   `module.exports = "${contract.address}";`
    // );
    // fs.writeFileSync(
    //   `${publishDir}/${contractName}.abi.js`,
    //   `module.exports = ${JSON.stringify(contract.abi, null, 2)};`
    // );
    // fs.writeFileSync(
    //   `${publishDir}/${contractName}.bytecode.js`,
    //   `module.exports = "${contract.bytecode}";`
    // );

    return true;
  } catch (e) {
    console.log(
      "Failed to publish " + chalk.red(contractName) + " to the subgraph."
    );
    console.log(e);
    return false;
  }
}

async function main() {
  const directories = fs.readdirSync(deploymentsDir);
  directories.forEach(function (directory) {
    const files = fs.readdirSync(`${deploymentsDir}/${directory}`);
    files.forEach(function (file) {
      if (file.indexOf(".json") >= 0) {
        const contractName = file.replace(".json", "");
        publishContract(contractName, directory);
      }
    });
  });
  console.log("✅  Published contracts to the subgraph package.");

  // console.log("Saving ABIs to web directory...");
  // const abiPath = path.resolve(__dirname, "../artifacts/contracts");
  // const webPath = path.resolve(__dirname, "../../web/contracts");

  // fs.readdirSync(abiPath).forEach((dir) => {
  //   const [name] = dir.split(".");
  //   console.log("-", name);
  //   const { abi } = JSON.parse(
  //     fs.readFileSync(path.resolve(abiPath, dir, name + ".json"), "utf8")
  //   );
  //   fs.writeFileSync(
  //     path.resolve(webPath, name + ".json"),
  //     JSON.stringify(abi)
  //   );
  // });
  // console.log("Done!");
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
