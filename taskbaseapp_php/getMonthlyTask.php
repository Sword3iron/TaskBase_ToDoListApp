<?php
header('Content-Type: application/json');//set connection type to json
include 'db.php'; //include database connecttion file

//Read the raw post data and decode it from JSON into PHP
$data = json_decode(file_get_contents("php://input"));

//Validating the data's existence that required field exists
if (!isset($data->userId) || !isset($data->month)){
  echo json_encode([
    "success" => false, //set to false to indicate missing data
    "message" => "Missing user Id or month parameters.", //display message
    "tasks" => [], //task set to empty array 
    "count" => 0 //set count to zero
  ]);
  exit;
}

//Extracting each value of the database
$userId = $data->userId;; //user id
$month = $data->month;//month 
$monthWildcard = $month . '%'; //create wildcard safety for SQL query

//Prepare SQL statement
$sql = "SELECT id, taskTitle, taskDescription, taskCategory, startTime, endTime, startDate, endDate, taskProgress
        FROM tasks 
        WHERE userId = ? AND startDate LIKE ?
        ORDER BY startDate ASC, startTime ASC";

//conect to the database and prepare the statement
$stmt = $conn->prepare($sql);

if ($stmt === false) {
    echo json_encode([
      "success" => false,
      "message" => "Database Failed To Appear: " . $conn->error,
      "tasks" => [],
      "count" => 0
    ]);
    exit;
}

//Bind the parameters to the prepared statement
$stmt->bind_param('ss', $userId, $monthWildcard);

//Execuete the query at once
$stmt->execute();
$result = $stmt->get_result();
$tasks = [];

//Fetch the data into one array
while ($row = $result->fetch_assoc()){
  $task[] = $row;
}

//return the result
echo json_encode([
  "success" => true,
  "task" => $tasks,
  "count" => count($tasks)
]);

//close database connection
$stmt->close();
$conn->close();
?>