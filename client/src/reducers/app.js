const initialState = {
    isFaqDialogOpened: false,
    registeredCourses: [],
    timetable: {},
};

const appReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'ADD_COURSE': {
            const { courseCode } = action.payload;
            const newRegisteredCourses = [
                ...state.registeredCourses,
                courseCode,
            ];

            return {
                ...state,
                registeredCourses: newRegisteredCourses,
                timetable: {
                    ...state.timetable,
                    [courseCode]: [],
                },
            };
        }

        case 'ADD_COURSE_SECTION': {
            const {
                courseCode,
                courseSection,
                isVirtual,
            } = action.payload;

            let newTimetable = { ...state.timetable };
            if (!isVirtual) {
                newTimetable[courseCode] = [
                    ...state.timetable[courseCode],
                    courseSection
                ];
            }

            return {
                ...state,
                timetable: newTimetable,
            };
        }

        case 'REMOVE_COURSE': {
            const { courseCode } = action.payload;
            const newRegisteredCourses = state.registeredCourses
                .filter(registeredCourseCode => registeredCourseCode !== courseCode);

            const newTimetable = {
                ...state.timetable,
            };
            delete newTimetable[courseCode];

            delete window.courseColor[courseCode];

            return {
                ...state,
                registeredCourses: newRegisteredCourses,
                timetable: newTimetable,
            };
        }

        case 'REMOVE_COURSE_SECTION': {
            const { courseCode, courseSection } = action.payload;

            return {
                ...state,
                timetable: {
                    ...state.timetable,
                    [courseCode]: state.timetable[courseCode].filter(
                        timetableSection => timetableSection !== courseSection
                    ),
                },
            };
        }

        case 'OPEN_FAQ_DIALOG': {
            return {
                ...state,
                isFaqDialogOpened: true,
            };
        }

        case 'CLOSE_FAQ_DIALOG': {
            return {
                ...state,
                isFaqDialogOpened: false,
            }
        }

        default: {
            return state;
        }
    }
};

export default appReducer;
