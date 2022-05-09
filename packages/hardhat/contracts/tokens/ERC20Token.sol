// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "hardhat/console.sol";

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/draft-IERC20PermitUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/IERC20MetadataUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20VotesUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20CappedUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract ERC20Token is
    Initializable,
    OwnableUpgradeable,
    ERC20CappedUpgradeable,
    ERC20VotesUpgradeable
{
    function __ERC20Token_init(
        address _owner,
        string calldata _name,
        string calldata _symbol,
        uint256 _totalSupply
    ) internal onlyInitializing {
        __Ownable_init();

        __ERC20_init(_name, _symbol);
        __ERC20Permit_init(_name);
        __ERC20Capped_init(_totalSupply * 1e18);

        // transferOwnership(_owner);
    }

    function initialize(
        address _owner,
        string calldata _name,
        string calldata _symbol,
        uint256 _totalSupply
    ) external initializer {
        console.log("owner", _owner);
        console.log("msg.sender", msg.sender);
        __ERC20Token_init(_owner, _name, _symbol, _totalSupply);
        mint(_owner, 10_000 * 1e18);
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    function _afterTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override(ERC20Upgradeable, ERC20VotesUpgradeable) {
        super._afterTokenTransfer(from, to, amount);
    }

    function _mint(address to, uint256 amount)
        internal
        override(ERC20CappedUpgradeable, ERC20VotesUpgradeable)
    {
        super._mint(to, amount);
    }

    function _burn(address account, uint256 amount)
        internal
        override(ERC20Upgradeable, ERC20VotesUpgradeable)
    {
        super._burn(account, amount);
    }
}
