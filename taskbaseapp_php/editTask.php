<?php
include 'db.php'; //include database connecttion file

//read the raw post data and decode it from JSON into PHP
$data = json_decode(file_get_contents("php://input"));

if(isset($data->id)){
    $id = $data->id;
    $userId = $data->userId; //a user data id
    $taskTitle = $data->taskTitle; //a task tite
    $taskDescription = $data->taskDescription; //a task description
    $startDate = $data->startDate; //the start date for a task
    $endDate = $data->endDate; //the end date for a task
    $startTime = $data->startTime; //the start time for a task
    $endTime = $data->endTime; //the end time for a task
    $taskCategory = $data->taskCategory; //a task category
    $taskProgress = $data->taskProgress; //the progress of a task

    //Prepare SQL statement
    $sql = "UPDATE tasks 
            SET userId='$userId', 
                taskTitle='$taskTitle',
                taskDescription='$taskDescription',
                startDate='$startDate',
                endDate='$endDate',
                startTime='$startTime',
                endTime='$endTime',
                taskCategory='$taskCategory',
                taskProgress='$taskProgress'
            WHERE id='$id'";

    //execuete the query
    $result = $conn->query($sql);

    //check if result is true
    if ($result === TRUE)
    {
        echo json_encode(["success" => true]);
    }else{
        echo json_encode(["success" => false,
                        "error" => $conn -> error
        ]);
    }
}else{
    echo json_encode([
        "success" => false,
        "error"=> "Task ID is Required!"
    ]);
}

//close database connection
$conn->close();
?>