import React from "react";
import { StyleSheet, Text, SafeAreaView } from "react-native";
import { CheckBox } from "react-native-elements";
import { useDispatch, useSelector } from "react-redux";

import { UPDATE_ANSWER } from "../redux/questionnaire/questionnaireReducer";

// we can turn this into a reusable component and pass down a variable called questionName in order to specify a question
const QuestionnaireBox = (props) => {
  const num = props.qNum;
  const answers = useSelector((state) => state[num]);
  const dispatch = useDispatch();
  const updateAnswer = (answerIndex) =>
    dispatch({ type: UPDATE_ANSWER, payload: { answerIndex, num } });
  return (
    <SafeAreaView style={{ backgroundColor: "#FBF8D6" }}>
      <SafeAreaView style={{ flexDirection: "row" }}>
        <Text style={styles.text}>{num + 1})</Text>
        <Text style={[styles.text, { paddingLeft: 5 }]}>{props.question}</Text>
      </SafeAreaView>

      <SafeAreaView style={{ justifyContent: "center", alignItems: "center" }}>
        {answers.answers.map((answer, index) => (
          <CheckBox
            center
            title={answer[0]}
            checkedIcon=""
            uncheckedIcon=""
            checked={answer[2]}
            textStyle={{ fontSize: 16 }}
            containerStyle={
              answer[2] === true
                ? styles.containerChosen
                : styles.containerNotChosen
            }
            onPress={() => {
              updateAnswer(index);
            }}
          />
        ))}
      </SafeAreaView>
    </SafeAreaView>
  );
};

// UX improvements:
// Implement a Quick jump to Question. We'll need to use React's Route for this
// Need a persistent bottom tab to go to questions.

const styles = StyleSheet.create({
  containerChosen: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fde086",
    marginBottom: 10,
    width: "75%",
    elevation: 2,
  },
  containerNotChosen: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    marginBottom: 10,
    width: "75%",
    elevation: 2,
  },

  text: {
    fontSize: 20,
    fontFamily: "Itim",
    left: 15,
    marginBottom: 10,
    marginTop: 40,
    paddingLeft: 5,
  },
});

export default QuestionnaireBox;
