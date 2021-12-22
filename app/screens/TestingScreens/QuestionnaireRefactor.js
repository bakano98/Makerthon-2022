import React from "react";
import {
  SafeAreaView,
  Text,
  StyleSheet,
  SectionList,
  StatusBar,
  TouchableOpacity,
} from "react-native";

const questions = [
  ["Did you feel tired out for no good reason?", 0],
  ["Did you feel nervous?", 1],
  ["Did you feel so nervous that nothing\n     could calm you down?", 2],
  ["Did you feel hopeless?", 3],
  ["Did you feel restless or fidgety?", 4],
  ["Did you feel so restless that you could not\n     sit still?", 5],
  ["Did you feel depressed?", 6],
  ["Did you feel that everything was an effort?", 7],
  ["Did you feel so sad that nothing could cheer\n     you up?", 8],
  ["Did you feel worthless?", 9],
];

// const answers = [
//   "None of the time",
//   "A little of the time",
//   "Some of the time",
//   "Most of the time",
//   "All of the time",
// ];

const answers = [
  { Q: "None of the time", V: 1, S: false },
  { Q: "A little of the time", V: 2, S: false },
  { Q: "Some of the time", V: 3, S: false },
  { Q: "Most of the time", V: 4, S: false },
  { Q: "All of the time", V: 5, S: false },
];

const DATA = [
  {
    title: "1) Did you feel tired out for no good reason?",
    data: answers,
  },
  { title: "2) Did you feel nervous?", data: answers },
  {
    title: "3) Did you feel so nervous that nothing could calm you down?",
    data: answers,
  },
  { title: "4) Did you feel hopeless?", data: answers },
  { title: "5) Did you feel restless or fidgety?", data: answers },
  {
    title: "6) Did you feel so restless that you could not sit still?",
    data: answers,
  },
  { title: "7) Did you feel depressed?", data: answers },
  { title: "8) Did you feel that everything was an effort?", data: answers },
  {
    title: "9) Did you feel so sad that nothing could cheer you up?",
    data: answers,
  },
  { title: "10) Did you feel worthless?", data: answers },
];

const Item = ({ answers, index }) => (
  <TouchableOpacity style={styles.item} onPress={() => console.log(index)}>
    <Text style={styles.title}>{answers}</Text>
  </TouchableOpacity>
);

const QuestionnaireRefactor = () => {
  return (
    <SafeAreaView style={styles.container}>
      <SafeAreaView style={{ padding: 20 }}>
        <SectionList
          sections={DATA}
          keyExtractor={(item, index) => item + index}
          renderItem={({ item, index }) => (
            <Item answers={item.Q} index={index} />
          )} // item takes in whatever is named "data"
          renderSectionHeader={({ section: { title } }) => (
            <Text style={styles.header}>{title}</Text>
          )}
        />
      </SafeAreaView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
  },
  item: {
    backgroundColor: "#f9c2ff",
    padding: 20,
    marginVertical: 8,
  },
  header: {
    fontFamily: "Itim",
    fontSize: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontFamily: "Itim",
    fontSize: 20,
  },
});

export default QuestionnaireRefactor;
