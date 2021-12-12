import AsyncStorage from '@react-native-async-storage/async-storage';
import API from './api';


const getSettings = async () => {
    const value = await AsyncStorage.getItem('settings_data');
    if (value === null) {
        return {};
    }
    return JSON.parse(value);
}

const updateSettings = async (settings) => {
    const value = await AsyncStorage.getItem('settings_data');
    if (value === null) {
        return await AsyncStorage.setItem('settings_data', JSON.stringify(settings));
    } else {
        let data = JSON.parse(value);
        return await AsyncStorage.setItem('settings_data', JSON.stringify({ ...data, ...settings }));
    }
}

const getWeather = async () => {
    const value = await AsyncStorage.getItem('weather_data');
    if (value === null) {
        return {};
    }
    return JSON.parse(value);
}

const updateWeather = async (settings) => {
    const value = await AsyncStorage.getItem('weather_data');
    if (value === null) {
        return await AsyncStorage.setItem('weather_data', JSON.stringify(settings));
    } else {
        let data = JSON.parse(value);
        return await AsyncStorage.setItem('weather_data', JSON.stringify({ ...data, ...settings }));
    }
}

const addCity = async (cityName) => {
    const api = new API();
    const data = await getWeather();
    return api.get([cityName])
        .then(async (resp) => {
            
            if (Object.keys(data).length !== 0) {
                let added = false;
                // First let's see if the city has already been
                // added to our list, if it has, overwrite the data
                // and then set it into storage.
                for (let i = 0; i < data.data.length; i++) {
                    if (data.data[i].data.weather.id === resp[0].data.weather.id) {
                        // Replace the current data with updated information
                        data.data[i] = resp[0];
                        added = true;
                        break;
                    }
                }
                if (!added) { data.data.push(resp[0]); }
                await updateWeather(data);
            } else {
                await updateWeather({ data: resp, retrieved: Date.now()  });
            }
            
            return true;
        })
        .catch(err => {
            // Failed to add city :(
            console.log(err);
            return false;
        });
}

const removeCity = async (cityId) => {
    const data = await getWeather();

    for (let i = 0; i < data.data.length; i++) {
        if (data.data[i].data.weather.id === cityId) {
            // Replace the current data with updated information
            data.data.splice(i, 1);
            await updateWeather(data);
            return true;
        }
    }

    return false;

}

export { getSettings, updateSettings, getWeather, updateWeather, addCity, removeCity }