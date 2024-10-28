"use client";
import React, { useEffect, useState } from "react";
import Layout, { Pages } from "@/components/layout";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { subDays, format } from "date-fns";
import { id } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarSearch, Download } from "lucide-react";
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
import {
  CartesianGrid,
  XAxis,
  LineChart,
  Line,
  Label,
  Pie,
  PieChart,
  Sector,
} from "recharts";
import { DateRange } from "react-day-picker";
import { PieSectorDataItem } from "recharts/types/polar/Pie";
import { GetReportDTO, GetTopSellingItemDTO } from "@repo/dto";
import { socket } from "@/socket";
import Spinner from "@/components/spinner";

const revenueChartConfig = {
  revenue: {
    label: "Penjualan",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;
const generateChartConfig = (data: GetTopSellingItemDTO[]): ChartConfig => {
  const config: ChartConfig = {
    total: {
      label: "Total",
    },
  };
  data.forEach((item, index) => {
    config[item.menu.replaceAll(" ", "_").toLowerCase()] = {
      label: item.menu,
      color: `hsl(var(--chart-${index + 1}))`,
    };
  });
  return config;
};
const Laporan = () => {
  const [date, setDate] = useState<DateRange | undefined>({
    from: subDays(new Date(), 6),
    to: new Date(),
  });
  const [reportData, setReportData] = useState<GetReportDTO | null>(null);
  const [isPending, setIsPending] = useState<boolean>(true);
  const onUpdateReport = ({ data }: { data: GetReportDTO }) => {
    setReportData({ ...data });
    setIsPending(false);
  };
  useEffect(() => {
    socket.on("updateReport", onUpdateReport);
    return () => {
      socket.off("updateReport", onUpdateReport);
    };
  }, []);
  useEffect(() => {
    socket.emit("getDataReport", { startDate: date!.from, endDate: date!.to });
  }, [date]);
  return (
    <Layout active={Pages.REPORT} breadcrumb={[{ title: "Laporan" }]}>
      {isPending ? (
        <Spinner />
      ) : (
        <>
          <div className="flex justify-between items-center gap-4">
            <div className="grid gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="date"
                    variant="outline"
                    className={cn(
                      "w-[300px] justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarSearch className="mr-2 h-4 w-4" />
                    {date?.from ? (
                      date.to ? (
                        <>
                          {format(date.from, "LLL dd, y", { locale: id })} -{" "}
                          {format(date.to, "LLL dd, y", { locale: id })}
                        </>
                      ) : (
                        format(date.from, "LLL dd, y")
                      )
                    ) : (
                      <span>Pilih tanggal</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={date?.from}
                    selected={date}
                    onSelect={setDate}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <div className="flex gap-4">
            <Card className="flex-grow h-full w-full">
              <CardHeader>
                <CardTitle>Grafik Penjualan</CardTitle>
                <CardDescription className="text-stone-800">
                  {date?.from &&
                    (date.to ? (
                      <>
                        {format(date.from, "LLL dd, y")} -{" "}
                        {format(date.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(date.from, "LLL dd, y")
                    ))}
                </CardDescription>
              </CardHeader>
              <CardContent className="font-semibold">
                <ChartContainer config={revenueChartConfig}>
                  <LineChart
                    accessibilityLayer
                    data={reportData!.revenueChartData}
                  >
                    <CartesianGrid vertical={false} horizontal={false} />
                    <XAxis
                      dataKey="date"
                      tickLine={true}
                      axisLine={true}
                      tickMargin={8}
                      tickFormatter={(value) =>
                        format(new Date(value), "E", { locale: id })
                      }
                    />
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent />}
                    />
                    <Line
                      dataKey="revenueAmount"
                      type="natural"
                      stroke="var(--color-revenue)"
                      strokeWidth={2}
                      dot={{
                        fill: "var(--color-revenue)",
                      }}
                      activeDot={{
                        r: 6,
                      }}
                    />
                  </LineChart>
                </ChartContainer>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full flex items-center gap-2"
                  variant="outline"
                  size="sm"
                >
                  <Download className="h-5 w-5" />
                  Unduh Laporan
                </Button>
              </CardFooter>
            </Card>
            <div className="max-w-96 w-full">
              <Card className="h-full w-full flex flex-col">
                <CardHeader>
                  <CardTitle>Grafik Item Terlaris</CardTitle>
                  <CardDescription className="text-stone-800">
                    {date?.from &&
                      (date.to ? (
                        <>
                          {format(date.from, "LLL dd, y")} -{" "}
                          {format(date.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(date.from, "LLL dd, y")
                      ))}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 pb-0">
                  <ChartContainer
                    config={generateChartConfig(
                      reportData!.topSellingItemsChartData
                    )}
                    className="mx-auto aspect-square"
                  >
                    <PieChart>
                      <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent hideLabel />}
                      />
                      <Pie
                        data={reportData!.topSellingItemsChartData}
                        dataKey="total"
                        nameKey="menu"
                        innerRadius={80}
                        strokeWidth={5}
                        activeIndex={2}
                        activeShape={({
                          outerRadius = 0,
                          ...props
                        }: PieSectorDataItem) => (
                          <Sector {...props} outerRadius={outerRadius + 10} />
                        )}
                      >
                        <Label
                          content={({ viewBox }) => {
                            if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                              return (
                                <text
                                  x={viewBox.cx}
                                  y={viewBox.cy}
                                  textAnchor="middle"
                                  dominantBaseline="middle"
                                >
                                  <tspan
                                    x={viewBox.cx}
                                    y={viewBox.cy}
                                    className="fill-foreground text-sm font-semibold"
                                  >
                                    {
                                      reportData!.topSellingItemsChartData[0]!
                                        .menu
                                    }
                                  </tspan>
                                  <tspan
                                    x={viewBox.cx}
                                    y={(viewBox.cy || 0) + 24}
                                  >
                                    {`Terjual ${
                                      reportData!.topSellingItemsChartData[0]!
                                        .total
                                    }
                                    `}
                                  </tspan>
                                </text>
                              );
                            }
                          }}
                        />
                      </Pie>
                    </PieChart>
                  </ChartContainer>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full flex items-center gap-2"
                    variant="outline"
                    size="sm"
                  >
                    <Download className="h-5 w-5" />
                    Unduh Laporan
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </>
      )}
    </Layout>
  );
};

export default Laporan;
