import React, { useEffect } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator(); //Set Navigation Stack

/***************************************************************/
///**********************SPLASH SCREEN************************///
/***************************************************************/
function SplashPage({ navigation })
{
    useEffect(() => {
        //set timeout for splash screen to navigate to login page 
        const timer = setTimeout(() => {
            navigation.replace('Login') //Navigate to login page as soon as splash screen ends
        }, 2000); //display splash screen for  second
        return() => clearTimeout(timer);//clear timeout when component unmounts
    }, [navigation]); //execuete useEffect only when navigation changes

    return (
        <View style = {styles.container}>

            {/*DISPLAY SPLASH SCREEN IMAGE LOGO*/}
            <Image
                source = {require('../assets/images/TaskBase.png')}
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
        backgroundColor: '#2c4c3e',
    },

    logo:{
        width: 200,
        height: 200,
        resizeMode: 'contain',
    },
});