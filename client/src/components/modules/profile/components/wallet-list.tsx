import { Button } from "@/components/ui/button";
import React from "react";
import { toast } from "react-toastify";
import { useConnect } from "wagmi";

const WalletList = () => {
  const { connect, connectors, error } = useConnect();

  if (error) {
    toast(error.message);
  }

  return (
    <div className="flex flex-col gap-2">
      {connectors.map((connector) => (
        <Button key={connector.id} onClick={() => connect({ connector })}>
          {connector.name}
        </Button>
      ))}
    </div>
  );
};

export default WalletList;
