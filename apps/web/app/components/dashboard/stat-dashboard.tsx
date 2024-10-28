import React, { ReactNode } from "react";
import { Card } from "@/components/ui/card";

const StatDashboard = ({
  icon,
  title,
  value,
}: {
  icon: ReactNode;
  title: string;
  value: string | number;
}) => {
  return (
    <div className="flex justify-between">
      <div className="flex items-center gap-2">
        <Card className="bg-white p-4 inline-block">{icon}</Card>
        <div className="flex flex-col justify-center">
          <p className="text-xs font-medium">{title}</p>
          <p className="text-base font-semibold">{value}</p>
        </div>
      </div>
    </div>
  );
};

export default StatDashboard;
