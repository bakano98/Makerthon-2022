import React from 'react'
import { StackedAreaChart } from 'react-native-svg-charts'
import * as dateFn from "date-fns";
import * as shape from 'd3-shape';

// dictionary must be sorted
function StackedGraph(dictionary) {
    // takes in data as a dictionary
    const now = new Date();
    const currMonth = dateFn.getMonth(now);
    const currYear = dateFn.getYear(now);

    let data = [];

    for (const [key, value] of Object.entries(dictionary[currYear][currMonth])) {
        // key: week, val: {...{day: 'mood'}...}
        //console.log(value)
        date = new Date(currYear, currMonth, Object.keys(value)[0])
        //console.log(date)
        let temp = {
            week: dateFn.lastDayOfWeek(date),
            mood_sad: 0,
            mood_stressed: 0,
            mood_okay: 0,
            mood_happy: 0,
            mood_calm: 0,
            mood_anxious: 0,
            mood_angry: 0,
        }
        for (const [k , v] of Object.entries(value)) {
            // k: 'day', v: 'mood
            temp[v]++;
        }
        data.push(temp)
    }

    //console.log(data)

    const colors = ['#7ce2f7', '#d8bcff', '#ffbf00', '#ffb254', '#acec6c', '#bebebe', '#ff9aa0']
    const keys = ['mood_sad', 'mood_stressed', 'mood_okay', 'mood_happy', 'mood_calm', 'mood_anxious', 'mood_angry']
    const svgs = [
        { onPress: () => console.log('Sad') },
        { onPress: () => console.log('Stressed') },
        { onPress: () => console.log('Okay') },
        { onPress: () => console.log('Happy') },
        { onPress: () => console.log('Calm') },
        { onPress: () => console.log('Anxious') },
        { onPress: () => console.log('Angry') }
    ]

    return (
        <StackedAreaChart
            style={{ height: 650, width:'100%', paddingVertical: 0 }}
            data={data}
            keys={keys}
            colors={colors}
            curve={shape.curveNatural}
            showGrid={false}
            svgs={svgs}

        />
    )
    
}

export default StackedGraph;