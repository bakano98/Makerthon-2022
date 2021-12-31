// Testing for the mood calendar

import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  Button,
  View,
  Image,
  TouchableOpacity,
} from "react-native";
import * as dateFn from "date-fns";

const icons = require("../../icons/icons.js");

const MoodTest = ({ navigation }) => {
  const [date, setDate] = useState(new Date());
  const possible = [
    "mood_empty",
    "mood_happy",
    "mood_okay",
    "mood_calm",
    "mood_sad",
    "mood_stress",
    "mood_angry",
    "mood_anxious",
  ];
  // const iconState = useSelector((state) => state);
  // remember to add const
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
  // console.log(iconState);
  // function to populate your array with the dates
  const generateMatrix = () => {
    let matrix = [];
    // Create header
    matrix[0] = weekDays;
    let year = date.getFullYear(); // a number
    let month = date.getMonth(); // a number
    for (let i = 0; i < 7; i++) {
      matrix[0][i] = {
        day: weekDays[i],
        month: month,
        year: year,
        img: "not possible",
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
          day: -1,
          month: month,
          year: year,
          img: "not possible",
        };
        if (row == 1 && col >= firstDay) {
          // Fill in rows only after the first day of the month
          matrix[row][col] = {
            day: counter++,
            month: month,
            year: year,
            img: possible[0],
          };
        } else if (row > 1 && counter <= maxDays) {
          // Fill in rows only if the counter's not greater than
          // the number of days in the month
          matrix[row][col] = {
            day: counter++,
            month: month,
            year: year,
            img: possible[0],
          };
        }
      }
    }
    return matrix;
  };

  // make your matrix <-- 2d array of dates
  let matrix = generateMatrix();

  let rows = [];

  const _renderIcons = (item, rowIndex) => {
    if (item !== -1 && rowIndex !== 0) {
      return (
        <Image style={{ width: 40, height: 40 }} source={icons[item.img]} />
      );
    } else {
      return;
    }
  };

  rows = matrix.map((row, rowIndex) => {
    let rowItems = row.map((item, colIndex) => {
      return (
        <TouchableOpacity
          style={{
            flex: 1,
            height: 20,
            textAlign: "center",
            alignItems: "center",
            // Highlight header
            backgroundColor: rowIndex === 0 ? "#ddd" : "#fff",
            // Highlight Sundays
            color: colIndex === 0 ? "#a00" : "#000",
            // Highlight current date
            fontSize: 18,
          }}
          onPress={() => navigation.navigate("MoodSelector")}
        >
          {_renderIcons(item, rowIndex)}
          <Text key={colIndex}>{item.day !== -1 ? item.day : ""}</Text>
        </TouchableOpacity>
      );
    });
    return (
      <View
        style={{
          flexDirection: "row",
          padding: 35,
          justifyContent: "space-around",
          alignItems: "center",
        }}
      >
        {rowItems}
      </View>
    );
  });

  /*
    TO DO: WJ will linkup with mood tracking
    */

  // const _onPress = (item) => {
  //   //item is a number representing the day
  //   console.log(item.match)
  //   setState(() => {
  //     if (!item.match && item != -1) {
  //       date.setDate(item);
  //       return date;
  //     }
  //   });
  //  };

  const changeMonth = (n) => {
    const curr =
      n > 0
        ? dateFn.addMonths(date, Math.abs(n))
        : dateFn.subMonths(date, Math.abs(n));
    console.log(curr);
    return setDate(curr);
  };

  return (
    <SafeAreaView style={styles.moodCalendar}>
      <SafeAreaView style={styles.moodCalendarHeader}>
        <TouchableOpacity onPress={() => changeMonth(-1)}>
          <Image style={styles.arrowImage} source={icons["arrow_L"]} />
        </TouchableOpacity>
        <Text
          style={{
            fontWeight: "bold",
            fontSize: 30,
            textAlign: "center",
          }}
        >
          {months[date.getMonth()]} &nbsp;
          {date.getFullYear()}
        </Text>
        <TouchableOpacity onPress={() => changeMonth(1)}>
          <Image style={styles.arrowImage} source={icons["arrow_R"]} />
        </TouchableOpacity>
      </SafeAreaView>
      {rows}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  moodCalendar: {
    backgroundColor: "white",
    flex: 1,
  },

  moodCalendarHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 25,
  },

  arrowImage: {
    marginTop: 2.5,
    height: 25,
    width: 50,
  },
});

export default MoodTest;
