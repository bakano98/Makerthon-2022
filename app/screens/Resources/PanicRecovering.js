import React from "react";
import {
  SafeAreaView,
  Text,
  StyleSheet,
  ScrollView,
  Image,
} from "react-native";

const icons = require("../../icons/icons.js");

const PanicRecovering = ({ navigation }) => {
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
        <Text style={styles.panicRecoveringHeader}>
          I've just had a panic attack. Now what?
        </Text>
        <Text style={styles.panicRecoveringSubHeader}>
          Pulling yourself back together
        </Text>
        <Text style={styles.panicRecoveringText}>
          Even after a panic attack has passed, you may still feel on edge or
          keyed up. The rest of your day is marked by a sense of nervousness and
          apprehension.
          {"\n\n"}
          While panic attacks are distressing and debilitating, there are things
          that you can do that will help you calm your body and mind down
          afterward. Some strategies that can help include:
        </Text>
        <SafeAreaView style={{ marginTop: 10, alignItems: "center" }}>
          <Image
            style={styles.panicRecoveringImageStyle}
            source={icons["panic_recovering"]}
          />
        </SafeAreaView>
        <SafeAreaView style={[styles.bulletBackground, { marginTop: 20 }]}>
          <Text style={styles.bulletStyle}>•</Text>
          <Text style={styles.bulletTextStyle}>
            <Text style={styles.panicRecoveringBoldText}>
              Use positive Self-Talk{" "}
            </Text>
            <Text>
              and affirmations to enhance your mood and gain a sense of control.
              When the panic attack is ending, remind yourself that it will be
              over soon and that it cannot hurt you. If thoughts of self-blame
              arise, try your best to forgive yourself, counteract the
              self-blame with affirmations, and move on with your day.
            </Text>
          </Text>
        </SafeAreaView>

        <SafeAreaView style={styles.bulletBackground}>
          <Text style={styles.bulletStyle}>•</Text>
          <Text style={styles.bulletTextStyle}>
            <Text style={styles.panicRecoveringBoldText}>
              Talk to a loved one.
            </Text>
            <Text style={styles.bulletTextStyle}>
              {" "}
              You don’t even need to tell your friend or family member that you
              just had a panic attack. Rather, you can call your loved one up to
              merely chitchat. You may find that simply talking to someone you
              trust will make you feel better as your panic attack symptoms
              decrease.
            </Text>
          </Text>
        </SafeAreaView>

        <SafeAreaView
          style={[
            styles.bulletBackground,
            { marginBottom: 20, paddingBottom: 10},
          ]}
        >
          <Text style={styles.bulletStyle}>•</Text>
          <Text style={styles.bulletTextStyle}>
            <Text style={styles.panicRecoveringBoldText}>
              Focus on something else.
            </Text>
            <Text style={styles.bulletTextStyle}>
              {" "}
              Instead of feeding your anxiety with more attention or worry,
              bring your awareness to something fun you plan on doing in the
              future or to joyful times from your past. If possible, try taking
              a walk in the fresh air or engage in an activity you enjoy to help
              clear your mind.
            </Text>
          </Text>
        </SafeAreaView>
        <Text
          style={[
            styles.panicRecoveringText,
            { paddingTop: 0, paddingBottom: 10, paddingLeft: 10 },
          ]}
        >
          Source: Katharina Star, PhD,{"\n"}verywellmind.com
        </Text>
      </SafeAreaView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  panicRecoveringHeader: {
    fontFamily: "Itim",
    fontSize: 32,
    textAlign: "left",
    padding: 20,
    marginTop: 20,
    paddingBottom: 10,
  },

  panicRecoveringSubHeader: {
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

  panicRecoveringText: {
    fontFamily: "Itim",
    fontSize: 18,
    textAlign: "left",
    color: "black",
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 10,
  },

  panicRecoveringBoldText: {
    color: "#e09000",
  },

  panicRecoveringBulletedText: {
    fontFamily: "Itim",
    fontSize: 18,
    color: "black",
  },

  panicRecoveringImageStyle: {
    width: 369,
    height: 243,
    resizeMode: "contain"
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

export default PanicRecovering;
