<?php
header('Content-Type: application/json'); //set connection type to json
include 'db.php'; //include database connecttion file

//read the raw post data and decode it from JSON into PHP
$data = json_decode(file_get_contents("php://input"));

//use to extracting each value of the database with fallback defaults
//to prevent php notice errors if property are missing in line
if(isset($data->id)){
    $id              = $data->id;
    $userId          = $data->userId ?? ''; //a user data id
    $taskTitle       = $data->taskTitle ?? ''; //a task tite
    $taskDescription = $data->taskDescription ?? ''; //a task description
    $startDate       = $data->startDate ?? ''; //the start date for a task
    $endDate         = $data->endDate ?? ''; //the end date for a task
    $startTime       = $data->startTime ?? ''; //the start time for a task
    $endTime         = $data->endTime ?? ''; //the end time for a task
    $taskCategory    = $data->taskCategory ?? ''; //a task category
    $taskProgress    = $data->taskProgress  ?? ''; //the progress of a task

    //Prepare SQL statement
    $sql = "UPDATE tasks 
            SET userId= ? , 
                taskTitle= ? ,
                taskDescription= ? ,
                startDate= ? ,
                endDate= ? ,
                startTime= ? ,
                endTime= ? ,
                taskCategory= ? ,
                taskProgress= ? 
            WHERE id= ?";

    if ($stmt = $conn-> prepare($sql)){

    //bind parameters to the prepared statements
    //using the string 's' to corresponding data types for each parameter
    //using 'i' for integer for task and user's id claffification
    $stmt->bind_param('sssssssssi',
        $userId,
        $taskTitle,
        $taskDescription,
        $startDate,
        $endDate,
        $startTime,
        $endTime,
        $taskCategory,
        $taskProgress,
        $id
    );

    //Execueting statement
    if($stmt -> execute()){
        echo json_encode(["success" => true]);
    }else{
        echo json_encode([
            "success" => false,
            "error" => $stmt->error
        ]);
    }

    //close the statement
    $stmt->close();
    }else{
        echo json_encode([
            "success" => false,
            "error" => $conn->error
        ]);
    }
}else{
    //if task id is missing from the database, display error message.
    echo json_encode([
        "success" => false,
        "error" => "Task ID is missing from the database."
    ]);
}

//close database connection
$conn->close();
?>