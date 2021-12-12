import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, ScrollView, FlatList, Button, SafeAreaView, Animated } from 'react-native'

import { useTheme } from '@react-navigation/native'

import API from '../utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { formatDistance } from "date-fns";
import StatsCard from '../components/StatsCard';

import SwitchSelector from "react-native-switch-selector";

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';

import { getSettings, updateSettings, getWeather, removeCity } from '../utils/store';

const Menu = () => {

    const api = new API();
    const { colors } = useTheme();
    const [data, setData] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [settings, setSettings] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(async () => {
        setData(await getWeather() || {});
        setSettings(await getSettings() || {});
        setLoading(false);
    }, [])

    return (
        <View style={styles.container}>
            {!loading &&
                <SafeAreaView>
                    <FlatList
                        data={data.data}
                        extraData={refresh}
                        ListHeaderComponent={
                            <>
                                <Text style={[styles.header, { color: colors.text }]}>
                                    Another Weather App
                                </Text>
                                <Text style={{ color: colors.text }}>
                                    Our goal is to build a beautiful weather app that you enjoy using.
                                </Text>
                                <View style={{ marginTop: 30, marginBottom: 5 }}>
                                    {data && <><Text style={[{ color: colors.text }, styles.cityTitle]}>Units</Text></>}
                                </View>
                                <SwitchSelector
                                    options={[
                                        { label: "Celsius", value: "celsius" },
                                        { label: "Fahrenheit", value: "fahrenheit" },
                                        { label: "Kelvin", value: "kelvin" }
                                    ]}
                                    initial={settings.units === "kelvin" ? 2 : (settings.units === "fahrenheit" ? 1 : 0)}
                                    onPress={value => updateSettings({ units: value })}
                                    textColor={"black"} //'#7a44cf'
                                    selectedColor={"white"}
                                    buttonColor={"#1C1C1E"}
                                    borderColor={"#1C1C1E"}
                                    hasPadding
                                />
                                <View style={{ marginTop: 30 }}>
                                    {data && <><Text style={[{ color: colors.text }, styles.cityTitle]}>Cities</Text></>}
                                </View>
                            </>
                        }
                        renderItem={({item, index}) => {
                            return (
                                <StatsCard>
                                    <View style={styles.sideBySide}>
                                        <Text style={[{ color: colors.text }, styles.cityNames]}>{item.data.weather.name}</Text>
                                        {!item.data.isLocation &&
                                            <Button
                                                onPress={async () => { 
                                                    if (await removeCity(item.data.weather.id)) {
                                                        console.log("Deleted city...");
                                                        let newData = data
                                                        newData.data.splice(index, 1)
                                                        setData(newData);
                                                        setRefresh(!refresh);
                                                    }
                                                }}
                                                title="Delete"
                                            />
                                        }
                                    </View>
                                </StatsCard>
                            );
                        }}
                        keyExtractor={item => (typeof item.city === 'string' ? item.city : `${item.city.lat}-${item.city.long}`)}
                        ListFooterComponent={
                            <View>
                                {data && data?.retrieved &&
                                    <Text style={[styles.footer, { color: colors.text }]}>
                                        Weather Data Last Updated: {formatDistance(data.retrieved, new Date(), { addSuffix: true })}
                                    </Text>
                                }
                            </View>
                        }

                    />
                </SafeAreaView>
            }
        </View>
    )
}

export default Menu

const styles = StyleSheet.create({
    container: {
        margin: 20,
        flex: 1
    },
    sideBySide: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%"
    },
    header: {
        fontSize: 25
    },
    cityTitle: {
        fontSize: 25
    },
    cityNames: {
        fontSize: 20
    },
    footer: {
        textAlign: "center"
    }
})
