# Powerlifting Coefficients

All math in this project expects **Kilograms (kg)** for bodyweight and lift totals.

## 1. Wilks
The Wilks coefficient is used to compare powerlifters across different weight classes. It is the classic standard (though aging).

**Formula:** 
`Score = Total * (500 / (a + bx + cx^2 + dx^3 + ex^4 + fx^5))`
Where `x` is the lifter's bodyweight in kg.

**Male Constraints:**
- a = -216.0475144
- b = 16.2606339
- c = -0.002388645
- d = -0.00113732
- e = 7.01863E-06
- f = -1.291E-08

**Female Constraints:**
- a = 594.31747775582
- b = -27.23842536447
- c = 0.82112226871
- d = -0.00930733913
- e = 4.731582E-05
- f = -9.054E-08

---

## 2. DOTS
Developed as a modernization of Wilks to better normalize super-heavyweights and female lifters. Requires bodyweight (`bw`) in kg.

**Male Constraints:**
- a = -307.5820
- b = 24.0900756
- c = -0.1918759221
- d = 0.0007391293
- e = -0.000001093

**Female Constraints:**
- a = -57.96288
- b = 13.6175032
- c = -0.1126655495
- d = 0.0005158568
- e = -0.0000010706

**Denominator calculation:**
`D = a + (b * bw) + (c * bw^2) + (d * bw^3) + (e * bw^4)`

`Score = Total * (500 / D)`

---

## 3. IPF GL
The current official formula of the International Powerlifting Federation (IPF). It takes into account both gender AND the equipment type (Classic/Raw vs. Equipped).

*Constants will be defined in code per latest IPF technical manual release.*

---

## 4. Reshel
A formula commonly used by APF and WPC federations. It relies heavily on tabular lookup tables rather than polynomial equations for specific bodyweight ranges. 

*Reshel lookup tables will be coded into JSON mappings in the backend.*
