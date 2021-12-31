// Component that allows users to select a time for their daily notifications.
// Need to add an option to turn off notifications

import React, { useState } from 'react';
import { Modal, TouchableOpacity, StyleSheet, Text, View, Alert, SafeAreaView, Button } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as dateFn from 'date-fns';
// Super messy code since I have to nest Calendar within Modal, and use Modal within the booking screen. Not sure how better to do it
// as I'm not too sure how the state of the calendar should be implemented within Redux. However, using Redux would definitely be a better choice
// if you knew how the state of the calendar should be implemented in Redux.


const todayDate = new Date();
// constant date set to the 1st day of current month. To prevent going back in the past.
const dateToCompare = new Date(todayDate.getFullYear(), todayDate.getMonth(), 1);

// Probably add AsyncStorage to store the dates that have already been booked?
const App = () =>  {
  // Define your time with hooks. We use this as the default time. This is a string used to display time only.
  const [time, setTime] = useState("Please choose a time");
  

  // // <------------------------------------ Calendar stuff ------------------------------------->
  const [apptDate, setApptDate] = useState('Please choose a date');
  const [item, setItem] = useState('');
  const [calDate, setCalDate] = useState(new Date());
  const [chosen, setChosen] = useState("Please choose a date");
  const [booked, setBooked] = useState([]); // used after confirming
  // for styling
  const fontColourPicker = (item, rowIndex, colIndex) => { 
    return rowIndex === 0 
            ? colIndex === 0
              ? 'red'
              : 'black'
            : item.isWeekend || datePassed(item)
              ? '#BCBCBC' 
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

  // the days in each month
  const nDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  // the months
  const months = ["January", "February", "March", "April", 
    "May", "June", "July", "August", "September", "October", 
    "November", "December"];
  // the days in a week
  const weekDays = [
    "Sun","Mon","Tue","Wed","Thu","Fri","Sat"
  ];

  const datePassed = (item) => {
    if (item.year === todayDate.getFullYear() && item.month === todayDate.getMonth() && item.value <= todayDate.getDate()) {
      return true
    }
    return false;
  }

  // function that returns a matrix of the dates. Each item in the matrix is an object.
  const generateMatrix = () => {
    let matrix = [];
    // Create header
    matrix[0] = []; // initialise the first row
    let year = calDate.getFullYear(); // a number
    let month = calDate.getMonth(); // a number
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
    if (month == 1) { // February. Counts from 0
      if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) {
        maxDays += 1;
      }
    }
  
    // day starts from 1
    let counter = 1;
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
            row: row,
            col: col,
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
            row: row,
            col: col,
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

  const updateMatrix = (matrix, arr) => {
    arr.forEach(x => {
      if (x === undefined) {
        // do nothing
      } else {
        if (matrix[x.row][x.col].month === x.month) {
          matrix[x.row][x.col].isBooked = true;
        }
      }
    })
  }

  let matrix = generateMatrix();
  updateMatrix(matrix, booked);
  const rows = matrix.map((row, rowIndex) => {
    let rowItems = row.map((item, colIndex) => {
      return (
        <Text
          style={{
            flex: 1,
            height: 25,
            textAlign: 'center',
            // Highlight header
            backgroundColor: bgColourPicker(rowIndex, item),
            // Highlight Sundays
            color: fontColourPicker(item, rowIndex, colIndex),
            // Highlight current date
            // fontWeight: item.value === calDate.getDate() 
            //                     ? 'bold': 'normal',
            fontSize: 18,
          }}
          onPress={() => pressCalendar(item)}
          >
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


  const pressCalendar = (item) => {
    if (item.isBooked) {
      Alert.alert("Fully booked", "Please choose another date");
    } else if (item.year === todayDate.getFullYear() && item.month === todayDate.getMonth()) {
      // if it's the same year and the selected month is this month
      if (item.value <= todayDate.getDate()) {
        // if the selected date is lesser than the current date, then cannot book
        Alert.alert("Invalid date", "Only able to book appointments from tomorrow onwards")
      } 
      else {
        setChosen(item.value);
        const year = calDate.getFullYear();
        const month = calDate.getMonth()+1;
        const day = item.value;
        setApptDate(day + "-" + month + "-" + year);
        setItem(item);
        // console.log(item);
      }
    } else if (item.isWeekend) {
      Alert.alert("Unavailable", "Sorry, unable to book on weekends") 
    } else {
      // valid, so we'll need to retrieve the date then black it out..
      setChosen(item.value);
      const year = calDate.getFullYear();
      const month = calDate.getMonth()+1;
      const day = item.value;
      setApptDate(day + "-" + month + "-" + year);
      setItem(item);
      // console.log(item);
    }
  }

      // changes the month on screen
  const changeMonth = (n) => {
    setChosen(0); // to reset the chosen date
    const curr = n > 0 ? dateFn.addMonths(calDate, Math.abs(n)) : dateFn.subMonths(calDate, Math.abs(n));
    if (curr <= dateToCompare) {
      Alert.alert("Invalid","Unable to book an appointment before today.")
    } else if (curr > dateFn.addMonths(dateToCompare, 6)) {
      Alert.alert("Unavailable","Unable to book too far in the future")
    } else {
      return setCalDate(curr);
    }
  }

  const _renderCalendar = (height, width) => {
    return (
      <SafeAreaView style={{marginTop: 25, height: height, width: width}}>
        <SafeAreaView style={{flexDirection: 'row'}}>
        <Button title="Previous"
          style={{flexDirection:'left'}}
          onPress={() => changeMonth(-1)}/>
          <Text style={{
            fontWeight: 'bold',
            fontSize: 30,
            textAlign: 'center',
            }}>
            {months[calDate.getMonth()]} &nbsp;
            {calDate.getFullYear()}   
          </Text>    
        <Button title="Next"
          style={{flexDirection:'right'}}
          onPress={() => changeMonth(1)}/>
        </SafeAreaView>
          { rows }    
      </SafeAreaView>
    );
  }


  // <------------------------------------ Modal stuff ------------------------------------->
  // Note, the calendar is used within Modal
  const [modalVisible, setModalVisible] = useState(false);
  const modal = () => {
    return (
      <View style={styles.timeContainer}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
      >
        <View>
          <View style={styles.modalView}>
            <Text style={{fontSize: 30, fontWeight: 'bold', textDecorationLine: 'underline'}}>Pick an appointment date</Text>
            {_renderCalendar("80%", "100%")}
            <TouchableOpacity
              style={{position: 'absolute', bottom: 0, margin: 20}}
              onPress={() => {setModalVisible(!modalVisible)}}
            >
              <Text style={styles.confirm}>Select</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <Text style={styles.text}>Select Dates</Text>
      </TouchableOpacity>
    </View>
    )
  }


  // <------------------------------------ DateTimePicker stuff ------------------------------------->
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [hours, setHours] = useState(12);
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
    // getting time and formatting it to the correct string
    let curr_hr = selectedDate.getHours() < 12 ? selectedDate.getHours() : selectedDate.getHours() - 12;
    const curr_min = selectedDate.getMinutes() < 10 ? "0" + selectedDate.getMinutes() : selectedDate.getMinutes();
    const AM_PM = selectedDate.getHours() > 12 ? " PM" : " AM";
    if (curr_hr === 0) {
      curr_hr = 12;
    }
    setHours(selectedDate.getHours());
    const curr_time = curr_hr + ":" + curr_min + AM_PM;
    setTime(curr_time);
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showTimepicker = () => {
    showMode('time');
  };

  const handleConfirm = (apptDate, time, item) => {
    if (time === 'Please choose a time' || apptDate === 'Please choose a date') {
      Alert.alert("Invalid date or time", "Please select both");
    } else if (hours < 8 || hours >= 20) {
      Alert.alert("Off operating hours", "Please choose a time between 8am and 8pm");
    }
    else {
      Alert.alert('Request sent',
          `Requested for an appointment on ${apptDate}, at ${time}`);
      setBooked(booked => [...booked, {row: item.row, col: item.col, month: item.month}])
      setApptDate('Please choose a date');
      setTime('Please choose a time');
      setChosen('');
    }
  }


  return (
    <View style={styles.container}>
      <View style={{flexDirection: 'row'}}>
          {modal()}
        <View style={styles.timeContainer}>
          <TouchableOpacity onPress={showTimepicker}>
            <Text style={styles.text}> Select Time </Text>
          </TouchableOpacity>
        </View>
        <View>
          {show && (
            <DateTimePicker
              testID="dateTimePicker"
              value={date}
              mode={mode}
              is24Hour={false}
              display="default"
              onChange={onChange}
            />
          ) /* Can just ignore this entire thing. It's simply used to help open up the time picker*/}
        </View>
      </View>
      <View style={{position: 'absolute', top: 80}}>
        <Text style={styles.apptTextHeader}>Current Appointment Details</Text>
        <View style={styles.apptDateTime}>
          <Text style={styles.apptText}>Date: {apptDate}</Text>
          <Text style={styles.apptText}>Time: {time}</Text>
        </View>
      </View>
      <View style={{position: 'absolute', bottom: 100}}>
        <TouchableOpacity style={{borderRadius: 20, borderWidth: 2, width: 150, borderColor: 'grey', backgroundColor: 'pink'}} onPress={() => {
          // then, also need to change that date to be occupied.
          handleConfirm(apptDate, time, item);
        }}>
          <Text style={styles.confirm}>Confirm</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  apptDateTime: {
    marginTop: 25,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  timeContainer: { 
    borderWidth: 2, 
    borderColor: 'black', 
    borderRadius: 20, 
    backgroundColor: '#99EDC3', 
    height: 40, 
    width: 180, 
    alignItems: 'center', 
    justifyContent: 'center',
    marginLeft: 15,
    marginRight: 15,
  },
  confirm: {
    textAlign: 'center',
    color: 'red', 
    fontSize: 25
  },

  text: {
    fontSize: 14,
    color: '#4169e1',
    fontWeight: 'bold'
  },

  apptText: {
    fontSize: 20,
    color:'black',
    fontWeight: 'bold'
  },

  apptTextHeader: {
    fontSize: 20,
    color:'black',
    fontWeight: 'bold',
    textDecorationLine: 'underline'
  },

  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    height: '90%',
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  }
});

export default App;