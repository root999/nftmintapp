const nftMinter = artifacts.require("NftMinter");

module.exports = function(deployer){
    deployer.deploy(nftMinter,"0x5D84b50E7d2942d7234c1b6DF23C2e9bb4f31a28","0x02eEa68c288c2Fcce293115Af342A6D45d85b01e" );
    const fs = require('fs');
    const contract = JSON.parse(fs.readFileSync('./build/contracts/NftMinter.json', 'utf8'));
    console.log(JSON.stringify(contract.abi));
}
// 0x28aca4827736c78bA1EF9a039F15220652576740  --> owner
// "0x5D84b50E7d2942d7234c1b6DF23C2e9bb4f31a28" --> treasury
// "0x02eEa68c288c2Fcce293115Af342A6D45d85b01e"  --> liq