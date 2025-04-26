"use client";

import { useState } from "react";
import { createWalletClient, custom } from "viem";
import { flareTestnet } from "viem/chains";
import "xp.css/dist/XP.css";

export default function ConnectWallet() {
  const [account, setAccount] = useState<string | null>(null);
  const [hasSwitchedNetwork, setHasSwitchedNetwork] = useState(false);
  const [isNetworkAdded, setIsNetworkAdded] = useState(false);

  const connectWallet = async () => {
    const ethereum = (window as any).ethereum;

    if (!ethereum) {
      alert("MetaMask is not installed!");
      return;
    }

    try {
      const currentChainId = await ethereum.request({ method: "eth_chainId" });

      if (parseInt(currentChainId, 16) !== flareTestnet.id) {
        try {
          await ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: `0x${flareTestnet.id.toString(16)}` }],
          });

          // After switching, set flag and return
          setHasSwitchedNetwork(true);
          return;
        } catch (switchError: any) {
          if (switchError.code === 4902) {
            try {
              await ethereum.request({
                method: "wallet_addEthereumChain",
                params: [
                  {
                    chainId: `0x${flareTestnet.id.toString(16)}`,
                    chainName: "Flare Testnet",
                    nativeCurrency: {
                      name: "Coston2",
                      symbol: "C2FLR",
                      decimals: 18,
                    },
                    rpcUrls: ["https://coston2-api.flare.network/ext/C/rpc"],
                    blockExplorerUrls: [
                      "https://coston2-explorer.flare.network",
                    ],
                  },
                ],
              });
              setIsNetworkAdded(true);
              // Retry connection after a short delay
              setTimeout(() => connectWallet(), 1000); // Retry connection after 1 second
              return;
            } catch (addError) {
              console.error("Failed to add network:", addError);
              return;
            }
          } else {
            console.error("Failed to switch network:", switchError);
            return;
          }
        }
      }

      // Now we are on correct network, request accounts
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      const client = createWalletClient({
        chain: flareTestnet,
        transport: custom(ethereum),
      });

      setAccount(accounts[0]);
      console.log("Connected WalletClient:", client);
      setHasSwitchedNetwork(false); // reset after successful connection
      setIsNetworkAdded(false); // reset after network is added
    } catch (err) {
      console.error("Wallet connection failed:", err);
    }
  };

  return (
    <button onClick={connectWallet} className="cursor-pointer text-black h-7">
      {account
        ? `${account.slice(0, 5)}...${account.slice(-5)}`
        : "Connect Wallet"}
    </button>
  );
}
