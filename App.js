import React, {useEffect} from 'react';
import { Platform } from 'react-native';
import * as NavigatorBar from 'expo-navigation-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


export default function App()
{
    return(
        <View style={style.container}>
            <Text> Welcome! </Text>
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