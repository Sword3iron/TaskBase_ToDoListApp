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

            {/** ADD TASK*/}
            <Tab.Screen name="AddTask" component={AddTaskPage}  
                    initialParams={{userId, username, profilePic}} 
                    options={{
                        tabBarButton: () => null,
                        tabBarItemStyle: {display: 'none'},
                        tabBarStyle: styles.tabNavgationBar,
                        headerShown: false
                }}
            />
        </Tab.Navigator>
    )
}

export default TabNavigator;

const styles = StyleSheet.create({

    // TAB NAVIGATION BOTTOM BAR
    tabNavgationBar:{
        backgroundColor: '#f9ffa7',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        position: 'absolute',
        height: 85,
        paddingBottom: 10,
        paddingTop: 15,
        shadowColor: '#000000',
        shadowOffset: { width:2, height:-2},
        shadowOpacity: 0.01,
        shadowRadius: 3,
        elevation: 3,
        overflow: 'hidden',
    },
})