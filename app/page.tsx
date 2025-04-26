"use client";

import Futures from "@/components/Futures";
import NotConnected from "@/components/NotConnected";
import { useWalletConnection } from "@/hooks/useWalletConnection";

export default function Home() {
  const { isConnected } = useWalletConnection();
  return <div>{isConnected ? <Futures /> : <NotConnected />}</div>;
}
