import React, { useEffect } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator(); //Set Navigation Stack

function SplashPage()
{
    useEffect(() => {

        const timer = setTimeout(() => {
            navigation.replace('Login') //Navigate to login page as soon as splash screen ends
        }, 2000); //display splash screen for  second
        return() => clearTimeout(timer);//clear timeout when component unmounts
    }, [navigation]); //execuete useEffect only when navigation changes

    return (
        <View>

            {/*DISPLAY SPLASH SCREEN IMAGE LOGO*/}
            <Image
                source = {require('..assets/images/TaskBase.png')}
                style = {styles.logo}
            />
        </View>
    )
}

export default SplashPage;

const styles = StyleSheet.create({

    //CONTAINER STYLE
    container:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },

    logo:{
        width: 200,
        height: 200,
        resizeMode: 'contain',
    },
});