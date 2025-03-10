"use client";
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import WalletIcon from "@/components/icons/wallet-icon";
import { useAccount, useDisconnect } from "wagmi";
import { ROUTES } from "@/constants/common";
import { useRouter } from "next/navigation";

const Header = () => {
  const router = useRouter();
  const { address } = useAccount();
  const { disconnect } = useDisconnect();

  useEffect(() => {
    if (!address) {
      router.push(ROUTES.ROOT);
    }
  }, [address]);

  // Format address to show first 6 and last 4 characters
  const formatAddress = (addr: string | undefined) => {
    if (!addr) return "";
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <div className="border-b border-b-[#0a1f1c] h-fit flex items-center py-2 px-14">
      {/* Left: Logo - fixed width */}
      <div className="w-1/4 leading-8 font-extrabold text-xl">
        <span className="text-white">DLottery</span>
      </div>

      {/* Center: Buttons */}
      <div className="flex-grow flex justify-center">
        <div className="p-2 rounded-lg bg-[#1E293B]">
          <Button className="bg-[#6366F1] hover:bg-[#6366F1]/80 mr-2">
            Buy Tickets
          </Button>
          <Button
            onClick={() => disconnect()}
            className="bg-[#F43F5E] hover:bg-[#F43F5E]/80"
          >
            Disconnect
          </Button>
        </div>
      </div>

      {/* Right: User Address - fixed width */}
      <div className="w-1/4 flex items-center gap-2 justify-end">
        <WalletIcon className="fill-white" />
        <div className="text-base font-medium text-[#6366F1]" title={address}>
          {address ? `${formatAddress(address)}` : "Not connected"}
        </div>
      </div>
    </div>
  );
};

export default Header;