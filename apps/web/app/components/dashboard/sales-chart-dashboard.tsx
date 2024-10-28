import { toIDR } from "@/util";
import React from "react";
import { LineChart, CartesianGrid, XAxis, Line } from "recharts";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components//ui/chart";
import { GetSalesByHourDTO } from "@repo/dto";

const SalesChartDashboard = ({
  chartConfig,
  chartData,
}: {
  chartConfig: ChartConfig;
  chartData: GetSalesByHourDTO[];
}) => {
  return (
    <Card className="lg:flex-grow w-full h-full max-h-[22rem] md:max-h-[36rem] lg:max-h-full">
      <CardHeader>
        <CardTitle>Grafik Penjualan</CardTitle>
        <CardDescription>
          Menampilkan total penjualan hari ini dan kemarin
        </CardDescription>
      </CardHeader>
      <CardContent className="font-semibold">
        <ChartContainer config={chartConfig}>
          <LineChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} horizontal={false} />
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
                        {chartConfig[name as keyof typeof chartConfig]?.label ||
                          name}
                        <div className="ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums">
                          {toIDR(parseInt(value.toString()))}
                        </div>
                        {index === 1 && (
                          <div className="mt-1.5 flex basis-full items-center border-t pt-1.5 text-xs font-semibold">
                            Selisih
                            <div className="ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums">
                              {toIDR(
                                Math.abs(
                                  item.payload.today - item.payload.yesterday
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
            <Line
              dataKey="today"
              type="monotone"
              stroke="var(--color-today)"
              strokeWidth={2}
              dot={true}
            />
            <Line
              dataKey="yesterday"
              type="monotone"
              stroke="var(--color-yesterday)"
              strokeWidth={2}
              dot={true}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default SalesChartDashboard;
