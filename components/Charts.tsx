import React from 'react';
import {
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, PieChart, Pie, Legend
} from 'recharts';

const COLORS = {
  emerald: '#10b981',
  indigo: '#6366f1',
  blue: '#3b82f6',
  purple: '#8b5cf6',
  amber: '#f59e0b',
  rose: '#f43f5e',
  slate: '#334155',
  text: '#94a3b8',
  bg: '#1e293b'
};

const PIE_COLORS = [COLORS.emerald, COLORS.indigo, COLORS.amber, COLORS.rose, COLORS.blue];

const tooltipStyle = {
  backgroundColor: COLORS.bg,
  borderColor: COLORS.slate,
  color: '#f1f5f9',
  borderRadius: '8px',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
};

/**
 * Utility to generate short names from strings by taking first letters
 * e.g., "Engine Diagnostics" -> "ED", "Will Byers" -> "WB"
 */
const getShortName = (name: string) => {
  if (!name) return '';
  return name
    .split(/[\s._-]+/)
    .filter(Boolean)
    .map(word => word[0])
    .join('')
    .toUpperCase();
};

// 1. Peak Hours Bar Chart (Vertical)
export const PeakHoursChart: React.FC<{ data: { time: string; sales: number }[] }> = ({ data }) => {
  return (
    <div className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={COLORS.slate} />
          <XAxis dataKey="time" stroke={COLORS.text} fontSize={10} tickLine={false} axisLine={false} interval="preserveStartEnd" />
          <YAxis stroke={COLORS.text} fontSize={10} tickLine={false} axisLine={false} allowDecimals={false} />
          <Tooltip cursor={{ fill: COLORS.slate, opacity: 0.2 }} contentStyle={tooltipStyle} />
          <Bar dataKey="sales" name="Order Volume" fill={COLORS.amber} radius={[4, 4, 0, 0]} barSize={32} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

// 2. Employee Performance Chart (Vertical with Short Names on Axis)
export const EmployeePerformanceChart: React.FC<{ data: { name: string; services: number }[] }> = ({ data }) => {
  return (
    <div className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={COLORS.slate} />
          <XAxis 
            dataKey="name" 
            stroke={COLORS.text} 
            fontSize={10} 
            tickLine={false} 
            axisLine={false} 
            interval={0} 
            tickFormatter={getShortName}
          />
          <YAxis stroke={COLORS.text} fontSize={10} tickLine={false} axisLine={false} allowDecimals={false} />
          <Tooltip 
            cursor={{ fill: COLORS.slate, opacity: 0.2 }} 
            contentStyle={tooltipStyle}
            formatter={(value, name, props) => [value, props.payload.name]}
          />
          <Bar dataKey="services" name="Units Served" fill={COLORS.emerald} radius={[4, 4, 0, 0]} barSize={40} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

// 3. Payment Method Pie Chart
export const PaymentMethodChart: React.FC<{ data: { name: string; value: number }[] }> = ({ data }) => {
  return (
    <div className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} stroke="none" />
            ))}
          </Pie>
          <Tooltip contentStyle={tooltipStyle} />
          <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '12px', color: COLORS.text }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

// 4. Top Services/Items Chart (Vertical with Short Names on Axis)
export const TopItemsChart: React.FC<{ data: { name: string; value: number }[] }> = ({ data }) => {
  return (
    <div className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={COLORS.slate} />
          <XAxis 
            dataKey="name" 
            stroke={COLORS.text} 
            fontSize={10} 
            tickLine={false} 
            axisLine={false} 
            interval={0} 
            tickFormatter={getShortName}
          />
          <YAxis stroke={COLORS.text} fontSize={10} tickLine={false} axisLine={false} allowDecimals={false} />
          <Tooltip 
            cursor={{ fill: COLORS.slate, opacity: 0.2 }} 
            contentStyle={tooltipStyle}
            formatter={(value, name, props) => [value, props.payload.name]}
          />
          <Bar dataKey="value" name="Qty Sold" fill={COLORS.indigo} radius={[4, 4, 0, 0]} barSize={32} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};