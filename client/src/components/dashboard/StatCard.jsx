import React from 'react';
import './StatCard.css';

const StatCard = ({ 
  title, 
  value, 
  change, 
  changeType, 
  icon: Icon, 
  color = 'primary',
  format = 'number',
  subtitle 
}) => {
  const formatValue = (val) => {
    if (format === 'currency') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(val);
    }
    if (format === 'percentage') {
      return `${val}%`;
    }
    return val.toLocaleString();
  };

  const getChangeIcon = () => {
    if (changeType === 'increase') {
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="23,6 13.5,15.5 8.5,10.5 1,18"></polyline>
          <polyline points="17,6 23,6 23,12"></polyline>
        </svg>
      );
    }
    if (changeType === 'decrease') {
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="1,18 10.5,8.5 15.5,13.5 23,6"></polyline>
          <polyline points="7,18 1,18 1,12"></polyline>
        </svg>
      );
    }
    return null;
  };

  return (
    <div className={`stat-card stat-card--${color}`}>
      <div className="stat-card__icon">
        {Icon && <Icon />}
      </div>
      <div className="stat-card__content">
        <div className="stat-card__value">{formatValue(value)}</div>
        <div className="stat-card__title">{title}</div>
        {subtitle && <div className="stat-card__subtitle">{subtitle}</div>}
        {change !== undefined && (
          <div className={`stat-card__change stat-card__change--${changeType}`}>
            {getChangeIcon()}
            <span>{Math.abs(change)}%</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;


