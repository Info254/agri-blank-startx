import React, { useMemo } from 'react';
import { 
  ResponsiveContainer, LineChart, Line, BarChart, Bar, AreaChart, 
  Area, PieChart, Pie, ScatterChart, Scatter, Radar, RadarChart, 
  PolarGrid, PolarAngleAxis, PolarRadiusAxis, ComposedChart, XAxis, 
  YAxis, CartesianGrid, Tooltip, Legend 
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useFarmStatistics } from '@/features/farm-statistics/context';
import { format } from 'date-fns';

interface ChartProps {
  data: any[];
  type: 'line' | 'bar' | 'area' | 'pie' | 'scatter' | 'radar' | 'composed';
  config: {
    xKey: string;
    yKeys: Array<{
      key: string;
      color: string;
      name: string;
    }>;
    stacked?: boolean;
    tooltipFormatter?: (value: any) => string;
    valueFormatter?: (value: any) => string;
  };
  height?: number;
  title?: string;
  description?: string;
}

const AdvancedChart: React.FC<ChartProps> = ({
  data,
  type,
  config,
  height = 400,
  title,
  description
}) => {
  const formattedData = useMemo(() => {
    return data.map(item => ({
      ...item,
      [config.xKey]: config.tooltipFormatter 
        ? config.tooltipFormatter(item[config.xKey])
        : item[config.xKey]
    }));
  }, [data, config]);

  const renderChart = () => {
    switch (type) {
      case 'line':
        return (
          <LineChart data={formattedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={config.xKey} />
            <YAxis />
            <Tooltip />
            <Legend />
            {config.yKeys.map(({ key, color, name }) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={color}
                name={name}
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 8 }}
              />
            ))}
          </LineChart>
        );

      case 'bar':
        return (
          <BarChart data={formattedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={config.xKey} />
            <YAxis />
            <Tooltip />
            <Legend />
            {config.yKeys.map(({ key, color, name }) => (
              <Bar
                key={key}
                dataKey={key}
                fill={color}
                name={name}
                stackId={config.stacked ? 'stack' : undefined}
              />
            ))}
          </BarChart>
        );

      case 'area':
        return (
          <AreaChart data={formattedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={config.xKey} />
            <YAxis />
            <Tooltip />
            <Legend />
            {config.yKeys.map(({ key, color, name }) => (
              <Area
                key={key}
                type="monotone"
                dataKey={key}
                fill={color}
                stroke={color}
                name={name}
                stackId={config.stacked ? 'stack' : undefined}
                fillOpacity={0.6}
              />
            ))}
          </AreaChart>
        );

      case 'pie':
        return (
          <PieChart>
            <Tooltip />
            <Legend />
            <Pie
              data={formattedData}
              nameKey={config.xKey}
              dataKey={config.yKeys[0].key}
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill={config.yKeys[0].color}
              label
            />
          </PieChart>
        );

      case 'scatter':
        return (
          <ScatterChart>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={config.xKey} />
            <YAxis />
            <Tooltip />
            <Legend />
            {config.yKeys.map(({ key, color, name }) => (
              <Scatter
                key={key}
                name={name}
                data={formattedData}
                fill={color}
              />
            ))}
          </ScatterChart>
        );

      case 'radar':
        return (
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={formattedData}>
            <PolarGrid />
            <PolarAngleAxis dataKey={config.xKey} />
            <PolarRadiusAxis />
            <Tooltip />
            <Legend />
            {config.yKeys.map(({ key, color, name }) => (
              <Radar
                key={key}
                name={name}
                dataKey={key}
                stroke={color}
                fill={color}
                fillOpacity={0.6}
              />
            ))}
          </RadarChart>
        );

      case 'composed':
        return (
          <ComposedChart data={formattedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={config.xKey} />
            <YAxis />
            <Tooltip />
            <Legend />
            {config.yKeys.map(({ key, color, name }, index) => {
              // Alternate between different chart types
              switch (index % 3) {
                case 0:
                  return (
                    <Line
                      key={key}
                      type="monotone"
                      dataKey={key}
                      stroke={color}
                      name={name}
                    />
                  );
                case 1:
                  return (
                    <Bar
                      key={key}
                      dataKey={key}
                      fill={color}
                      name={name}
                    />
                  );
                case 2:
                  return (
                    <Area
                      key={key}
                      type="monotone"
                      dataKey={key}
                      fill={color}
                      stroke={color}
                      name={name}
                    />
                  );
                default:
                  return null;
              }
            })}
          </ComposedChart>
        );

      default:
        return null;
    }
  };

  return (
    <Card>
      {(title || description) && (
        <CardHeader>
          {title && <CardTitle>{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}
      <CardContent>
        <div style={{ width: '100%', height }}>
          <ResponsiveContainer>
            {renderChart() || <div>No chart data available</div>}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export const YieldComparisonChart: React.FC = () => {
  const { yields } = useFarmStatistics();

  const chartConfig = {
    xKey: 'planting_date',
    yKeys: [
      { key: 'expected_yield', color: '#8884d8', name: 'Expected Yield' },
      { key: 'actual_yield', color: '#82ca9d', name: 'Actual Yield' }
    ],
    tooltipFormatter: (value: string) => format(new Date(value), 'MMM dd, yyyy')
  };

  return (
    <AdvancedChart
      data={yields}
      type="line"
      config={chartConfig}
      title="Yield Comparison"
      description="Expected vs Actual Yield Over Time"
    />
  );
};

export const ResourceUsageChart: React.FC = () => {
  const { resources } = useFarmStatistics();

  const chartConfig = {
    xKey: 'usage_date',
    yKeys: [
      { key: 'quantity', color: '#8884d8', name: 'Usage Quantity' },
      { key: 'total_cost', color: '#82ca9d', name: 'Total Cost' }
    ],
    tooltipFormatter: (value: string) => format(new Date(value), 'MMM dd, yyyy'),
    stacked: true
  };

  return (
    <AdvancedChart
      data={resources}
      type="area"
      config={chartConfig}
      title="Resource Usage"
      description="Resource Consumption and Costs"
    />
  );
};

export const BudgetAnalysisChart: React.FC = () => {
  const { budget } = useFarmStatistics();

  const chartConfig = {
    xKey: 'category',
    yKeys: [
      { key: 'planned_amount', color: '#8884d8', name: 'Planned Amount' },
      { key: 'actual_amount', color: '#82ca9d', name: 'Actual Amount' }
    ],
    valueFormatter: (value: number) => `KES ${value.toLocaleString()}`
  };

  return (
    <AdvancedChart
      data={budget}
      type="bar"
      config={chartConfig}
      title="Budget Analysis"
      description="Planned vs Actual Expenses by Category"
    />
  );
};

export const WeatherImpactChart: React.FC = () => {
  const { analytics } = useFarmStatistics();

  const chartConfig = {
    xKey: 'date',
    yKeys: [
      { key: 'temperature', color: '#ff7300', name: 'Temperature' },
      { key: 'rainfall', color: '#0088fe', name: 'Rainfall' },
      { key: 'soil_moisture', color: '#00c49f', name: 'Soil Moisture' }
    ],
    tooltipFormatter: (value: string) => format(new Date(value), 'MMM dd, yyyy')
  };

  return (
    <AdvancedChart
      data={analytics}
      type="composed"
      config={chartConfig}
      title="Weather Impact"
      description="Environmental Conditions Analysis"
    />
  );
};

export default AdvancedChart;
