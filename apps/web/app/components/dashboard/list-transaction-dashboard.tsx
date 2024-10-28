import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import CardTransactionDashboard from "@/components/dashboard/card-transaction-dashboard";
import { Separator } from "@/components/ui/separator";
import { GetOrderReportDTO } from "@repo/dto";

const ListTransactionDashboard = ({
  orders,
}: {
  orders: GetOrderReportDTO[];
}) => {
  return (
    <Card className="w-full lg:w-96 overflow-x-hidden">
      <div className="lg:w-full lg:h-full lg:max-h-full max-h-[22rem] md:max-h-[36rem] overflow-y-hidden overflow-x-hidden hover:overflow-y-scroll">
        <CardHeader className="sticky top-0 bg-white">
          <CardTitle>Pesanan</CardTitle>
          <CardDescription>Pesanan terkini</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col px-0">
          <Separator />
          {orders.map((order, index) => {
            return (
              <CardTransactionDashboard
                order={order}
                index={index}
                key={index}
              />
            );
          })}
        </CardContent>
      </div>
    </Card>
  );
};

export default ListTransactionDashboard;
