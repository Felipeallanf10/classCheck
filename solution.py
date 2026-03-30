def better_than_average(class_points, your_points):
    total = sum(class_points) + your_points
    number_of_students = len(class_points) + 1
    average = total / number_of_students
    return your_points > average
