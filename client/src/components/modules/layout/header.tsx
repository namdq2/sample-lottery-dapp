"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import WalletIcon from "@/components/icons/wallet-icon";
import { useAccount, useDisconnect } from "wagmi";
import { ROUTES } from "@/constants/common";
import { useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";

const Header = () => {
  const router = useRouter();
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (!address) {
      router.push(ROUTES.ROOT);
    }
  }, [address, router]);

  // Format address to show first 6 and last 4 characters
  const formatAddress = (addr: string | undefined) => {
    if (!addr) return "";
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <header className="bg-[#0a0f1e] border-b border-b-[#1E293B] sticky top-0 z-50">
      {/* Desktop Navigation */}
      <div className="h-16 px-4 md:px-8 lg:px-14 mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <h1 className="font-extrabold text-xl text-white">DLottery</h1>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex items-center">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-md text-gray-300 hover:text-white"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Desktop Navigation Items */}
        <div className="hidden md:flex items-center space-x-4">
          <div className="p-2 rounded-lg bg-[#1E293B] flex">
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

        {/* Wallet Address - Desktop */}
        <div className="hidden md:flex items-center gap-2">
          <WalletIcon className="fill-white" />
          <div 
            className="text-base font-medium text-[#6366F1] truncate max-w-[140px] lg:max-w-[200px]" 
            title={address}
          >
            {address ? formatAddress(address) : "Not connected"}
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-[#0a0f1e] border-t border-[#1E293B] py-4 px-4">
          <div className="flex flex-col space-y-4">
            <Button className="bg-[#6366F1] hover:bg-[#6366F1]/80 w-full">
              Buy Tickets
            </Button>
            <Button
              onClick={() => disconnect()}
              className="bg-[#F43F5E] hover:bg-[#F43F5E]/80 w-full"
            >
              Disconnect
            </Button>
            
            {/* Wallet Address - Mobile */}
            <div className="flex items-center gap-2 py-2 px-3 bg-[#1E293B] rounded-md">
              <WalletIcon className="fill-white" />
              <div className="text-sm font-medium text-[#6366F1] truncate">
                {address ? formatAddress(address) : "Not connected"}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;