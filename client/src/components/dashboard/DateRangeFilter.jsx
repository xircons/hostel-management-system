import React, { useState } from 'react';
import './DateRangeFilter.css';

const DateRangeFilter = ({ 
  onDateChange, 
  selectedRange = 'month',
  className = '' 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  const predefinedRanges = [
    { key: 'today', label: 'Today', days: 0 },
    { key: 'yesterday', label: 'Yesterday', days: -1 },
    { key: 'week', label: 'Last 7 days', days: -7 },
    { key: 'month', label: 'Last 30 days', days: -30 },
    { key: 'quarter', label: 'Last 90 days', days: -90 },
    { key: 'year', label: 'Last 365 days', days: -365 }
  ];

  const handleRangeSelect = (range) => {
    const endDate = new Date();
    const startDate = new Date();
    
    if (range.days === 0) {
      // Today
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999);
    } else if (range.days === -1) {
      // Yesterday
      startDate.setDate(startDate.getDate() - 1);
      startDate.setHours(0, 0, 0, 0);
      endDate.setDate(endDate.getDate() - 1);
      endDate.setHours(23, 59, 59, 999);
    } else {
      // Other ranges
      startDate.setDate(startDate.getDate() + range.days);
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999);
    }

    onDateChange({
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      range: range.key
    });
    
    setIsOpen(false);
  };

  const handleCustomDateSubmit = () => {
    if (customStartDate && customEndDate) {
      onDateChange({
        startDate: customStartDate,
        endDate: customEndDate,
        range: 'custom'
      });
      setIsOpen(false);
    }
  };

  const getCurrentRangeLabel = () => {
    const currentRange = predefinedRanges.find(r => r.key === selectedRange);
    return currentRange ? currentRange.label : 'Custom Range';
  };

  return (
    <div className={`date-range-filter ${className}`}>
      <button 
        className="date-range-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
        <span>{getCurrentRangeLabel()}</span>
        <svg 
          width="12" 
          height="12" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2"
          className={`chevron ${isOpen ? 'open' : ''}`}
        >
          <polyline points="6,9 12,15 18,9"></polyline>
        </svg>
      </button>

      {isOpen && (
        <div className="date-range-dropdown">
          <div className="dropdown-header">
            <h4>Select Date Range</h4>
          </div>
          
          <div className="predefined-ranges">
            {predefinedRanges.map(range => (
              <button
                key={range.key}
                className={`range-option ${selectedRange === range.key ? 'active' : ''}`}
                onClick={() => handleRangeSelect(range)}
              >
                {range.label}
              </button>
            ))}
          </div>

          <div className="custom-range">
            <h5>Custom Range</h5>
            <div className="date-inputs">
              <div className="date-input-group">
                <label>Start Date</label>
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div className="date-input-group">
                <label>End Date</label>
                <input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                  min={customStartDate}
                />
              </div>
            </div>
            <button 
              className="apply-button"
              onClick={handleCustomDateSubmit}
              disabled={!customStartDate || !customEndDate}
            >
              Apply Custom Range
            </button>
          </div>
        </div>
      )}

      {isOpen && (
        <div 
          className="dropdown-overlay"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default DateRangeFilter;


