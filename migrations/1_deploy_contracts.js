const nftMinter = artifacts.require("NftMinter");

module.exports = function(deployer){
    deployer.deploy(nftMinter,"0x84B0c5741EE33477C181353808D104B36829Ca13","0xFD058DFB8BAa49d390e42ffF25BcCd953Af1dD84" );
}
// 0x45B1c50e3Bbd8F69b4c312C4a6b33d5A007Ca373  --> owner
// "0x84B0c5741EE33477C181353808D104B36829Ca13" --> treasury
// "0xFD058DFB8BAa49d390e42ffF25BcCd953Af1dD84"  --> liq