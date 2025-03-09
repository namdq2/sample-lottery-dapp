"use client";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import React, { useEffect } from "react";
import { useAccount } from "wagmi";
import WalletIcon from "../../icons/wallet-icon";
import WalletList from "./components/wallet-list";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/common";

const Profile = () => {
  const { address } = useAccount();
  const router = useRouter();

  useEffect(() => {
    if (address) {
      router.push(ROUTES.LOTTERY);
    }
  }, [address]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="bg-[#4f46e5] hover:bg-[#342db6] w-40" size={"lg"}>
          <WalletIcon />
          Connect Wallet
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-60">
        <WalletList />
      </PopoverContent>
    </Popover>
  );
};

export default Profile;
