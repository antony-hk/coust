const initialState = {
    isFaqDialogOpened: false,
    registeredCourses: [],
};

const appReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'ADD_COURSE': {
            const { courseCode } = action.payload;
            const newRegisteredCourses = [
                ...state.registeredCourses,
                courseCode,
            ];

            window.timetable[courseCode] = [];

            return {
                ...state,
                registeredCourses: newRegisteredCourses,
            };
        }

        case 'ADD_COURSE_SECTION': {
            const {
                courseCode,
                courseSection,
                isVirtual,
            } = action.payload;

            if (!isVirtual) {
                window.timetable[courseCode].push(courseSection);
            }

            return {
                ...state,
            };
        }

        case 'REMOVE_COURSE': {
            const { courseCode } = action.payload;
            const newRegisteredCourses = state.registeredCourses
                .filter(registeredCourseCode => registeredCourseCode !== courseCode);

            delete window.timetable[courseCode];
            delete window.courseColor[courseCode];

            return {
                ...state,
                registeredCourses: newRegisteredCourses,
            };
        }

        case 'REMOVE_COURSE_SECTION': {
            const { courseCode, courseSection } = action.payload;

            window.timetable[courseCode] = window.timetable[courseCode].filter(
                timetableSection => timetableSection !== courseSection
            )

            return {
                ...state,
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
