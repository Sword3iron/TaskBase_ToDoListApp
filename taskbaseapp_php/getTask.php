<?php
header('Content-Type: application/json'); //set connection type to json
include 'db.php'; //include database connecttion file

//read the raw post data and decode it from JSON into PHP
$data = json_decode(file_get_contents("php://input"));

//Validating the data's existence that required field exists
if (!$data || !isset($data->userId) || !isset($data->date)){
  echo json_encode([
    "success" => false, //set to false to indicate missing data
    "message" => "Missing user Id or month parameters.", //display message
  ]);
  exit;
}

$userId = $data->userId;
$date = $data->date;

//Prepare SQL statement
$sql = "SELECT id, taskTitle, taskDescription, taskCategory, startTime, endTime, startDate, endDate, taskProgress
        FROM tasks 
        WHERE userId = ? AND startDate = ?
        ORDER BY startTime ASC";

$stmt = $conn->prepare($sql);

if ($stmt === false){
  echo json_encode([
      "success" => false,
      "message" => "Database error: " . $conn->error
    ]);
    exit;
}

//Bind the parameters
// use 's' as strings for parameters
$stmt->bind_param("ss", $userId, $date);

//Execute the query
$stmt->execute();
$result = $stmt->get_result();
$tasks = [];

if ($result->num_rows > 0){
  while ($row = $result->fetch_assoc()){
      $tasks[] = $row;
  }
  echo json_encode([
    "success" => true,
    "tasks" => $tasks
  ]);
}else{
  echo json_encode([
    "success" => true,
    "tasks" => []
  ]);
}

//close database connection
$stmt->close();
$conn->close();
?>