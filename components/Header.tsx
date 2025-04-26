"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ConnectWallet from "./ConnectButton";
import Container from "./Container";

export default function Header() {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Policies" },
    { href: "/your-policy", label: "Your Policies" },
    { href: "/create-policy", label: "Create Polices" },
    { href: "/modify-policy", label: "Modify Policies" },
  ];

  return (
    // <Container>
    <div className="mx-auto top-0 z-50 h-16 flex items-center justify-between">
      {/* Left: Logo */}
      <Link href="/" className="text-xl font-bold text-white">
        MacroGuard
      </Link>

      {/* Center: Navigation links */}
      <div className="space-x-12 font-semibold hidden md:flex text-black">
        {navItems.map(({ href, label }) => {
          const isActive =
            pathname === href || (href === "/about" && pathname === "/");
          return (
            <Link
              key={href}
              href={href}
              className={`text-black hover:text-gray-300 ${
                isActive ? "underline underline-offset-4" : ""
              }`}
            >
              {label}
            </Link>
          );
        })}
      </div>

      {/* Right: Connect Wallet */}
      <div className="w-32">
        <ConnectWallet />
      </div>
    </div>
    // </Container>
  );
}
