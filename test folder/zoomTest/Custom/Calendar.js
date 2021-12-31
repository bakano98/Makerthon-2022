import React, { useState } from 'react';
import { SafeAreaView, Text, Button, View, Alert} from 'react-native';
import * as dateFn from 'date-fns';

const todayDate = new Date();
// constant date set to the 1st day of current month. To prevent going back in the past.
const dateToCompare = new Date(todayDate.getFullYear(), todayDate.getMonth(), 1);
const Calendar = (props) => {
  // hooks to set dates
  const [date, setDate] = useState(new Date());
  const [chosen, setChosen] = useState("NONE");

  // months in calendar
  const months = ["January", "February", "March", "April", 
  "May", "June", "July", "August", "September", "October", 
  "November", "December"];
  
  // days in calendar
  const weekDays = [
      "Sun","Mon","Tue","Wed","Thu","Fri","Sat"
  ];

  // num of days in months
  const nDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];


  // function to populate your array with the dates
  const generateMatrix = () => {
    let matrix = [];
    // Create header
    matrix[0] = []; // initialise the first row
    let year = date.getFullYear(); // a number
    let month = date.getMonth(); // a number
    for (let i = 0; i < 7; i++) {
      // initialising objects in each column
      matrix[0][i] = {
        value: weekDays[i],
        isBooked: 'impossible',
        isWeekend: false
      }
    }

    // first day of the month
    let firstDay = new Date(year, month, 1).getDay();
    let maxDays = nDays[month]; // max number of days for month, pre-defined
    if (month == 1) { // February
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
        // we represent each index as an object, as we need to have different keys.
        matrix[row][col] = { 
          value: -1,
          isBooked: false
        };
        if (row == 1 && col >= firstDay) {
          // Fill in rows only after the first day of the month
          matrix[row][col] = {
            value: counter++,
            month: month,
            year: year,
            isBooked: false,
            isWeekend: col === 6 || col === 0 ? true : false
          }
        } else if (row > 1 && counter <= maxDays) {
          // Fill in rows only if the counter's not greater than
          // the number of days in the month
          matrix[row][col] = {
            value: counter++,
            month: month,
            year: year,
            isBooked: false,
            isWeekend: col === 6 || col === 0 ? true : false
          }
        }
      }
    }
    
    return matrix;
  }
  
    // make your matrix <-- 2d array of dates
    let matrix = generateMatrix();


    let rows = [];
    
    // actual populationdateToCompare
    // styles functions
    const fontColourPicker = (item, rowIndex, colIndex) => { 
      return rowIndex === 0 
              ? colIndex === 0
                ? 'red'
                : 'black'
              : item.isWeekend 
                ? 'grey' 
                : 'black'
    }

    const bgColourPicker = (rowIndex, item) => {
      return rowIndex === 0 
              ? '#ddd'
              : item.value === chosen
                ? '#90EE90'
                : item.isBooked
                  ? 'red'
                  : '#fff'
    }

    // generating the entire calendar's items
    rows = matrix.map((row, rowIndex) => {
      let rowItems = row.map((item, colIndex) => {
        return (
          <Text
            style={{
              flex: 1,
              height: 30,
              textAlign: 'center',
              // Highlight header
              backgroundColor: bgColourPicker(rowIndex, item),
              // Highlight Sundays
              color: fontColourPicker(item, rowIndex, colIndex),
              // Highlight current date
              fontWeight: item.value === date.getDate() 
                                  ? 'bold': 'normal',
              fontSize: 18,
            }}
            onPress={() => pressCalendar(item, colIndex)}>
            {item.value != -1 ? item.value : ''}
          </Text>
        );
      });
      return (
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            padding: 35,
            justifyContent: 'space-around',
            alignItems: 'center',
          }}>
          {rowItems}
        </View>
      );
    });
    

    // happens when you click on an object in the calendar
    const pressCalendar = (item, col) => {
      if (item === '') {
        // then do nothing
      } else if (item.year === todayDate.getFullYear() && item.month === todayDate.getMonth()) {
        // if it's the same year and the selected month is this month
        if (item.value <= todayDate.getDate()) {
          // if the selected date is lesser than the current date, then cannot book
          Alert.alert("Invalid date", "Only able to book appointments from tomorrow onwards")
        } else {
          setChosen(item.value);
          const year = date.getFullYear();
          const month = date.getMonth()+1;
          const day = item.value;
          props.getDate(day + "-" + month + "-" + year);
          props.getItem(item);
        }
      } else if (col === 0 || col === 6) {
        Alert.alert("Unavailable", "Sorry, unable to book on weekends");
      } else if (item.isBooked) {
        Alert.alert("Fully booked", "Please choose another date");
      }  else {
        // valid, so we'll need to retrieve the date then black it out..
        setChosen(item.value);
        const year = date.getFullYear();
        const month = date.getMonth()+1;
        const day = item.value;
        props.getDate(day + "-" + month + "-" + year);
        props.getItem(item);
      }
    }
    
    
    // changes the month on screen
    const changeMonth = (n) => {
      setChosen(0); // to reset the chosen date
      const curr = n > 0 ? dateFn.addMonths(date, Math.abs(n)) : dateFn.subMonths(date, Math.abs(n));
      if (curr <= dateToCompare) {
        Alert.alert("Invalid","Unable to book an appointment before today.")
      } else if (curr > dateFn.addMonths(dateToCompare, Math.abs(6))) {
        Alert.alert("Unavailable","Unable to book too far in the future")
      } else {
        return setDate(curr);
      }
    }
    

    return (
      <SafeAreaView style={{marginTop: 25, height: props.height, width: props.width}}>
          <Text style={{
            fontWeight: 'bold',
            fontSize: 30,
            textAlign: 'center',
            }}>
            {months[date.getMonth()]} &nbsp;
            {date.getFullYear()}
            
          </Text>
      
          { rows }
          
        <Button title="Previous"
          style={{flexDirection:'left'}}
          onPress={() => changeMonth(-1)}/>
        <Button title="Next"
          style={{flexDirection:'right'}}
          onPress={() => changeMonth(1)}/>  
      </SafeAreaView>
    );

}


export default Calendar;