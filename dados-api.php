<?php
$jsonFile = 'dados.json';

// Define o método da requisição
$method = $_SERVER['REQUEST_METHOD'];

// Cria o arquivo JSON vazio se não existir
if (!file_exists($jsonFile)) {
    file_put_contents($jsonFile, '[]');
}

// Lê os dados do arquivo JSON
$data = json_decode(file_get_contents($jsonFile), true);

// Função para salvar os dados no arquivo
function saveData($data, $file) {
    file_put_contents($file, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
}

// Função para validar os dados obrigatórios
function validateData($input) {
    $requiredFields = ['cpf_cnpj', 'nome', 'grupo', 'dt_nasc', 'sexo', 'estado_civil', 'email', 'tipo_doc', 'numero', 'orgao_exped', 'uf', 'dt_emissao'];
    foreach ($requiredFields as $field) {
        if (empty($input[$field])) {
            return "O campo {$field} é obrigatório.";
        }
    }
    return true;
}

switch ($method) {
    case 'GET':
        // Verifica se o código foi passado na URL para retornar apenas aquele cliente
        if (isset($_GET['codigo'])) {
            $codigo = $_GET['codigo'];
            // Busca o cliente específico pelo código
            $cliente = array_filter($data, function($item) use ($codigo) {
                return $item['codigo'] == $codigo;
            });
            $cliente = array_values($cliente);  // Reindexa o array
            if (count($cliente) > 0) {
                echo json_encode($cliente[0]);  // Retorna o cliente encontrado
            } else {
                echo json_encode(["status" => "Erro", "message" => "Cliente não encontrado"]);
            }
        } else {
            // Retorna todos os dados em formato JSON
            header('Content-Type: application/json');
            echo json_encode($data);
        }
        break;

    case 'POST':
        // Lê os dados enviados pelo formulário
        $input = json_decode(file_get_contents('php://input'), true);

        // Verifica se é uma atualização (código existente)
        if (!empty($input['codigo'])) {
            foreach ($data as &$item) {
                if ($item['codigo'] == $input['codigo']) {
                    $item = array_merge($item, $input);
                    saveData($data, $jsonFile);
                    header('Content-Type: application/json');
                    echo json_encode(["status" => "Dados atualizados com sucesso"]);
                    exit;
                }
            }
        }

        // Caso contrário, trata como criação de novo registro
        $nextCode = count($data) > 0 ? max(array_column($data, 'codigo')) + 1 : 1;
        $input['codigo'] = $nextCode;

        // Valida os dados obrigatórios
        $validationResult = validateData($input);
        if ($validationResult !== true) {
            header('Content-Type: application/json', true, 400);
            echo json_encode(["status" => "Erro", "message" => $validationResult]);
            exit;
        }

        // Adiciona o novo cliente ao array de dados
        $data[] = $input;

        // Salva os dados no arquivo
        saveData($data, $jsonFile);
        header('Content-Type: application/json');
        echo json_encode(["status" => "Dados gravados com sucesso"]);
        break;

    case 'DELETE':
        // Lê os dados enviados para exclusão
        $input = json_decode(file_get_contents('php://input'), true);

        // Verifica se o código foi enviado
        if (empty($input['codigo'])) {
            header('Content-Type: application/json', true, 400);
            echo json_encode(["status" => "Erro", "message" => "Código não enviado"]);
            exit;
        }

        // Filtra os dados removendo o cliente pelo código
        $data = array_filter($data, function($item) use ($input) {
            return $item['codigo'] != $input['codigo'];
        });

        // Reindexa o array para garantir uma numeração contínua
        $data = array_values($data);

        // Salva os dados atualizados no arquivo
        saveData($data, $jsonFile);
        header('Content-Type: application/json');
        echo json_encode(["status" => "Dados excluídos com sucesso"]);
        break;

    default:
        // Método não permitido
        http_response_code(405);
        header('Content-Type: application/json');
        echo json_encode(["status" => "Método não permitido"]);
}
?>
