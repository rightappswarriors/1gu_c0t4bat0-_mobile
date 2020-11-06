<?php
header("Access-Control-Allow-Origin: *");
$r["message"] = "success";
echo json_encode($r);

switch ($action) {
 case 'login':
       $x08 = new x08model();
       $data = array("uid = '".$_POST["username"]."'",
                     "pwd = '".$_POST["password"]."'");
       $fld = implode(' and ', $data);
       $row = $x08->check($fld);
       if($row == null){
         $o["message"] = "error";
       }else{
       	 $o["message"] = "success";
       	 $o["user"] = array();
       	 foreach ($row as $key => $r) {
       	 	$items = array();
       	 	$items["uid"] = $r["uid"];
       	 	$items["opr_name"] = $r["opr_name"];
          $items["pwd"] = $r["pwd"];
          $items["grp_id"] = $r["grp_id"];
          $items["d_code"] = $r["d_code"];
          array_push($o["user"], $items);  
       	 }
       	 
       }
      
       echo json_encode($o);     

  break;
}

?>