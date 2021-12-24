import React, { useState, useEffect } from "react";
import {
  Alert,
  TextInput,
  SafeAreaView,
  Text,
  StyleSheet,
  BackHandler,
  Modal,
  View,
  TouchableOpacity,
  Image,
  ImageBackground,
} from "react-native";

// Import from Firebase to utilise cloud functions
import { sendMail } from "../../firebase"; // sendMail is of the form sendMail(msg, dest)

import AsyncStorage from "@react-native-async-storage/async-storage";
import { Button } from "react-native-elements";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as dateFn from "date-fns";

// function to check char is indeed a character
function isCharacterALetter(char) {
  return /[a-zA-Z]/.test(char);
}

// dates stuff
const todayDate = new Date();
const dateToCompare = new Date(
  todayDate.getFullYear(),
  todayDate.getMonth(),
  1
);
// the icons. for L and R arrows
const icons = require("../../icons/icons.js");

// AsyncStorage keys. One for name, student number and email.
// AsyncStorage stores on local storage (their phones). So there should be no issues with this.
const DETAILS = "@user_details";
const BOOKED_DATES = "@booked_dates";
// easy referencing
const NAME = 0;
const NUM = 1;
const EMAIL = 2;
// We also need to disable the hardware back press to discourage users from backing out.
const FormDetails = ({ navigation, route }) => {
  // // <------------------------------------ Calendar stuff ------------------------------------->
  const { K_SCORE } = route.params;
  const [apptDate, setApptDate] = useState("Please choose a date");
  const [item, setItem] = useState("");
  const [calDate, setCalDate] = useState(new Date());
  const [chosen, setChosen] = useState("Please choose a date");
  const [booked, setBooked] = useState([]); // used after confirming

  // for styling
  const fontColourPicker = (item, rowIndex, colIndex) => {
    return rowIndex === 0
      ? colIndex === 0
        ? "red"
        : "black"
      : item.isWeekend || datePassed(item)
      ? "#BCBCBC"
      : "black";
  };

  const bgColourPicker = (rowIndex, item) => {
    return rowIndex === 0
      ? "#ddd"
      : item.value === chosen
      ? "#90EE90"
      : item.isBooked
      ? "red"
      : "#fff";
  };

  // the days in each month
  const nDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  // the months
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
  // the days in a week
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Logic to determine passed dates. Includes the current day.
  const datePassed = (item) => {
    if (
      item.year === todayDate.getFullYear() &&
      item.month === todayDate.getMonth() &&
      item.value <= todayDate.getDate()
    ) {
      return true;
    }
    return false;
  };

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
        isBooked: "impossible",
        isWeekend: false,
      };
    }

    // first day of the month
    let firstDay = new Date(year, month, 1).getDay();
    let maxDays = nDays[month]; // max number of days for month, pre-defined
    if (month == 1) {
      // February. Counts from 0
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
          isBooked: false,
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
            isWeekend: col === 6 || col === 0 ? true : false,
          };
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
            isWeekend: col === 6 || col === 0 ? true : false,
          };
        }
      }
    }
    return matrix;
  };

  // To update the matrix to show that a booking has been made. Will require use of AsyncStorage to store these dates.
  const updateMatrix = (matrix, arr) => {
    arr.forEach((x) => {
      if (x === undefined) {
        // do nothing
      } else {
        if (matrix[x.row][x.col].month === x.month) {
          matrix[x.row][x.col].isBooked = true;
        }
      }
    });
  };

  let matrix = generateMatrix();
  updateMatrix(matrix, booked);
  const rows = matrix.map((row, rowIndex) => {
    let rowItems = row.map((item, colIndex) => {
      return (
        <Text
          style={{
            flex: 1,
            height: 25,
            textAlign: "center",
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
          {item.value != -1 ? item.value : ""}
        </Text>
      );
    });
    return (
      <View
        style={{
          flex: 1,
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

  // Logic for when a day is pressed on the calendar
  const pressCalendar = (item) => {
    if (item.isBooked) {
      Alert.alert("Fully booked", "Please choose another date");
    } else if (
      item.year === todayDate.getFullYear() &&
      item.month === todayDate.getMonth()
    ) {
      // if it's the same year and the selected month is this month
      if (item.value <= todayDate.getDate()) {
        // if the selected date is lesser than the current date, then cannot book
        Alert.alert(
          "Invalid date",
          "Only able to book appointments from tomorrow onwards"
        );
      } else {
        if (item.isWeekend) {
          Alert.alert("Unavailable", "Sorry, unable to book on weekends");
          return;
        }
        setChosen(item.value);
        const year = calDate.getFullYear();
        const month = calDate.getMonth() + 1;
        const day = item.value;
        setApptDate(day + "-" + month + "-" + year);
        setItem(item);
        // console.log(item);
      }
    } else if (item.isWeekend) {
      Alert.alert("Unavailable", "Sorry, unable to book on weekends");
    } else {
      // valid, so we'll need to retrieve the date then black it out..
      setChosen(item.value);
      const year = calDate.getFullYear();
      const month = calDate.getMonth() + 1;
      const day = item.value;
      setApptDate(day + "-" + month + "-" + year);
      setItem(item);
      // console.log(item);
    }
  };

  // changes the month on screen
  const changeMonth = (n) => {
    setChosen(0); // to reset the chosen date
    const curr =
      n > 0
        ? dateFn.addMonths(calDate, Math.abs(n))
        : dateFn.subMonths(calDate, Math.abs(n));
    if (curr <= dateToCompare) {
      Alert.alert("Invalid", "Unable to book an appointment before today.");
    } else if (curr > dateFn.addMonths(dateToCompare, 6)) {
      Alert.alert("Unavailable", "Unable to book too far in the future");
    } else {
      return setCalDate(curr);
    }
  };

  // To render the entire calendar
  const _renderCalendar = (height, width) => {
    return (
      <SafeAreaView style={{ bottom: 10, height: height, width: width }}>
        <SafeAreaView
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
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
            {months[calDate.getMonth()]} &nbsp;
            {calDate.getFullYear()}
          </Text>
          <TouchableOpacity onPress={() => changeMonth(1)}>
            <Image style={styles.arrowImage} source={icons["arrow_R"]} />
          </TouchableOpacity>
        </SafeAreaView>
        {rows}
      </SafeAreaView>
    );
  };

  // <------------------------------------ Modal stuff ------------------------------------->
  // Note, the calendar is used within Modal
  const [modalVisible, setModalVisible] = useState(false);
  // Modal allows for the booking calendar to popup.
  // Calendar is used in Modal, to show the calendar for the booking system
  const modal = () => {
    return (
      <View style={styles.touchableContainer}>
        <Modal animationType="fade" transparent={true} visible={modalVisible}>
          <View>
            <View style={styles.modalView}>
              {_renderCalendar("95%", "120%")}
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(!modalVisible);
                  showTimePicker();
                }}
              >
                <Text style={styles.confirm}>Select</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Text
            style={{
              fontSize: 16,
              fontFamily: "Itim",
              color:
                apptDate === "Please choose a date" ||
                time === "Please choose a time"
                  ? "grey"
                  : "black",
            }}
          >
            {apptDate === "Please choose a date" ||
            time === "Please choose a time"
              ? "Book your appointment"
              : apptDate + " at " + time}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  // <------------------------------------ DateTimePicker stuff ------------------------------------->
  const [time, setTime] = useState("Please choose a time");
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);
  const [hours, setHours] = useState(12);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === "ios");
    setDate(currentDate);
    // getting time and formatting it to the correct string
    let curr_hr =
      selectedDate.getHours() < 12
        ? selectedDate.getHours()
        : selectedDate.getHours() - 12;
    const curr_min =
      selectedDate.getMinutes() < 10
        ? "0" + selectedDate.getMinutes()
        : selectedDate.getMinutes();
    const AM_PM = selectedDate.getHours() >= 12 ? " PM" : " AM";
    if (curr_hr === 0) {
      curr_hr = 12;
    }
    setHours(selectedDate.getHours());
    const curr_time = curr_hr + ":" + curr_min + AM_PM;
    setTime(curr_time);
  };

  // Changes the mode of showing -- not really used
  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  // Opens up the time picker
  const showTimePicker = () => {
    showMode("time");
  };

  // Confirming the thing to be picked
  const handlePickerConfirm = (apptDate, time, item) => {
    if (
      time === "Please choose a time" ||
      apptDate === "Please choose a date"
    ) {
      Alert.alert("Invalid date or time", "Please select both");
    } else if (hours < 8 || hours >= 20) {
      Alert.alert(
        "Off operating hours",
        "Please choose a time between 8am and 8pm"
      );
    } else {
      setBooked((booked) => [
        ...booked,
        { row: item.row, col: item.col, month: item.month },
      ]);
      setApptDate("Please choose a date");
      setTime("Please choose a time");
      setChosen("");
      return true;
    }
    return false;
  };

  const [details, setDetails] = useState([
    "", // NAME
    "", // NUM
    "", // EMAIL
  ]);

  /* AsyncStorage stuff now */
  const saveDetails = async () => {
    try {
      await AsyncStorage.setItem(DETAILS, JSON.stringify(details));
    } catch (e) {
      // error handling
      console.log(e);
    }
  };

  const readDetails = async () => {
    try {
      const read = await AsyncStorage.getItem(DETAILS);
      if (read !== null) {
        setDetails(JSON.parse(read));
      }
    } catch (e) {
      // error handling
      console.log(e);
    }
  };

  // to save the booking details
  const saveBookings = async () => {
    try {
      await AsyncStorage.setItem(BOOKED_DATES, JSON.stringify(booked));
    } catch (e) {
      console.log(e);
    }
  };

  // retrieving the bookings from local storage
  const readBookings = async () => {
    try {
      const read = await AsyncStorage.getItem(BOOKED_DATES);
      if (read !== null) {
        setBooked(JSON.parse(read));
      }
    } catch (e) {
      console.log(e);
    }
  };

  // Clearing the AsyncStorage. Will be useful for next time when we have to use ONE key to manage an ARRAY OF OBJECTS
  const clearDetails = async () => {
    try {
      await AsyncStorage.removeItem(DETAILS); // removes DETAILS key from storage
      alert("Storage cleared successfully");
    } catch (e) {
      alert("Failed to clear local storage");
    }
  };

  const clearBookings = async () => {
    try {
      await AsyncStorage.removeItem(BOOKED_DATES);
      alert("Cleared all bookings successfully");
    } catch (e) {
      alert("Failed to clear bookings");
    }
  };

  /* End AsyncStorage stuff*/

  /* Updates stuff */
  // Need to copy the array, then value of array to be that new array. Otherwise, won't work.
  const updateArray = (index, text) => {
    let newArr = [...details]; // First, copy the array
    newArr[index] = text; // Set the correct field to the new text value
    setDetails(newArr);
  };

  // Disable hardware back press.
  // Probably need to check if this causes any issues on iOS
  useEffect(() => {
    readDetails();
    readBookings();
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => true
    );
    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    saveDetails();
    saveBookings();
  }, [details, booked]);

  // Function that checks if the email given is a valid NUS net email.
  const checkMail = () => {
    let split_string = details[2].split("@");
    let nusnet = split_string[0];
    let back = split_string[1];
    if (nusnet.charAt(0) === "e" || nusnet.charAt(0) === "E") {
      return nusnet.length === 8 ? back === "u.nus.edu" : false;
    }

    return false;
  };

  // Custom alert function
  const customAlert = (title, msg, accept, decline) => {
    Alert.alert(title, msg, [
      {
        text: "Back",
        onPress: decline,
        style: "cancel",
      },
      {
        text: "I do not want help",
        onPress: accept,
        style: "default",
      },
    ]);
  };

  // Contains all the functions necessary to handle submit
  // These are:
  // 1) Check if name is empty
  // 2) Check if student number is the correct format
  // 3) Check if email is the correct format
  // These can be easily checked next time if it were to be integrated into NUS internal server. We can simply filter and match students' provided details
  // with whatever is already in the database, and make sure all 3 of them match.
  // Furthermore, takes an argument, action, which should do:
  // 1) Send an email
  // 2) Navigate to home screen (dashboard)
  const handleSubmit = (action) => {
    const name = details[NAME];
    const stud_num = details[NUM];
    const email = details[EMAIL];
    // Student number is only 9 characters long
    const checkStudentNumber = () => {
      if (stud_num.length !== 9) {
        return false;
      }
      let start = stud_num.charAt(0);
      let end = stud_num.charAt(8);
      if (start !== "A") {
        return false;
      }

      if (!isCharacterALetter(end)) {
        return false;
      }

      let rem = details[1].substring(1, 8); // get 2nd letter to 8th letter.

      return !Number.isNaN(Number(rem));
    };

    const checkName = () => {
      return !(details[0] === "");
    };

    let isMailOK = checkMail();
    let isNumberOK = checkStudentNumber();
    let isNameOK = checkName();

    if (isMailOK && isNumberOK && isNameOK) {
      if (handlePickerConfirm(apptDate, time, item)) {
        Alert.alert(
          "Request sent",
          `Requested for an appointment on ${apptDate}, at ${time}`,
          [
            {
              text: "OK",
              onPress: () => {
                sendMail(
                  `\nName of student: ${name}, K-10 score: ${K_SCORE}\n
                  Student number: ${stud_num}\n
                  Email: ${email}
                  \nhas requested for an appointment on ${apptDate} at ${time}`,
                  "98lawweijie@gmail.com"
                );
                action();
              },
            },
          ]
        );
      }
    } else if (!isMailOK) {
      Alert.alert("Wrong format", "Check your email");
      return;
    } else if (!isNumberOK) {
      Alert.alert("Wrong format", "Please check your student number");
      return;
    } else if (!isNameOK) {
      Alert.alert("Empty name", "Please fill in your name");
      return;
    }
  };

  const declineHandler = (submit) => {
    Alert.alert(
      "Declined", // title
      "We still strongly recommend you to seek help. Meanwhile, here's a list of resources you can use", // message
      submit // on accept
    );
  };

  // Need to decide whether cancel button should exist or not. Will have to pass navigation into this so we can navigate to next step
  const handleCancel = (screenToNavigateTo) => {
    customAlert(
      "Are you sure?",
      "It is strongly recommended to visit UCS for help",
      screenToNavigateTo,
      ""
    );
  };

  const renderSelections = () => {
    return (
      <SafeAreaView
        style={{ flex: 1, alignItems: "center", position: "absolute" }}
      >
        <TextInput
          value={details[NAME] === "" ? "" : details[NAME]}
          onChangeText={(text) => updateArray(NAME, text)}
          placeholder="Name"
          placeholderTextColor="grey"
          style={styles.inputContainer}
        />
        <TextInput
          value={details[NAME] === "" ? "" : details[NUM]}
          onChangeText={(text) => updateArray(NUM, text)}
          placeholder="Student Number"
          placeholderTextColor="grey"
          style={styles.inputContainer}
        />
        <TextInput
          value={details[NAME] === "" ? "" : details[EMAIL]}
          onChangeText={(text) => updateArray(EMAIL, text)}
          placeholder="NUSNET email"
          placeholderTextColor="grey"
          style={styles.inputContainer}
        />
        {modal()}
      </SafeAreaView>
    );
  };

  const renderButtons = () => {
    return (
      <SafeAreaView style={{ marginBottom: 20, flexDirection: "row" }}>
        <SafeAreaView style={{ marginRight: 50, width: "25%" }}>
          <Button
            title="Cancel"
            onPress={() =>
              handleCancel(() =>
                declineHandler(navigation.navigate("Resources"))
              )
            }
          />
        </SafeAreaView>
        <SafeAreaView style={{ marginLeft: 50, width: "25%" }}>
          <Button
            title="Submit"
            onPress={() =>
              handleSubmit(() => {
                // Will actually need to implement email sender.
                // Firebase Cloud + Gmail + Nodemailer should be sufficient, but need to find out how to do it.
                // email sending
                // return back to dashboard
                navigation.navigate("Mood");
              })
            }
          />
        </SafeAreaView>
      </SafeAreaView>
    );
  };

  // Rendering the rest of the things
  return (
    <ImageBackground
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
      source={icons["BG_pic"]}
    >
      <SafeAreaView style={{ flex: 0.4, top: 70 }}>
        <Text style={styles.apptTextHeader}>Appointment Form</Text>
      </SafeAreaView>
      <SafeAreaView
        style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
      >
        {renderSelections()}
      </SafeAreaView>
      {renderButtons()}
      <View>
        {
          show && (
            <DateTimePicker
              testID="dateTimePicker"
              value={date}
              mode={mode}
              is24Hour={false}
              display="default"
              onChange={onChange}
            />
          ) /* Can just ignore this entire thing. It's simply used to help open up the time picker*/
        }
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  arrowImage: {
    marginTop: 2.5,
    height: 25,
    width: 50,
  },

  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "black",
  },

  inputContainer: {
    fontFamily: "Itim",
    fontSize: 18,
    borderWidth: 2,
    color: "black",
    borderColor: "grey",
    borderRadius: 10,
    backgroundColor: "white",
    marginBottom: 20,
    paddingLeft: 20,
    height: 50,
    width: 280,
    textAlign: "left",
    alignItems: "center",
    justifyContent: "center",
  },

  touchableContainer: {
    fontFamily: "Itim",
    fontSize: 18,
    borderWidth: 2,
    color: "black",
    borderColor: "grey",
    borderRadius: 10,
    backgroundColor: "white",
    marginBottom: 20,
    paddingLeft: 20,
    height: 50,
    width: 280,
    textAlign: "left",
    justifyContent: "center",
  },

  apptDateTime: {
    alignItems: "center",
    marginTop: 25,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },

  confirm: {
    textAlign: "center",
    fontFamily: "Itim",
    color: "#e09000",
    fontSize: 30,
  },

  text: {
    fontSize: 16,
    fontFamily: "Itim",
    color: "grey",
  },

  apptTextHeader: {
    fontSize: 34,
    fontFamily: "Itim",
    color: "black",
    textDecorationLine: "underline",
  },

  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    height: "90%",
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },

  textStyle: {
    color: "white",
    fontFamily: "Itim",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    fontFamily: "Itim",
    textAlign: "center",
  },
});

export default FormDetails;
