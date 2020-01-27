const initialState = {
    isFaqDialogOpened: false,
};

const appReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'OPEN_FAQ_DIALOG':
            return {
                ...state,
                isFaqDialogOpened: true,
            };
        case 'CLOSE_FAQ_DIALOG':
            return {
                ...state,
                isFaqDialogOpened: false,
            }
        default:
            return state;
    }
};

export default appReducer;
