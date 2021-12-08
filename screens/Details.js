import React, { useState } from 'react'
import { StyleSheet, Text, View, ImageBackground } from 'react-native'

import { useWindowDimensions } from 'react-native';

import convertUnits from '../utils/convertUnits';

const Details = ({ route, navigation }) => {

    const { city, randomImage, units } = route.params;
    const { width: windowWidth, height: windowHeight } = useWindowDimensions();

    const windDirection = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW", "N"];

    navigation.setOptions({ title: city.city });

    const getBackground = (city) => {
        return city.data.images.results[randomImage].urls.regular || city.data.images.results[0].urls.regular;
    }

    return (
        <View style={styles.container}>
            <ImageBackground source={{ uri: getBackground(city) }} resizeMode="cover" style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                width: windowWidth,
                height: windowHeight
            }} blurRadius={50}>
                <View style={styles.tempContainer}>
                    <Text style={styles.tempText}>
                        {Math.round(convertUnits(units, city.data.weather.main.temp) || 0)}
                    </Text>
                    <Text style={styles.degrees}>
                        &deg;{units === "celsius" ? "C" : units === "fahrenheit" ? "F" : "K"}
                    </Text>

                </View>

                <View style={styles.smallInfoContainer}>
                    <Text style={styles.conditionText}>
                        {city.data.weather.weather[0].description}
                    </Text>
                    <Text style={styles.feelsLike}>
                        <Text>Feels Like {Math.round(convertUnits(units, city.data.weather.main.feels_like) || 0)}</Text>
                        <Text>&deg;{units === "celsius" ? "C" : units === "fahrenheit" ? "F" : "K"}</Text>
                    </Text>
                </View>
            </ImageBackground>
        </View>
    )
}

export default Details

const shadow = {
    textShadowRadius: 5,
    textShadowOffset: { width: 2, height: 2 },
    textShadowColor: "#333333"
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // marginTop: 100,
        justifyContent: "flex-start",
        alignItems: "center",
        width: '100%',
        height: '100%'
    },
    tempContainer: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "flex-start"
    },
    tempText: {
        color: "white",
        paddingRight: 5,
        fontSize: 120,
        lineHeight: 120,
        fontWeight: "200",
        display: "flex",
        ...shadow
    },
    degrees: {
        color: "white",
        padding: 5,
        fontSize: 20,
        lineHeight: 20,
        fontWeight: "500",
        ...shadow
    },
    smallInfoContainer: {
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "flex-start"
    },
    conditionText: {
        color: "white",
        fontSize: 20,
        ...shadow
    },
    feelsLike: {
        color: "white",
        fontSize: 18,
        ...shadow
    },
    cityText: {
        color: "white",
        fontSize: 45,
        fontWeight: "300",
        textAlign: "left",
        ...shadow
    },
})
