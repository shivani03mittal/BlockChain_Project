import { useState } from 'react'
import React, { Component }  from 'react';
import { ethers } from "ethers"
import { Row, Form, Button } from 'react-bootstrap'
import { Link, useHistory } from "react-router-dom";
import { TextField } from '@material-ui/core';

const Create = ({ marketplace, nft, account }) => {
    
    const [price, setPrice] = useState(null)
    const [uri, setURI] = useState('')
    const [tokenId, settokenId] = useState(null)

    const mintNFT= async (event) => {
        event.preventDefault()
    
        try {
            const receipt = await nft.methods
              .mint(uri)
              .send({ from: account });
            console.log(receipt);
            console.log(receipt.events.Transfer.returnValues.tokenId);
      
           
          } catch (error) {
            console.error("Error, minting: ", error);
            alert("Error while minting!");
          }

    }

    // 
    const listNFT= async (event) => {
        event.preventDefault()
    
        try {
                  
            const receipt = await marketplace.methods
              .listToken(tokenId, price)
              .send({ gas: 210000, from: account });
            console.log(receipt);
          } catch (error) {
            console.error("Error, puting for sale: ", error);
            alert("Error while puting for sale!");
          }
    }
    
    
    return (
        <>
        <div className="container-fluid mt-5">
            <div><h2><strong>Mint Membership NFT</strong></h2></div>
            <br></br>
            <br></br>
          <div className="row">
            <main role="main" className="col-lg-3 mx-auto" style={{ maxWidth: '1000px' }}>
              <div className="content mx-auto">
                <Row className="g-4 ">
                <form class="was-validated">
                
                <div class="form-group row">
                    
                <label for="staticEmail" class="col-sm-5 col-form-label"><h5>Token Name</h5></label>
                <div class="col-sm-5">
                    <b>
                <input type="text" readonly class="form-control-plaintext col-sm-5" id="staticEmail"value="Membership NFT"></input></b>
               
                </div>
                <div class="valid-feedback">Valid.</div>
                <div class="invalid-feedback">Please fill out this field.</div>

                <div class="form-group row">
    <label for="uri" class="col-sm-5 col-form-label"><h5>URI</h5></label>
    <div class="col-sm-5">
    <Form.Control onChange={(e) => setURI(e.target.value)} size="sm" required type="text" placeholder="URI.." />
      
    </div>
  </div>
                
               
            </div>
                </form>
                  {/* <Form.Control
                    type="file"
                    required
                    name="file"
                    onChange={}
                  />
                  <Form.Control onChange={(e) => setName(e.target.value)} size="lg" required type="text" placeholder="Name" />
                  <Form.Control onChange={(e) => setDescription(e.target.value)} size="lg" required as="textarea" placeholder="Description" />
                  <Form.Control onChange={(e) => setPrice(e.target.value)} size="lg" required type="number" placeholder="Price in ETH" /> */}
                  
                 
                 
                </Row>
              </div>
              <br></br>
              <Button onClick={mintNFT} variant="primary">MintNFT</Button>
            </main>
          </div>

          
        </div>
{/* ########################################################## */}
<div className="container-fluid mt-5">
            <div><h2><strong>List For Sale</strong></h2></div>
            <br></br>
            <br></br>
          <div className="row">
            <main role="main" className="col-lg-3 mx-auto" style={{ maxWidth: '1000px' }}>
              <div className="content mx-auto">
                <Row className="g-4 ">
                <form class="was-validated">
                
                <div class="form-group row">
                    
                <label for="staticEmail" class="col-sm-5 col-form-label"><h5>Token Name</h5></label>
                <div class="col-sm-5">
                    <b>
                <input type="text" readonly class="form-control-plaintext col-sm-5" id="staticEmail"value="Membership NFT"></input></b>
               
                </div>
                <div class="valid-feedback">Valid.</div>
                <div class="invalid-feedback">Please fill out this field.</div>
                <div class="form-group row">
    <label for="torknid" class="col-sm-5 col-form-label"><h5>Token ID</h5></label>
    <div class="col-sm-5">
    <Form.Control onChange={(e) => settokenId(e.target.value)} size="sm" required type="number" placeholder="Tokrn Id" />
      
    </div>
  </div>

                <div class="form-group row">
    <label for="uri" class="col-sm-5 col-form-label"><h5>Price</h5></label>
    <div class="col-sm-5">
    <Form.Control onChange={(e) => setPrice(e.target.value)} size="sm" required type="number" placeholder="Price in WEI" />
      
    </div>
  </div>      
            </div>
                </form>
                  {/* <Form.Control
                    type="file"
                    required
                    name="file"
                    onChange={}
                  />
                  <Form.Control onChange={(e) => setName(e.target.value)} size="lg" required type="text" placeholder="Name" />
                  <Form.Control onChange={(e) => setDescription(e.target.value)} size="lg" required as="textarea" placeholder="Description" />
                  <Form.Control onChange={(e) => setPrice(e.target.value)} size="lg" required type="number" placeholder="Price in ETH" /> */}
                  
                 
                 
                </Row>
              </div>
              <br></br>
              <Button onClick={listNFT} variant="primary">List Token</Button>
            </main>
          </div>

          
        </div>

        </>

      );
    }

export default Create
    