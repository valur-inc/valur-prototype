/**
 * Financial calculation utilities.
 *
 * Production mapping:
 * - Each calculator here maps to a module in the Model service: valur/models/<feature>/
 * - Decimal usage here maps 1:1 to Python's Decimal type
 * - Year-by-year projection pattern matches the production calculate() function
 * - Engineers wrap these calculations in Flask endpoints
 *
 * IMPORTANT: Always use Decimal for financial math. Never use native JS numbers
 * for dollar amounts, percentages, or rates.
 */
import Decimal from "decimal.js";

// Configure Decimal for financial calculations (matches Python Decimal defaults)
Decimal.set({ precision: 28, rounding: Decimal.ROUND_HALF_EVEN });

/**
 * Example: Year-by-year projection calculator.
 *
 * This pattern matches the production model service structure:
 * - Input params object (maps to ModelParams class)
 * - Year-by-year loop (maps to the calculate() function)
 * - Returns { years: [...], totals: {...} }
 */
export interface ProjectionParams {
  initialValue: string; // Pass as string to preserve precision
  annualGrowthRate: string;
  years: number;
}

export interface YearResult {
  year: number;
  startValue: string;
  growth: string;
  endValue: string;
}

export interface ProjectionResult {
  years: YearResult[];
  totals: {
    totalGrowth: string;
    finalValue: string;
  };
}

export function calculateProjection(params: ProjectionParams): ProjectionResult {
  const initialValue = new Decimal(params.initialValue);
  const growthRate = new Decimal(params.annualGrowthRate);
  const years: YearResult[] = [];
  let currentValue = initialValue;

  for (let year = 1; year <= params.years; year++) {
    const startValue = currentValue;
    const growth = currentValue.mul(growthRate);
    const endValue = currentValue.add(growth);

    years.push({
      year,
      startValue: startValue.toFixed(2),
      growth: growth.toFixed(2),
      endValue: endValue.toFixed(2),
    });

    currentValue = endValue;
  }

  return {
    years,
    totals: {
      totalGrowth: currentValue.sub(initialValue).toFixed(2),
      finalValue: currentValue.toFixed(2),
    },
  };
}
