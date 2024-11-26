document.addEventListener("DOMContentLoaded", function () {
    const urlBase = 'dados-api.php';
    const funcionarioElements = {
        codigo: document.getElementById('codigo-funcionario'),
        tipo: document.getElementById('tipo-pessoa'),
        nome: document.getElementById('nome-funcionario'),
        sexo: document.getElementById('sexo-funcionario'),
        email: document.getElementById('email-funcionario'),
        telefone1: document.getElementById('telefone1-funcionario'),
        telefone2: document.getElementById('telefone2-funcionario'),
        data: document.getElementById('data-cadastro'),
        observacoes: document.getElementById('observacoes'),
        tabela: document.getElementById('tabela-funcionarios'),
    };

    function limparCampos() {
        funcionarioElements.codigo.value = '';
        funcionarioElements.tipo.value = 'CPF';
        funcionarioElements.nome.value = '';
        funcionarioElements.sexo.value = 'Masculino';
        funcionarioElements.email.value = '';
        funcionarioElements.telefone1.value = '';
        funcionarioElements.telefone2.value = '';
        funcionarioElements.data.value = '';
        funcionarioElements.observacoes.value = '';
    }

    function carregarTabela() {
        fetch(`${urlBase}?endpoint=funcionarios`)
            .then(response => response.json())
            .then(data => {
                funcionarioElements.tabela.querySelector('tbody').innerHTML = '';
                data.forEach(funcionario => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td>${funcionario.codigo}</td>
                        <td>${funcionario.tipo}</td>
                        <td>${funcionario.nome}</td>
                        <td>${funcionario.sexo}</td>
                        <td>${funcionario.email}</td>
                        <td>${funcionario.telefone1}</td>
                        <td>${funcionario.telefone2}</td>
                        <td>${funcionario.data}</td>
                        <td>${funcionario.observacoes}</td>
                        <td>
                            <button class="btn-editar" data-id="${funcionario.codigo}">Editar</button>
                            <button class="btn-excluir" data-id="${funcionario.codigo}">Excluir</button>
                        </td>
                    `;
                    funcionarioElements.tabela.querySelector('tbody').appendChild(tr);
                });

                document.querySelectorAll('.btn-editar').forEach(btn => {
                    btn.addEventListener('click', editarFuncionario);
                });

                document.querySelectorAll('.btn-excluir').forEach(btn => {
                    btn.addEventListener('click', excluirFuncionario);
                });
            })
            .catch(error => console.error('Erro ao carregar funcionários:', error));
    }

    function editarFuncionario(event) {
        const funcionarioId = event.target.dataset.id;
        fetch(`${urlBase}?endpoint=funcionarios`)
            .then(response => response.json())
            .then(funcionarios => {
                const funcionario = funcionarios.find(f => f.codigo == funcionarioId);
                funcionarioElements.codigo.value = funcionario.codigo;
                funcionarioElements.tipo.value = funcionario.tipo;
                funcionarioElements.nome.value = funcionario.nome;
                funcionarioElements.sexo.value = funcionario.sexo;
                funcionarioElements.email.value = funcionario.email;
                funcionarioElements.telefone1.value = funcionario.telefone1;
                funcionarioElements.telefone2.value = funcionario.telefone2;
                funcionarioElements.data.value = funcionario.data;
                funcionarioElements.observacoes.value = funcionario.observacoes;
            })
            .catch(error => console.error('Erro ao buscar funcionário:', error));
    }

    function excluirFuncionario(event) {
        const funcionarioId = event.target.dataset.id;
        fetch(`${urlBase}?endpoint=funcionarios`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ codigo: funcionarioId }),
        })
        .then(response => response.json())
        .then(result => {
            alert(result.message || 'Funcionário excluído com sucesso!');
            carregarTabela();
        })
        .catch(error => console.error('Erro ao excluir funcionário:', error));
    }

    document.getElementById('btn-gravar-funcionario').addEventListener('click', () => {
        const funcionario = {
            codigo: funcionarioElements.codigo.value || null,
            tipo: funcionarioElements.tipo.value,
            nome: funcionarioElements.nome.value,
            sexo: funcionarioElements.sexo.value,
            email: funcionarioElements.email.value,
            telefone1: funcionarioElements.telefone1.value,
            telefone2: funcionarioElements.telefone2.value,
            data: funcionarioElements.data.value,
            observacoes: funcionarioElements.observacoes.value,
        };

        fetch(`${urlBase}?endpoint=funcionarios`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(funcionario),
        })
        .then(response => response.json())
        .then(result => {
            alert(result.message || 'Funcionário salvo com sucesso!');
            limparCampos();
            carregarTabela();
        })
        .catch(error => console.error('Erro ao salvar funcionário:', error));
    });

    document.getElementById('btn-limpar-funcionario').addEventListener('click', limparCampos);

    carregarTabela();
});
