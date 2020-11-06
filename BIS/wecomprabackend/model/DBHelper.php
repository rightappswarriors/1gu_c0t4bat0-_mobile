<?php
	///database utility
	class DBHelper{
		//properties
		//private $hostname='192.168.254.99';
		private $hostname='localhost';
		private $username='root';
		private $password='';
		private $database='wecompra';
		private $conn;
		//constructor
		function __construct(){
			try{
				//$this->conn=new PDO("mysql:host=$this->hostname;dbname=$this->database",$this->username,$this->password);*/
			$this->conn=new PDO("mysql:host=$this->hostname;dbname=$this->database",$this->username,$this->password);
			}catch(PDOException $e){ echo $e->getMessage();}
		}
		///
		function addRecord($table,$fields,$data){			
			$ok;
			$flds=implode(", ",$fields);
			$q=array();
			foreach($data as $d) $q[]="?";
			$plc=implode(",",$q);
			
			$sql="INSERT INTO $table($flds) VALUES ($plc)";
			if(count($fields)==count($data)){
				try{
					$stmt=$this->conn->prepare($sql);
					$ok=$stmt->execute($data);
				}catch(PDOException $e){ 
					echo $e->getMessage();
				}			
			} else echo "Fields and Data does not match";
			return $ok;
		}

		function createsql($sql){
            $ok;
		
			    try{
					$stmt=$this->conn->prepare($sql);
					$ok=$stmt->execute();
				}catch(PDOException $e){ 
					echo $e->getMessage();
				}			
			return $ok;
		}
		//get all records
		function getAllRecord($table){
			$rows;
			$sql="SELECT * FROM $table";
			try{
				$stmt=$this->conn->prepare($sql);
				$stmt->execute();
				$rows=$stmt->fetchAll(PDO::FETCH_ASSOC);
			}
			catch(PDOException $e){  $e->getMessage();} 
			return $rows;
		}

		//get all records
		function getSpecificRecord($table,$field_id){
			$rows;
			$sql="SELECT $field_id FROM $table";
			try{
				$stmt=$this->conn->prepare($sql);
				$stmt->execute();
				$rows=$stmt->fetchAll(PDO::FETCH_ASSOC);
			}
			catch(PDOException $e){  $e->getMessage();} 
			return $rows;
		}


		function getQueryBySqlCode($sql){
			$rows;
			try{
				$stmt=$this->conn->prepare($sql);
				$stmt->execute();
				$rows=$stmt->fetchAll(PDO::FETCH_ASSOC);
			}
			catch(PDOException $e){  $e->getMessage();} 
			return $rows;
		}



		//get a recrod
		function getRecord($table,$field_id,$ref_id){
			$rows;
			$sql="SELECT * FROM $table WHERE $field_id = '$ref_id'";
			try{
				$stmt=$this->conn->prepare($sql);
				$stmt->execute();
				$rows=$stmt->fetchAll(PDO::FETCH_ASSOC);
			}
			catch(PDOException $e){  $e->getMessage();} 
			return $rows;
		}
        //get a recrod
		function checkRecord($table,$data){
			$rows;
			$sql="SELECT * FROM $table WHERE $data";
			try{
				$stmt=$this->conn->prepare($sql);
				$stmt->execute();
				$rows=$stmt->fetchAll(PDO::FETCH_ASSOC);
			}
			catch(PDOException $e){  $e->getMessage();} 
			return $rows;
		}

		function updateRecord($table,$data,$field_id,$ref_id){
			$ok;
			$sql="UPDATE $table SET $data WHERE $field_id = '$ref_id'";
			try{
				$stmt=$this->conn->prepare($sql);
				$ok=$stmt->execute();			
			}
			catch(PDOException $e){  $e->getMessage();} 
			return $ok;
		}

		//delete record
		function deleteRecord($table,$field_id,$ref_id){
			$ok;
			$sql="DELETE FROM $table WHERE $field_id= '$ref_id'";
			try{
				$stmt=$this->conn->prepare($sql);
				$ok=$stmt->execute();			
			}
			catch(PDOException $e){  $e->getMessage();} 
			return $ok;
		}
		
		
	
	}//end of class
?>