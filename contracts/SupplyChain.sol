// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract SupplyChain {
    struct Product {
        uint id;
        string name;
        address owner;
        uint timestamp;
    }

    mapping(uint => Product) public products;
    uint public nextId;

    event ProductAdded(uint id, string name, address owner);
    event OwnershipTransferred(uint id, address oldOwner, address newOwner);

    // Add a new product
    function addProduct(string memory _name) public {
        products[nextId] = Product(nextId, _name, msg.sender, block.timestamp);
        emit ProductAdded(nextId, _name, msg.sender);
        nextId++;
    }

    // Transfer ownership of a product
    function transferOwnership(uint _id, address _newOwner) public {
        require(products[_id].owner == msg.sender, "Not product owner");
        address oldOwner = products[_id].owner;
        products[_id].owner = _newOwner;

        emit OwnershipTransferred(_id, oldOwner, _newOwner);
    }

    // Get product details
    function getProduct(uint _id) public view returns (
        uint id,
        string memory name,
        address owner,
        uint timestamp
    ) {
        Product memory p = products[_id];
        return (p.id, p.name, p.owner, p.timestamp);
    }
}
