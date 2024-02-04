import { View, Text, StyleSheet, ImageBackground, Image, ScrollView, TextInput, Switch, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const HomePage = () => {

    const APIKEYWEATHER = "5858c82ebf597ee396b0cbace54ddf20";
    const navigation = useNavigation();

    const currentDate = new Date();
    const hour = currentDate.getHours();
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thrusday', 'Friday', 'Saturday', 'Sunday']
    const [data, setData] = useState();
    const [inputTown, setInputTown] = useState("Paris");
    const [toggleState, setToggleState] = useState(false);
    const [currentWeatherPic, setCurrentWeatherPic] = useState('');
    const [textColor, setTextColor] = useState('#333');
    const [heart, setHeart] = useState(false);
    const [towns, setTowns] = useState([]);

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

    function setPic() {
        if (hour >= 17) {
            setCurrentWeatherPic(require('../assets/night_weather.jpg'));
            setTextColor('#fff');
        } else {
            setCurrentWeatherPic(require('../assets/sunny_weather.jpg'));
        }
    }

    const fetchData = () => {
        let url = "http://api.openweathermap.org/data/2.5/weather?q=" + inputTown + "&appid=" + APIKEYWEATHER;
        if (!toggleState) {
            url += "&units=imperial"
        }
        let config = {
            method: 'GET',
            maxBodyLength: Infinity,
            url: url

        };

        axios.request(config)
            .then((response) => {
                setData(response.data)
            })
            .catch((error) => {
                console.log(error);
            });
    }

    const handleSearch = () => {
        fetchData();
    }

    const toggleSwitch = () => {
        setToggleState(!toggleState);
        fetchData();
    };

    const handleSetHeart = () => {
        if (!heart) {
            addToFav(inputTown);
        } else {
            removeFav(inputTown);
        }
        setHeart(!heart);
    };

    // GPT car manque de collectif :/
    const addToFav = async (value) => {
        try {
            const townsLocalS = await AsyncStorage.getItem("towns");
            let existTown = townsLocalS ? JSON.parse(townsLocalS) : [];

            if (!existTown.includes(value)) {
                existTown.push(value);
                await AsyncStorage.setItem("towns", JSON.stringify(existTown));
                setTowns(existTown);
            }
        } catch (e) {
            console.error('Erreur lors du stockage des données:', e);
        }
    };

    const getFavs = async () => {
        try {
            const listTowns = await AsyncStorage.getItem("towns");
            if (listTowns !== null) {
                const towns = JSON.parse(listTowns);
                console.log('Données récupérées avec succès:', towns);
                setTowns(towns);
            } else {
                setTowns([]);
            }
        } catch (e) {
            console.error('Erreur lors de la récupération des données:', e);
            return [];
        }
    };

    const removeFav = async (value) => {
        try {
            const townsLocalS = await AsyncStorage.getItem("towns");
            let currentTowns = townsLocalS ? JSON.parse(townsLocalS) : [];

            const updatedTowns = currentTowns.filter((town) => town !== value);

            await AsyncStorage.setItem("towns", JSON.stringify(updatedTowns));
            setTowns(updatedTowns);  // Mise à jour de la variable towns dans le state
        } catch (e) {
            console.error('Erreur lors de la suppression des données:', e);
        }
    };
    // FIN GPT

    useEffect(() => {
        setPic();
    }, [currentWeatherPic]);

    useEffect(() => {
        fetchData()
    }, []);

    useEffect(() => {
        getFavs()
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.topSide}>
                <ImageBackground style={styles.currentWeather} source={currentWeatherPic}>
                    <View style={styles.topElements}>
                        <View>
                            <TextInput placeholder="Town's name" style={styles.textInput} onChangeText={(e) => setInputTown(e)} />
                            <>
                                <Text style={[styles.currentDay, { color: textColor }]}>{formattedDay}</Text>
                                <TouchableOpacity onPress={() => navigation.navigate("Favorites", { towns: towns })}>
                                    <Image
                                        style={styles.heartList}
                                        source={
                                            hour >= 17
                                                ? require('../assets/heart_list_icon_white.png')
                                                : require('../assets/heart_list_icon.png')
                                        }
                                    />
                                </TouchableOpacity>
                            </>

                        </View>
                        <View>
                            <Icon style={styles.searchIcon} name="search" onPress={handleSearch} />
                            {
                                !heart ?
                                    <Icon
                                        style={[
                                            styles.heartIcon,
                                            {
                                                color: towns.includes(inputTown) ? "red" : textColor,
                                            },
                                        ]}
                                        name={towns.includes(inputTown) ? "heart" : "heart-o"}
                                        onPress={handleSetHeart}
                                    />
                                    :
                                    <Icon
                                        style={[
                                            styles.heartIcon,
                                            {
                                                color: towns.includes(inputTown) ? "red" : "red",
                                            },
                                        ]}
                                        name="heart"
                                        onPress={handleSetHeart}
                                    />
                            }
                        </View>
                    </View>
                    <View>
                        <Text style={[styles.textsTopSide, { color: textColor }]}>{data && data.name}</Text>
                        {
                            !toggleState ? (
                                <>
                                    <Text style={[styles.textsTopSide, { color: textColor }]}>{data && (data.main.temp - 273).toFixed(1)}°C</Text>
                                    <Text style={[styles.textsTopSide, { color: textColor }]}>{data && data.weather && data.weather[0] && data.weather[0].main}</Text>
                                    <Text style={[styles.textsTopSide, { color: textColor }]}>↓{data && (data.main.temp_min - 273).toFixed(0)}° ↑{data && (data.main.temp_max - 273).toFixed(0)}°</Text>
                                </>
                            ) : (
                                <>
                                    <Text style={[styles.textsTopSide, { color: textColor }]}>{data && (data.main.temp).toFixed(1)}°F</Text>
                                    <Text style={[styles.textsTopSide, { color: textColor }]}>{data && data.weather && data.weather[0] && data.weather[0].main}</Text>
                                    <Text style={[styles.textsTopSide, { color: textColor }]}>↓{data && (data.main.temp_min).toFixed(0)}° ↑{data && (data.main.temp_max).toFixed(0)}°</Text>
                                </>
                            )
                        }

                    </View>
                    <View style={styles.toggleView}>
                        <Text style={[styles.textsTopSide, { color: textColor }]}>°C</Text>
                        <Switch value={toggleState}
                            onValueChange={toggleSwitch}
                            trackColor={{ false: '#767577', true: '#81b0ff' }}
                            thumbColor={toggleState ? '#f5dd4b' : '#f4f3f4'}
                            ios_backgroundColor="#3e3e3e" />
                        <Text style={[styles.textsTopSide, { color: textColor }]}>°F</Text>
                    </View>
                    <Text style={[styles.textsTopSide, { color: textColor }]}>Humidity : {data && data.main.humidity}</Text>
                </ImageBackground>
            </View>

            <View style={styles.bottomSide}>
                <ScrollView>
                    {
                        days.map((day, index) => (
                            <View key={index} style={[styles.viewListDay, { borderBottomWidth: index == days.length - 1 ? 0 : 1 }]}>
                                <Text style={styles.textsBottomSide}>
                                    {day} <Image style={styles.iconWeather} source={require("../assets/sunny_icon.png")} /> 28°C
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
        justifyContent: "space-around",
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
    iconWeather: {
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
        textAlign: "center",
    },
    textInput: {
        alignSelf: "center",
        color: "#333",
        width: 300,
        textAlign: "center",
        backgroundColor: "#FFFFFF80",
        height: 45,
        borderRadius: 15,
        fontSize: 20

    },
    toggleView: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    toggle: {
        backgroundColor: "red"
    },
    // START BOTTOM CSS
    bottomSide: {
        height: "40%",
        width: "100%",
        flex: 1,
    },
    viewListDay: {
        width: "80%",
        alignSelf: "center",
        borderColor: "#333",
    },
    textsBottomSide: {
        fontSize: 20,
        textAlign: "center",
        marginBottom: 5
    }
});

export default HomePage;
