import * as React from "react"
import { useState } from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from './ui/card';
import { ChartConfig, ChartContainer, ChartTooltipContent, ChartLegendContent } from './ui/chart';
import { Button } from './ui/button';
import { Combobox } from './ui/combobox';

interface ChartDataItem {
    month: number;
    principal: number;
    contributions: number;
    interest: number;
    total: number;
  }

  const frequencies = [
    { label: "Daily", value: "365" },
    { label: "Monthly", value: "12" },
    { label: "Quarterly", value: "4" },
    { label: "Semi-Annual", value: "2" },
    { label: "Annual", value: "1" },
  ] as const
  
  export default function CompoundInterestChart() {
    const [initialAmount, setInitialAmount] = useState(1000);
    const [recurringContribution, setContributionInvestment] = useState(100);
    const [contributionFrequency, setContributionFrequency] = useState(frequencies[1].value);
    const [apr, setApr] = useState(5);
    const [frequency, setFrequency] = useState(frequencies[1].value);
    const [period, setPeriod] = useState(10);
    const [chartData, setData] = useState<ChartDataItem[]>([]);
    const [totalAccrued, setTotalAccrued] = useState<string | null>(null);
  
    const calculateCompoundInterest = () => {
      const rate = apr / 100; // Convert APR from percentage to a decimal
      const n = Number(frequency); // Compounding frequency per year
      const t = Number(period); // Time in years
      const k = Number(contributionFrequency); // Contribution frequency per year
      const C = recurringContribution; // Contribution amount
      const P = initialAmount; // Initial principal

      let totalContributions: number = 0;
      const result: ChartDataItem[] = [];

      for (let year = 1; year <= t; year++) {
          const contributionTotal = C * k;
          totalContributions += contributionTotal;

          const compoundInterest = P * Math.pow(1 + rate / n, n * year);
          const contributionInterest = (C * ((Math.pow(1 + rate / k, k * year) - 1) / (rate / k)));

          const A = compoundInterest + contributionInterest;
          const interest = A - (P + totalContributions);

          result.push({
            month: year * frequency,
            contributions: parseFloat(totalContributions.toFixed(2)),
            principal: parseFloat(P.toFixed(2)),
            interest: parseFloat(interest.toFixed(2)),
            total: parseFloat(A.toFixed(2)),
        });
      }
  
      setData(result);
  
      // Extract the total from the last period

      const finalTotal = result.length > 0 ? result[result.length - 1].total : null;
      setTotalAccrued(finalTotal ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(finalTotal) : null);
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
        contributions: {
          label: "Contributions",
          color: "hsl(var(--chart-3))",
        },
      } satisfies ChartConfig;

  return (
    <Card className="w-full flex flex-col p-1 md:p-2 overflow-hidden">
      <CardHeader className='flex flex-col md:flex-row md:flex-wrap'>
        <div >
        <CardTitle>Compound Interest Calculator</CardTitle>
        <CardDescription className='hidden md:flex'>Visualizing the growth of your investment over time</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col md:flex-row flex-grow overflow-hidden">
        <div className="flex m-1 md:mt-2">
            <div className="flex flex-row flex-wrap md:flex-col">
                <Label htmlFor="initialAmount" className="py-2">Initial Amount</Label>
                <Input
                type="number"
                value={initialAmount}
                onChange={(event) => setInitialAmount(Number(event.target.value))}
                placeholder="Initial Amount"
                />
                <Label htmlFor="recuringContribution" className="py-2">Recuring Contribution</Label>
                <Input
                type="number"
                value={recurringContribution !== null ? recurringContribution.toString() : ''}
                onChange={(event) => setContributionInvestment(parseFloat(event.target.value) || 0)}
                placeholder="Recuring Contribution"
                />
                <Label htmlFor="contributionfrequency" className="py-2">Contribution Frequency</Label>
                <Combobox options={frequencies} selectedValue={contributionFrequency} onSelectValue={setContributionFrequency} />
                <Input
                type="number"
                value={contributionFrequency}
                onChange={(event) => setContributionFrequency(Number(event.target.value))}
                placeholder="Contribution Frequency"
                className="hidden"
                />
                <Label htmlFor="apr" className="py-2">APR (%)</Label>
                <Input
                type="number"
                value={apr}
                onChange={(event) => setApr(Number(event.target.value))}
                placeholder="APR (%)"
                />
                <Label htmlFor="frequency" className="py-2">Compounding Frequency</Label>
                <Combobox options={frequencies} selectedValue={frequency} onSelectValue={setFrequency} />
                <Input
                type="number"
                value={frequency}
                onChange={(event) => setFrequency(Number(event.target.value))}
                placeholder="Compounding Frequency"
                className="hidden"
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
        <ChartContainer config={chartConfig} className="min-h-[350px] max-h-[550px] w-full flex-grow md:m-2">
            <div className="flex justify-center w-full mb-1">
            <CardTitle className="text-2xl">Total Balance {totalAccrued}</CardTitle>
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
            <Bar dataKey="contributions" stackId="a" fill="var(--color-contributions)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="interest" stackId="a" fill="var(--color-interest)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      {/* <CardFooter className="hidden md:flex flex-col items-start gap-1 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Review your investment growth over time.
        </div>
        <div className="leading-none text-muted-foreground">
          This chart shows the accumulated interest and principal over the investment period.
        </div>
      </CardFooter> */}
    </Card>
  );
}



