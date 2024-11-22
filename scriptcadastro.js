document.addEventListener("DOMContentLoaded", function() {
    console.log("Página carregada.");
});

document.getElementById('btn-limpar').addEventListener('click', () => {
    const inputs = document.querySelectorAll('input');
    const selects = document.querySelectorAll('select');
    const textareas = document.querySelectorAll('textarea');
    
    inputs.forEach(input => {
        if (input.type === 'text' || input.type === 'number' || input.type === 'email' || input.type === 'date') {
            input.value = '';
        } else if (input.type === 'radio' || input.type === 'checkbox') {
            input.checked = false;
        }
    });

    selects.forEach(select => {
        select.selectedIndex = 0;
    });

    textareas.forEach(textarea => {
        textarea.value = '';
    });
});

document.getElementById('btn-gravar').addEventListener('click', () => {
    const cliente = {
        codigo: document.querySelector('input[name="codigo"]')?.value || '',
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
        observacoes: document.querySelector('textarea[name="observacoes"]')?.value || ''
    };

    // Valida os campos obrigatórios
    if (!cliente.codigo || !cliente.nome || !cliente.cpf_cnpj) {
        alert('Preencha os campos obrigatórios!');
        return;
    }

    fetch('http://localhost:8080/ProjetoPim/api.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(cliente)
    })
    .then(response => response.json())
    .then(data => alert(data.status))
    .catch(error => console.error('Erro ao gravar:', error));
});

function excluirCliente(id) {
    fetch('http://localhost:8080/ProjetoPim/api.php', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id })
    })
    .then(response => response.json())
    .then(data => alert(data.status))
    .catch(error => console.error('Erro ao excluir:', error));
}

function atualizarCliente(id) {
    const cliente = {
        id: id,
        codigo: document.querySelector('input[name="codigo"]')?.value || '',
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
        observacoes: document.querySelector('textarea[name="observacoes"]')?.value || ''
    };

    fetch('http://localhost:8080/ProjetoPim/api.php', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(cliente)
    })
    .then(response => response.json())
    .then(data => alert(data.status))
    .catch(error => console.error('Erro ao atualizar:', error));
}
