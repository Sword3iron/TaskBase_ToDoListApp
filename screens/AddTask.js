import React, {useState, useContext, useEffect} from 'react';
import {View, Text, TextInput, TouchableOpacity, ScrollView, Image, Alert, StyleSheet, Platform} from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFonts } from 'expo-font';
import { FontAwesome } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker'
import { ThemeContext } from '../themeColor/ThemeContext';

const Stack = createNativeStackNavigator(); //set navigation 

function AddNewTask({route, navigation}){

}

function EditTask({route, navigation}){

}

/***************************************************************/
///******************ADD TASK STACK PAGES*********************///
/***************************************************************/

function AddTaskPage({route})
{
    const {userId, username, profilePic, task} = route.params; //pass parameters for both profile page and tasks

    //**STACK PAGES FOR EDIT AND ADD TASKS */
    return(
        <Stack.Navigator screenOptions={{ headerShown:false }}>
            <Stack.Screen name="AddNewTask" component={AddNewTask} initialParams={{userId, username, profilePic}}/>
            <Stack.Screen name="EditTask" component={EditTask} initialParams={{userId, username, profilePic, task}}/>
        </Stack.Navigator>
    )
}

export default AddTaskPage;

const styles = StyleSheet.create({

    /**NORMAL */
    container:{
        flex: 1,
    },

    screenContainer:{
        flex: 1,
        paddingTop: 20,
        alignItems: 'center',
    },

    profileImageContainer:{
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },

    profileImage:{
        width: 50,
        height: 50,
        borderRadius: 30,
        borderColor: '#589940',
        borderWidth: 3,
    },

    avatarCircle:{
        width: 40,
        height: 40,
        borderRadius: 30,
        backgroundColor: '#4A90E2',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 28,
        borderWidth: 0.9,
    },

    avatarText:{
        fontSize: 24,
        color: '#ffffff',
        fontWeight: 'bold',
    },

    welcomeText:{
        color: "#646464",
        fontSize: 14,
    },

    headerRow:{
        flexDirection: 'column',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 20,
        marginTop: 10,
        marginBottom: 1,
    },


    //ADD TASK
    scrollContainer:{
        marginTop: 10,
        paddingBottom: 120,
        paddingHorizontal: 25,
    },

    addTaskTitle: {
        fontSize: 17,
        paddingHorizontal: 30,
        fontFamily: 'boldInter',
        marginBottom: 10,
        paddingBottom: 15,
        borderBottomColor: "#000000",
        borderBottomWidth: 1.5,
        zIndex: 1,
    },

    subTitle:{
        fontSize: 15,
        left: 15,
        fontFamily: 'mediumInter',
        marginBottom: 10,
        marginTop: 5,
    },

    taskAddingInput:{
        backgroundColor: '#f5f5f5',
        borderColor: "#000000",
        borderWidth: 0.5,
        borderRadius: 20,
        paddingHorizontal: 19,
        paddingVertical: 15,
        marginBottom: 16
    },

    taskAddingRow:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },

    smallInput:{
        width: '45%',
        backgroundColor: '#f5f5f5',
        borderColor: '#cccccc',
        borderWidth: 0.5,
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 12,
    },

    pickerContainer:{
        borderWidth: 0.5,
        backgroundColor: '#ffffff',
        borderColor: "#cccccc",
        borderRadius: 10,
        marginBottom: 15,
    },

    //BUTTON
    cancelNavigation:{
        width: '100%',
        backgroundColor: '#2cff59',
        paddingVertical: 15,
        borderRadius: 25,
        marginTop: 20,
        alignItems: 'center',
        borderColor: '#008000',
        borderWidth: 1,
    },

    buttonText:{
        color: '#000000',
        fontWeight: 'bold',
    },

    submitNavigation: {
        width: '100%',
        backgroundColor: '#38f64d',
        paddingVertical: 15,
        borderRadius: 25,
        marginTop: 15,
        alignItems: 'center',    
        borderColor: '#008000',
        borderWidth: 1,  
    },

    submitText:{
        color: '#ff2525',
        marginBottom: 10,
        fontSize: 12,
    }
})