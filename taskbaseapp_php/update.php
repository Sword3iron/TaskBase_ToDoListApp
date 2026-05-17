<?php
include 'db.php'; //include database connecttion file

//read the raw post data and decode it from JSON into PHP
$data = json_decode(file_get_contents("php://input"));
$currentUsername = $data->currentUsername;
$newUsername = $data->username;
$newPassword = password_hash($data->password, PASSWORD_DEFAULT);
$profilePic = $data->profilePic;
$profilePicFilename = null;
if ($profilePic)
{
    $profilePicFilename = uniqid() . ".jpg";
    file_put_contents("profilePicUpload/". $profilePicFilename, base64_decode($profilePic));
}

//Prepare SQL statement
$sql = "UPDATE users SET username = '$newUsername', password='$newPassword'". 
       ($profilePicFilename ? ", profilePic='$profilePicFilename'" : "") . 
       " WHERE username= '$currentUsername'"; 

//execuete the query
$result = $conn->query($sql);

//check if result is true
if ($result === TRUE)
{
    //SQL statement on username 
    $selectSql = "SELECT id, username, email, profilePic FROM users WHERE username='$newUsername'";
    $result = $conn->query($selectSql);

    //check if result is true
    if($result->num_rows > 0)
    {
        //fetch the data user in an associative array
        $user = $result->fetch_assoc();

        //if user found, return success along with user details
        echo json_encode([
            "success" => true, 
            "user" => $user
        ]);
    }
    else
    {
        //if user doesn't found, return failure with message and debug info
        echo json_encode([
            "success" => false, 
            "message" => "user not found"
        ]);
    }
}
else
{
    //if updated failed, return message
    echo json_encode([
        "success" => false, 
        "message" => "Update Failed"
    ]);
}

//close database connection
$conn->close();
?>