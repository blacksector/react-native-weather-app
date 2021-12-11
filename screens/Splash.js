import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

const Splash = (props) => {
    return (
        <View style={styles.container}>
            {props.isSplash ? <Text style={styles.text}>Another Weather App</Text> : props.children}
        </View>
    )
}

export default Splash

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#5856D6",
        padding: 10,
        textAlign: "center"
    },
    text: {
        fontSize: 25,
        color: "white"
    }
})
