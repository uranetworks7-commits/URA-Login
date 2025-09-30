'use client';

import { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const generateDataPoint = (lastValue: number) => {
    // Increased volatility for a more realistic trading look
    const changePercent = (Math.random() - 0.48) * 0.15; // More pronounced swings
    let newValue = lastValue * (1 + changePercent);
    // Keep values within a reasonable range
    newValue = Math.max(20, Math.min(200, newValue));
    return { time: new Date().getTime(), value: newValue };
};

export function TradingGraph() {
    const [data, setData] = useState(() => {
        const initialData = [];
        let lastValue = 100;
        for (let i = 0; i < 50; i++) { // More data points for a denser graph
            const newDataPoint = generateDataPoint(lastValue);
            initialData.push(newDataPoint);
            lastValue = newDataPoint.value;
        }
        return initialData;
    });

    useEffect(() => {
        const interval = setInterval(() => {
            setData(prevData => {
                const lastValue = prevData.length > 0 ? prevData[prevData.length - 1].value : 100;
                const newDataPoint = generateDataPoint(lastValue);
                // Keep the array at a fixed size for a scrolling effect
                const newData = [...prevData.slice(1), newDataPoint];
                return newData;
            });
        }, 300); // Faster updates for a more "live" feel

        return () => clearInterval(interval);
    }, []);

    return (
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart
                data={data}
                margin={{ top: 5, right: 0, left: 0, bottom: 5 }}
            >
                <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0} />
                    </linearGradient>
                </defs>
                <XAxis dataKey="time" hide={true} />
                <YAxis domain={['dataMin - 20', 'dataMax + 20']} hide={true} />
                <Tooltip
                    contentStyle={{
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        borderColor: 'hsl(var(--destructive))',
                        color: '#fff',
                        borderRadius: '0.5rem',
                    }}
                    labelStyle={{ display: 'none' }}
                    itemStyle={{ color: 'hsl(var(--destructive))' }}
                    formatter={(value: number) => [`$${value.toFixed(2)}`, 'Price']}
                />
                <Area
                    type="monotone"
                    dataKey="value"
                    stroke="hsl(var(--destructive))"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorValue)"
                    isAnimationActive={false} // Prevents flickering on data update
                />
            </AreaChart>
        </ResponsiveContainer>
    );
}