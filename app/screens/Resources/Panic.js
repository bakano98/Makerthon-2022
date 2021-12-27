import React from "react";
import { SafeAreaView, Text, StyleSheet, ScrollView } from "react-native";

const Panic = () => {
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#FBF8D6" }}
      contentContainerStyle={{ justifyContent: "center" }}
    >
      <Text style={styles.panicHeader}>PANIC ATTACKS{"\n"}AND WHAT TO DO</Text>
      <Text style={styles.panicSubHeader}>Is it a panic attack?</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  panicHeader: {
    fontFamily: "Itim",
    fontSize: 36,
    textAlign: "left",
    padding: 20,
    marginTop: 20,
    paddingBottom: 10,
  },

  panicSubHeader: {
    fontFamily: "Itim",
    fontSize: 22,
    textAlign: "left",
    paddingLeft: 20,
    paddingTop: 10,
    paddingBottom: 10,
    color: "white",
    backgroundColor: "#ffbf00",
  },
});

export default Panic;
