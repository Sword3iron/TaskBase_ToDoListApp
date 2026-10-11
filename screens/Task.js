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




function TaskPage({ route })
{

}

export default TaskPage;

const styles = StyleSheet.create({
    
})