import React, {useState, useContext, useEffect} from 'react';
import {View, Text, TextInput, TouchableOpacity, ScrollView, Image, Alert, StyleSheet, Platform} from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFonts } from 'expo-font';
import { FontAwesome } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker'
import { ThemeContext } from '../themeColor/ThemeContext';

const Stack = createNativeStackNavigator(); //set navigation 


function AddTaskPage({route})
{

}

export default AddTaskPage;

const styles = StyleSheet.create({
    
})