// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract My1155Token is ERC1155,Ownable {

constructor() ERC1155("https://game.example/api/item/{id}.json") Ownable(msg.sender){}

   /// @notice Mint 单个代币
   // @dev 可用于 可替代代币，也可让 amount = 1 代表 NFT（不可替代）
   /// @param id：代币 ID
  /// @param  amount：数量
   
   function mint(address to,uint256 id ,uint256 amount ) public  onlyOwner {
    _mint(to,id,amount,"");
   }
/// @notice Mint 批量代币
function mintBatch(address to ,uint256[] memory ids,uint256[] memory amounts) 
public onlyOwner{
    _mintBatch(to,ids,amounts,"");
}


}