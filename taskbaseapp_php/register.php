<?php
include 'db.php';  //include database connecttion file

//read the raw post data and decode it from JSON into PHP
$data = json_decode(file_get_contents("php://input"));

//Validating the data's existence that required field exists
if (!$data || !isset($data->username) || !isset($data->email) || !isset($data->password)){
  echo json_encode([
    "success" => false, //set to false to indicate missing data
    "message" => "Missing user Id parameters.", //display message
  ]);
  exit;
}

$username = $data->username;
$email = $data->email;
$password = password_hash($data->password, PASSWORD_DEFAULT);

//Prepare SQL statement
$stmt = $conn->prepare("INSERT INTO users (username, email, password)
                        VALUES (?, ?, ?)");


//execuete the query
if ($stmt){
    $stmt->bind_param('sss', $username, $email, $password);

    //Execute the SQL statement
    if($stmt->execute()){
        echo json_encode(["success" => true]);
    }else{
        echo json_encode([
            "success" => false,
            "error" => $stmt->error
        ]);
    }

    //close the statement
    $stmt->close();
}else{
    echo json_encode([
        "success"=>false,
        "error" => $conn->error
    ]);
}
//close database connection
$conn->close();
?>