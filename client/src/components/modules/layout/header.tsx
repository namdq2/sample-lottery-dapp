"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import lotteryLogo from "@/assets/images/lottery-logo.png";
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
  }, [address])

  return (
    <div className="border-b border-b-[#0a1f1c] h-fit flex justify-between items-center py-2 px-14 bg-[#091818]">
      <div className="leading-8 font-extrabold text-xl flex items-center gap-2">
        <Image src={lotteryLogo} width={50} height={50} alt="lottery-logo" />
        <div>
          <span className="text-white">DLottery</span>
          <div className="text-base font-medium w-36 truncate text-[#036756]" title={address}>User: {address}</div>
        </div>
      </div>

      <div className="p-2 rounded-lg bg-[#0a1f1c]">
        <Button className="bg-[#036756] hover:bg-[#036756]">Buy Tickets</Button>
        <Button onClick={() => disconnect()}>Disconnect</Button>
      </div>

      <MenuIcon className="fill-white" />
    </div>
  );
};

export default Header;
