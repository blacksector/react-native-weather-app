import React, { useEffect, useState, useRef } from 'react'
import { StyleSheet, Text, View, ScrollView, Animated, Image, TouchableOpacity } from 'react-native'

import { useWindowDimensions } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import API from '../utils/api';


import FeatherIconMenu from '../assets/menu.png';
import FeatherIconPlus from '../assets/plus.png';
import FeatherIconSearch from '../assets/search.png';
import CityView from '../components/CityView';

const Home = ({ navigation }) => {

    const api = new API();
    const { width: windowWidth, height: windowHeight } = useWindowDimensions();
    const scrollX = useRef(new Animated.Value(0)).current;

    const [allData, setAllData] = useState(false);
    const [loading, setLoading] = useState(true);

    const getDetails = (data) => {
        navigation.navigate("Details", {
            ...data
        });
    }

    const getFromAPI = async () => {
        return api.get(["Toronto", "Dhaka", "Azores", "Tehran", "London"])
            .then(async (resp) => {
                try {
                    let data = { data: resp, retrieved: Date.now() };
                    await AsyncStorage.setItem('weather_data', JSON.stringify(data));
                    return data;
                } catch (e) {
                    console.log(e);
                    return resp;
                }
            })
            .catch(err => {
                console.log(err);
                return {};
            })
            .finally(() => setLoading(false));
    }

    const getWeather = async (forced = false) => {
        if (forced) {
            setAllData(await getFromAPI());
            return;
        }
        try {
            const value = await AsyncStorage.getItem('weather_data')
            if (value === null) {
                setAllData(await getFromAPI());
            } else {
                // Check to see that the data is recent
                let data = JSON.parse(value);
                if (((Date.now() - (data?.retrieved)) / 1000) > 300) {
                    // Been more than 5 minutes, allow a new refresh:
                    setAllData(await getFromAPI());
                } else {
                    setAllData(data);
                }
            }
        } catch (e) {
            // error reading value
            console.log(e);
        }
        setLoading(false);
    }

    useEffect(() => {
        getWeather();
    }, []);

    if (loading) {
        return <View style={styles.container}><Text>Loading...</Text></View>;
    }

    return (
        <>
            <View style={styles.appHeader}>
                <TouchableOpacity onPress={() => { }}>
                    <Image source={FeatherIconMenu} style={{ width: 25, height: 25 }} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { }}>
                    <Image source={FeatherIconPlus} style={{ width: 25, height: 25 }} />
                </TouchableOpacity>
            </View>

            <ScrollView
                horizontal={true}
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={Animated.event(
                    [{nativeEvent: {contentOffset: {x: scrollX}}}],
                    { useNativeDriver: false },
                )}
                scrollEventThrottle={1}>
                {allData && allData?.data &&
                    allData.data.map((city, index) => {
                        return (<CityView key={index} city={city} getDetails={getDetails}/>);
                    })
                }
            </ScrollView>
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
        bottom: 100,
        left: 20,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    normalDot: {
        height: 5,
        width: 5,
        borderRadius: 4,
        marginHorizontal: 4,
        backgroundColor: '#fff',
    }
});

export default Home;