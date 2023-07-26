const truffleAssert = require('truffle-assertions');

const nftMinter = artifacts.require("NftMinter");

contract("NftMinter",function(accounts){
    it("should do something",async ()=>{
        const nftMinterInstance = await nftMinter.deployed();
        const ERC721InterfaceId = "0x80ac58cd";
        const ERC2981InterfaceId = "0x2a55205a";
        var isERC721 = await nftMinterInstance.supportsInterface(ERC721InterfaceId);
        assert.equal(isERC721, true, "NftMinter is not an ERC721");
    })
    it("should mint an nft and should not pay fee",async () =>{
        const nftMinterInstance = await nftMinter.deployed();
        var result = await nftMinterInstance.mintNFT("0xFD058DFB8BAa49d390e42ffF25BcCd953Af1dD84","testtest",{value:web3.utils.toWei('1', 'ether') ,from:accounts[1]});
        console.log(result)
        assert.equal(result.logs[2].args[1].toNumber(),1,"You couldn't create an nft")
    })  
})