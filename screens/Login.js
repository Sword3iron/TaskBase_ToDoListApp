import React, { useState } from 'react';
import {View, Text, Alert, TextInput, TouchableOpacity, StyleSheet,} from 'react-native';
import { useFonts } from 'expo-font';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator(); //set navigation 

function LoginPage({ navigation })
{
     //load font family from folder
    const [fontLoaded] = useFonts({
        lightInter: require('../assets/font/static/Inter_18pt-Light.ttf'), // light inter font
        mediumInter: require('../assets/font/static/Inter_18pt-Medium.ttf'), // medium inter font
        boldNanum: require('../assets/font/nanumgothic/NanumGothic-ExtraBold.ttf'), // bold inter font
        regularNanum: require('../assets/font/nanumgothic/NanumGothic-Regular.ttf'), // bold inter font
    });
    
    //set declaration use state for information extraction
    const [email, setEmail] = useState(''); //email 
    const [password, setPassword] = useState(''); //passoword
    const [emailWarning, setEmailWarning] = useState(''); //email warning
    const [passwordWarning, setPasswordWarning] = useState(''); //password warning

    //function to handle login
    const handleLogin = () => {
        //set valid true
        let valid = true;
        setEmailWarning(''); //set email warning
        setPasswordWarning(''); //set password warning

        //if email isn't inserted
        if (!email){
            //give warning message
            setEmailWarning('Error: Email is required!');
            //valid is false
            valid = false; 
        }

        //if password isn't inserted
        if (!password){
            //give warning message
            setPasswordWarning('Error: Password is required!');
             //valid is false
            valid = false;
        }
 
        //return valid data
        if (!valid) return;

        //fetch login insertion from API mySQL
        fetch("http://192.168.1.125/taskbase/login.php", {
            method: 'POST', //use method post
            headers: { 'Content-Type':'application/json'}, //JSON content
            body: JSON.stringify({ email, password}) //convert data to JSON string
        })
        .then(response => response.json())  //parse JSON response
        .then(data => {
            console.log("Login Response: ", data); //debug login data
             //if server success, show alert message
            if (data.success){
                navigation.replace('TabBottom', { 
                    userId: data.id, //extract user id
                    username: data.username, //extract username
                    profilePic: data.profilePic, //extract profile Pic
                });
            }else{
                //if failed, show error message
                Alert.alert('Login Failed', data.message);
            }
        })
        .catch(error => {
            //handle network or other errors
            console.error(error);
            Alert.alert('Error', 'Something Went Wrong.');
        });
    };

    return(
        <View style={styles.screenContainer}>
            <Text style = {styles.loginTextTitle}>LOGIN</Text>
            <Text style = {styles.subtitle}>Welcome Back!</Text>

            {/**EMAIL */}
            <Text style = {styles.labelText}>E-Mail</Text>
            <TextInput placeholder = "Email" value={email} 
                       onChangeText={setEmail} 
                       style = {styles.inputText}/>
            {emailWarning ? <Text style = {styles.warningText}>{emailWarning}</Text> : null}

             {/**PASSWORD */}
            <Text style = {styles.labelText}>Password</Text>
            <TextInput placeholder='Password' value={password}
                       onChangeText={setPassword} 
                       style = {styles.inputText} secureTextEntry/>
            {passwordWarning ? <Text style = {styles.warningText}>{passwordWarning}</Text> : null}
            
             {/**BUTTON */}
            <TouchableOpacity
                style = {styles.buttonNavigation}
                onPress = {() => navigation.navigate('SignUp')}
            >

            {/**TEXT BUTTON */}
            <Text style = {styles.buttonText}>No Account? Click Here</Text>

            </TouchableOpacity>
            <TouchableOpacity
                onPress={handleLogin}
                style = {styles.loginbuttonNavigation}
            >
                <Text style = {styles.buttonText}>Login</Text>
            </TouchableOpacity>
        </View>
    );
}

export default LoginPage;

const styles = StyleSheet.create({

    //SCREEN CONTAINER
    screenContainer:{ 
        flex: 1,
        backgroundColor:'#faff97',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },

    loginTextTitle:{
        fontSize:42,
        fontFamily: 'boldNanum', 
        color: '#d1d500',
        marginBottom: 5,
    },

    //TEXT SUBTITLE
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

    loginbuttonNavigation: {
        width: '100%',
        backgroundColor: '#38f64d',
        paddingVertical: 15,
        borderRadius: 25,
        marginTop: 15,
        alignItems: 'center',    
        borderColor: '#008000',
        borderWidth: 1,  
    },

    //WARNING TEXT
    warningText:{
        color: '#ff2525',
        marginBottom: 10,
        fontSize: 12,
    }
})