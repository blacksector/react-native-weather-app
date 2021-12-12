import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react'
import { StyleSheet, Text, View, ScrollView, Animated, Image, TouchableOpacity, Button } from 'react-native'

import { useFocusEffect } from '@react-navigation/native';
import { useWindowDimensions } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { getWeather } from '../utils/store';
import API from '../utils/api';

import Splash from './Splash';

import FeatherIconMenu from '../assets/menu.png';
import FeatherIconPlus from '../assets/plus.png';
import CityView from '../components/CityView';

import * as Location from 'expo-location';


const Home = ({ navigation }) => {

    const api = new API();
    const { width: windowWidth, height: windowHeight } = useWindowDimensions();
    const scrollX = useRef(new Animated.Value(0)).current;

    const [allData, setAllData] = useState(false);
    const [loading, setLoading] = useState(true);
    const [hideIcons, setHideIcons] = useState(false);
    const [errorMsg, setErrorMsg] = useState(false);

    // This just simplifies the data into a simple
    // list of city names as strings (this is important)
    // for the API.
    const getCities = (data) => {
        const unwrapCities = ({ city }) => ({ city });
        // We won't be using the coordinate type, only string type.
        return data?.map((item) => unwrapCities(item).city).filter(item => typeof item === 'string')
    }

    const getFromAPI = async (cities = null) => {
        return api.get(cities === null ? getCities(allData.data) : cities)
            .then(async (resp) => {
                return resp;
            })
            .catch(err => {
                // TODO: Couldn't get data from api,
                // no network, or the API is down.
                // Need a way to get a fallback image if
                // not work is down.
                console.log(err);
                return [];
            })
            .finally(() => setLoading(false));
    }

    const needsUpdate = (data) => {
        if (((Date.now() - (data.retrieved)) / 1000) > 30) {
            // Been more than 5 minutes, allow a new refresh:
            return true;
        } else {
            return false;
        }
    }

    useEffect(async () => {
        const value = await AsyncStorage.getItem('weather_data');

        // First things first, we ask the user for their location:
        let { status } = await Location.requestForegroundPermissionsAsync();
        // Permission was not granted, here we can redirect them
        // or create a button that redirects them to the AddCity page
        // and asks them to enter a new city
        if (status !== 'granted') {
            if (value === null) {
                // No data exists, user didn't allow location
                // and didn't add anything... :(
                // Let us go ahead and show them an error.
                setErrorMsg('Permission to access location was denied, how about we add a city?');
            } else {
                // City data does exist, all we need to do is simply refresh the data,
                // and make sure if the "current" location of a city does exist in
                // the storage, we remove it, simply because it'll just mess up the data
                // the user could have at some point allowed location then blocked it.
                // We don't want to show outdated information.
                let data = JSON.parse(value);
                for (let i = 0; i < data.data.length; i++) {
                    if (data.data[i].isLocation === true) {
                        // delete this guy:
                        data.data.splice(i, 1);
                    }
                }

                if (data.data.length === 0) {
                    // No cities exist, their location was the only thing
                    // we had in storage. Let's show them the error:
                    setErrorMsg('Permission to access location was denied, how about we add a city?');
                }

                setAllData(data);
                // setErrorMsg('Permission to access location was denied.');
            }
            setLoading(false);
            return;
        }
        // Permission was granted! First, we get the weather:
        let location = await Location.getCurrentPositionAsync({accuracy: Location.Accuracy.Balanced});
        // setLocation(location);

        api.getWithCoordinates(location.coords.latitude, location.coords.longitude)
            .then(async (resp) => {
                // First we have to see if there is data that exists
                // in the localstorage already:
                try {
                    if (value !== null) {
                        // There is already other cities in the list :)
                        let data = JSON.parse(value);
                        if (data.data.length !== 0) {
                            if (needsUpdate(data)) {
                                let otherCities = await getFromAPI(getCities(data.data));
                                console.log("otherCities", otherCities);
                                data.data = otherCities;
                            }
                        }

                        // Now save the new weather information:
                        // we have to first make sure that we are
                        // overwriting the "current" location 
                        // information and not another city:
                        let inserted = false;
                        for (let i = 0; i < data.data.length; i++) {
                            if (data.data[i].isLocation === true) {
                                resp[0].isLocation = true;
                                data.data[i] = resp[0];
                                inserted = true;
                            }
                        }
                        // Nothing was inserted,
                        // so, first set this as a location item
                        // then push to the array.
                        if (!inserted) { 
                            resp[0].isLocation = true;
                            data.data.push(resp[0]);
                        }

                        // Update with current time:
                        data.retrieved = Date.now();
                        // Now update the data in our state
                        setAllData(data);

                        await AsyncStorage.setItem('weather_data', JSON.stringify(data));
                    } else {
                        // It's empty!
                        resp[0].isLocation = true;
                        let data = { data: resp, retrieved: Date.now() };
                        await AsyncStorage.setItem('weather_data', JSON.stringify(data));
                        setAllData(data);
                    }
                } catch (e) {
                    console.log(e);
                    return resp;
                }
            })
            .catch(err => {
                // TODO: API crashed or no network?
                // Need a way to handle fallbacks!
                console.log(err);
                setErrorMsg('Network failure, or the API is down. Please try again later.');
                return {};
            })
            .finally(() => setLoading(false));
    }, []);

    // This is called when the screen is put back into focus
    // we need this because otherwise if the user changed
    // the state of units (from celsius to fahrenheit or kelvin)
    // also useful for when the cities list changes.
    useFocusEffect(
        useCallback(() => {
            async function checkWeatherDataUpdate() {
                const allWeatherData = await getWeather();
                if (allWeatherData.data.length === 0) {
                    setErrorMsg('It seems like you do not have a city added, how about we add one?');
                } else {
                    setErrorMsg(null);
                    setAllData(typeof allWeatherData?.retrieved === 'number' ? allWeatherData : false);
                }
            }
            checkWeatherDataUpdate();
            return () => { checkWeatherDataUpdate() };
        }, [])
    );

    if (loading) {
        return <Splash isSplash={true} />;
    }

    if (errorMsg) {
        return (<Splash>
            <Text style={{ color: "white", marginBottom: 15 }}>ERROR: {errorMsg}</Text>
            <Button color="#333" onPress={() => { navigation.navigate('AddCity'); }} title={`Add City`} />
        </Splash>);
    }

    return (
        <>
            {!hideIcons && <>
                <View style={styles.appHeader}>
                    <TouchableOpacity onPress={() => {
                        navigation.navigate("Menu");
                    }}>
                        <Image source={FeatherIconMenu} style={{ width: 25, height: 25 }} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        navigation.navigate("AddCity");
                    }}>
                        <Image source={FeatherIconPlus} style={{ width: 25, height: 25 }} />
                    </TouchableOpacity>
                </View>

                <View style={styles.indicatorWrapper}>
                    {allData && allData?.data && allData.data.map((city, index) => {
                        const width = scrollX.interpolate({
                            inputRange: [
                                windowWidth * (index - 1),
                                windowWidth * index,
                                windowWidth * (index + 1),
                            ],
                            outputRange: [5, 12, 5],
                            extrapolate: 'clamp',
                        });
                        return (
                            <Animated.View key={index} style={[styles.normalDot, { width }]} />
                        );
                    })}
                </View>
            </>
            }

            <ScrollView
                horizontal={true}
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                    { useNativeDriver: false },
                )}
                scrollEventThrottle={1}>
                {allData && allData?.data &&
                    allData.data.map((city, index) => {
                        return (<CityView key={index} city={city} setHideIcons={setHideIcons} />);
                    })
                }
            </ScrollView>
        </>
    )
};

const styles = StyleSheet.create({
    appHeader: {
        position: 'absolute',
        top: 65,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        paddingHorizontal: 20,
        zIndex: 10
    },
    indicatorWrapper: {
        position: 'absolute',
        bottom: 130,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
        elevation: 0,
    },
    normalDot: {
        height: 5,
        width: 5,
        borderRadius: 4,
        marginHorizontal: 4,
        backgroundColor: '#fff'
    },
    container: {
        flex: 1,
        padding: 55,
        backgroundColor: 'grey',

    },
    contentContainer: {
        flex: 1,
        alignItems: 'center',
        zIndex: 15,

    }
});

export default Home;