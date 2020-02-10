export const getAddCourseAction = courseCode => (
    {
        type: 'ADD_COURSE',
        payload: { courseCode },
    }
);

export const getRemoveCourseAction = courseCode => (
    {
        type: 'REMOVE_COURSE',
        payload: { courseCode },
    }
);
