require('dotenv').config();
const key = process.env.REACT_APP_PINATA_KEY;
const secret = process.env.REACT_APP_PINATA_SECRET;
const axios = require('axios');
const FormData = require('form-data');

export const pinJSONToIPFS = async(JSONBody) => {
    const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
    return axios.post(url,JSONBody,{
        headers:{
            pinata_api_key:key,
            pinata_secret_api_key:secret
        }
    })
    .then(function(response){
        return {
            success:true,
            pinataUrl:"https://gateway.pinata.cloud/ipfs/" + response.data.IpfsHash
        }
    })
    .catch(function (error){
        console.log(error)
        return{
            success:false,
            message:error.message
        }
    });
};

export const pinFileToIPFS = async(event) => {
    const formData = new FormData();
    const metadata = JSON.stringify({
        name: 'File name',
      });
      formData.append('pinataMetadata', metadata);
    const file = event.target.files[0];
    formData.append('file', file)
    const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
    return axios.post(url, formData, {
        maxBodyLength: "Infinity",
        headers: {
          'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
          pinata_api_key:key,
          pinata_secret_api_key:secret
        }
      })
    .then(function(response){
        return {
            success:true,
            pinataUrl:"https://gateway.pinata.cloud/ipfs/" + response.data.IpfsHash
        }
    })
    .catch(function (error){
        console.log(error)
        return{
            success:false,
            message:error.message
        }
    });
  
  
}

