import React, {useEffect} from 'react';
import { Platform } from 'react-native';
import * as NavigatorBar from 'expo-navigation-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginPage from "./screens/Login";
import SignUpPage from "./screens/SignUp";
import TabNavigator from "./tabNavigation/BottomTab";
import ProfilePage from "./screens/Profile";
import Splash from "./screens/Splash";
import ThemeProvider from './themeColor/ThemeContext';

export default function App()
{
    useEffect(() => {
        if(Platform.OS === 'android'){
            NavigatorBar('hidden');
        }
    })

    return(
        <ThemeProvider>
            <NavigationContainer>
                <Stack.Navigator screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="Splash" component={Splash} screenOptions={{ headerShown: false }} />
                    <Stack.Screen name="Login" component={LoginPage} screenOptions={{ headerShown: false }} />
                    <Stack.Screen name="TabBottom" component={TabNavigator} screenOptions={{ headerShown: false }} />
                    <Stack.Screen name="SignUp" component={SignUpPage} screenOptions={{ headerShown: false }} />
                    <Stack.Screen name="Profile" component={ProfilePage} screenOptions={{ headerShown: false }} />
                </Stack.Navigator>
            </NavigationContainer>
        </ThemeProvider>
    )
}

