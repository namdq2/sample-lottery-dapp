import Profile from "@/components/modules/profile";
import Image from "next/image";
import lotteryLogo from "@/assets/images/lottery-logo.png";

export default function Home() {
  return (
    <div className="bg-[#091818] h-svh text-white flex flex-col gap-4 items-center justify-center">
      <Image src={lotteryLogo} width={150} height={150} alt="lottery-logo" />

      <div className="font-bold text-4xl">The CRYPTO LUCKY DRAW</div>
      <div className="text-base">Get Started by logging in with your MetaMask</div>

      <Profile/>
    </div>
  );
}
