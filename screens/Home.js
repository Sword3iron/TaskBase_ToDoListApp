import React, {useContext, useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, Image, Dimensions, StyleSheet, FlatList, ScrollView, RefreshControl} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { useFonts } from 'expo-font';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { ThemeContext } from '../themeColor/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { fetchWeatherApi } from 'openmeteo';
import { LinearGradient } from 'expo-linear-gradient';