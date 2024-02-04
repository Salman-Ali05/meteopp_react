import { View, Text, StyleSheet, Image, ImageBackground, ScrollView } from 'react-native'
import React, { useState, useEffect } from 'react'
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';

const Favorites = ({ route }) => {
    const navigation = useNavigation();
    const currentDate = new Date();
    const hour = currentDate.getHours();

    const [currentWeatherPic, setCurrentWeatherPic] = useState(require('../assets/sunny_weather.jpg'));
    const [textColor, setTextColor] = useState('#333');

    const { towns } = route.params;

    useEffect(() => {
        setPic();
    }, []);

    function setPic() {
        if (hour >= 17) {
            setCurrentWeatherPic(require('../assets/fav_night.jpg'));
            setTextColor('#fff');
        } else {
            setCurrentWeatherPic(require('../assets/fav_sunny.jpg'));
        }
    }

    return (
        <View style={styles.container}>
            <Icon name="arrow-left" size={30} color="#333" onPress={() => navigation.navigate("Home")} />
            <ScrollView>
                {
                    towns.length > 0 ?
                        <>
                            {
                                towns.map((town, index) => (
                                    <View style={styles.rowFavorite} key={index}>
                                        <ImageBackground style={[styles.currentWeather]} source={currentWeatherPic}>
                                            <Text style={[styles.town, { color: textColor }]}>{town}</Text>
                                            <View style={styles.icon_degree}>
                                                <Image style={styles.iconWeather} source={require("../assets/sunny_icon.png")} />
                                                <Text style={[styles.degree, { color: textColor }]}>28 °C</Text>
                                            </View>
                                        </ImageBackground>
                                    </View>
                                ))}
                        </>
                        : ""
                }
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F1EEEE",
        marginTop: 30,
        marginLeft: 7
    },
    rowFavorite: {
        alignItems: "center",
        width: "100%",
        marginTop: 30,
    },
    iconWeather: {
        width: 50,
        height: 50,
    },
    currentWeather: {
        width: "99%",
        borderRadius: 15,
        overflow: 'hidden',
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        height: 150,
        marginBottom: 25
    },
    town: {
        fontSize: 40,
        marginLeft: 25
    },
    degree: {
        fontSize: 25,
    },
    icon_degree: {
        flexDirection: "row",
        alignItems: "center",
        marginRight: 15
    }
})

export default Favorites;
