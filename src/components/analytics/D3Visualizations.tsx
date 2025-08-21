
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DataPoint {
  name: string;
  value: number;
  category: string;
}

interface D3VisualizationsProps {
  data: DataPoint[];
  title: string;
  type: 'bar' | 'pie' | 'scatter' | 'line';
}

const D3Visualizations: React.FC<D3VisualizationsProps> = ({ data, title, type }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const margin = { top: 20, right: 30, bottom: 40, left: 40 };
    const width = 400 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    const g = svg
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    switch (type) {
      case 'bar':
        renderBarChart(g, data, width, height);
        break;
      case 'pie':
        renderPieChart(g, data, width, height);
        break;
      case 'scatter':
        renderScatterPlot(g, data, width, height);
        break;
      case 'line':
        renderLineChart(g, data, width, height);
        break;
    }
  }, [data, type]);

  const renderBarChart = (g: any, data: DataPoint[], width: number, height: number) => {
    const x = d3.scaleBand()
      .domain(data.map(d => d.name))
      .range([0, width])
      .padding(0.1);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.value) || 0])
      .range([height, 0]);

    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x));

    g.append("g")
      .call(d3.axisLeft(y));

    g.selectAll(".bar")
      .data(data)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", (d: DataPoint) => x(d.name) || 0)
      .attr("width", x.bandwidth())
      .attr("y", (d: DataPoint) => y(d.value))
      .attr("height", (d: DataPoint) => height - y(d.value))
      .attr("fill", "#22c55e")
      .on("mouseover", function(event, d) {
        d3.select(this).attr("fill", "#16a34a");
      })
      .on("mouseout", function(event, d) {
        d3.select(this).attr("fill", "#22c55e");
      });
  };

  const renderPieChart = (g: any, data: DataPoint[], width: number, height: number) => {
    const radius = Math.min(width, height) / 2;
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const pie = d3.pie<DataPoint>()
      .value(d => d.value);

    const arc = d3.arc<d3.PieArcDatum<DataPoint>>()
      .innerRadius(0)
      .outerRadius(radius);

    const pieData = pie(data);

    g.attr("transform", `translate(${width / 2},${height / 2})`);

    g.selectAll(".arc")
      .data(pieData)
      .enter().append("g")
      .attr("class", "arc")
      .append("path")
      .attr("d", arc)
      .attr("fill", (d: any, i: number) => color(i.toString()));

    g.selectAll(".arc")
      .append("text")
      .attr("transform", (d: any) => `translate(${arc.centroid(d)})`)
      .attr("text-anchor", "middle")
      .text((d: any) => d.data.name);
  };

  const renderScatterPlot = (g: any, data: DataPoint[], width: number, height: number) => {
    const x = d3.scaleLinear()
      .domain(d3.extent(data, (d, i) => i) as [number, number])
      .range([0, width]);

    const y = d3.scaleLinear()
      .domain(d3.extent(data, d => d.value) as [number, number])
      .range([height, 0]);

    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x));

    g.append("g")
      .call(d3.axisLeft(y));

    g.selectAll(".dot")
      .data(data)
      .enter().append("circle")
      .attr("class", "dot")
      .attr("cx", (d: DataPoint, i: number) => x(i))
      .attr("cy", (d: DataPoint) => y(d.value))
      .attr("r", 5)
      .attr("fill", "#3b82f6");
  };

  const renderLineChart = (g: any, data: DataPoint[], width: number, height: number) => {
    const x = d3.scaleLinear()
      .domain(d3.extent(data, (d, i) => i) as [number, number])
      .range([0, width]);

    const y = d3.scaleLinear()
      .domain(d3.extent(data, d => d.value) as [number, number])
      .range([height, 0]);

    const line = d3.line<DataPoint>()
      .x((d, i) => x(i))
      .y(d => y(d.value));

    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x));

    g.append("g")
      .call(d3.axisLeft(y));

    g.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#ef4444")
      .attr("stroke-width", 2)
      .attr("d", line);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <svg ref={svgRef}></svg>
      </CardContent>
    </Card>
  );
};

export default D3Visualizations;
