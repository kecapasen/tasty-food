"use client";
import React, { useEffect, useState } from "react";
import Layout, { Pages } from "@/components/layout";
import { Card } from "@/components/ui/card";
import { ChartConfig } from "@/components/ui/chart";
import { FileText, DollarSign, ClockAlert, TrendingUp } from "lucide-react";
import StatDashboard from "@/components/dashboard/stat-dashboard";
import { toIDR } from "@/util";
import SalesChartDashboard from "@/components/dashboard/sales-chart-dashboard";
import ListTransactionDashboard from "@/components/dashboard/list-transaction-dashboard";
import { socket } from "@/socket";
import { GetDashboardDTO } from "@repo/dto";
import Spinner from "@/components/spinner";

const chartConfig = {
  today: {
    label: "Hari ini",
    color: "hsl(var(--chart-1))",
  },
  yesterday: {
    label: "Kemarin",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

const Admin = () => {
  const [dashboardData, setDashboardData] = useState<GetDashboardDTO | null>(
    null
  );
  const [isPending, setIsPending] = useState<boolean>(true);
  useEffect(() => {
    const onUpdateDashboard = ({ data }: { data: GetDashboardDTO }) => {
      setDashboardData({ ...data });
      setIsPending(false);
    };
    socket.on("updateDashboard", onUpdateDashboard);
    socket.emit("getDataDashboard");
    return () => {
      socket.off("updateDashboard", onUpdateDashboard);
    };
  }, []);
  return (
    <Layout active={Pages.DASHBOARD} breadcrumb={[{ title: "Dashboard" }]}>
      {isPending ? (
        <Spinner />
      ) : (
        <>
          <Card className="grid md:grid-cols-2 lg:grid-cols-4 p-4 gap-4">
            <StatDashboard
              icon={<FileText className="h-5 w-5 text-accent" />}
              title="Pesanan"
              value={dashboardData?.totalOrders || 0}
            />
            <StatDashboard
              icon={<DollarSign className="h-5 w-5 text-accent" />}
              title="Pendapatan"
              value={toIDR(dashboardData?.totalRevenue || 0)}
            />
            <StatDashboard
              icon={<ClockAlert className="h-5 w-5 text-accent" />}
              title="Tertunda"
              value={dashboardData?.totalPendingOrders || 0}
            />
            <StatDashboard
              icon={<TrendingUp className="h-5 w-5 text-accent" />}
              title="Terlaris"
              value={dashboardData?.topSellingItem || ""}
            />
          </Card>
          <div className="flex flex-col lg:flex-row gap-4 xl:max-h-[38rem] lg:max-h-[27rem]">
            <SalesChartDashboard
              chartConfig={chartConfig}
              chartData={dashboardData?.salesByHourData || []}
            />
            <ListTransactionDashboard orders={dashboardData?.orders || []} />
          </div>
        </>
      )}
    </Layout>
  );
};

export default Admin;
