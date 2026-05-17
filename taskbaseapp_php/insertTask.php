<?php
include 'db.php'; //include database connecttion file

//read the raw post data and decode it from JSON into PHP
$data = json_decode(file_get_contents("php://input"));
$userId = $data->userId;
$taskTitle = $data->taskTitle;
$taskDescription = $data->taskDescription;
$startDate = $data->startDate;
$endDate = $data->endDate;
$startTime = $data->startTime;
$endTime = $data->endTime;
$taskCategory = $data->taskCategory;
$taskProgress = $data->taskProgress;

//Prepare SQL statement
$sql = "INSERT INTO tasks (userId, taskTitle, taskDescription, startDate, endDate, startTime, endTime, taskCategory, taskProgress)
        VALUES
        ('$userId', '$taskTitle', '$taskDescription', '$startDate', '$endDate', '$startTime', '$endTime', '$taskCategory', '$taskProgress')";

//execuete the query
$result = $conn->query($sql);

//check if result is true
if ($result === TRUE)
{
    echo json_encode(["success" => true]);
}else{
    echo json_encode(["success" => false,
                      "error" => $conn -> error]);
}

//close database connection
$conn->close();
?>