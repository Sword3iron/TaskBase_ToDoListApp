import React, { useState } from 'react';
import {View, Text, Alert, TextInput, TouchableOpacity, StyleSheet,} from 'react-native';
import { useFonts } from 'expo-font';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator(); //set navigation 

function SignUpPage({ navigation })
{

    //load font family from folder
    const [fontLoaded] = useFonts({
        lightInter: require('../assets/font/static/Inter_18pt-Light.ttf'), // light inter font
        mediumInter: require('../assets/font/static/Inter_18pt-Medium.ttf'), // medium inter font
        boldNanum: require('../assets/font/nanumgothic/NanumGothic-ExtraBold.ttf'), // bold inter font
        regularNanum: require('../assets/font/nanumgothic/NanumGothic-Regular.ttf'), // bold inter font
    });

     //set declaration use state for information extraction
    const [username, setUsername] = useState(''); //username
    const [email, setEmail] = useState(''); //email
    const [password, setPassword] = useState(''); //password
    const [confirmPassword, setConfirmPassword] = useState(''); //confirm password

    //function to handle registration
    const registerUser = () => {

        //if password is not match
        if (password !== confirmPassword){
            //display aert message
            Alert.alert('Error', 'Password does not match.');
            return;
        }

        //store user data
        const userData = {
            username, //username
            email, //email
            password, //password
        };

        //fetch registration insertion from API mySQL
        fetch('http://192.168.1.115/taskbaseapp/register.php',{
            method: 'POST', //use method post
            headers: { 'Content-Type' : 'application/json' }, //JSON content
            body: JSON.stringify(userData), //convert data to JSON string
        })
        .then(response => response.json()) //parse JSON response
        .then(data => {
            //if server success, show alert message
            if(data.success){
                //display message
                Alert.alert('Success', 'Registration Successful');
                //navigate back to login page
                navigation.navigate('Login');
            }else{
                //if failed, show error message
                Alert.alert('Error', 'Regisration Failed');
            }
        })
        .catch(error => {
            //handle network or other errors
            console.error(error);
            Alert.alert('Error', 'Something Went Wrong');
        });
    };

    return(
       <View style={styles.screenContainer}>
            <Text style = {styles.SignUpTextTitle}>Sign Up</Text>
            <Text style = {styles.subtitle}>Create Your Own Account Here</Text>

            {/**USERNAME */}
            <Text style = {styles.labelText}>Username</Text>
            <TextInput 
            placeholder='Username'
            value={username}
            onChangeText={setUsername}
            style = {styles.inputText}/>

            {/**EMAIL */}
            <Text style = {styles.labelText}>E-Mail</Text>
            <TextInput 
            placeholder='Email'
            value={email}
            onChangeText={setEmail}
            style = {styles.inputText}/>

            {/**PASSWORD */}
            <Text style = {styles.labelText}>Password</Text>
            <TextInput 
            placeholder='Password'
            value={password}
            onChangeText={setPassword}      
            style = {styles.inputText} 
            secureTextEntry/>

            {/**CONFIRM PASSWORD */}
            <Text style = {styles.labelText}>Confirm Password</Text>
            <TextInput 
            placeholder='Confirm Password'
            value={confirmPassword}
            onChangeText={setConfirmPassword}   
            style = {styles.inputText} 
            secureTextEntry/>
            
            {/**BUTTON */}
            <TouchableOpacity
                style = {styles.buttonNavigation}
                onPress = {() => navigation.navigate('Login')}
            >

            {/**TEXT */}
            <Text style = {styles.buttonText}>Back To Login</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={registerUser}
                style = {styles.registerbuttonNavigation}
            >
                <Text style = {styles.buttonText}>Register</Text>
            </TouchableOpacity>
        </View>
    );
}

export default SignUpPage;

const style = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: '#ffffff',
        alignItems:'center',
        justifyContent:'center;'
    }
})