import React from "react";
import {
  SafeAreaView,
  Text,
  StyleSheet,
  ScrollView,
  Image,
} from "react-native";

const icons = require("../../icons/icons.js");

const Panic = ({ navigation }) => {
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
        <Text style={styles.panicHeader}>
          PANIC ATTACKS{"\n"}AND WHAT TO DO
        </Text>
        <Text style={styles.panicSubHeader}>Is it a panic attack?</Text>
        <Text style={styles.panicText}>
          A panic attack is a sudden episode of intense fear that triggers
          severe physical reactions when there is no real danger or apparent
          cause.
          {"\n"}The symptoms of a panic attack are not dangerous, but they can
          be very frightening.
        </Text>
        <Text style={styles.panicText}>
          <Text>Most panic attacks last somewhere from </Text>
          <Text style={styles.panicBoldText}>
            five minutes to half an hour.{" "}
          </Text>
          <Text>You may have the following symptoms:</Text>
        </Text>
        <SafeAreaView style={{ marginTop: 10 }}>
          <Image
            style={styles.panicImageStyle}
            source={icons["panic_symptoms"]}
          />
        </SafeAreaView>
        <Text style={styles.panicSubHeader}>
          How should I handle a panic attack?
        </Text>
        <Text style={styles.panicText}>
          Panic attacks always pass, and the symptoms are not a sign of anything
          harmful happening. Take control of your panic attack.
        </Text>

        <SafeAreaView style={[styles.bulletBackground, { marginTop: 20 }]}>
          <Text style={styles.bulletStyle}>•</Text>
          <Text style={styles.bulletTextStyle}>
            <Text style={styles.panicBoldText}>Confront your fears </Text>
            <Text>
              by facing the situation causing your anxiety attack. {"\n"}Try not
              to look for distractions and remain in the situation until the
              anxiety has subsided. This would give you a chance to discover
              that nothing is going to happen.
            </Text>
            <Text style={styles.panicBoldText}>
              {" "}
              Look at our resource on breathing techniques.
            </Text>
          </Text>
        </SafeAreaView>

        <SafeAreaView style={styles.bulletBackground}>
          <Text style={styles.bulletStyle}>•</Text>
          <Text style={styles.bulletTextStyle}>
            <Text style={styles.bulletTextStyle}>
              As the anxiety begins to pass, start to
            </Text>
            <Text style={styles.panicBoldText}>
              {" "}
              focus on your surroundings{" "}
            </Text>
            <Text>and continue to do what you were doing before.</Text>
          </Text>
        </SafeAreaView>

        <SafeAreaView style={styles.bulletBackground}>
          <Text style={styles.bulletStyle}>•</Text>
          <Text style={styles.bulletTextStyle}>
            <Text style={styles.bulletTextStyle}>
              If you’re having a short, sudden panic attack, it can be helpful
              to
            </Text>
            <Text style={styles.panicBoldText}> have someone with you</Text>
            <Text>
              , reassuring you that it will pass and the symptoms are nothing to
              worry about.
            </Text>
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
            <Text style={styles.panicBoldText}>
              Talk to your family members, or friends
            </Text>
            <Text style={styles.bulletTextStyle}>
              {" "}
              about what you are experiencing. Online support groups are a good
              avenue for you to share your experiences, and to learn from others
              how to manage panic attacks. You may also
            </Text>
            <Text
              style={styles.panicBoldText}
              onPress={() => navigation.navigate("PFAStack")}
            >
              {" "}
              speak to our certified psychological first aid volunteers
            </Text>
            <Text> today!</Text>
          </Text>
        </SafeAreaView>
      </SafeAreaView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  panicHeader: {
    fontFamily: "Itim",
    fontSize: 32,
    textAlign: "left",
    padding: 20,
    marginTop: 20,
    paddingBottom: 10,
  },

  panicSubHeader: {
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

  panicText: {
    fontFamily: "Itim",
    fontSize: 18,
    textAlign: "left",
    color: "black",
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 10,
  },

  panicBoldText: {
    color: "#e09000",
  },

  panicBulletedText: {
    fontFamily: "Itim",
    fontSize: 18,
    color: "black",
  },

  panicImageStyle: {
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

export default Panic;
