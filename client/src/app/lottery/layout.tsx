import Header from "@/components/modules/layout/header";
import { ToastProvider } from "@/components/context/toast-context";

type LotteryLayoutProps = Readonly<{ children: React.ReactNode }>;

const LotteryLayout = ({ children }: LotteryLayoutProps) => {
  return (
    <div className="bg-[#0a0f1e]">
      <Header />
      <ToastProvider>{children}</ToastProvider>
    </div>
  );
};

export default LotteryLayout;
