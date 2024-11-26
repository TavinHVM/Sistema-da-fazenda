document.addEventListener("DOMContentLoaded", function () {
    const urlBase = 'dados-api.php';
    const produtoElements = {
        codigo: document.getElementById('codigo-produto'),
        nome: document.getElementById('nome-produto'),
        unidade: document.getElementById('unidade-produto'),
        estoque: document.getElementById('estoque'),
        preco: document.getElementById('preco'),
        temperaturaIdeal: document.getElementById('temperatura-ideal'),
        observacoes: document.getElementById('observacoes'),
        tabela: document.getElementById('tabela-produtos'),
    };

    function limparCampos() {
        produtoElements.codigo.value = '';
        produtoElements.nome.value = '';
        produtoElements.unidade.value = '';
        produtoElements.estoque.value = '';
        produtoElements.preco.value = '';
        produtoElements.temperaturaIdeal.value = '';
        produtoElements.observacoes.value = '';
    }

    function carregarTabela() {
        fetch(`${urlBase}?endpoint=produtos`)
            .then(response => response.json())
            .then(data => {
                produtoElements.tabela.querySelector('tbody').innerHTML = '';
                data.forEach(produto => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td>${produto.codigo}</td>
                        <td>${produto.nome}</td>
                        <td>${produto.unidade}</td>
                        <td>${produto.estoque}</td>
                        <td>${produto.preco}</td>
                        <td>${produto.temperaturaIdeal}</td>
                        <td>${produto.observacoes}</td>
                        <td>
                            <button class="btn-editar" data-id="${produto.codigo}">Editar</button>
                            <button class="btn-excluir" data-id="${produto.codigo}">Excluir</button>
                        </td>
                    `;
                    produtoElements.tabela.querySelector('tbody').appendChild(tr);
                });

                document.querySelectorAll('.btn-editar').forEach(btn => {
                    btn.addEventListener('click', editarProduto);
                });

                document.querySelectorAll('.btn-excluir').forEach(btn => {
                    btn.addEventListener('click', excluirProduto);
                });
            })
            .catch(error => console.error('Erro ao carregar produtos:', error));
    }

    function editarProduto(event) {
        const produtoId = event.target.dataset.id;
        fetch(`${urlBase}?endpoint=produtos`)
            .then(response => response.json())
            .then(produtos => {
                const produto = produtos.find(p => p.codigo == produtoId);
                produtoElements.codigo.value = produto.codigo;
                produtoElements.nome.value = produto.nome;
                produtoElements.unidade.value = produto.unidade;
                produtoElements.estoque.value = produto.estoque;
                produtoElements.preco.value = produto.preco;
                produtoElements.temperaturaIdeal.value = produto.temperaturaIdeal;
                produtoElements.observacoes.value = produto.observacoes;
            })
            .catch(error => console.error('Erro ao buscar produto:', error));
    }

    function excluirProduto(event) {
        const produtoId = event.target.dataset.id;
        fetch(`${urlBase}?endpoint=produtos`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ codigo: produtoId }),
        })
        .then(response => response.json())
        .then(result => {
            alert(result.message || 'Produto excluído com sucesso!');
            carregarTabela();
        })
        .catch(error => console.error('Erro ao excluir produto:', error));
    }

    document.getElementById('btn-gravar-produto').addEventListener('click', () => {
        const produto = {
            codigo: produtoElements.codigo.value || null,
            nome: produtoElements.nome.value,
            unidade: produtoElements.unidade.value,
            estoque: produtoElements.estoque.value,
            preco: produtoElements.preco.value,
            temperaturaIdeal: produtoElements.temperaturaIdeal.value,
            observacoes: produtoElements.observacoes.value,
        };

        fetch(`${urlBase}?endpoint=produtos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(produto),
        })
        .then(response => response.json())
        .then(result => {
            alert(result.message || 'Produto salvo com sucesso!');
            limparCampos();
            carregarTabela();
        })
        .catch(error => console.error('Erro ao salvar produto:', error));
    });

    document.getElementById('btn-limpar-produto').addEventListener('click', limparCampos);

    carregarTabela();
});
