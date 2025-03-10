import Profile from "@/components/modules/profile";
import { ArrowRight, Gift, Trophy, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <div className="bg-gradient-to-b from-[#0a0f1e] to-[#141B33] min-h-svh text-white flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-3xl w-full mx-auto flex flex-col items-center">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <div className="inline-block mb-6">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#6366F1] to-[#F43F5E] rounded-lg blur opacity-30"></div>
              <div className="relative bg-[#1E293B] px-6 py-3 rounded-lg border border-[#6366F1]/20">
                <Sparkles className="inline-block mr-2 h-5 w-5 text-[#FBBF24]" />
                <span className="font-medium">Blockchain-Powered Lottery</span>
              </div>
            </div>
          </div>

          <h1 className="font-extrabold text-4xl md:text-5xl lg:text-6xl mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#6366F1] to-[#F43F5E]">
            THE CRYPTO LUCKY DRAW
          </h1>

          <p className="text-base md:text-lg text-gray-300 max-w-lg mx-auto mb-8">
            Participate in our decentralized lottery with transparent draws and
            secure prize distribution on the blockchain.
          </p>

          <div className="mb-10">
            <Profile />
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          <div className="bg-[#1E293B] p-6 rounded-xl border border-[#6366F1]/20 hover:border-[#6366F1]/50 transition-all">
            <div className="bg-[#6366F1]/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <Trophy className="h-6 w-6 text-[#6366F1]" />
            </div>
            <h3 className="font-bold text-lg mb-2">Fair & Transparent</h3>
            <p className="text-gray-400">
              All draws are performed on the blockchain with verifiable
              randomness.
            </p>
          </div>

          <div className="bg-[#1E293B] p-6 rounded-xl border border-[#10B981]/20 hover:border-[#10B981]/50 transition-all">
            <div className="bg-[#10B981]/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <Gift className="h-6 w-6 text-[#10B981]" />
            </div>
            <h3 className="font-bold text-lg mb-2">Instant Prizes</h3>
            <p className="text-gray-400">
              Withdraw your winnings immediately to your wallet after draws.
            </p>
          </div>

          <div className="bg-[#1E293B] p-6 rounded-xl border border-[#FBBF24]/20 hover:border-[#FBBF24]/50 transition-all">
            <div className="bg-[#FBBF24]/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <ArrowRight className="h-6 w-6 text-[#FBBF24]" />
            </div>
            <h3 className="font-bold text-lg mb-2">Easy to Join</h3>
            <p className="text-gray-400">
              Connect your wallet and start participating in seconds.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
