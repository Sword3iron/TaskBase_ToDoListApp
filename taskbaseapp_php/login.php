<?php
include 'db.php'; //include database connecttion file

//read the raw post data and decode it from JSON into PHP
$data = json_decode(file_get_contents("php://input"));
$email = $data->email;
$password = $data->password;

//Prepare SQL statement
$sql = "SELECT * FROM users WHERE email = '$email'";

//execuete the query
$result = $conn->query($sql);

//check if a user database exist
if ($result->num_rows > 0){
    //fetch the data user in an associative array
    $user = $result->fetch_assoc();
    //if the password is verify
    if (password_verify($password, $user['password']))
    {
        //if password matches, return success along with user details
        echo json_encode(["success" => true, 
                          "id" => $user['id'],
                          "username" => $user['username'],
                          "profilePic" => $user['profilePic']
        ]);
    }else{
        //if password doesn't match, return failure with message and debug info
        echo json_encode([
            "success" => false,
            "message" => "Invalid Password",
            "debug_password" => $password,
            "debug_hash" => $user['password']
        ]);
    }
}else{
    echo json_encode(["success" => false, "message"=>"User not found"]);
}

//close database connection
$conn->close();

?>