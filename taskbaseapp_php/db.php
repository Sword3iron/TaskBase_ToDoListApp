<?php

//secure the connect to the database and server
$conn =new mysqli('localhost:3306', 'root', '', 'taskbasedata');

//if connection failed
if ($conn -> connect_error)
{
    //display error message
    die("Connection Failed: " . $conn->connect_error);
}

?>