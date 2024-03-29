import {
    Link
} from "react-router-dom";
import { Navbar, Nav, Button, Container } from 'react-bootstrap'
import React, { Component }  from 'react';
import market from './market.png'

const Navigation = ({ web3Handler, account }) => {
    return (
        <Navbar expand="lg" bg="secondary" variant="dark" class="fixed-top" style={{position: "sticky"}}>
            <Container>
                <Navbar.Brand >
                    <img src={market} width="60" height="60" className="" alt="" />
                    &nbsp; DApp NFT Marketplace
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/">Home</Nav.Link>
                        &nbsp;
                        <Nav.Link as={Link} to="/create">Membership NFT</Nav.Link>
                        &nbsp;
                        <Nav.Link as={Link} to="/my-listed-items">My Listed Items</Nav.Link>
                        &nbsp;
                        <Nav.Link as={Link} to="/my-purchases">My NFTs</Nav.Link>
                    </Nav>
                    <Nav>
                        {account ? (
                            <Nav.Link
                                href={`https://etherscan.io/address/${account}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="button nav-button btn-sm mx-4">
                                <Button variant="outline-light">
                                    {account.slice(0, 5) + '...' + account.slice(38, 42)}
                                </Button>

                            </Nav.Link>
                        ) : (
                            <Button onClick={web3Handler} variant="outline-light">Connect Wallet</Button>
                        )}
                        
                    </Nav>
                   
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )

}

export default Navigation;