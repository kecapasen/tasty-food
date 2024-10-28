import React from "react";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { FileText } from "lucide-react";
import { toIDR, formatDate } from "@/util";
import { Status } from "@repo/db";
import { GetOrderReportDTO } from "@repo/dto";

const CardTransactionDashboard = ({
  order,
  index,
}: {
  order: GetOrderReportDTO;
  index: number;
}) => {
  return (
    <div className="flex flex-col">
      <div className="flex gap-2 py-4 px-6 hover:bg-muted cursor-pointer">
        <div>
          <Card className="bg-accent p-2 inline-block">
            <FileText className="h-5 w-5 text-white" />
          </Card>
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-sm font-semibold">{`# ${index + 1}`}</p>
          <p className="text-sm font-medium">{toIDR(order.totalAmount)}</p>
          <p className="text-xs text-muted-foreground">
            {formatDate(order.createdAt)}
          </p>
          <Badge
            variant={
              order.orderStatus === Status.COMPLETED
                ? "default"
                : order.orderStatus === Status.PROGRESS
                  ? "secondary"
                  : order.orderStatus === Status.PENDING
                    ? "outline"
                    : "destructive"
            }
            className="text-xs"
          >
            {order.orderStatus}
          </Badge>
        </div>
      </div>
      <Separator />
    </div>
  );
};

export default CardTransactionDashboard;
