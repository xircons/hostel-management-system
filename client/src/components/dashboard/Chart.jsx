import React from 'react';
import './Chart.css';

const Chart = ({ 
  title, 
  data, 
  type = 'line', 
  height = 300, 
  showTooltip = true,
  className = '',
  children 
}) => {
  const renderLineChart = () => {
    if (!data || data.length === 0) return null;

    const maxValue = Math.max(...data.map(d => d.value));
    const minValue = Math.min(...data.map(d => d.value));
    const range = maxValue - minValue;
    const padding = range * 0.1;
    const adjustedMin = Math.max(0, minValue - padding);
    const adjustedMax = maxValue + padding;
    const adjustedRange = adjustedMax - adjustedMin;

    // Chart dimensions with proper margins
    const chartWidth = 800;
    const chartHeight = 300;
    const marginLeft = 60;  // Space for Y-axis labels
    const marginRight = 40; // Space for right edge
    const marginTop = 50;   // Space for top labels
    const marginBottom = 50; // Space for X-axis labels
    
    const plotWidth = chartWidth - marginLeft - marginRight;
    const plotHeight = chartHeight - marginTop - marginBottom;
    
    const stepX = plotWidth / (data.length - 1);
    const stepY = plotHeight / adjustedRange;

    const points = data.map((point, index) => {
      const x = marginLeft + (index * stepX);
      const y = marginTop + plotHeight - ((point.value - adjustedMin) * stepY);
      return `${x},${y}`;
    }).join(' ');

    const areaPoints = `${marginLeft},${marginTop + plotHeight} ${points} ${marginLeft + plotWidth},${marginTop + plotHeight}`;

    return (
      <div className="chart-container">
        <svg 
          width="100%" 
          height="100%" 
          viewBox={`0 0 ${chartWidth} ${chartHeight}`} 
          preserveAspectRatio="xMidYMid meet"
          className="chart-svg"
        >
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map((percent, index) => {
            const y = marginTop + plotHeight - (plotHeight * percent / 100);
            return (
              <g key={index}>
                <line
                  x1={marginLeft}
                  y1={y}
                  x2={marginLeft + plotWidth}
                  y2={y}
                  stroke="var(--gray-200)"
                  strokeWidth="1"
                  opacity="0.5"
                />
                <text
                  x={marginLeft - 10}
                  y={y + 4}
                  fontSize="11"
                  fill="var(--gray-500)"
                  textAnchor="end"
                >
                  {Math.round(adjustedMax - (adjustedRange * percent / 100))}
                </text>
              </g>
            );
          })}

          {/* Area fill */}
          <polygon
            points={areaPoints}
            fill="url(#gradient)"
            opacity="0.3"
          />

          {/* Line */}
          <polyline
            points={points}
            fill="none"
            stroke="var(--primary-dark)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data points */}
          {data.map((point, index) => {
            const x = marginLeft + (index * stepX);
            const y = marginTop + plotHeight - ((point.value - adjustedMin) * stepY);
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="5"
                fill="white"
                stroke="var(--primary-dark)"
                strokeWidth="3"
                className="data-point"
                data-value={point.value}
                data-label={point.date}
              >
                <title>{point.date}: ${point.value.toLocaleString()}</title>
              </circle>
            );
          })}

          {/* X-axis labels */}
          {data.map((point, index) => {
            const x = marginLeft + (index * stepX);
            return (
              <text
                key={index}
                x={x}
                y={marginTop + plotHeight + 20}
                fontSize="11"
                fill="var(--gray-600)"
                textAnchor="middle"
              >
                {point.date}
              </text>
            );
          })}

          {/* Gradient definition */}
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="var(--primary-dark)" stopOpacity="0.3"/>
              <stop offset="100%" stopColor="var(--primary-dark)" stopOpacity="0"/>
            </linearGradient>
          </defs>
        </svg>
      </div>
    );
  };

  const renderBarChart = () => {
    if (!data || data.length === 0) return null;

    const maxValue = Math.max(...data.map(d => d.value));
    
    // Chart dimensions with proper margins
    const chartWidth = 800;
    const chartHeight = 300;
    const marginLeft = 60;  // Space for Y-axis labels
    const marginRight = 40; // Space for right edge
    const marginTop = 50;   // Space for top labels
    const marginBottom = 50; // Space for X-axis labels
    
    const plotWidth = chartWidth - marginLeft - marginRight;
    const plotHeight = chartHeight - marginTop - marginBottom;
    
    const barWidth = Math.min(60, plotWidth / data.length * 0.8);
    const barSpacing = plotWidth / data.length;
    const barStart = marginLeft + (barSpacing - barWidth) / 2;

    return (
      <div className="chart-container">
        <svg 
          width="100%" 
          height="100%" 
          viewBox={`0 0 ${chartWidth} ${chartHeight}`} 
          preserveAspectRatio="xMidYMid meet"
          className="chart-svg"
        >
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map((percent, index) => {
            const y = marginTop + plotHeight - (plotHeight * percent / 100);
            return (
              <g key={index}>
                <line
                  x1={marginLeft}
                  y1={y}
                  x2={marginLeft + plotWidth}
                  y2={y}
                  stroke="var(--gray-200)"
                  strokeWidth="1"
                  opacity="0.5"
                />
                <text
                  x={marginLeft - 10}
                  y={y + 4}
                  fontSize="11"
                  fill="var(--gray-500)"
                  textAnchor="end"
                >
                  {Math.round(maxValue * percent / 100)}
                </text>
              </g>
            );
          })}

          {/* Bars */}
          {data.map((point, index) => {
            const barHeight = (point.value / maxValue) * plotHeight;
            const x = barStart + (index * barSpacing);
            const y = marginTop + plotHeight - barHeight;
            
            return (
              <g key={index}>
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  fill="var(--primary-dark)"
                  className="bar"
                  data-value={point.value}
                  data-label={point.date}
                  rx="4"
                >
                  <title>{point.date}: ${point.value.toLocaleString()}</title>
                </rect>
                
                {/* Value labels above bars */}
                <text
                  x={x + barWidth / 2}
                  y={y - 8}
                  fontSize="11"
                  fill="var(--gray-700)"
                  textAnchor="middle"
                  fontWeight="600"
                >
                  ${(point.value / 1000).toFixed(1)}k
                </text>
                
                {/* X-axis labels */}
                <text
                  x={x + barWidth / 2}
                  y={marginTop + plotHeight + 20}
                  fontSize="11"
                  fill="var(--gray-600)"
                  textAnchor="middle"
                >
                  {point.date.length > 8 ? point.date.substring(0, 8) + '...' : point.date}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    );
  };

  const renderPieChart = () => {
    if (!data || data.length === 0) return null;

    const total = data.reduce((sum, item) => sum + item.value, 0);
    let cumulativePercentage = 0;
    
    // Chart dimensions with proper margins for legend
    const chartWidth = 500;
    const chartHeight = 300;
    const radius = 80; // Increased radius to use more space
    const centerX = 140; // Adjusted for larger radius
    const centerY = chartHeight / 2;

    const colors = [
      'var(--primary-dark)',
      '#10b981',
      '#f59e0b',
      '#ef4444',
      '#3b82f6',
      '#8b5cf6',
      '#06b6d4',
      '#84cc16'
    ];

    return (
      <div className="chart-container">
        <svg 
          width="100%" 
          height="100%" 
          viewBox={`0 0 ${chartWidth} ${chartHeight}`} 
          preserveAspectRatio="xMidYMid meet"
          className="chart-svg"
        >
          {data.map((item, index) => {
            const percentage = (item.value / total) * 100;
            const startAngle = (cumulativePercentage / 100) * 360;
            const endAngle = ((cumulativePercentage + percentage) / 100) * 360;
            
            const startAngleRad = (startAngle - 90) * (Math.PI / 180);
            const endAngleRad = (endAngle - 90) * (Math.PI / 180);
            
            const largeArcFlag = percentage > 50 ? 1 : 0;
            
            const x1 = centerX + radius * Math.cos(startAngleRad);
            const y1 = centerY + radius * Math.sin(startAngleRad);
            const x2 = centerX + radius * Math.cos(endAngleRad);
            const y2 = centerY + radius * Math.sin(endAngleRad);
            
            const pathData = [
              `M ${centerX} ${centerY}`,
              `L ${x1} ${y1}`,
              `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
              'Z'
            ].join(' ');

            cumulativePercentage += percentage;

            return (
              <path
                key={index}
                d={pathData}
                fill={colors[index % colors.length]}
                className="pie-slice"
                data-value={item.value}
                data-label={item.date}
                stroke="white"
                strokeWidth="2"
              >
                <title>{item.date}: ${item.value.toLocaleString()} ({(percentage).toFixed(1)}%)</title>
              </path>
            );
          })}
          
          {/* Legend - positioned within chart boundaries */}
          {data.map((item, index) => (
            <g key={`legend-${index}`} className="pie-legend">
              <circle
                cx={320}
                cy={50 + index * 40}
                r="6"
                fill={colors[index % colors.length]}
              />
              <text
                x={335}
                y={57 + index * 40}
                fontSize="12"
                fill="#374151"
                fontFamily="system-ui, -apple-system, sans-serif"
                fontWeight="600"
              >
                {item.date}
              </text>
              <text
                x={335}
                y={70 + index * 40}
                fontSize="11"
                fill="#6b7280"
                fontFamily="system-ui, -apple-system, sans-serif"
                fontWeight="400"
              >
                {((item.value / total) * 100).toFixed(1)}% (${item.value.toLocaleString()})
              </text>
            </g>
          ))}
        </svg>
      </div>
    );
  };

  const renderChart = () => {
    switch (type) {
      case 'bar':
        return renderBarChart();
      case 'pie':
        return renderPieChart();
      case 'line':
      default:
        return renderLineChart();
    }
  };

  return (
    <div className={`chart ${className}`}>
      {title && <h3 className="chart-title">{title}</h3>}
      <div className="chart-content">
        {renderChart()}
        {children}
      </div>
    </div>
  );
};

export default Chart;
