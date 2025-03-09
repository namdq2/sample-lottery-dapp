"use client";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import React from "react";
import { useAccount } from "wagmi";
import WalletIcon from "../../icons/wallet-icon";
import WalletList from "./components/wallet-list";

const Profile = () => {
  const { address } = useAccount();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="bg-[#4f46e5] hover:bg-[#342db6] w-40">
          <WalletIcon />
          {address ? (
            <span className="w-36 truncate" title={address}>
              {address}
            </span>
          ) : (
            "Connect Wallet"
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-60">
        <WalletList />
      </PopoverContent>
    </Popover>
  );
};

export default Profile;
