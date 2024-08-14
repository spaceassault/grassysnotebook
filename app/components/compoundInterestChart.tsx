import { useState } from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from './ui/card';
import { ChartConfig, ChartContainer, ChartTooltipContent, ChartLegendContent } from './ui/chart';
import { Button } from './ui/button';

interface ChartDataItem {
    month: number;
    principal: string;
    interest: string;
    total: string;
  }
  
  export default function CompoundInterestChart() {
    const [initialAmount, setInitialAmount] = useState(1000);
    const [apr, setApr] = useState(5);
    const [frequency, setFrequency] = useState(12);
    const [period, setPeriod] = useState(10);
    const [chartData, setData] = useState<ChartDataItem[]>([]);
    const [totalAccrued, setTotalAccrued] = useState<string | null>(null);
  
    const calculateCompoundInterest = () => {
      const rate = apr / 100; // Convert APR from percentage to a decimal
      const result: ChartDataItem[] = [];
      const principal = initialAmount;
  
      for (let year = 1; year <= period; year++) {
        const A = principal * Math.pow(1 + rate / frequency, frequency * year);
        const interest = A - principal;
        result.push({
          month: year * frequency,  // Representing total number of months
          principal: principal.toFixed(2),
          interest: interest.toFixed(2),
          total: A.toFixed(2),
        });
      }
  
      setData(result);
  
      // Extract the total from the last period
      const finalTotal = result.length > 0 ? result[result.length - 1].total : null;
      setTotalAccrued(finalTotal);
    };

    const chartConfig = {
        principal: {
          label: "Principal",
          color: "hsl(var(--chart-1))",
        },
        interest: {
          label: "Interest",
          color: "hsl(var(--chart-2))",
        },
      } satisfies ChartConfig;

  return (
    <Card >
      <CardHeader className='flex flex-col md:flex-row md:flex-wrap'>
        <div >
        <CardTitle>Compound Interest Calculator</CardTitle>
        <CardDescription className='hidden md:flex'>Visualizing the growth of your investment over time</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col md:flex-row">
        <div className="flex gap- mt-2">
            <div className="flex flex-row flex-wrap md:flex-col">
                <Label htmlFor="initialAmount" className="py-2">Initial Amount</Label>
                <Input
                type="number"
                value={initialAmount}
                onChange={(event) => setInitialAmount(Number(event.target.value))}
                placeholder="Initial Amount"
                />
                <Label htmlFor="apr" className="py-2">APR (%)</Label>
                <Input
                type="number"
                value={apr}
                onChange={(event) => setApr(Number(event.target.value))}
                placeholder="APR (%)"
                />
                <Label htmlFor="frequency" className="py-2">Compounding Frequency</Label>
                <Input
                type="number"
                value={frequency}
                onChange={(event) => setFrequency(Number(event.target.value))}
                placeholder="Compounding Frequency"
                />
                <Label htmlFor="period" className="py-2">Period (Years)</Label>
                <Input
                type="number"
                value={period}
                onChange={(event) => setPeriod(Number(event.target.value))}
                placeholder="Period (Years)"
                />
                <Button onClick={calculateCompoundInterest} className="mt-2 py-2">Calculate</Button>
            </div>
        </div>
        <ChartContainer config={chartConfig} className="min-h-[300px] max-h-[700px] w-full m-2">
            <div className="flex justify-center w-full">
            <CardTitle className="text-2xl">Total Balance ${totalAccrued}</CardTitle>
            </div>
          <BarChart data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => `Year ${value / frequency}`}
            />
            <YAxis />
            <Tooltip content={<ChartTooltipContent hideLabel />} />
            <Legend content={<ChartLegendContent />} />
            <Bar dataKey="principal" stackId="a" fill="var(--color-principal)" radius={[0, 0, 4, 4]} />
            <Bar dataKey="interest" stackId="a" fill="var(--color-interest)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="hidden md:flex flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Review your investment growth over time.
        </div>
        <div className="leading-none text-muted-foreground">
          This chart shows the accumulated interest and principal over the investment period.
        </div>
      </CardFooter>
    </Card>
  );
}



