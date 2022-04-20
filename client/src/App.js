import React, { useEffect,useState } from "react";
import MembershipNFT from "./contracts/MembershipNFT.json";
import Market from "./contracts/Market.json";
import getWeb3 from "./getWeb3";
import 'bootstrap/dist/css/bootstrap.min.css';

import "./App.css";
// import React from "react";

const App= () =>{

  const [account, setAccount] = useState("");
  const [marktcontract, setContract] = useState("");
  const [nftcontract, setContract2] = useState("");
  const [mintText, setMintText] = useState("");
  const [coders, setCoders] = useState([]);


  const loadNFTS = async (contract) => {
    
    // const totalSupply = await contract.methods.balanceOf(1).call();
    // console.log(totalSupply);
    // console.log("trying again");
    // let results = [];
    // for(let i = 0; i < totalSupply; i++){
    //   let coder = await contract.methods.coders(i).call();
    //   results.push(coder)
    // }
    // setCoders(results);
  }

  const loadWeb3Account = async (web3) =>{
    const accounts = await web3.eth.getAccounts();
    if(accounts){
      setAccount(accounts[0]);
    }
  }

  const loadWeb3Contract = async (web3) => {
    const networkId = await web3.eth.net.getId();
    const networkData = Market.networks[networkId];
    // const networkData2 = MembershipNFT.networks[networkId];
    if(networkData){
      const abi = Market.abi;
      const address = networkData.address;
      const marktcontract = new web3.eth.Contract(abi, address);
      setContract(marktcontract);
      return marktcontract;
    }

    // if(networkData2){
    //   const abi2 = MembershipNFT.abi;
    //   const address2 = networkData2.address;
    //   const nftcontract = new web3.eth.Contract(abi2, address2);
    //   setContract2(nftcontract);
    //   return nftcontract;
    // }
  }

  useEffect(async ()=>{
    const web3 = await getWeb3();
    await loadWeb3Account(web3);
    const contract = await loadWeb3Contract(web3);
    await loadNFTS(contract);
  }, [])



return <div>
  <nav className="navbar navbar-light bg-light">
  <div className="container-fluid">
    <a className="navbar-brand" href="#">NFT BAZAR</a>
  </div>
</nav>

<div className="container-fluid mt-5">
      <div className="row">
        <div className="col d-flex flex-column align-items-center">
        <img className="mb-4" src="https://avatars.dicebear.com/api/pixel-art/naz.svg" alt="" width="72"/>
        <h1 className="display-5 fw-bold">Crypto NFTs</h1>
        <div className="col-6 text-center mb-3" >
            <p className="lead text-center">These are some of the most highly motivated coders in the world! We are here to learn coding and apply it to the betterment of humanity. We are inventors, innovators, and creators</p>
            <div></div>

        </div>
  
</div>
</div></div>
</div>;
};

export default App;



// class App extends Component {
//   state = { storageValue: 0, web3: null, accounts: null, contract: null };

//   componentDidMount = async () => {
//     try {
//       // Get network provider and web3 instance.
//       const web3 = await getWeb3();

//       // Use web3 to get the user's accounts.
//       const accounts = await web3.eth.getAccounts();

//       // Get the contract instance.
//       const networkId = await web3.eth.net.getId();
//       const deployedNetwork = SimpleStorageContract.networks[networkId];
//       const instance = new web3.eth.Contract(
//         SimpleStorageContract.abi,
//         deployedNetwork && deployedNetwork.address,
//       );

//       // Set web3, accounts, and contract to the state, and then proceed with an
//       // example of interacting with the contract's methods.
//       this.setState({ web3, accounts, contract: instance }, this.runExample);
//     } catch (error) {
//       // Catch any errors for any of the above operations.
//       alert(
//         `Failed to load web3, accounts, or contract. Check console for details.`,
//       );
//       console.error(error);
//     }
//   };

//   runExample = async () => {
//     const { accounts, contract } = this.state;

//     // Stores a given value, 5 by default.
//     await contract.methods.set(5).send({ from: accounts[0] });

//     // Get the value from the contract to prove it worked.
//     const response = await contract.methods.get().call();

//     // Update state with the result.
//     this.setState({ storageValue: response });
//   };

//   render() {
//     if (!this.state.web3) {
//       return <div>Loading Web3, accounts, and contract...</div>;
//     }
//     return (
//       <div className="App">
//         <h1>Good to Go!</h1>
//         <p>Your Truffle Box is installed and ready.</p>
//         <h2>Smart Contract Example</h2>
//         <p>
//           If your contracts compiled and migrated successfully, below will show
//           a stored value of 5 (by default).
//         </p>
//         <p>
//           Try changing the value stored on <strong>line 42</strong> of App.js.
//         </p>
//         <div>The stored value is: {this.state.storageValue}</div>
//       </div>
//     );
//   }
// }

// export default App;
