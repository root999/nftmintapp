# nftmintapp

NftMintApp is a project to demonstrate how to create a basic nft mint dapp and how to create an nft smart contract. It uses ERC721URIStorage contract as a base contract to handle dynamic uri storage and support ERC721 token standard.
The contract also supports Royalty, but it doesnt support ERC-2981 standard mainly because the standard only supports for one wallet address for royalty. In this implementation, there are two main wallets, one to provide liquidity and one for treasury.
In all minting and transfer actions, %6 of the price goes into the treasury wallet, %4 of the price goes into the liquidity wallet. Mint price is 1 ether default.
