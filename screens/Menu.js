import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, ScrollView, FlatList, Button, SafeAreaView } from 'react-native'

import { useTheme } from '@react-navigation/native'

import API from '../utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { formatDistance } from "date-fns";
import StatsCard from '../components/StatsCard';

const Menu = () => {

    const api = new API();
    const { colors } = useTheme();
    const [data, setData] = useState(false);

    const getData = async () => {
        let value = await AsyncStorage.getItem('weather_data');
        if (value !== null) {
            setData(JSON.parse(value));
        }
    }

    useEffect(() => {
        getData();
    }, [])


    return (
        <View style={styles.container}>
            <SafeAreaView>
                <FlatList
                    data={data.data}
                    ListHeaderComponent={
                        <>
                            <Text style={[styles.header, { color: colors.text }]}>
                                Another Weather App
                            </Text>
                            <Text style={{ color: colors.text }}>
                                Our goal is to build a beautiful weather app that you enjoy using.
                            </Text>
                            <View style={{ marginTop: 30 }}>
                                {data && <>
                                    <Text style={[{ color: colors.text }, styles.cityTitle]}>Cities</Text>

                                </>
                                }
                            </View>
                        </>
                    }
                    renderItem={({ item }) => {
                        return (
                            <StatsCard>
                                <View style={styles.sideBySide}>
                                    <Text style={[{ color: colors.text }, styles.cityNames]}>{item.data.weather.name}</Text>
                                    {!item.data.isLocation &&
                                        <Button
                                            onPress={() => { console.log("Cool"); }}
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
