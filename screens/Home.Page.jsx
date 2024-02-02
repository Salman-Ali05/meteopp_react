import { View, Text, StyleSheet, ImageBackground, Image } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/FontAwesome';

const HomePage = () => {


    return (
        <View style={styles.container}>
            <View style={styles.topSide}>
                <ImageBackground style={styles.currentWeather} source={require('../assets/sunny_weather.jpg')}>
                    <View style={styles.topElements}>
                        <View>
                            <Text style={styles.currentDay}>Tuesday 30th</Text>
                            <Image style={styles.heartList} source={require('../assets/heart_list_icon.png')} />
                        </View>
                        <View>
                            <Icon style={styles.searchIcon} name="search" />
                            <Icon style={styles.heartIcon} name="heart-o" />
                        </View>
                    </View>
                    <View>
                        <Text>Current place</Text>
                        <Text>Current degree</Text>
                        <Text>Current state</Text>
                        <Text>UP and DOWN</Text>
                    </View>
                </ImageBackground>
            </View>

            <View style={styles.bottomSide}>
                <View>
                    <Text>Day</Text>
                    <Text>Degree °C</Text>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    topSide : {
        flex: 1,
    },
    currentWeather: {
        flex: 1,
    },
    topElements: {
        marginTop : 30,
        flexDirection: "row",
        marginLeft: "2%",
        justifyContent: "space-between",
    },
    currentDay: {
        fontSize: 32,
        marginRight: 50
    },
    searchIcon: {
        fontSize: 25,
        marginLeft: 100,
        color: "#fff"
    },
    heartList: {
        height: 50,
        width: 50
    },
    heartIcon: {
        marginTop: 20,
        marginLeft: 100,
        fontSize: 35,
        color: "#000",
    },
    bottomSide: {
        height: "40%",
        width: "100%"
    }
});

export default HomePage;
