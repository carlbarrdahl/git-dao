pragma solidity >=0.8.0 <0.9.0;
//SPDX-License-Identifier: MIT

import "hardhat/console.sol";

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract Verifier is Ownable {
    using ECDSA for bytes32;
    address public verifier;

    constructor(address _verifier) {
        setVerifier(_verifier);
    }

    function setVerifier(address _verifier) public onlyOwner {
        verifier = _verifier;
    }

    function verify(bytes32 _hash, bytes calldata _signature)
        external
        view
        returns (bool)
    {
        return _hash.toEthSignedMessageHash().recover(_signature) == verifier;
    }
}
