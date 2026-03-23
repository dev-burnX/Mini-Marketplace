// ===== NODE.JS ===== //
// ===== Salvar Item ===== //

import { readFileSync, writeFileSync } from "fs";
import express from "express"; 
import cors from "cors";
const app = express();
app.use(express.json());
app.use(cors());

app.post("/salvarProduto", (req, res) => {
    const produto = req.body;
    const dados = readFileSync("./database/itens.json");
    const lista = JSON.parse(dados);

    lista.push(produto);

    writeFileSync("./database/itens.json", JSON.stringify(lista, null, 2));
    
    res.json({ status: "Produto salvo" });

    console.log("Produto recebido", req.body)
});

app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000")
});

