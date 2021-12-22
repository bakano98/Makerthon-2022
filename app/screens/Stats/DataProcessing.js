// the Dashboard screen
import React from 'react';
import { Image } from 'react-native';
import * as dateFn from 'date-fns';

 

const comparator = (x, y) => {
    if (x.year !== y.year) {
      return x.year - y.year;
    } else if (x.month !== y.month) {
      return x.year - y.month;
    } else {
      return x.day - y.day;
    }
}  
  
function getWeek(str) {
    // e.g. 'Sat-1-11-2021'
    const arr = str.split("-");
    const date = new Date(arr[2], arr[1], arr[0]);
    return dateFn.getWeek(date)
}

function getProgress(dictionary) {
  const now = new Date();
  const currMonth = dateFn.getMonth(now);
  const currYear = dateFn.getYear(now);
  const maxDays = dateFn.getDate(dateFn.lastDayOfMonth(now));
     // Array

  return ( Object.values(dictionary[currYear][currMonth]).length / maxDays )
}

function getTrend(array, n) {
  //assumes that array is already sorted in chronological order.
  const score = { 
    mood_sad: -1,
    mood_stressed: -1,
    mood_okay: 1,
    mood_happy: 1,
    mood_calm: 1,
    mood_anxious: -1,
    mood_angry: -1,
  }

  let origin = 0;
  const max = array.length == 0 ? 0 : Math.min(array.length, n + 1)
  for (let i = array.length - max; i < array.length; i++) {
    let curr = array[i] 
    let mood = curr.mood
    origin += score[mood];
  }

  if (origin > 0) {
    return 'improving';
  } else if (origin < 0) {
    return 'declining';
  } else {
    return 'maintaining';
  }
}

function getModeMood(array, n) {
  // takes in a sorted array and returns the most common mood in the last n days.
  const result = getModeMoodArray(array,n)
  const english = {
    mood_sad: 'sad',
    mood_stressed: 'stressed',
    mood_okay: 'okay',
    mood_happy: 'happy',
    mood_calm: 'calm',
    mood_anxious: 'anxious',
    mood_angry: 'angry',
  }
  if (result.length > 1) {
    return 'a lot of emotions lately';
  }
  return result.map(x => english[x])[0];
}

function displayModeMood(array) {
  const icons = require("../../icons/icons");
  const result = array.map((x) => { return <Image style={{ width: 45, height: 45 }} source={icons[x]} />})

  return ( result )
}

function getModeMoodArray(array, n) {
  // takes in a sorted array and returns the most common mood in the last n days.
  const subArray = array.slice(-n);
  const moodCount = {
    mood_sad: 0,
    mood_stressed: 0,
    mood_okay: 0,
    mood_happy: 0,
    mood_calm: 0,
    mood_anxious: 0,
    mood_angry: 0,
  }
  let result = [];

 function mapper(x) {
    moodCount[x.mood]++
    return (moodCount[x.mood])
  }

  const mapped = subArray.map((x) => mapper(x));
  const max = Math.max(...mapped);

  let maxIndex = mapped.indexOf(max);
  while (maxIndex !== -1) {
    result.push(subArray[maxIndex].mood);
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
      let year = curr.year
      let month = curr.month
      
      if (dict[year] !== undefined) {
        if (dict[year][month] !== undefined) {
          if (dict[year][month][getWeek(curr.key)] !== undefined) {
            dict[year][month][getWeek(curr.key)][curr.day] = curr.mood;
          } else {
            dict[year][month][getWeek(curr.key)] = {};
            dict[year][month][getWeek(curr.key)][curr.day] = curr.mood;
          }
  
        } else {
          dict[year][month] = {};
          dict[year][month][getWeek(curr.key)] = {};
          dict[year][month][getWeek(curr.key)][curr.day] = curr.mood;
  
        }
  
      } else {
        dict[year] = {};
        dict[year][month] = {};
        dict[year][month][getWeek(curr.key)] = {};
        dict[year][month][getWeek(curr.key)][curr.day] = curr.mood;
      }
    }
    return dict;
}
  
  // function that flattens {k1: v1, k2:v2, ...} -> [v1, v2, ...]
const flattenObject = (obj) => {
    const flattened = {}
  
    Object.keys(obj).forEach((key) => {
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        Object.assign(flattened, flattenObject(obj[key]))
      } else {
        flattened[key] = obj[key]
      }
    })
  
    return flattened
}
  
function flattenByMonth(dict) {
    // result = { year: month: ['sad', 'happy', 'happy' ...]}
    result = {}
    for (year in dict) {
      result[year] = {}
      for (month in dict[year]) {
        result[year][month] = flattenObject(dict[year][month])
      }
    }
    return result;
}
  
function flattenByYear(dict) {
    // result = { year: ['sad', 'happy', 'happy' ...]}
    result = {}
    for (year in dict) {
      result[year] = {}
      result[year][month] = flattenObject(dict[year]);
    }
    return result;
}

export {
  comparator, 
  getWeek, 
  getProgress, 
  getTrend, 
  getModeMood, 
  getModeMoodArray, 
  displayModeMood, 
  toDict, 
  flattenObject, 
  flattenByMonth, 
  flattenByYear };