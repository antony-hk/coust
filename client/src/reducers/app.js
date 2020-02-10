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

            return {
                ...state,
                registeredCourses: newRegisteredCourses,
            };
        }

        case 'REMOVE_COURSE': {
            const { courseCode } = action.payload;
            const newRegisteredCourses = state.registeredCourses
                .filter(registeredCourseCode => registeredCourseCode !== courseCode);

            return {
                ...state,
                registeredCourses: newRegisteredCourses,
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
