import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  SafeAreaView,
  Alert,
  TouchableOpacity,
  ImageBackground,
  Modal,
  TextInput,
} from "react-native";

// local imports
import { SetNotifications } from "../../CustomComponents";

// importing cloud functions
import { sendFeedback } from "../../firebase"; // sendFeedback(msg)
/*
- Send feedback links to an email. Note that this does not work in a simulator, so try on actual device.
- About Us gives a brief overview of who we are, and what this app is for!
*/

const icons = require("../../icons/icons.js");
// find a way to call notifications daily from here

const Settings = ({ navigation }) => {
  const [isVisible, setVisible] = useState(false);
  const [feedback, setFeedback] = useState("");
  const checkFeedback = () => {
    // First, check if feedback is empty
    if (feedback === "") {
      Alert.alert("Empty form", "Feedback form cannot be empty");
      return false;
    }

    if (feedback.length < 30) {
      Alert.alert("Too short", "Please elaborate more");
      return false;
    }

    if (feedback.length > 500) {
      Alert.alert("Too long", "Please use less characters!");
      return false;
    }

    return true;
  };

  const feedbackSender = () => {
    // First, check validity of feedback
    if (!checkFeedback()) {
      return;
    }
    // If it is valid, then we continue execution. This is where the actual sending occurs
    sendFeedback(feedback);
    // We also need to close the modal
    setVisible(false);
  };

  const feedbackForm = () => {
    return (
      <SafeAreaView>
        <Modal
          animationType="fade"
          transparent={true}
          visible={isVisible}
          onRequestClose={() => {
            setModalVisible(!isVisible);
          }}
        >
          <SafeAreaView style={styles.centeredView}>
            <SafeAreaView style={styles.modalView}>
              <Text style={styles.modalText}>Let us know more!</Text>
              <SafeAreaView style={styles.feedbackContainer}>
                <TextInput
                  placeholder="Do note that there is a 500 character limit"
                  placerholderTextColor="grey"
                  multiline={true}
                  onChangeText={(text) => {
                    setFeedback(text);
                    console.log(feedback);
                  }}
                  style={styles.inputText}
                />
              </SafeAreaView>

              <SafeAreaView style={{ position: "absolute", bottom: 20 }}>
                <SafeAreaView
                  style={{
                    flexDirection: "row",
                  }}
                >
                  <TouchableOpacity
                    style={[
                      styles.button,
                      styles.buttonClose,
                      { marginRight: 50 },
                    ]}
                    onPress={() => setVisible(!isVisible)}
                  >
                    <Text style={styles.textStyle}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.button,
                      styles.buttonClose,
                      { marginLeft: 50 },
                    ]}
                    onPress={() => feedbackSender()}
                  >
                    <Text style={styles.textStyle}>Submit</Text>
                  </TouchableOpacity>
                </SafeAreaView>
              </SafeAreaView>
            </SafeAreaView>
          </SafeAreaView>
        </Modal>
      </SafeAreaView>
    );
  };

  return (
    <ImageBackground style={styles.container} source={icons["BG_pic"]}>
      <SetNotifications />
      <TouchableOpacity
        onPress={() => setVisible(true)}
        style={styles.touchableContainer}
      >
        <Text style={styles.text}>Send Feedback</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate("About")}
        style={styles.touchableContainer}
      >
        <Text style={styles.text}>About Us</Text>
      </TouchableOpacity>
      {feedbackForm()}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },

  text: {
    fontFamily: "Itim",
    fontSize: 18,
  },

  inputText: {
    marginTop: 10,
    color: "black",
    fontSize: 18,
  },

  touchableContainer: {
    borderWidth: 2,
    color: "black",
    borderColor: "black",
    borderRadius: 15,
    backgroundColor: "#FBF8D6",
    marginTop: 10,
    marginBottom: 20,
    height: 50,
    width: 200,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
  },

  feedbackContainer: {
    borderRadius: 10,
    borderWidth: 2,
    paddingLeft: 10,
    paddingRight: 10,
    borderColor: "black",
    color: "black",
    width: "110%",
    height: "84%",
  },

  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },

  modalView: {
    margin: 20,
    backgroundColor: "#FBF8D6",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    height: "70%",
    width: "90%",
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 10,
    width: 90,
    padding: 10,
    elevation: 3,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#ffbf00",
  },
  textStyle: {
    color: "white",
    fontSize: 16,
    fontFamily: "Itim",
    textAlign: "center",
  },
  modalText: {
    bottom: 15,
    fontSize: 24,
    fontFamily: "Itim",
    textAlign: "center",
  },
});

export default Settings;
