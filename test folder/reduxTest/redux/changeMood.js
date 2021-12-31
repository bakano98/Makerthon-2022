// an action
// takes in a moodIndex to change accordingly
// need to import a constant
export const changeMood = (moodIndex) => {
    return {
        type: MOOD_CHANGE,
        payload: moodIndex,
    }
}

// add now returns an action
// now, connect to App.js