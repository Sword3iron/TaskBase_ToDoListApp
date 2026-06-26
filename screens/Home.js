import React, {useContext, useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, Image, Dimensions, StyleSheet, FlatList, ScrollView, RefreshControl} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { useFonts } from 'expo-font';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { ThemeContext } from '../themeColor/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { fetchWeatherApi } from 'openmeteo';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window'); //Get Window width for screen fit
const Stack = createStackNavigator(); //Set Navigation Stack

/***************************************************************/
///*************************HOMEPAGE**************************///
/***************************************************************/

//This is the main home page for application.
//Here user can view calanders, date, and today tasks.
function Homepage({ route, navigation}){
    const { userId, username, profilePic } = route.params; //pass parameters for both profile page and username
    const firstAvatar = username ? username.charAt(0).toUpperCase() : '?'; //if not profile picture, display first letter avatar of username
    
    return(
        <SafeAreaView
            style={{flex: 1, backgroundColor: colors.background2}}
            edges ={['left', 'right', 'bottom']}
        >
            <View style={[styles.container, {backgroundColor: colors.background2}]}>
                <View style={styles.screenContainer}>

                    {/**HEADER */}
                    <View style={styles.headerRow}>
                        <Text style={[styles.welcomeText, {color:colors.text}]}>
                                {username}                        
                        </Text>
                        <TouchableOpacity
                            onPress={handleProfilePage}
                        >
                            <View style={styles.profileImageContainer}>
                                {profilePic && profilePic !== "null" && profilePic !== "" ? (
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

                    {/**CALANDER DATE */}
                    <TouchableOpacity
                    onPress={()=> navigation.navigate('Calender')}
                    >
                        <View style={styles.dateContainerWrapper}>    
                            <View style={styles.dateContainer}>
                                <View style={styles.weatherContainer}>
                                        <Text style={styles.dateTextWeek}>
                                            Today - {weekday}
                                        </Text>
                                        {icon && (
                                            <Ionicons name={icon} size={25} style={{alignItems: 'flex-end'}}/>
                                        )}
                                        {weather && (
                                            <Text style={styles.weatherText}>
                                                {weather}
                                            </Text>
                                        )}
                                </View>
                                    <Text style={styles.dateTextDate}>
                                        {formattedDate.replace(`${weekday}, `, '')}
                                    </Text>
                            </View>
                        </View>
                    </TouchableOpacity>

                     {/**DATE ROW*/}
                    <TouchableOpacity
                    onPress={()=> navigation.navigate('Task', {
                            screen: 'TaskCalanderPage',
                            params: {userId, username, profilePic}
                            })
                        }
                    >
                        <View style={styles.sqaureCalanderDateContainer}>
                            <FlatList
                                data={dates}
                                renderItem={renderDateItem}
                                keyExtractor={(item) => item.toDateString()}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={styles.flatListCalender}
                            />
                        </View>
                    </TouchableOpacity>

                    {/**TASK LIST*/}
                    <Text style={[styles.headTitle, {color:colors.text}]}>Today's Tasks</Text>
                    <View style={styles.taskWrapper}>
                        <ScrollView
                            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}
                        >
                                <View style={styles.taskContainer}>
                                    {tasks.length === 0 ? (
                                        <View style={styles.emptyTaskBox}>
                                            <Text style={styles.emptyTaskText}>
                                                No Task Today.
                                            </Text> 
                                        </View> 
                                    ) : (
                                        tasks.map((task, index) => (
                                        <TouchableOpacity  
                                            key={index}
                                            onPress={()=> navigation.navigate('Task' ,{screen: 'TaskList'})}
                                        >
                                            <LinearGradient 
                                            colors={['#38ff4d', '#ffffff']}
                                            style={styles.taskCard}
                                            start={{x:0, y:0.2}}
                                            end={{x:0.5, y:1.5}}
                                            >
                                                <Text style={styles.taskTitle}>{task.taskTitle}</Text>
                                                <Text style={styles.taskCategory}>{task.taskCategory}</Text>
                                                <View style={styles.taskFooter}>
                                                    <Text style={styles.taskTime}>
                                                        {task.startTime} - {task.endTime}
                                                    </Text>
                                                    <View style={[styles.progressBox, getProgressStyle(task.taskProgress)]}>
                                                        <Text style={styles.progressText}>{task.taskProgress}</Text>
                                                    </View>
                                                </View>
                                            </LinearGradient>
                                        </TouchableOpacity>
                                        ))
                                    )}
                                </View>
                        </ScrollView>
                    </View>

                     {/**ADD TASK*/}
                    <TouchableOpacity style={styles.floatingButton} onPress={handleAddTask}>
                        <View style={styles.plusButton}>
                            <FontAwesome name='plus' size={30} color="#8f8f8f"/>
                        </View>
                    </TouchableOpacity>

                </View>
            </View>
        </SafeAreaView>
    );
}

export default Homepage;

const styles = StyleSheet.create({

})