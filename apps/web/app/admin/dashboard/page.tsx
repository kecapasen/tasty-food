"use client";
import React from "react";
import Layout from "@/components/layout";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Separator } from "@/components/ui/separator";
import { FileText, DollarSign, ClockAlert, TrendingUp } from "lucide-react";
import { AreaChart, CartesianGrid, XAxis, Area } from "recharts";
import { Badge } from "@/components/ui/badge";
export const description = "A simple area chart";
const chartData = [
  { hour: "08:00", today: 150000, yesterday: 120000 },
  { hour: "09:00", today: 250000, yesterday: 180000 },
  { hour: "10:00", today: 300000, yesterday: 240000 },
  { hour: "11:00", today: 420000, yesterday: 350000 },
  { hour: "12:00", today: 520000, yesterday: 480000 },
  { hour: "13:00", today: 450000, yesterday: 430000 },
  { hour: "14:00", today: 310000, yesterday: 290000 },
  { hour: "15:00", today: 370000, yesterday: 330000 },
  { hour: "16:00", today: 600000, yesterday: 500000 },
  { hour: "17:00", today: 720000, yesterday: 650000 },
  { hour: "18:00", today: 810000, yesterday: 750000 },
  { hour: "19:00", today: 950000, yesterday: 900000 },
  { hour: "20:00", today: 850000, yesterday: 800000 },
  { hour: "21:00", today: 600000, yesterday: 550000 },
];

const orders = [
  {
    orderNumber: "Pesanan #110",
    amount: "Rp 77.000",
    timeAgo: "2 menit yang lalu",
    status: "Tertunda",
  },
  {
    orderNumber: "Pesanan #109",
    amount: "Rp 120.000",
    timeAgo: "5 menit yang lalu",
    status: "Progress",
  },
  {
    orderNumber: "Pesanan #108",
    amount: "Rp 45.000",
    timeAgo: "10 menit yang lalu",
    status: "Selesai",
  },
  {
    orderNumber: "Pesanan #107",
    amount: "Rp 98.500",
    timeAgo: "15 menit yang lalu",
    status: "Selesai",
  },
  {
    orderNumber: "Pesanan #106",
    amount: "Rp 250.000",
    timeAgo: "20 menit yang lalu",
    status: "Selesai",
  },
  {
    orderNumber: "Pesanan #105",
    amount: "Rp 175.000",
    timeAgo: "30 menit yang lalu",
    status: "Selesai",
  },
];
const chartConfig = {
  today: {
    label: "Hari ini",
    color: "hsl(var(--chart-4))",
  },
  yesterday: {
    label: "Kemarin",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;
const Admin = () => {
  return (
    <Layout breadcrumb={[{ title: "Dashboard" }]}>
      <Card className="grid md:grid-cols-2 lg:grid-cols-4 p-4 gap-4">
        <div className="flex justify-between">
          <div className="flex items-center gap-2">
            <Card className="bg-sky-500 p-4 inline-block">
              <FileText className="h-5 w-5 text-white" />
            </Card>
            <div className="flex flex-col justify-center">
              <p className="text-sm font-semibold">Pesanan</p>
              <p className="text-base">110</p>
            </div>
          </div>
        </div>
        <div className="flex justify-between">
          <div className="flex items-center gap-2">
            <Card className="bg-emerald-500 p-4 inline-block">
              <DollarSign className="h-5 w-5 text-white" />
            </Card>
            <div className="flex flex-col justify-center">
              <p className="text-sm font-semibold">Pendapatan</p>
              <p className="text-base">
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  maximumFractionDigits: 0,
                }).format(
                  chartData.reduce((sum, entry) => sum + entry.today, 0)
                )}
              </p>
            </div>
          </div>
        </div>
        <div className="flex justify-between">
          <div className="flex items-center gap-2">
            <Card className="bg-amber-500 p-4 inline-block">
              <ClockAlert className="h-5 w-5 text-white" />
            </Card>
            <div className="flex flex-col justify-center">
              <p className="text-sm font-semibold">Tertunda</p>
              <p className="text-base">1</p>
            </div>
          </div>
        </div>
        <div className="flex justify-between">
          <div className="flex items-center gap-2">
            <Card className="bg-rose-500 p-4 inline-block">
              <TrendingUp className="h-5 w-5 text-white" />
            </Card>
            <div className="flex flex-col justify-center">
              <p className="text-sm font-semibold">Terlaris</p>
              <p className="text-base">Spaghetti</p>
            </div>
          </div>
        </div>
      </Card>
      <div className="flex flex-col lg:flex-row gap-4 xl:max-h-[38rem] lg:max-h-[27rem]">
        <Card className="lg:flex-grow w-full h-full max-h-[22rem] md:max-h-[36rem] lg:max-h-full">
          <CardHeader>
            <CardTitle>Grafik Penjualan</CardTitle>
            <CardDescription className="text-stone-800">
              Menampilkan total penjualan hari ini dan kemarin
            </CardDescription>
          </CardHeader>
          <CardContent className="font-semibold">
            <ChartContainer config={chartConfig}>
              <AreaChart
                accessibilityLayer
                data={chartData}
                margin={{
                  left: 16,
                  right: 16,
                }}
              >
                <CartesianGrid vertical={true} />
                <XAxis
                  dataKey="hour"
                  tickLine={true}
                  axisLine={true}
                  tickMargin={8}
                  tickFormatter={(value) => value}
                />
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      className="w-64 bg-white/75 backdrop-blur-sm"
                      labelFormatter={(value) => {
                        return (
                          <p className="mb-1.5 font-semibold border-b pb-1.5">
                            Jam {value}
                          </p>
                        );
                      }}
                      formatter={(value, name, item, index) => {
                        return (
                          <>
                            <div
                              className="h-2.5 w-2.5 shrink-0 rounded-[2px] bg-[--color-bg]"
                              style={
                                {
                                  "--color-bg": `var(--color-${name})`,
                                } as React.CSSProperties
                              }
                            />
                            {chartConfig[name as keyof typeof chartConfig]
                              ?.label || name}
                            <div className="ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-foreground">
                              {new Intl.NumberFormat("id-ID", {
                                style: "currency",
                                currency: "IDR",
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0,
                              }).format(parseInt(value.toString()))}
                            </div>
                            {index === 1 && (
                              <div className="mt-1.5 flex basis-full items-center border-t pt-1.5 text-xs text-foreground font-semibold">
                                Selisih
                                <div className="ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-foreground">
                                  {new Intl.NumberFormat("id-ID", {
                                    style: "currency",
                                    currency: "IDR",
                                    minimumFractionDigits: 0,
                                    maximumFractionDigits: 0,
                                  }).format(
                                    Math.abs(
                                      item.payload.today -
                                        item.payload.yesterday
                                    )
                                  )}
                                </div>
                              </div>
                            )}
                          </>
                        );
                      }}
                    />
                  }
                />
                <defs>
                  <linearGradient id="fillToday" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--color-yesterday)"
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-yesterday)"
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                  <linearGradient
                    id="fillYesterday"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="var(--color-today)"
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-today)"
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                </defs>
                <Area
                  dataKey="today"
                  type="natural"
                  fill="url(#fillToday)"
                  fillOpacity={0.4}
                  stroke="var(--color-yesterday)"
                  stackId="a"
                />
                <Area
                  dataKey="yesterday"
                  type="natural"
                  fill="url(#fillYesterday)"
                  fillOpacity={0.4}
                  stroke="var(--color-today)"
                  stackId="a"
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
          <CardFooter>
            <div className="flex w-full items-start gap-2 text-sm">
              <div className="grid gap-2">
                <div className="font-semibold leading-none">
                  Penjualan meningkat sebesar 8,7% dibandingkan kemarin{" "}
                  <TrendingUp className="inline first-letter:h-5 w-5 text-green-500" />
                </div>
                <div className="flex items-center gap-2 leading-none text-stone-800">
                  Perbandingan Penjualan Per Jam: Hari Ini vs Kemarin
                </div>
              </div>
            </div>
          </CardFooter>
        </Card>
        <Card className="w-full lg:w-96 overflow-x-hidden">
          <div className="lg:w-full lg:h-full lg:max-h-full max-h-[22rem] md:max-h-[36rem] overflow-y-hidden overflow-x-hidden hover:overflow-y-scroll">
            <CardHeader className="sticky top-0 bg-white">
              <CardTitle>Pesanan</CardTitle>
              <CardDescription className="text-stone-800">
                Pesanan terkini
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <Separator />
              {orders.map((order, index) => {
                return (
                  <div className="flex flex-col gap-4" key={index}>
                    <div className="flex gap-2">
                      <div>
                        <Card className="bg-sky-500 p-2 inline-block">
                          <FileText className="h-5 w-5 text-white" />
                        </Card>
                      </div>
                      <div className="flex flex-col gap-1">
                        <p className="text-sm font-semibold">
                          {order.orderNumber}
                        </p>
                        <p className="text-sm">{order.amount}</p>
                        <p className="text-xs">{order.timeAgo}</p>
                        <Badge
                          className={`text-xs ${
                            order.status === "Selesai"
                              ? "bg-emerald-500"
                              : order.status === "Progress"
                                ? "bg-sky-500"
                                : order.status === "Tertunda" && "bg-amber-500"
                          }`}
                        >
                          {order.status}
                        </Badge>
                      </div>
                    </div>
                    <Separator />
                  </div>
                );
              })}
            </CardContent>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default Admin;
