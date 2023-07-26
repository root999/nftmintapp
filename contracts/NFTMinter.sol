// SPDX-License-Identifier: MIT 
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract NftMinter is ERC721URIStorage,Ownable{
    uint public nftCost = 1 ether;
    uint private _treasuryShare = 4;
    uint private _liquidtyShare = 6;

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    event Minted(address by,uint tokenId);

    address private liquidityAddress;
    address private treasuryAddress;
   
    constructor(address treasuryAddr,address liqudityAddr)ERC721("NFTMinter","TST") {
        treasuryAddress = treasuryAddr;
        liquidityAddress = liqudityAddr;
    }
    function supportsInterface(bytes4 interfaceId)
        public view virtual override
        returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    function _burn(uint256 tokenId)internal virtual override{
        super._burn(tokenId);
    }

    function burnNFT(uint256 tokenId) public {
        _burn(tokenId);
    }

    function mintNFT(address recipient,string memory tokenURI) external payable returns(uint256){
        if(msg.sender != owner()){
            require(msg.value == nftCost,"nft cost");
            uint256 treasury  = (msg.value * _treasuryShare) / 100 ; 
            uint256 royalty = (msg.value * _liquidtyShare) / 100 ; 
            _payTreasury(treasury);
            _payLiquidity(royalty);
            _payOwner(msg.value - treasury - royalty);
        }
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _safeMint(recipient,newItemId);
        _setTokenURI(newItemId, tokenURI);
        emit Minted(recipient, newItemId);
        return newItemId;
    }

    function _setNftCost(uint newPrice) private onlyOwner {
        nftCost = newPrice;
    }

    function _payLiquidity(uint _fee ) internal {
        (bool success, ) = payable(liquidityAddress).call{value: _fee}("");
        require(success);
    }
     function _payTreasury(uint _fee ) internal {
        (bool success, ) = payable(treasuryAddress).call{value: _fee}("");
        require(success);
    }
     function _payOwner(uint _fee ) internal {
        (bool success, ) = payable(owner()).call{value: _fee}("");
        require(success);
    }

    function transferNFT(address from,address to, uint tokenId) external payable{
        require(from != address(0x0), 'invalid from address');
        require(to != address(0x0), 'invalid to address');
        require(tokenId > 0, 'invalid tokenId');
        require(tokenId <= _tokenIds.current(), 'invalid tokenId');
        require(_isApprovedOrOwner(_msgSender(), tokenId), 'msgSender is not the owner of the token');
        if(msg.value > 0){
            uint256 treasury  = (msg.value * _treasuryShare) / 100 ; 
            uint256 royalty = (msg.value * _liquidtyShare) / 100 ; 
            _payTreasury(treasury);
            _payLiquidity(royalty);
            _payOwner(msg.value-treasury-royalty);
            _transfer(from, to, tokenId);
        }
    }
}