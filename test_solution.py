import pytest
from solution import better_than_average


def test_better_than_average():
    assert better_than_average([2, 3], 5)
    assert not better_than_average([1, 2, 3], 1)
    assert not better_than_average([100, 200], 150)
    assert better_than_average([0, 0, 0], 1)
    assert not better_than_average([5, 5, 5], 5)
