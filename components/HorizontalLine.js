import React from 'react'

import { View, Text } from 'react-native';

import { useWindowDimensions } from 'react-native';

function HorizontalLine() {

    const { width: windowWidth, height: windowHeight } = useWindowDimensions();

    return (
        <View style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#000000",
            width: windowWidth,
        }}>
            <View style={{
                width: windowWidth * 0.25,
                backgroundColor: "#FFFFFF",
                marginTop: 10,
                borderRadius: 25,
                height: 6
            }}>
            </View>
        </View>
    )
}

export default HorizontalLine
