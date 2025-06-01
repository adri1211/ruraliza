<?php

$url = 'http://localhost:8000/api/gemini/chat';
$data = [
    'message' => 'Hola, ¿cómo estás?',
    'history' => []
];

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json'
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

echo "Código de respuesta HTTP: " . $httpCode . "\n";
echo "Respuesta:\n";
print_r(json_decode($response, true));

curl_close($ch); 