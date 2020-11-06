<?php
header("Access-Control-Allow-Origin: *");
include("../model/sellermodel.php");


$postdata = file_get_contents("php://input");
$request = json_decode($postdata);
$seller = new sellermodel();

//check if the data is using formdata or jsondata
$action = "";
if($request !=null){
  $action = $request->action;
}else{
  $action = $_POST["action"];
}

switch ($action) {
  case 'get':
       //query email and number
       $sql = "SELECT * FROM seller WHERE uid = '".$request->uid."'";
       $row = $seller->query($sql);
       if($row != null){
         $res["message"] ="success";
         $res["shop"] = array();
         foreach ($row as $key => $r) {
            $items = array();
            $items["uid"] = $r["uid"]; 
            $items["sellerid"] = $r["sellerid"];
            $items["shop_name"] = $r["shop_name"];
            $items["shop_description"] = $r["shop_description"];
            $items["shop_image"] = $r["shop_image"];
            array_push($res["shop"], $items);   
         }
       }else{
         $ok = $seller->add(array($request->shop_name,'',$request->imageurl,$request->uid));
         $message=($ok)?"success":"error";
         $res["message"] =$message;
         $res["shop"] = array();
         $sql = "SELECT * FROM seller WHERE uid = '".$request->uid."'";
         $row = $seller->query($sql);
         foreach ($row as $key => $r) {
            $items = array();
            $items["uid"] = $r["uid"]; 
            $items["sellerid"] = $r["sellerid"];
            $items["shop_name"] = $r["shop_name"];
            $items["shop_description"] = $r["shop_description"];
            $items["shop_image"] = $r["shop_image"];
            array_push($res["shop"], $items);   
         }  
       }  
       echo json_encode($res);     
  break;

  case 'update':
      
      //if the user has input image
      $image = "noimage.jpg";
      $target_path = "../files/users/";
     
     if(isset($_FILES['file']['name'])){      
        $target_path = $target_path . basename($_FILES['file']['name']);
        if(move_uploaded_file($_FILES['file']['tmp_name'], $target_path)) {
            $image = $_FILES['file']['name'];
        }
        $data = array(
                  "shop_name = '".$_POST["shopname"]."'",
                  "shop_description = '".$_POST["shopdesc"]."'",
                  "shop_image = '".$image."'"
                );    
      }else{
        $data = array(
                  "shop_name = '".$_POST["shopname"]."'",
                  "shop_description = '".$_POST["shopdesc"]."'"
                );
      }

      
      $fld = implode(",",$data);
      $ok = $seller->update($fld,"uid",$_POST["uid"]);
      $message=($ok)?"success":"error";
      $res["message"] = $message;
      $res["shop"] = array();
         $sql = "SELECT * FROM seller WHERE uid = '".$_POST["uid"]."'";
         $row = $seller->query($sql);
         foreach ($row as $key => $r) {
            $items = array();
            $items["uid"] = $r["uid"]; 
            $items["shop_name"] = $r["shop_name"];
            $items["shop_description"] = $r["shop_description"];
            $items["shop_image"] = $r["shop_image"];
            array_push($res["shop"], $items);   
         }
      echo json_encode($res);
  break;
  
}
?>
