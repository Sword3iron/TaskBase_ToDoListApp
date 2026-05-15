<?php
include 'db.php';  //include database connecttion file

//read the raw post data and decode it from JSON into PHP
$data = json_decode(file_get_contents("php://input"));
$username = $data->username;
$email = $data->email;
$password = password_hash($data->password, PASSWORD_DEFAULT);

//Prepare SQL statement
$sql = "INSERT INTO users (username, email, password) 
        VALUES 
        ('$username','$email','$password')";

//execuete the query
if ($conn->query($sql) === TRUE){
    echo json_encode(["success" => true]);
}else{
    echo json_encode(["success" => false,
                      "error" => $conn -> error]);
}

//close database connection
$conn->close();
?>