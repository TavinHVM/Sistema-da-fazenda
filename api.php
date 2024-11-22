
<?php
$jsonFile = 'dados.json';

$method = $_SERVER['REQUEST_METHOD'];

if (!file_exists($jsonFile)) {
    file_put_contents($jsonFile, '[]');
}
$data = json_decode(file_get_contents($jsonFile), true);

function saveData($data, $file) {
    file_put_contents($file, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
}

switch ($method) {
    case 'GET':
        header('Content-Type: application/json');
        echo json_encode($data);
        break;

    case 'POST':
        $input = json_decode(file_get_contents('php://input'), true);
        $input['id'] = uniqid();
        $data[] = $input;
        saveData($data, $jsonFile);
        echo json_encode(["status" => "Dados gravados com sucesso"]);
        break;

    case 'PUT':
        $input = json_decode(file_get_contents('php://input'), true);
        foreach ($data as &$item) {
            if ($item['id'] == $input['id']) {
                $item = array_merge($item, $input);
                saveData($data, $jsonFile);
                echo json_encode(["status" => "Dados atualizados com sucesso"]);
                exit;
            }
        }
        echo json_encode(["status" => "Registro não encontrado"]);
        break;

    case 'DELETE':
        $input = json_decode(file_get_contents('php://input'), true);
        $data = array_filter($data, function($item) use ($input) {
            return $item['id'] !== $input['id'];
        });
        saveData($data, $jsonFile);
        echo json_encode(["status" => "Dados excluídos com sucesso"]);
        break;

    default:
        http_response_code(405);
        echo json_encode(["status" => "Método não permitido"]);
}
?>
