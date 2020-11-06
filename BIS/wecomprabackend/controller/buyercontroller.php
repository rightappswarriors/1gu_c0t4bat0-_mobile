<?php

include("../model/buyermodel.php");
include("../model/x08model.php");

header("Access-Control-Allow-Origin: *");
$postdata = file_get_contents("php://input");
$request = json_decode($postdata);

$user = new buyermodel();
$x08 = new x08model();
$action = "";
if($request !=null){
  $action = $request->action;
}else{
  $action = $_POST["action"];
}
//for json data
switch ($action) {
  case 'register':
       $uid = "";  
       $ok = $x08->add(array($request->name,$request->email,$request->ipaddr,$request->device,$request->password,'3'));
       //query email and number
       $sql = "SELECT * FROM x08 WHERE email = '".$request->email."' AND pwd='".$request->password."'";
       $row = $x08->query($sql);

       if($row != null){
         foreach ($row as $key => $r) {
            $items = array();
            $uid = $r["uid"];  
         }
       }
       $ok = $user->add(array($request->name,$request->email,$request->number,'','','0000-00-00',$request->imageurl,$request->password,$uid));
       $message=($ok)?"success":"error";
       $res["message"] =$message;
       $res["uid"] =$uid;
       echo json_encode($res);     
  break;

  case 'login':
       $data = array("email = '".$request->username."'",
                     "password = '".$request->password."'");
       $fld = implode(' and ', $data);
       $row = $user->check($fld);

       if($row == null){
         $res["message"] = "error";
       }else{
         $res["message"] = "success";
         $res["user"] = array();
         foreach ($row as $key => $r) {
          $items = array();
          $items["buyerid"] = $r["buyerid"];
          $items["name"] = $r["name"];
          $items["email"] = $r["email"];
          $items["phonenumber"] = $r["phonenumber"];
          $items["gender"] = $r["gender"];
          $items["shop_name"] = $r["shop_name"];
          $items["dob"] = $r["dob"];
          $items["userimage"] = $r["userimage"];
          $items["password"] = $r["password"];
          $items["uid"] = $r["uid"];
          array_push($res["user"], $items);  
         }
         
       }
       echo json_encode($res);
  break;

  case 'update':
    $image = "noimage.jpg";
    $target_path = "../files/users/";
    //$image = $_FILES['file']['name'];
    if(isset($_FILES['file']['name'])){      
      $target_path = $target_path . basename($_FILES['file']['name']);
      if(move_uploaded_file($_FILES['file']['tmp_name'], $target_path)) {
          $image = $_FILES['file']['name'];
      }
      $data = array(
                  "name = '".$_POST["name"]."'",
                  "phonenumber = '".$_POST["number"]."'",
                  "shop_name = '".$_POST["shopname"]."'",
                  "gender = '".$_POST["gender"]."'",
                  "dob = '".$_POST["dob"]."'",
                  "userimage = '".$image."'",
                  "password = '".$_POST["pass"]."'"
                );    
    }else{
      $data = array(
                  "name = '".$_POST["name"]."'",
                  "phonenumber = '".$_POST["number"]."'",
                  "shop_name = '".$_POST["shopname"]."'",
                  "gender = '".$_POST["gender"]."'",
                  "dob = '".$_POST["dob"]."'",
                  "password = '".$_POST["pass"]."'"
                );
    }
    
    $fld = implode(",",$data);
    $ok = $user->update($fld,"uid",$_POST["uid"]);
    $message=($ok)?"success":"error";
    $res["message"] = $message;
    echo json_encode($res);
  break;


}
