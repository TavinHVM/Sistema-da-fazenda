<?php
header('Content-Type: application/json');

$clientesJson = 'clientes.json';
$produtosJson = 'produtos.json';
$funcionariosJson = 'funcionarios.json';
$vendasJson = 'vendas.json';
$fornecedoresJson = 'fornecedores.json';

function lerJson($caminho) {
    if (!file_exists($caminho)) {
        return [];
    }
    return json_decode(file_get_contents($caminho), true) ?: [];
}

function salvarJson($caminho, $dados) {
    file_put_contents($caminho, json_encode($dados, JSON_PRETTY_PRINT));
}

// Identificação do endpoint
$endpoint = $_GET['endpoint'] ?? null;

// Determinação do caminho do arquivo JSON baseado no endpoint
switch ($endpoint) {
    case 'clientes':
        $jsonPath = $clientesJson;
        break;
    case 'produtos':
        $jsonPath = $produtosJson;
        break;
    case 'funcionarios':
        $jsonPath = $funcionariosJson;
        break;
    case 'vendas':
        $jsonPath = $vendasJson;
        break;
    case 'fornecedores':
        $jsonPath = $fornecedoresJson;
        break;
    default:
        http_response_code(404);
        echo json_encode(['message' => 'Endpoint não encontrado.']);
        exit;
}

$dados = lerJson($jsonPath);

switch ($_SERVER['REQUEST_METHOD']) {
    case 'POST':
        // Receber os dados enviados
        $input = json_decode(file_get_contents('php://input'), true);
        $atualizado = false;

        // Atualização de um registro existente
        if (isset($input['codigo'])) {
            foreach ($dados as &$item) {
                if ($item['codigo'] == $input['codigo']) {
                    $item = $input;
                    $atualizado = true;
                    break;
                }
            }
        }

        // Criação de um novo registro
        if (!$atualizado) {
            $input['codigo'] = count($dados) + 1;
            $dados[] = $input;
        }

        salvarJson($jsonPath, $dados);
        echo json_encode(['message' => $atualizado ? 'Atualizado com sucesso.' : 'Criado com sucesso.']);
        break;

    case 'GET':
        // Retornar todos os registros
        echo json_encode($dados);
        break;

    case 'DELETE':
        // Receber os dados enviados
        $input = json_decode(file_get_contents('php://input'), true);
        $codigoExcluir = $input['codigo'] ?? null;

        if (!$codigoExcluir) {
            echo json_encode(['message' => 'Código não fornecido.']);
            http_response_code(400);
            exit;
        }

        // Filtrar os registros para excluir o solicitado
        $dados = array_filter($dados, function ($item) use ($codigoExcluir) {
            return $item['codigo'] != $codigoExcluir;
        });

        salvarJson($jsonPath, array_values($dados));
        echo json_encode(['message' => 'Excluído com sucesso.']);
        break;

    default:
        http_response_code(405);
        echo json_encode(['message' => 'Método não permitido.']);
}
?>
