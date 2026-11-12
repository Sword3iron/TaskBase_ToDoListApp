<?php
include 'db.php'; //include database connecttion file

//read the raw post data and decode it from JSON into PHP
$data = json_decode(file_get_contents("php://input"));

//Validating the data's existence that required field exists
if (!$data){
    echo json_encode(["success" => false, "error" => "Invalid Json File"]);
    exit();
}

//read the raw post data and decode it from JSON into PHP
$userId          = $data->userId ?? null; //a user data id
$taskTitle       = $data->taskTitle ?? null; //a task tite
$taskDescription = $data->taskDescription ?? null; //a task description
$startDate       = $data->startDate ?? null; //the start date for a task
$endDate         = $data->endDate ?? null; //the end date for a task
$startTime       = $data->startTime ?? null; //the start time for a task
$endTime         = $data->endTime ?? null; //the end time for a task
$taskCategory    = $data->taskCategory ?? null; //a task category
$taskProgress    = $data->taskProgress ?? null;  //the progress of a task

//Prepare SQL statement
$sql = "INSERT INTO tasks (userId, taskTitle, taskDescription, startDate, endDate, startTime, endTime, taskCategory, taskProgress)
        VALUES
        (?, ?, ?, ?, ?, ?, ?, ?, ?)";

$stmt = $conn->prepare($sql);

if ($stmt === false){
    echo json_encode(["success" => false, "error" => $conn->error]);
    exit();
}

//bind parameters to the prepared statements
//using the string 's' to corresponding data types for each parameter
//using 'i' for integer for task and user's id claffification
$stmt->bind_param('issssssss',
        $userId,
        $taskTitle,
        $taskDescription,
        $startDate,
        $endDate,
        $startTime,
        $endTime,
        $taskCategory,
        $taskProgress
    );

// Execute the statement
if($stmt->execute()){
    echo json_encode(["success" => true]);
}else{
    echo json_encode(["success" => false, "error" => $stmt->error]);
}

//close database connection
$stmt->close();
$conn->close();
?>