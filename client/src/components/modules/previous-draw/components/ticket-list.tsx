import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React from "react";

const lotteryData = [
  {
    id: "#1234",
    date: "March 10, 2025",
    prize: "0.01 BNB",
    winner: "0x1234...5678",
  },
  {
    id: "#1235",
    date: "March 11, 2025",
    prize: "0.02 BNB",
    winner: "0x2345...6789",
  },
  {
    id: "#1236",
    date: "March 12, 2025",
    prize: "0.05 BNB",
    winner: "0x3456...7890",
  },
  {
    id: "#1237",
    date: "March 13, 2025",
    prize: "0.03 BNB",
    winner: "0x4567...8901",
  },
  {
    id: "#1238",
    date: "March 14, 2025",
    prize: "0.01 BNB",
    winner: "0x5678...9012",
  },
];

const TicketList = () => {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-[#141B33] border-b border-[#0A0F1E]">
            <TableHead className="text-white font-medium w-[100px]">
              DRAW ID
            </TableHead>
            <TableHead className="text-white text-right font-medium">
              DATE
            </TableHead>
            <TableHead className="text-white text-right font-medium">
              PRIZE
            </TableHead>
            <TableHead className="text-white text-right font-medium">
              WINNER
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {lotteryData.map((item, idx) => (
            <TableRow
              key={item.id}
              className={`${
                idx % 2 === 0 ? "bg-[#0A0F1E]/50" : "bg-[#141B33]/20"
              } hover:bg-[#1E293B] transition-colors`}
            >
              <TableCell className="text-[#6366F1] font-medium">
                {item.id}
              </TableCell>
              <TableCell className="text-gray-300 text-right">
                {item.date}
              </TableCell>
              <TableCell className="text-[#10B981] font-medium text-right">
                {item.prize}
              </TableCell>
              <TableCell className="text-gray-300 text-right font-mono">
                <span className="md:hidden">{item.winner}</span>
                <span className="hidden md:inline">{item.winner}</span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TicketList;
