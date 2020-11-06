<?php
header("Access-Control-Allow-Origin: *");
//header("Access-Control-Allow-Headers:Origin, x-Requested-With,Content-Type, Accept");     
$r["message"] = "success";
echo json_encode($r);

?>