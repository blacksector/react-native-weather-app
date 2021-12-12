import React, { useEffect, useState, useCallback } from 'react'
import { Image, StyleSheet, Text, View } from 'react-native'

import { useFocusEffect } from '@react-navigation/native';
import { getSettings } from '../utils/store';

import convertUnits from '../utils/convertUnits';
import titleCase from '../utils/titleCase';

import { format } from "date-fns";

const DayHeader = ({ day }) => {

    const d = day[0].dt_txt.split(" ")[0].split("-");

    const [units, setUnits] = useState("celsius");
    const [stats, setStats] = useState({
        lowest: null,
        highest: null,
        icon: "",
        condition: ""
    });

    useEffect(async () => {
        let settings = await getSettings();
        console.log(settings);
        setUnits(settings.units || "celsius");
    }, [])

    useFocusEffect(
        useCallback(() => {
            async function checkSettingsUpdate() {
                const settings = await getSettings();
                setUnits(settings?.units || "celsius");
            }
            checkSettingsUpdate();
            return () => { checkSettingsUpdate(); };
        }, [])
    );


    const createStats = () => {
        let lowest = null;
        let highest = null;
        let icon = day[0].weather[0].icon;
        let condition = day[0].weather[0].description;
        for (let time of day) {
            if (lowest === null || lowest > time.main.temp_min) {
                lowest = time.main.temp_min;
            }

            if (highest === null || highest < time.main.temp_max) {
                highest = time.main.temp_max;
            }
        }
        setStats({ lowest, highest, icon, condition });
    }

    useEffect(() => {
        createStats();
    }, [])

    return (
        <View style={styles.shadowProp}>
            <View style={styles.dayViewContainer}>
                {stats.icon !== null && <Image
                    source={{ uri: `http://openweathermap.org/img/wn/${stats.icon}@2x.png` }}
                    style={{
                        width: 50,
                        height: 50
                    }}
                />}
                <View style={{ justifyContent: "center", alignItems: "center" }}>
                    <Text style={styles.text}>{
                        format(new Date(d[0], d[1] - 1, d[2]), "eeee")
                    }</Text>
                    <Text style={styles.condition}>
                        {titleCase(stats.condition)}
                    </Text>
                </View>
                <View style={{ justifyContent: "center", alignItems: "center" }}>
                    <Text style={styles.text}>
                        High: {Math.round(convertUnits(units, stats.highest) || 0)}
                    </Text>
                    <Text style={styles.text}>
                        Low: {Math.round(convertUnits(units, stats.lowest) || 0)}
                        &nbsp;
                    </Text>
                </View>
            </View>
        </View>
    )
}

export default DayHeader

const styles = StyleSheet.create({
    dayViewContainer: {
        margin: 15,
        padding: 20,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#1C1C1E",
    },
    shadowProp: {
        shadowColor: '#1C1C1E',
        shadowOffset: { width: -2, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    condition: {
        fontSize: 15,
        color: "white"
    },
    text: {
        color: "white"
    }
})
