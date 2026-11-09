import React, {useContext, useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, Image, Dimensions, StyleSheet, FlatList, ScrollView, RefreshControl} from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFonts } from 'expo-font';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { ThemeContext } from '../themeColor/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { fetchWeatherApi } from 'openmeteo';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window'); //Get Window width for screen fit
const Stack = createNativeStackNavigator(); //Set Navigation Stack

/***************************************************************/
///*************************HOMEPAGE**************************///
/***************************************************************/

//This is the main home page for application.
//Here user can view calanders, date, and today tasks.
function Homepage({ route, navigation}){
    const { userId, username, profilePic } = route.params; //pass parameters for both profile page and username
    const firstAvatar = username ? username.charAt(0).toUpperCase() : '?'; //if not profile picture, display first letter avatar of username

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

    //set declaration use state for information extraction
    const [weather, setWeather] = useState(null); //set weather
    const [icon, setIcon] = useState(null); //set icon
    const today = new Date(); //set today date
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'}; //show year, month and day
    const formattedDate = today.toLocaleDateString('en-Us', options); //handle today date string
    const weekday = today.toLocaleDateString('en-us', {weekday:'long'}); //handle weekend date string
    const [selectedDate, setSelectedDate] = useState(new Date());  // selected start time
    const [tasks, setTasks] = useState([]); //set tasks

    //for clicking the profile page by tapping on profile picture
    const handleProfilePage = () =>{
        navigation.navigate('Profile', {userId, username, profilePic}); //navigate to profile page, passing parameters
    };

    //for clicking the Add Task Page by navigating to its screen
    const handleAddTask = () =>{
        navigation.navigate('AddTask' ,{screen: 'AddNewTask', params:{userId, username, profilePic}}); //navigate to task page, passing parameters
    }; 

    //store dates in array
    const dates = [];
    for (let i=0; i<=4; i++){ //for each row in 4 column, loop through 5 days
        const squareDate = new Date(today); //create a new date object based on today date
        squareDate.setDate(today.getDate() + i); //then use increment by i to memorize the date by 'i'
        dates.push(squareDate); //store the date to the array
    }

    //function to render each item in the UI
    const renderDateItem = ({ item }) => {
        //check if the itme is return date by string
        const isCurrentDate = item.toDateString() === today.toDateString();
        return(
            <View style={[styles.squareDateItem, isCurrentDate && styles.squareCurrentDateItem]}>

                {/**DISPLAY THE DAY OF THE MONTH */}
                <Text style={[styles.squareDayText, isCurrentDate && styles.sqaureCurrentDayText]}>
                    {item.getDate()}
                </Text>

                {/**DISPLAY THE ABBREVIATED MONTH */}
                <Text style={[styles.sqaureWeekdayText, isCurrentDate && styles.squareCurrentWeekdayText]}>
                    {item.toLocaleDateString('en-US', {weekday: 'short'})}
                </Text>
            </View>
        )
    }

    //function to format date object into 'YYYY--MM--DD' string for database queries
    const formattedDateDBTask = (date) => {
        return date.toISOString().split('T')[0]; //ISO string slicing to get date part
    };
    const [refreshing, setRefreshing] = useState(false); //state to refresh
    const onRefresh = async () =>{
        setRefreshing(true); //show refresh indicator
        await fetchTaskData(selectedDate); //fetch task based on today date
        setRefreshing(false); //disabled refresh indicator
    };

    //function to fetch task for a specific date
    const fetchTaskData = async(date) =>{
        //formate date for backend
        const formattedDate = formattedDateDBTask(date);
        //fetch task data from API mySQL
        fetch('http://192.168.1.115/taskbaseapp/getTask.php',{
            method: 'POST', //use method post
            headers: { 'Content-Type' : 'application/JSON' }, //JSON content
            body: JSON.stringify({ //convert data to JSON string
                userId: userId, //userId
                date: formattedDate //formatted Date
            }),
        })
        .then(response => response.json()) //parse JSON response
        .then(data => {
            if(data.success){
                //if server success, show alert message
                setTasks(data.tasks);
            }else{
                //if failed, show error message
                console.error('Task Fetch Failed', error);
            }
        })
        .catch(error => {
             //handle network or other errors
            console.error(error);
            Alert.alert('Error', 'Something Went Wrong');
        });
        //debugging on fetch tasks from mySql
        console.log('Fetching Tasks For: ', userId, formattedDate)
    }

    //function to deminate the style based on task progress
    const getProgressStyle = (taskProgress) => {
        switch(taskProgress){
            case 'completed':
                return{ backgroundColor: '#00a608'}; //Green for completed
            case 'incompleted':
                return{ backgroundColor: '#e60000'}; //Red for incomplete
            case 'inProgress':
                return{ backgroundColor: '#e69900'}; //Orange for in progress         
            case 'cancelled':
                return{ backgroundColor: '#454545'}; //Grey for cancelled   
        }
    }

    //use effect hook to fetch tasks whenever selectedDate changes
    useEffect(() => {
        fetchTaskData(selectedDate); //fetch task data
    }, [selectedDate]);  //display array of selected date

    //use effect hook to fetch tasks whenever selectedDate changes
    useEffect(() => {
        fetchTaskData(selectedDate); //fetch task data
    }, [selectedDate]);  //display array of selected date
    
    //use effect hook to fetch weather API
    useEffect(() => {
        const fetchWeather = async () => {

            //use coordination
            const params = {
                latitude: 3.139,
                longitude: 101.6869,
                current: ["temperature_2m", "weather_code"],
            };

            //Call weather API
            fetchWeatherApi("https://api.open-meteo.com/v1/forecast", params)
                .then((responses) => {
                    const response = responses[0]; //got first response
                    const current = response.current(); //acces current weather data
                    const tmp = current.variables(0).value();  //Temperature value
                    const weaCode = current.variables(1).value();  //weather code
                    
                    setWeather(`${tmp.toFixed(1)} °C`); //save temperature
                    setIcon(getWeatherIcon(weaCode)); //set weather icon based on code
            })
            .catch((error) => {
                //handle network or other errors
                console.error("Weather fetching failed: ", error);
            });
        };
        //call fetch when component mounts
        fetchWeather();
    }, []); //empty dependency array

    //function to select weather icon based on weather code
    const getWeatherIcon = (code) => {
        if ([0].includes(code)) return "sunny"; //sky
        if ([1, 2, 3].includes(code)) return "partly-sunny"; //partly-sunny
        if ([45, 48].includes(code)) return "cloudy"; //cloudy
        if ([51, 61, 80].includes(code)) return "rainy"; //rain
        if ([71, 73, 75, 85, 86].includes(code)) return "snow"; //snow
        if ([95, 96, 99].includes(code)) return "thunderstorm"; //storm
        return "cloudy-night-outline"; //night
    };

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

    //NORMAL
    container:{
        flex: 1,
    },

    screenContainer:{
        flex: 1,
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
        marginTop: 5,
    },

    avatarCircle:{
        width: 40,
        height: 40,
        borderRadius: 30,
        backgroundColor: '#4A90E2',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 14,
        left: 0.3 ,
        borderWidth: 0.5,
    },

    avatarText:{
        fontSize: 24,
        color: '#ffffff',
        fontWeight: 'bold',
    },

    welcomeText:{
        color: "#646464",
        fontSize: 16,
        marginLeft: 15,
        marginTop: 20,
    },

    headerRow:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 20.4,
        marginTop: 10,
        paddingTop: 27,
    },

    headTitle:{
        fontFamily: 'boldNanum',
        fontSize: 13,
        paddingHorizontal: 30,
        paddingVertical: 15,
    },

    //CALANDER
    dateContainerWrapper:{
        width: '100%',
        background: '#ffffff',
        paddingTop: 25,
        paddingHorizontal: 20,
    },

    dateContainer:{
        width: '100%',
        paddingHorizontal: 20,
        paddingVertical: 35,
        marginBottom: 10,    
        borderRadius: 20,
        backgroundColor: "#F3FF4F",
        alignItems: 'flex-start',
        elevation: 15,
        
    },

    weatherContainer:{
        flexDirection: 'row',
        alignItems: 'center',
    },

    weatherText:{
        marginLeft: 10,
    },

    dateTextWeek:{
        fontSize: 16,
        paddingRight: 20,
        fontFamily: 'lightInter',
        color: '#333',
        textAlign: 'left',
    },

    dateTextDate:{
        fontSize: 32,
        fontWeight: 800,
        color: '#333',
        paddingRight: 20,
    },


    //FLATLIST FOR CALANDER
    sqaureCalanderDateContainer:{
        width: '100%',
        backgroundC: '#ffffff',
        paddingHorizontal: 5,
        marginTop: "5%",
    },

    flatListCalender:{
        flexGrow: 1,
        justifyContent: 'center',
        paddingVertical: 10,
    },

    squareDateItem:{
        padding: 10,
        marginHorizontal: 8,
        borderRadius: 8,
        width: width / 6 - 11,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor:'#ffffff',
        borderColor: '#000000',
        borderWidth: 0.5,
    },

    squareCurrentDateItem:{
        backgroundColor: '#F3FF4F',
        fontFamily: 'lightInter',
    },

    squareDayText:{
        fontSize: 18,
        fontWight: 'boldInter',
        color: '#000000',
        marginBottom: "10",
    },

    sqaureCurrentDayText:{
        color: '#528045',
        fontFamily: 'boldInter',
    },

    sqaureWeekdayText:{
        fontSize: 12,
        color: "#666666",
        fontFamily: 'lightInter',
    },

    squareCurrentWeekdayText:{
        color: '#528045',
        fontFamily: 'boldInter',
    },


    //PLUS BUTTON
    floatingButton:{
        position: 'absolute',
        top: 645,
        right: 20,
        zIndex: 10,
    },

    plusButton:{
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#f3ff4f',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    }, 

    //TASK BOX
    taskContainer:{
        paddingHorizontal: 35,
        fontFamily: 'mediumInter',
    },

    taskCard:{
        backgroundColor: '#f0f0f0',
        padding: 25,
        marginVertical: 6,
        borderRadius:10,
        elevation: 5, 
    },

    taskTitle:{
        fontFamily: "boldNanum",
        fontSize: 16,
        marginBottom: 14,
    },

    taskCategory:{
        fontFamily: 'regularNanum',
        color: '#000000',
        bottom: 10,
    },

    taskTime: {
        fontFamily: "lightInter",
        color: '#333333',
        flex: 1,
    },

    emptyTaskBox:{
        padding:20,
        backgroundColor: '#fffcda',
        borderRadius: 10,
        marginTop: 0,
        alignItems: 'center',
    },

    emptyTaskText:{
        fontSize: 16,
        color: '#888888'
    },

    taskWrapper:{
        height: 300,
        paddingBottom: 30,
    },

    taskFooter:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 6,
    },

    progressBox:{
        paddingVertical: 4, 
        paddingHorizontal: 10,
        borderRadius: 20,
    },

    progressText:{
        fontWeight: 700,
        color: '#ffffff'
    },

})