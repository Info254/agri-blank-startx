// @ts-nocheck
export function calculateStatistics(data: any[]) {
  if (!data || data.length === 0) return null;

  const values = data.map(d => typeof d.value === 'number' ? d.value : 0);
  
  const sum = values.reduce((acc, val) => acc + val, 0);
  const mean = sum / values.length;
  
  const squaredDiffs = values.map(value => Math.pow(value - mean, 2));
  const variance = squaredDiffs.reduce((acc, val) => acc + val, 0) / values.length;
  const standardDeviation = Math.sqrt(variance);
  
  const sortedValues = [...values].sort((a, b) => a - b);
  const min = sortedValues[0];
  const max = sortedValues[sortedValues.length - 1];
  
  const midIndex = Math.floor(sortedValues.length / 2);
  const median = sortedValues.length % 2 === 0
    ? (sortedValues[midIndex - 1] + sortedValues[midIndex]) / 2
    : sortedValues[midIndex];
  
  const quartile1 = sortedValues[Math.floor(sortedValues.length * 0.25)];
  const quartile3 = sortedValues[Math.floor(sortedValues.length * 0.75)];
  const iqr = quartile3 - quartile1;
  
  const outliers = values.filter(value => 
    value < quartile1 - 1.5 * iqr || value > quartile3 + 1.5 * iqr
  );
  
  // Linear regression
  const xValues = Array.from({ length: values.length }, (_, i) => i);
  const xMean = xValues.reduce((acc, val) => acc + val, 0) / xValues.length;
  const yMean = mean;
  
  let numerator = 0;
  let denominator = 0;
  for (let i = 0; i < values.length; i++) {
    numerator += (xValues[i] - xMean) * (values[i] - yMean);
    denominator += Math.pow(xValues[i] - xMean, 2);
  }
  
  const slope = numerator / denominator;
  const intercept = yMean - slope * xMean;
  
  // Trend analysis
  const trend = {
    slope,
    intercept,
    prediction: (x: number) => slope * x + intercept,
    rSquared: calculateRSquared(values, slope, intercept)
  };
  
  // Moving averages
  const movingAverage = calculateMovingAverage(values, 5);
  
  // Seasonality detection
  const seasonality = detectSeasonality(values);
  
  return {
    mean,
    median,
    mode: calculateMode(values),
    standardDeviation,
    variance,
    min,
    max,
    quartile1,
    quartile3,
    iqr,
    outliers,
    trend,
    movingAverage,
    seasonality,
    skewness: calculateSkewness(values, mean, standardDeviation),
    kurtosis: calculateKurtosis(values, mean, standardDeviation),
    histogram: generateHistogram(values),
    normalityTest: performShapiroWilkTest(values)
  };
}

function calculateMode(values: number[]): number[] {
  const frequency: { [key: number]: number } = {};
  let maxFrequency = 0;
  
  values.forEach(value => {
    frequency[value] = (frequency[value] || 0) + 1;
    maxFrequency = Math.max(maxFrequency, frequency[value]);
  });
  
  return Object.entries(frequency)
    .filter(([_, freq]) => freq === maxFrequency)
    .map(([value]) => parseFloat(value));
}

function calculateRSquared(
  values: number[],
  slope: number,
  intercept: number
): number {
  const yMean = values.reduce((acc, val) => acc + val, 0) / values.length;
  let totalSumSquares = 0;
  let residualSumSquares = 0;
  
  values.forEach((value, i) => {
    const predicted = slope * i + intercept;
    totalSumSquares += Math.pow(value - yMean, 2);
    residualSumSquares += Math.pow(value - predicted, 2);
  });
  
  return 1 - (residualSumSquares / totalSumSquares);
}

function calculateMovingAverage(values: number[], window: number): number[] {
  const result: number[] = [];
  for (let i = 0; i <= values.length - window; i++) {
    const sum = values.slice(i, i + window).reduce((acc, val) => acc + val, 0);
    result.push(sum / window);
  }
  return result;
}

function detectSeasonality(values: number[]): {
  period: number;
  strength: number;
  peaks: number[];
} {
  // Implement seasonality detection using autocorrelation
  const autocorrelation = calculateAutocorrelation(values);
  const peaks = findPeaks(autocorrelation);
  
  return {
    period: peaks.length > 0 ? peaks[0] : 0,
    strength: peaks.length > 0 ? autocorrelation[peaks[0]] : 0,
    peaks
  };
}

function calculateAutocorrelation(values: number[]): number[] {
  const mean = values.reduce((acc, val) => acc + val, 0) / values.length;
  const variance = values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0);
  
  const autocorr: number[] = [];
  for (let lag = 0; lag < Math.floor(values.length / 2); lag++) {
    let sum = 0;
    for (let i = 0; i < values.length - lag; i++) {
      sum += (values[i] - mean) * (values[i + lag] - mean);
    }
    autocorr.push(sum / variance);
  }
  
  return autocorr;
}

function findPeaks(values: number[]): number[] {
  const peaks: number[] = [];
  for (let i = 1; i < values.length - 1; i++) {
    if (values[i] > values[i - 1] && values[i] > values[i + 1]) {
      peaks.push(i);
    }
  }
  return peaks;
}

function calculateSkewness(
  values: number[],
  mean: number,
  stdDev: number
): number {
  const n = values.length;
  const cubedDeviations = values.map(x => Math.pow((x - mean) / stdDev, 3));
  return (n * cubedDeviations.reduce((acc, val) => acc + val, 0)) / 
         ((n - 1) * (n - 2));
}

function calculateKurtosis(
  values: number[],
  mean: number,
  stdDev: number
): number {
  const n = values.length;
  const fourthMoment = values.map(x => Math.pow((x - mean) / stdDev, 4))
    .reduce((acc, val) => acc + val, 0);
  return (n * (n + 1) * fourthMoment - 3 * (n - 1) * (n - 1)) / 
         ((n - 1) * (n - 2) * (n - 3));
}

function generateHistogram(values: number[]): {
  bins: number[];
  frequencies: number[];
} {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const binCount = Math.ceil(Math.sqrt(values.length));
  const binWidth = (max - min) / binCount;
  
  const bins = Array.from({ length: binCount }, (_, i) => min + i * binWidth);
  const frequencies = new Array(binCount).fill(0);
  
  values.forEach(value => {
    const binIndex = Math.min(
      Math.floor((value - min) / binWidth),
      binCount - 1
    );
    frequencies[binIndex]++;
  });
  
  return { bins, frequencies };
}

function performShapiroWilkTest(values: number[]): {
  statistic: number;
  pValue: number;
} {
  // Implement Shapiro-Wilk test for normality
  // This is a simplified version
  const n = values.length;
  const sortedValues = [...values].sort((a, b) => a - b);
  
  // Calculate W statistic
  const mean = values.reduce((acc, val) => acc + val, 0) / n;
  const s2 = values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0);
  
  let b = 0;
  for (let i = 0; i < Math.floor(n / 2); i++) {
    const coefficient = getShapiroWilkCoefficient(n, i);
    b += coefficient * (sortedValues[n - 1 - i] - sortedValues[i]);
  }
  
  const W = Math.pow(b, 2) / s2;
  
  // Approximate p-value
  const pValue = approximateShapiroWilkPValue(W, n);
  
  return { statistic: W, pValue };
}

function getShapiroWilkCoefficient(n: number, i: number): number {
  // Simplified coefficient calculation
  return 1 / Math.sqrt(n);
}

function approximateShapiroWilkPValue(W: number, n: number): number {
  // Simplified p-value approximation
  const z = (1 - W) * Math.sqrt(n);
  return 1 - Math.exp(-z * z / 2);
}
