<?php

require_once 'config.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization"); 
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
  $query = $db->query('SELECT * FROM products');
  $products = $query->fetchAll(PDO::FETCH_ASSOC);
  echo json_encode($products);
  exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $data = json_decode(file_get_contents('php://input'), true);
  $name = $data['name'];
  $typeId = $data['typeId'];
  $price = $data['price'];
  $amount = $data['amount'];

  $stmt = $db->prepare('INSERT INTO products (name, type_id, price, amount) VALUES (?, ?, ?, ?)');
  $stmt->execute([$name, $typeId, $price, $amount]);

  echo json_encode(['success' => true]);
  exit;
}
