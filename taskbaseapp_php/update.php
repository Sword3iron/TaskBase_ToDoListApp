<?php
header('Content-Type: application/json'); //set connection type to json
include 'db.php'; //include database connecttion file

//read the raw post data and decode it from JSON into PHP
$data = json_decode(file_get_contents("php://input"));

if (!isset($data->currentUsername, $data->username, $data->password)){
  echo json_encode([
    "success" => false, //set to false to indicate missing data
    "message" => "Missing user Id parameters.", //display message
  ]);
  exit;
}

$currentUsername = $data->currentUsername; //current username
$newUsername = $data->username; //new username
$newPassword = password_hash($data->password, PASSWORD_DEFAULT); //new password 
$profilePic = $data->profilePic ?? null; //profile picture
$profilePicFilename = null; //name of the profile picture

//Handle profile picture upload if provided
if ($profilePic)
{
    //ensuring the upload directory exist and secured
    $uploadDir = "profilePicUpload/";
    if(!is_dir($uploadDir)){
        mkdir($uploadDir, 0755, true);
    }

    //Decode base and generate a unique filename
    $decodeData = base64_decode($profilePic);
    if($decodeData !== false){
        $profilePicFilename = uniqid() . ".jpg";
        file_put_contents($uploadDir . $profilePicFilename, $decodeData);
    }
}

//Preapre the SQL statement
if($profilePicFilename){
    $sql = "UPDATE users SET username = ?, 
                             password = ?, 
                             profilePic = ? 
            WHERE username = ?";
    $stmt = $conn->prepare($sql);
    //using 's' value as a string
    $stmt->bind_param("ssss", $newUsername, 
                              $newPassword, 
                              $profilePicFilename, 
                              $currentUsername);
}else{
    $sql = "UPDATE users SET username = ?, 
                             password = ?
            WHERE username = ?";
    $stmt = $conn->prepare($sql);
    //using 's' value as a string
    $stmt->bind_param("sss", $newUsername, 
                              $newPassword, 
                              $currentUsername);
}

//Exeuete the update query
$updateSuccess = $stmt->execute();
$stmt->close();

if($updateSuccess){
    //Prepare the SQL statement om select 
    $selectSql = "SELECT id, username, email, profilePic 
                  FROM users 
                  WHERE username = ?";
    $selectStmt = $conn->prepare($selectSql);
    $selectStmt->bind_param("s", $newUsername);
    $selectStmt->execute();
    $result = $selectStmt->get_result();

    if($result->num_rows > 0){
        $user = $result->fetch_assoc();
        echo json_encode([
            "success" => true,
            "user" => $user
        ]);
    }else{
        echo json_encode([
            "success"=>false,
            "message"=>"User Not Found"
        ]);
    }
    $selectStmt->close();
}else{
    echo json_encode([
        "success" => false,
        "message" => "Database query preparation failed."
    ]);
}

//close database connection
$conn->close();
?>