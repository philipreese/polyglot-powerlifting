# Partial Reshel tables
# Uses linear interpolation for exact bodyweights not listed in the table.

MALE_RESHEL = {
    50.0: 1.955, 60.0: 1.423, 70.0: 1.194, 80.0: 1.054,
    90.0: 0.969, 100.0: 0.915, 110.0: 0.885, 120.0: 0.851,
    130.0: 0.826, 140.0: 0.806, 150.0: 0.789, 160.0: 0.774,
    170.0: 0.761, 180.0: 0.750, 190.0: 0.739, 200.0: 0.729
} # Truncated for example purposes up to 200kg

FEMALE_RESHEL = {
    40.0: 3.145, 41.5: 2.915, 45.0: 2.545, 50.0: 2.195,
    60.0: 1.800, 70.0: 1.605, 80.0: 1.480, 90.0: 1.390,
    100.0: 1.330, 110.0: 1.280, 120.0: 1.240, 130.0: 1.210,
    140.0: 1.180, 150.0: 1.150, 160.0: 1.130, 170.0: 1.110,
    180.0: 1.090, 190.0: 1.070, 200.0: 1.060
}

def get_reshel_coefficient(bodyweight: float, gender: str) -> float:
    table = MALE_RESHEL if gender.lower() == 'male' else FEMALE_RESHEL
    
    # Get sorted keys
    weights = sorted(table.keys())
    
    # Handle out of bounds
    if bodyweight <= weights[0]:
        return table[weights[0]]
    if bodyweight >= weights[-1]:
        return table[weights[-1]]
        
    # Linear interpolation
    for i in range(len(weights) - 1):
        w1, w2 = weights[i], weights[i+1]
        if w1 <= bodyweight <= w2:
            c1, c2 = table[w1], table[w2]
            fraction = (bodyweight - w1) / (w2 - w1)
            interpolated_coeff = c1 + fraction * (c2 - c1)
            return round(interpolated_coeff, 4)
    return 1.0 # Fallback
