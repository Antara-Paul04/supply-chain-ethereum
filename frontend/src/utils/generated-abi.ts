// Generated ABI from contract artifacts
export const COFFEE_BATCH_ABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "batchId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "farmer",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "farmName",
        "type": "string"
      }
    ],
    "name": "BatchCreated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "batchId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "roasterName",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "roastProfile",
        "type": "string"
      }
    ],
    "name": "BatchRoasted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "batchId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "enum CoffeeBatch.BatchState",
        "name": "newState",
        "type": "uint8"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "updatedBy",
        "type": "address"
      }
    ],
    "name": "BatchStateChanged",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "enum CoffeeBatch.UserRole",
        "name": "role",
        "type": "uint8"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "name",
        "type": "string"
      }
    ],
    "name": "UserRegistered",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "admin",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "batches",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "farmName",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "farmLocation",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "coffeeVariety",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "quantity",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "harvestDate",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "farmer",
        "type": "address"
      },
      {
        "internalType": "enum CoffeeBatch.BatchState",
        "name": "state",
        "type": "uint8"
      },
      {
        "internalType": "string",
        "name": "roasterName",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "roastDate",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "roastProfile",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "qrCode",
        "type": "string"
      },
      {
        "internalType": "bool",
        "name": "exists",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_farmName",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_farmLocation",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_coffeeVariety",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "_quantity",
        "type": "uint256"
      }
    ],
    "name": "createBatch",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getAllBatches",
    "outputs": [
      {
        "internalType": "uint256[]",
        "name": "",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_batchId",
        "type": "uint256"
      }
    ],
    "name": "getBatch",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "farmName",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "farmLocation",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "coffeeVariety",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "quantity",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "harvestDate",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "farmer",
            "type": "address"
          },
          {
            "internalType": "enum CoffeeBatch.BatchState",
            "name": "state",
            "type": "uint8"
          },
          {
            "internalType": "string",
            "name": "roasterName",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "roastDate",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "roastProfile",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "qrCode",
            "type": "string"
          },
          {
            "internalType": "bool",
            "name": "exists",
            "type": "bool"
          }
        ],
        "internalType": "struct CoffeeBatch.Batch",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_qrCode",
        "type": "string"
      }
    ],
    "name": "getBatchByQR",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "farmName",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "farmLocation",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "coffeeVariety",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "quantity",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "harvestDate",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "farmer",
            "type": "address"
          },
          {
            "internalType": "enum CoffeeBatch.BatchState",
            "name": "state",
            "type": "uint8"
          },
          {
            "internalType": "string",
            "name": "roasterName",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "roastDate",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "roastProfile",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "qrCode",
            "type": "string"
          },
          {
            "internalType": "bool",
            "name": "exists",
            "type": "bool"
          }
        ],
        "internalType": "struct CoffeeBatch.Batch",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_user",
        "type": "address"
      }
    ],
    "name": "getUserInfo",
    "outputs": [
      {
        "internalType": "enum CoffeeBatch.UserRole",
        "name": "role",
        "type": "uint8"
      },
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "email",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "location",
        "type": "string"
      },
      {
        "internalType": "bool",
        "name": "isRegistered",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "nextBatchId",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_batchId",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "_qrCode",
        "type": "string"
      }
    ],
    "name": "packageBatch",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "name": "qrCodeToBatch",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_user",
        "type": "address"
      },
      {
        "internalType": "enum CoffeeBatch.UserRole",
        "name": "_role",
        "type": "uint8"
      },
      {
        "internalType": "string",
        "name": "_name",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_email",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_location",
        "type": "string"
      }
    ],
    "name": "registerUser",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_batchId",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "_roasterName",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_roastProfile",
        "type": "string"
      }
    ],
    "name": "roastBatch",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_batchId",
        "type": "uint256"
      }
    ],
    "name": "shipBatch",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "users",
    "outputs": [
      {
        "internalType": "enum CoffeeBatch.UserRole",
        "name": "role",
        "type": "uint8"
      },
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "email",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "location",
        "type": "string"
      },
      {
        "internalType": "bool",
        "name": "isRegistered",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];
