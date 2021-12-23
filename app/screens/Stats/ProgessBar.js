import React from 'react'
import { ProgressCircle } from 'react-native-svg-charts'
import * as dateFn from 'date-fns';

function ProgressBar(dictionary) {
     // takes in data as a dictionary
     function getProgress(dictionary) {
        const now = new Date();
        const currMonth = dateFn.getMonth(now);
        const currYear = dateFn.getYear(now);
        const currWeek = dateFn.getWeek(now);
        
        if (dictionary == -1 
            || dictionary[currYear] == undefined
            || dictionary[currYear][currMonth] == undefined) {
            return 0; 
        }
        const maxDays = dateFn.getDate(dateFn.lastDayOfMonth(now));
        
        return ( Object.values(dictionary[currYear][currMonth]).length / maxDays )
    }
    const progress = getProgress(dictionary)
    
    return (
        <ProgressCircle
            style={ { height: 140, width:140} }
            progress={ progress }
            progressColor={'rgb(255, 178, 84)'}
            startAngle={ 2 * Math.PI * 1 }
            endAngle={ 0 }
            strokeWidth={ 30 }
            backgroundColor='#c0c0c0'
        />
    )
}



export default ProgressBar