document.addEventListener("DOMContentLoaded", function () {
    const urlBase = 'dados-api.php';
    const fornecedorElements = {
        codigo: document.getElementById('codigo-fornecedor'),
        nome: document.getElementById('nome-fornecedor'),
        cpfCnpj: document.getElementById('cpf-cnpj-fornecedor'),
        telefone: document.getElementById('telefone-fornecedor'),
        email: document.getElementById('email-fornecedor'),
        endereco: document.getElementById('endereco-fornecedor'),
        itemFornecido: document.getElementById('item-fornecido'),
        observacoes: document.getElementById('observacoes'),
        tabela: document.getElementById('tabela-fornecedores'),
    };

    function limparCampos() {
        fornecedorElements.codigo.value = '';
        fornecedorElements.nome.value = '';
        fornecedorElements.cpfCnpj.value = '';
        fornecedorElements.telefone.value = '';
        fornecedorElements.email.value = '';
        fornecedorElements.endereco.value = '';
        fornecedorElements.itemFornecido.value = '';
        fornecedorElements.observacoes.value = '';
    }

    function carregarTabela() {
        fetch(`${urlBase}?endpoint=fornecedores`)
            .then(response => response.json())
            .then(data => {
                fornecedorElements.tabela.querySelector('tbody').innerHTML = '';
                data.forEach(fornecedor => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td>${fornecedor.codigo}</td>
                        <td>${fornecedor.nome}</td>
                        <td>${fornecedor.cpfCnpj}</td>
                        <td>${fornecedor.telefone}</td>
                        <td>${fornecedor.email}</td>
                        <td>${fornecedor.endereco}</td>
                        <td>${fornecedor.itemFornecido}</td>
                        <td>${fornecedor.observacoes}</td>
                        <td>
                            <button class="btn-editar" data-id="${fornecedor.codigo}">Editar</button>
                            <button class="btn-excluir" data-id="${fornecedor.codigo}">Excluir</button>
                        </td>
                    `;
                    fornecedorElements.tabela.querySelector('tbody').appendChild(tr);
                });

                document.querySelectorAll('.btn-editar').forEach(btn => {
                    btn.addEventListener('click', editarFornecedor);
                });

                document.querySelectorAll('.btn-excluir').forEach(btn => {
                    btn.addEventListener('click', excluirFornecedor);
                });
            })
            .catch(error => console.error('Erro ao carregar fornecedores:', error));
    }

    function editarFornecedor(event) {
        const fornecedorId = event.target.dataset.id;
        fetch(`${urlBase}?endpoint=fornecedores`)
            .then(response => response.json())
            .then(fornecedores => {
                const fornecedor = fornecedores.find(f => f.codigo == fornecedorId);
                fornecedorElements.codigo.value = fornecedor.codigo;
                fornecedorElements.nome.value = fornecedor.nome;
                fornecedorElements.cpfCnpj.value = fornecedor.cpfCnpj;
                fornecedorElements.telefone.value = fornecedor.telefone;
                fornecedorElements.email.value = fornecedor.email;
                fornecedorElements.endereco.value = fornecedor.endereco;
                fornecedorElements.itemFornecido.value = fornecedor.itemFornecido;
                fornecedorElements.observacoes.value = fornecedor.observacoes;
            })
            .catch(error => console.error('Erro ao buscar fornecedor:', error));
    }

    function excluirFornecedor(event) {
        const fornecedorId = event.target.dataset.id;
        fetch(`${urlBase}?endpoint=fornecedores`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ codigo: fornecedorId }),
        })
        .then(response => response.json())
        .then(result => {
            alert(result.message || 'Fornecedor excluído com sucesso!');
            carregarTabela();
        })
        .catch(error => console.error('Erro ao excluir fornecedor:', error));
    }

    document.getElementById('btn-gravar-fornecedor').addEventListener('click', () => {
        const fornecedor = {
            codigo: fornecedorElements.codigo.value || null,
            nome: fornecedorElements.nome.value,
            cpfCnpj: fornecedorElements.cpfCnpj.value,
            telefone: fornecedorElements.telefone.value,
            email: fornecedorElements.email.value,
            endereco: fornecedorElements.endereco.value,
            itemFornecido: fornecedorElements.itemFornecido.value,
            observacoes: fornecedorElements.observacoes.value,
        };

        fetch(`${urlBase}?endpoint=fornecedores`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(fornecedor),
        })
        .then(response => response.json())
        .then(result => {
            alert(result.message || 'Fornecedor salvo com sucesso!');
            limparCampos();
            carregarTabela();
        })
        .catch(error => console.error('Erro ao salvar fornecedor:', error));
    });

    document.getElementById('btn-limpar-fornecedor').addEventListener('click', limparCampos);

    carregarTabela();
});
