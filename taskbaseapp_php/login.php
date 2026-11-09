<?php
include 'db.php'; //include database connecttion file

//read the raw post data and decode it from JSON into PHP
$data = json_decode(file_get_contents("php://input"));
$email = $data->email ?? '';
$password = $data->password ?? '';

//Prepare SQL statement
$stmt = $conn->prepare("SELECT id, username, password, profilePic
                       FROM users WHERE email = ?");

if ($stmt){
    //Bind the parameters with 's' value for string
    $stmt->bind_param('s', $email);

    //Execute the query
    $stmt->execute();

    //Extracting the result
    $result =$stmt->get_result();

    //Check if the user exist in database
    if($result->num_rows> 0){
        //fetch the user data in an array
        $user = $result->fetch_assoc();

        //verifying the password by user
        if(password_verify($password, $user['password'])){
            echo json_encode([
                'success' => true,
                "id" => $user['id'],
                "username" => $user['username'],
                "profilePic" => $user['profilePic']
            ]);
        }else{
            //if the password does not match
            echo json_encode([
                "success" => false,
                "message" => "Invalid Password"
            ]);
        }
    }else{
        echo json_encode([
            "success" => false,
            "message" => "User Not Found"
        ]);
    }

    //Close the statement
    $stmt->close();    
}else{
    echo json_encode([
        "success" => false,
        "message" => "Database Query Error."
    ]);
}

//close database connection
$conn->close();
?>