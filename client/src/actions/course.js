export const getAddCourseAction = courseCode => (
    {
        type: 'ADD_COURSE',
        payload: { courseCode },
    }
);

export const getAddCourseSectionAction = (
    courseCode,
    courseSection,
    isVirtual,
) => (
    {
        type: 'ADD_COURSE_SECTION',
        payload: {
            courseCode,
            courseSection,
            isVirtual,
        }
    }
);

export const getRemoveCourseAction = courseCode => (
    {
        type: 'REMOVE_COURSE',
        payload: { courseCode },
    }
);

export const getRemoveCourseSectionAction = (
    courseCode,
    courseSection,
) => (
    {
        type: 'REMOVE_COURSE_SECTION',
        payload: {
            courseCode,
            courseSection,
        }
    }
);
