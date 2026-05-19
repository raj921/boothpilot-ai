"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function DashboardChart({ data }: { data: { name: string; value: number }[] }) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid stroke="rgba(221,231,208,0.12)" vertical={false} />
          <XAxis dataKey="name" stroke="rgba(221,231,208,0.55)" />
          <YAxis stroke="rgba(221,231,208,0.55)" />
          <Tooltip
            contentStyle={{
              background: "#10140f",
              border: "1px solid #2b3428",
              color: "#dde7d0"
            }}
          />
          <Bar dataKey="value" fill="#B7FF3C" radius={[2, 2, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
