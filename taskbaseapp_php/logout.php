<?php

//Start session
session_start();

//unset all session variables once the session is completed
session_unset();

//destroy all session time used 
session_destroy();

//Send a JSON response beck to the cilent on the application
header('Content-Type: application/json');
echo json_encode(["success" => true, "Your Have Logged Out" => "Come Back Soon."])

?>