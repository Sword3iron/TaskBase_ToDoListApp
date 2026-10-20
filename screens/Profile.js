import React, {useState, useContext, useEffect}from 'react';
import {View, Text, TextInput, TouchableOpacity, ScrollView, Image,StyleSheet, FlatList, Alert, Switch} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Feather';
import {Feather} from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import * as ImagePicker from 'expo-image-picker';
import { ThemeContext } from '../themeColor/ThemeContext';

const Stack = createStackNavigator(); //set navigation 

/***************************************************************/
////**********************MAIN PROFILE************************///
/***************************************************************/
function ProfileMain({ route, navigation})
{
    const {username, profilePic} = route.params; //pass parameter for username and profile pictures
    const firstAvatar = username ? username.charAt(0).toUpperCase() : '?'; //display profile pic with avatar if not profile pic is upload

    //load font family from folder
    const [fontLoaded] = useFonts({
        lightInter: require('../assets/font/static/Inter_18pt-Light.ttf'), // light inter font
        mediumInter: require('../assets/font/static/Inter_18pt-Medium.ttf'), // medium inter font
        boldInter: require('../assets/font/static/Inter_18pt-Bold.ttf'), // bold inter font
        boldNanum: require('../assets/font/nanumgothic/NanumGothic-ExtraBold.ttf'), // bold inter font
        regularNanum: require('../assets/font/nanumgothic/NanumGothic-Regular.ttf'), // bold inter font
    });

    //color theme when turning on the dark mode
    const {colors} = useContext(ThemeContext);
}

/***************************************************************/
////*******************PROFILE PAGE STACK*********************///
/***************************************************************/
function ProfilePage({ route })
{
    
}

export default ProfilePage;

const styles = StyleSheet.create({

})