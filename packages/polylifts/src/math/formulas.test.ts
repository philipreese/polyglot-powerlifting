import { describe, it, expect } from 'vitest';
import { calculateWilks, calculateDots, calculateIPFGL, calculateReshel } from './formulas';

describe('Math Formulas Parity', () => {
  // Test values based on common powerlifting scenarios
  const bodyweight = 82.5;
  const total = 500;

  it('calculates Wilks correctly (Male)', () => {
    // Ground Truth from Python: 334.95
    const score = calculateWilks(bodyweight, total, 'male');
    expect(score).toBe(334.95);
  });

  it('calculates DOTS correctly (Male)', () => {
    // Ground Truth from Python: 338.62
    const score = calculateDots(bodyweight, total, 'male');
    expect(score).toBe(338.62);
  });

  it('calculates IPF GL correctly (Male Raw)', () => {
    // Ground Truth from Python: 69.43
    const score = calculateIPFGL(bodyweight, total, 'male', 'raw');
    expect(score).toBe(69.43);
  });

  it('calculates Reshel correctly (Male)', () => {
    // Ground Truth from Python: 516.4
    const score = calculateReshel(bodyweight, total, 'male');
    expect(score).toBe(516.4);
  });
});
