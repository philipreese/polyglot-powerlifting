from services.formulas import calculate_dots, calculate_ipf_gl, calculate_reshel, calculate_wilks


def test_wilks_male():
    # 100kg male lifting 600kg total
    # expected wilks ~ 365.16
    score = calculate_wilks(100.0, 600.0, "male")
    assert 360 < score < 370


def test_wilks_female():
    # 60kg female lifting 300kg total
    # expected wilks ~ 334.5
    score = calculate_wilks(60.0, 300.0, "female")
    assert 330 < score < 340


def test_dots_male():
    score = calculate_dots(100.0, 600.0, "male")
    assert 360 < score < 370


def test_ipf_gl_raw_male():
    score = calculate_ipf_gl(100.0, 600.0, "male", "raw")
    # New IPF GL scores are usually around 60-120
    assert 50 < score < 150


def test_reshel_male_exact():
    # 100kg exactly should trigger the exact lookup (0.915)
    score = calculate_reshel(100.0, 600.0, "male")
    assert score == 600.0 * 0.915


def test_reshel_male_interpolated():
    # 95kg male should be halfway between 90kg (0.969) and 100kg (0.915)
    # 0.969 + -0.054 / 2 = 0.942
    score = calculate_reshel(95.0, 600.0, "male")
    expected_coeff = 0.969 + 0.5 * (0.915 - 0.969)
    assert score == round(600.0 * round(expected_coeff, 4), 2)
