<?php

require_once 'config.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization"); 
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $data = json_decode(file_get_contents('php://input'), true);
  $username = $data['username'];
  $password = $data['password'];

  // Verifica se o usuário já existe
  $stmt = $db->prepare('SELECT COUNT(*) FROM users WHERE username = ?');
  $stmt->execute([$username]);
  $count = $stmt->fetchColumn();

  if ($count > 0) {
    echo json_encode(['error' => 'The username is already in use']);
    exit;
  }

  // Insere o novo usuário no banco de dados
  $stmt = $db->prepare('INSERT INTO users (username, password) VALUES (?, ?)');
  $stmt->execute([$username, $password]);

  echo json_encode(['success' => true]);
  exit;
}
