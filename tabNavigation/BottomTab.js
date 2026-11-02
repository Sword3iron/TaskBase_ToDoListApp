import React from 'react';
import {StyleSheet} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

//set navigation 
const Tab = createBottomTabNavigator(); 

function TabNavigator({route}){
    const { userId, username, profilePic } = route.params; //pass parameters for both profile page and username

}