// Component that allows users to select a time for their daily notifications.
// Need to add an option to turn off notifications

import React, { useState, useEffect } from 'react';
import { Modal, TouchableOpacity, StyleSheet, Text, View, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Calendar } from './Custom';

// Use modal with our custom calendar. For our purpose, we have to:
// 1) Block out dates that have been booked
// As a mockup, we'll do it as such: block out the entire date if it has been booked. Then we'll have to explain
// 2) Block out weekends
// Should be trivial -- simply need to check if COL === SAT/SUN, then check if date has been booked.
// Lastly, when 

// Need AsyncStorage to store dates that have been picked.
const App = () =>  {
  // Define your time with hooks. We use this as the default time. This is a string used to display time only.
  const [time, setTime] = useState("12:34 PM");
  const [apptDate, setApptDate] = useState('NONE');
  const [item, setItem] = useState('');

  const getChosenDateFromCalendar = (chosenDate) => {
    setApptDate(chosenDate); // callback function. Works properly, but not optimal. May want to refactor after everything is done.
  }
  
  const getItem = (item) => {
    setItem(item);
    console.log(item);
  }

  // Modal
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
            <Calendar 
              width="100%" 
              height="40%" 
              getDate={getChosenDateFromCalendar}
              getItem={getItem} /* callback function. Will probably need to be refactored next time */
            /> 
            <TouchableOpacity
              style={{position: 'absolute', bottom: 0, margin: 100}}
              onPress={() => setModalVisible(!modalVisible)}
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



  const split_time = time.split(':'); // split by ':', because the hour and minute are separated that way
  const AM_PM = split_time[1].split(" ")[1];
  const hrs = Number(split_time[0]);
  const mins = Number(split_time[1].split(" ")[0]);
  // remove comment if you want to do some debugging
  // console.log(date);
  return (
    <View style={styles.container}>
      <View style={{flexDirection: 'row'}}>
          {modal()}
        <View style={styles.timeContainer}>
          <TouchableOpacity onPress={showTimepicker}>
            <Text style={styles.text}> Choose Time </Text>
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
      <View style={{position: 'absolute', top: 100}}>
        <Text style={styles.apptText}>Current Appointment Details</Text>
        <Text style={styles.apptText}>Date: {apptDate}</Text>
        <Text style={styles.apptText}>Time: {time}</Text>
      </View>
      <View style={{position: 'absolute', bottom: 100}}>
        <TouchableOpacity onPress={() => {Alert.alert('Request sent',
          `Requested for an appointment on ${apptDate}, at ${time}`);
          // then, also need to change that date to be occupied.
          handleConfirm(item);
        }}>
          <Text style={styles.confirm}>Confirm</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
    width: 220, 
    alignItems: 'center', 
    justifyContent: 'center',
    marginLeft: 15,
    marginRight: 15,
  },
  confirm: {
    color: 'red', 
    fontSize: 25
  },

  text: {
    fontSize: 14,
    color: '#4169e1',
    fontWeight: 'bold'
  },

  apptText: {
    fontSize: 24,
    color:'black',
    fontWeight: 'bold'
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