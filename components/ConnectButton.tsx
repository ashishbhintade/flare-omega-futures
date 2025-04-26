"use client";

import { useWalletConnection } from "@/hooks/useWalletConnection";
import "xp.css/dist/XP.css";

export default function ConnectWallet() {
  const { account, connectWallet } = useWalletConnection();

  return (
    <button onClick={connectWallet} className="cursor-pointer text-black h-7">
      {account
        ? `${account.slice(0, 5)}...${account.slice(-5)}`
        : "Connect Wallet"}
    </button>
  );
}
