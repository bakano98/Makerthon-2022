// the TestingScreen screen
import React from "react";
import {
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  Text,
  SafeAreaView,
  Button,
  Touchable,
} from "react-native";

// TestingScreen screen

// image is just a placeholder for now
const image = { uri: "https://reactjs.org/logo-og.png" };

const TestingScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground source={image} style={styles.image}>
        <SafeAreaView>
          <Text style={{ color: "white" }}> Testing Screen </Text>
        </SafeAreaView>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("QuestionnaireBoxTest")}
        >
          <Text> Questionnaire CheckBox </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("MoodTestingStack")}
        >
          <Text> Mood Test</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("BookingTest")}
        >
          <Text> Booking Test</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("FlatListMoods")}
        >
          <Text> FlatListMoods</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("EmailTest")}
        >
          <Text> Email Test</Text>
        </TouchableOpacity>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    // default button, change later?
    alignItems: "center",
    backgroundColor: "#DDDDDD",
    padding: 10,
    marginTop: 15,
  },
  image: {
    width: "100%",
    height: "100%",
  },
});

export default TestingScreen;
