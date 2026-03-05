import { getReshelCoefficient } from './reshel';

export function calculateWilks(bodyweight: number, total: number, gender: string): number {
  let a, b, c, d, e, f;
  
  if (gender.toLowerCase() === 'male') {
    a = -216.0475144;
    b = 16.2606339;
    c = -0.002388645;
    d = -0.00113732;
    e = 7.01863E-06;
    f = -1.291E-08;
  } else {
    a = 594.31747775582;
    b = -27.23842536447;
    c = 0.82112226871;
    d = -0.00930733913;
    e = 4.731582E-05;
    f = -9.054E-08;
  }

  const x = bodyweight;
  const denominator = a + (b * x) + (c * Math.pow(x, 2)) + (d * Math.pow(x, 3)) + (e * Math.pow(x, 4)) + (f * Math.pow(x, 5));
  
  if (denominator === 0) return 0.0;
  return Number((total * (500.0 / denominator)).toFixed(2));
}

export function calculateDots(bodyweight: number, total: number, gender: string): number {
  let a, b, c, d, e;
  
  if (gender.toLowerCase() === 'male') {
    a = -307.5820;
    b = 24.0900756;
    c = -0.1918759221;
    d = 0.0007391293;
    e = -0.000001093;
  } else {
    a = -57.96288;
    b = 13.6175032;
    c = -0.1126655495;
    d = 0.0005158568;
    e = -0.0000010706;
  }

  const x = bodyweight;
  const denominator = a + (b * x) + (c * Math.pow(x, 2)) + (d * Math.pow(x, 3)) + (e * Math.pow(x, 4));
  
  if (denominator === 0) return 0.0;
  return Number((total * (500.0 / denominator)).toFixed(2));
}

export function calculateIPFGL(bodyweight: number, total: number, gender: string, equipment: string): number {
  let a, b, c;
  
  if (gender.toLowerCase() === 'male') {
    if (equipment.toLowerCase() === 'raw') {
      [a, b, c] = [1199.72839, 1025.18162, 0.00921];
    } else {
      [a, b, c] = [1236.25115, 1449.21864, 0.01644];
    }
  } else {
    if (equipment.toLowerCase() === 'raw') {
      [a, b, c] = [610.32796, 1045.59282, 0.03048];
    } else {
      [a, b, c] = [758.63878, 949.31382, 0.02435];
    }
  }

  const denominator = a - b * Math.exp(-c * bodyweight);
  if (denominator === 0) return 0.0;
  return Number((total * 100.0 / denominator).toFixed(2));
}

export function calculateReshel(bodyweight: number, total: number, gender: string): number {
  const coeff = getReshelCoefficient(bodyweight, gender);
  return Number((total * coeff).toFixed(2));
}
