// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract SupplyChain {
    // Define stages in the supply chain
    enum State { Created, Shipped, Delivered }

    struct Item {
        uint id;
        string name;
        State state;
        address owner;
    }

    mapping(uint => Item) public items;
    uint public nextId;

    event ItemCreated(uint id, string name, address owner);
    event ItemShipped(uint id, address owner);
    event ItemDelivered(uint id, address owner);

    // Create a new item
    function createItem(string memory _name) public {
        items[nextId] = Item(nextId, _name, State.Created, msg.sender);
        emit ItemCreated(nextId, _name, msg.sender);
        nextId++;
    }

    // Mark an item as shipped
    function shipItem(uint _id) public {
        require(items[_id].owner == msg.sender, "Not item owner");
        require(items[_id].state == State.Created, "Wrong state");
        items[_id].state = State.Shipped;
        emit ItemShipped(_id, msg.sender);
    }

    // Mark an item as delivered
    function deliverItem(uint _id) public {
        require(items[_id].owner == msg.sender, "Not item owner");
        require(items[_id].state == State.Shipped, "Wrong state");
        items[_id].state = State.Delivered;
        emit ItemDelivered(_id, msg.sender);
    }
}
