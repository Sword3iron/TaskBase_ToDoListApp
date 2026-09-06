import React,{useCallback, useContext, useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, ScrollView, Image, StyleSheet, RefreshControl} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { useFonts } from 'expo-font';
import { FontAwesome } from '@expo/vector-icons';
import { Calendar } from 'react-native-calendars';
import { ThemeContext } from '../themeColor/ThemeContext';

const Stack = createStackNavigator(); //Set navigation 

/***************************************************************/
///********************CALENDAR PAGE**************************///
/***************************************************************/

//This is the calander page for application.
//Here user can view calanders, the deadlines and task anaysis.

function CalendarPage({route, navigation})
{
    const { userId, username, profilePic } = route.params; //pass parameters for both profile page and username
    const firstAvatar = username ? username.charAt(0).toUpperCase() : '?'; //if not profile picture, display first letter avatar of username
    
    //for clicking the profile page by tapping on profile picture
    const handleProfilePage = () =>{
        navigation.navigate('Profile', {userId, username, profilePic});
    };
    
    //load font family from folder
    const [fontLoaded] = useFonts({
        lightInter: require('../assets/font/static/Inter_18pt-Light.ttf'), // light inter font
        mediumInter: require('../assets/font/static/Inter_18pt-Medium.ttf'), // medium inter font
        boldInter: require('../assets/font/static/Inter_18pt-Bold.ttf'), // bold inter font
        boldNanum: require('../assets/font/nanumgothic/NanumGothic-ExtraBold.ttf'), // bold inter font
        regularNanum: require('../assets/font/nanumgothic/NanumGothic-Regular.ttf'), // bold inter font
    });

    //for clicking the profile page by tapping on profile picture
    const handleAddTask = () =>{
        navigation.navigate('AddTask' ,{screen: 'AddNewTask', params:{userId, username, profilePic}}); //navigate to profile page, passing parameters
    };

    return(
        <View style>

        </View>
    );
}


export default CalendarPage;

const styles = StyleSheet.create({
    
})