import React from "react";
import { SafeAreaView, StyleSheet, Text } from "react-native";

const PFAScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <SafeAreaView style={{flex: 1, top: 40}}>
        <Text style={styles.apptHeader}>Quick Appointment</Text>
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
  },

  apptHeader: {
    fontFamily: "Itim",
    color: "#e09000",
    fontSize: 32,
  },
});

export default PFAScreen;
