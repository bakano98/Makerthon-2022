import React from 'react';
import { SafeAreaView, StyleSheet, Text } from 'react-native';

const PFAScreen = () => {
    return (
        <SafeAreaView style={styles.container}>
            <Text>PFAScreen</Text>
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

export default PFAScreen;