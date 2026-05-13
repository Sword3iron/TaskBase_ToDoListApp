import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

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