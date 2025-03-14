import React from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Button,
  Alert,
} from "react-native";

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

const declineHandler = (submit) => {
  Alert.alert(
    "Declined", // title
    "We still strongly recommend you to seek help. Meanwhile, here's a list of resources you can use", // message
    submit // on accept
  );
};

const getConsent = (accept, decline) => {
  customAlert(
    "Consent",
    "By consenting, you agree to allow us to use your details for making an appointment with a PFA",
    accept,
    decline
  );
};

const PFAScreen = ({ navigation, route }) => {
  const { K_SCORE } = route.params;
  return (
    <SafeAreaView style={styles.container}>
      <SafeAreaView style={{ flex: 0.5, top: 50 }}>
        <Text style={styles.apptHeader}>Quick Appointment</Text>
        <Text style={styles.headerDescriptionText}>
          Talk to a Psychological First-Aid (PFA) trained personnel to talk
          about your struggles and feel heard, at the nearest availablity, via
          anonymous phone call or video call
        </Text>
      </SafeAreaView>
      <SafeAreaView
        style={{
          flex: 1,
          marginBottom: 20,
          alignItems: "center",
          justifyContent: "space-around",
        }}
      >
        <TouchableOpacity
          style={styles.touchableContainer}
          onPress={() => navigation.navigate("Callback")}
        >
          <SafeAreaView style={styles.nestedContainer}>
            <Text style={styles.nestedText}>Phone Call</Text>
          </SafeAreaView>
          <Text style={styles.descriptionText}>
            Our Volunteers will give you a call back. {"\n"}This is a strictly
            confidential and anonymous service.
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.touchableContainer}
          onPress={() =>
            getConsent(
              () =>
                navigation.navigate("FormDetails", {
                  K_SCORE: K_SCORE, // Pass down their K_SCORE if they want to go ahead and do a Zoom call with the PFA.
                  directedFrom: "PFA",
                }),
              () => {}
            )
          }
        >
          <SafeAreaView style={[styles.nestedContainer, { bottom: 20 }]}>
            <Text style={styles.nestedText}>Zoom Appointment</Text>
          </SafeAreaView>
          <Text style={styles.descriptionText}>
            Schedule an appointment with a PFA.{"\n"}This requires your
            particulars.
          </Text>
        </TouchableOpacity>
      </SafeAreaView>

      <SafeAreaView style={{ bottom: 20 }}>
        <Button
          title="I do not want help"
          onPress={() =>
            declineHandler(
              navigation.navigate("Resources", { screen: "ResourcesMain" })
            )
          }
        />
      </SafeAreaView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FBF8D6",
  },

  apptHeader: {
    fontFamily: "Itim",
    color: "#e09000",
    textAlign: "center",
    textDecorationLine: "underline",
    fontSize: 32,
  },

  headerDescriptionText: {
    fontFamily: "Itim",
    color: "black",
    textAlign: "left",
    fontSize: 20,
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 5,
  },

  touchableContainer: {
    borderWidth: 2,
    borderColor: "black",
    borderRadius: 20,
    backgroundColor: "white",
    height: 200,
    width: 300,
    marginTop: 20,
    marginBottom: 30,
    alignItems: "center",
    justifyContent: "center",
    elevation: 8,
  },

  nestedContainer: {
    borderWidth: 2,
    borderRadius: 15,
    backgroundColor: "#fde086",
    width: "80%",
    bottom: 10,
  },

  nestedText: {
    fontSize: 24,
    fontFamily: "Itim",
    color: "black",
    textAlign: "center",
  },

  descriptionText: {
    fontSize: 18,
    fontFamily: "Itim",
    color: "black",
    textAlign: "left",
    paddingLeft: 10,
    paddingRight: 10,
  },

  touchableContainerText: {
    fontSize: 16,
    marginTop: 10,
    textAlign: "center",
    fontFamily: "Itim",
  },

  touchableContainerImage: {
    height: "50%",
    width: "50%",
  },
});

export default PFAScreen;
