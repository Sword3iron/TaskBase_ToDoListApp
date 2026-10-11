import React, {useContext, useState, useEffect} from 'react';
import {View, Text,TouchableOpacity, ScrollView, Image, RefreshControl, Dimensions, StyleSheet, FlatList} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { useFonts } from 'expo-font';
import { FontAwesome } from '@expo/vector-icons';
import { ThemeContext } from '../themeColor/ThemeContext'; 
import moment from "moment";
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');
const Stack = createStackNavigator(); //set navigation 

/***************************************************************/
///************************TASK PAGE**************************///
/***************************************************************/

//This is the Task page for application.
//Here user can view timelines and dealines, check in their today tasks in list

function TaskCalanderPage({ route, navigation})
{
    const { userId, username, profilePic } = route.params; //pass parameters for both profile page and username
    const firstAvatar = username ? username.charAt(0).toUpperCase() : '?'; //if not profile picture, display first letter avatar of username

    //for clicking the profile page by tapping on profile picture
    const handleProfilePage = () =>{
        navigation.navigate('Profile', {username, profilePic});
    }; 

    //for clicking the profile page by tapping on profile picture
    const handleAddTask = () =>{
        navigation.navigate('AddTask' ,{screen: 'AddNewTask', params:{userId, username, profilePic}}); //navigate to task page, passing parameters
    };
    
     //color theme when turning on the dark mode
    const {colors} = useContext(ThemeContext);
}

function TaskList({ route, navigation })
{

}


function TaskPage({ route })
{

}

export default TaskPage;

const styles = StyleSheet.create({
    
})