pragma solidity >=0.8.0 <0.9.0;
//SPDX-License-Identifier: MIT

import "hardhat/console.sol";

import "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";

import "./tokens/ERC20Token.sol";
import "./Verifier.sol";

import "./Project.sol";

contract ProjectFactory {
    Verifier public verifier;

    address public projectBase;
    address public tokenBase;

    struct ProjectStruct {
        string repo;
        address project;
        address token;
        address creator;
    }

    mapping(string => address) public projects;

    event ProjectCreated(
        string indexed repo,
        address project,
        address indexed token,
        address indexed creator
    );

    constructor(Verifier _verifier) {
        verifier = _verifier;

        tokenBase = address(new ERC20Token());
        projectBase = address(new Project());
    }

    /**
    @notice Create a project with a token of 1M supply and transfer 10k to the creator
    @dev Signature and hash are created in backend service and verifies user has access to repo
    1. Create token with 1M totalSupply, transfer 10k to the creator and set creator as owner
    2. Create project with 365 days vesting
    @param _repo Github repo name
    @param _hash Hash to verify
    @param _signature Signature to verify user is allowed to create project from repo
    */
    function create(
        string calldata _repo,
        bytes32 _hash,
        bytes calldata _signature
    ) public payable returns (Project project) {
        // Is it more secure to hash it here rather than in the backend service?
        // bytes32 hash = keccak256(abi.encodePacked(_repo, msg.sender));
        require(verifier.verify(_hash, _signature), "Signature invalid");
        require(projects[_repo] == address(0), "Project already exists");

        ERC20Token token = ERC20Token(payable(Clones.clone(tokenBase)));
        token.initialize(msg.sender, _repo, _repo, 1_000_000);
        token.transferOwnership(msg.sender);

        project = Project(payable(Clones.clone(projectBase)));
        project.initialize(msg.sender, _repo, address(token), uint64(365 days));

        projects[_repo] = address(project);

        emit ProjectCreated(
            _repo,
            address(project),
            address(token),
            msg.sender
        );

        return project;
    }
}

function createProxy(address _logic, bytes memory _data)
    returns (address payable addr)
{
    return payable(address(new ERC1967Proxy(_logic, _data)));
}
