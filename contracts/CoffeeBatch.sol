// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract CoffeeBatch {
    enum BatchState {
        Harvested,
        Shipped,
        Roasted,
        Packaged
    }

    enum UserRole {
        Farmer,
        Roaster,
        Admin
    }

    struct Batch {
        uint256 id;
        string farmName;
        string farmLocation;
        string coffeeVariety;
        uint256 quantity; // in kg
        uint256 harvestDate;
        address farmer;
        BatchState state;
        string roasterName;
        uint256 roastDate;
        string roastProfile;
        string qrCode;
        bool exists;
    }

    struct User {
        UserRole role;
        string name;
        string email;
        string location;
        bool isRegistered;
    }

    mapping(uint256 => Batch) public batches;
    mapping(address => User) public users;
    mapping(string => uint256) public qrCodeToBatch;
    
    uint256 public nextBatchId;
    address public admin;

    event BatchCreated(uint256 indexed batchId, address farmer, string farmName);
    event BatchStateChanged(uint256 indexed batchId, BatchState newState, address updatedBy);
    event UserRegistered(address user, UserRole role, string name);
    event BatchRoasted(uint256 indexed batchId, string roasterName, string roastProfile);

    modifier onlyRole(UserRole _role) {
        require(users[msg.sender].isRegistered, "User not registered");
        require(users[msg.sender].role == _role, "Unauthorized role");
        _;
    }

    modifier onlyFarmerOrAdmin() {
        require(
            users[msg.sender].role == UserRole.Farmer || 
            users[msg.sender].role == UserRole.Admin, 
            "Only farmer or admin"
        );
        _;
    }

    modifier batchExists(uint256 _batchId) {
        require(batches[_batchId].exists, "Batch does not exist");
        _;
    }

    constructor() {
        admin = msg.sender;
        users[msg.sender] = User(UserRole.Admin, "Admin", "", "", true);
    }

    function registerUser(
        address _user,
        UserRole _role,
        string memory _name,
        string memory _email,
        string memory _location
    ) public {
        require(
            msg.sender == admin || msg.sender == _user,
            "Only admin or self can register"
        );
        
        users[_user] = User(_role, _name, _email, _location, true);
        emit UserRegistered(_user, _role, _name);
    }

    function createBatch(
        string memory _farmName,
        string memory _farmLocation,
        string memory _coffeeVariety,
        uint256 _quantity
    ) public onlyFarmerOrAdmin {
        uint256 batchId = nextBatchId;
        
        batches[batchId] = Batch({
            id: batchId,
            farmName: _farmName,
            farmLocation: _farmLocation,
            coffeeVariety: _coffeeVariety,
            quantity: _quantity,
            harvestDate: block.timestamp,
            farmer: msg.sender,
            state: BatchState.Harvested,
            roasterName: "",
            roastDate: 0,
            roastProfile: "",
            qrCode: "",
            exists: true
        });

        nextBatchId++;
        emit BatchCreated(batchId, msg.sender, _farmName);
    }

    function shipBatch(uint256 _batchId) 
        public 
        onlyFarmerOrAdmin 
        batchExists(_batchId) 
    {
        require(batches[_batchId].state == BatchState.Harvested, "Invalid state transition");
        require(batches[_batchId].farmer == msg.sender || users[msg.sender].role == UserRole.Admin, "Not batch owner");
        
        batches[_batchId].state = BatchState.Shipped;
        emit BatchStateChanged(_batchId, BatchState.Shipped, msg.sender);
    }

    function roastBatch(
        uint256 _batchId,
        string memory _roasterName,
        string memory _roastProfile
    ) public onlyRole(UserRole.Roaster) batchExists(_batchId) {
        require(batches[_batchId].state == BatchState.Shipped, "Invalid state transition");
        
        batches[_batchId].state = BatchState.Roasted;
        batches[_batchId].roasterName = _roasterName;
        batches[_batchId].roastDate = block.timestamp;
        batches[_batchId].roastProfile = _roastProfile;
        
        emit BatchStateChanged(_batchId, BatchState.Roasted, msg.sender);
        emit BatchRoasted(_batchId, _roasterName, _roastProfile);
    }

    function packageBatch(uint256 _batchId, string memory _qrCode) 
        public 
        onlyRole(UserRole.Roaster) 
        batchExists(_batchId) 
    {
        require(batches[_batchId].state == BatchState.Roasted, "Invalid state transition");
        require(bytes(_qrCode).length > 0, "QR code required");
        
        batches[_batchId].state = BatchState.Packaged;
        batches[_batchId].qrCode = _qrCode;
        qrCodeToBatch[_qrCode] = _batchId;
        
        emit BatchStateChanged(_batchId, BatchState.Packaged, msg.sender);
    }

    function getBatch(uint256 _batchId) 
        public 
        view 
        batchExists(_batchId) 
        returns (Batch memory) 
    {
        return batches[_batchId];
    }

    function getBatchByQR(string memory _qrCode) 
        public 
        view 
        returns (Batch memory) 
    {
        uint256 batchId = qrCodeToBatch[_qrCode];
        require(batchId > 0 || (batchId == 0 && keccak256(bytes(batches[0].qrCode)) == keccak256(bytes(_qrCode))), "Invalid QR code");
        require(batches[batchId].exists, "Invalid QR code");
        return batches[batchId];
    }

    function getUserInfo(address _user) 
        public 
        view 
        returns (UserRole role, string memory name, string memory email, string memory location, bool isRegistered) 
    {
        User memory user = users[_user];
        return (user.role, user.name, user.email, user.location, user.isRegistered);
    }

    function getAllBatches() public view returns (uint256[] memory) {
        uint256[] memory batchIds = new uint256[](nextBatchId);
        for (uint256 i = 0; i < nextBatchId; i++) {
            if (batches[i].exists) {
                batchIds[i] = i;
            }
        }
        return batchIds;
    }
}