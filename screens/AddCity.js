import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, TextInput, SafeAreaView, View, FlatList, TouchableOpacity } from 'react-native'

import StatsCard from '../components/StatsCard';

import { addCity } from '../utils/store';

// Data source from: http://bulk.openweathermap.org/sample/
// Was transformed into a cityname,countrycode array
// for simple fuzzy searching and sorting: 
import cities from '../utils/cities.json';

import fuzzysort from 'fuzzysort';

const AddCity = ({ navigation }) => {

    const [search, setSearch] = useState("");
    const [filtered, setFiltered] = useState([]);
    const [refresh, setRefresh] = useState(false);

    useEffect(() => {
        if (search.trim() !== "") {
            const results = fuzzysort.go(search, cities, {
                threshold: -500, // Don't return matches worse than this (higher is faster)
                limit: 20, // Don't return more results than this (lower is faster)
                allowTypo: true, // Allwos a snigle transpoes (false is faster)
            });
            setFiltered(results);
        } else {
            setFiltered([])
        }
        setRefresh(!refresh)
    }, [search])

    return (
        <SafeAreaView>
            <StatsCard>
                <TextInput
                    style={styles.input}
                    placeholderTextColor="#f2f2f2"
                    onChangeText={setSearch}
                    value={search}
                    placeholder="Search..."
                />
            </StatsCard>
            <FlatList
                data={filtered}
                extraData={refresh}
                renderItem={({ item }) => {
                    return (<TouchableOpacity onPress={async () => { 
                            let resp = await addCity(item.target);
                            if (resp === true) {
                                navigation.goBack();
                            } else {
                                // TODO: Error handling, need to show the user something went wrong...
                                console.log("Failed to add city...?");
                            }
                        }} >
                        <StatsCard>
                            <Text style={styles.cityName}>{item.target.split(",").join(", ")}</Text>
                        </StatsCard>
                    </TouchableOpacity>
                );
                }}
                keyExtractor={(item, index) => `${item.target}${index}`}
                ListFooterComponent={<View style={{ marginTop: "5%" }}></View>}
            />
        </SafeAreaView>
    )
}

export default AddCity

const styles = StyleSheet.create({
    container: {

    },
    input: {
        color: "white",
        borderColor: "white",
        borderRadius: 25
    },
    cityName: {
        fontSize: 18,
        color: "white"
    }
})
