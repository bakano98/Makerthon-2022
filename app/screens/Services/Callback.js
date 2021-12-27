import React, { useState } from "react";
import {
  SafeAreaView,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
} from "react-native";
import { CheckBox } from "react-native-elements";
import { sendToPFA } from "../../firebase"; // sendMail is of the form sendToPFA(msg)
import * as dateFn from "date-fns";

const nowTime = dateFn.getHours(new Date());

const daySelectedString = [
  "Today",
  "1-3 days from now",
  "3-5 days from now",
  "5-7 days from now",
];
const timeSelectedString = [
  "9am - 10am",
  "10am - 11am",
  "11am - 12pm",
  "12pm - 1pm",
  "1pm - 2pm",
  "2pm - 3pm",
  "3pm - 4pm",
  "4pm - 5pm",
];
const Callback = ({ navigation }) => {
  // hook for phone number
  const [number, setNumber] = useState("");

  // hooks for CheckBox
  const [dayCheck1, setDayCheck1] = useState(false);
  const [dayCheck2, setDayCheck2] = useState(false);
  const [dayCheck3, setDayCheck3] = useState(false);
  const [dayCheck4, setDayCheck4] = useState(false);

  // Based off operating hours of UHC
  const [timeCheck1, setTimeCheck1] = useState(false);
  const [timeCheck2, setTimeCheck2] = useState(false);
  const [timeCheck3, setTimeCheck3] = useState(false);
  const [timeCheck4, setTimeCheck4] = useState(false);
  const [timeCheck5, setTimeCheck5] = useState(false);
  const [timeCheck6, setTimeCheck6] = useState(false);
  const [timeCheck7, setTimeCheck7] = useState(false);
  const [timeCheck8, setTimeCheck8] = useState(false);

  // Use these so we can loop thru easily and check their states
  const daySelected = [dayCheck1, dayCheck2, dayCheck3, dayCheck4];
  const timeSelected = [
    timeCheck1,
    timeCheck2,
    timeCheck3,
    timeCheck4,
    timeCheck5,
    timeCheck6,
    timeCheck7,
    timeCheck8,
  ];

  const changeOption = (option) => {
    if (nowTime >= 16 && option === 1) {
      Alert.alert("Sorry", "Earliest call you can schedule is from tomorrow");
      return;
    }
    switch (option) {
      case 1:
        setDayCheck1(true);
        setDayCheck2(false);
        setDayCheck3(false);
        setDayCheck4(false);
        break;
      case 2:
        setDayCheck1(false);
        setDayCheck2(true);
        setDayCheck3(false);
        setDayCheck4(false);
        break;
      case 3:
        setDayCheck1(false);
        setDayCheck2(false);
        setDayCheck3(true);
        setDayCheck4(false);
        break;
      case 4:
        setDayCheck1(false);
        setDayCheck2(false);
        setDayCheck3(false);
        setDayCheck4(true);
        break;
      default:
        break;
    }
  };

  let msg = "User would prefer: ";

  const handleSubmit = () => {
    const numberChecker = Number.isNaN(Number(number));
    if (numberChecker || number.length < 8) {
      Alert.alert("Error", "Please check your number");
      return;
    }

    let selectedAny = 0;
    // getting the string message after checking validity of number
    for (let i = 0; i < 4; i++) {
      if (daySelected[i]) {
        msg += daySelectedString[i];
        selectedAny++;
      }
    }

    if (selectedAny === 0) {
      Alert.alert("Sorry", "Please choose a range of dates");
      return;
    }

    msg += "\nAt the following times: ";

    let selectedTime = 0;
    for (let i = 0; i < 8; i++) {
      if (timeSelected[i]) {
        msg = msg + "\n" + timeSelectedString[i];
        selectedTime++;
      }
    }

    if (selectedTime === 0) {
      Alert.alert("Sorry", "Please choose at least one timeframe");
      return;
    }

    msg += `\nwith phone number: ${number}`;
    // then submit it
    sendToPFA(msg);
    Alert.alert(
      "Notice",
      "You will receive a confirmation shortly via SMS. Meanwhile, feel free to make use of the following resources!"
    );
    navigation.navigate("Resources");
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#fde086" }}>
      <SafeAreaView
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "space-around",
          marginTop: 60,
        }}
      >
        <Text style={styles.text}>Please provide us with a number</Text>
        <TextInput
          onChangeText={(text) => setNumber(text)}
          value={number}
          placeholder={"e.g. 65653535"}
          placeholderTextColor="grey"
          style={styles.inputContainer}
        />
        <Text style={styles.text}>
          When would you like for a PFA to call you back?
        </Text>
        <SafeAreaView style={styles.pickerView}>
          <CheckBox
            center
            title="Today"
            checked={dayCheck1}
            containerStyle={styles.boxStyle}
            checkedIcon="dot-circle-o"
            uncheckedIcon="circle-o"
            onPress={() => changeOption(1)}
          />
          <CheckBox
            center
            title="1-3 days from now"
            checked={dayCheck2}
            containerStyle={styles.boxStyle}
            checkedIcon="dot-circle-o"
            uncheckedIcon="circle-o"
            onPress={() => changeOption(2)}
          />
          <CheckBox
            center
            title="3-5 days from now"
            checked={dayCheck3}
            containerStyle={styles.boxStyle}
            checkedIcon="dot-circle-o"
            uncheckedIcon="circle-o"
            onPress={() => changeOption(3)}
          />
          <CheckBox
            center
            title="5-7 days from now"
            checked={dayCheck4}
            containerStyle={styles.boxStyle}
            checkedIcon="dot-circle-o"
            uncheckedIcon="circle-o"
            onPress={() => changeOption(4)}
          />
        </SafeAreaView>
        <Text style={[styles.text, { marginTop: 20 }]}>
          Please provide one of the more following times:
        </Text>
        <SafeAreaView
          style={{ flexDirection: "row", justifyContent: "space-between" }}
        >
          <SafeAreaView style={[styles.timePickerView, { left: 70 }]}>
            <CheckBox
              center
              title="9am - 10am"
              checked={timeCheck1}
              containerStyle={styles.boxStyle}
              onPress={() => {
                if (dayCheck1 && nowTime >= 9) {
                  Alert.alert("Sorry", "Please pick another time");
                  return;
                }
                setTimeCheck1(!timeCheck1);
              }}
            />
            <CheckBox
              center
              title="10am - 11am"
              checked={timeCheck2}
              containerStyle={styles.boxStyle}
              onPress={() => {
                if (dayCheck1 && nowTime >= 10) {
                  Alert.alert("Sorry", "Please pick another time");
                  return;
                }
                setTimeCheck2(!timeCheck2);
              }}
            />
            <CheckBox
              center
              title="11am - 12pm"
              checked={timeCheck3}
              containerStyle={styles.boxStyle}
              onPress={() => {
                if (dayCheck1 && nowTime >= 11) {
                  Alert.alert("Sorry", "Please pick another time");
                  return;
                }
                setTimeCheck3(!timeCheck3);
              }}
            />

            <CheckBox
              center
              title="12pm - 1pm"
              checked={timeCheck4}
              containerStyle={styles.boxStyle}
              onPress={() => {
                if (dayCheck1 && nowTime >= 12) {
                  Alert.alert("Sorry", "Please pick another time");
                  return;
                }
                setTimeCheck4(!timeCheck4);
              }}
            />
          </SafeAreaView>
          <SafeAreaView style={[styles.timePickerView, { right: 70 }]}>
            <CheckBox
              center
              title="1pm - 2pm"
              checked={timeCheck5}
              containerStyle={styles.boxStyle}
              onPress={() => {
                if (dayCheck1 && nowTime >= 13) {
                  Alert.alert("Sorry", "Please pick another time");
                  return;
                }
                setTimeCheck5(!timeCheck5);
              }}
            />
            <CheckBox
              center
              title="2pm - 3pm"
              checked={timeCheck6}
              containerStyle={styles.boxStyle}
              onPress={() => {
                if (dayCheck1 && nowTime >= 14) {
                  Alert.alert("Sorry", "Please pick another time");
                  return;
                }
                setTimeCheck6(!timeCheck6);
              }}
            />
            <CheckBox
              center
              title="3pm - 4pm"
              checked={timeCheck7}
              containerStyle={styles.boxStyle}
              onPress={() => {
                if (dayCheck1 && nowTime >= 15) {
                  Alert.alert("Sorry", "Please pick another time");
                  return;
                }
                setTimeCheck7(!timeCheck7);
              }}
            />
            <CheckBox
              center
              title="4pm - 5pm"
              checked={timeCheck8}
              containerStyle={styles.boxStyle}
              onPress={() => {
                if (dayCheck1 && nowTime >= 16) {
                  Alert.alert("Sorry", "Please pick another time");
                  return;
                }
                setTimeCheck8(!timeCheck8);
              }}
            />
          </SafeAreaView>
        </SafeAreaView>
        <SafeAreaView style={styles.bottomTouchableContainer}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={[styles.bottomTouchableLeft, styles.touchableContainer]}
          >
            <Text style={styles.touchableContainerText}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleSubmit()}
            style={[styles.bottomTouchableRight, styles.touchableContainer]}
          >
            <Text style={styles.touchableContainerText}>Submit</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </SafeAreaView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fde086",
    alignItems: "center",
    justifyContent: "center",
  },
  bottomTouchableContainer: {
    flexDirection: "row",
    margin: 30,
  },

  touchableContainer: {
    borderWidth: 2,
    color: "black",
    borderColor: "grey",
    borderRadius: 10,
    backgroundColor: "white",
    height: 50,
    width: 120,
    alignItems: "center",
    justifyContent: "center",
  },

  touchableContainerText: {
    fontFamily: "Itim",
    fontSize: 18,
  },

  bottomTouchableLeft: {
    right: 40,
  },

  bottomTouchableRight: {
    left: 40,
  },

  pickerView: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },

  timePickerView: {
    width: "85%",
    alignItems: "center",
    justifyContent: "center",
  },

  boxStyle: {
    width: "50%",
    backgroundColor: "#FBF8D6",
    alignItems: "flex-start",
    justifyContent: "center",
    paddingLeft: 20,
  },

  boxText: {
    fontFamily: "Itim",
    textAlign: "left",
  },

  text: {
    fontFamily: "Itim",
    color: "black",
    fontSize: 18,
  },

  inputContainer: {
    fontFamily: "Itim",
    fontSize: 16,
    borderWidth: 2,
    color: "black",
    borderColor: "grey",
    borderRadius: 10,
    backgroundColor: "white",
    marginBottom: 20,
    paddingLeft: 20,
    height: 50,
    width: 200,
    textAlign: "left",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Callback;
