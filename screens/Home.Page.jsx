import { View, Text, StyleSheet, ImageBackground, Image, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import Icon from 'react-native-vector-icons/FontAwesome';

const HomePage = () => {
    const currentDate = new Date();
    const hour = currentDate.getHours();
    // Ok ici c'est GPT, j'avais la flemme de bien réfléchir sur ce cas là x')
    const getDaySuffix = (day) => {
        if (day >= 11 && day <= 13) {
            return 'th';
        }
        const lastDigit = day % 10;
        switch (lastDigit) {
            case 1:
                return 'st';
            case 2:
                return 'nd';
            case 3:
                return 'rd';
            default:
                return 'th';
        }
    };
    const formattedDay = `${currentDate.toLocaleDateString('en-US', { weekday: 'long' })} ${currentDate.getDay()}${getDaySuffix(currentDate.getDay())}`;
    // fin GPT

    const [currentWeatherPic, setCurrentWeatherPic] = useState('');
    const [textColor, setTextColor] = useState('#333');

    function setPic() {
        if (hour >= 17) {
            setCurrentWeatherPic(require('../assets/night_weather.jpg'));
            setTextColor('#fff');
        } else {
            setCurrentWeatherPic(require('../assets/sunny_weather.jpg'));
        }
    }

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thrusday', 'Friday', 'Saturday', 'Sunday']

    useEffect(() => {
        setPic();
    }, [currentWeatherPic]);

    return (
        <View style={styles.container}>
            <View style={styles.topSide}>
                <ImageBackground style={styles.currentWeather} source={currentWeatherPic}>
                    <View style={styles.topElements}>
                        <View>
                            <Text style={[styles.currentDay, { color: textColor }]}>{formattedDay}</Text>
                            <Image
                                style={styles.heartList}
                                source={
                                    hour >= 17
                                        ? require('../assets/heart_list_icon_white.png')
                                        : require('../assets/heart_list_icon.png')
                                }
                            />
                        </View>
                        <View>
                            <Icon style={styles.searchIcon} name="search" />
                            <Icon style={[styles.heartIcon, { color: textColor }]} name="heart-o" />
                        </View>
                    </View>
                    <View>
                        <Text style={[styles.textsTopSide, { color: textColor }]}>Paris</Text>
                        <Text style={[styles.textsTopSide, { color: textColor }]}>26°C</Text>
                        <Text style={[styles.textsTopSide, { color: textColor }]}>Sunny</Text>
                        <Text style={[styles.textsTopSide, { color: textColor }]}>↓19° ↑27°</Text>
                    </View>
                </ImageBackground>
            </View>

            <View style={styles.bottomSide}>
                <ScrollView>
                    {
                        days.map((day, index) => (
                            <View key={index} style={[styles.viewListDay, { borderBottomWidth: index == days.length - 1 ? 0 : 1 }]}>
                                <Text style={styles.textsBottomSide}>
                                    {day} <Image style={styles.heartList} source={require("../assets/sunny_icon.png")} /> 28°C
                                </Text>
                            </View>
                        ))
                    }
                </ScrollView>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F1EEEE",
    },
    // START TOP CSS
    topSide: {
        flex: 1,
    },
    currentWeather: {
        flex: 1,
    },
    topElements: {
        marginTop: 30,
        flexDirection: "row",
        marginLeft: "2%",
        justifyContent: "space-between",
    },
    currentDay: {
        fontSize: 32,
        fontWeight: '100'
    },
    searchIcon: {
        fontSize: 25,
        color: "#fff"
    },
    heartList: {
        height: 50,
        width: 50
    },
    heartIcon: {
        marginTop: 20,
        fontSize: 35,
        color: "#000",
    },
    textsTopSide: {
        fontSize: 32,
        textAlign: "center"
    },
    // START BOTTOM CSS
    bottomSide: {
        height: "40%",
        width: "100%",
        flex: 1,
    },
    viewListDay: {
        borderBottomWidth: 1,
        width: "80%",
        alignSelf: "center",
    },
    textsBottomSide: {
        fontSize: 20,
        textAlign: "center",
        marginBottom: 5
    }
});

export default HomePage;
