import Header from "@/components/modules/layout/header";

type LotteryLayoutProps = Readonly<{ children: React.ReactNode }>;

const LotteryLayout = ({ children }: LotteryLayoutProps) => {
  return (
    <div className="bg-[#0a0f1e]">
      <Header />
      {children}
    </div>
  );
};

export default LotteryLayout;
