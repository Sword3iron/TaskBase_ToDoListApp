<?php
include 'db.php'; //include database connecttion file

//read the raw post data and decode it from JSON into PHP
$data = json_decode(file_get_contents("php://input"));
$email =$data -> email;

//Prepare SQL statement
$sql = "SELECT * FROM user WHERE email = '$email'";

//execuete the query
$result = $conn->query($sql);

//check if a user database exist
if($result -> num_rows > 0)
{
    $user = $result -> fetch_assoc();
    echo json_encode(["success" => true, 
                      "user" => $user]);
}else{
    echo json_encode(["success" => false, 
                      "message" => "user not found"]);
}

//close database connection
$conn->close();
?>