import {pinJSONToIPFS} from './pinata.js'

var Contract = require('web3-eth-contract');

const { Web3 } = require('web3');

var web3 = new Web3("ws://localhost:8545");

const contractABI = require('../contract-abi.json');
const contractAddress = "0x8BeeecB1fC4A058fB887c2f233D55b791e4a01a2";


export const mintNFT = async (image, name, description,price) => {
    //error handling
    if (image.trim() == "" || (name.trim() == "" || description.trim() == "") || price.trim() == "") { 
        return {
        success: false,
        status: "❗Please make sure all fields are completed before minting.",
        }
   }
    //make metadata
    const metadata = new Object();
    metadata.name = name;
    metadata.image = image;
    metadata.description = description;

    //make pinata call
    const pinataResponse = await pinJSONToIPFS(metadata);
    if (!pinataResponse.success) {
        return {
            success: false,
            status: "😢 Something went wrong while uploading your tokenURI.",
        }
    } 
    const tokenURI = pinataResponse.pinataUrl;  
 
    window.contract = new Contract(contractABI, contractAddress);//loadContract();
    //set up your Ethereum transaction
    const transactionParameters = {
        to: contractAddress, // Required except during contract publications.
        from: window.ethereum.selectedAddress, // must match user's active address.
        data: window.contract.methods.mintNFT(window.ethereum.selectedAddress, tokenURI).encodeABI(),
        value:parseInt(web3.utils.toWei(price,"ether")).toString(16)
        //make call to NFT smart contract 
    };

    //sign transaction via Metamask
    try {
        const txHash = await window.ethereum
            .request({
                method: 'eth_sendTransaction',
                params: [transactionParameters],
            });
        return {
            success: true,
            status: "✅ Check out your transaction on Etherscan: https://goerli.etherscan.io/tx/" + txHash
        }
    } catch (error) {
        return {
            success: false,
            status: "😥 Something went wrong: " + error.message
        }
    }
}

export const connectWallet = async () =>{
    if(window.ethereum){
        try{
            const addressArray = await window.ethereum.request({
                method : "eth_requestAccounts",
            });
            const obj = {
                status : "Write some message",
                address : addressArray[0]
            };
            return obj;
        }
        catch(err){
            return {
                address:"",
                status:err.message
            };
        }
       
    }else{
        return{
            address:"",
            status:(
                <span>
                    <p>
                    {" "}
            🦊{" "}
            <a target="_blank" href={`https://metamask.io/download.html`}>
              You must install Metamask, a virtual Ethereum wallet, in your
              browser.
            </a>
                    </p>
                </span>
            )
        }
    }
}

export const getCurrentWalletConnected = async () => {
    if(window.ethereum){
        try{
            const addressArray = await window.ethereum.request({
                method:"eth_accounts",
            });
            if(addressArray.length > 0 ){
                return {
                    address: addressArray[0],
                    status:"Connected Account connected Again"
                };
            }else{
                return{
                    address:"",
                    status : "Connect using the button"
                };
            }
        }
        catch(err){
            return{
                address:"",
                status:err.message
            };
        }
    }else{
        return{
            address:"",
            status:( <span>
                <p>
                  {" "}
                  🦊{" "}
                  <a target="_blank" href={`https://metamask.io/download.html`}>
                    You must install Metamask, a virtual Ethereum wallet, in your
                    browser.
                  </a>
                </p>
              </span>),
        };
    }
};