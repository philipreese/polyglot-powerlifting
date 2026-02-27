import math

from services.reshel import get_reshel_coefficient


def calculate_wilks(bodyweight: float, total: float, gender: str) -> float:
    if gender.lower() == "male":
        a = -216.0475144
        b = 16.2606339
        c = -0.002388645
        d = -0.00113732
        e = 7.01863e-06
        f = -1.291e-08
    else:
        a = 594.31747775582
        b = -27.23842536447
        c = 0.82112226871
        d = -0.00930733913
        e = 4.731582e-05
        f = -9.054e-08

    x = bodyweight
    denominator = a + (b * x) + (c * (x**2)) + (d * (x**3)) + (e * (x**4)) + (f * (x**5))
    if denominator == 0:
        return 0.0
    return round(total * (500.0 / denominator), 2)


def calculate_dots(bodyweight: float, total: float, gender: str) -> float:
    if gender.lower() == "male":
        a = -307.5820
        b = 24.0900756
        c = -0.1918759221
        d = 0.0007391293
        e = -0.000001093
    else:
        a = -57.96288
        b = 13.6175032
        c = -0.1126655495
        d = 0.0005158568
        e = -0.0000010706

    x = bodyweight
    denominator = a + (b * x) + (c * (x**2)) + (d * (x**3)) + (e * (x**4))
    if denominator == 0:
        return 0.0
    return round(total * (500.0 / denominator), 2)


def calculate_ipf_gl(bodyweight: float, total: float, gender: str, equipment: str) -> float:
    # 2020 IPF GL Constants
    if gender.lower() == "male":
        if equipment.lower() == "raw":
            a, b, c = 1199.72839, 1025.18162, 0.00921
        else:  # equipped
            a, b, c = 1236.25115, 1449.21864, 0.01644
    else:
        if equipment.lower() == "raw":
            a, b, c = 610.32796, 1045.59282, 0.03048
        else:  # equipped
            a, b, c = 758.63878, 949.31382, 0.02435

    denominator = a - b * math.exp(-c * bodyweight)
    if denominator == 0:
        return 0.0
    return round(total * 100.0 / denominator, 2)


def calculate_reshel(bodyweight: float, total: float, gender: str) -> float:
    coeff = get_reshel_coefficient(bodyweight, gender)
    return round(total * coeff, 2)
