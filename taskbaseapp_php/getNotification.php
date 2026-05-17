<?php
include 'db.php'; //include database connecttion file

//read the raw post data and decode it from JSON into PHP
$data = json_decode(file_get_contents("php://input"));
$userId = intval($_GET['userId']);

//Prepare SQL statement
$sql = "SELECT id, taskTitle, taskDescription, startDate, startTime
        FROM tasks 
        WHERE userId = $userId 
        AND NOW() 
            BETWEEN DATE_SUB(CONCAT(startDate, ' ', startTime), INTERVAL 30 MINUTE)
                AND CONCAT(startDate, ' ', startTime)
        ORDER BY startDate ASC, startTIME ASC";

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
                      "tasks" => $tasks,
                      "count" => count($tasks)
                    ]);
}else{
    //if task doesn't found, return failure with message and debug info
    echo json_encode([
                      "success" => true,
                      "tasks" => [],
                      "count" => 0
                    ]);
}

//close database connection
$conn->close();

?>