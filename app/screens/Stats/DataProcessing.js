// the Dashboard screen
import React from "react";
import { Image } from "react-native";
import * as dateFn from "date-fns";

const comparator = (x, y) => {
  if (x.year !== y.year) {
    return x.year - y.year;
  } else if (x.month !== y.month) {
    return x.year - y.month;
  } else {
    return x.day - y.day;
  }
};

function getWeek(str) {
  // e.g. 'Sat-1-11-2021'
  const arr = str.split("-");
  const date = new Date(arr[2], arr[1], arr[0]);
  return dateFn.getWeek(date);
}

function getProgress(dictionary) {
  const now = new Date();
  const currMonth = dateFn.getMonth(now);
  const currYear = dateFn.getYear(now);

  if (
    dictionary === -1 ||
    dictionary[currYear] === undefined ||
    dictionary[currYear][currMonth] === undefined
  ) {
    return 0;
  }
  const maxDays = dateFn.getDate(dateFn.lastDayOfMonth(now));

  return (
    Object.values(dictionary[currYear][currMonth])
      .map((x) => Object.values(x).length)
      .reduce((prev, curr) => prev + curr) / maxDays
  );
}

function getProgressAsFraction(dictionary) {
  const now = new Date();
  const currMonth = dateFn.getMonth(now);
  const currYear = dateFn.getYear(now);

  if (
    dictionary === -1 ||
    dictionary[currYear] === undefined ||
    dictionary[currYear][currMonth] === undefined
  ) {
    return 0;
  }
  const maxDays = dateFn.getDate(dateFn.lastDayOfMonth(now));

  return [
    Object.values(dictionary[currYear][currMonth])
      .map((x) => Object.values(x).length)
      .reduce((prev, curr) => prev + curr),
    maxDays,
  ];
}

function getLongestStreak(array) {
  // assumes sorted array and returns number of continuous days logged.
  // returns a number representing the number of contiguous days in the month logged.
  const now = new Date();
  const currMonth = dateFn.getMonth(now);
  const currYear = dateFn.getYear(now);

  if (
    array.length === 0 ||
    array[array.length - 1].year !== currYear ||
    array[array.length - 1].month !== currMonth
  ) {
    return 0;
  } else {
    let result = 1;
    for (let i = array.length - 1; i > 0; i--) {
      let curr = array[i];
      let year = curr.year;
      let month = curr.month;
      let day = curr.day;
      let next = array[i - 1];
      let yearNext = next.year;
      let monthNext = next.month;
      let dayNext = next.day;
      if (year === yearNext && month === monthNext && day - dayNext === 1) {
        result++;
      } else {
        return result;
      }
    }
  }
}

function getTrend(array, n) {
  //assumes that array is already sorted in chronological order.
  if (array.length == 0) {
    return "requires mood journaling.";
  }
  const score = [1, 0, 1, -1, -1, -1, -1];
  // happy, okay, calm, sad, stressed, angry, anxious.

  let origin = 0;
  const max = array.length == 0 ? 0 : Math.min(array.length, n + 1);
  for (let i = array.length - max; i < array.length; i++) {
    let curr = array[i];
    let mood = curr.moodValue;
    origin += score[mood - 1];
  }

  if (origin > 0) {
    return "improving";
  } else if (origin < 0) {
    return "declining";
  } else {
    return "maintaining";
  }
}

function getModeMood(array, n) {
  // takes in a sorted array and returns the most common mood in the last n days.
  const result = getModeMoodArray(array, n);
  const english = [
    "happy",
    "okay",
    "calm",
    "sad",
    "stressed",
    "angry",
    "anxious",
  ];
  // happy, okay, calm, sad, stressed, angry, anxious.
  if (result.length > 1) {
    return "mixed moods";
  } else if (result.length == 0) {
    return "no mood";
  }
  return result.map((x) => english[x - 1])[0];
}

function displayModeMood(array) {
  const icons = require("../../icons/icons");
  const iconName = [
    "mood_happy",
    "mood_okay",
    "mood_calm",
    "mood_sad",
    "mood_stressed",
    "mood_angry",
    "mood_anxious",
    "mood_mixed",
  ];
  if (array.length == 0) {
    return (
      <Image style={{ width: 72, height: 90 }} source={icons["mood_empty"]} />
    );
  }
  const result = array
    .map((x) => iconName[x - 1])
    .map((x) => {
      return <Image style={{ width: 72, height: 90 }} source={icons[x]} />;
    });
  return result;
}

function getModeMoodArray(array, n) {
  // takes in a sorted array and returns the most common mood in the last n days.
  if (array.length == 0) {
    return array;
  }
  const subArray = array.slice(-n);
  const moodCount = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0,
  };
  let result = [];

  function mapper(x) {
    moodCount[x.moodValue]++;
    return moodCount[x.moodValue];
  }

  const mapped = subArray.map((x) => mapper(x));
  const max = Math.max(...mapped);

  let maxIndex = mapped.indexOf(max);
  while (maxIndex !== -1) {
    result.push(subArray[maxIndex].moodValue);
    mapped[maxIndex] = -1;
    maxIndex = mapped.indexOf(max);
  }

  return result;
}

// assume array is sorted in ascending order.
function toDict(array) {
  // dict = { year: month: week: ['sad', 'happy', 'happy' ...]}
  let dict = {};
  //console.log(array)
  for (let i = 0; i < array.length; i++) {
    let curr = array[i];
    let year = curr.year;
    let month = curr.month;

    if (dict[year] !== undefined) {
      if (dict[year][month] !== undefined) {
        if (dict[year][month][getWeek(curr.key)] !== undefined) {
          dict[year][month][getWeek(curr.key)][curr.day] = curr.moodValue;
        } else {
          dict[year][month][getWeek(curr.key)] = {};
          dict[year][month][getWeek(curr.key)][curr.day] = curr.moodValue;
        }
      } else {
        dict[year][month] = {};
        dict[year][month][getWeek(curr.key)] = {};
        dict[year][month][getWeek(curr.key)][curr.day] = curr.moodValue;
      }
    } else {
      dict[year] = {};
      dict[year][month] = {};
      dict[year][month][getWeek(curr.key)] = {};
      dict[year][month][getWeek(curr.key)][curr.day] = curr.moodValue;
    }
  }
  // Use -1 to indicate that blankslate else return dictionary
  return array.length == 0 ? -1 : dict;
}

// function that flattens {k1: v1, k2:v2, ...} -> [v1, v2, ...]
const flattenObject = (obj) => {
  const flattened = {};

  Object.keys(obj).forEach((key) => {
    if (typeof obj[key] === "object" && obj[key] !== null) {
      Object.assign(flattened, flattenObject(obj[key]));
    } else {
      flattened[key] = obj[key];
    }
  });

  return flattened;
};

function flattenByMonth(dict) {
  // result = { year: month: ['sad', 'happy', 'happy' ...]}
  result = {};
  for (year in dict) {
    result[year] = {};
    for (month in dict[year]) {
      result[year][month] = flattenObject(dict[year][month]);
    }
  }
  return result;
}

function flattenByYear(dict) {
  // result = { year: ['sad', 'happy', 'happy' ...]}
  result = {};
  for (year in dict) {
    result[year] = {};
    result[year][month] = flattenObject(dict[year]);
  }
  return result;
}

export {
  comparator,
  getWeek,
  getProgress,
  getProgressAsFraction,
  getLongestStreak,
  getTrend,
  getModeMood,
  getModeMoodArray,
  displayModeMood,
  toDict,
  flattenObject,
  flattenByMonth,
  flattenByYear,
};
