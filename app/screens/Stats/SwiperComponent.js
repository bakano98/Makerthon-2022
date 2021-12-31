import React, { Component } from "react";
import { AppRegistry, StyleSheet, Text, View } from "react-native";
import PieChartWeek from "./PieChartWeek";
import PieChartMonth from "./PieChartMonth";
import PieChartYear from "./PieChartYear";
import Swiper from "react-native-swiper";

function SwiperComponent(dict) {
  return (
    <Swiper style={styles.wrapper} showsButtons={true}>
      <View style={styles.slide1}>
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          {PieChartWeek(dict)}
          <Text style={styles.pieText}>This Week</Text>
        </View>
      </View>
      <View style={styles.slide2}>
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          {PieChartMonth(dict)}
          <Text style={styles.pieText}>This Month</Text>
        </View>
      </View>
      <View style={styles.slide3}>
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          {PieChartYear(dict)}
          <Text style={styles.pieText}>This Year</Text>
        </View>
      </View>
    </Swiper>
  );
}

const styles = StyleSheet.create({
  wrapper: {},
  slide1: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  slide2: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  slide3: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  pieText: {
    color: "black",
    fontSize: 18,
    fontFamily: "Itim",
    padding: 10,
  },
});

AppRegistry.registerComponent("myproject", () => SwiperComponent);

export default SwiperComponent;
