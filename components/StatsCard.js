import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

const StatsCard = (props) => {
    return (
        <View style={styles.cardContainer}>
            {props.children}
        </View>
    )
}

export default StatsCard

const styles = StyleSheet.create({
    cardContainer: {
        margin: 10,
        padding: 15,
        backgroundColor: "#1C1C1E"
    }
})
