import React from 'react';
import  {View } from 'react-native';
import { Path } from 'react-native-svg';
import { AreaChart, Grid, YAxis } from 'react-native-svg-charts';
import * as shape from 'd3-shape';
import * as dateFn from 'date-fns';
import {getWeek} from './DataProcessing';

let date = new Date();
let month = dateFn.getMonth(date);
let year = dateFn.getYear(date);
let week = dateFn.getWeek(date);

function  slidingWindow(array, size) {
    let result  = [];
    if (array.length < size) {return array;}
    for (let i = 0; i <= array.length - size; i++) {
        let sum = 0;
        for (let j = 0; j < size; j++) {
            sum += array[i + j];
        }
        result.push(decimalPlace(sum / size, 1));
    }
    return result;
}

function decimalPlace(value, n) {
    if (n === 0) {return Math.round(value)};
    let dp = n * 10;
    return Math.round(value * dp) / dp
}


function LineGraph(array, size, period) {
    // assumes that array is already sorted in chronological order.
    // n is the size of the array
    // period is the command = {'week', 'month', 'year'}
    const score = [1, 0, 1, -1, -1, -1, -1];
  // happy, okay, calm, sad, stressed, angry, anxious.

    let filteredArray;
    if (period === 'week') {
        filteredArray = array.filter((x) => getWeek(x.key) === week)
        // console.log('week filtered', filteredArray)
    } else if (period === 'month') {
        filteredArray = array.filter((x) => x.month === month)
    } else if (period === 'year') {
        filteredArray = array.filter((x) => x.year === year)
    } else {
        filteredArray = [...array]
    }
    
        
    /*
    let origin = 0;
    const max = array.length === 0 ? 0 : Math.min(array.length, n + 1)
    for (let i = array.length - max; i < array.length; i++) {
        let curr = array[i] 
        let mood = curr.mood
        origin += score[mood];
        data.push(origin);
    }
    // console.log(data.length)
    */
    let data = [0,] // filteredArray.length < size ? [0,] : [];
    data.push(...slidingWindow(filteredArray.map((x) => score[x.moodValue - 1]), size));

    // console.log('data', data)
    const variableColor = (bool) => {
        if (bool) {
            const netChange = data[data.length - 1] - data[0];
            //console.log('netchange',netChange)
            if (netChange > 0) {
                return ['rgb(172,236,108)','rgba(172,236,108, 0.2)'];
            } else if (netChange < 0) {
                return ['rgb(255,154,160)','rgba(255,154,160, 0.2)'];
            } else {
                return ['rgb(255,191,0)','rgba(255,191,0, 0.2)'];
            }
        } else {
            return ['rgb(255,191,0)','rgba(255,191,0, 0.2)'];
        }
    }

    const color = variableColor(false);
    
    

    const Line = ({ line }) => (
        <Path
            key={'line'}
            d={line}
            stroke={color[0]}
            fill={'none'}
        />
    )

    const contentInset = { top: 25, bottom: 25 }

    return (
        <View style={ {
            height: 200,
            flexDirection: 'row',
            }}>
        <YAxis
         data={data}
         contentInset={ contentInset }
         svg={{
           fill: 'grey',
           fontSize: 10,
         }}
         //formatLabel={ value => renderOnlyOneDP(value) !== -1 ? (value > 0 ? `+${renderOnlyOneDP(value,2)}` : `${renderOnlyOneDP(value, 2)}`) : ''}
         formatLabel={ value => 
            value === data[data.length - 1] 
            || value === Math.min(...data)
            || value === Math.max(...data)
            || value === data[0] 
            || value === 0 ? (value > 0 ? `+${value}` : `${value}`) : ''}
        />
        <AreaChart
            style={{height: 200, width: 250}}
            data={data}
            contentInset={{ top: 25, bottom: 25 }}
            curve={shape.curveNatural}
            svg={{ fill: color[1] }}
        >   
            <Grid/>
            <Line/>
        </AreaChart>
        </View>
    )
    
}


export default LineGraph;