// create the action types in the reducer
export const MOOD_CHANGE = 'MOOD_CHANGE';


const initialState = {
    current: 'ok',
    possible: ['happy', 'sad', 'angry', 'ok']
};

// mood reducer accepts a state, and an action. payload = an index, to change our mood accordingly to
const moodReducer = (state = initialState, action) => {
    switch (action.type) {
        case MOOD_CHANGE:
            state.current = state.possible[action.payload];
            return { ...state, MOOD_CHANGE: action.payload }
        default:
            return state;
    }
}

export default moodReducer;