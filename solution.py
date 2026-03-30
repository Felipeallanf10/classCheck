def better_than_average(class_points, your_points):
    """Return True if your_points is strictly greater than the class average (including your score)."""
    average = (sum(class_points) + your_points) / (len(class_points) + 1)
    return your_points > average
