import Profile from "@/components/modules/profile";

export default function Home() {
  return (
    <div className="bg-[#0a0f1e] h-svh text-white flex flex-col gap-4 items-center justify-center">
      <div className="font-bold text-4xl">The CRYPTO LUCKY DRAW</div>
      <div className="text-base">Get Started by logging in with your MetaMask</div>

      <Profile/>
    </div>
  );
}
