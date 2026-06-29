import React, {useState, useContext, useEffect} from 'react';
import {View, Text, TextInput, TouchableOpacity, ScrollView, Image, Alert, StyleSheet, Platform} from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFonts } from 'expo-font';
import { FontAwesome } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker'
import { ThemeContext } from '../themeColor/ThemeContext';

const Stack = createNativeStackNavigator(); //set navigation 

/***************************************************************/
///*********************ADD TASK SCREEN***********************///
/***************************************************************/

//This page focus on adding task 
//it inserting new objective title and description, start and end time, start and end date, status and progress
function AddNewTask({route, navigation}){
    const { userId, username, profilePic } = route.params || {}; //pass parameters for both profile page and username
    const firstAvatar = username ? username.charAt(0).toUpperCase() : '?'; //if not profile picture, display first letter avatar of username

    //load font family from folder
    const [fontLoaded] = useFonts({
        lightInter: require('../assets/font/static/Inter_18pt-Light.ttf'), // light inter font
        mediumInter: require('../assets/font/static/Inter_18pt-Medium.ttf'), // medium inter font
        boldInter: require('../assets/font/static/Inter_18pt-Bold.ttf'), // bold inter font
        boldNanum: require('../assets/font/nanumgothic/NanumGothic-ExtraBold.ttf'), // bold inter font
        regularNanum: require('../assets/font/nanumgothic/NanumGothic-Regular.ttf'), // bold inter font
    })

    //for clicking the profile page by tapping on profile picture
    const handleProfilePage = () =>{ 
        navigation.navigate('Profile', {userId, username, profilePic}); //navigate to profile page, passing parameters
    };

    //color theme when turning on the dark mode
    const {colors} = useContext(ThemeContext);

    //set declaration use state for information inserting
    const [taskTitle, setTaskTitle] = useState(''); //task title
    const [taskDescription, setTaskDescription] = useState(''); //task description
    const [startTime, setStartTime] = useState(new Date()); // start time
    const [endTime, setEndTime] = useState(new Date()); // end time
    const [startDate, setStartDate] = useState(new Date()); // start date
    const [endDate, setEndDate] = useState(new Date()); //end date
    const [selectedCategory, setSelectCategory] = useState(''); // task catogory
    const [selectedStatus, setSelectedStatus] = useState(''); //task status
    const [showPicker, setShowPicker] = useState ({ type: null, mode:'date'}); //catogory picker

    //this is used to show the catogory dropdown for choosing start and end time & date
    const openPicker = (type, mode) => {
        setShowPicker({type, mode}); //set the time and date picker
    };

    //handles the change event when a data ad time is selected from the picker
    const onChange = (event, selectedDate) => { 
        if (selectedDate) {
            switch(showPicker.type){ //determine which picker was used, data or time and update the corresponding state
                case 'startTime':
                    setStartTime(selectedDate); //set start time
                    break;
                case 'endTime':
                    setEndTime(selectedDate); //set end tiem
                    break;
                case 'startDate':
                    setStartDate(selectedDate); //set start date
                    break;
                case 'endDate':
                    setEndDate(selectedDate); //set end date
                    break; //break unexpected cases
            }
        }
        //reset picker type to null and mode to date after selecting time and date
        setShowPicker({type:null, mode: 'date'});
    };

    //formats a both date and time into a locale-specific tring
    const formatDate = (date) => date.toLocaleDateString(); //formate the date
    const formatTime = (date) => date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit'}); //format the time

    //fucntion to handle the logic on adding the task to the database
    const handleAddingTask = () => {

        //helper function to formate date object string for database storage
        const formatDateForDB = (date) => {
            const year = date.getFullYear(); //extracting full year
            const month = String(date.getMonth() + 1).padStart(2, '0'); //get month
            const day = String(date.getDate()).padStart(2, '0'); //get day of month, pad with landing zero if needed
            return `${year}-${month}-${day}`; //return formatted date string in 'Years-Month-Day' format
        }

        //helper function to formate date object string for database storage
        const formatTimeForDB = (date) => {
            const hours = String(date.getHours()).padStart(2, '0'); //extract hours
            const minutes = String(date.getMinutes()).padStart(2, '0'); //extract minutes
            const seconds = String(date.getSeconds()).padStart(2, '0'); //extract seconds
            return `${hours}:${minutes}:${seconds}`; //return formatted date string in 'hours-Minutes-Seconds' format
        }

        //construct the task data to send the data to the backend
        const taskData = { 
            userId: userId, //user id
            taskTitle, //task title
            taskDescription, //task description
            startDate: formatDateForDB(startDate), //formatted start date
            endDate: formatDateForDB(endDate), //formatted end date
            startTime: formatTimeForDB(startTime), //formatted start time
            endTime: formatTimeForDB(endTime), //formatted end time
            taskCategory: selectedCategory, //selected catogory
            taskProgress: selectedStatus, //selected status
        };

        //send task data to API mySQL
        fetch('http://192.168.1.115/taskbaseapp/insertTask.php',{
            method: 'POST', //use method post
            headers: { 'Content-Type' : 'application/JSON' }, //JSON content type
            body: JSON.stringify(taskData), //convert data to JSON string
        })
        .then(response => response.json()) //parse JSON response
        .then(data => { 
            if(data.success){
                //if server success, show alert message
                Alert.alert('Success', 'You have a new tasks to do! get on with it!');
                resetText(); //reset input text after submittng
                navigation.navigate('Home'); //navigate to home page afterwards
            }else{
                //if failed, show error message 
                Alert.alert('Error', 'Task Add Failed');
            }
        })
        .catch(error => {
            //handle network or other errors
            console.error(error);
            Alert.alert('Error', 'Something Went Wrong');
        });
        //debugging data process
        console.log("Sending to PHP: ", taskData)
    };

    //reset the text fields
    const resetText = () =>{
        setTaskTitle(''), //task title
        setTaskDescription('');  //task description
        setStartTime(new Date()); //start time
        setEndTime(new Date()); //end time
        setStartDate(new Date()); //start date
        setEndDate(new Date()); //end date
        setSelectCategory(''), //selected catogory
        setSelectedStatus(''); //selected status
    }

    return(
        <View style={[styles.container, {backgroundColor:colors.background2}]}>
            <View style={styles.screenContainer}>

                {/**HEADER */}
                <View style={styles.headerRow}>
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

                {/**TITLE */}
                <Text style={[styles.addTaskTitle,{color:colors.text}]}>
                        Create New Task
                </Text>

                {/**TEXT FIELD */}
                <ScrollView contentContainerStyle={styles.scrollContainer}>

                    {/**TASK TITLE */}
                    <Text style={[styles.subTitle,{color:colors.text}]}>Task Title</Text>
                    <TextInput 
                        style={styles.taskAddingInput} 
                        placeholder="Task Title" 
                        value={taskTitle}
                        onChangeText={setTaskTitle}
                    />

                    {/**TASK DESCRIPTION */}
                    <Text style={[styles.subTitle,{color:colors.text}]}>Description</Text>
                    <TextInput 
                        style={[styles.taskAddingInput, {height: 200}]} 
                        placeholder="Description"
                        multiline 
                        textAlignVertical='top'
                        value={taskDescription}
                        onChangeText={setTaskDescription}
                    />

                    {/**TIME*/}
                    <Text style={[styles.subTitle, {color:colors.text}]}>TIME</Text>
                    <View style={styles.taskAddingRow}>
                        <TouchableOpacity 
                            style={styles.smallInput}
                            onPress={() => openPicker('startTime', 'time')}>
                                <Text>{formatTime(startTime)}</Text>
                        </TouchableOpacity>
                        <FontAwesome name='forward' size={10} color="#8f8f8f" style={{marginTop: 15}}/>
                        <TouchableOpacity 
                            style={styles.smallInput}
                            onPress={() => openPicker('endTime', 'time')}>
                                <Text>{formatTime(endTime)}</Text>
                        </TouchableOpacity>
                    </View>

                    {/**DATE*/}
                    <Text style={[styles.subTitle, {color:colors.text}]}>DATE</Text>
                    <View style={styles.taskAddingRow}>
                        <TouchableOpacity 
                            style={styles.smallInput}
                            onPress={() => openPicker('startDate', 'date')}>
                                <Text>{formatDate(startDate)}</Text>
                        </TouchableOpacity>
                        <FontAwesome name='forward' size={10} color="#8f8f8f" style={{marginTop: 15}}/>
                        <TouchableOpacity 
                            style={styles.smallInput}
                            onPress={() => openPicker('endDate', 'date')}>
                                <Text>{formatDate(endDate)}</Text>
                        </TouchableOpacity>
                    </View>
                    {showPicker.type && (
                        <DateTimePicker
                            value={
                                showPicker.type === 'startTime' ? startTime :
                                showPicker.type === 'endTime' ? endTime :
                                showPicker.type === 'startDate' ? startDate :
                                endDate
                            }
                            mode = {showPicker.mode}
                            display={Platform.OS === 'android' ? 'spinner' : 'default'}
                            onChange={onChange}
                        />
                    )}

                    {/**CATOGORY*/}
                    <Text style={[styles.subTitle, {color:colors.text}]}>Catogory</Text>
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue = {selectedCategory}
                            onValueChange = {(itemValue) => setSelectCategory(itemValue)}
                            style={styles.TextInput}
                        >
                            <Picker.Item label = "Select Category" value="" />
                            <Picker.Item label = "Personal" value="personal" />
                            <Picker.Item label = "Work" value="work" />
                            <Picker.Item label = "Sport" value="sport" />
                            <Picker.Item label = "Outside" value="outside" />
                        </Picker>
                    </View>

                    {/**STATUS*/}
                    <Text style={[styles.subTitle, {color:colors.text}]}>Status</Text>
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue = {selectedStatus}
                            onValueChange = {(itemValue) => setSelectedStatus(itemValue)}
                            style={styles.TextInput}
                        >
                            <Picker.Item label = "Select Status" value="" />
                            <Picker.Item label = "Cancelled" value="cancelled" />
                            <Picker.Item label = "In Progress" value="inProgress" />
                            <Picker.Item label = "Completed" value="completed" />
                            <Picker.Item label = "Incompleted" value="Incompleted" />
                        </Picker>
                    </View>

                    {/**BUTTON*/}
                    <TouchableOpacity
                        style = {styles.cancelNavigation}
                        onPress={() => {
                            resetText();
                            navigation.goBack();
                        }}
                    >
                        <Text style = {styles.buttonText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style = {styles.submitNavigation}
                        onPress={handleAddingTask}
                    >
                        <Text style = {styles.buttonText}>Submit</Text>
                    </TouchableOpacity>

                </ScrollView>
            </View>
        </View>
    )
}


/***************************************************************/
///********************EDIT TASK SCREEN***********************///
/***************************************************************/

//This page focus on editing task 
//it edit and update objective title and description, 
//start and end time, start and end date, status and progress.

function EditTask({route, navigation}){
    const { userId, username, profilePic, task } = route.params || {}; //pass parameters for both profile page and username
    const firstAvatar = username ? username.charAt(0).toUpperCase() : '?'; //if not profile picture, display first letter avatar of username

    //load font family from folder
    const [fontLoaded] = useFonts({
        lightInter: require('../assets/font/static/Inter_18pt-Light.ttf'), // light inter font
        mediumInter: require('../assets/font/static/Inter_18pt-Medium.ttf'), // medium inter font
        boldInter: require('../assets/font/static/Inter_18pt-Bold.ttf'), // bold inter font
    })

    //for clicking the profile page by tapping on profile picture
    const handleProfilePage = () =>{ 
        navigation.navigate('Profile', {userId, username, profilePic}); //navigate to profile page, passing parameters
    };

    //color theme when turning on the dark mode
    const {colors} = useContext(ThemeContext);
    
    //set declaration use state for information inserting
    const [taskTitle, setTaskTitle] = useState(''); // task title
    const [taskDescription, setTaskDescription] = useState(''); //task description
    const [startTime, setStartTime] = useState(new Date()); //start time
    const [endTime, setEndTime] = useState(new Date()); //end time
    const [startDate, setStartDate] = useState(new Date()); //start date
    const [endDate, setEndDate] = useState(new Date()); //end date
    const [selectedCategory, setSelectCategory] = useState(''); //task catogory
    const [selectedStatus, setSelectedStatus] = useState(''); //task status
    const [showPicker, setShowPicker] = useState ({ type: null, mode:'date'}); //set show picker

    //this is used to show the catogory dropdown for choosing start and end time & date
    const openPicker = (type, mode) => {
        setShowPicker({type, mode}); //set time and date picker
    };

     //handles the change event when a data ad time is selected from the picker
    const onChange = (event, selectedDate) => { 
        if (selectedDate) { //determine which picker was used, data or time and update the corresponding state
            switch(showPicker.type){ 
                case 'startTime':
                    setStartTime(selectedDate); //set start time
                    break;
                case 'endTime':
                    setEndTime(selectedDate); //set end time
                    break;
                case 'startDate':
                    setStartDate(selectedDate); //set start date
                    break;
                case 'endDate':
                    setEndDate(selectedDate); //set end date
                    break; //break unexpected cases
            }
        }
         //reset picker type to null and mode to date after selecting time and date
        setShowPicker({type:null, mode: 'date'});
    };
    
    //use effect hook that runs when the task object changes
    useEffect(() => {
        if (task){

             //debug task data
            console.log("Task log: ", task)

            //initialize fields with existing content from task data
            //fall back to empty strings when data is empty
            setTaskTitle(task.taskTitle || '');  //task title
            setTaskDescription(task.taskDescription || ''); //task description

            //parse date string into date object
            const parseDate = (dateString) => {
                if(!dateString) return new Date(); //return current date into date string
                const [year, month, day] = dateString.split('-').map(Number); //split and convert them into number
                return new Date(year, month - 1, day); //return 0 based in date constructor
            };

            //set start and end dates based on the task data received
            setStartDate(parseDate(task.startDate)); //parse start date
            setEndDate(parseDate (task.endDate)); //parse end datw
            
            //parse date string into time object
            const parseTime = (timeString) => {
                const [hours, minutes] = timeString.split(':').map(Number); //split and convert them into number
                const date = new Date (); //return current time into date string
                date.setHours(hours, minutes, 0, 0); //set hours, minutes and second milliseconds
                return date; //return date
            };

            //set start time and end time based on task data
            setStartTime(parseTime(task.startTime)); //start tine
            setEndTime(parseTime(task.endTime)); //end time

            //set catogory and status,
            //fallback to empty string is undefined
            setSelectCategory(task.taskCategory || ''); //task category
            setSelectedStatus(task.taskProgress || ''); //task status
        }
    }, [task]);

    //fucntion to handle the logic on adding the task to the database
    const handleUpdateTask = () => {

        //helper function to formate date object string for database storage
        const formatDateForDB = (date) => {
            const year = date.getFullYear(); //extracting full year
            const month = String(date.getMonth() + 1).padStart(2, '0'); //get month
            const day = String(date.getDate()).padStart(2, '0'); //get day of month, pad with landing zero if needed
            return `${year}-${month}-${day}`; //return formatted date string in 'Years-Month-Day' format
        };

        //helper function to formate date object string for database storage
        const formatTimeForDB = (date) => {
            const hours = String(date.getHours()).padStart(2, '0'); //extract hours
            const minutes = String(date.getMinutes()).padStart(2, '0'); //extract minutes
            const seconds = String(date.getSeconds()).padStart(2, '0'); //extract seconds
            return `${hours}:${minutes}:${seconds}`; //return formatted date string in 'hours-Minutes-Seconds' format
        };

        //construct the task data to send the data to the backend
        const taskData = {
            id: task.id, //task id
            userId: userId,  //user id
            taskTitle, //task title
            taskDescription, //task description
            startDate: formatDateForDB(startDate), //formatted start date
            endDate: formatDateForDB(endDate), //formatted end date
            startTime: formatTimeForDB(startTime), //formatted start time
            endTime: formatTimeForDB(endTime), //formatted end time
            taskCategory: selectedCategory, //selected catogory
            taskProgress: selectedStatus, //selected status
        };

        //send task data to API mySQL
        fetch('http://192.168.1.115/taskbaseapp/editTask.php', {
            method: 'POST', //use method post
            headers: {'Content-Type':'application/json'}, //JSON content type
            body: JSON.stringify(taskData),  //convert data to JSON string
        })
        .then(response => response.json()) //parse JSON response
        .then(data => {
            if(data.success){
                //if server success, show alert message
                Alert.alert('Updated!', 'Task updated!');
                //navigate to home page afterwards
                navigation.navigate('Task',{
                    screen: 'TaskList'
                });
            }else{
                //if failed, show error message 
                Alert.alert('Error', data.error || 'Update failed');
            }
        })
    };

    //formats a both date and time into a locale-specific string
    const formatDate = (date) => date.toLocaleDateString();  //formate the date
    const formatTime = (date) => date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit'}); //format the time

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