import React from 'react';
import {StyleSheet} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

//set navigation 
const Tab = createBottomTabNavigator(); 

function TabNavigator({route}){
    const { userId, username, profilePic } = route.params; //pass parameters for both profile page and username

    return(
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarStyle: styles.tabNavgationBar,
                tabBarShowLabel: false,
                tabBarActiveTintColor: '#b0b330',
                tabBarInactiveTintColor: '#b0b330',
            }}
        >

            {/** HOME */}
            <Tab.Screen name="Home" component={HomePage} 
                    initialParams={{userId, username,   profilePic}} 
                    options={{tabBarIcon:({ color, size}) => (
                    <Ionicons name="home" color={color} size={30}/>
                    ),
                }}
            />

            {/** TASK */}
            <Tab.Screen name="Task" component={TaskPage} 
                    initialParams={{userId, username, profilePic}} 
                    options={{tabBarIcon:({ color, size}) => (
                    <Ionicons name="checkbox" color={color} size={30}/>
                    ),
                }}
            />

            {/** CALENDAR*/}
            <Tab.Screen name="Calender" component={CalenderPage}  
                    initialParams={{userId, username, profilePic}} 
                    options={{tabBarIcon:({ color, size}) => (
                    <Ionicons name="calendar" color={color} size={30}/>
                    ),
                }}
            />

            {/** NOTIFICATION*/}
            <Tab.Screen name="Notification" component={NotificationPage}  
                    initialParams={{userId, username, profilePic}} 
                    options={{tabBarIcon:({ color, size}) => (
                    <Ionicons name="notifications" color={color} size={30}/>
                    ),
                }}
            />
        </Tab.Navigator>
    )
}