import React, { useState } from 'react';
import {View, Text, Alert, TextInput, TouchableOpacity, StyleSheet,} from 'react-native';
import { useFonts } from 'expo-font';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator(); //set navigation 

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
        fetch('http://xxx.xxx.x.xxx/taskbase/register.php',{
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

const styles = StyleSheet.create({

    //CONTAINER
    screenContainer:{
        flex: 1,
        backgroundColor:'#faff97',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },

    //TEXT
    SignUpTextTitle:{
        fontSize:40,
        fontFamily: 'boldNanum',
        fontWeight: '900',
        color: '#d1d500',
        marginBottom: 5,
    },

    subtitle:{
        fontSize: 14,
        fontFamily: 'regularNanum',
        color: '#ccc',
        marginBottom:40,
    },

    labelText:{
        alignSelf: 'flex-start',
        margin: 'flex-start',
        fontWeight:'bold',
        marginBottom: 5,
    },

    inputText:{
        width: '100%',
        backgroundColor: '#ffffff',
        paddingVertical: 15,
        paddingHorizontal: 15,
        borderRadius: 10,
        marginBottom: 20,
    },

    //BUTTON
    buttonNavigation:{
        width: '100%',
        backgroundColor: '#2cff59',
        paddingVertical: 15,
        borderRadius: 25,
        marginTop: 20,
        alignItems: 'center',
        borderColor: '#008000',
        borderWidth: 1,
    },

    buttonText:{
        color: '#000000',
        fontWeight: 'bold',
    },

    registerbuttonNavigation: {
        width: '100%',
        backgroundColor: '#38f64d',
        paddingVertical: 15,
        borderRadius: 25,
        marginTop: 15,
        alignItems: 'center',      
        borderColor: '#008000',
        borderWidth: 1,
    }
})