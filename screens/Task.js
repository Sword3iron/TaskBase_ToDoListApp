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

    //set on today new date
    const today = new Date();
    const dates = []; //create an array to stor edate
    for (let i=0; i<=4; i++){  //for each row in 4 column, loop through 5 days
        const squareDate = new Date(today); //create a new date object based on today date
        squareDate.setDate(today.getDate() + i); //then use increment by i to memorize the date by 'i'
        dates.push(squareDate); //store the date to the array
    }
    
    //function to render each item in the UI 
    const renderDateItem = ({ item }) => {

        //check if the itme is return date by string
        const isCurrentDate = item.toDateString() === today.toDateString();
        return(
            <View style={[styles.squareDateItem, isCurrentDate && styles.squareCurrentDateItem]}>

                {/**DISPLAY THE DAY OF THE MONTH */}
                <Text style={[styles.squareDayText, isCurrentDate && styles.sqaureCurrentDayText]}>
                    {item.getDate()}
                </Text>

                {/**DISPLAY THE ABBREVIATED MONTH */}
                <Text style={[styles.sqaureWeekdayText, isCurrentDate && styles.squareCurrentWeekdayText]}>
                    {item.toLocaleDateString('en-US', {weekday: 'short'})}
                </Text>
            </View>
        )
    }
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