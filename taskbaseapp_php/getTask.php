<?php
include 'db.php'; //include database connecttion file

//read the raw post data and decode it from JSON into PHP
$data = json_decode(file_get_contents("php://input"));
$userId = $data->userId;
$date = $data->date;

//Prepare SQL statement
$sql = "SELECT id, taskTitle, taskDescription, taskCategory, startTime, endTime, startDate, endDate, taskProgress
        FROM tasks 
        WHERE userId = '$userId' AND startDate = '$date' ORDER BY startTime ASC";

//execuete the query
$result = $conn->query($sql);

//check the array of the tasks
$tasks = [];

//check if a database exist
if($result->num_rows > 0)
{
  //fetch the data user in an associative array
    while($row = $result->fetch_assoc())
    {
        $tasks[] = $row;
    }
     //if task found, return success along with user details
    echo json_encode([
                      "success" => true,
                      "tasks" => $tasks
                    ]);
}else{
  //if task doesn't found, return failure with message and debug info
    echo json_encode([
                      "success" => true,
                      "tasks" => []
                    ]);
}

//close database connection
$conn->close();
?>