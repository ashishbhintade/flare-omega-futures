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
      // console.log("Fetching futures...");
      try {
        const currentId = (await publicClient.readContract({
          address: contractAddress,
          abi: contractAbi,
          functionName: "s_currentTokenID",
        })) as bigint;

        const idNum = Number(currentId);

        if (!account) return;

        // 1. Find which token IDs belong to the account
        const ownerResults = await Promise.all(
          Array.from(
            { length: idNum },
            (_, i) =>
              publicClient
                .readContract({
                  address: contractAddress,
                  abi: contractAbi,
                  functionName: "ownerOf",
                  args: [BigInt(i)],
                })
                .then((owner) => ({ id: i, owner }))
                .catch(() => null) // catch errors for missing tokens
          )
        );
        // console.log("Owner Rsults", ownerResults);

        // 2. Filter only tokens owned by the account
        const ownedTokenIds = ownerResults
          .filter(
            (res: any) =>
              res && res.owner.toLowerCase() === account.toLowerCase()
          )
          .map((res: any) => res.id);

        if (ownedTokenIds.length === 0) {
          setFutures([]);
          return;
        }
        // console.log("Owner Ids", ownedTokenIds);

        // 3. Fetch future details for owned tokens
        const futureDetails = await Promise.all(
          ownedTokenIds.map((id) =>
            publicClient
              .readContract({
                address: contractAddress,
                abi: contractAbi,
                functionName: "contractDetails", // or whatever your function is
                args: [BigInt(id)],
              })
              .then((data) => ({ id, data }))
          )
        );
        // console.log("Future Details", futureDetails);

        const mapStatus = (statusNumber: number): Status => {
          switch (statusNumber) {
            case 0:
              return "created";
            case 1:
              return "fulfilled";
            case 2:
              return "redeemed";
            default:
              return "created";
          }
        };

        const futuresFormatted = futureDetails.map(({ id, data }: any) => ({
          id,
          buyer: data[0],
          currentPrice: data[1],
          trigger: data[2],
          expiry: data[3],
          status: mapStatus(Number(data[4])),
          isLong: data[5],
          commodity: data[6],
        }));

        setFutures(futuresFormatted);

        // console.log("Formatted Futures:", futuresFormatted);
      } catch (err) {
        console.error("Error fetching policies:", err);
      }
    };

    if (account) {
      fetchFutures();
    }
  }, [account]);

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
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
