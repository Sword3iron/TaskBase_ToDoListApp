<?php
//Start session
//Added injection for secure
if (session_status() === PHP_SESSION_NONE){
    session_start();
}

//Prevent session from fixation
//unset all session variables once the session is completed
$_SESSION = array();

//Delete every cookie session if exist
if(ini_get("session.use_cookies")){
    $params = session_get_cookie_params();
    setcookie(
        session_name(),
        '',
        time() - 42000,
        $params['path'],
        $params['domain'],
        $params['secure'],
        $params['httponly']        
    );
}

//destroy all session time used 
session_destroy();

//Send a JSON response beck to the cilent on the application
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('Content-Type: application/json; charset=UTF-8');

//Output safe Json file
echo json_encode([
    "success" => true, 
    "message" => "Your Have Logged Out, Come Back Soon."],
    JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_HEX_AMP);
    exit;
?>