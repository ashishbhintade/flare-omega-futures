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
  id: number;
  buyer: `0x${string}`;
  currentPrice: bigint;
  trigger: bigint;
  expiry: bigint;
  status: Status;
  isLong: boolean;
  commodity: string;
};

export default function Futures() {
  const { account, client } = useWalletConnection();
  const [futures, setFutures] = useState<Future[]>([]);
  const [allowance, setAllowance] = useState<bigint>(BigInt(0));
  const [idNum, setIdNum] = useState<number | null>(null);

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
              functionName: "contractDetails",
              args: [BigInt(i)],
            })
          )
        );

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

        const futuresFormatted = results.map((result: any, index: number) => ({
          id: index,
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
        console.log(results);
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
    try {
      if (!client) {
        throw new Error("Wallet client could not be created");
      }
      if (!account) {
        throw new Error("Wallet client could not be created");
      }

      const maxUint256 = BigInt(
        "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
      );

      await client.writeContract({
        account: account,
        address: tokenAddress,
        abi: tokenAbi,
        functionName: "approve",
        chain: flareTestnet,
        args: [contractAddress, maxUint256], // Adjust the amount as needed
      });
      console.log("Token approved successfully.");
      setAllowance(maxUint256); // Update allowance after approval
    } catch (err) {
      console.error("Error approving token:", err);
    }
  };

  const handleBuyFuture = async (futureId: number) => {
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
        functionName: "buyContract",
        chain: flareTestnet,
        args: [futureId],
      });
      console.log("Future Option bought successfully.");
    } catch (err) {
      console.error("Error buying policy:", err);
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4 py-6">
      {futures.map((future) => (
        <div
          key={future.id}
          className="shadow-lg overflow-hidden flex flex-col"
        >
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
                    {future.commodity} {future.isLong ? "Long" : "Short"}
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
                      handleBuyFuture(future.id);
                    } else {
                      handleApprove();
                    }
                  }}
                  className="mt-auto inline-block cursor-pointer text-black"
                >
                  {allowance >= BigInt(100_000)
                    ? `Fulfill @ ${(
                        Number(
                          future.isLong
                            ? future.trigger - future.currentPrice
                            : future.currentPrice - future.trigger
                        ) / 1_000_000
                      ).toLocaleString()} USDT`
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
