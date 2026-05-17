import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const Stack = createStackNavigator(); //set navigation 

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
        fetch("http://192.168.1.115/taskbaseapp/login.php", {
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

const style = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: '#ffffff',
        alignItems:'center',
        justifyContent:'center;'
    }
})