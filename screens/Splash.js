import React, { useEffect } from 'react';
import { VIew, StyleSheet, Image } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

function SplashPage()
{
    useEffect(() => {

        const timer = setTimeout(() => {
            navigation.replace('Login') //Navigate to login page as soon as splash screen ends
        }, 2000); //display splash screen for  second
        return() => clearTimeout(timer);//clear timeout when component unmounts
    }, [navigation]); //execuete useEffect only when navigation changes
}