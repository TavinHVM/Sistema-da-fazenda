document.getElementById("login-form").addEventListener("submit", function (event) {
    event.preventDefault();

    const login = document.getElementById("login").value;
    const senha = document.getElementById("senha").value;

    // Logins fixos para demonstração
    const usuarios = {
        admin: { senha: "adminadmin", tipo: "admin" },
        funcionario: { senha: "fazendafuncionario", tipo: "funcionario" },
    };

    if (usuarios[login] && usuarios[login].senha === senha) {
        sessionStorage.setItem("usuarioLogado", JSON.stringify(usuarios[login]));
        window.location.href = "inicial.html";
    } else {
        document.getElementById("login-erro").style.display = "block";
    }
});
