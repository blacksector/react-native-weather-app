import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Text } from 'react-native'

import { format, formatDistance } from "date-fns";

// import DayView from './DayView';
import DayHeader from './DayHeader';
import StatsCard from './StatsCard';

const DetailsComponent = ({ forecast }) => {

    const [loading, setLoading] = useState(true);
    const [days, setDays] = useState(null);
    const [showSunFocus, setShowSunFocus] = useState("both");

    const sortForecast = () => {
        let sortedDays = {};
        for (let date of forecast.list) {
            let tempDate = date.dt_txt.split(" ")[0];
            if (tempDate in sortedDays) {
                sortedDays[tempDate].push(date);
            } else {
                sortedDays[tempDate] = [date];
            }
        }
        setDays(sortedDays);
        // Let's calculate if sunrise is next or sunset.
        // If sunrise is within +-30 mins of the current time
        // show only sunrise, and vice-versa for sunset.
        // If it doesn't fall within those time frames, then
        // simply show the AM/PM values for both.
        if (Math.abs((Date.now() / 1000) - (forecast.city.sunrise + forecast.city.timezone )) <= 1800) {
            setShowSunFocus("sunrise")
        } else if (Math.abs((Date.now() / 1000) - (forecast.city.sunset + forecast.city.timezone)) <= 1800) {
            setShowSunFocus("sunset")
        } else {
            setShowSunFocus("both");
        }

    }

    // We need this so that we can show
    // the current time in the specified 
    // timezone. This was a hard one.
    const calculateOffset = (time) => {
        let d = new Date();
        return new Date(
            new Date(time*1000).getTime() + // Get the Unix timestamp
            (d.getTimezoneOffset() * 60000) + // Add the current TZ offset (now it's 'UTC')
            (forecast.city.timezone * 1000) // finally add the timezone offset we need.
        );
    }

    useEffect(() => {
        sortForecast();
    }, [])

    useEffect(() => {
        if (days !== null) {
            console.log(days);
            setLoading(false);
        }
    }, [days])

    if (loading) {
        return <View><Text>Loading...</Text></View>
    }

    return (
        <View>
            <Text style={styles.heading}>
                {forecast.city.name} {forecast.city.country}
            </Text>
            <Text style={styles.subHeading}>
                {format(new Date(), "eeee, MMM do, y")}
            </Text>
            <View style={styles.sideBySide}>
                {(showSunFocus === "sunrise" || showSunFocus === "both") &&
                    <StatsCard>
                        <Text style={styles.text}>Sunrise</Text>
                        {showSunFocus === "sunrise" &&
                            <Text style={styles.text}>
                                {formatDistance(forecast.city.sunrise * 1000, new Date(), { addSuffix: true })}
                            </Text>
                        }
                        {showSunFocus === "both" && 
                            <Text style={styles.text}>
                                {format(calculateOffset(forecast.city.sunrise), 'h:mm aa')}
                            </Text>
                        }
                    </StatsCard>
                }

                {(showSunFocus === "sunset" || showSunFocus === "both") &&
                    <StatsCard>
                        <Text style={styles.text}>Sunset</Text>
                        {showSunFocus === "sunset" &&
                            <Text style={styles.text}>
                                {formatDistance(forecast.city.sunset * 1000, new Date(), { addSuffix: true })}
                            </Text>
                        }
                        {showSunFocus === "both" && 
                            <Text style={styles.text}>
                                {format(calculateOffset(forecast.city.sunset), 'h:mm aa')}
                            </Text>
                        }
                    </StatsCard>
                }

            </View>
            {days !== false &&
                Object.keys(days).map((day, index) => {
                    return <DayHeader day={days[day]} key={index} />
                })
            }
        </View>
    )
}


const styles = StyleSheet.create({
    heading: {
        fontSize: 35,
        textAlign: "center",
        color: "white",
        marginBottom: 10
    },
    subHeading: {
        fontSize: 20,
        textAlign: "center",
        color: "white",
        marginBottom: 30
    },
    text: {
        color: "white"
    },
    sideBySide: {
        // display: "flex",
        flexDirection: "row",
        justifyContent: "space-around",
        width: "100%"
    }
})

export default DetailsComponent



