// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// 使用 OZ 的标准实现，避免重复造轮子
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @notice 简单示例：部署时给部署者 mint 初始供应量（以 token 为单位）,并支持mint和burn
contract MyToken is ERC20,Ownable {
    constructor(uint256 initialSupplyTokens) 
    ERC20 ("MyToken","MIK")
    Ownable(msg.sender)  // ⚡ 这里传入部署者
    {
        // decimals() 默认为 18，所以把传入的 token 数乘以 10**18
        _mint(msg.sender,initialSupplyTokens*(10**uint256(decimals())));
    }

    /// @notice 增发 token，只能合约拥有者调用
    /// @param _to 接收地址
    /// @param _amount 增发数量（以最小单位 wei）
    function mint(address _to ,uint256 _amount) external onlyOwner {
        _mint(_to,_amount);
    }

    /// @notice 销毁 token，只能合约拥有者调用
    /// @param _from 销毁地址
    /// @param _amount 销毁数量（以最小单位 wei）
    function burn( address _from ,uint256 _amount) external onlyOwner {
        _burn(_from,_amount);
    }


}
