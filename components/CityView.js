import React, { useState, useRef, useEffect, useCallback } from 'react'
import { StyleSheet, ImageBackground, View, Text, ScrollView } from 'react-native';
import { useWindowDimensions } from 'react-native';

import { useFocusEffect } from '@react-navigation/native';

import API from '../utils/api';
import * as WebBrowser from 'expo-web-browser';

import convertUnits from '../utils/convertUnits';

import BottomSheet from 'reanimated-bottom-sheet';
import HorizontalLine from '../components/HorizontalLine';
import DetailsComponent from './DetailsComponent';
import titleCase from '../utils/titleCase';

import { getSettings } from '../utils/store';

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faLocationArrow } from '@fortawesome/free-solid-svg-icons';


function CityView({ city, setHideIcons }) {

    const api = new API();

    const [randomImage, setRandomImage] = useState(Math.floor(Math.random() * 10));
    const [settings, setSettings] = useState({
        units: "celsius",
        measurement: "metric"
    });

    const { width: windowWidth, height: windowHeight } = useWindowDimensions();
    const bottomSheetRef = useRef();

    useEffect(async () => {
        let settingsData = await getSettings();
        setSettings({...settings, ...settingsData});
    }, [])

    useFocusEffect(
        useCallback(() => {
            async function checkSettingsUpdate() {
                let settingsData = await getSettings();
                setSettings({...settings, ...settingsData});
            }
            checkSettingsUpdate();
            return () => { };
        }, [])
    );

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
                <View style={{ marginLeft: "5%", width: "100%" }}>
                    {city?.data && (
                        <View style={{ flexGrow: 4, marginTop: 85 }}>
                            <View style={styles.tempContainer}>
                                <Text style={styles.tempText}>
                                    {Math.round(convertUnits(settings.units, city.data.weather.main.temp) || 0)}
                                </Text>
                                <Text style={styles.degrees}>
                                    &deg;{settings.units === "celsius" ? "C" : settings.units === "fahrenheit" ? "F" : "K"}
                                </Text>

                            </View>

                            <Text style={styles.cityText}>
                                {city.data.weather.name}
                            </Text>

                            <View style={styles.smallInfoContainer}>
                                <Text style={styles.conditionText}>
                                    {titleCase(city.data.weather.weather[0].description)}
                                </Text>
                                <Text style={styles.feelsLike}>
                                    <Text>Feels Like {Math.round(convertUnits(settings.units, city.data.weather.main.feels_like) || 0)}</Text>
                                    <Text>&deg;{settings.units === "celsius" ? "C" : settings.units === "fahrenheit" ? "F" : "K"}</Text>
                                </Text>
                            </View>
                        </View>
                    )}
                </View>
                <BottomSheet
                    ref={bottomSheetRef}
                    snapPoints={[80, windowHeight - (windowHeight * 0.20)]}
                    borderRadius={0}
                    onOpenStart={() => {
                        setHideIcons(true);
                        return true;
                    }}
                    onCloseEnd={() => {
                        setHideIcons(false);
                        return true;
                    }}
                    renderContent={() => (
                        <>
                            <HorizontalLine />
                            <ScrollView style={{
                                backgroundColor: '#000000',
                                paddingTop: 40,
                                paddingLeft: 10,
                                paddingRight: 10,
                                height: windowHeight - (windowHeight * 0.21),
                                maxWidth: windowWidth,
                                zIndex: 500
                            }}>
                                <View>
                                    <DetailsComponent settings={settings} forecast={city.data.forecast} weather={city.data.weather} />
                                    <View ><Text style={{
                                        marginTop: 25
                                    }}>Hello World!</Text></View>
                                </View>
                            </ScrollView>
                        </>
                    )}
                />
                {city.isLocation === true &&
                    <View style={styles.locationContainer}>
                        <Text style={styles.credit}>
                            <Text><FontAwesomeIcon icon={faLocationArrow} color={'#AF52DE'} /></Text>
                        </Text>
                    </View>
                }
                <View style={styles.creditContainer}>
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
        // marginLeft: "5%",
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
    creditContainer: {
        position: 'absolute',
        bottom: 100,
        left: 0,
        right: 0,
        width: "100%",
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    locationContainer: {
        position: 'absolute',
        bottom: 150,
        left: 0,
        right: 0,
        width: "100%",
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    credit: {
        color: "white",
        fontWeight: "300",
        ...shadow
    }
})


export default CityView


