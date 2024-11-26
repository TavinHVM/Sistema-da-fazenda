document.addEventListener("DOMContentLoaded", function () {
    const usuario = JSON.parse(sessionStorage.getItem("usuarioLogado"));

    if (!usuario) {
        alert("Você precisa estar logado para acessar o sistema.");
        window.location.href = "index.html";
    }

    window.cadastrar = function () {
        window.location.href = "cadastro.html";
    };

    window.registrar = function () {
        window.location.href = "registro.html";
    };

    window.feedback = function () {
        window.location.href = "feedback.html";
    };

    window.manual = function(){
        window.location.href = "manual.html";
    };

    window.sair = function () {
        sessionStorage.removeItem("usuarioLogado");
        alert("Saindo do sistema...");
        window.location.href = "index.html";
    };
});
