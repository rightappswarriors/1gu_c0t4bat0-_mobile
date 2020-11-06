<?php
//include("DBHelper.php");
require_once("DBHelper.php");
class productfilemodel extends DBHelper{
	    
        private $table="product_files";
		private $fields=array(
			'filename',
			'prodid'	
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