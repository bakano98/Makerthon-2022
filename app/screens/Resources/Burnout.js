import React from "react";
import {
  SafeAreaView,
  Text,
  StyleSheet,
  ScrollView,
} from "react-native";


const Burnout = () => {
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
        <Text style={styles.burnHeader}>Are you feeling burned out?</Text>
        <Text style={styles.burnSubHeader}>What is burnout?</Text>
        <Text style={styles.burnText}>
          <Text style={styles.burnBoldText}>
            Burnout is a state of physical and mental exhaustion{" "}
          </Text>
          <Text style={styles.burnText}>
            caused by persistent stress from work over time. If you constantly
            feel exhausted, unappreciated and find no meaning in your work and
            family, you may be suffering from burnout.
          </Text>
          <Text style={styles.burnText}>
            {"\n\n"}Burnout is not a medical condition. However, it can
            adversely affect your physical and mental health.
          </Text>
        </Text>

        <Text
          style={[styles.burnSubHeader, { marginBottom: 0, marginTop: 10 }]}
        >
          My physical wellbeing
        </Text>

        <SafeAreaView style={[styles.bulletBackground, { marginTop: 20 }]}>
          <Text style={styles.bulletStyle}>•</Text>
          <Text style={styles.bulletTextStyle}>
            <Text style={styles.burnBoldText}>Eat regular, balanced meals</Text>
          </Text>
        </SafeAreaView>

        <SafeAreaView style={styles.bulletBackground}>
          <Text style={styles.bulletStyle}>•</Text>
          <Text style={styles.bulletTextStyle}>
            <Text style={styles.burnBoldText}>Get enough sleep</Text>
          </Text>
        </SafeAreaView>

        <SafeAreaView style={styles.bulletBackground}>
          <Text style={styles.bulletStyle}>•</Text>
          <Text style={styles.bulletTextStyle}>
            <Text style={styles.burnBoldText}>Exercise regularly</Text>
            <Text style={styles.bulletTextStyle}>
              {" "}
              (at least 150 minutes of moderate-intensity physical activity a
              week)
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
            <Text style={styles.bulletTextStyle}>
              Avoid unhealthy behaviours such as smoking or drinking excessive
              amounts of alcohol
            </Text>
          </Text>
        </SafeAreaView>

        <Text style={[styles.burnSubHeader, { marginBottom: 0 }]}>
          My physical wellbeing
        </Text>
        <Text style={styles.burnText}>
          Our minds naturally tend to focus on the negative.{"\n"}But we can
          train our minds to actively look out for the positive.
        </Text>

        <SafeAreaView style={[styles.bulletBackground, { marginTop: 10 }]}>
          <Text style={styles.bulletStyle}>•</Text>
          <Text style={styles.bulletTextStyle}>
            <Text style={styles.bulletTextStyle}>Each day, think of </Text>
            <Text style={styles.burnBoldText}>three good things </Text>
            <Text style={styles.bulletTextStyle}>
              that went well and why this happened to you.
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
            <Text style={styles.burnBoldText}>
              Be kind and compassionate to yourself.
            </Text>
            <Text style={styles.bulletTextStyle}>
              {" "}
              If you feel overwhelmed, frustrated and have self-critical
              thoughts such as “I’m not good enough”, pause and acknowledge that
              this is a difficult time. Think about how you can comfort and care
              for yourself in that moment.
            </Text>
          </Text>
        </SafeAreaView>

        <Text style={[styles.burnSubHeader, { marginBottom: 0 }]}>
          My social wellbeing
        </Text>

        <SafeAreaView style={[styles.bulletBackground, { marginTop: 20 }]}>
          <Text style={styles.bulletStyle}>•</Text>
          <Text style={styles.bulletTextStyle}>
            <Text style={styles.burnBoldText}>
              Stay connected with friends and loved ones
            </Text>
          </Text>
        </SafeAreaView>

        <SafeAreaView style={styles.bulletBackground}>
          <Text style={styles.bulletStyle}>•</Text>
          <Text style={styles.bulletTextStyle}>
            <Text style={styles.bulletTextStyle}>If you are religious, </Text>
            <Text style={styles.burnBoldText}>
              staying in touch with your spiritual community
            </Text>
            <Text style={styles.bulletTextStyle}>
              {" "}
              can also renew your sense of purpose and create meaning in your
              life during difficult times
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
            <Text style={styles.bulletTextStyle}>Make an effort to </Text>
            <Text style={styles.burnBoldText}>
              express appreciation to others
            </Text>
            <Text style={styles.bulletTextStyle}>
              {" "}
              for the little things they do. This helps you focus your mind on
              good things and improves relationships.
            </Text>
          </Text>
        </SafeAreaView>
        <Text
          style={[
            styles.burnText,
            { paddingTop: 0, paddingBottom: 10, paddingLeft: 10 },
          ]}
        >
          Source: Dr David Teo Choon Liang,{"\n"}stayprepared.sg
        </Text>
      </SafeAreaView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  burnHeader: {
    fontFamily: "Itim",
    fontSize: 32,
    textAlign: "left",
    padding: 20,
    marginTop: 20,
    paddingBottom: 10,
  },

  burnSubHeader: {
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

  burnText: {
    fontFamily: "Itim",
    fontSize: 18,
    textAlign: "left",
    color: "black",
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 10,
  },

  burnBoldText: {
    color: "#e09000",
  },

  burnBulletedText: {
    fontFamily: "Itim",
    fontSize: 18,
    color: "black",
  },

  burnImageStyle: {
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

export default Burnout;
