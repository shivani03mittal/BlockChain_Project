import { useState, useEffect } from 'react'
import { ethers } from "ethers"
import { Row, Col, Card ,Table} from 'react-bootstrap'
import React, { Component }  from 'react';
import image from './nftimage.png'

export default function MyPurchases({ marketplace, nft, account }) {
  const [loading, setLoading] = useState(true)
  const [itemsList, setPurchases] = useState([])

  const loadPurchasedItems = async () => {
    
    let itemsList = [];
    const totalSupply = await nft.methods
    .totalSupply()
    .call();

    const totalItemsForSale = await marketplace.methods
    .totalItemsForSale()
    .call();
    console.log("totalsupplyfor_sale :", totalItemsForSale);

    for (var id = 1; id <= totalItemsForSale; id++) {
      console.log(id);
      console.log(totalSupply);
    const itemfromlist = await marketplace.methods.idtolistings(id).call();
    console.log("seller",itemfromlist);
    const tokenId= itemfromlist.tokenId;
    console.log("token id", tokenId);
    let owner = await nft.methods.ownerOf(tokenId).call();
      if( itemfromlist.seller==account){
          if(itemfromlist.isSold == false ){
           {

        let item = await nft.methods.Items(tokenId).call();
         
        itemsList.push({
            tokenId: item.id,
                    creator: item.creator,

                        owner: owner,
                        uri: item.uri,
                        isForSale: false,
                        saleId: null,
                        price: 0,
                        isSold: false,
                      });

                         
        if (totalItemsForSale > 0) {
            for (var saleId = 1; saleId <= totalItemsForSale; saleId++) {
              let item = await marketplace.methods
                .idtolistings(saleId)
                .call();
  
                console.log("totalsupplyfor sale :", item.tokenId);
              let active = await marketplace.methods
                .activeItems(item.tokenId)
                .call();
  
                console.log("active :", active);
              let itemListIndex = itemsList.findIndex(
                (i) => i.tokenId === item.tokenId
              );
  
              itemsList[itemListIndex] = {
                ...itemsList[itemListIndex],
              
                seller:item.seller,
                isForSale: active,
                saleId: item.id,
                price: item.price,
                isSold: item.isSold,
              };
            }
          }

       }
      }
      else{
        continue;
      }
    }
    else{
      continue;
    }
    }
    console.log("list:",itemsList );
   
     
      setLoading(false)
      setPurchases(itemsList)
    }
    useEffect(() => {
      loadPurchasedItems()
    }, [])
    if (loading) return (
      <main style={{ padding: "1rem 0" }}>
        <h2>Loading...</h2>
      </main>
    )

  return (
    <div className="flex justify-center">
      {itemsList.length > 0 ?
        <div className="px-5 container">
          <Row xs={1} md={1} lg={2} className="g-4 py-5">
            {itemsList.map((itemsList, idx) => (
              <Col key={idx} className="overflow-hidden">
                <Card>
                <Card.Img variant="top" src={image} />
                  <Card.Body variant="Dark">
                    <Card.Title>{"MembershipNFT"}</Card.Title>
                    <Table responsive striped>
                    <tbody>
                      <tr><td style={ { whiteSpace: 'normal' }}>{"TokenId: "}</td><td>{itemsList.tokenId}</td></tr>
                      <tr><td>{"Creater: "}</td><td>{itemsList.creator}</td></tr>
                      {/* <tr><td >{"Owner: "}</td><td style={ { whiteSpace: 'normal' }}>{itemsList.owner}</td></tr> */}
                      <tr><td>{"URI: "}</td><td>{itemsList.uri}</td></tr>
                      <tr><td>{"SaleId: "}</td><td>{itemsList.saleId}</td></tr>
                      {/* <tr><td>{"Active for Sale: "}</td><td>{(itemsList.isForSale).toString()}</td></tr> */}
                      <tr><td>{"Active for Sale: "}</td><td>{(itemsList.isForSale).toString()}</td></tr>
                      <tr><td>{"Price: "}</td><td>{(itemsList.price)+" WEI"}</td></tr>
                      <tr><td>{"Is Sold: "}</td><td>{(itemsList.isSold).toString()}</td></tr>
                      
                      <tr><td>{"Seller: "}</td><td>{(itemsList.seller)}</td></tr>

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
                </Card>
              </Col>
            ))}
          </Row>
        </div>
        : (
          <main style={{ padding: "1rem 0" }}>
            <h2>You don't have any current item for sale!!</h2>
          </main>
        )}
    </div>
  );

}