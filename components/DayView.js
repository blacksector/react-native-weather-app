/*
 * We decided as a team to not include the day view
 * this is something we plan to do for the future
 * but for the purposes of the assignment we will
 * skip over this portion for now.
 */

import React, { useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'

import { format, formatDistance } from "date-fns";



const DayView = ({ day }) => {

    console.log(day);

    return (
        <View style={{
            display: "flex",
            flexDirection: "row",
            overflowX: "scroll",
            justifyContent: "center",
            alignItems: "center"
        }}>
            {day.map((time, index) => <Text style={styles.text}>
                {format(new Date(time.dt * 1000), "eeee")}
            </Text>)}
        </View>
    )
}

export default DayView

const styles = StyleSheet.create({
    text: {
        color: "white"
    }
})
