<?php
		 $hostname='localhost';
		 $username='root';
		 $password='';
		 $database='wecompra';
		 $conn;

		 try{
				//$this->conn=new PDO("mysql:host=$this->hostname;dbname=$this->database",$this->username,$this->password);*/
			$conn=new PDO("mysql:host=$hostname;dbname=$database",$username,$password);
			echo "connect";
			}catch(PDOException $e){ echo $e->getMessage();}

?>