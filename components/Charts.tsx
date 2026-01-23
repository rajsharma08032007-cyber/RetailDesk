import React from 'react';
import {
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, PieChart, Pie, Legend
} from 'recharts';

const COLORS = {
  emerald: '#10b981',
  indigo: '#6366f1',
  blue: '#3b82f6',
  amber: '#f59e0b',
  rose: '#f43f5e',
  slate: '#64748b',
};

const PIE_COLORS = [COLORS.emerald, COLORS.indigo, COLORS.blue, COLORS.amber, COLORS.rose];

const tooltipStyle = {
  backgroundColor: '#0f172a',
  border: '1px solid #1e293b',
  borderRadius: '12px',
  color: '#f8fafc',
  fontSize: '12px',
  fontWeight: '800',
};

const getShortName = (name: string) => {
  if (!name) return '';
  // Use RegExp constructor to avoid potential syntax errors with slash literals in some environments
  const words = name.split(new RegExp('[\\s._-]+')).filter(Boolean);
  return words.map(word => word[0]).join('').toUpperCase().slice(0, 2);
};

export const PeakHoursChart: React.FC<{ data: { time: string; sales: number }[] }> = ({ data }) => {
  return (
    <div className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" opacity={0.5} />
          <XAxis dataKey="time" stroke={COLORS.slate} fontSize={10} tickLine={false} axisLine={false} />
          <YAxis stroke={COLORS.slate} fontSize={10} tickLine={false} axisLine={false} allowDecimals={false} />
          <Tooltip cursor={{ fill: '#ffffff', opacity: 0.05 }} contentStyle={tooltipStyle} />
          <Bar dataKey="sales" fill={COLORS.emerald} radius={[6, 6, 0, 0]} barSize={24} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export const EmployeePerformanceChart: React.FC<{ data: { name: string; services: number }[] }> = ({ data }) => {
  return (
    <div className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" opacity={0.5} />
          <XAxis dataKey="name" stroke={COLORS.slate} fontSize={10} tickLine={false} axisLine={false} tickFormatter={getShortName} />
          <YAxis stroke={COLORS.slate} fontSize={10} tickLine={false} axisLine={false} allowDecimals={false} />
          <Tooltip cursor={{ fill: '#ffffff', opacity: 0.05 }} contentStyle={tooltipStyle} />
          <Bar dataKey="services" fill={COLORS.indigo} radius={[6, 6, 0, 0]} barSize={32} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export const PaymentMethodChart: React.FC<{ data: { name: string; value: number }[] }> = ({ data }) => {
  return (
    <div className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={85} paddingAngle={8} dataKey="value">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} stroke="none" />
            ))}
          </Pie>
          <Tooltip contentStyle={tooltipStyle} />
          <Legend verticalAlign="bottom" height={36} iconType="circle" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export const TopItemsChart: React.FC<{ data: { name: string; value: number }[] }> = ({ data }) => {
  return (
    <div className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" opacity={0.5} />
          <XAxis dataKey="name" stroke={COLORS.slate} fontSize={10} tickLine={false} axisLine={false} tickFormatter={getShortName} />
          <YAxis stroke={COLORS.slate} fontSize={10} tickLine={false} axisLine={false} allowDecimals={false} />
          <Tooltip cursor={{ fill: '#ffffff', opacity: 0.05 }} contentStyle={tooltipStyle} />
          <Bar dataKey="value" fill={COLORS.blue} radius={[6, 6, 0, 0]} barSize={24} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};