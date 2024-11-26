document.addEventListener("DOMContentLoaded", function () {
    const usuario = JSON.parse(sessionStorage.getItem("usuarioLogado"));

    if (!usuario) {
        alert("Você precisa estar logado para acessar o sistema.");
        window.location.href = "index.html";
    }

    window.cadastrar = function () {
        if (usuario.tipo === "funcionario") {
            alert("Funcionários não têm acesso ao cadastro de funcionários.");
        } else {
            window.location.href = "cadastrofuncionarios.html";
        }
    };

    window.registrar = function () {
        window.location.href = "registro.html";
    };

    window.feedback = function () {
        window.location.href = "feedback.html";
    };

    window.sair = function () {
        sessionStorage.removeItem("usuarioLogado");
        alert("Saindo do sistema...");
        window.location.href = "index.html";
    };
});
