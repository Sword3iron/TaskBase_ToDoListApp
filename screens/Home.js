import React, {useContext, useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, Image, Dimensions, StyleSheet, FlatList, ScrollView, RefreshControl} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { useFonts } from 'expo-font';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { ThemeContext } from '../themeColor/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { fetchWeatherApi } from 'openmeteo';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window'); //Get Window width for screen fit
const Stack = createStackNavigator(); //Set Navigation Stack

/***************************************************************/
///*************************HOMEPAGE**************************///
/***************************************************************/

//This is the main home page for application.
//Here user can view calanders, date, and today tasks.
function Homepage({ route, navigation}){
    const { userId, username, profilePic } = route.params; //pass parameters for both profile page and username
    const firstAvatar = username ? username.charAt(0).toUpperCase() : '?'; //if not profile picture, display first letter avatar of username
    
    return(
        <SafeAreaView
            style={{flex: 1, backgroundColor: colors.background2}}
            edges ={['left', 'right', 'bottom']}
        >
            <View style={[styles.container, {backgroundColor: colors.background2}]}>
                <View style={styles.screenContainer}>

                    {/**HEADER */}
                    <View style={styles.headerRow}>
                        <Text style={[styles.welcomeText, {color:colors.text}]}>
                                {username}                        
                        </Text>
                        <TouchableOpacity
                            onPress={handleProfilePage}
                        >
                            <View style={styles.profileImageContainer}>
                                {profilePic && profilePic !== "null" && profilePic !== "" ? (
                                    <Image
                                        source={{ uri: 'http://192.168.1.115/taskbaseapp/profilePicUpload/' + profilePic}}
                                        style={styles.profileImage}
                                    />
                                ) : (
                                    <View style={styles.avatarCircle}>
                                        <Text style={styles.avatarText}>{firstAvatar}</Text>
                                    </View>
                                )}
                            </View> 
                        </TouchableOpacity>
                    </View>

                    {/**CALANDER DATE */}
                    <TouchableOpacity
                    onPress={()=> navigation.navigate('Calender')}
                    >
                        <View style={styles.dateContainerWrapper}>    
                            <View style={styles.dateContainer}>
                                <View style={styles.weatherContainer}>
                                        <Text style={styles.dateTextWeek}>
                                            Today - {weekday}
                                        </Text>
                                        {icon && (
                                            <Ionicons name={icon} size={25} style={{alignItems: 'flex-end'}}/>
                                        )}
                                        {weather && (
                                            <Text style={styles.weatherText}>
                                                {weather}
                                            </Text>
                                        )}
                                </View>
                                    <Text style={styles.dateTextDate}>
                                        {formattedDate.replace(`${weekday}, `, '')}
                                    </Text>
                            </View>
                        </View>
                    </TouchableOpacity>

                </View>
            </View>
        </SafeAreaView>
    );
}

export default Homepage;

const styles = StyleSheet.create({

})