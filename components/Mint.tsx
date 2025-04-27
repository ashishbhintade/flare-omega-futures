"use client";

import { useState } from "react";
import { flareTestnet } from "viem/chains";
import contractJson from "@/abi/omegafeatures.json";
import tokenJson from "@/abi/tokenAbi.json";
import { useWalletConnection } from "@/hooks/useWalletConnection";
import { parseUnits } from "viem";

const contractAddress = "0x52aC5bac822E07eD8318022707c0096ECa5A3422";
const contractAbi = contractJson.abi;
const tokenAddress = "0xb0596355d1C42A6f001d8B44ADBDDF6658995110";
const tokenAbi = tokenJson.abi;

export default function Mint() {
  const [amount, setAmount] = useState("");
  const { account, client } = useWalletConnection();

  const handleSubmit = async () => {
    try {
      if (!client) {
        throw new Error("Wallet client could not be created");
      }
      if (!account) {
        throw new Error("Wallet client could not be created");
      }
      const adjustedAmount = parseUnits(amount, 18);
      await client.writeContract({
        account: account,
        address: tokenAddress,
        abi: tokenAbi,
        functionName: "mint",
        chain: flareTestnet,
        args: [adjustedAmount],
      });
      console.log("Tokens minted successfully.");
    } catch (err) {
      console.error("Error minting tokens:", err);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <div className="window">
        <div className="title-bar">
          <div className="title-bar-text">Mint USDT Tokens</div>
          <div className="title-bar-controls">
            <button aria-label="Minimize"></button>
            <button aria-label="Maximize"></button>
            <button aria-label="Close"></button>
          </div>
        </div>

        <div className="field-row-stacked pt-6">
          <label
            htmlFor="policyId"
            className="block text-sm font-medium text-xl mx-12 text-black"
          >
            Token Amount
          </label>
          <div className="mx-12">
            <input
              id="policyId"
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full border rounded-md mb-4 text-black"
              placeholder="Enter Amount of Tokens"
            />
          </div>
        </div>
        <div className="flex place-content-between">
          <div></div>
          <button
            onClick={handleSubmit}
            className="w-16 text-black mt-4 cursor-pointer mr-12 mb-6"
          >
            Mint
          </button>
        </div>
      </div>
    </div>
  );
}
