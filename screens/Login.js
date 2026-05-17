import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function App()
{
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

const style = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: '#ffffff',
        alignItems:'center',
        justifyContent:'center;'
    }
})