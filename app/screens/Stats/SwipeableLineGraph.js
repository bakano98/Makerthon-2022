import React from 'react'
import { AppRegistry, StyleSheet, Text, View } from 'react-native'
import LineGraph from './LineGraph'
import Swiper from 'react-native-swiper'

function SwipeableLineGraph(array) {
    return (
      <Swiper style={styles.wrapper} showsButtons={true}>
        <View style={styles.slide1}>
          <View style = {{justifyContent: 'center', alignItems:'center', width:300}}>
            {LineGraph(array, 3, 'week')}
            <Text style = {styles.text}>This Week</Text>
          </View>
        </View>
        <View style={styles.slide2}>
          <View style = {{justifyContent: 'center', alignItems:'center', width:300}}>
            {LineGraph(array, 3, 'month')}
            <Text style = {styles.text}>This Month</Text>
          </View>
        </View>
        <View style={styles.slide3}>
          <View style = {{justifyContent: 'center', alignItems:'center', width:300}}>
            {LineGraph(array, 3, 'year')}
            <Text style = {styles.text}>This Year</Text>
          </View> 
        </View>
      </Swiper>
    )
}



const styles = StyleSheet.create({
    wrapper: {},
    slide1: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f5f5f5',
    },
    slide2: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f5f5f5',
    },
    slide3: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f5f5f5'
    },
    text: {
      fontSize: 14,
      paddingTop: 10,
      paddingBottom:10,
    }
  })

  
AppRegistry.registerComponent('myproject', () => SwiperComponent)

export default SwipeableLineGraph;