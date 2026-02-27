# Powerlifting Formulas & Coefficients

This document provides a technical reference for the four powerlifting coefficient formulas implemented in this project. All calculations assume **Kilograms (kg)** for bodyweight and lift totals.

## 1. Wilks Coefficient
The Wilks formula is the traditional standard for comparing powerlifters of different bodyweights.

**Formula:**
`Score = Total * (500 / Denominator)`

`Denominator = a + bx + cx² + dx³ + ex⁴ + fx⁵`
*(where x = lifter bodyweight)*

### Coefficients

| Gender | a | b | c | d | e | f |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Male** | -216.0475144 | 16.2606339 | -0.002388645 | -0.00113732 | 7.01863e-06 | -1.291e-08 |
| **Female** | 594.31747775582 | -27.23842536447 | 0.82112226871 | -0.00930733913 | 4.731582e-05 | -9.054e-08 |

---

## 2. DOTS (Dynamic Object Total Score)
DOTS was developed to provide a more balanced normalization across the spectrum of bodyweights, particularly improving accuracy for super-heavyweights and female lifters compared to Wilks.

**Formula:**
`Score = Total * (500 / Denominator)`

`Denominator = a + bx + cx² + dx³ + ex⁴`
*(where x = lifter bodyweight)*

### Coefficients

| Gender | a | b | c | d | e |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Male** | -307.5820 | 24.0900756 | -0.1918759221 | 0.0007391293 | -0.000001093 |
| **Female** | -57.96288 | 13.6175032 | -0.1126655495 | 0.0005158568 | -0.0000010706 |

---

## 3. IPF GL Points
The official formula of the International Powerlifting Federation since 2020. Unlike Wilks or DOTS, it adds a third variable: **Equipment Type**.

**Formula:**
`Score = Total * (100 / Denominator)`

`Denominator = a - b * e^(-c * x)`
*(where x = lifter bodyweight)*

### Coefficients

| Gender | Equipment | a | b | c |
| :--- | :--- | :--- | :--- | :--- |
| **Male** | Raw | 1199.72839 | 1025.18162 | 0.00921 |
| **Male** | Equipped | 1236.25115 | 1449.21864 | 0.01644 |
| **Female** | Raw | 610.32796 | 1045.59282 | 0.03048 |
| **Female** | Equipped | 758.63878 | 949.31382 | 0.02435 |

---

## 4. Reshel
Commonly used by the APF and WPC, the Reshel formula is traditionally implemented via large lookup tables. Our implementation uses **linear interpolation** between table entries to provide accurate scores for bodyweights not explicitly listed.

### Sample Table (Truncated)

| Weight (kg) | Male Coeff | Female Coeff |
| :--- | :--- | :--- |
| 50.0 | 1.955 | 2.195 |
| 80.0 | 1.054 | 1.480 |
| 100.0 | 0.915 | 1.330 |
| 150.0 | 0.789 | 1.150 |

*See `backends/fastapi/services/reshel.py` for the full high-precision mapping.*
