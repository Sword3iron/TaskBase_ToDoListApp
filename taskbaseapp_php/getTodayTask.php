<?php
include 'db.php'; //include database connecttion file

$data = json_decode(file_get_contents('php://input')); //set connection type to json
$userId = $data->userId;
$date = $data->date;

//Prepare SQL statement
$sql = "SELECT * FROM tasks
        WHERE userId = ?
        AND startDate = ?
        ORDER BY startTime ASC";

$stmt = $conn->prepare($sql);

//Bind the parameters
// use 's' as strings and 'i' as integer for parameters
$stmt->bind_param('is', $userId, $date);

//Execute the query
$stmt->execute();

$result = $stmt->get_result();

$tasks = [];

while ($row = $result->fetch_assoc()){
    $tasks[] = $row;
}

echo json_encode($tasks);

//close database connection
$stmt->close();
$conn->close();
?>