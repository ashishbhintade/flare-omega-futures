"use client";

import Image from "next/image";
import cardData from "@/data/cards.json";
import { useEffect, useState } from "react";
import { createPublicClient, formatEther, http, parseUnits } from "viem";
import { flareTestnet } from "viem/chains";
import contractJson from "@/abi/omegafeatures.json";
import tokenJson from "@/abi/tokenAbi.json";
import { useWalletConnection } from "@/hooks/useWalletConnection";

const contractAddress = "0x52aC5bac822E07eD8318022707c0096ECa5A3422";
const contractAbi = contractJson.abi;
const tokenAddress = "0xb0596355d1C42A6f001d8B44ADBDDF6658995110";
const tokenAbi = tokenJson.abi;

const publicClient = createPublicClient({
  chain: flareTestnet,
  transport: http(),
});

type Status = "created" | "fulfilled" | "redeemed";
type Future = {
  buyer: `0x${string}`;
  currentPrice: bigint;
  trigger: bigint;
  expiry: bigint;
  status: Status;
  isLong: boolean;
  commodity: string;
};

export default function YourFutures() {
  const { account, client } = useWalletConnection();
  const [futures, setFutures] = useState<Future[]>([]);
  const [allowance, setAllowance] = useState<bigint>(BigInt(0));

  useEffect(() => {
    const fetchFutures = async () => {
      console.log("Fetching policies...");
      try {
        const currentId = (await publicClient.readContract({
          address: contractAddress,
          abi: contractAbi,
          functionName: "s_currentTokenID",
        })) as bigint;

        const idNum = Number(currentId);

        const results = await Promise.all(
          Array.from({ length: idNum }, (_, i) =>
            publicClient.readContract({
              address: contractAddress,
              abi: contractAbi,
              functionName: "ownerOf",
              args: [BigInt(i)],
            })
          )
        );

        if (!account) {
          return;
        }

        const validResults = results
          .filter(
            (res: any) =>
              res.status === "fulfilled" &&
              res.value?.toLowerCase() === account.toLowerCase()
          )
          .map((res: any) => res.value);

        const mapStatus = (statusNumber: number): Status => {
          switch (statusNumber) {
            case 0:
              return "created";
            case 1:
              return "fulfilled";
            case 2:
              return "redeemed";
            default:
              return "created"; // or throw an error
          }
        };

        const futuresFormatted = validResults.map((result: any) => ({
          buyer: result[0],
          currentPrice: result[1],
          trigger: result[2],
          expiry: result[3],
          status: mapStatus(result[4]), // we'll define mapStatus below
          isLong: result[5],
          commodity: result[6],
        }));

        setFutures(futuresFormatted);

        // setFutures(results as Future[]);
        console.log("Formatted Data", futuresFormatted);
        console.log("Results Data", results);
      } catch (err) {
        console.error("Error fetching policies:", err);
      }
    };

    if (account) {
      // Fetch the allowance if wallet is connected
      const fetchAllowance = async () => {
        try {
          const tokenClient = createPublicClient({
            chain: flareTestnet,
            transport: http(),
          });

          const allowance = await tokenClient.readContract({
            address: tokenAddress,
            abi: tokenAbi,
            functionName: "allowance",
            args: [account, contractAddress], // Check allowance to the Macro Guard contract
          });

          setAllowance(allowance as bigint); // Set the allowance
        } catch (err) {
          console.error("Error fetching allowance:", err);
        }
      };

      if (account) {
        fetchAllowance();
      }
    }

    fetchFutures();
  }, [account]);

  const handleApprove = async () => {
    // const [account] = await client.getAddresses();
    try {
      if (!client) {
        throw new Error("Wallet client could not be created");
      }
      if (!account) {
        throw new Error("Wallet client could not be created");
      }

      await client.writeContract({
        account: account,
        address: tokenAddress,
        abi: tokenAbi,
        functionName: "approve",
        chain: flareTestnet,
        args: [contractAddress, parseUnits("100000", 18)], // Adjust the amount as needed
      });
      console.log("Token approved successfully.");
      setAllowance(BigInt(1_000_000_000)); // Update allowance after approval
    } catch (err) {
      console.error("Error approving token:", err);
    }
  };

  const handleBuyPolicy = async (policyId: bigint, premium: bigint) => {
    // Call the buyPolicy function on the Macro Guard contract
    try {
      if (!client) {
        throw new Error("Wallet client could not be created");
      }
      if (!account) {
        throw new Error("Wallet client could not be created");
      }
      await client.writeContract({
        account: account,
        address: contractAddress,
        abi: contractAbi,
        functionName: "buyPolicy",
        chain: flareTestnet,
        args: [policyId],
      });
      console.log("Policy bought successfully.");
    } catch (err) {
      console.error("Error buying policy:", err);
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4 py-6">
      {futures.map((future, index) => (
        <div key={index} className="shadow-lg overflow-hidden flex flex-col">
          <div className="window">
            <div className="title-bar">
              <div className="title-bar-text"></div>
              <div className="title-bar-controls">
                <button aria-label="Minimize"></button>
                <button aria-label="Restore"></button>
                <button aria-label="Close"></button>
              </div>
            </div>
            <div className="window-body">
              <div>
                <Image
                  src="/image.png"
                  alt="Commodity Image"
                  width={600}
                  height={300}
                  className="rounded-md w-full h-48 object-cover border"
                />
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-lg text-black font-bold mb-1">
                    Commodity Short
                  </h4>
                  <p className="text-sm text-black mb-1">
                    Trigger | Expires on{" "}
                    {new Date(
                      Number(future.expiry) * 1000
                    ).toLocaleDateString()}
                  </p>
                  <p className="text-black mb-3 text-sm">
                    Status : {future.status}
                  </p>
                </div>

                <button
                  onClick={() => {
                    if (allowance >= BigInt(100_000)) {
                      // handleBuyPolicy(future.id, future.premium);
                    } else {
                      handleApprove();
                    }
                  }}
                  className="mt-auto inline-block cursor-pointer text-black"
                >
                  {allowance >= BigInt(100_000)
                    ? `Fulfill @ ${Number(
                        future.isLong
                          ? future.trigger - future.currentPrice
                          : future.currentPrice - future.trigger
                      ).toLocaleString()}} USDT`
                    : "Approve Token"}
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
