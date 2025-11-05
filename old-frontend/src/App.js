import { useState } from "react";
import { ethers } from "ethers";
import SupplyChain from "./SupplyChain.sol/SupplyChain.json";

// Replace with your deployed contract address
const contractAddress = "0xYourDeployedContractAddressHere";

export default function App() {
  const [productName, setProductName] = useState("");
  const [productId, setProductId] = useState("");
  const [productDetails, setProductDetails] = useState(null);
  const [newOwner, setNewOwner] = useState("");
  const [isLoading, setIsLoading] = useState(false); // New state for loading

  // Helper function to get the contract instance
  async function getContract() {
    if (!window.ethereum) {
      alert("Please install MetaMask!");
      return null;
    }
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(contractAddress, SupplyChain.abi, signer);
    return contract;
  }

  // Add a new product
  async function addProduct() {
    if (!productName) {
      alert("Please enter a product name.");
      return;
    }
    setIsLoading(true);
    try {
      const contract = await getContract();
      // Check if the contract instance is valid
      if (!contract) return;
      
      const tx = await contract.addProduct(productName);
      await tx.wait();
      alert("Product added successfully!");
    } catch (error) {
      console.error("Failed to add product:", error);
      alert("Failed to add product. See console for details.");
    } finally {
      setIsLoading(false);
    }
  }

  // Fetch product details
  async function fetchProduct() {
    if (!productId) {
      alert("Please enter a Product ID.");
      return;
    }
    setIsLoading(true);
    try {
      const contract = await getContract();
      if (!contract) return;

      const product = await contract.getProduct(productId);
      setProductDetails(product);
    } catch (error) {
      console.error("Failed to fetch product:", error);
      alert("Failed to fetch product. Check the ID and try again.");
    } finally {
      setIsLoading(false);
    }
  }

  // Transfer product ownership
  async function transferOwnership() {
    if (!productId || !newOwner) {
      alert("Please enter a Product ID and New Owner address.");
      return;
    }
    setIsLoading(true);
    try {
      const contract = await getContract();
      if (!contract) return;

      const tx = await contract.transferOwnership(productId, newOwner);
      await tx.wait();
      alert("Ownership transferred successfully!");
    } catch (error) {
      console.error("Failed to transfer ownership:", error);
      alert("Failed to transfer ownership. See console for details.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Supply Chain DApp</h1>
      {isLoading && <p>Loading...</p>}

      {/* Add Product Section */}
      <div className="my-4">
        <h2 className="text-lg font-semibold">Add a New Product</h2>
        <input
          className="border p-2 mr-2"
          placeholder="Product Name"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={addProduct}
          disabled={isLoading}
        >
          Add Product
        </button>
      </div>

      <hr className="my-6" />

      {/* Get Product Section */}
      <div className="my-4">
        <h2 className="text-lg font-semibold">Get Product Details</h2>
        <input
          className="border p-2 mr-2"
          placeholder="Product ID"
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
        />
        <button
          className="bg-green-500 text-white px-4 py-2 rounded"
          onClick={fetchProduct}
          disabled={isLoading}
        >
          Get Product
        </button>
        {productDetails && (
          <div className="mt-4 p-4 border rounded">
            <p><strong>ID:</strong> {productDetails[0].toString()}</p>
            <p><strong>Name:</strong> {productDetails[1]}</p>
            <p><strong>Owner:</strong> {productDetails[2]}</p>
            <p><strong>Created:</strong> {new Date(Number(productDetails[3]) * 1000).toLocaleString()}</p>
          </div>
        )}
      </div>

      <hr className="my-6" />

      {/* Transfer Ownership Section */}
      <div className="my-4">
        <h2 className="text-lg font-semibold">Transfer Product Ownership</h2>
        <input
          className="border p-2 mr-2"
          placeholder="New Owner Address"
          value={newOwner}
          onChange={(e) => setNewOwner(e.target.value)}
        />
        <button
          className="bg-yellow-500 text-white px-4 py-2 rounded"
          onClick={transferOwnership}
          disabled={isLoading}
        >
          Transfer Ownership
        </button>
      </div>
    </div>
  );
}