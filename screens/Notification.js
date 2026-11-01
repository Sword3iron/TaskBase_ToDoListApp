import React,{useContext, useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, ScrollView, Image, StyleSheet,} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { useFonts } from 'expo-font';
import { FontAwesome } from '@expo/vector-icons';
import { ThemeContext } from '../themeColor/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/Feather';
import { LinearGradient } from 'expo-linear-gradient';

const Stack = createStackNavigator(); //set navigation


/***************************************************************/
///***********************NOTIFICATION************************///
/***************************************************************/

//This is the notification for application.
//Here user can view task via notification.
function NotificationPage({ route, navigation}){
    const { userId, username, profilePic } = route.params; //pass parameters for both profile page and username
    const firstAvatar = username ? username.charAt(0).toUpperCase() : '?'; //if not profile picture, display first letter avatar of username
    const handleProfilePage = () =>{
        navigation.navigate('Profile', {userId, username, profilePic});
    };

    //for clicking the Add Task Page by navigating to its screen
    const handleAddTask = () =>{
        navigation.navigate('AddTask' ,{screen: 'AddNewTask', params:{userId, username, profilePic}}); //navigate to task page, passing parameterszz
    };

    //load font family from folder
    const [fontLoaded] = useFonts({
        lightInter: require('../assets/font/static/Inter_18pt-Light.ttf'), // light inter font
        mediumInter: require('../assets/font/static/Inter_18pt-Medium.ttf'), // medium inter font
        boldInter: require('../assets/font/static/Inter_18pt-Bold.ttf'), // bold inter font
        boldNanum: require('../assets/font/nanumgothic/NanumGothic-ExtraBold.ttf'), // bold inter font
        regularNanum: require('../assets/font/nanumgothic/NanumGothic-Regular.ttf'), // bold inter font
    });

    //color theme when turning on the dark mode
    const {colors} = useContext(ThemeContext); //change the colors

     //set declaration use state for information extraction
    const [notifications, setNotifications] = useState([]); //set notification

    //function to fetch task for a specific date
    const fetchNotifications = async () => {
        try{
            //fetch task data from API mySQL
            const res = await fetch(`http://192.168.1.115/taskbaseapp/getNotification.php?userId=${userId}`);
            const json = await res.json(); //convert data to JSON string
            console.log("Notification response: ", json) 
            if(json.success){
                //if server success, show notification message
                setNotifications(json.tasks);
                /*
                //fetch the task for today noification
                json.tasks.forEach(task => {
                    const startDateTime = new Date(`${task.startDateTime}T${task.startTime}`);
                    const triggerNotifyTime = new Date (startDateTime.getTime() - 30 * 60000);

                    if (triggerNotifyTime > new Date()){
                        Notifications.scheduleNotificationAsync({
                            content:{
                                title: `Your Upcoming Task: ${task.taskTitle}`,
                                body: `${task.taskDescription}\n at ${task.startTime}`,
                            },
                            trigger: triggerNotifyTime,
                        });
                    }
                })
                */
            } 
        }catch(err){
            //handle network or other errors
            console.error("Error Fetching Tasks.", err);
        } 
    };    

    //use effect hook to fetch tasks whenever time is met
    useEffect(() => {  
        fetchNotifications(); //fetch notification
        const interval = setInterval(fetchNotifications, 60000); //set interval time
        return() => clearInterval(interval); //return message
    }, []);

    return(
        <View style={[styles.container, {backgroundColor: colors.background2}]}>
            <View style={styles.screenContainer}>
                {/*HEADER*/}
                <View style={styles.headerRow}>
                    <Text style={[styles.addTaskTitle,{color:colors.text}]}>
                        Notification
                    </Text>

                    <TouchableOpacity onPress={handleProfilePage}>
                        <View style={styles.profileImageContainer}>
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
                    </TouchableOpacity>
                </View>

                {/**NOTIFICATIONS */}
                <View style={styles.notificationWrapper}>
                    <ScrollView>
                        <View style={styles.paddingBoxContainer}>
                            {notifications.length === 0 ? (
                                <View style={[styles.emptyBoxContainer, {backgroundColor:colors.background}]}>
                                    <Text style={styles.emptyNotificationText}>
                                        No Upcoming Tasks
                                    </Text>   
                                </View> 
                            ) : (   
                                notifications.map((task) => (
                                    <LinearGradient 
                                        key = {task.id} 
                                        style={styles.notificationBox}
                                        colors={['#ebf527', '#ffffff']}
                                        start={{x:0, y:0.2}}
                                        end={{x:0.5, y:1}}
                                    >
                                        <TouchableOpacity
                                            style={styles.closeButton}
                                            onPress={() => {
                                                setNotifications((prev) => prev.filter((t) => t.id !== task.id));
                                            }}
                                        >
                                            <Icon name="close" size={25} color="#f54927"/>
                                        </TouchableOpacity>
                                        <Text style = {[styles.taskTitleText, {color:colors.text}]}>{task.taskTitle}</Text>
                                        <Text style = {styles.taskDecsText}>{task.taskDescription}</Text>
                                        <Text style = {styles.taskDateText}>{task.startDate}</Text>
                                        <Text style = {styles.taskTimeText}>{task.startTime}</Text>
                                    </LinearGradient>
                                ))
                            )}
                        </View>
                    </ScrollView>
                </View>

                {/**ADD TASK */}
                <TouchableOpacity style={styles.floatingButton} onPress={handleAddTask}>
                    <View style={styles.plusButton}>
                        <FontAwesome name='plus' size={30} color="#8f8f8f"/>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );
}