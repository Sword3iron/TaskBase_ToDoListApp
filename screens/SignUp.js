import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function App()
{
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

const style = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: '#ffffff',
        alignItems:'center',
        justifyContent:'center;'
    }
})