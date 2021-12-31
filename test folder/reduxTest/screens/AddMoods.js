import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TouchableOpacity, StyleSheet, Text, View } from 'react-native';
import { MOOD_CHANGE } from '../redux/moodReducer';



const AddMoods = () => {
    const dispatch = useDispatch();
    const mood = useSelector(state => state);
    const changeMoods = moodIndex => dispatch({type: MOOD_CHANGE, payload: moodIndex})

    return (
        <View styles={styles.container}>
            <Text> Add moods here </Text>

            {/* Creating buttons from the possible moods */}
            {   mood.possible.map((moods, index) => (
                <TouchableOpacity key={moods} onPress={() => changeMoods(index)}> 
                    <Text> change to {moods} </Text>
                </TouchableOpacity>
                ))
            }
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
});
  

export default AddMoods;