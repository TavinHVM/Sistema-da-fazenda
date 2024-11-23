document.addEventListener("DOMContentLoaded", function () {
    const selectCodigo = document.getElementById('codigo');
    const urlAPI = 'dados-api.php';

    // Função para atualizar a lista de códigos
    function atualizarListaDeCodigos() {
        selectCodigo.innerHTML = '<option value="" disabled selected>Selecione um código</option>';
        
        fetch(urlAPI)
            .then(response => {
                if (!response.ok) throw new Error('Erro ao carregar lista de códigos');
                return response.json();
            })
            .then(data => {
                data.forEach(cliente => {
                    const option = document.createElement('option');
                    option.value = cliente.codigo;
                    option.textContent = `Código ${cliente.codigo}`;
                    selectCodigo.appendChild(option);
                });
            })
            .catch(error => alert('Erro ao atualizar lista de códigos: ' + error.message));
    }

    // Atualizar lista de códigos ao carregar a página
    atualizarListaDeCodigos();

    // Atualizar formulário ao selecionar código
    selectCodigo.addEventListener('change', () => {
        const selectedCode = selectCodigo.value;

        if (!selectedCode) return;

        fetch(`${urlAPI}?codigo=${selectedCode}`)
            .then(response => {
                if (!response.ok) throw new Error('Erro ao buscar cliente');
                return response.json();
            })
            .then(cliente => {
                if (cliente) {
                    preencherFormulario(cliente);
                } else {
                    alert('Cliente não encontrado!');
                }
            })
            .catch(error => alert('Erro ao buscar cliente: ' + error.message));
    });

    // Preencher o formulário com os dados do cliente
    function preencherFormulario(cliente) {
        document.querySelector('input[name="cpf_cnpj"]').value = cliente.cpf_cnpj || '';
        document.querySelector('input[name="nome"]').value = cliente.nome || '';
        document.querySelector('select[name="grupo"]').value = cliente.grupo || '';
        document.querySelector('input[name="dt_nasc"]').value = cliente.dt_nasc || '';
        document.querySelector('select[name="sexo"]').value = cliente.sexo || '';
        document.querySelector('select[name="estado_civil"]').value = cliente.estado_civil || '';
        document.querySelector('input[name="email"]').value = cliente.email || '';
        document.querySelector('input[name="tipo_doc"]').value = cliente.tipo_doc || '';
        document.querySelector('input[name="numero"]').value = cliente.numero || '';
        document.querySelector('input[name="orgao_exped"]').value = cliente.orgao_exped || '';
        document.querySelector('input[name="uf"]').value = cliente.uf || '';
        document.querySelector('input[name="dt_emissao"]').value = cliente.dt_emissao || '';
        document.querySelector('textarea[name="observacoes"]').value = cliente.observacoes || '';

        // Preencher os radio buttons (Classificação e Tipo de Pessoa)
        if (cliente.classificacao) {
            document.querySelector(`input[name="classificacao"][value="${cliente.classificacao}"]`).checked = true;
        }
        if (cliente.tipo) {
            document.querySelector(`input[name="tipo"][value="${cliente.tipo}"]`).checked = true;
        }

        // Preencher telefones
        const telefoneTable = document.querySelector('.telefones table');
        telefoneTable.innerHTML = `
            <tr>
                <th>Tipo</th>
                <th>N° Telefone</th>
                <th>Observação</th>
            </tr>
        `;
        cliente.telefones.forEach(telefone => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><input type="text" value="${telefone.tipo || ''}"></td>
                <td><input type="text" value="${telefone.numero || ''}"></td>
                <td><input type="text" value="${telefone.observacao || ''}"></td>
            `;
            telefoneTable.appendChild(tr);
        });

        // Preencher endereços
        const enderecoTable = document.querySelector('.enderecos table');
        enderecoTable.innerHTML = `
            <tr>
                <th>Descrição</th>
                <th>Endereço</th>
                <th>Tx. entrega</th>
                <th>NF</th>
                <th>Observação</th>
            </tr>
        `;
        cliente.enderecos.forEach(endereco => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><input type="text" value="${endereco.descricao || ''}"></td>
                <td><input type="text" value="${endereco.endereco || ''}"></td>
                <td><input type="checkbox" ${endereco.tx_entrega ? 'checked' : ''}></td>
                <td><input type="checkbox" ${endereco.nf ? 'checked' : ''}></td>
                <td><input type="text" value="${endereco.observacao || ''}"></td>
            `;
            enderecoTable.appendChild(tr);
        });
    }

    // Gravar ou atualizar cliente
    document.getElementById('btn-gravar').addEventListener('click', () => {
        const codigo = selectCodigo.value || '';

        const cliente = {
            codigo: codigo || undefined,
            classificacao: document.querySelector('input[name="classificacao"]:checked')?.value || '',
            tipo: document.querySelector('input[name="tipo"]:checked')?.value || '',
            cpf_cnpj: document.querySelector('input[name="cpf_cnpj"]')?.value || '',
            nome: document.querySelector('input[name="nome"]')?.value || '',
            grupo: document.querySelector('select[name="grupo"]')?.value || '',
            dt_nasc: document.querySelector('input[name="dt_nasc"]')?.value || '',
            sexo: document.querySelector('select[name="sexo"]')?.value || '',
            estado_civil: document.querySelector('select[name="estado_civil"]')?.value || '',
            email: document.querySelector('input[name="email"]')?.value || '',
            tipo_doc: document.querySelector('input[name="tipo_doc"]')?.value || '',
            numero: document.querySelector('input[name="numero"]')?.value || '',
            orgao_exped: document.querySelector('input[name="orgao_exped"]')?.value || '',
            uf: document.querySelector('input[name="uf"]')?.value || '',
            dt_emissao: document.querySelector('input[name="dt_emissao"]')?.value || '',
            observacoes: document.querySelector('textarea[name="observacoes"]')?.value || '',
            telefones: Array.from(document.querySelectorAll('.telefones table tr')).slice(1).map(tr => ({
                tipo: tr.children[0].children[0].value,
                numero: tr.children[1].children[0].value,
                observacao: tr.children[2].children[0].value
            })),
            enderecos: Array.from(document.querySelectorAll('.enderecos table tr')).slice(1).map(tr => ({
                descricao: tr.children[0].children[0].value,
                endereco: tr.children[1].children[0].value,
                tx_entrega: tr.children[2].children[0].checked,
                nf: tr.children[3].children[0].checked,
                observacao: tr.children[4].children[0].value
            }))
        };

        fetch(urlAPI, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(cliente)
        })
            .then(response => {
                if (!response.ok) throw new Error('Erro ao salvar cliente');
                return response.json();
            })
            .then(() => {
                alert('Cliente salvo com sucesso!');
                atualizarListaDeCodigos();
            })
            .catch(error => alert('Erro ao salvar cliente: ' + error.message));
    });

    // Limpar campos do formulário
    document.getElementById('btn-limpar').addEventListener('click', () => {
        document.querySelectorAll('input, textarea, select').forEach(field => {
            if (field.type === 'radio' || field.type === 'checkbox') {
                field.checked = false;
            } else {
                field.value = '';
            }
        });
    });

    // Excluir cliente
    document.getElementById('btn-excluir').addEventListener('click', () => {
        const codigo = selectCodigo.value;

        if (!codigo) {
            alert('Selecione um código para excluir!');
            return;
        }

        if (confirm(`Tem certeza que deseja excluir o cliente com código ${codigo}?`)) {
            fetch(urlAPI, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ codigo })
            })
                .then(response => {
                    if (!response.ok) throw new Error('Erro ao excluir cliente');
                    return response.json();
                })
                .then(() => {
                    alert('Cliente excluído com sucesso!');
                    atualizarListaDeCodigos();
                })
                .catch(error => alert('Erro ao excluir cliente: ' + error.message));
        }
    });
});
