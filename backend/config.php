<?php

$dbHost = 'localhost';
$dbName = 'dbmarketplace';
$dbUser = 'postgres';
$dbPass = 'junior123456';

try {
  $db = new PDO("pgsql:host=$dbHost;dbname=$dbName", $dbUser, $dbPass);
  $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
  die('Error connecting to database: ' . $e->getMessage());
}
