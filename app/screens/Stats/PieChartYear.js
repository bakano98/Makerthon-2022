import React from 'react'
import * as dateFn from "date-fns";
import { PieChart } from 'react-native-svg-charts'
import { flattenObject } from './DataProcessing';

function PieChartYear(dictionary) {
    // takes in data as a dictionary
    const now = new Date();
    const currYear = dateFn.getYear(now);
    if (dictionary === -1 
        || dictionary[currYear] === undefined) {
        return (
            <PieChart
                style={{ height: 150, width: 150 }}
                valueAccessor={({ item }) => item.amount}
                data={[{key: 'mood_empty', amount: 1, svg: { fill: '#c0c0c0' }}]}
                spacing={0}
                outerRadius={'95%'}
            >
            </PieChart>
        )
    }


    
    
    // Array
    const moodOnly = Object.values(Object.values(dictionary[currYear]))

    const moodCount = {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
        6: 0,
        7: 0,
      }
    
    for (const [key, value] of Object.entries(flattenObject(moodOnly))) {
        moodCount[value]++;
    }

    const data = [
        {
            key: 'mood_sad',
            amount: moodCount[4],
            svg: { fill: '#7ce2f7' },
        },
        {
            key: 'mood_stressed',
            amount: moodCount[5],
            svg: { fill: '#d8bcff' }
        },
        {
            key: 'mood_okay',
            amount: moodCount[2],
            svg: { fill: '#ffbf00' }
        },
        {
            key: 'mood_happy',
            amount: moodCount[1],
            svg: { fill: '#ffb254' }
        },
        {
            key: 'mood_calm',
            amount: moodCount[3],
            svg: { fill: '#acec6c' }
        },
        {
            key: 'mood_anxious',
            amount: moodCount[7],
            svg: { fill: '#bebebe' }
        },
        {
            key: "mood_angry",
            amount: moodCount[6],
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



export default PieChartYear;