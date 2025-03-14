// Testing for the mood calendar
import dailyContext from "../../contexts/dailyContext";
import React, { useState, useEffect, useContext } from "react";
import { useSelector } from "react-redux";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Button,
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
const LOGIN_KEY = "@login_key";
// Main body
const Mood = ({ navigation }) => {
  const [date, setDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [lastLoginDay, setLastLoginDay] = useState(-1); // set to -1 initially
  const [lastPromptedDay, setLastPromptedDay] = useState(-1);
  const [persistentItem, setPersistentItem] = useState("");

  // addedMoods stores all the moods that have been added
  const user_state = useSelector((state) => state);
  const addedMoods = user_state.data;
  // Getting context
  const { done, setDone, streak, setStreak } = useContext(dailyContext);

  // <-------------------------------- AsyncStorage Stuff -------------------------------->
  const saveLastPromptedDay = async () => {
    try {
      await AsyncStorage.setItem(PROMPT_KEY, JSON.stringify(lastPromptedDay));
      await AsyncStorage.setItem(LOGIN_KEY, JSON.stringify(lastLoginDay));
    } catch (e) {}
  };

  const readLastPromptedDay = async () => {
    try {
      const res = await AsyncStorage.getItem(PROMPT_KEY);
      if (res !== null) {
        setLastPromptedDay(JSON.parse(res));
      }
      const res2 = await AsyncStorage.getItem(LOGIN_KEY);
      if (res2 !== null) {
        setLastLoginDay(JSON.parse(res2));
      }
    } catch (e) {}
    setLoading(false);
  };

  useEffect(() => {
    readLastPromptedDay();
  }, []);

  useEffect(() => {
    saveLastPromptedDay();
  }, [lastPromptedDay, lastLoginDay, persistentItem]);

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
    moods.forEach((moodObject) => {
      const row = moodObject.row;
      const col = moodObject.col;
      const mood = moodObject.mood;
      const year = moodObject.year;
      const month = moodObject.month;
      if (matrix[row][col].year === year && matrix[row][col].month === month) {
        matrix[row][col].img = mood;
      }
    });
  };

  if (addedMoods.length >= 7) {
    // Get the last 7 items in the array
    const temp = addedMoods.slice(addedMoods.length - 7);
    // console.log(temp);
    temp.forEach((moodObject) => {
      const monthDiff = todayDate.getMonth() - moodObject.month;
      const yearDiff = todayDate.getFullYear() - moodObject.year;
      if (moodObject.moodValue >= 4) {
        if (
          monthDiff === 0 &&
          yearDiff === 0 &&
          todayDate.getDate() - moodObject.day < 7
        ) {
          moodyDays++;
        } else if (monthDiff !== 0) {
          const days = nDays[moodObject.month];
          if (
            moodObject.day > days - 7 ||
            moodObject.day < todayDate.getDate()
          ) {
            moodyDays++;
          }
        }
      }
    });
  } else {
    addedMoods.forEach((moodObject) => {
      const monthDiff = todayDate.getMonth() - moodObject.month;
      const yearDiff = todayDate.getFullYear() - moodObject.year;
      if (moodObject.moodValue >= 4) {
        if (
          monthDiff === 0 &&
          yearDiff === 0 &&
          todayDate.getDate() - moodObject.day < 7
        ) {
          moodyDays++;
        } else if (monthDiff !== 0) {
          const days = nDays[moodObject.month];
          if (
            moodObject.day > days - 7 ||
            moodObject.day < todayDate.getDate()
          ) {
            moodyDays++;
          }
        }
      }
    });
  }

  // update matrix before each re-render
  updateMatrix(addedMoods, matrix);
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
  const shouldPrompt = moodyDays >= 5;

  // may need to review the logic
  const prompter = () => {
    const differenceInDays =
      lastPromptedDay === -1 // edge case, because when user starts for the very first time, lastPromptedDay === new Date(1970, 1, 0, 0, 0, 0), we have to do this until they have been prompted at least once throughout the app's lifetime
        ? 3
        : dateFn.differenceInCalendarDays(todayDate, lastPromptedDay);
    // console.log(dateFn.differenceInCalendarDays(todayDate, lastPromptedDay));
    // console.log(todayDate);
    // console.log("Last: " + lastPromptedDay);
    // console.log(differenceInDays);
    if (
      differenceInDays >= 3 // so if the last prompt was at least 3 days ago, then prompt again
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
    }
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
            (item.day === -1 && item.year) ||
            (item.day > todayDate.getDate() &&
              item.year === todayDate.getFullYear()) // since we already don't allow forward navigation
              ? console.log("Haha nothing") // Change to "" before sending for test
              : navigation.navigate("MoodSelector", {
                  item: item,
                  streak: streak + 1,
                })
          }
          key={item.key}
        >
          {_renderIcons(item, rowIndex)}
          <Text
            style={{
              fontFamily: "Itim",
              color: colIndex === 0 || colIndex === 6 ? "#e09000" : "#000",
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

  // Setting the reference to today's items.
  if (x === 0) {
    setPersistentItem(retrieveItem());
    x++;
  }

  const todayItem = retrieveItem();
  if (todayItem !== null) {
    const formatted = dateFn.lightFormat(todayDate, "yyyy-MM-dd");
    const formattedCurr = dateFn.lightFormat(date, "yyyy-MM-dd");
    if (todayItem.img !== "mood_empty") {
      if (!done && x === 1) {
        // change to modulo 3 next time
        if ((streak + 1) % 3 === 0) {
          Alert.alert(
            "Recorded",
            "Today's mood has been recorded. You have earned an additional Noodal!"
          );
        } else {
          Alert.alert(
            "Recorded",
            "Today's mood has been recorded. You have earned 1 Noodal!"
          );
        }
        // Increase/reset streak
        // When user starts up for the very first time and has not recorded anything yet.
        if (lastLoginDay === -1) {
          setStreak(1);
        } else {
          const diff = todayDate.getDate() - lastLoginDay;
          if (diff === 1) {
            setStreak(streak + 1);
          } else {
            setStreak(1);
          }
        }
        // after setting the streak, change lastLoginDay to today's date
        console.log("Setting last login");
        setLastLoginDay(todayDate.getDate());
        x++;
      }

      setDone(true);

      // Wait for AsyncStorage to load. If mood for today has been inputted, then we check if we need to prompt user.
      // Prompter logic can be improved upon next time.
      setTimeout(() => {
        if (!loading && done) {
          if (shouldPrompt) {
            prompter();
          }
        }
      }, 1500);
    } else if (formatted === formattedCurr && todayItem.img === "mood_empty") {
      setDone(false);
    }
  }

  const handleRetrieval = () => {
    const year_difference = todayDate.getFullYear() - date.getFullYear();
    const month_difference = todayDate.getMonth() - date.getMonth();
    if (month_difference === 0 && year_difference === 0) {
      navigation.navigate("MoodSelector", {
        item: persistentItem,
        streak: streak + 1, // assume user WILL add the mood, so we increase streak first to ensure they get additional points on every 3rd day, rather than after every 3rd day
      });
    } else {
      changeMonth(12 * year_difference + month_difference);
      navigation.navigate("MoodSelector", {
        item: persistentItem,
        streak: streak + 1,
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
            fontSize: 26,
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
    marginTop: 60,
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
    height: 95,
    width: 95,
  },

  floatView: {
    flex: 1,
    position: "absolute",
    right: 25,
    bottom: 20,
  },
});

export default Mood;
