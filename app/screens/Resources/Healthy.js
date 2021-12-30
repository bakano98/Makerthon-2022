import React from "react";
import {
  SafeAreaView,
  Text,
  StyleSheet,
  ScrollView,
  Image,
} from "react-native";

const icons = require("../../icons/icons.js");

{
  /* <SafeAreaView
style={{
  marginTop: 10,
  alignItems: "center",
  justifyContent: "center",
}}
>
<Image
  style={styles.healthyImageStyle}
  source={icons["healthy_symptoms"]}
/>
</SafeAreaView> */
}

const Healthy = ({ navigation }) => {
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
        <Text style={styles.healthyHeader}>
          How should I stay mentally healthy?
        </Text>
        <Text style={styles.healthySubHeader}>
          Mental well-being is also about coping with our emotions
        </Text>
        <Text style={[styles.healthyText, { marginBottom: 10 }]}>
          We experience varying emotions, ranging from happiness to sadness to
          anger and more. On some days, we may feel energised while on other
          days, we may feel stressed. It is normal to feel all kinds of emotions
          because mental well-being is about accepting and embracing all these
          emotions.
          {"\n\n"}And that’s why, it’s OKAY not to be okay at times. We can all
          learn to improve our mental well-being by incorporating ”OKAY” in our
          daily lives. Explore the section below to learn OKAY tips on managing
          your mental well-being.
        </Text>

        <Text style={styles.healthySubHeader}>
          Taking care of our mental well-being
        </Text>

        <SafeAreaView
          style={[
            styles.bulletBackground,
            { marginTop: 20, marginBottom: 20, paddingBottom: 10 },
          ]}
        >
          <Text style={styles.bulletStyle}>•</Text>
          <Text style={styles.bulletTextStyle}>
            Sustaining mental well-being requires time and effort. Try the OKAY
            tips today:
          </Text>
        </SafeAreaView>

        <Text style={styles.healthySubHeader}>
          Taking care of our mental well-being
        </Text>
        <SafeAreaView style={[styles.bulletBackground, { marginTop: 20 }]}>
          <Text style={styles.bulletStyle}>•</Text>
          <Text style={styles.bulletTextStyle}>
            Identify them, assess how you are feeling and what is causing you to
            feel this way.
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
            Take a pause, and reflect upon how you are currently feeling by
            making use of our Mood Tracking for daily check-ins
          </Text>
        </SafeAreaView>

        <Text style={styles.healthySubHeader}>Keeping a healthy lifestyle</Text>
        <SafeAreaView style={[styles.bulletBackground, { marginTop: 20 }]}>
          <Text style={styles.bulletStyle}>•</Text>
          <Text style={styles.bulletTextStyle}>
            Adopt the following healthy lifestyle habits
          </Text>
        </SafeAreaView>
        <SafeAreaView
          style={{
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "white",
            marginLeft: 10,
            marginRight: 10,
            marginBottom: 20,
          }}
        >
          <Image style={{ width: 248, height: 207 }} source={icons["sleep"]} />
          <Image
            style={{ width: 220, height: 152 }}
            source={icons["balanced"]}
          />
          <Image
            style={{ width: 299, height: 78 }}
            source={icons["balanceText"]}
          />
        </SafeAreaView>

        <Text style={styles.healthySubHeader}>Adopt coping mechanisms</Text>
        <SafeAreaView style={[styles.bulletBackground, { marginTop: 20 }]}>
          <Text style={styles.bulletStyle}>•</Text>
          <Text style={styles.bulletTextStyle}>
            You can adopt the following mechanisms:
          </Text>
        </SafeAreaView>
        <SafeAreaView
          style={{
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "white",
            marginLeft: 10,
            marginRight: 10,
            marginBottom: 20,
          }}
        >
          <Image style={{ width: 323, height: 184 }} source={icons["time"]} />
          <Image
            style={{ width: 313, height: 350 }}
            source={icons["positive"]}
          />
          <Image style={{ width: 328, height: 225 }} source={icons["engage"]} />
        </SafeAreaView>

        <Text style={styles.healthySubHeader}>You can reach out</Text>
        <SafeAreaView style={[styles.bulletBackground, { marginTop: 20 }]}>
          <Text style={styles.bulletStyle}>•</Text>
          <Text style={styles.bulletTextStyle}>
            Reaching out is a sign of courage, and asking for support does not
            mean that you are any less capable.
          </Text>
        </SafeAreaView>

        <SafeAreaView style={[styles.bulletBackground, { paddingBottom: 10 }]}>
          <Text style={styles.bulletStyle}>•</Text>
          <Text style={styles.bulletTextStyle}>
            Reach out to support yourself and others
          </Text>
        </SafeAreaView>

        <SafeAreaView
          style={{
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "white",
            marginLeft: 10,
            marginRight: 10,
            marginBottom: 20,
            paddingBottom: 15,
          }}
        >
          <Image
            style={{ width: 256, height: 198 }}
            source={icons["connect"]}
          />
          <Image style={{ width: 308, height: 313 }} source={icons["there"]} />
          <Image style={{ width: 284, height: 258 }} source={icons["help"]} />
        </SafeAreaView>

        <Text
          style={[
            styles.healthyText,
            { paddingTop: 0, paddingBottom: 10, paddingLeft: 10 },
          ]}
        >
          Adapted from Healthhub, Singapore
        </Text>
      </SafeAreaView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  healthyHeader: {
    fontFamily: "Itim",
    fontSize: 32,
    textAlign: "left",
    padding: 20,
    marginTop: 20,
    paddingBottom: 10,
  },

  healthySubHeader: {
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

  healthyText: {
    fontFamily: "Itim",
    fontSize: 18,
    textAlign: "left",
    color: "black",
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 10,
  },

  healthyBoldText: {
    color: "#e09000",
  },

  healthyBulletedText: {
    fontFamily: "Itim",
    fontSize: 18,
    color: "black",
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

export default Healthy;
