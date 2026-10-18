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


            </View>
        </View>
    )
}

function TaskList({ route, navigation })
{

}


function TaskPage({ route })
{

}

export default TaskPage;

const styles = StyleSheet.create({
    
})