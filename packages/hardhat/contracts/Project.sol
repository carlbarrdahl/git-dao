pragma solidity >=0.8.0 <0.9.0;
//SPDX-License-Identifier: MIT

import "hardhat/console.sol";

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/finance/VestingWalletUpgradeable.sol";

contract Project is
    Initializable,
    OwnableUpgradeable,
    UUPSUpgradeable,
    VestingWalletUpgradeable
{
    address public token;
    string public repo;

    event ETHDeposited(address sender, uint256 amount);

    function initialize(
        address _owner,
        string calldata _repo,
        address _token,
        uint64 _duration
    ) public initializer {
        __Ownable_init();
        __UUPSUpgradeable_init();
        __VestingWallet_init(_owner, uint64(block.timestamp), _duration);

        repo = _repo;
        token = _token;

        transferOwnership(_owner);
    }

    /// @dev Emit ETHDeposited event to track ETH deposits that weren't done over the deposit method.
    receive() external payable override {
        emit ETHDeposited(msg.sender, msg.value);
    }

    function fundedAmount() external view returns (uint256) {
        return vestedAmount(uint64(block.timestamp + duration()));
    }

    function withdraw() external {
        return release();
    }

    /// @dev Used to check the permissions within the upgradability pattern implementation of OZ
    function _authorizeUpgrade(address) internal override onlyOwner {}
}
