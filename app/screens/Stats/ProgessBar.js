import React from 'react'
import { ProgressCircle } from 'react-native-svg-charts'
import { getProgress } from './DataProcessing';

function ProgressBar(dictionary) {
     // takes in data as a dictionary
    return (
        <ProgressCircle
            style={ { height: 140, width:140} }
            progress={ getProgress(dictionary) }
            progressColor={'rgb(255, 178, 84)'}
            startAngle={ 2 * Math.PI * 1 }
            endAngle={ 0 }
            strokeWidth={ 30 }
            backgroundColor='#c0c0c0'
        />
        
    )
}


export default ProgressBar