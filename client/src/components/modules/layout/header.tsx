"use client";
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import MenuIcon from "@/components/icons/menu-icon";
import { useAccount, useDisconnect } from "wagmi";
import { ROUTES } from "@/constants/common";
import { useRouter } from "next/navigation";

const Header = () => {
  const { address } = useAccount();
  const router = useRouter();
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
    <div className="border-b border-b-[#0a1f1c] h-fit flex justify-between items-center py-2 px-14">
      <div className="leading-8 font-extrabold text-xl flex items-center gap-2">
        <div>
          <span className="text-white">DLottery</span>
          <div className="text-base font-medium text-[#6366F1]" title={address}>
            {address ? `User: ${formatAddress(address)}` : "Not connected"}
          </div>
        </div>
      </div>

      <div className="p-2 rounded-lg bg-[#1E293B]">
        <Button className="bg-[#6366F1] hover:bg-[#6366F1]/80 mr-2">Buy Tickets</Button>
        <Button 
          onClick={() => disconnect()} 
          className="bg-[#F43F5E] hover:bg-[#F43F5E]/80"
        >
          Disconnect
        </Button>
      </div>

      <MenuIcon className="fill-white" />
    </div>
  );
};

export default Header;