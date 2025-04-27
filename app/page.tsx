"use client";

import Futures from "@/components/Futures";
import NotConnected from "@/components/NotConnected";
import { useWalletConnection } from "@/hooks/useWalletConnection";

export default function Home() {
  const { isConnected } = useWalletConnection();
  return (
    <div>
      {isConnected ? (
        <div>
          <ul className="tree-view rounded-lg">
            <li className="text-center text-[15px] text-black">
              Make sure you mint some tokens before interacting
            </li>
          </ul>
          <Futures />
        </div>
      ) : (
        <NotConnected />
      )}
    </div>
  );
}
