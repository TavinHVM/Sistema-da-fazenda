document.addEventListener("DOMContentLoaded", function () {
    const urlBase = 'dados-api.php';
    const clienteElements = {
        codigo: document.getElementById('codigo-cliente'),
        tipo: document.getElementById('tipo-pessoa'),
        nome: document.getElementById('nome-cliente'),
        sexo: document.getElementById('sexo-cliente'),
        email: document.getElementById('email-cliente'),
        telefone1: document.getElementById('telefone1-cliente'),
        telefone2: document.getElementById('telefone2-cliente'),
        data: document.getElementById('data-cadastro'),
        observacoes: document.getElementById('observacoes'),
        tabela: document.getElementById('tabela-clientes'),
    };

    function limparCampos() {
        clienteElements.codigo.value = '';
        clienteElements.tipo.value = 'CPF';
        clienteElements.nome.value = '';
        clienteElements.sexo.value = 'Masculino';
        clienteElements.email.value = '';
        clienteElements.telefone1.value = '';
        clienteElements.telefone2.value = '';
        clienteElements.data.value = '';
        clienteElements.observacoes.value = '';
    }

    function carregarTabela() {
        fetch(`${urlBase}?endpoint=clientes`)
            .then(response => response.json())
            .then(data => {
                clienteElements.tabela.querySelector('tbody').innerHTML = '';
                data.forEach(cliente => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td>${cliente.codigo}</td>
                        <td>${cliente.tipo}</td>
                        <td>${cliente.nome}</td>
                        <td>${cliente.sexo}</td>
                        <td>${cliente.email}</td>
                        <td>${cliente.telefone1}</td>
                        <td>${cliente.telefone2}</td>
                        <td>${cliente.data}</td>
                        <td>${cliente.observacoes}</td>
                        <td>
                            <button class="btn-editar" data-id="${cliente.codigo}">Editar</button>
                            <button class="btn-excluir" data-id="${cliente.codigo}">Excluir</button>
                        </td>
                    `;
                    clienteElements.tabela.querySelector('tbody').appendChild(tr);
                });

                document.querySelectorAll('.btn-editar').forEach(btn => {
                    btn.addEventListener('click', editarCliente);
                });

                document.querySelectorAll('.btn-excluir').forEach(btn => {
                    btn.addEventListener('click', excluirCliente);
                });
            })
            .catch(error => console.error('Erro ao carregar clientes:', error));
    }

    function editarCliente(event) {
        const clienteId = event.target.dataset.id;
        fetch(`${urlBase}?endpoint=clientes`)
            .then(response => response.json())
            .then(clientes => {
                const cliente = clientes.find(c => c.codigo == clienteId);
                clienteElements.codigo.value = cliente.codigo;
                clienteElements.tipo.value = cliente.tipo;
                clienteElements.nome.value = cliente.nome;
                clienteElements.sexo.value = cliente.sexo;
                clienteElements.email.value = cliente.email;
                clienteElements.telefone1.value = cliente.telefone1;
                clienteElements.telefone2.value = cliente.telefone2;
                clienteElements.data.value = cliente.data;
                clienteElements.observacoes.value = cliente.observacoes;
            })
            .catch(error => console.error('Erro ao buscar cliente:', error));
    }

    function excluirCliente(event) {
        const clienteId = event.target.dataset.id;
        fetch(`${urlBase}?endpoint=clientes`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ codigo: clienteId }),
        })
        .then(response => response.json())
        .then(result => {
            alert(result.message || 'Cliente excluído com sucesso!');
            carregarTabela();
        })
        .catch(error => console.error('Erro ao excluir cliente:', error));
    }

    document.getElementById('btn-gravar-cliente').addEventListener('click', () => {
        const cliente = {
            codigo: clienteElements.codigo.value || null,
            tipo: clienteElements.tipo.value,
            nome: clienteElements.nome.value,
            sexo: clienteElements.sexo.value,
            email: clienteElements.email.value,
            telefone1: clienteElements.telefone1.value,
            telefone2: clienteElements.telefone2.value,
            data: clienteElements.data.value,
            observacoes: clienteElements.observacoes.value,
        };

        fetch(`${urlBase}?endpoint=clientes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(cliente),
        })
        .then(response => response.json())
        .then(result => {
            alert(result.message || 'Cliente salvo com sucesso!');
            limparCampos();
            carregarTabela();
        })
        .catch(error => console.error('Erro ao salvar cliente:', error));
    });

    document.getElementById('btn-limpar-cliente').addEventListener('click', limparCampos);

    carregarTabela();
});
