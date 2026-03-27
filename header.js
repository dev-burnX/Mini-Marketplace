// ===== ===== HEADER GLOBAL ===== ===== //
/*
  Este JS é do header da página. Uso global para todas as outras páginas  
*/

// ===== Menu Hamburger ===== //
function menuOnClick(){
    document.getElementById("hamburger").classList.toggle("change");
    document.getElementById("nav").classList.toggle("change");
    document.getElementById("menu-bg").classList.toggle("change-bg");
}
//====================================================================================================//

const botaoLogin = document.getElementById("botaoLogin");
const menuCadastro = document.getElementById("menuCadastro");
const botaoFecharTela = document.getElementById("fecharTela");

const nomeProdutoInput = document.getElementById("inputItem"); 
const precoProdutoInput = document.getElementById("inputPreco");
const descricaoProdutoInput = document.getElementById("inputDescricao"); 
const botaoAdicionarProduto = document.getElementById("botaoAdicionarProduto");

const botaoCadastrarItens = document.getElementById("btnCadastrarItem");

const modalLogin = document.getElementById("modalLogin");


// ===== ABRIR MODAL ===== //
botaoLogin.addEventListener("click", function () {
    modalLogin.hidden = false;
    document.body.style.overflow = "hidden";
})

botaoCadastrarItens.addEventListener("click", function () {
    modalCadastro.hidden = false;
    document.body.style.overflow = "hidden";


    document.getElementById("hamburger").classList.toggle("change");
    document.getElementById("nav").classList.toggle("change");
    document.getElementById("menu-bg").classList.toggle("change-bg");
});

// ===== FECHAR MODAL ===== //
const botaoFecharLogin = document.getElementById("fecharLogin");

botaoFecharLogin.addEventListener("click", function (e) {
    e.preventDefault()
    modalLogin.hidden = true;
    erroLogin.textContent = "";
    document.body.style.overflow = "auto";
});

botaoFecharTela.addEventListener("click", function (e) {
    e.preventDefault()
    modalCadastro.hidden = true;
    document.body.style.overflow = "auto";
});

//====================================================================================================//

// ===== MENU DE LOGIN ===== //
const botaoEntrar = document.getElementById("botaoLoginUsuario");
const inputEmailLogin = document.getElementById("inputEmailLogin");
const inputSenhaLogin = document.getElementById("inputSenhaLogin");
const erroLogin = document.getElementById("erroLogin");

const usuarioId = document.getElementById("usuarioId");
const usuarioNivel = document.getElementById("usuarioNivel");

const textoBotaoUsuario = document.getElementById("textoBotaoUsuario")

fetch("./database/usuarios.json")
.then(res => res.json())
.then(usuarios => {

    usuarios.forEach(usuario => {
        botaoEntrar.addEventListener("click", function(e){
            e.preventDefault()

            if(inputEmailLogin.value === usuario.email && inputSenhaLogin.value === usuario.senha){
                modalLogin.hidden = true;
                document.body.style.overflow = "auto";

                botaoLogin.hidden = true;
                botaoUsuario.hidden = false;
                botaoCadastrarItens.disabled = false;
                botaoCadastrarItens.classList.add("cadastroAdminLiberado");
                textoBotaoUsuario.textContent = `Olá, ${usuario.nome}`
                usuarioId.textContent = `Usuário: ${usuario.id}`
                usuarioNivel.textContent = `Nivel: ${usuario.nivel}`

                erroLogin.textContent = ""
                inputEmailLogin.value = "";
                inputSenhaLogin.value = "";
            }else{
                erroLogin.textContent = "Usuário não encontrado!"
                inputEmailLogin.value = "";
                inputSenhaLogin.value = "";
                return
            };
        });
    });
});

// ===== MENU USUÁRIO ===== //

const botaoUsuario = document.getElementById("botaoUsuario");
const menuUsuario = document.getElementById("menuUsuario");

const botaoLogout = document.getElementById("botaoLogout");

botaoUsuario.addEventListener("click", function(){
    menuUsuario.classList.toggle("menuUsuarioAberto");
})

botaoLogout.addEventListener("click", function(e){
    e.preventDefault()

    botaoUsuario.hidden = true;
    botaoLogin.hidden = false;
    botaoCadastrarItens.disabled = true;
    botaoCadastrarItens.classList.remove("cadastroAdminLiberado");
    usuarioId.textContent = "";
    usuarioNivel.textContent = "";
})

//====================================================================================================//

// ===== CADASTRAR ITENS ===== //
botaoAdicionarProduto.addEventListener("click", function (e) {
    e.preventDefault();

    const produto = {
        nome: nomeProdutoInput.value,
        preco: Number(precoProdutoInput.value),
        descricao: descricaoProdutoInput.value
    };

    console.log(produto);

    // ===== Enviar dados para o Node.js ===== //

    fetch("http://localhost:3000/salvarProduto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(produto)
    });

    nomeProdutoInput.value = "";
    precoProdutoInput.value = "";
    descricaoProdutoInput.value = "";
});