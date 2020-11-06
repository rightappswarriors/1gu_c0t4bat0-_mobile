<?php
//include("DBHelper.php");
require_once("DBHelper.php");
class sellermodel extends DBHelper{
	    
        private $table="seller";
		private $fields=array(
			'shop_name',
			'shop_description',
			'shop_image',
			'uid'	
		);
        
       
		function __construct()	{ DBHelper :: __construct(); }
		
		function add($data){
			return DBHelper :: addRecord($this->table,$this->fields,$data);
		}
		
		function getAll(){
			return DBHelper :: getAllRecord($this->table);
		}
		function check($data){
			return DBHelper :: checkRecord($this->table,$data);
		}
		function get($field_id,$ref_id){
			return DBHelper :: getRecord($this->table,$field_id,$ref_id);
		}
		function query($data){
			return DBHelper :: getQueryBySqlCode($data);
		}
		function update($data,$field_id,$ref_id){
			return DBHelper :: updateRecord($this->table,$data,$field_id,$ref_id);
		}
		function delete($field_id,$ref_id){
			return DBHelper :: deleteRecord($this->table,$field_id,$ref_id);
		}  

}
?>