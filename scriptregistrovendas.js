document.addEventListener("DOMContentLoaded", function () {
    const urlBase = 'dados-api.php';
    const vendaElements = {
        codigo: document.getElementById('codigo-venda'),
        cliente: document.getElementById('cliente-venda'),
        funcionario: document.getElementById('funcionario-venda'),
        produto: document.getElementById('produto-venda'),
        quantidade: document.getElementById('quantidade-venda'),
        precoUnitario: document.getElementById('preco-unitario'),
        data: document.getElementById('data-venda'),
        observacoes: document.getElementById('observacoes'),
        tabela: document.getElementById('tabela-vendas'),
    };

    const listas = {
        clientes: document.getElementById('lista-clientes'),
        funcionarios: document.getElementById('lista-funcionarios'),
        produtos: document.getElementById('lista-produtos'),
    };

    function limparCampos() {
        vendaElements.codigo.value = '';
        vendaElements.cliente.textContent = 'Selecionar Cliente';
        vendaElements.funcionario.textContent = 'Selecionar Funcionário';
        vendaElements.produto.textContent = 'Selecionar Produto';
        vendaElements.quantidade.value = '';
        vendaElements.precoUnitario.value = '';
        vendaElements.data.value = '';
        vendaElements.observacoes.value = '';
    }

    function carregarOpcoes(endpoint, lista) {
        fetch(`${urlBase}?endpoint=${endpoint}`)
            .then(response => response.json())
            .then(data => {
                lista.innerHTML = '';
                data.forEach(item => {
                    const li = document.createElement('li');
                    li.textContent = item.nome || item.produto;
                    li.dataset.id = item.codigo;
                    li.addEventListener('click', () => selecionarOpcao(lista.id, item));
                    lista.appendChild(li);
                });
            })
            .catch(error => console.error(`Erro ao carregar ${endpoint}:`, error));
    }

    function selecionarOpcao(listaId, item) {
        switch (listaId) {
            case 'lista-clientes':
                vendaElements.cliente.textContent = item.nome;
                vendaElements.cliente.dataset.id = item.codigo;
                break;
            case 'lista-funcionarios':
                vendaElements.funcionario.textContent = item.nome;
                vendaElements.funcionario.dataset.id = item.codigo;
                break;
            case 'lista-produtos':
                vendaElements.produto.textContent = item.produto;
                vendaElements.produto.dataset.id = item.codigo;
                vendaElements.precoUnitario.value = item.preco;
                break;
        }
    }

    function carregarTabela() {
        fetch(`${urlBase}?endpoint=vendas`)
            .then(response => response.json())
            .then(data => {
                vendaElements.tabela.querySelector('tbody').innerHTML = '';
                data.forEach(venda => {
                    const tr = document.createElement('tr');
                    const total = (venda.quantidade * venda.precoUnitario).toFixed(2);
                    tr.innerHTML = `
                        <td>${venda.codigo}</td>
                        <td>${venda.cliente}</td>
                        <td>${venda.funcionario}</td>
                        <td>${venda.produto}</td>
                        <td>${venda.quantidade}</td>
                        <td>R$ ${venda.precoUnitario}</td>
                        <td>R$ ${total}</td>
                        <td>${venda.data}</td>
                        <td>${venda.observacoes}</td>
                        <td>
                            <button class="btn-editar" data-id="${venda.codigo}">Editar</button>
                            <button class="btn-refazer" data-id="${venda.codigo}">Refazer</button>
                            <button class="btn-excluir" data-id="${venda.codigo}">Excluir</button>
                        </td>
                    `;
                    vendaElements.tabela.querySelector('tbody').appendChild(tr);
                });

                document.querySelectorAll('.btn-editar').forEach(btn => {
                    btn.addEventListener('click', editarVenda);
                });

                document.querySelectorAll('.btn-refazer').forEach(btn => {
                    btn.addEventListener('click', refazerVenda);
                });

                document.querySelectorAll('.btn-excluir').forEach(btn => {
                    btn.addEventListener('click', excluirVenda);
                });
            })
            .catch(error => console.error('Erro ao carregar vendas:', error));
    }

    function editarVenda(event) {
        const vendaId = event.target.dataset.id;
        fetch(`${urlBase}?endpoint=vendas`)
            .then(response => response.json())
            .then(vendas => {
                const venda = vendas.find(v => v.codigo == vendaId);
                vendaElements.codigo.value = venda.codigo;
                vendaElements.cliente.textContent = venda.cliente;
                vendaElements.funcionario.textContent = venda.funcionario;
                vendaElements.produto.textContent = venda.produto;
                vendaElements.quantidade.value = venda.quantidade;
                vendaElements.precoUnitario.value = venda.precoUnitario;
                vendaElements.data.value = venda.data;
                vendaElements.observacoes.value = venda.observacoes;
            })
            .catch(error => console.error('Erro ao buscar venda:', error));
    }

    function refazerVenda(event) {
        const vendaId = event.target.dataset.id;
        fetch(`${urlBase}?endpoint=vendas`)
            .then(response => response.json())
            .then(vendas => {
                const venda = vendas.find(v => v.codigo == vendaId);
                const novaVenda = {
                    codigo: null, // Novo código será atribuído automaticamente pela API
                    cliente: venda.cliente,
                    funcionario: venda.funcionario,
                    produto: venda.produto,
                    quantidade: venda.quantidade,
                    precoUnitario: venda.precoUnitario,
                    data: venda.data,
                    observacoes: venda.observacoes,
                };

                fetch(`${urlBase}?endpoint=vendas`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(novaVenda),
                })
                .then(response => response.json())
                .then(result => {
                    alert(result.message || 'Venda refeita com sucesso!');
                    carregarTabela();
                })
                .catch(error => console.error('Erro ao refazer venda:', error));
            })
            .catch(error => console.error('Erro ao buscar venda:', error));
    }

    function excluirVenda(event) {
        const vendaId = event.target.dataset.id;
        fetch(`${urlBase}?endpoint=vendas`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ codigo: vendaId }),
        })
        .then(response => response.json())
        .then(result => {
            alert(result.message || 'Venda excluída com sucesso!');
            carregarTabela();
        })
        .catch(error => console.error('Erro ao excluir venda:', error));
    }

    document.getElementById('btn-gravar-venda').addEventListener('click', () => {
        const venda = {
            codigo: vendaElements.codigo.value || null,
            cliente: vendaElements.cliente.dataset.id || '',
            funcionario: vendaElements.funcionario.dataset.id || '',
            produto: vendaElements.produto.dataset.id || '',
            quantidade: parseFloat(vendaElements.quantidade.value),
            precoUnitario: parseFloat(vendaElements.precoUnitario.value),
            data: vendaElements.data.value,
            observacoes: vendaElements.observacoes.value,
        };

        fetch(`${urlBase}?endpoint=vendas`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(venda),
        })
        .then(response => response.json())
        .then(result => {
            alert(result.message || 'Venda salva com sucesso!');
            limparCampos();
            carregarTabela();
        })
        .catch(error => console.error('Erro ao salvar venda:', error));
    });

    document.getElementById('btn-limpar-venda').addEventListener('click', limparCampos);

    carregarTabela();
    carregarOpcoes('clientes', listas.clientes);
    carregarOpcoes('funcionarios', listas.funcionarios);
    carregarOpcoes('produtos', listas.produtos);
});
