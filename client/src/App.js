import React, { useState, useEffect } from "react";
import Navigation from './components/Navbar';
import Home from './components/Home'
import Create from './components/Create'
import MyListedItems from './components/MyListedItems'
import MyPurchases from './components/MyPurchases'
import getWeb3 from "./Web3Client";
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import MarketplaceAbi from './contracts/Market.json'
// import MarketplaceAddress from './contracts/Marketaddress.json'
import NFTAbi from './contracts/MembershipNFT.json'
import { ethers } from "ethers"
import { Spinner } from 'react-bootstrap'


import './App.css';
const App = () => {
  const [loading, setLoading] = useState(true)
  const [account, setAccount] = useState(null)
  const [nftTokenContract, setNFT] = useState({})
  const [marketplaceContract, setMarketplace] = useState({})


//   const loadWeb3Account = async (web3) =>{
//     const accounts = await web3.eth.getAccounts();
//     if(accounts){
//       setAccount(accounts[0]);
//     }
//   }

//   const loadWeb3Contract = async (web3) => {
//     const networkId = await web3.eth.net.getId();

//     const marketnetwork = MarketplaceAbi.networks[networkId];
//     if(marketnetwork){
//       const abi = MarketplaceAbi.abi;
//       const address = marketnetwork.address;
//       const marketplace = new web3.eth.Contract(abi, address);
//       setMarketplace(marketplace)

//       // return contract;
//       const nftnetwork = NFTAbi.networks[networkId];
//     if(nftnetwork){
//       const abi = NFTAbi.abi;
//       const address = nftnetwork.address;
//       const nftcontract = new web3.eth.Contract(abi, address);
//       setNFT(nft)
//       setLoading(false)
//     }
//   }
// }



useEffect(async ()=>{
  const init = async () => {
    try {
      const web3 = await getWeb3();
      const accounts = await web3.eth.getAccounts();

      if (typeof accounts === undefined) {
        alert("Please login with Metamask!");
        console.log("login to metamask");
      }

      const networkId = await web3.eth.net.getId();
        try {
          const nftTokenContract = new web3.eth.Contract(
            NFTAbi.abi,
            NFTAbi.networks[networkId].address
          );

          const marketplaceContract = new web3.eth.Contract(
            MarketplaceAbi.abi,
            MarketplaceAbi.networks[networkId].address
          );

          setAccount(accounts[0]);
          setMarketplace(marketplaceContract);
          setNFT(nftTokenContract);
          setLoading(false);

        }catch (error) {
          console.error("Error", error);
          alert(
            "Contracts not deployed to the current network " +
              networkId.toString()
          );
        }
      } catch (error) {
        alert(
          `Failed to load web3, accounts, or contract. Check console for details.` +
            error
        );
        console.error(error);
      }
    };
    init();
  // }, [dispatch]);

          // const totalSupply = await nftTokenContract.methods
          //   .totalSupply()
          //   .call();
          // const totalItemsForSale = await marketplaceContract.methods
          //   .totalItemsForSale()
          //   .call();
//   const web3 = await getWeb3();
//   await loadWeb3Account(web3);
//   const contract = await loadWeb3Contract(web3);
//   // await loadNFTS(contract);
}, [])


return (
  <BrowserRouter>
    <div className="App">
      <>
        <Navigation  account={account} />
      </>
      <div>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
            <Spinner animation="border" style={{ display: 'flex' }} />
            <p className='mx-3 my-0'>Awaiting Metamask Connection...</p>
          </div>
        ) : (
          <Routes>
            <Route path="/" element={
              <Home marketplace={marketplaceContract} nft={nftTokenContract} />
            } />
            <Route path="/create" element={
              <Create marketplace={marketplaceContract} nft={nftTokenContract} />
            } />
            <Route path="/my-listed-items" element={
              <MyListedItems marketplace={marketplaceContract} nft={nftTokenContract} account={account} />
            } />
            <Route path="/my-purchases" element={
              <MyPurchases marketplace={marketplaceContract} nft={nftTokenContract} account={account} />
            } />
          </Routes>
        )}
      </div>
    </div>
  </BrowserRouter>

);

}

export default App;
