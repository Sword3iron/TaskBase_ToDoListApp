import React, {useContext, useState, useEffect} from 'react';
import {View, Text,TouchableOpacity, ScrollView, Image, RefreshControl, Dimensions, StyleSheet, FlatList} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { useFonts } from 'expo-font';
import { FontAwesome } from '@expo/vector-icons';
import { ThemeContext } from '../themeColor/ThemeContext'; 
import moment from "moment";
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');
const Stack = createStackNavigator(); //set navigation 

/***************************************************************/
///************************TASK PAGE**************************///
/***************************************************************/

//This is the Task page for application.
//Here user can view timelines and dealines, check in their today tasks in list

function TaskCalanderPage({ route, navigation})
{
    const { userId, username, profilePic } = route.params; //pass parameters for both profile page and username
    const firstAvatar = username ? username.charAt(0).toUpperCase() : '?'; //if not profile picture, display first letter avatar of username

    //for clicking the profile page by tapping on profile picture
    const handleProfilePage = () =>{
        navigation.navigate('Profile', {username, profilePic});
    }; 

    //for clicking the profile page by tapping on profile picture
    const handleAddTask = () =>{
        navigation.navigate('AddTask' ,{screen: 'AddNewTask', params:{userId, username, profilePic}}); //navigate to task page, passing parameters
    };
    
    //color theme when turning on the dark mode
    const {colors} = useContext(ThemeContext);

    //set on today new date
    const today = new Date();
    const dates = []; //create an array to stor edate
    for (let i=0; i<=4; i++){  //for each row in 4 column, loop through 5 days
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

    const [refreshing, setRefreshing] = useState(false); //state to refresh
    const [tasks, setTasks] = useState([]); //set tasks
    const [timeSlots, setTimeSlots] = useState([]); //set time slot
    console.log("Fetched tasks: ", tasks); //debugging tasks data

    const onRefresh = async () => {
        setRefreshing(true);  //show refresh indicator
        await fetchTasks(); //await for task to be fetch in
        generateTimeSlots(); //generate time slot
        setRefreshing(false); //disabled refresh indicator
    }
    
    //use effect to hook fetch tasks and generate time slots
    useEffect(() => {
        fetchTasks();
        generateTimeSlots();
    }, []);

    //function to fetch tasks
    const fetchTasks = async () => {
        //formate date for backend
        const todayDate = moment().format("YYYY-MM-DD");
        //fetch task data from API mySQL
        fetch('http://192.168.1.115/taskbaseapp/getTask.php',{
            method: 'POST', //use method post
            headers: { 'Content-Type' : 'application/json' }, //JSON content
            body: JSON.stringify({ //convert data to JSON string
                userId: userId, //userId
                date: todayDate, //formatted Date
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
                setTasks([]); //set an array of tasks
            }
        })
        .catch(error => {
            //handle network or other errors
            console.error(error);
            Alert.alert('Error', 'Something Went Wrong');
            setTasks([]); //set an array of tasks
        });
    }

    //function to extract task for time
    const getTaskForTime = (slot) => {
        return tasks.filter(task => { //find the time based on today date
            let start = moment(task.startTime, ["HH:mm:ss", "YYYY-MM-DD HH:mm:ss"]); //find the task with start time
            return start.isValid() && start.isSame(slot, 'hour');  //put it on the slot of that time
        })
    }

    return(
        <View style={styles.container}>
            <View style={[style.screenContainer, {backgroundColor: colors.background2}]}>

                {/**HEADER */}
                <View style={styles.headerRow}>
                <Text style={[styles.addTaskTitle,{color:colors.text}]}>
                            Tasks
                    </Text>
                    <TouchableOpacity
                        onPress={handleProfilePage}
                    >
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

                {/**DATES */}
                <TouchableOpacity>
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

                {/**TIMESLOT */}
                <View style={styles.taskSlotWarpper}>
                    <ScrollView 
                    contentContainerStyle={styles.taskSlotContainer}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>
                    }
                    >
                        {timeSlots.map((slot, index) => {
                            const slotTasks = getTaskForTime(slot);
                            return(
                                <View 
                                    key={index} 
                                    style={[styles.timeSlot,
                                        index === 0 && {borderTopWidth: 1, borderColor: "#cccccc"}
                                    ]}>

                                    <View style={styles.leftColumnBox}>
                                        <Text style={styles.timeSlotStyle}>
                                            {slot.format("h:mm:A")}  {/** format time slot*/}
                                        </Text>
                                    </View>
                                    <View style={styles.rightColumnBox}>
                                        {slotTasks.length > 0 ? ( //make the clone of slot tasks
                                            slotTasks.map((task, idx) => (  //extarct the task and index for each start time
                                                <TouchableOpacity    
                                                    key={idx}  //get the index of tasks
                                                    style={styles.taskContainer} 
                                                    onPress={() => navigation.navigate("TaskList")} //navigate to task list
                                                    >
                                                    <Text style={styles.taskTitle}>{task.taskTitle}</Text>
                                                    <Text style={styles.taskTime}>
                                                        {moment(task.startTime, "HH:mm:ss").format('h:mm A')} - {/** format start of the time*/}
                                                        {moment(task.endTime, "HH:mm:ss").format("h:mm A")}    {/** format end of the time*/}
                                                    </Text>
                                                </TouchableOpacity>
                                            ))  
                                        ) : (
                                            <TouchableOpacity style={styles.taskContainerEmpty}> {/**if task is empty today */}
                                                <Text style={styles.noTaskText}>NO TASK</Text>
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                </View>
                            )
                        })}
                    </ScrollView>
                </View>

                {/**FLOATING ADD BUTTON */}
                <TouchableOpacity style={styles.floatingButton} onPress={handleAddTask}>
                    <View style={styles.plusButton}>
                        <FontAwesome name='plus' size={30} color="#8f8f8f"/>
                    </View>
                </TouchableOpacity>

            </View>
        </View>
    )
}

/***************************************************************/
///*************************TASKLIST**************************///
/***************************************************************/
function TaskList({ route, navigation })
{
    const { userId, username, profilePic } = route.params;  //pass parameters for both profile page and username
    const firstAvatar = username ? username.charAt(0).toUpperCase() : '?'; //if not profile picture, display first letter avatar of username

    //for clicking the profile page by tapping on profile picture
    const handleProfilePage = () =>{
        navigation.navigate('Profile', {userId, username, profilePic});
    };

    //for clicking the Add Task Page by navigating to its screen
    const handleAddTask = () =>{
        navigation.navigate('AddTask' ,{screen: 'AddNewTask', params:{userId, username, profilePic}});
    }; 
    
    //for clicking the edit Task Page by navigating to its screen
    const handleEditTask = (task) => {
        navigation.navigate('AddTask' ,{screen: 'EditTask', params:{userId, username, profilePic, task}});
    }

    //color theme when turning on the dark mode
    const {colors} = useContext(ThemeContext);

    //load font family from folder
    const [fontLoaded] = useFonts({
        lightInter: require('../assets/font/static/Inter_18pt-Light.ttf'), // light inter font
        mediumInter: require('../assets/font/static/Inter_18pt-Medium.ttf'), // medium inter font
        boldInter: require('../assets/font/static/Inter_18pt-Bold.ttf'), // bold inter font
    });

    const [refreshing, setRefreshing] = useState(false); //state to refresh
    const onRefresh = async () =>{
        setRefreshing(true); //show refresh indicator
        setTimeout(() => {
            setRefreshing(false); //disabled refresh indicator
        }, 1000);  //refresh for 1 seconds
    };

    //set declaration use state for information extraction
    const [selectedDate, setSelectedDate] = useState(new Date()); //set selected date
    const [tasks, setTasks] = useState([]); //set tasks
    const formattedDateDBTask = (date) => { //format date 
        return date.toISOString().split('T')[0]; //convert to ISO string and split
    };

    //use effect hook to fetch tasks whenever selectedDate changes
    useEffect(() => {
        fetchTaskData(selectedDate); //fetch task data
    }, [selectedDate]); //display array of selected date

    //function to fetch task data from backend
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
    }

    //function to determinate the image based on task progress
    const getProgressImage = (taskProgress) => {
        switch(taskProgress){
            case 'completed':
                return require('../assets/images/completed.png'); //completed
            case 'incompleted':
                return require('../assets/images/incompleted.png'); //incompleted
            case 'inProgress':
                return require('../assets/images/inProgress.png'); //in progress
            case 'cancelled':
                return require('../assets/images/cancelled.png');  //cancelled
        }
    }

    return(
        <View style={[style.container,{backgroundColor:colors.background2}]}>
            <View style={styles.screenContainer}>

                {/*HEADER */}
                <View style={[styles.headerRow,{backgroundColor:colors.background2}]}>
                    <View style={[styles.addTaskTitle,{color:colors.text}]}>
                        Task For Today
                    </View>

                    {/**PROFILE IMAGE */}
                    <TouchableOpacity
                        onPress={handleProfilePage}
                    >
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

                {/**TASK LIST */}
                <View style = {styles.todayTaskWrapper}>
                    <ScrollView
                     refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>} //refresh the page
                    >
                        <View style={[styles.todayTaskContainer,{backgroundColor:colors.background2}]}>
                            {tasks.length === 0 ? ( //if no task today, display message for no tasks
                                <View style={styles.todayTaskEmptyTaskBox}>
                                    <Text style={[styles.todayTaskEmptyTaskText,{color:colors.text}]}> 
                                        No Task Today.
                                    </Text> 
                                </View>
                            ) : ( 
                                tasks.map((task, index) => (
                                <TouchableOpacity  
                                    key={index} //identify the index of task under key
                                    onPress={() =>handleEditTask(task)} //navigate to edit task page when click
                                    >

                                    <LinearGradient 
                                        style={styles.todayTaskCard}
                                        colors={['#38ff4d', '#ffffff']}
                                        start={{x:0, y:0.2}}
                                        end={{x:0.5, y:1}}
                                        >
                                        <Text style={styles.todayTaskTitle}>{task.taskTitle}</Text>
                                        <Text style={styles.todayTaskCategory}>{task.taskCategory}</Text>
                                        <View style={styles.todayTaskFooter}>
                                            <Text style={styles.todayTaskTime}>
                                                {task.startTime} - {task.endTime}
                                            </Text>
                                            <View style={styles.todayTaskProgressBox}> 
                                                <Image
                                                    source={getProgressImage(task.taskProgress)} //get image of task progress
                                                    style={styles.progressImage}//display image of task progress
                                                />
                                            </View>
                                        </View>
                                    </LinearGradient>
                                </TouchableOpacity>
                                ))
                            )} 
                        </View>            
                    </ScrollView>
                </View>

                {/**ADD TASK  */}
                <TouchableOpacity style={styles.floatingButton} onPress={handleAddTask}>
                    <View style={styles.plusButton}>
                        <FontAwesome name='plus' size={30} color="#8f8f8f"/>
                    </View>
                </TouchableOpacity>

            </View>
        </View>
    );
}

/***************************************************************/
///*****************TASK PAGE STACKS PAGE*********************///
/***************************************************************/
function TaskPage({ route })
{
    const {userId, username, profilePic} = route.params; //pass parameters for both profile page and tasks

    //**STACK PAGES FOR TASK */
    return(
        <Stack.Navigator screenOptions={{ headerShown:false }}>
            <Stack.Screen name="TaskCalanderPage" component={TaskCalanderPage} initialParams={{userId, username, profilePic}}/> 
            <Stack.Screen name="TaskList" component={TaskList} initialParams={{userId, username, profilePic}}/>
        </Stack.Navigator>
    )
}

export default TaskPage;

const styles = StyleSheet.create({

    //NORMAL
    container:{
        flex: 1,
    },

    screenContainer:{
        paddingTop: 20,
        alignItem: 'center',
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
        marginTop: 10,
    },

    addTaskTitle: {
        fontSize: 15,
        fontFamily: 'boldInter',
        paddingHorizontal: 25,
        marginTop: 35,
        paddingBottom: 15,
        textAlign: 'left'
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

    //CALANDER
    //FLATLIST FOR CALANDER
    sqaureCalanderDateContainer:{
        width: '100%',
        background: '#ffffff',
        marginTop: 5,
    },

    flatListCalender:{
        flexGrow: 1,
        justifyContent: 'center',
        paddingVertical: 10,
        paddingHorizontal: 5,
    },

    squareDateItem:{
        padding: 10,
        marginHorizontal: 8,
        borderRadius: 8,
        width: width / 6 - 13,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ffffff',
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

    //TIMESLOTS
    taskSlotContainer:{
        flexGrow: 1,
        paddingHorizontal: 30,
        paddingTop: 20,
    },

    timeSlot:{
        flexDirection: "row",
        alignItems: 'center',
        marginBottom: 5,
        paddingVertical: 6,
        borderBottomWidth: 1,
        borderColor: '#cccccc',
    },

    timeSlotStyle:{
        fontSize: 13,
        fontWeight: 'Bold',
        marginBottom: 5,
        textAlignVertical: 'center',
    },

    rightColumnBox:{
        flex:1,
        paddingLeft: 0,
    },

    leftColumnBox:{
        width: 70,
        paddingRight: 10,
        alignItems: 'flex-end',
        justifyContent: 'center', 
    },

    taskContainer:{
        backgroundColor: "#ffffaa",
        padding: 15,
        borderRadius: 10,
        paddingHorizontal: 18,
        marginBottom: 5,
    },

    taskTitle:{
        fontFamily: "boldNanum",
        fontSize: 16,
        marginBottom: 5,
    },

    taskTime:{
        fontFamily: "regularNanum",
        fontSize: 12,
        color: '#555',
    },

    taskContainerEmpty:{
        padding: 8,
        paddingHorizontal: 18,
        marginBottom: 10,
    },

    noTaskText:{
        fontSize: 12,
        color: '#aaa'
    },

    taskSlotWarpper:{
        height: 550,
        paddingBottom: 30,
    },
})