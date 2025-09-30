'use client';

import { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const generateDataPoint = (lastValue: number) => {
    const change = (Math.random() - 0.5) * 10;
    const newValue = Math.max(10, Math.min(100, lastValue + change));
    return { time: new Date().getTime(), value: newValue };
};

export function TradingGraph() {
    const [data, setData] = useState(() => {
        const initialData = [];
        let lastValue = 50;
        for (let i = 0; i < 30; i++) {
            const newDataPoint = generateDataPoint(lastValue);
            initialData.push(newDataPoint);
            lastValue = newDataPoint.value;
        }
        return initialData;
    });

    useEffect(() => {
        const interval = setInterval(() => {
            setData(prevData => {
                const lastValue = prevData.length > 0 ? prevData[prevData.length - 1].value : 50;
                const newDataPoint = generateDataPoint(lastValue);
                const newData = [...prevData.slice(1), newDataPoint];
                return newData;
            });
        }, 500); // Update every half a second for smooth animation

        return () => clearInterval(interval);
    }, []);

    return (
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart
                data={data}
                margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
            >
                <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0} />
                    </linearGradient>
                </defs>
                <XAxis dataKey="time" hide={true} />
                <YAxis domain={[0, 110]} hide={true} />
                <Tooltip
                    contentStyle={{
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        borderColor: 'hsl(var(--destructive))',
                        color: '#fff',
                        borderRadius: '0.5rem',
                    }}
                    labelStyle={{ display: 'none' }}
                    itemStyle={{ color: 'hsl(var(--destructive))' }}
                />
                <Area
                    type="monotone"
                    dataKey="value"
                    stroke="hsl(var(--destructive))"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorValue)"
                    isAnimationActive={false}
                />
            </AreaChart>
        </ResponsiveContainer>
    );
}

    