<?php

include("../model/brandmodel.php");
include("../model/categorymodel.php");
include("../model/productmodel.php");
include("../model/productfilemodel.php");
include("../model/variationmodel.php");


header("Access-Control-Allow-Origin: *");
$postdata = file_get_contents("php://input");
$request = json_decode($postdata);

$brand = new brandmodel();
$category = new categorymodel();
$product = new productmodel();
$prodfile = new productfilemodel();
$variation = new variationmodel();

$action = "";
if($request !=null){
  $action = $request->action;
}else{
  $action = $_POST["action"];
}
//for json data

switch ($action) {
  case 'getbrand':
       $row = $brand->getAll();
       if($row != null){
         $res["message"] ="success";
         $res["brand"] = array();
         foreach ($row as $key => $r) {
            $items = array();
            $items["brandid"] = $r["brandid"]; 
            $items["brandname"] = $r["brandname"];
            array_push($res["brand"], $items);   
         }
       }  
       echo json_encode($res);     
  break;
  case 'getcategory':
       $row = $category->getAll();
       if($row != null){
         $res["message"] ="success";
         $res["category"] = array();
         foreach ($row as $key => $r) {
            $items = array();
            $items["categoryid"] = $r["categoryid"]; 
            $items["categoryname"] = $r["categoryname"];
            array_push($res["category"], $items);   
         }
       }  
       echo json_encode($res);     
  break;
  
  case 'add':
       $varitems = json_decode($_POST["variation"]);
       $ok = $product->add(array($_POST["name"],$_POST["desc"],$_POST["category"],$_POST["brand"],$_POST["price"],$_POST["stock"],'0',$_POST["sellerid"]));
       $message=($ok)?"success":"error";
       //WHERE sellerid = '".$_POST["sellerid"]."' 
       $sql = "SELECT prodid FROM product WHERE sellerid = '".$_POST["sellerid"]."' ORDER BY prodid DESC LIMIT 1";
       $row = $product->query($sql);
       $prodid;
       if($row != null){
           foreach ($row as $key => $r) {
              $res["prodid"] = $r["prodid"]; 
              $prodid = $r["prodid"];
           }
        }


        if(count($varitems) != 0){
           foreach ($varitems as $key => $r) { 
               $ok = $variation->add(array($r->type,$r->options,$r->price,$r->stock,$prodid));
           }
        }
       $res["message"] = $message;
       echo json_encode($res);
  break;

  case 'uploadimage':
       $image = "noimage.jpg";
       $target_path = "../files/products/";

       if(isset($_FILES['file']['name'])){ 
          $target_path = $target_path . basename($_FILES['file']['name']);
          if(move_uploaded_file($_FILES['file']['tmp_name'], $target_path)) {
              $image = $_FILES['file']['name'];
              $ok = $prodfile->add(array($image,$_POST["prodid"]));
              $message=($ok)?"success":"error";
              $res["message"] = $message; 
          }
       }else{
         $res["message"] = "error";
       }
       echo json_encode($res);
  break;

  case 'getproducts':
      $sql = "SELECT * FROM product where sellerid='".$request->sellerid."'";
      $row = $product->query($sql);
       if($row != null){
         $res["message"] ="success";
         $res["product"] = array();
         foreach ($row as $key => $r) {
            $items = array();
            $price;
            $stock;
            $items["prodid"] = $r["prodid"]; 
            $items["prodname"] = $r["prodname"];
            $items["proddesc"] = $r["proddesc"];
            $items["catid"] = $r["catid"];
            $items["brandid"] = $r["brandid"];
            $price = $r["price"];
            $stock = $r["stock"];

            //get the variation items
            $items["variation"] = array();
            $vsql = "SELECT * FROM variation WHERE prodid = '".$r["prodid"]."'";
            $vitems = $product->query($vsql);
            foreach ($vitems as $key => $v) {
               $vitem = array();
               $vitem["type"] = $v["type"];
               $vitem["options"] = $v["options"];
               $vitem["price"] = $v["price"];
               $vitem["stock"] = $v["stock"];
               array_push($items["variation"], $vitem); 
            }
            
            //get the product files items
            $items["prodfiles"] = array();
            $psql = "SELECT filename FROM product_files WHERE prodid = '".$r["prodid"]."";
            $pfitems = $product->query($psql);
            foreach ($pfitems as $key => $pf) {
               $pfitem = array();
               $pfitem["filename"] = $pf["filename"];
               array_push($items["prodfiles"], $pfitem);  
            }
            /*
            $vsql = "SELECT MIN(price) as minprice ,MAX(price) as maxprice,SUM(stock) as stock FROM variation WHERE prodid = '".$r["prodid"]."'";
            $vitem = $product->query($vsql);
            foreach ($vitem as $key => $v) {
               $price = $v["minprice"];
               $stock = $v["stock"]; 
            }
            */
            $items["price"] = $price;
            $items["stock"] = $stock;
            array_push($res["product"], $items);   
         }
         
       }else{
          $res["message"] ="error";
       }
       


       echo json_encode($res);  
       
  break;
}
