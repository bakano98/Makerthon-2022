import React from "react";
import { StyleSheet, Text, SafeAreaView, ImageBackground, Button } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const icons = require("../../icons/icons.js");
const clearAll = async () => {
  try {
    await AsyncStorage.clear();
  } catch (e) {
    // clear error
    console.log(e);
  }

  console.log("Done.");
};



const ResourcesMain = () => {
  return (
    <ImageBackground style={styles.container} source={icons["BG_pic"]}>
      <Text>Resources</Text>
      <Button title="reset" onPress={() => clearAll()}/>
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
});

export default ResourcesMain;
