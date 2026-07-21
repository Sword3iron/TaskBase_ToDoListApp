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



    return(
        <View style>

        </View>
    );
}


export default CalendarPage;

const styles = StyleSheet.create({
    
})