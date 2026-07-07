"use client";

import { SuccessSummary } from "./SuccessSummary";
import { ReceiptTemplate } from "./ReceiptTemplate";

interface ReceiptItem {
  name: string;
  quantity: number;
  price: number;
}

interface CheckoutSuccessProps {
  queueNumber: string;
  total: number;
  cashReceived: number;
  changeAmount: number;
  items?: ReceiptItem[];
  orderType?: string;
  onNewOrder: () => void;
}

export function CheckoutSuccess({
  queueNumber,
  total,
  cashReceived,
  changeAmount,
  items,
  orderType,
  onNewOrder,
}: CheckoutSuccessProps) {
  const handlePrint = () => window.print();

  return (
    <>
      <SuccessSummary
        queueNumber={queueNumber}
        total={total}
        cashReceived={cashReceived}
        changeAmount={changeAmount}
        onPrint={handlePrint}
        onNewOrder={onNewOrder}
      />
      <ReceiptTemplate
        queueNumber={queueNumber}
        total={total}
        cashReceived={cashReceived}
        changeAmount={changeAmount}
        items={items}
        orderType={orderType}
      />
    </>
  );
}