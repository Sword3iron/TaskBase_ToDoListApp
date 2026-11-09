<?php
include 'db.php'; //include database connecttion file

//read the raw post data and decode it from JSON into PHP
$data = json_decode(file_get_contents("php://input"));

// Get user Id from GET and ensure the value was an integer
$userId = isset($_GET['userId']) ? intval($_GET['userId']) : 0;

//Prepare SQL statement
$sql = "SELECT id, taskTitle, taskDescription, startDate, startTime
        FROM tasks 
        WHERE userId = ?
        AND NOW() 
            BETWEEN DATE_SUB(CONCAT(startDate, ' ', startTime), INTERVAL 30 MINUTE)
                AND CONCAT(startDate, ' ', startTime)
        ORDER BY startDate ASC, startTIME ASC";

$tasks = [];

//execuete the query
$result = $conn->query($sql);

//Prepare the injection statement
if ($stmt = $conn->prepare($sql)){
    //Bind the parameters with the value 'i' for integer
    $stmt->bind_param('i', $userId);
    //Execute the query
    $stmt->execute();
    //Get the result
    $result = $stmt->get_result();

    if ($result-> num_rows > 0){
        while($row = $result-> fetch_assoc()){
            $tasks[] = $row;
        }
        echo json_encode([
            "success" => true,
            "tasks" => $tasks,
            "count" => count($tasks)
        ]);
    }else{
        echo json_encode([
            "success" =>  true,
            "tasks" => [],
            "count" => 0
        ]);
    }
    //Close SQL statement
    $stmt->close();
}else{
    //Handle SQL preparation error
    echo json_encode([
        "success" => false,
        "message" => "Database query preparation failed."
    ]);
}

//close database connection
$conn->close();

?>