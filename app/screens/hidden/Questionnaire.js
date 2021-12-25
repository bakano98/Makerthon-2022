// IMPORTANT:
// Remember to use from here! Reflect all changes from QuestionnaireBoxTest to here, if any.
import React, { useEffect } from "react";
import {
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  BackHandler,
  Alert,
  Text,
  SafeAreaView,
  Button,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

// local imports
import { QuestionnaireBox } from "../../CustomComponents";
import { RESET } from "../../redux/questionnaire/questionnaireReducer";

// [question, question number]. K10 scale. Note, this is reusable so we can change this to GHQ-12 as well.
const questions = [
  ["Did you feel tired out for no\ngood reason?", 0],
  ["Did you feel nervous?", 1],
  ["Did you feel so nervous that\nnothing could calm you down?", 2],
  ["Did you feel hopeless?", 3],
  ["Did you feel restless or fidgety?", 4],
  ["Did you feel so restless that you could not sit still?", 5],
  ["Did you feel depressed?", 6],
  ["Did you feel that everything was\nan effort?", 7],
  ["Did you feel so sad that nothing\ncould cheer you up?", 8],
  ["Did you feel worthless?", 9],
];

const qnsList = questions.map((qns) => {
  return <QuestionnaireBox question={qns[0]} qNum={qns[1]} key={qns[1]} />;
});

// to access the score of each component:
// x.props.store.getState().currScore

// get total score:
// console.log(qnsList.map(x => x.props.store.getState().currScore).reduce((x,y) => x + y))

// create store in here, and pass it to the next component, which is our QuestionnaireBox
let score = 0;

// toNav is a function. Pass it in the form of "() => navigation.navigate(...)". Must be lazy, otherwise it'll do the navigation onPress.
const customAlert = (title, msg, accept, decline) => {
  Alert.alert(title, msg, [
    {
      text: "Decline",
      onPress: decline,
      style: "cancel",
    },
    {
      text: "Accept",
      onPress: accept,
      style: "default",
    },
  ]);
};

// we'll need navigation screens here as well :)
// confirm is a function. Specifically, it's the navigation function
const giveResources = (confirm) => {
  Alert.alert(
    "Results",
    "Based on the survey, you're just having a bad time these few days.\nHere's some resources to help you!"
    // "You do not seem to be distressed much across the last month!\nContinue to check-in on your mental health through our mood app!\nHere's some resources to keep up your mental hygiene!"
  );
  confirm();
};

const referToPFA = (action) => {
  alert("Referring to PFA...");
  action();
};

const getConsent = (accept, decline) => {
  customAlert(
    "Consent",
    "By consenting, you agree to allow us to use your details for making an appointment with University Counselling Services",
    accept,
    decline
  );
};

// not sure if this is necessary now.
const referToCounsel = (action) => {
  alert("Referring to counselling...");

  action();
};

const referToPsych = (accept, decline) => {
  getConsent(accept, decline);
};

const declineHandler = (submit) => {
  Alert.alert(
    "Declined", // title
    "We still strongly recommend you to seek help. Meanwhile, here's a list of resources you can use", // message
    submit // on accept
  );
};
// because navigation hook is failing. Although code is less clean, no serious repurcussions
let navigator = "";
let user_score = 0;

// i is the number of questions
// handles the submit button. Handle navigation/alerts later
const handleSubmit = (state, call) => {
  let break_flag = false;
  Object.keys(state).forEach((key) => {
    if (state[key].currScore === 0) {
      break_flag = true;
    }
    score += state[key].currScore;
  });

  if (break_flag) {
    // means we have not checked all boxes
    score = 0;
    break_flag = false;
    alert("Please fill in all questions");
  } else {
    // the scoring tiers are based off actual scientific data. We used those tiers as a guideline as to what resource to recommend
    if (score <= 20) {
      navigator = "Resources";
    } else if (score >= 21 && score < 25) {
      navigator = "PFA";
    } else if (score >= 25 && score <= 28) {
      navigator = "Counsel";
    } else {
      // score >= 29
      navigator = "Psych";
    }
  }
  console.log(score);
  user_score = score; // set user score to the the current score before resetting it.
  score = 0; // reset!!
  call();
};
let x = 0;
// no need to reset after submitting because the states are not saved on app restart.
const Questionnaire = ({ navigation }) => {
  const state = useSelector((state) => state);
  const dispatch = useDispatch();
  const reset = () => {
    dispatch({ type: RESET, payload: {} });
  };
  if (x === 0) {
    Alert.alert(
      "Disclaimer",
      "The following questions are widely recommended as a simple measure of psychological distress.\n" +
        "It is used as an indication for the need for interventions and is no way diagnostic in nature.\n" +
        "Do try your best to answer these questions as accurately as possible."
    );
    x++;
  }
  useEffect(() => {
    // disable hardware back press
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => true
    );
    return () => backHandler.remove();
  }, []);

  const three_alert = (title, msg, choice) => {
    Alert.alert(title, msg, [
      {
        text: "I do not want help",
        onPress: () => declineHandler(navigation.navigate("Resources")),
        style: "cancel",
      },
      {
        text: "Anonymous Counselling",
        onPress: () =>
          choice === "PFA"
            ? referToPFA(() => navigation.goBack()) // takes an action
            : referToCounsel(() => navigation.goBack()), // takes an action
        style: "default",
      },
      {
        text: "Booking with UHC",
        onPress: () =>
          referToPsych(
            () =>
              navigation.navigate("FormDetails", {
                K_SCORE: user_score,
              }),
            () => declineHandler(navigation.navigate("Resources"))
          ), // done.
        style: "default",
      },
    ]);
  };

  // the message to be shown to the user
  const msg = (recommended) => {
    if (recommended === "PFA") {
      three_alert(
        "Results",
        "You seem to be in slight psychological distress across the last month.\nWe recommend talking anonymously to a Counsellor, but you can choose either.",
        "PFA"
      );
    } else if (recommended === "Counsel") {
      three_alert(
        "Results",
        "You seem to be in slight psychological distress across the last month.\nWe recommend talking anonymously to a Counsellor, but you can choose either.",
        "Counsel"
      );
    } else {
      three_alert(
        "Results",
        "You seem to be in a high level of psychological distress across the last month.\nWe recommend booking an appointment with UCS.",
        "Counsel"
      );
    }
  };

  return (
    <ScrollView>
      <SafeAreaView style={{ backgroundColor: "#FBF8D6" }}>
        <Text style={styles.text}>In the last 30 days: </Text>
        {qnsList}
        <SafeAreaView
          style={{ alignItems: "center", justifyContent: "center" }}
        >
          <TouchableOpacity
            style={styles.touchableContainer}
            onPress={() => {
              handleSubmit(state, reset);
              switch (navigator) {
                case "Resources":
                  console.log(navigator);
                  giveResources(() => navigation.navigate("Resources"));
                  break;
                case "PFA":
                  console.log(navigator);
                  msg("PFA");
                  break;
                case "Counsel":
                  console.log(navigator);
                  msg("Counsel");
                  break;
                case "Psych":
                  console.log(navigator);
                  msg("Psych");
                  break;
                default:
                  break;
              }
            }}
          >
            <Text style={{ fontSize: 24, fontFamily: "Itim", color: "black" }}>
              Submit
            </Text>
          </TouchableOpacity>
          <Button
            title="Get log"
            onPress={() =>
              Object.keys(state).forEach((key) => {
                console.log(state[key].currScore);
              })
            }
          />
        </SafeAreaView>
      </SafeAreaView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  touchableContainer: {
    fontFamily: "Itim",
    borderWidth: 1.5,
    color: "white",
    borderColor: "#e09000",
    borderRadius: 15,
    backgroundColor: "#fde086",
    height: 50,
    width: 200,
    marginTop: 20,
    marginBottom: 30,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
  },
  text: {
    fontSize: 24,
    fontFamily: "Itim",
    textAlign: "center",
    marginTop: 50,
  },
});

export default Questionnaire;
