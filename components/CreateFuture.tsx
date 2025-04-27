"use client";

import { useState } from "react";
import { flareTestnet } from "viem/chains";
import contractJson from "@/abi/omegafeatures.json";
import tokenJson from "@/abi/tokenAbi.json";
import { useWalletConnection } from "@/hooks/useWalletConnection";

const contractAddress = "0x52aC5bac822E07eD8318022707c0096ECa5A3422";
const contractAbi = contractJson.abi;

export default function CreateFuture() {
  const { account: userAddress, client } = useWalletConnection();
  const [formData, setFormData] = useState({
    commodity: "",
    isLong: "",
    trigger: "",
    expiryDate: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const { commodity, isLong, trigger, expiryDate } = formData;

    const expiryDateUnix = Math.floor(new Date(expiryDate).getTime() / 1000);
    const triggerPrice = BigInt(Number(trigger) * 1_000_000);
    const longPosition = isLong === "Long";

    try {
      if (!client || !userAddress) {
        throw new Error("Wallet client or user address not found.");
      }

      await client.writeContract({
        account: userAddress,
        address: contractAddress, // Replace with your contract address
        abi: contractAbi, // Replace with your ABI
        functionName: "createContract", // Replace with your function name
        chain: flareTestnet, // Replace with your chain info
        args: [
          {
            value: triggerPrice, // uint256
            name: commodity, // string
            isLong: longPosition, // bool
            expiry: BigInt(expiryDateUnix), // uint256
          },
        ],
      });

      console.log("Future Created.");
    } catch (err) {
      console.error("Error creating future:", err);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 space-y-4">
      <div className="window space-y-4">
        <div className="title-bar">
          <div className="title-bar-text">Enter Policy Information</div>
          <div className="title-bar-controls">
            <button aria-label="Minimize"></button>
            <button aria-label="Maximize"></button>
            <button aria-label="Close"></button>
          </div>
        </div>

        <div className="field-row-stacked mx-6">
          <label
            htmlFor="commodity"
            className="block text-sm font-medium text-xl text-black"
          >
            Commodity
          </label>
          <select
            id="commodity"
            name="commodity"
            value={formData.commodity}
            onChange={handleChange}
            className="w-full p-2 border rounded-md text-black"
          >
            <option value="">Select Commodity</option>
            <option value="Potato">Potato</option>
            <option value="Butter">Butter</option>
            <option value="Crude Oil">Crude Oil</option>
          </select>
        </div>

        <div className="field-row-stacked mx-6">
          <label
            htmlFor="long"
            className="block text-sm font-medium text-xl text-black"
          >
            Long/Short
          </label>
          <select
            id="long"
            name="long"
            value={formData.isLong}
            onChange={handleChange}
            className="w-full p-2 border rounded-md text-black"
          >
            <option value="">Long/Short</option>
            <option value="Long">Long</option>
            <option value="Short">Short</option>
          </select>
        </div>

        <div className="field-row-stacked mx-6">
          <label
            htmlFor="value"
            className="block text-sm font-medium text-xl text-black"
          >
            Trigger Price
          </label>
          <input
            id="trigger"
            name="trigger"
            type="number"
            value={formData.trigger}
            onChange={handleChange}
            className="w-full border p-1 bg-white text-black"
            placeholder="Enter Trigger Price"
          />
        </div>

        <div className="field-row-stacked mx-6">
          <label
            htmlFor="endDate"
            className="block text-sm font-medium text-xl text-black pb-1"
          >
            Expiry Date
          </label>
          <input
            id="expiryDate"
            name="expiryDate"
            type="date"
            value={formData.expiryDate}
            onChange={handleChange}
            className="w-full border p-1 bg-white text-black"
          />
        </div>

        <div className="flex justify-end mx-6 mb-6">
          <button
            onClick={handleSubmit}
            className="w-1/3 text-black py-2 mt-4 rounded-md"
          >
            Create Policy
          </button>
        </div>
      </div>
    </div>
  );
}
