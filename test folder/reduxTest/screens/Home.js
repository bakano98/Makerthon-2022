import React from 'react';
import { TouchableOpacity, FlatList, StyleSheet, Text, View, SafeAreaView} from 'react-native';
import { moods } from '../moodsData';
import { useSelector } from 'react-redux';

const Item = ({ mood, date }) => (
    <View style={styles.title}>
        <Text style={styles.title}>feeling: {mood}, date: {date} </Text>
        <TouchableOpacity onPress={() => alert('Aha, you\'ve pressed the secret button!')}> 
        <Text> Smth </Text> 
        </TouchableOpacity>
    </View>
);

const Home = ({ navigation }) => {
    const renderItem = ({ item }) => (
        <Item 
            date={item.date}
            mood={item.mood}
        />
    );

    const mood = useSelector(state => state); // define this to use state :)

    return (
        <SafeAreaView styles={styles.container}>
            <Text> Feeling today: { mood.current } </Text>
            <FlatList 
                data={moods}
                renderItem={renderItem}
                keyExtractor={item => item.date}
            />
            <TouchableOpacity onPress={() => navigation.navigate('AddMoods')}>
                <Text> Click to add mood </Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: {
        fontSize: 18,
      },
});
  

export default Home;