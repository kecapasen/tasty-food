"use client";
import React from "react";
import Layout from "@/components/layout";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { subDays, format } from "date-fns";
import { id } from "date-fns/locale";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarSearch, Download, TrendingUp } from "lucide-react";
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
  AreaChart,
  CartesianGrid,
  XAxis,
  Area,
  LineChart,
  Line,
  RadialBarChart,
  RadialBar,
  PolarRadiusAxis,
  Label,
  Pie,
  PieChart,
  Sector,
} from "recharts";
import { DateRange } from "react-day-picker";
import { PieSectorDataItem } from "recharts/types/polar/Pie";
export const description = "A simple area chart";
const revenueChartData = [
  { date: "2024-09-08", revenue: 1200000 },
  { date: "2024-09-08", revenue: 900000 },
  { date: "2024-09-09", revenue: 1700000 },
  { date: "2024-09-10", revenue: 2300000 },
  { date: "2024-09-11", revenue: 890000 },
  { date: "2024-09-12", revenue: 3400000 },
  { date: "2024-09-14", revenue: 5500000 },
];
const revenueChartConfig = {
  revenue: {
    label: "Penjualan",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;
const methodChartData = [
  { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
  { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
  { browser: "firefox", visitors: 287, fill: "var(--color-firefox)" },
  { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
];
const methodChartConfig = {
  visitors: {
    label: "Visitors",
  },
  chrome: {
    label: "Chrome",
    color: "hsl(var(--chart-1))",
  },
  safari: {
    label: "Safari",
    color: "hsl(var(--chart-2))",
  },
  firefox: {
    label: "Firefox",
    color: "hsl(var(--chart-3))",
  },
  edge: {
    label: "Edge",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig;
const Laporan = () => {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: subDays(new Date(), 6),
    to: new Date(),
  });
  const totalVisitors = React.useMemo(() => {
    return methodChartData.reduce((sum, entry) => sum + entry.visitors, 0);
  }, []);
  return (
    <Layout breadcrumb="Laporan">
      <Separator />
      <div className="flex justify-between items-center gap-4">
        <div className="grid gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant={"outline"}
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
                data={revenueChartData}
                margin={{
                  left: 16,
                  right: 16,
                }}
              >
                <CartesianGrid vertical={true} />
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
                  dataKey="revenue"
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
                config={methodChartConfig}
                className="mx-auto aspect-square"
              >
                <PieChart>
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Pie
                    data={methodChartData}
                    dataKey="visitors"
                    nameKey="browser"
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
                                className="fill-foreground text-xl font-bold"
                              >
                                Spaghetti
                              </tspan>
                              <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24}>
                                1.021 Terjual
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
    </Layout>
  );
};

export default Laporan;
