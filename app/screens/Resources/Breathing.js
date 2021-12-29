import React from "react";
import {
  SafeAreaView,
  Text,
  StyleSheet,
  ScrollView,
  Image,
} from "react-native";

const icons = require("../../icons/icons.js");

const Breathing = () => {
  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#FBF8D6" }}>
      <SafeAreaView
        style={{
          flex: 1,
          height: "100%",
          width: "100%",
          justifyContent: "space-evenly",
        }}
      >
        <Text style={styles.breathHeader}>Breathing Techniques</Text>
        <Text style={styles.breathSubHeader}>
          How does breathing help with my distress?
        </Text>
        <Text style={styles.breathText}>
          Breathing exercises can help you relax, because they make your body
          feel like it does when you are already relaxed. Deep breathing is one
          of the best ways to lower stress in the body. This is because when you
          breathe deeply, it sends a message to your brain to calm down and
          relax.
        </Text>
        <Text
          style={[styles.breathSubHeader, { marginBottom: 0, marginTop: 10 }]}
        >
          How do I breathe to help with my anxiety?
        </Text>
        <SafeAreaView>
          <Image
            style={styles.breathImageStyle}
            source={icons["breathing_attack"]}
          />
        </SafeAreaView>

        <SafeAreaView style={[styles.bulletBackground, { marginTop: 20 }]}>
          <Text style={styles.bulletStyle}>•</Text>
          <Text style={styles.bulletTextStyle}>
            <Text style={styles.breathBoldText}>breathe in </Text>
            <Text>
              as slowly, deeply and gently as you can, through your nose
            </Text>
          </Text>
        </SafeAreaView>

        <SafeAreaView style={styles.bulletBackground}>
          <Text style={styles.bulletStyle}>•</Text>
          <Text style={styles.bulletTextStyle}>
            <Text style={styles.bulletTextStyle}>breathe out</Text>
            <Text style={styles.breathBoldText}>
              {" "}
              slowly, deeply and gently through your mouth
            </Text>
          </Text>
        </SafeAreaView>

        <SafeAreaView style={styles.bulletBackground}>
          <Text style={styles.bulletStyle}>•</Text>
          <Text style={styles.bulletTextStyle}>
            <Text style={styles.bulletTextStyle}>
              some people find it helpful to
            </Text>
            <Text style={styles.breathBoldText}>
              {" "}
              count steadily from one to five{" "}
            </Text>
            <Text>on each in-breath and each out-breath</Text>
          </Text>
        </SafeAreaView>

        <SafeAreaView
          style={[
            styles.bulletBackground,
            { marginBottom: 20, paddingBottom: 10 },
          ]}
        >
          <Text style={styles.bulletStyle}>•</Text>
          <Text style={styles.bulletTextStyle}>
            <Text style={styles.breathBoldText}>close your eyes</Text>
            <Text style={styles.bulletTextStyle}>
              {" "}
              and focus on your breathing
            </Text>
          </Text>
        </SafeAreaView>
      </SafeAreaView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  breathHeader: {
    fontFamily: "Itim",
    fontSize: 32,
    textAlign: "left",
    padding: 20,
    marginTop: 20,
    paddingBottom: 10,
  },

  breathSubHeader: {
    fontFamily: "Itim",
    fontSize: 20,
    textAlign: "left",
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 10,
    paddingBottom: 10,
    color: "white",
    backgroundColor: "#ffbf00",
  },

  breathText: {
    fontFamily: "Itim",
    fontSize: 18,
    textAlign: "left",
    color: "black",
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 10,
  },

  breathBoldText: {
    color: "#e09000",
  },

  breathBulletedText: {
    fontFamily: "Itim",
    fontSize: 18,
    color: "black",
  },

  breathImageStyle: {
    width: "100%",
  },

  bulletBackground: {
    backgroundColor: "white",
    flexDirection: "row",
    paddingTop: 10,
    marginLeft: 10,
    marginRight: 10,
  },

  bulletStyle: {
    fontFamily: "Itim",
    fontSize: 18,
    paddingLeft: 10,
    color: "black",
  },

  bulletTextStyle: {
    fontFamily: "Itim",
    fontSize: 18,
    textAlign: "left",
    color: "black",
    paddingLeft: 10,
    paddingRight: 30,
  },
});

export default Breathing;
