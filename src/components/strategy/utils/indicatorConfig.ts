
export interface IndicatorParameter {
  name: string;
  type: 'number' | 'dropdown' | 'checkbox_group' | 'radio_button' | 'boolean';
  label: string;
  default: any;
  options?: string[] | { min?: number; max?: number; step?: number | string };
  description?: string;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number | string;
}

export interface Indicator {
  function_name: string;
  parameters: IndicatorParameter[];
}

export interface IndicatorConfig {
  [key: string]: Indicator;
}

export const indicatorConfig: IndicatorConfig = {
  "EMA": {
    "function_name": "EMA",
    "parameters": [
      {
        "name": "timeperiod",
        "type": "number",
        "label": "Time Period",
        "default": 21,
        "description": "Number of periods used to calculate the EMA"
      }
    ]
  },
  "RSI": {
    "function_name": "RSI",
    "parameters": [
      {
        "name": "timeperiod",
        "type": "number",
        "label": "Time Period",
        "default": 14,
        "description": "Number of periods used to calculate the RSI"
      }
    ]
  },
  "MACD": {
    "function_name": "MACD",
    "parameters": [
      {
        "name": "fastperiod",
        "type": "number",
        "label": "Fast Period",
        "default": 12,
        "description": "Number of periods for the fast moving average"
      },
      {
        "name": "slowperiod",
        "type": "number",
        "label": "Slow Period",
        "default": 26,
        "description": "Number of periods for the slow moving average"
      },
      {
        "name": "signalperiod",
        "type": "number",
        "label": "Signal Period",
        "default": 9,
        "description": "Number of periods for the signal line"
      }
    ]
  },
  "BollingerBands": {
    "function_name": "BBANDS",
    "parameters": [
      {
        "name": "timeperiod",
        "type": "number",
        "label": "Time Period",
        "default": 20,
        "description": "Number of periods used to calculate Bollinger Bands"
      },
      {
        "name": "nbdevup",
        "type": "number",
        "label": "Standard Deviation Up",
        "default": 2,
        "description": "Number of standard deviations above the middle band"
      },
      {
        "name": "nbdevdn",
        "type": "number",
        "label": "Standard Deviation Down",
        "default": 2,
        "description": "Number of standard deviations below the middle band"
      },
      {
        "name": "matype",
        "type": "dropdown",
        "label": "Moving Average Type",
        "options": ["SMA", "EMA", "WMA"],
        "default": "SMA",
        "description": "Type of moving average used for the middle band"
      }
    ]
  },
  "Stochastic": {
    "function_name": "STOCH",
    "parameters": [
      {
        "name": "fastk_period",
        "type": "number",
        "label": "FastK Period",
        "default": 5,
        "description": "Time period for %K line"
      },
      {
        "name": "slowk_period",
        "type": "number",
        "label": "SlowK Period",
        "default": 3,
        "description": "Smoothing for %K line"
      },
      {
        "name": "slowd_period",
        "type": "number",
        "label": "SlowD Period",
        "default": 3,
        "description": "Smoothing for %D line"
      }
    ]
  },
  "ADX": {
    "function_name": "ADX",
    "parameters": [
      {
        "name": "timeperiod",
        "type": "number",
        "label": "Time Period",
        "default": 14,
        "description": "Number of periods for ADX calculation"
      }
    ]
  },
  "PivotPoints": {
    "function_name": "custom_pivot_points",
    "parameters": [
      {
        "name": "method",
        "type": "dropdown",
        "label": "Pivot Calculation Method",
        "options": ["Traditional", "Fibonacci", "Camarilla", "Woodie"],
        "default": "Traditional",
        "description": "Method used to calculate the pivot points"
      }
    ]
  }
};

export const timeframeOptions = [
  "1m", "3m", "5m", "15m", "30m", "1h", "2h", "4h", "1d", "1w", "1M"
];

export const exchangeOptions = [
  "NSE", "BSE", "NYSE", "NASDAQ", "BINANCE"
];
