import ProjectFactory from "contracts/ProjectFactory.json";
import Project from "contracts/Project.json";
import ERC20Token from "contracts/ERC20Token.json";

export const contractAddresses = {
  31337: {
    projectFactory: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
  },
  4: {
    projectFactory: "0x9bC9E782C7A21FDFacFFCF88a6200eB47d555856",
  },
};

export const contractTypes = {
  project: Project.abi,
  projectFactory: ProjectFactory.abi,
  token: ERC20Token.abi,
};
