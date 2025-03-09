import AdminPanel from "@/components/modules/admin-panel";
import NextLotteryDraw from "@/components/modules/next-lottery-draw";
import PreviousDraw from "@/components/modules/previous-draw";

export default function Home() {
  return (
    <div className="px-14 py-8 flex flex-col gap-9">
      <AdminPanel />

      <NextLotteryDraw />

      <PreviousDraw />
    </div>
  );
}
