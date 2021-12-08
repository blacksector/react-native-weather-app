export default function convertUnits (units, value) {
    if (units === "celsius") {
        return value - 273.5
    } else if (units === "fahrenheit") {
        return (value - 273.15) * (9 / 5) + 32;
    } else {
        return value;
    }
}