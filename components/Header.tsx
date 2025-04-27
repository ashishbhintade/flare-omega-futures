"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ConnectWallet from "./ConnectButton";
import { useWalletConnection } from "@/hooks/useWalletConnection";

export default function Header() {
  const pathname = usePathname();
  const { account } = useWalletConnection();

  const navItems = [
    { href: "/", label: "Futures" },
    { href: "/your-futures", label: "Your Futures" },
    { href: "/create-futures", label: "Create Futures" },
    { href: "/mint", label: "Mint Tokens" },
  ];

  return (
    <div className="mx-auto top-0 z-50 h-16 flex items-center justify-between">
      <Link href="/" className="text-xl font-bold text-white">
        OmegaFutures
      </Link>

      <div className="space-x-12 font-semibold hidden md:flex text-black">
        {navItems.map(({ href, label }) => {
          const isActive =
            pathname === href || (href === "/about" && pathname === "/");

          return account ? (
            <Link
              key={href}
              href={href}
              className={`text-black hover:text-gray-300 ${
                isActive ? "underline underline-offset-4" : ""
              }`}
            >
              {label}
            </Link>
          ) : (
            <span
              key={href}
              className="text-gray-300 cursor-not-allowed"
              title="Connect wallet to access"
            >
              {label}
            </span>
          );
        })}
      </div>

      <div className="w-32">
        <ConnectWallet />
      </div>
    </div>
  );
}
