// Testing for the mood calendar
import dailyContext from "../../contexts/dailyContext";
import React, { useState, useEffect, useContext } from "react";
import { useSelector } from "react-redux";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  Button,
  View,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import * as dateFn from "date-fns";
import AsyncStorage from "@react-native-async-storage/async-storage";

// need this so easy handling of icons
const icons = require("../../icons/icons.js");

// custom alert
const customAlert = (title, msg, accept, decline) => {
  Alert.alert(title, msg, [
    {
      text: "Decline",
      onPress: decline,
      style: "cancel",
    },
    {
      text: "Accept",
      onPress: accept,
      style: "default",
    },
  ]);
};

const todayDate = new Date(); // to be used for handling calendar back/front
let x = 0;
// AsyncStorage keys
const PROMPT_KEY = "@prompt_key";
// Main body
const Mood = ({ navigation, route, props }) => {
  const [date, setDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [lastPromptedDay, setLastPromptedDay] = useState(
    new Date(1970, 1, 0, 0, 0, 0)
  );
  const [persistentItem, setPersistentItem] = useState("");

  // addedMoods stores all the moods that have been added
  const user_state = useSelector((state) => state);
  const addedMoods = user_state.data;
  // console.log(addedMoods);
  useEffect(() => {
    readLastPromptedDay();
  }, []);

  useEffect(() => {
    saveLastPromptedDay();
  }, [lastPromptedDay, persistentItem]);

  // <-------------------------------- AsyncStorage Stuff -------------------------------->
  const saveLastPromptedDay = async () => {
    try {
      await AsyncStorage.setItem(PROMPT_KEY, JSON.stringify(lastPromptedDay));
    } catch (e) {
      console.log(e);
    }
  };

  const readLastPromptedDay = async () => {
    try {
      const res = await AsyncStorage.getItem(PROMPT_KEY);
      if (res !== null) {
        setLastPromptedDay(JSON.parse(res));
      }
    } catch (e) {
      console.log(e);
    }
    setLoading(false);
  };

  // the months in the year
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const nDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  // function to populate your array with the dates. Note that dates are rendered "on demand", i.e. if you are on December, then you would not be aware of
  // November's state unless you save it somewhere, to use and manipulate another time. Hence, why we would need to maintain some sort of reference to
  // today's date in order to make use of the floating action button properly.
  const generateMatrix = () => {
    let matrix = [];
    // Create header
    matrix[0] = weekDays;
    let year = date.getFullYear(); // a number
    let month = date.getMonth(); // a number
    for (let i = 0; i < 7; i++) {
      matrix[0][i] = {
        row: 0,
        col: i,
        day: weekDays[i],
        month: month,
        year: year,
        img: "not possible",
        key: weekDays[i] + "-" + month + "-" + year,
      };
    }

    // **any date function, returns you a number

    // first day of the month
    let firstDay = new Date(year, month, 1).getDay();
    let maxDays = nDays[month]; // max number of days for month, pre-defined
    if (month == 1) {
      // February
      if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) {
        maxDays += 1;
      }
    }

    // day starts from 1
    let counter = 1;
    // start from row 1, because row 0 populated by strings
    // 7 because 7x7 can fill everything
    for (let row = 1; row < 7; row++) {
      matrix[row] = []; // represent as 2d array

      for (let col = 0; col < 7; col++) {
        // start from -1, until we hit the first day
        matrix[row][col] = {
          row: row,
          col: col,
          day: -1,
          month: month,
          year: year,
          img: "not possible",
          dayString: weekDays[col].day,
          key: weekDays[col].day + "-1" + month + year,
        };
        if (row == 1 && col >= firstDay) {
          // Fill in rows only after the first day of the month
          matrix[row][col] = {
            row: row,
            col: col,
            day: counter++,
            month: month,
            year: year,
            img: "mood_empty",
            dayString: weekDays[col].day,
            key: counter - 1 + "-" + month + "-" + year,
          };
        } else if (row > 1 && counter <= maxDays) {
          // Fill in rows only if the counter's not greater than
          // the number of days in the month
          matrix[row][col] = {
            row: row,
            col: col,
            day: counter++,
            month: month,
            year: year,
            img: "mood_empty",
            dayString: weekDays[col].day,
            key: counter - 1 + "-" + month + "-" + year,
          };
        }
      }
    }
    return matrix;
  };

  // generate the matrix
  let matrix = generateMatrix();
  let rows = [];
  let moodyDays = 0;
  // from Redux state, we know which dates are occupied.
  // so, we use that information to update our calendar on every render
  const updateMatrix = (moods, matrix) => {
    // const daysToSkip = moods.length - 7;
    moods.forEach((moodObject) => {
      const row = moodObject.row;
      const col = moodObject.col;
      const mood = moodObject.mood;
      const year = moodObject.year;
      const month = moodObject.month;
      if (matrix[row][col].year === year && matrix[row][col].month === month) {
        matrix[row][col].img = mood; // now a string
      }
    });
  };

  if (addedMoods.length >= 7) {
    // Get the last 7 items in the array
    const temp = addedMoods.slice(addedMoods.length - 7);
    temp.forEach((moodObject) => {
      if (moodObject.moodValue >= 4) {
        moodyDays++;
      }
    });
  }

  // update matrix before each re-render
  updateMatrix(addedMoods, matrix);
  // console.log(addedMoods);
  const declineHandler = (submit) => {
    Alert.alert(
      "Declined", // title
      "That's OK. You can choose to take it anytime, under the Services tab.\nMeanwhile, here's some resources which may help you to feel better", // message
      submit // on accept
    );
  };

  const acceptHandler = () => {
    navigation.navigate("Questionnaire");
  };

  // <-------------------------------- Prompt Handling Stuff --------------------------------->
  let shouldPrompt = moodyDays >= 5;
  const prompter = () => {
    const differenceInDays =
      lastPromptedDay === new Date(1970, 1, 0, 0, 0, 0) // edge case, because when user starts for the very first time, lastPromptedDay === new Date(1970, 1, 0, 0, 0, 0), we have to do this until they have been prompted at least once throughout the app's lifetime
        ? 3
        : dateFn.differenceInCalendarDays(todayDate, lastPromptedDay);

    if (
      shouldPrompt &&
      differenceInDays >= 3 // so if the last prompt was 3 days ago, then prompt again
    ) {
      setLastPromptedDay(todayDate);
      customAlert(
        "Important",
        "Hey, we noticed you haven't been feeling the best lately, please help us to answer some questions so we know how we can help :)",
        () => {
          acceptHandler();
        },
        () => {
          declineHandler(navigation.navigate("Resources"));
        }
      );
      // if accepted, then reset counter
    }
  };

  const manualPrompt = () => {
    customAlert(
      "Important",
      "Hey, we noticed you haven't been feeling the best lately, please help us to answer some questions so we know how we can help :)",
      () => {
        acceptHandler();
      },
      () => {
        declineHandler(navigation.navigate("Resources"));
      }
    );
  };

  // conditionally render the icons
  const _renderIcons = (item, rowIndex) => {
    if (item.day !== -1 && rowIndex !== 0) {
      if (
        item.month < todayDate.getMonth() ||
        item.year < todayDate.getFullYear()
      )
        return (
          <Image style={{ width: 40, height: 50 }} source={icons[item.img]} />
        );
      else {
        if (item.day <= todayDate.getDate()) {
          return (
            <Image style={{ width: 40, height: 50 }} source={icons[item.img]} />
          );
        }
      }
    } else {
      return;
    }
  };

  // do this on every render
  rows = matrix.map((row, rowIndex) => {
    let rowItems = row.map((item, colIndex) => {
      return (
        <TouchableOpacity
          style={{
            // needs to use ternary ops, so no choice but to do inline styling
            // note, change the background colour to be different in order to see the size of pressable box.
            flex: 1,
            height: rowIndex === 0 ? 20 : 40, // conditionally rendering the height. If it is the days of the week, then lower.
            justifyContent: "center",
            textAlign: "center",
            alignItems: "center",
            fontSize: 18,
          }}
          onPress={() =>
            rowIndex === 0 ||
            item.day === -1 ||
            (item.day > todayDate.getDate() &&
              item.month === todayDate.getMonth() &&
              item.year === todayDate.getFullYear())
              ? ""
              : navigation.navigate("MoodSelector", {
                  item: item,
                })
          }
          key={item.key}
        >
          {_renderIcons(item, rowIndex)}
          <Text
            style={{
              fontFamily: "Itim",
              color:
                (colIndex === 0 || colIndex === 6) && rowIndex === 0
                  ? "#e09000"
                  : "#000",
            }}
          >
            {rowIndex === 0 // if its row 0, which are the days
              ? item.day // render it
              : item.day !== -1 && item.year < todayDate.getFullYear() // if not, check if these conditions are met
              ? item.day
              : item.month < todayDate.getMonth() && item.day !== -1
              ? item.day
              : item.day <= todayDate.getDate() && item.day !== -1
              ? item.day
              : ""}
          </Text>
        </TouchableOpacity>
      );
    });
    return <View style={styles.rowItems}>{rowItems}</View>;
  });

  const changeMonth = (n) => {
    const curr = dateFn.addMonths(date, n);
    const days_over = todayDate.getDate() - 1;
    const comparator = dateFn.subDays(
      dateFn.addMonths(new Date(), 1),
      days_over
    );
    // prevent going forward if the next date is greater than today's date
    if (
      dateFn.lightFormat(curr, "yyyy-MM-dd") >
      dateFn.lightFormat(comparator, "yyyy-MM-dd")
    ) {
      return;
    }
    setDate(curr);
    return curr;
  };

  // retrieves item based on the days of the week, and today's date
  const retrieveItem = () => {
    const col = todayDate.getDay();
    const currentDay = todayDate.getDate();
    for (let i = 0; i < 7; i++) {
      if (matrix[i][col].day === currentDay) {
        return matrix[i][col];
      }
    }
    return null;
  };

  // Setting the reference to today's items. A hacky solution.
  if (x === 0) {
    setPersistentItem(retrieveItem());
    x++;
  }

  // console.log(persistentItem);

  const { done, setDone } = useContext(dailyContext);
  const todayItem = retrieveItem();
  if (todayItem !== null) {
    const formatted = dateFn.lightFormat(todayDate, "yyyy-MM-dd");
    const formattedCurr = dateFn.lightFormat(date, "yyyy-MM-dd");
    if (todayItem.img !== "mood_empty") {
      if (!done && x === 1) {
        Alert.alert(
          "Mood saved",
          "Today's mood done! You have earned 1 point."
        );
        x++;
      }

      setDone(true);

      // Wait for AsyncStorage to load. If mood for today has been inputted, then we check if we need to prompt user.
      // Prompter logic can be improved upon next time.
      setTimeout(() => {
        if (!loading && done) {
          prompter();
        }
      }, 1500);
    } else if (formatted === formattedCurr && todayItem.img === "mood_empty") {
      // console.log("Mood for today not put in yet.");
      setDone(false);
    }
  }

  const handleRetrieval = () => {
    const year_difference = todayDate.getFullYear() - date.getFullYear();
    const month_difference = todayDate.getMonth() - date.getMonth();
    if (month_difference === 0 && year_difference === 0) {
      navigation.navigate("MoodSelector", { item: persistentItem });
    } else {
      changeMonth(12 * year_difference + month_difference);
      navigation.navigate("MoodSelector", {
        item: persistentItem,
      });
    }
  };

  return (
    <SafeAreaView style={styles.moodCalendar}>
      <SafeAreaView style={styles.moodCalendarHeader}>
        <TouchableOpacity onPress={() => changeMonth(-1)}>
          <Image style={styles.arrowImage} source={icons["arrow_L"]} />
        </TouchableOpacity>
        <Text
          style={{
            fontSize: 25,
            fontFamily: "Itim",
            textAlign: "center",
          }}
        >
          {months[date.getMonth()]} &nbsp;
          {date.getFullYear()}
        </Text>
        <TouchableOpacity onPress={() => changeMonth(1)}>
          <Image
            style={styles.arrowImage}
            source={
              dateFn.getMonth(date) === todayDate.getMonth() &&
              dateFn.getYear(date) === todayDate.getFullYear()
                ? null // render nothing if it is past today's date
                : icons["arrow_R"]
            }
          />
        </TouchableOpacity>
      </SafeAreaView>
      {rows}
      <View style={styles.floatView}>
        <TouchableOpacity
          onPress={() => {
            handleRetrieval();
          }}
        >
          <Image source={icons["float_button"]} style={styles.floatButton} />
        </TouchableOpacity>
      </View>
      <Button title="Manual prompt" onPress={() => manualPrompt()} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  moodCalendar: {
    backgroundColor: "#FBF8D6",
    flex: 1,
  },

  moodCalendarHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 50,
    marginBottom: 10,
  },

  arrowImage: {
    height: 25,
    width: 50,
  },

  rowItems: {
    flexDirection: "row",
    padding: 20,
    justifyContent: "space-around",
    alignItems: "center",
  },

  floatButton: {
    height: 90,
    width: 90,
  },

  floatView: {
    flex: 1,
    position: "absolute",
    right: 25,
    bottom: 20,
  },
});

export default Mood;
