import React,{useCallback, useContext, useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, ScrollView, Image, StyleSheet, RefreshControl} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { useFonts } from 'expo-font';
import { FontAwesome } from '@expo/vector-icons';
import { Calendar } from 'react-native-calendars';
import { ThemeContext } from '../themeColor/ThemeContext';

const Stack = createStackNavigator(); //Set navigation 

/***************************************************************/
///********************CALENDAR PAGE**************************///
/***************************************************************/

//This is the calander page for application.
//Here user can view calanders, the deadlines and task anaysis.

function CalendarPage({route, navigation})
{
    const { userId, username, profilePic } = route.params; //pass parameters for both profile page and username
    const firstAvatar = username ? username.charAt(0).toUpperCase() : '?'; //if not profile picture, display first letter avatar of username
    
    //for clicking the profile page by tapping on profile picture
    const handleProfilePage = () =>{
        navigation.navigate('Profile', {userId, username, profilePic});
    };
    
    //load font family from folder
    const [fontLoaded] = useFonts({
        lightInter: require('../assets/font/static/Inter_18pt-Light.ttf'), // light inter font
        mediumInter: require('../assets/font/static/Inter_18pt-Medium.ttf'), // medium inter font
        boldInter: require('../assets/font/static/Inter_18pt-Bold.ttf'), // bold inter font
        boldNanum: require('../assets/font/nanumgothic/NanumGothic-ExtraBold.ttf'), // bold inter font
        regularNanum: require('../assets/font/nanumgothic/NanumGothic-Regular.ttf'), // bold inter font
    });

    //for clicking the profile page by tapping on profile picture
    const handleAddTask = () =>{
        navigation.navigate('AddTask' ,{screen: 'AddNewTask', params:{userId, username, profilePic}}); //navigate to profile page, passing parameters
    };

     //color theme when turning on the dark mode
    const {colors} = useContext(ThemeContext);

     //set declaration use state for information inserting
    const [refreshing, setRefreshing] = useState(false); //set refreshing
    const [taskAnalysisStats, setTaskAnalysisStats] = useState({ //set analysis stats
        completed: 0, //completed
        inProgress: 0, //in progress
        incompleted: 0, //incompleted
        cancelled: 0, //cancelled
    });
    const [markedDates, setMarkedDates] = useState({});  //set marked dates
    const colorStatus ={ //set color status
        completed: "#4caf50", //green
        inProgress: "#ffc107", //brown
        incompleted: "#f44333", //red
        cancelled: "#9e9e9e", //black
    }

    //function used to get monthly task data
    const fetchMonthlyTasks = async (month) => {
        //fetch task data from API mySQL
        fetch("http://192.168.1.115/taskbaseapp/getMonthlyTask.php", {
            method: "POST", //use method post
            headers: {"Content-Type" : "application/json"}, //JSON content
            body: JSON.stringify({ userId, month}), //convert data to JSON string
        })
        .then(response => response.json()) //parse JSON response
        .then(data => {
            if(data.success){
                //if server success, show alert message
                markDatesByStatus(data.tasks); //engaging marking date function
            }else{
                //if failed, show error message 
                console.error('Monthly Task Fetch Failed', error);
            }
        })
        .catch(error => {
            //handle network or other errors
            console.error(error);
            Alert.alert('Error', 'Something Went Wrong');
        });
    }

    //function used to get daily task data
    const fetchTasks = async (date) => {
         //fetch task data from API mySQL
        fetch("http://192.168.1.115/taskbaseapp/getTask.php", {
            method: "POST",  //use method post
            headers: {"Content-Type" : "application/json"}, //JSON content
            body: JSON.stringify({ userId, date}), //convert data to JSON string
        })
        .then(response => response.json()) //parse JSON response
        .then(data => {
            if(data.success){
                //if server success, show alert message
                calculatePercentage(data.tasks); //engaging marking date function
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
    }

    //function to calculate the percentage of tasks in each progress status
    const calculatePercentage = (tasks) => {
        //handles cases where there are no tasks
        if (tasks.length === 0){
            //set defaut stats: 100% completed, others 0%
            setTaskAnalysisStats({
                completed: 100, //completed
                inProgress: 0, //in progress
                incompleted: 0, //incompleted
                cancelled: 0 //cancelled
            });
            return; //return earl when there is no tasks.
        }

        //initialize counts for each task status
        let counts = { 
            completed: 0,  //completed
            inProgress: 0, //in progress
            incompleted: 0, //incompleted
            cancelled: 0 //cancelled
        };

        //loop through each task and increment relevant count based on task progress
        tasks.forEach((task) => {
            switch(task.taskProgress){
                case "completed": //completed
                    counts.completed++;
                    break;
                case "inProgress": //in progress
                    counts.inProgress++;
                    break;
                case "incompleted": //incompleted
                    counts.incompleted++;
                    break;
                case "cancelled": //cancelled
                    counts.cancelled++;
                    break;
                default:
                    break; //ignore other values
            }
        });

        const total = tasks.length; //total number of tasks

        //calculate percentage of each status and update state
        //calculate by dividing the number of task to total number times 100.
        setTaskAnalysisStats({
            completed: Math.round((counts.completed/total) * 100), //completed
            inProgress: Math.round((counts.inProgress/total) * 100), //in progress
            incompleted: Math.round((counts.incompleted/total) * 100), //incompleted
            cancelled: Math.round((counts.cancelled/total) * 100), //cancelled
            total:total, //total
            completedCount: counts.completed, //completed counting
        });
    };

    //function to mark dates on a calander based on task start dates and their status
    const markDatesByStatus = (tasks) => {
        let marks = {}; //objects to hold the key of dot indicators

        //loop through each task 
        tasks.forEach(task => {
            const date = task.startDate; //use task starting date
            //if the data entry doesn't exist
            if (!marks[date]){ 
                marks[date] = { dots: []};
            }

            //Add a dot for the task's progress status if not already added
            if(!marks[date].dots.some(d=> d.key === task.taskProgress)){
                marks[date].dots.push({
                    key: task.taskProgress, //key based on task progress
                    color: colorStatus[task.taskProgress], //color based on status
                    selectedDotColor:"#f3ff4f" //dor color when selected
                });
            }
        });
        setMarkedDates(marks); //update state with marked dates
    }  

    //use effect runs once a compoenent mount
    useEffect(() => {
        const today = new Date().toISOString().split("T")[0]; //get today date 
        fetchTasks(today); //fetch task for today

        const month = today.substring(0, 7); //extract 'YYYY-MM' for the current month
        fetchMonthlyTasks(month); //fetch tasks for the current month
    }, []); //empty dependency aray ensures it runs only once


    //function to handle the month change in calander view
    const onMonthChange = (month) => {
        fetchMonthlyTasks(month.dateString.substring(0, 7)); //extracr 'YYYY-MM' from the selected month dateString
    }
    
    //function to irefresh tasks, pull to refresh
    const onRefresh = useCallback(() => {
        setRefreshing(true); //show refresh indicator
        fetchTasks(new Date().toISOString().split("T")[0]) //fetch today tasks
            .finally(() => setRefreshing(false)); //hide refresh indicator when done
    }, []); //momorize callback to avoid re-creating on each render


    return(
        <View style={styles.container}>

        </View>
    );
}


export default CalendarPage;

const styles = StyleSheet.create({

    //Normal
    container:{
        flex: 1,
    },

    screenContainer:{
        flex: 1,
        paddingTop: 10,
        alignItem: 'center',
        backgroundColor: '#ffffff'
    },

    profileImageContainer:{
        width: 60,
        height: 60,
        borderRadius: "50%",
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
        marginTop: 15,
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
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 20,
        marginTop: 20,
    },

    addTaskTitle: {
        fontSize: 15,
        fontFamily: 'boldInter',
        paddingHorizontal: 25,
        marginTop: 35,
        paddingBottom: 15,
        textAlign: 'left'
    },

    //Plus Button
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

//Calander
    calendarWrapper:{
        overflow: 'hidden',
        borderRadius: 15,
    },

    calendarContainer:{
        alignItems: 'center',
        transform: [{scale: 0.75}],
        marginTop: -40,
        marginBottom: -20,
    },

    calendar:{
        width: 450,
        height: 370,
        borderRadius: 16,
        overflow: 'hidden',
        alignSelf: 'center',
        marginTop: 0,
    },

    //Percentage Box
    analysisText:{
        paddingVertical: 10,
        fontFamily: 'boldNanum',
        fontSize: 16,
        left: 10,
    },

    percentagePaddingContainer:{
        backgroundColor: '#ffffff',
        paddingHorizontal: 15,
    },

    percentageContainer:{
        backgroundColor: 'yellow',
        paddingHorizontal: 15,
        paddingVertical: 13,
        borderRadius: 15,
        shadowColor: '#000000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,  
    },

    percentageText:{
        fontSize: 15,
        fontFamily: 'mediumInter',
        textAlign: 'center',
        marginTop: 5,
    },

    //Small Image category
    smallImage:{
        width: 35,
        height: 35,
        marginTop: 10,
    },

    labelText:{
        fontSize: 12,
        fontFamily: 'regularNanum',
        textAlign: 'center', 
        color: "#0000000",
        marginTop: 2,
    },

    columnBox:{
        flexDirection: 'column',
        justifyContent: 'center',
        paddingHorizontal: 10,
    },

    analysisHeader:{
        flexDirection:'row',
        justifyContent: 'space-between',
        alignContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
        paddingHorizontal: 13,
    },

    taskSummary:{
        paddingHorizontal: 15,
        paddingVertical: 5,
        backgroundColor: '#ffffff',
    }
})