import { useEffect, useState } from "react";
import { connectWallet ,getCurrentWalletConnected,mintNFT} from "./utils/interact";
import {pinFileToIPFS, pinJSONToIPFS} from './utils/pinata.js';
const Minter = (props) => {

  //State variables
  const [walletAddress, setWallet] = useState("");
  const [status, setStatus] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState('');
  const [price, setPrice] = useState('');
  useEffect(async () => {  
    const {address, status} = await getCurrentWalletConnected();
    setWallet(address);
    setStatus(status);
  }, []);

  const connectWalletPressed = async () => { 
    const walletResponse = await connectWallet();
    setStatus(walletResponse.status);
    setWallet(walletResponse.address);
    addWalletListener()

   
  };

  const onMintPressed = async () => { 
    try{
      console.log("test "+ price)
      const { status } = await mintNFT(image, name, description,price);
      setStatus(status);
    }
    catch(err){
      setStatus("Error in mint: "+ err.message);
    }
   
  };

  const onImageSelected = async (event) => { //TODO: implement
    var response = await pinFileToIPFS(event);
    setImage(response.pinataUrl);
  };
  const addWalletListener = () => {
    if(window.ethereum){
      window.ethereum.on("accountsChanged", (accounts) => {
        if(accounts.length > 0 ){
          setWallet(accounts[0]);
          setStatus("Status Changed");
        }
        else{
          setWallet("");
          setStatus("Connect to Metamask")
        }
      });
    }
    else{
      setStatus( <p>
        {" "}
        🦊{" "}
        <a target="_blank" href={`https://metamask.io/download.html`}>
          You must install Metamask, a virtual Ethereum wallet, in your
          browser.
        </a>
      </p>);
    }
  }

  return (
    <div className="Minter">
      <button id="walletButton" onClick={connectWalletPressed}>
        {walletAddress.length > 0 ? (
          "Connected: " +
          String(walletAddress).substring(0, 6) +
          "..." +
          String(walletAddress).substring(38)
        ) : (
          <span>Connect Wallet</span>
        )}
      </button>

      <br></br>
      <h1 id="title">NFT Minter</h1>
      <p>
        Simply add your asset's link, name, and description, then press "Mint. Mint price is 1 Ether. Feel free to send us more"
      </p>
      <form>
        <h2>🖼 Add Asset: </h2>
        <div>
        <img src={image} width={250} height={250}/>
        <input
          type="file"
          onChange={(event) => onImageSelected(event)}
        />
        
        </div>
       
        <h2>🤔 Name: </h2>
        <input
          type="text"
          placeholder="e.g. My first NFT!"
          onChange={(event) => setName(event.target.value)}
        />
        <h2>✍️ Description: </h2>
        <input
          type="text"
          placeholder="e.g. Even cooler than cryptokitties ;)"
          onChange={(event) => setDescription(event.target.value)}
        />
        <h2>✍️ Price: </h2>
        <input
          type="text"
          placeholder="1 Ether"
          onChange={(event) => setPrice(event.target.value)}
        />
      </form>
      <button id="mintButton" onClick={onMintPressed}>
        Mint NFT
      </button>
      <p id="status">
        {status}
      </p>
    </div>
  );
};

export default Minter;
