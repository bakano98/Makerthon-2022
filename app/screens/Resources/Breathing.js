import React from "react";
import { SafeAreaView, Text, StyleSheet } from "react-native";

const Breathing = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text>Breathing Techniques</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Breathing;
