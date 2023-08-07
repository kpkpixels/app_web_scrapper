const express = require("express");
const server = express();
const puppeteer = require("puppeteer");

const baseUrl=
  "abudhabvi.com";

  server.get('/', async (req, res) => {
    const totalPages = 7;
    const produtosLista = [];  

    const browser = await puppeteer.launch();
    
    for (let pageNumber = 1; pageNumber <= totalPages; pageNumber++) {
      const page = await browser.newPage();
      await page.goto(baseUrl + pageNumber);
  
      const pageData = await page.evaluate(() => {
        const bodyProdutos = document.querySelectorAll(".card-body");
        let produtos = [];
  
        function converteDinheiroBRtoUSA(str) {
          if (str.length < 1) return 0.00;
  
          const stringSemPonto = str.split("R$ ")[1].replace(/\./g, '');
          const stringSemVirgula = stringSemPonto.replace(',', '.');
  
          return parseFloat(stringSemVirgula);
        }
  
        bodyProdutos.forEach(bodyProduto => {
          const nomeProduto = bodyProduto.querySelector(".product-title .ch-60").innerText + "teste";
          const precoProduto = bodyProduto.querySelector(".product-price").innerText;
          const linkProduto = bodyProduto.querySelector(".product-title .ch-60").href;

          produtos.push({
            "Nome": nomeProduto,
            "Preco": converteDinheiroBRtoUSA(precoProduto),
            "Categorias": [{"_id": {"$oid": "64c06a0d341d215be1b1c7e9"}, "Nome":"Compressor"}],
            "URLProdutosSemelhantes" : [linkProduto]
          });
        });
  
        return {
          produtos: produtos
        };
      });
  
      produtosLista.push(...pageData.produtos);

      await page.close();
    }
  
    await browser.close();
  
    res.send({
      "Produtos": produtosLista
    });
  });
  

server.listen(3000);
