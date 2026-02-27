import { calculateWilks, calculateDots, calculateIPFGL, calculateReshel } from './src/lib/logic/formulas';

const bw = 82.5;
const total = 500;

console.log(`Wilks: ${calculateWilks(bw, total, 'male')}`);
console.log(`DOTS: ${calculateDots(bw, total, 'male')}`);
console.log(`IPF GL: ${calculateIPFGL(bw, total, 'male', 'raw')}`);
console.log(`Reshel: ${calculateReshel(bw, total, 'male')}`);
