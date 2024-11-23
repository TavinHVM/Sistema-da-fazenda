document.getElementById('feedback-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const nome = document.getElementById('nome').value;
    const comentario = document.getElementById('comentario').value;

    fetch('feedback-api.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, comentario })
    }).then(response => response.json())
      .then(data => {
          alert('Feedback salvo com sucesso!');
          carregarFeedbacks();
          document.getElementById('feedback-form').reset();
      });
});

function carregarFeedbacks() {
    fetch('feedback-api.php')
        .then(response => response.json())
        .then(data => {
            const tbody = document.querySelector('#feedback-table tbody');
            tbody.innerHTML = '';

            data.forEach((feedback, index) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${feedback.nome}</td>
                    <td>${feedback.comentario}</td>
                    <td>
                        <button onclick="excluirFeedback(${index})">Excluir</button>
                    </td>
                `;
                tbody.appendChild(row);
            });
        });
}

function excluirFeedback(index) {
    fetch('feedback-api.php', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ index })
    }).then(response => response.json())
      .then(data => {
          alert('Feedback excluído com sucesso!');
          carregarFeedbacks();
      });
}

carregarFeedbacks();
