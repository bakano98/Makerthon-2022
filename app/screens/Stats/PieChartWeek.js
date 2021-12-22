import React from 'react'
import * as dateFn from "date-fns";
import { PieChart } from 'react-native-svg-charts'
import { flattenObject } from './DataProcessing';

function PieChartWeek(dictionary) {
    // takes in data as a dictionary
    const now = new Date();
    const currMonth = dateFn.getMonth(now);
    const currYear = dateFn.getYear(now);
    const currWeek = dateFn.getWeek(now);
    
    // Array
    const moodOnly = Object.values(Object.values(dictionary[currYear][currMonth][currWeek]))

    const moodCount = {
        mood_sad: 0,
        mood_stressed: 0,
        mood_okay: 0,
        mood_happy: 0,
        mood_calm: 0,
        mood_anxious: 0,
        mood_angry: 0,
    }

    for (const [key, value] of Object.entries(flattenObject(moodOnly))) {
        moodCount[value]++;
        //console.log(value)
    }

    const data = [
        {
            key: 'mood_sad',
            amount: moodCount['mood_sad'],
            svg: { fill: '#7ce2f7' },
        },
        {
            key: 'mood_stressed',
            amount: moodCount['mood_stressed'],
            svg: { fill: '#d8bcff' }
        },
        {
            key: 'mood_okay',
            amount: moodCount['mood_okay'],
            svg: { fill: '#ffbf00' }
        },
        {
            key: 'mood_happy',
            amount: moodCount['mood_happy'],
            svg: { fill: '#ffb254' }
        },
        {
            key: 'mood_calm',
            amount: moodCount['mood_calm'],
            svg: { fill: '#acec6c' }
        },
        {
            key: 'mood_anxious',
            amount: moodCount['mood_anxious'],
            svg: { fill: '#bebebe' }
        },
        {
            key: "mood_angry",
            amount: moodCount['mood_angry'],
            svg: { fill: '#ff9aa0' }
        }
    ]
    return (
        <PieChart
            style={{ height: 150, width: 150 }}
            valueAccessor={({ item }) => item.amount}
            data={data}
            spacing={0}
            outerRadius={'95%'}
        >
        </PieChart>
    )
}



export default PieChartWeek;