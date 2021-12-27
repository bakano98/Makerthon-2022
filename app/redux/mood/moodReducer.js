import { REHYDRATE } from "redux-persist/es/constants";
import * as dateFn from "date-fns";
import { Alert } from "react-native";

// the actions, remember to "export", then import in the place where action is taking place!
export const ADD_MOOD = "ADD_MOOD";
export const MODIFY_MOOD = "MODIFY_MOOD";
export const SPEND_POINTS = "SPEND_POINTS";
// the state represents the moods that have been selected
let initialState = {
  data: [],
  logPoints: 20, // change to 0 after progress update.
};

const currentDate = new Date();

const comp = (x, y) => {
  if (x.year !== y.year) {
    return x.year > y.year ? 1 : -1;
  } else if (x.month !== y.month) {
    return x.month > y.month ? 1 : -1;
  } else {
    return x.day > y.day ? 1 : -1;
  }
};

// reducers take in a state, and an action
const moodReducer = (state = initialState, action) => {
  // what to do with the action given?
  switch (action.type) {
    case ADD_MOOD:
      let payload = action.payload;
      let item = payload.item;
      const itemDay = item.day;
      const itemMonth = item.month;
      const currDay = dateFn.getDate(currentDate);
      const currMonth = dateFn.getMonth(currentDate);
      initialState.data = [
        ...initialState.data,
        {
          mood: action.payload.mood,
          moodName: action.payload.moodName,
          moodValue: action.payload.moodValue, // unique value assigned to each mood. Can help in making data processing easier as well
          col: item.col,
          row: item.row,
          day: itemDay,
          month: itemMonth,
          year: item.year, // most likely not needed
          key: item.key,
        },
      ];

      if (itemDay === currDay && itemMonth === currMonth) {
        initialState.logPoints++; // if you log on that day itself, you get 1 point
      }
      initialState.data.sort(comp);
      // return the object to moodReducer
      return { ...initialState };
    // just return itself by default
    case MODIFY_MOOD:
      console.log("Modifying");
      // create new array with initialState. Necessary so that it will cause a re-render
      const tempState = [...initialState.data];
      // Check if there are any items within the state array that corresponds with the key of the item we are wanting to add
      // then find that item and modify its state
      tempState.forEach((item) => {
        if (item.key === action.payload.item.key) {
          item.mood = action.payload.mood;
          item.moodName = action.payload.moodName;
          item.moodValue = action.payload.moodValue;
        }
      });
      tempState.sort(comp);
      // Reassign initialState to tempState. Since this is a new object, a re-render is forced.
      initialState.data = tempState;
      return { ...initialState, MODIFY_MOOD: action.payload };
    case SPEND_POINTS:
      console.log("Spending points");
      console.log(initialState.logPoints);
      initialState.logPoints -= action.payload.pointsToSpend;
      return { ...initialState };
    case REHYDRATE:
      // some error handling, for initial startup where there's no payload
      if (action.payload === undefined) {
        return state;
      }
      // merging the data
      const tempStateData = state.data.concat(action.payload.data);
      // in case data is blank
      if (tempStateData !== null) {
        initialState.data = tempStateData;
      }
      initialState.logPoints = action.payload.logPoints; // getting back the rehydrated logPoints
      // return the merged state
      return { ...initialState };
    default:
      return state;
  }
};

export default moodReducer;
