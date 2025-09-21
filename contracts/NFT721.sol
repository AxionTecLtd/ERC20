// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// 每个 NFT 通过唯一的 tokenId 标识，不存在“数量”，这是和 ERC20 的最大区别。

/// @title MyNFT
/// @notice 一个最小的 ERC721 示例
contract MyNFT is ERC721,Ownable {

// 记录下一个 tokenId（从 0 开始）
uint256 private _nextTokenId;

  /// @notice 构造器，设置 NFT 名称、符号和合约拥有者
    constructor() ERC721("MyNFT", "MNFT") Ownable(msg.sender) {}


/// @notice mint新的nft OpenZeppelin 官方推荐参数不用 _ 前缀（避免和状态变量混淆）
/// @dev 只能合约拥有者调用，mint 一个 NFT 给指定地址
/// @param to 接收人的地址
function mint(address to) public onlyOwner{
    // 获取初始id,并赋值并记录
    uint256 tokenId = _nextTokenId;
    // 更新状态变量值
    _nextTokenId++;
    _mint(to,tokenId);

}

/// @notice 返回下一个可 mint 的 tokenId
function getNextTokenId() external view returns(uint256){
    return _nextTokenId;
}

}