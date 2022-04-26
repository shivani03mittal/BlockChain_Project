import { useState, useEffect } from 'react'
import React, { Component }  from 'react';
import { ethers } from "ethers"
import { Row, Col, Card, Button ,Table} from 'react-bootstrap'
import { Link } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import getWeb3 from "../Web3Client";
// import { api } from "../../services/api";
// import Button from '@material-ui/core/Button';

import NFTMarketplace from '../contracts/Market.json'
import NFTtoken from '../contracts/MembershipNFT.json'
const Home = ({ marketplace, nft }) => {
  const [loading, setLoading] = useState(true)
  const [itemsList, setItems] = useState([])
  const loadMarketplaceItems = async () => {
    // Load all unsold items
    let itemsList = [];
    // let data = await marketplace.methods.getMarketItems().call();
    // let itemcount= await marketplace.methods.Itemscount();
// console.log("get count", itemcount);
    //  await marketplace.methods.Itemscount.call(function(err,res)
    // {
    // itemCount = res;
  // });
  
    const totalSupply = await nft.methods
    .totalSupply()
    .call();

    const totalItemsForSale = await marketplace.methods
    .totalItemsForSale()
    .call();

    console.log("totalsupplyfor sale :", totalSupply);
    console.log("totalsupplyfor_sale :", totalItemsForSale);

    for (var tokenId = 1; tokenId <= totalSupply; tokenId++) {
      let item = await nft.methods.Items(tokenId).call();
      let owner = await nft.methods.ownerOf(tokenId).call();

        const itemfromlist = await marketplace.methods.idtolistings(tokenId);
        console.log("check", itemfromlist);
        
        const uri = await nft.methods.tokenURI(itemfromlist.tokenId)
        
        // use uri to fetch the nft metadata stored on ipfs 
        // const response = await fetch(uri)
        // const metadata = await response.json()


        itemsList.push({
          tokenId: item.id,
                  creator: item.creator,
                      owner: owner,
                      uri: item.uri,
                      isForSale: false,
                      saleId: null,
                      price: 0,
                      isSold: null,
                    });
        
                  
        if (totalItemsForSale > 0) {
          for (var saleId = 1; saleId <= totalItemsForSale; saleId++) {
            let item = await marketplace.methods
              .idtolistings(saleId)
              .call();

              console.log("totalsupplyfor sale :", item);
            let active = await marketplace.methods
              .activeItems(item.tokenId)
              .call();

              console.log("active :", active);
            let itemListIndex = itemsList.findIndex(
              (i) => i.tokenId === item.tokenId
            );

            itemsList[itemListIndex] = {
              ...itemsList[itemListIndex],
              isForSale: active,
              seller:item.seller,
              saleId: item.id,
              price: item.price,
              isSold: item.isSold,
            };
          }
        }
      }
      console.log("totalsupplyfor sale :",itemsList );
  //   for (let i = 1; i <= itemCount; i++) {
  //     const item = await nft.Items(i)
  //     // if (!item.sold) 
  //     {
  //       // get uri url from nft contract
  //       const uri = await nft.tokenURI(item.id)
  //       // use uri to fetch the nft metadata stored on ipfs 
  //       const response = await fetch(uri)
  //       const metadata = await response.json()
  //       // get total price of item (item price + fee)
  //       const totalPrice = await marketplace.getTotalPrice(item.itemId)
  //       // Add item to items array
  //       items.push({
        
  //         itemId: item.itemId,
  //         seller: item.seller,
  //         name: metadata.name,
  //         description: metadata.description,
  //         image: metadata.image
  //       })
  //     }
  //   }
    setLoading(false)
    setItems(itemsList)
  }

  // const buyMarketItem = async (item) => {
  //   await (await marketplace.purchaseItem(item.itemId, { value: item.totalPrice })).wait()
  //   loadMarketplaceItems()
  // }
  console.log("Nft :", itemsList);

  useEffect(() => {
    loadMarketplaceItems()
  }, [])
  if (loading) return (
    <main style={{ padding: "1rem 0" }}>
      <h2>Loading...</h2>
    </main>
  )
  return (
    <div className="flex justify-center">
      {itemsList.length > 0 ?
        <div className="px-2 container">
          <Row xs={1} md={1} lg={2} className="g-4 py-5">
            {itemsList.map((itemsList, idx) => (
              <Col key={idx} className="overflow-hidden">
                <Card>
                  <Card.Img variant="top" src={itemsList.image} />
                  <Card.Body variant="Dark">
                    <Card.Title>{"MembershipNFT"}</Card.Title>
                    <Table responsive striped>
                    <tbody>
                      <tr><td style={ { whiteSpace: 'normal' }}>{"TokenId: "}</td><td>{itemsList.tokenId}</td></tr>
                      <tr><td>{"Creater: "}</td><td>{itemsList.creator}</td></tr>
                      <tr><td >{"Owner: "}</td><td style={ { whiteSpace: 'normal' }}>{itemsList.owner}</td></tr>
                      <tr><td>{"URI: "}</td><td>{itemsList.uri}</td></tr>
                      <tr><td>{"SaleId: "}</td><td>{itemsList.saleId}</td></tr>
                      <tr><td>{"Active for Sale: "}</td><td>{(itemsList.isForSale).toString()}</td></tr>
                      <tr><td>{"Price: "}</td><td>{(itemsList.price).toString()}</td></tr>
                      <tr><td>{"Is Sold: "}</td><td>{(itemsList.isSold).toString()}</td></tr>
                      <tr><td>{"Seller: "}</td><td>{(itemsList.seller).toString()}</td></tr>

                      </tbody>
                    </Table>
                    {/* <Card.Text>
                    {"TokenId: "}
                      {itemsList.tokenId}
                    <br></br>
                      {"Owner: "}
                      {itemsList.owner}
                    </Card.Text> */}
                    <Card.Text>
                      {/* {"Seller: "}
                      {itemsList.seller}
                      {"Price: "}
                      {itemsList.price} */}
                    </Card.Text>
                  </Card.Body>
                  <Card.Footer>
                    <div className='d-grid'>
                      {/* <Button onClick={() => buyMarketItem(item)} variant="primary" size="lg">
                        Buy for {ethers.utils.formatEther(item.totalPrice)} ETH
                      </Button> */}
                    </div>
                  </Card.Footer>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
        : (
          <main style={{ padding: "1rem 0" }}>
            <h2>No listed assets</h2>
          </main>
        )}
    </div>
    // <div>YOOO</div>
  );
}
export default Home