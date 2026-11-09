<?php
include 'db.php'; //include database connecttion file

//read the raw post data and decode it from JSON into PHP
$data = json_decode(file_get_contents("php://input"));

//Validating the data's existence that required field exists
if (!isset($data->email) || empty($data->email)){
    echo json_encode(["success" => false, "message" => "Email is required"]);
    exit;
}

$email =$data -> email;

//Prepare SQL statement
$sql = "SELECT * FROM user WHERE email = ?";
$stmt = $conn->prepare($sql);

//Process in execute the query
if ($stmt){
    //Bind the prarameters with 's' value for string
    $stmt->bind_param('s', $email);

    //Execute the query
    $stmt->execute();

    //Get the result using injection statement
    $result = $stmt->get_result();

    //Check if the user exist in database
    if($result->num_rows > 0){
        $user = $result->fetch_assoc();
        echo json_encode([
            "success" => true,
            "user" => $user
        ]);
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