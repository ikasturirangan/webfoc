import { useEffect, useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";
import { CartesianGrid, Legend, Line, LineChart, XAxis, YAxis } from "recharts";
import { useSerialLineEvent } from "@/lib/useSerialLineEvent";

const COLORS = ["red", "green", "blue", "orange", "pink"];
const MAX_POINTS = 100;

type ChartData = {
  date: string;
  current: number | null;
  velocity: number | null;
  position: number | null;
};

const generateInitialData = (): ChartData[] => {
  const data = [];
  for (let i = 0; i < MAX_POINTS; i++) {
    data.push({
      date: new Date(Date.now() - (MAX_POINTS - i) * 1000).toISOString(),
      current: null,
      velocity: null,
      position: null,
    });
  }
  return data;
};

export const MotorMonitorGraph = ({ motorKey }: { motorKey: string }) => {
  const [chartData, setChartData] = useState<ChartData[]>(generateInitialData());
  const [revision, setRevision] = useState(0);
  const dataRef = useRef(chartData);

  useSerialLineEvent((line) => {
    if (line.content.startsWith(`${motorKey}M`)) {
      const points = line.content.slice(2).split("\t").map(Number);
      const newData = dataRef.current.slice(1);

      newData.push({
        date: new Date().toISOString(),
        current: points[0],
        velocity: points[1],
        position: points[2],
      });

      dataRef.current = newData;
      setChartData(newData);
      setRevision((rev) => rev + 1);
    }
  });

  return (
    <Card className="flex flex-col lg:max-w-full mt-5">
      <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2 [&>div]:flex-1">
        <div>
          <CardTitle className="flex items-baseline gap-1 text-md tabular-nums font-bold">
            Monitoring Control
          </CardTitle>
          <CardDescription className="font-bold text-md"></CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 items-center">
        <ChartContainer
          config={{
            current: {
              label: "Current",
              color: COLORS[0],
            },
            velocity: {
              label: "Velocity",
              color: COLORS[1],
            },
            position: {
              label: "Position",
              color: COLORS[2],
            },
          }}
          className="w-full"
        >
          <LineChart
            data={chartData}
            margin={{
              left: 14,
              right: 14,
              top: 10,
            }}
            syncId="motorMonitor"
          >
            <CartesianGrid
              strokeDasharray="4 4"
              vertical={false}
              stroke="hsl(var(--muted-foreground))"
              strokeOpacity={0.5}
            />
            <YAxis />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => {
                return new Date(value).toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                });
              }}
            />
            <Legend />
            <Line
              dataKey="current"
              type="monotone"
              stroke={COLORS[0]}
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="velocity"
              type="monotone"
              stroke={COLORS[1]}
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="position"
              type="monotone"
              stroke={COLORS[2]}
              strokeWidth={2}
              dot={false}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  indicator="line"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    });
                  }}
                />
              }
              cursor={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
