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
            backgroundColor: "white",
            width: windowWidth,
        }}>
            <View style={{
                width: windowWidth * 0.25,
                backgroundColor: "#D3D3D3",
                marginTop: 10,
                borderRadius: 25,
                height: 6
            }}>
                <Text>&nbsp;</Text>
            </View>
        </View>
    )
}

export default HorizontalLine
