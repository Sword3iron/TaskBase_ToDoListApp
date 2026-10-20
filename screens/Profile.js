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

    //Menu pages
    const settingMenu = [
        {title: 'ACCOUNT SETTINGS', icon: 'edit-3', screen: 'AccountSettings'}, //acount settings
        {title: 'PERSONALIZATION', icon: 'settings', screen: 'Personalization'}, //personalization
        {title: 'NOTIFICATIONS', icon: 'bell', screen: 'Notification'}, //notification
        {title: 'DATA & PRIVACY', icon: 'shield', screen: 'DataPrivacy'}, //data privacy
        {title: 'APP VERSION', icon: 'file-text', screen: 'AppVersion'}, //App version
    ];

    // function to handle logout function
    const handleLogout = async () => {
        try {
            //fetch task data from API mySQL
            const res = await fetch('http://192.168.1.115/taskbaseapp/logout.php',{
                method: 'GET', //use GET method
            });
            const data = await res.json();
            if (data.success){
                //if server success, navigate to login
                navigation.replace('Login');
            }
        }catch(error){
            //handle network or other errors
            console.error('Logout failed: ', error);
        }
    };

    return(
        <View style={[styles.screenContainer, {backgroundColor: colors.background3}]}>

            {/**PROFILE PICTURE */}
            <View style={styles.profilePicContainer}>
                <View style={styles.profilePicCircle}>
                {profilePic ? (
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
                <Text style={[styles.usernameText,{color: colors.text}]}> {username} </Text>
            </View>

            {/**LOG OUT BUTTON */}
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.logoutText}>Log Out</Text>
            </TouchableOpacity>

            {/*DIVIDE */}
            <View style={styles.dividerLine}/>
            {settingMenu.map((item, index) => (
                <TouchableOpacity
                    key={index} //set key for each item
                    style={styles.optionSettingButton} //styling for setting button
                    onPress={() => navigation.navigate(item.screen,{username, profilePic})} //navigate to the screen with username parameters' data
                >
                    <Text style = {styles.optionSettingText}>{item.title}</Text>
                    <Feather name = {item.icon} size={20} color="#000000" />
                </TouchableOpacity>
            ))}
        </View>
    )
}


function AccountSettingsPage({ route, navigation})
{
    
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