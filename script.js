// ===== Lista de Itens ===== //

fetch("./database/itens.json")
.then(res => res.json())
.then(produtos => {

    //  ===== Alguns Globais de fetch ===== //
    const lista = document.getElementById("lista");
    let total = 0;

    const listaCarrinho = document.getElementById("listaCarrinho");
    let carrinhoItens = [];
    let mapaItens = {};

    // ===== Ordenem Alfabética ===== //
    produtos.sort((a, b) => a.nome.localeCompare(b.nome));

    // ===== Início do forEach ===== //
    produtos.forEach(produto => {

        // ===== Mostrar Lista JSON na tela ===== //
        const item = document.createElement("li");
        const linha = document.createElement("hr");
        linha.classList.add("linha")
        item.classList.add("item")
        item.setAttribute("data-id", produto.id);
        item.innerHTML = `
            <img id="iconItem" src="${produto.imagem}" width="64px" height="64px">
            <div class="itemConteudo">
                <h3 class="tituloItem">${produto.nome}</h3>
                <p class="descricaoItem">${produto.descricao}</p>
                <p style="color:green;"> R$${produto.preco.toFixed(2)}</p>
            </div>

            <div id="botoes" class="botoes">
                <div class="botoesItem">
                    <button class="botaoRemoverItem botaoAddRemove">➖</button>
                    <p class="quatidadeItem">0</p>
                    <button class="botaoAdicionarItem botaoAddRemove">➕</button>
                </div>
                <p class="valorItem">R$0.00</p>
            </div>
        `;
        lista.appendChild(item);
        lista.appendChild(linha);
        
        // ===== Variaveis da Lista (Obs: Variaveis são criadas depois de chamar a lista)
        let botaoRemove = item.querySelector(".botaoRemoverItem");
        let botaoAdicionar = item.querySelector(".botaoAdicionarItem");
        let quantidadeItem = item.querySelector(".quatidadeItem");
        let valorItem = item.querySelector(".valorItem");


        // ===== BOTÕES QUANTIDADE X ITENS ===== //

        // ===== BOTÃO ADICIONAR ITEM ===== //
        botaoAdicionar.addEventListener("click", function(){
            const itemMap = mapaItens[produto.id];

            itemMap.contador++;
            itemMap.atualizarUI();
            
            // Verificar se item ja existe
            const itemExistente = carrinhoItens.find(i => i.id === produto.id);
            if (itemExistente) {
                itemExistente.quantidade = itemMap.contador;
            } else {
                carrinhoItens.push({
                    id: produto.id,
                    nome: produto.nome,
                    preco: produto.preco,
                    imagem: produto.imagem,
                    quantidade: itemMap.contador
                });
            }
            atualizarTotal()
            atualizarCarrinho();

        }); // Fim Botão

        
        // ===== BOTÃO REMOVER ITEM ===== //
        botaoRemove.addEventListener("click", function () {
            const itemMap = mapaItens[produto.id];

            if (itemMap.contador > 0) {
                itemMap.contador--;
                itemMap.atualizarUI();
                
            }

            // Verificar se item ja existe
            const itemExistente = carrinhoItens.find(i => i.id === produto.id);
            if (itemExistente) {
                if (itemMap.contador === 0) {
                    carrinhoItens = carrinhoItens.filter(i => i.id !== produto.id);
                } else {
                    itemExistente.quantidade = itemMap.contador;
                }
            }
            atualizarTotal();
            atualizarCarrinho();
            atualizarFundoCarrinho();

        }); // Fim Botão

        /*
            Acessar os elementos da interface pelo ID:

            - Explicação: mapaItens é apenas um objeto usado como “atalho” para acessar 
            elementos da interface pelo id do produto.

            - Sem ele não consigo acessar o "contadorItem" que está preso dentro do 
            forEach.

        */
        mapaItens[produto.id] = {
            contador: 0,
            quantidadeItem,
            valorItem,
            preco: produto.preco,

            atualizarUI() {
                this.quantidadeItem.textContent = this.contador;
                this.valorItem.textContent = `R$${(this.preco * this.contador).toFixed(2)}`
            },

            resetar() {
                this.contador = 0;
                this.atualizarUI();
            }
        };
    }) // Fim forEach

    
    // Atualizar valor total do carrinho
    let saldoCarrinho = document.getElementById("saldoCarrinho");

    function atualizarTotal() {
        total = 0;

        carrinhoItens.forEach(item => {
            total += item.preco * item.quantidade;
        });

        saldoCarrinho.textContent = `R$${total.toFixed(2)}`;
        subtotalCarrinho.textContent = `R$${total.toFixed(2)}` 
        totalCarrinho.textContent = `R$${total.toFixed(2)}`
        totalPorPessoa.textContent = `R$${total.toFixed(2)}`
    }

    
    // Botão exluir item do carrinho
    listaCarrinho.addEventListener("click", function (e) {
        const botaoExcluir = e.target.closest(".excluirItem")
        
        if (botaoExcluir) {
            const id = Number(botaoExcluir.dataset.id);

            carrinhoItens = carrinhoItens.filter(item => item.id !== id);

            // Reseta quantidade e valor na Lista de Produtos
            mapaItens[id].resetar();

            atualizarCarrinho();
            atualizarTotal()
            atualizarFundoCarrinho()
        };
    });

    // Atualizar Carrinho

    function atualizarCarrinho() {

        listaCarrinho.innerHTML = "";
        

        carrinhoItens.forEach(item => {

            if (item.quantidade > 0) {
                const itemCarrinho = document.createElement("li")

                itemCarrinho.classList.add("itemCarrinho")
                itemCarrinho.innerHTML = `
                <img id="iconItem" src="${item.imagem}" width="64px" height="64px">
                <div class="conteudoItem">
                    <h3>${item.nome}</h3>
                    <div>
                        <p style="color:var(--cor-texto-secundario);">Quantidade: ${item.quantidade}</p>
                        <p style="color:green;">R$${(item.preco * item.quantidade).toFixed(2)}</p>
                    </div>
                </div>

                <div class="botoesItemCarrinho">
                    <button class="excluirItem" data-id="${item.id}"><img src="./assets/excluir.png" width="32px"></button>
                </div>
                `

                listaCarrinho.appendChild(itemCarrinho)
                atualizarFundoCarrinho()
            }
        })

    }

    // Atualizar fundo quando tiver conteudo ou não 
    const carrinhoVazio = document.querySelector(".carrinhoVazio")
    function atualizarFundoCarrinho(){
        
        if(listaCarrinho.children.length === 0){
            carrinhoVazio.style.display = "block"
        }else{
            carrinhoVazio.style.display = "none"
        }
    }


    // ===== RESUMO DE VALORES ===== //
    const totalPorPessoa = document.getElementById("totalPorPessoa");
    const totalCarrinho = document.getElementById("totalCarrinho");
    const divisor = document.getElementById("divisor")
    let subtotalCarrinho = document.getElementById("subtotalCarrinho");

    function calcularSubtotal(){
        const subtotal = total;

        const resultado = subtotal/divisor.value;

        totalPorPessoa.textContent = `R$${resultado.toFixed(2)}`
    }

    divisor.addEventListener("change", calcularSubtotal)
    calcularSubtotal()


    // ===== Área de Pagamento ===== //

    const pagar = document.getElementById("botaoPagar");

    function calcularTroco(){
        const res = saldoTotal - total;

        if(res < 0){
            erroPagamento.textContent = "Saldo insuficiente!"
            return
        }else{
            trocoPagamento.textContent = `R$${res.toFixed(2)}`
            saldo.textContent = `R$${res.toFixed(2)}`
            saldoCarteiraPagamento.textContent = `R$${res.toFixed(2)}`
            saldoLabel.textContent = `R$${res.toFixed(2)}`

            saldoTotal = res;

            erroPagamento.textContent = "";
            limparCarrinho();
        }

    }

    pagar.addEventListener("click", function(e){
        e.preventDefault();

        calcularTroco();
    })

    // ===== LIMPAR CARRINHO ===== //

    function limparCarrinho(){
        carrinhoItens = [];

        Object.values(mapaItens).forEach(item => {
            item.resetar();
        });

        listaCarrinho.innerHTML = "";

        atualizarTotal();
        atualizarFundoCarrinho();
    }

})
//====================================================================================================//

// ===== Menu Cadastrar Itens ===== //

const adicionarSaldo = document.getElementById("adicionarSaldo")

const botaoContinuar = document.querySelector(".botaoContinuar")

const menuDeposito = document.getElementById("menuDeposito")

const botaoFecharDeposito = document.getElementById("fecharDeposito");
const botaoFecharPagamento = document.getElementById("fecharPagamento");

const botaoDepositar = document.getElementById("botaoAdicionarSaldo"); 

const saldo = document.getElementById("saldoAtual");
const saldoLabel = document.getElementById("saldoAtualLabel");

const inputDeposito = document.getElementById("inputDepositar");
const erroDepositarSaldo = document.getElementById("erroDepositarSaldo")
const trocoPagamento = document.getElementById("trocoPagamento");

const modalCadastro = document.getElementById("modalCadastro");
const modalSaldo = document.getElementById("modalSaldo");
const modalPagamento = document.getElementById("modalPagamento");

// ===== ABRIR MODAL ===== //
adicionarSaldo.addEventListener("click", function () {
    modalSaldo.hidden = false
    document.body.style.overflow = "hidden";


    document.getElementById("hamburger").classList.toggle("change");
    document.getElementById("nav").classList.toggle("change");
    document.getElementById("menu-bg").classList.toggle("change-bg");
});

botaoContinuar.addEventListener("click", function(){
    modalPagamento.hidden = false;
    document.body.style.overflow = "hidden";
})

// ===== FIM  ===== //

// ===== DEPOSITAR SALDO ===== //
const saldoCarteiraPagamento = document.getElementById("saldoCarteiraPagamento");
const erroPagamento = document.getElementById("erroPagamento")
let saldoTotal = 0;

botaoDepositar.addEventListener("click", function (e) {
    e.preventDefault();
    if(inputDeposito.value === ""){
        erroDepositarSaldo.textContent = "Digite um valor"
    }else{
        erroDepositarSaldo.textContent = ""
    }
    saldoTotal += Number(inputDeposito.value);
    saldo.textContent = `R$${saldoTotal.toFixed(2)}`;
    saldoLabel.textContent = `R$${saldoTotal.toFixed(2)}`;
    saldoCarteiraPagamento.textContent = `R$${saldoTotal.toFixed(2)}`;
    inputDeposito.value = "";
});
// ===== FIM ===== //

// ===== BOTÃO FECHAR MODAL ===== //

botaoFecharDeposito.addEventListener("click", function (e) {
    e.preventDefault()
    modalSaldo.hidden = true;
    document.body.style.overflow = "auto";
    erroDepositarSaldo.textContent = ""
});

botaoFecharPagamento.addEventListener("click", function(e){
    e.preventDefault();
    modalPagamento.hidden = true;
    document.body.style.overflow = "auto";
    trocoPagamento.textContent = "";
    erroPagamento.textContent = "";
})

// ===== FIM ===== //


// ===== LISTA DE ITENS ADICIONADOS ===== //

const sessaoCarrinho = document.getElementById("sessaoCarrinho");
const carrinho = document.getElementById("carrinho");
const botaoVerSacola = document.getElementById("verSacola");
const botaoVoltar = document.querySelector(".botaoVoltar");

carrinho.addEventListener("click", function () {
    sessaoCarrinho.classList.toggle("abrirCarrinho")
    document.body.classList.toggle("travarBody")
})

botaoVerSacola.addEventListener("click", function (e) {
    e.preventDefault();
    sessaoCarrinho.classList.toggle("abrirCarrinho")
    document.body.classList.toggle("travarBody")
})

botaoVoltar.addEventListener("click", function(e){
    e.preventDefault();

    sessaoCarrinho.classList.toggle("abrirCarrinho")
    document.body.classList.toggle("travarBody")
})