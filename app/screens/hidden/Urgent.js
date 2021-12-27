import React from 'react';
import { SafeAreaView, StyleSheet, Text } from 'react-native';

const Urgent = () => {
    return (
        <SafeAreaView style={styles.container}>
            <Text>Urgent screen</Text>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
    }
})

export default Urgent;