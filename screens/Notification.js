import React,{useContext, useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, ScrollView, Image, StyleSheet,} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { useFonts } from 'expo-font';
import { FontAwesome } from '@expo/vector-icons';
import { ThemeContext } from '../themeColor/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/Feather';
import { LinearGradient } from 'expo-linear-gradient';