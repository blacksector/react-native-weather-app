import React, { useState } from 'react'

import { StyleSheet, ImageBackground, View, Text } from 'react-native';

import { useWindowDimensions } from 'react-native';

import * as WebBrowser from 'expo-web-browser';

import convertUnits from '../utils/convertUnits';

function CityView({ city, getDetails }) {

    const { width: windowWidth, height: windowHeight } = useWindowDimensions();
    const [units, setUnits] = useState("celsius");
    const [randomImage, setRandomImage] = useState(Math.floor(Math.random() * 10));

    

    const getBackground = (city) => {
        return city.data.images.results[randomImage].urls.regular || city.data.images.results[0].urls.regular;
    }

    return (
        <ImageBackground source={{ uri: getBackground(city) }} resizeMode="cover" style={{
            justifyContent: "flex-end",
            alignItems: "flex-start",
            width: windowWidth,
            height: windowHeight
        }} blurRadius={10}>
            <View style={styles.container}>
                {city?.data && (
                    <View style={{ flexGrow: 4, marginTop: 85 }}>
                        <View style={styles.tempContainer}>
                            <Text style={styles.tempText}>
                                {Math.round(convertUnits(units, city.data.weather.main.temp) || 0)}
                            </Text>
                            <Text style={styles.degrees}>
                                &deg;{units === "celsius" ? "C" : units === "fahrenheit" ? "F" : "K"}
                            </Text>

                        </View>

                        <Text style={styles.cityText}>
                            {city.data.weather.name}
                        </Text>

                        <View style={styles.smallInfoContainer}>
                            <Text style={styles.conditionText}>
                                {city.data.weather.weather[0].description}
                            </Text>
                            <Text style={styles.feelsLike}>
                                <Text>Feels Like {Math.round(convertUnits(units, city.data.weather.main.feels_like) || 0)}</Text>
                                <Text>&deg;{units === "celsius" ? "C" : units === "fahrenheit" ? "F" : "K"}</Text>
                            </Text>
                            <Text
                                style={styles.detailsText}
                                onPress={() => {
                                    getDetails({city, randomImage, units})
                                }}>
                                View Details
                            </Text>
                        </View>


                    </View>
                )}
                <View style={{
                    flex: 1,
                    flexGrow: 1,
                    justifyContent: "center",
                    alignItems: "flex-end",
                }}>
                    <Text style={styles.credit}>
                        <Text>Photo by </Text>
                        <Text style={{ textDecorationLine: "underline" }} onPress={() => {
                            WebBrowser.openBrowserAsync(city.data.images.results[randomImage].user.links.html)
                        }}>{city.data.images.results[randomImage].user.name}</Text>
                        <Text> on </Text>
                        <Text style={{ textDecorationLine: "underline" }} onPress={() => {
                            WebBrowser.openBrowserAsync("https://unsplash.com/");
                        }}>Unsplash</Text>
                    </Text>
                </View>
            </View>
        </ImageBackground>
    )
}

const shadow = {
    textShadowRadius: 5,
    textShadowOffset: { width: 2, height: 2 },
    textShadowColor: "#333333"
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginLeft: "5%",
        marginTop: "10%"
    },
    tempContainer: {
        marginTop: 50,
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
    detailsText: {
        color: "white",
        textDecorationLine: "underline",
        ...shadow
    },
    credit: {
        color: "white",
        fontWeight: "300",
        ...shadow
    }
})


export default CityView


