import React, {useState, useContext, useEffect}from 'react';
import {View, Text, TextInput, TouchableOpacity, ScrollView, Image,StyleSheet, FlatList, Alert, Switch} from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Feather';
import {Feather} from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import * as ImagePicker from 'expo-image-picker';
import { ThemeContext } from '../themeColor/ThemeContext';

const Stack = createNativeStackNavigator(); //set navigation 

/***************************************************************/
////**********************MAIN PROFILE************************///
/***************************************************************/
function ProfileMain({ route, navigation })
{
    const {username, profilePic} = route.params; //pass parameter for username and profile pictures
    const firstAvatar = username ? username.charAt(0).toUpperCase() : '?'; //display profile pic with avatar if not profile pic is upload

    //load font family from folder
    const [fontLoaded] = useFonts({
        lightInter: require('../assets/font/static/Inter_18pt-Light.ttf'), // light inter font
        mediumInter: require('../assets/font/static/Inter_18pt-Medium.ttf'), // medium inter font
        boldInter: require('../assets/font/static/Inter_18pt-Bold.ttf'), // bold inter font
        boldNanum: require('../assets/font/nanumgothic/NanumGothic-ExtraBold.ttf'), // bold inter font
        regularNanum: require('../assets/font/nanumgothic/NanumGothic-Regular.ttf'), // bold inter font
    });

    //color theme when turning on the dark mode
    const {colors} = useContext(ThemeContext);

    //Menu pages
    const settingMenu = [
        {title: 'ACCOUNT SETTINGS', icon: 'edit-3', screen: 'AccountSettings'}, //acount settings
        {title: 'PERSONALIZATION', icon: 'settings', screen: 'Personalization'}, //personalization
        {title: 'NOTIFICATIONS', icon: 'bell', screen: 'Notification'}, //notification
        {title: 'DATA & PRIVACY', icon: 'shield', screen: 'DataPrivacy'}, //data privacy
        {title: 'APP VERSION', icon: 'file-text', screen: 'AppVersion'}, //App version
    ];

    // function to handle logout function
    const handleLogout = async () => {
        try {
            //fetch task data from API mySQL
            const res = await fetch('http://192.168.1.115/taskbaseapp/logout.php',{
                method: 'GET', //use GET method
            });
            const data = await res.json();
            if (data.success){
                //if server success, navigate to login
                navigation.replace('Login');
            }
        }catch(error){
            //handle network or other errors
            console.error('Logout failed: ', error);
        }
    };

    return(
        <View style={[styles.screenContainer, {backgroundColor: colors.background3}]}>

            {/**PROFILE PICTURE */}
            <View style={styles.profilePicContainer}>
                <View style={styles.profilePicCircle}>
                {profilePic ? (
                    <Image
                    source={{ uri: 'http://192.168.1.115/taskbaseapp/profilePicUpload/' + profilePic}}
                    style={styles.profileImage}
                    />
                ) : (
                    <View style={styles.avatarCircle}>
                        <Text style={styles.avatarText}>{firstAvatar}</Text>
                    </View>
                )}
                </View>
                <Text style={[styles.usernameText,{color: colors.text}]}> {username} </Text>
            </View>

            {/**LOG OUT BUTTON */}
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.logoutText}>Log Out</Text>
            </TouchableOpacity>

            {/*DIVIDE */}
            <View style={styles.dividerLine}/>
            {settingMenu.map((item, index) => (
                <TouchableOpacity
                    key={index} //set key for each item
                    style={styles.optionSettingButton} //styling for setting button
                    onPress={() => navigation.navigate(item.screen,{username, profilePic})} //navigate to the screen with username parameters' data
                >
                    <Text style = {styles.optionSettingText}>{item.title}</Text>
                    <Feather name = {item.icon} size={20} color="#000000" />
                </TouchableOpacity>
            ))}
        </View>
    )
}

/***************************************************************/
////****************ACCOUNT SETTINGS PAGE*********************///
/***************************************************************/
//Expanded Screen avaliable only on settings page
function AccountSettingsPage({ route, navigation })
{
    //set constant variable for colors and usestate for username, password, profile picture
    const {colors} = useContext(ThemeContext); //change the colors
    const [currentUsername, setCurrentUsername] = useState(''); //set usestate on current username
    const [username, setUsername] = useState(''); //set usestate on username
    const [confirmPassword, setConfirmPassword] = useState('');//set usestate on password confirmation
    const [password, setPassword] = useState('');//set usestate on password
    const [profilePic, setProfilePic] = useState('');//set usestate on profile picture

    //Debug the parameter passing for database
    useEffect(()=>{
        if (route.params?.username){  
            //debugging username data received
            console.log("received Username: ", route.params.username);
            //set username paramater
            setCurrentUsername(route.params.username);
        } else {
            //display log for error
            console.log("received no username passed in route.params: ");
        }
    }, [route.params]); //memorize the parameters


    //function for changing profile picture
    const handleProfilePic = async () => {
        // use image picker sensor 
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissionResult.granted){
            //if permission is not granted, receive alert message
            Alert.alert("Permission Denied", "Please enable permission access to your image library.")
        }

        //launch the device image library to select image
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaType: ImagePicker.MediaTypeOptions.Images, //restrict selection to image  
            base64: true, //include base64 data
            quality: 0.5, //image quality reduce to 50%
        });

        //check if the users did not cancel the image picker and if assets are returned
        if(! result.canceled && result.assets && result.assets.length > 0){
            const asset = result.assets[0]; //access the first selected asset
            setProfilePic({//set profile picture
                base64: asset.base64, //use base64 data string 
                uri: asset.uri, //load uri image
            });
        }
    };

    //function for handle profile update
    const handleUpdate = () => {
        if(!username || !password || !confirmPassword){ //username, password and confirm passowrd not inserted
            //alert message display
            Alert.alert("Data Incomplete. Please fill all fileds.");
            return;
        }

        if(password !== confirmPassword){ //password and confirm passowrd not match
            //alert message display
            Alert.alert("The Password Does Not Match.");
            return;
        }

        //object update data in extracting information for extraction and update
        const updateData = {
            currentUsername: currentUsername, //current username
            username: username, //username
            password: password, //password
            profilePic: profilePic?.base64 || null //profile pciture
        };

        //fetch login insertion from API mySQL
        fetch('http://192.168.1.115/taskbaseapp/update.php', {
            method: 'POST', //user method post
            headers: { 'Content-Type' : 'application/json'}, //JSON content
            body: JSON.stringify(updateData) //convert data to JSON string
        })
        .then(res => res.json()) //parse JSON response
        .then(json => { 
             //if server success, show alert message
            if(json.success){
                //display message
                Alert.alert('Update Success!', 
                            'log out and login you account to see the change.',
                                [
                                    {
                                        text: 'OK',
                                        onPress: () => navigation.goBack() //navigate back to home
                                    }
                                ]
                            );
            }else{
                //if failed, show error message
                Alert.alert("Updated Faliure: " + json.message);
            }
        })
    }

    return(
        <View style = {[styles.settingScreen, {backgroundColor: colors.background3}]}>
            <Text style = {[styles.settingTitle, {color: colors.text}]}>Account Settings</Text>
            <View style = {[styles.settingContainer, {backgroundColor: colors.background3}]}>
                <View style={styles.settingContainerSub}>
                    <Text style = {styles.settingTitleSubInfo}>
                        Here you can change your information account.
                    </Text>

                    {/**TEXT FIELD  */}
                    {/**USERNAME */}
                    <Text style = {styles.settingTypeTitle}>
                        Username
                    </Text>
                    <TextInput 
                        placeholder='New Username'
                        style = {styles.input}
                        value = {username}
                        onChangeText={setUsername}
                    />

                    {/**PASSWORD */}
                    <Text style = {styles.settingTypeTitle}>
                        Password
                    </Text>
                    <TextInput 
                        placeholder='New Password'
                        secureTextEntry
                        style = {styles.input}
                        value = {password}
                        onChangeText={setPassword}
                    />

                    {/**CONFIRM PASSWORD */}
                    <Text style = {styles.settingTypeTitle}>
                        Retype Password for confirmation
                    </Text>
                    <TextInput 
                        placeholder='Confirm Password'
                        secureTextEntry
                        style = {styles.input}
                        value = {confirmPassword}
                        onChangeText={setConfirmPassword}                      
                    />

                    {/**PROFILE PICTURE */}
                    <Text style = {styles.settingTypeTitle}>
                        Profile Pic / Avatar
                    </Text>
                    <TouchableOpacity
                        style={styles.uploadPicButton}
                        onPress={handleProfilePic}
                    >
                        <Text style={styles.uploadPicText}> 
                        Choose Profile Picture 
                        </Text>
                    </TouchableOpacity>

                    {profilePic && <Image source={{ uri: profilePic.uri }} style={styles.profileImage}/>}

                    {/**BUTTON */}
                    <TouchableOpacity 
                        style={styles.updateButton}
                        onPress={handleUpdate}
                        >
                        <Text style={styles.updateButtonText}>
                            Update Profile 
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )

}

/***************************************************************/
////****************PERSONALIZATION PAGE**********************///
/***************************************************************/
function PersonalizationPage()
{
    //color theme when turning on the dark mode
    const { isDarkMode, toggleTheme, colors } = useContext(ThemeContext);
    return(
        <View style = {[styles.settingScreen, {backgroundColor: colors.background3}]}>
            <Text style={[styles.settingTitle, {color: colors.text}]}>Personalization</Text>
            <View style = {[styles.settingContainer, {backgroundColor: colors.background3}]}>
                <View style = {styles.settingContainerSub}>

                    {/**CHANGE APPEARANCE */}
                    <View style = {styles.personalizationContainer}>
                        <Text>
                            Dark Mode
                        </Text>
                        <Switch
                            value={isDarkMode} //engaging function of dark mode turning
                            onValueChange={toggleTheme} //based on the toggle theme
                            trackColor={{ false:'#ccc', true: '#81b0ff'}} //change color to yellow to black
                            thumbColor={isDarkMode ? '#f5dd4b' : '#f4f3f4'} //change switch button color to yellow to black
                        />
                    </View>
                </View>
            </View>
        </View>
    );

}


/***************************************************************/
////*******************NOTIFICATION PAGE**********************///
/***************************************************************/
function NotificationPage()
{
    //color theme when turning on the dark mode
    const {colors} = useContext(ThemeContext);

    //disable on switch
    const [isEnabled, setIsEnabled] = useState(false);

    //toggle switch for notification
    const toggleSwitch = () => {
        setIsEnabled(prev => !prev);
        if(!isEnabled){
            console.log("Notifications Enabled");
        }else{
            console.log("Notifications Disabled")
        }
    }

    return(
        <View style = {[styles.settingScreen,{backgroundColor: colors.background3}]}>
            <Text style={[styles.settingTitle, {color: colors.text}]}>Notification</Text>
            <View style = {[styles.settingContainer,{backgroundColor: colors.background3}]}>
                <View style = {styles.settingContainerSub}>
                    <View style={styles.personalizationContainer}>
                        <Text>
                            Enable Notifications
                        </Text>

                        {/**CHANGE APPEARANCE */}
                        <Switch
                            trackColor={{false: "#767577", true: "#81b0ff" }} //change color from yellow to black
                            thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"} //change switch button color from yellow to black
                            onValueChange={toggleSwitch} //engagin function toggle switch
                            value={isEnabled} //engaging value enable
                        />
                    </View>
                </View>
            </View>
        </View>
    );
}

/***************************************************************/
////********************DATA PRIVACY PAGE*********************///
/***************************************************************/
function DataPrivacyPage()
{
     //color theme when turning on the dark mode
    const {colors} = useContext(ThemeContext);

    return(
        <View style = {[styles.settingScreen,{backgroundColor: colors.background3}]}>
            <Text style={[styles.settingTitle, {color: colors.text}]}>Data & Privacy</Text>
            <ScrollView>
                <View style = {[styles.settingContainer, {backgroundColor: colors.background3}]}>
                    <View style = {styles.settingContainerSub}>
                        <Text style = {styles.privacyTextTitle}>
                            Privacy Policy
                        </Text>

                        {/** TEXT POLICY */}
                        <Text style = {styles.privacyTextContent}>
                            This application does not collects, uses and disclouse any information
                            that associated with our users, it has no way in sharing personal data with 
                            third-party user and that it does not condone or tolerate any misuse, abuse
                            unauthorized disclouse of user information.
                            {"\n"}{"\n"}

                            This application is for project testing uses only, and it was never 
                            meant to be engaging cookies and tracking policies that may affect 
                            to personal data of user in any way.
                            {"\n"}{"\n"}
                        </Text>
                        <Text style = {styles.privacyTextTitle}>
                            Personal Data
                        </Text> 

                         {/** DATE POLICY */}
                        <Text style = {styles.privacyTextContent}>
                            Here in TaskBase, we are committed to protecting user's privacy.
                            {"\n"}
                        </Text>
                        <View style={{ paddingHorizontal: 10, marginVertical: 12}}>
                            <Text style = {styles.privacyTextContent}>
                            • We do not share personal information without user's consent. {"\n"}{"\n"}
                            • User's data is stored and secured. {"\n"}{"\n"}
                            • We use encryption to safeguard user's data information. {"\n"}{"\n"}
                            • We regulary review our privacy practices and enthic codes. {"\n"}{"\n"}
                            • Ensuring user's safety and transperancy over the usage of data overboard. {"\n"}{"\n"}
                            • We comply with relevant privacy laws and regulations. {"\n"}{"\n"}
                            • The team is committed to countinues improve and enhancement for user's experience to ensure equality. {"\n"}{"\n"}
                            </Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    )
}

/***************************************************************/
////*******************APP VERSION PAGE***********************///
/***************************************************************/
function AppVersionPage()
{
    //data for extraction on app information
    const appVersionData = [
        {key: 'Version', value: '1.0.0'},  
        {key: 'Deveoped In', value: 'React Native'},
        {key: 'Software', value: 'Android'},
        {key: 'App Type', value: 'Custom App'},
    ];

    //color theme when turning on the dark mode    
    const {colors} = useContext(ThemeContext);

    return(
        <View style = {[styles.settingScreen,{backgroundColor: colors.background3}]}>
            <Text style={[styles.settingTitle, {color: colors.text}]}>App Version</Text>
            <View style = {[styles.settingContainer, {backgroundColor: colors.background3}]}>
                <View style = {styles.settingContainerSub}>

                    {/**CELL BLOCK */}
                    <FlatList
                        data={appVersionData}
                        keyExtractor={(item) => item.key}
                        renderItem={({ item }) =>(
                            <View style = {styles.row}>
                                <Text style = {styles.cellKey}>{item.key}</Text>
                                <Text style = {styles.cellValue}>{item.value}</Text>                       
                            </View>
                        )}
                    /> 

                </View>
            </View>
        </View>
    );
}


/***************************************************************/
////*******************PROFILE PAGE STACK*********************///
/***************************************************************/
function ProfilePage({ route })
{
    const {username, profilePic} = route.params; //pass parameters for both profile page and username

    //**STACK PAGES FOR PROFILE */
    return(
        <Stack.Navigator screenOptions={{ headerShown:false }}>
            <Stack.Screen name="ProfileMain" component={ProfileMain} initialParams={{username, profilePic}} options={{ title: 'profile'}}/>
            <Stack.Screen name="AccountSettings" component={AccountSettingsPage} initialParams={{username, profilePic}}/>
            <Stack.Screen name="Personalization" component={PersonalizationPage}/>
            <Stack.Screen name="Notification" component={NotificationPage}/>
            <Stack.Screen name="DataPrivacy" component={DataPrivacyPage}/>
            <Stack.Screen name="AppVersion" component={AppVersionPage}/>
        </Stack.Navigator>
    )
}

export default ProfilePage;

const styles = StyleSheet.create({

    //MAIN SETTINGS PAGE
    screenContainer:{
        flex:1,
        backgroundColor: '#faff97',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 40,
    },

    profilePicContainer:{
        alignItems: 'center',
        marginBottom: 20,
        marginTop: 50,
    },

    profilePicCircle:{
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems:'center',
        marginBottom: '15',
    },

    //PROFILE PICTURE
    profileImage:{
        width: 60,
        height: 60,
        borderRadius: 30,
        borderColor: '#589940',
        borderWidth: 3,
    },

    avatarCircle:{
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#4a90e2',
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        marginBottom: 50,
        borderWidth: 0.9,
    },

    avatarText:{
        fontSize: 35,
        color: '#ffffff',
        fontWeight:'bold',
    },

    usernameText:{
        marginTop: 10,
        fontWeight: 'bold',
        fontSize: 18,
    },

    //BUTTONS
    logoutButton:{
        backgroundColor:'#38f64d',
        paddingVertical: 12,
        paddingHorizontal: 110,
        borderRadius: 25,
        elevation: 2,
        marginBottom: 20,
    },

    logoutText:{
        color: '#000000',
        fontWeight: 'bold',
    },

    dividerLine:{
        width: '80%',
        height: 1.5,
        backgroundColor: '#cccccc',
        marginVertical: 15,
    },

    optionSettingButton:{
        backgroundColor: '#ffffff',
        borderRadius: 25,
        padding: 20,
        width: '80%',
        flexDirection: 'row',
        justifyContent:'space-around',
        alignItems: 'center',
        marginBottom: 20,
        elevation: 3
    },

    optionSettingText:{
        fontSize:12,
        fontFamily: 'boldNanum',
        paddingHorizontal: 12,
    },

    //SETTING SCREEN
    settingScreen:{
        flex: 1,
        backgroundColor: '#faff97',
    },

    settingTitle:{
        fontSize: 15,
        fontWeight: 'bold',
        alignItems:'flex-start',
        justifyContent: 'flex-start',
        marginTop: 60,
        paddingBottom: 10,
        paddingHorizontal: 20,
    },

    settingTitleSubInfo:{
        fontsize: 15,
        fontFamily: 'mediumInter',
        textAlign: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
        marginBottom: "10%",
        color: "#a9a9a9",
    },

    settingContainer:{
        padding: 20,
        backgroundColor: "#faff97",
        alignItems: 'center',
        justifyContent: 'center',
    },

    settingContainerSub:{
        width: '100%',
        padding: 20,
        marginTop: 0,   
        marginBottom: 30,     
        backgroundColor: "#ffffff",
        alignItems: 'left',
        borderRadius: 20,
    },

    //PRIVACY PAGE TEXT
    privacyTextTitle:{
        textAlign: 'left',
        fontSize: 18,
        fontFamily: 'boldInter'
    },

    privacyTextContent:{
        marginTop: 15,
        textAlign: 'justify',
        fontFamily: 'lightInter'
    },

    //ROWS AND COLUMN FOR EVERY SETTING PAGE INSIDE
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
        borderBottomColor: '#05fe03',
        borderBottomWidth: 0.5,
    },

    cellKey:{
        fontWeight: 'bold',
        fontSize: 16,
        paddingRight: 90,
    },

    cellValue:{
        fontSize: 16,
        paddingHorizontal: 5,
        color: '#b9b9b9'
    },

    sectionHeader:{
        fontSize: 18,
        fontWeight: 'bold',
        paddingVertical: 10,
    },

    rightIcon:{
        marginLeft: 'auto',
    },

    //PERSONALIZATION PAGE
    personalizationContainer:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },

    //ACCOUNT SETTING PAGE
    settingTypeTitle:{
        marginTop: 5,
        marginBottom: 12,
        paddingLeft: 10,
        fontSize: 13,
        fontFamily: 'lightInter',
    },  

    input:{
        borderWidth: 1,
        borderColor: "cccccc",
        padding: 15,
        borderRadius: 8,
        marginBottom: 15,
        backgroundColor: '#ffffff'
    },

    uploadPicButton:{
        backgroundColor: '#63dce3',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 10,

    },

    uploadPicText:{
        color: '#ffffff',
        fontFamily: "boldInter",
        fontSize: 14,
    },

    profileImage:{
        width: 100,
        height: 100,
        borderRadius: 50, 
        alignSelf:'center',
        marginBottom: 15,
        borderColor: '#589940',
        borderWidth: 4,
    },

    updateButton:{
        backgroundColor: '#38f64d',
        padding: 12,
        borderRadius: 30,
        alignItems: 'center',
        marginBottom: 10,
        borderWidth: 0.5,
        borderColor: "#000000"
    },

    updateButtonText:{
        color: '#ffffff',
        fontFamily: "boldInter",
        fontSize: 14,
    },
})