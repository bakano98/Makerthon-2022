import React from 'react'
import { Path } from 'react-native-svg'
import { AreaChart, Grid } from 'react-native-svg-charts'
import * as shape from 'd3-shape'

function LineGraph(array, n) {
    //assumes that array is already sorted in chronological order.
    const score = { 
        mood_sad: -1,
        mood_stressed: -1,
        mood_okay: 1,
        mood_happy: 1,
        mood_calm: 1,
        mood_anxious: -1,
        mood_angry: -1,
    }

    let data = [0,];
    let origin = 0;
    const max = array.length == 0 ? 0 : Math.min(array.length, n + 1)
    for (let i = array.length - max; i < array.length; i++) {
        let curr = array[i] 
        let mood = curr.mood
        origin += score[mood];
        data.push(origin);
    }
    // console.log(data.length)
    let color;
    if (origin > 0) {
        color = ['rgb(172,236,108)','rgba(172,236,108, 0.2)'] ;
      } else if (origin < 0) {
        color = ['rgb(255,154,160)','rgba(255,154,160, 0.2)'];
      } else {
        color = ['rgb(255,191,0)','rgba(255,191,0, 0.2)'];
      }
    

    const Line = ({ line }) => (
        <Path
            key={'line'}
            d={line}
            stroke={color[0]}
            fill={'none'}
        />
    )

    return (
        <AreaChart
            style={{ height: 200, width: 350}}
            data={data}
            contentInset={{ top: 30, bottom: 30 }}
            curve={shape.curveNatural}
            svg={{ fill: color[1] }}
        >
            <Grid/>
            <Line/>
        </AreaChart>
    )
    
}

export default LineGraph;