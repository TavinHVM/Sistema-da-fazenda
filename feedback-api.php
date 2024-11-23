<?php
$file = 'feedbacks.json';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $feedbacks = file_exists($file) ? json_decode(file_get_contents($file), true) : [];
    echo json_encode($feedbacks);

} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $feedbacks = file_exists($file) ? json_decode(file_get_contents($file), true) : [];
    $data = json_decode(file_get_contents('php://input'), true);
    $feedbacks[] = $data;
    file_put_contents($file, json_encode($feedbacks));
    echo json_encode(['status' => 'success']);

} elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $feedbacks = file_exists($file) ? json_decode(file_get_contents($file), true) : [];
    $data = json_decode(file_get_contents('php://input'), true);
    array_splice($feedbacks, $data['index'], 1);
    file_put_contents($file, json_encode($feedbacks));
    echo json_encode(['status' => 'success']);
}
?>
