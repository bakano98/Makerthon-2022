// the Dashboard screen
import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
  ImageBackground,
  StyleSheet,
  Text,
  SafeAreaView,
  Button,
  ScrollView,
  View,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getModeMood,
        getModeMoodArray, 
        getProgress, 
        getTrend,
        toDict,
        displayModeMood, } from './Stats/DataProcessing';
import PieChartWeek from "./Stats/PieChartWeek";
import PieChartMonth from "./Stats/PieChartMonth";
import ProgressBar from "./Stats/ProgessBar";
import StackedGraph from "./Stats/StackedGraph";
import LineGraph from "./Stats/LineGraph";
import PieChartYear from "./Stats/PieChartYear";


// image is just a placeholder for now
const icons = require("../icons/icons.js");
const clearAll = async () => {
  try {
    await AsyncStorage.clear();
  } catch (e) {
    // clear error
    console.log(e);
  }

  console.log("Done.");
};

// navigation may be used later so we keep it here for now.
const Dashboard = ({ navigation }) => {
  // Note that if we want to update anything related to the state, we have to directly call user_state.(dataType) = ....
  const moodState = useSelector((state) => state);
  const moodsData = moodState.data;
  const logPoints = moodState.logPoints;

  //parse data into a dictionary
  const dict = toDict(moodsData);

  return (
      
    <ImageBackground source={icons["BG_pic"]} style={styles.image}>  
        
        
        
        
        <ScrollView
          contentContainerStyle={{ justifyContent: "center" }}> 
        
          <View style = {styles.subcontainer}>
            <Text style={styles.text}>
              You have been feeling {getModeMood(moodsData, 5)}.
            </Text>
            <View style = {styles.moodContainer}>
               {displayModeMood(getModeMoodArray(moodsData, 5)) }
            </View>
          </View>

          <View style = {styles.pieContainer}>
              <Text style = {styles.subheader}> 
                Summary 
              </Text>
              <View style = {{justifyContent: 'center', alignItems:'center'}}>
                {ProgressBar(dict)}
                <Text style = {styles.pieText}>{Math.ceil(getProgress(dict) * 100)}%</Text>
              </View>
              <View style = {{justifyContent: 'center', alignItems:'center'}}>
                  {PieChartWeek(dict)}
                  <Text style = {styles.pieText}>Week</Text>
              </View>
              <View style = {{justifyContent: 'center', alignItems:'center'}}>
                  {PieChartMonth(dict)}
                  <Text style = {styles.pieText}>Month</Text>
              </View>
              <View style = {{justifyContent: 'center', alignItems:'center'}}>
                {PieChartYear(dict)}
                <Text style = {styles.pieText}>Year</Text>
              </View> 
          </View>
          
          <View style = {styles.graphContainer}>
            <Text style = {styles.subheader}> 
              Trend {getTrend(moodsData, 7)}
            </Text>
             {LineGraph(moodsData, 7)}
          </View>
          
          <View style={styles.circle}>
            <Text style={styles.pointsText}>
              {logPoints}
            </Text>
          </View>
          

          <Button
            title="Show data on console"
            onPress={() => console.log(dict)}
          />
          <Button title="Clear whole AsyncStorage" onPress={() => clearAll()} />
          
          </ScrollView>
    </ImageBackground>
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  subcontainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 25,
    marginStart: 10,
    marginEnd: 10,
    height: 150,
    flexDirection: 'column',
    marginTop: 10,
    marginBottom: 10,
    
  },
  subheader: {
    fontSize: 20,
    color: "black",
    width:400,
    marginStart: 80,
    marginEnd: 0,
    paddingBottom:10
  },
  text: {
    fontSize: 20,
    color: "black",
    height:60,
    //backgroundColor: '#f5f5f5',
    //borderRadius: 25,
    //padding: 10,
    marginStart: 25,
    marginEnd: 10,
    paddingTop: 10,
  },

  button: {
    // default button, change later?
    alignItems: "center",
    backgroundColor: "#DDDDDD",
    padding: 10,
    marginTop: 15,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  moodContainer: {
    paddingHorizontal: 10,
    flexDirection:'row',
    justifyContent:'space-around',
    paddingTop: 20,
  },
  pieContainer: {
    backgroundColor: '#f5f5f5',
    borderRadius: 25,
    padding: 10,
    justifyContent: 'space-around',
    flexDirection:'row',
    flexWrap:'wrap',
    marginStart: 10,
    marginEnd: 10,
  },
  pieText: {
    fontStyle: 'italic',
    fontSize: 18,
    padding: 10,
    paddingBottom:10,
  },
  graphContainer: {
    backgroundColor: '#f5f5f5',
    borderRadius: 25,
    padding: 10,
    justifyContent: 'space-around',
    flexDirection:'row',
    flexWrap:'wrap',
    marginStart: 10,
    marginEnd: 10,
    marginTop: 10,
    marginBottom:10,
  },
  circle: {
    height:100, 
    width:100, 
    backgroundColor: '#f5f5f5', 
    borderRadius: 100, 
    overflow: 'hidden', 
    opacity: 1,
    justifyContent: 'center',
    alignContent:'center',
    marginStart: 150,
    marginTop: 10,
    marginBottom: 10
  },
  pointsText: {
    color:'black',
    fontSize: 40,
    padding: 0,
    paddingStart: 25
  }
});

export default Dashboard;
