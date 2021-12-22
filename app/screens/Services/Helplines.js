import React from "react";
import {
  ImageBackground,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  Linking,
  Text,
  FlatList,
} from "react-native";

// Services will link to this

/**
 * To do:
 * 1) Change to actual proper helplines, complete with logos.
 */

const icons = require("../../icons/icons.js");

// Note: Linking.openURL(`tel ${number}`) where number is in the form of +6512345678...

// Array of objects. Each object contains the details of a particular hotline
const data = [
  {
    name: "National CARE Hotline",
    number: "1800-202-6868",
    desc: "For COVID-19 related mental health distress",
    linking_number: "18002026868",
  },
  {
    name: "Samaritans of Singapore (SoS)",
    number: "1800-221-444",
    desc: "SoS provides 24/7 anonymous, confidential emotional support to anyone who is in crisis",
    linking_number: "1800221444",
  },
  {
    name: "Institue of Mental Health",
    number: "6389 2222",
    desc: "National hospital for mental health",
    linking_number: "63892222",
  },
  {
    name: "Lifeline NUS",
    number: "+65 6516 7777",
    desc: "For life threatening psychological emergencies (e.g. suicidal thoughts, severe panic/anxiety attacks)",
    linking_number: "+6565167777",
  },
];

const Item = ({ name, number, desc, linking_number }) => {
  return (
    <SafeAreaView style={styles.mappedItems}>
      <TouchableOpacity
        onPress={() => Linking.openURL(`tel: ${linking_number}`)}
      >
        <Text style={[styles.mappedItemsFont, { color: "#e09000" }]}>
          {name}
        </Text>
        <Text style={styles.mappedItemsFont}>{number}</Text>
        <Text style={[styles.mappedItemsFont, { marginBottom: 20 }]}>
          {desc}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const Helplines = () => {
  const renderItem = ({ item }) => (
    <Item
      name={item.name}
      number={item.number}
      desc={item.desc}
      linking_number={item.linking_number}
    />
  );

  return (
    <ImageBackground style={styles.container} source={icons["BG_pic"]}>
      <SafeAreaView
        style={{
          flex: 0.2,
          borderBottomColor: "black",
          borderBottomWidth: 2,
          marginTop: 40,
        }}
      >
        <Text style={styles.helpline_header}>Helplines</Text>
        <Text style={styles.helpline_text}>
          If you are feeling in need of a safe space and would like a listening
          ear, these helplines are available
        </Text>
      </SafeAreaView>
      <FlatList
        style={{ flex: 0.8, marginTop: 30 }}
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.name}
      />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    // alignItems: "center",
  },

  image: {
    marginTop: 25,
    width: 200,
    height: 200,
    marginLeft: 15,
    marginRight: 15,
  },

  mappedItems: {
    borderBottomColor: "black",
    borderBottomWidth: 1,
    marginBottom: 20,
  },

  mappedItemsFont: {
    fontSize: 18,
    fontFamily: "Itim",
    paddingLeft: 20,
    paddingRight: 20,
  },

  helplines_container: {
    borderRadius: 15,
    marginBottom: 20,
    height: "100%",
    width: "95%",
    justifyContent: "center",
  },

  helpline_text: {
    fontFamily: "Itim",
    fontSize: 20,
    paddingLeft: 20,
    paddingRight: 10,
  },

  helpline_header: {
    fontFamily: "Itim",
    textAlign: "left",
    fontSize: 32,
    paddingLeft: 20,
    paddingRight: 10,
  },

  bundle: {
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
  },
});

export default Helplines;
