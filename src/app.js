const http = require("http");
const express = require('express') //importacao do pacote
const app = express() //instanciando express
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var baseRestURL = "";
var username = "";
var password = "";
var respostaConsultaImovelLink;
var ress;
var nomeCidadeGlobal;
var nomeBairroGlobal;
var idCidadeGlobal;
var infoProduto;






// Inicio
app.get('/dadosImoveis', function (req, res) {
  var codigoImovel = req.query.codigoImovel;
  console.log("" + codigoImovel);
  this.username = req.query.user;
  console.log("" + this.username);
  this.password = req.query.key;
  console.log("" + this.password);
  this.baseRestURL = "http://api.brognoli.com.br/api/v2/imoveis/" + codigoImovel;
  createAuthToken(this.baseRestURL, this.username, this.password, function authCallBack(token) {
    res.send(this.infoProduto);
    return this.infoProduto;
  });

})
http.createServer(app).listen(3001, () => console.log("Servidor rodando local na porta 3001"));

// Autenticação e tratamento do imovel
function createAuthToken(baseRestURL, username, password, callback) {
  var APIPath = "";
  var completeRestURL = baseRestURL + APIPath;
  var method = "GET";
  var postData = "{\"username\": \"" + username + "\",\"password\": \"" + password + "\",\"loginMode\": 1,\"applicationType\": 35}";
  var url = completeRestURL;
  var async = true;
  var request = new XMLHttpRequest();
  console.log(url);
  request.open(method, url, async);
  request.setRequestHeader("Content-Type", "application/json");
  request.setRequestHeader("Accept", "application/json");
  request.setRequestHeader("user", this.username);
  request.setRequestHeader("key", this.password);
  request.send(postData);
  request.onload = function () {
    var status = request.status; // HTTP response status, e.g., 200 for "200 OK"
    console.log(status);
    var token = request.getResponseHeader("x-mstr-authtoken");
    this.ress = this.responseText;
    runPopularCidades(this.ress, function runPopularCidades() {
    });
    if (idCidadeGlobal == 6) {
      runBairroFlorianopolis(this.ress, function runBairroFlorianopolis() {
      });

    } else if (idCidadeGlobal == 13) {
      runBairroBiguacu(this.ress, function runBairroBiguacu() {
      });
    } else if (idCidadeGlobal == 1) {
      runBairroPalhoca(this.ress, function runBairroPalhoca() {
      });
    } else {
      runBairroSaoJose(this.ress, function runBairroSaoJose() {
      });
    }

    runTratarTodosDados(this.ress, function runTratarTodosDados() {

    });
    return callback(token);
  }
  console.log(request.statusText);

}

function runPopularCidades(respostaConsultaImovelLink) {
  console.log(respostaConsultaImovelLink)
  var respostaConsultaImovelLink = JSON.parse(respostaConsultaImovelLink)
  cidade = respostaConsultaImovelLink.cidade
  var cidadesLink = [
    {
      cidade: "Florianópolis",
      id: "6"
    },
    {
      cidade: "São José",
      id: "11"
    },
    {
      cidade: "Biguaçu",
      id: "13"
    },
    {
      cidade: "Palhoça",
      id: "1"
    },
  ]
  var tamanho = cidadesLink.length
  function nomeCidade(cidade, cidadesLink, tamanho) {
    for (i = 0; i < tamanho; i++) {
      if (cidade == cidadesLink[i].id) {
        idCidadeGlobal = cidadesLink[i].id
        var nomeCidade = cidadesLink[i].cidade
        return nomeCidade
      }
    }
    return nomeCidade
  }
  nomeCidade = nomeCidade(cidade, cidadesLink, tamanho)
  this.nomeCidadeGlobal = nomeCidade;
  return nomeCidade;
}


// Tratar Dados do Imovel
function runTratarTodosDados(respostaConsultaImovelLink) {

  var produto = JSON.parse(respostaConsultaImovelLink)
  var cidadesLink = this.nomeCidadeGlobal
  var bairrosLink = this.nomeBairroGlobal

  if ("rua" in produto) {
    var rua = produto.rua
  } else {
    var rua = null
  }

  if ("numero" in produto) {
    var numero = produto.numero
  } else {
    var numero = null
  }

  if (bairrosLink != null) {
    var bairro = bairrosLink
  } else {
    var bairro = null
  }

  if (cidadesLink != null) {
    var cidade = cidadesLink
  } else {
    var cidade = null
  }

  if ("agencia" in produto) {
    var agencia = produto.agencia
  } else {
    var agencia = null
  }

  if ("descricao" in produto) {
    var descricao = produto.descricao
    descricao = JSON.stringify(descricao)
    descricao = descricao.substring(1, descricao.length - 1)
    descricao = descricao.replace(/\\n/g, " ").replace(/\\r/g, "").replace(/\\t/g, " ")
  } else {
    var descricao = null
  }

  if ("vlralusemdesc" in produto) {
    var valorAluguel = produto.vlralusemdesc
    valorAluguel = valorAluguel.toString()
    valorAluguel = valorAluguel.replace(".", ",")
  } else {
    var valorAluguel = "sem valor"
  }

  if ("vlrcond" in produto) {
    var condominio = produto.vlrcond
    condominio = condominio.toString()
    condominio = condominio.replace(".", ",")
  } else {
    var condominio = null
  }

  if ("valoriptu" in produto) {
    var iptu = produto.valoriptu
    iptu = iptu.toString()
    iptu = iptu.replace(".", ",")
  } else {
    var iptu = null
  }

  var endereco = rua + " " + numero + " " + bairro + " " + cidade
  var codImovel = produto.codigo
  codImovel = codImovel.toString()

  if (agencia != null) {

    if (agencia == "2") {

      var agenciaLat = "-27.5896424"
      var agenciaLng = "-48.5461986"
      var agenciaEndereco = "Rua Almirante Alvim, número 595, Centro"
      var agenciaFrase = "Você poderá retirar as chaves do imóvel na nossa Agência do Centro."
      agencia = "Agência Centro"
      var agenciaLead = "239"

    }

    else if (agencia == "1") {

      var agenciaLat = "-27.5839102"
      var agenciaLng = "-48.5807997"
      var agenciaEndereco = "Rua José Cândido da Silva, número 38, Estreito"
      var agenciaFrase = "Você poderá retirar as chaves do imóvel na nossa Agência do Estreito."
      agencia = "Agência Estreito"
      var agenciaLead = "241"

    }

    else if (agencia == "4") {

      var agenciaLat = "-27.590061"
      var agenciaLng = "-48.6126707"
      var agenciaEndereco = "Av. Lédio João Martins, número 1274, Kobrasol"
      var agenciaFrase = "Você poderá retirar as chaves do imóvel na nossa Agência do Kobrasol."
      agencia = "Agência Kobrasol"
      var agenciaLead = "243"

    }

    else if (agencia == "19") {

      var agenciaLat = "-27.6426947"
      var agenciaLng = "-48.6719083"
      var agenciaEndereco = "Av. Atílio Pedro Pagani, número 231, Pagani"
      var agenciaFrase = "Você poderá retirar as chaves do imóvel na nossa Agência da Palhoça."
      agencia = "Agência Palhoça"
      var agenciaLead = "247"

    }

    else if (agencia == "5") {

      var agenciaLat = "-27.5885003"
      //var agenciaLat = null        
      var agenciaLng = "-48.5225893"
      //var agenciaLng = null            
      var agenciaEndereco = "Rua Lauro Linhares, número 1115, Trindade"
      //var agenciaEndereco = null
      var agenciaFrase = "Você poderá retirar as chaves do imóvel na nossa Agência da Trindade."
      //var agenciaFrase = "Nossa consultora poderá informar você sobre a retirada das chaves para a visita."
      agencia = "Agência Trindade"
      var agenciaLead = "249"

    }

    else if (agencia == "22") {

      var agenciaLat = "-27.6648517"
      var agenciaLng = "-48.4777197"
      var agenciaEndereco = "Rua Nicolau João de Abreu, número 283, Novo Campeche"
      var agenciaFrase = "Você poderá retirar as chaves do imóvel na nossa Agência Leste Sul."
      agencia = "Agência Leste Sul"
      var agenciaLead = "245"

    }

    else if (agencia == "49" || agencia == "50") {

      var agenciaLat = null
      var agenciaLng = null
      var agenciaEndereco = null
      agencia = "Agencia Terraz"
      var agenciaFrase = "Nossa consultora poderá informar você sobre a retirada das chaves para a visita."
      var agenciaLead = "2963"

    }
  }
  var valorTotal = "O valor do aluguel é de" + ' ' + "R$ " + valorAluguel

  if (condominio != null && iptu != null) {

    valorTotal = valorTotal + ", o condomínio é aproximadamente " + "R$ " + condominio
    valorTotal = valorTotal + " e o IPTU é por volta de " + "R$ " + iptu + " mensais."

  } else if (iptu != null && condominio == null) {

    valorTotal = valorTotal + " e o IPTU é por volta de " + "R$ " + iptu + " mensais."

  } else if (iptu == null && condominio != null) {

    valorTotal = valorTotal + " e o condomínio é por volta de " + "R$ " + condominio + " mensais."

  } else if (iptu == null && condominio == null) {

    valorTotal = valorTotal + "."

  }


  this.infoProduto = {

    "rua": rua,
    "numero": numero,
    "bairro": bairro,
    "cidade": cidade,
    "agencia": agencia,
    "endereco": endereco,
    "descricao": descricao,
    "agenciaLat": agenciaLat,
    "agenciaLng": agenciaLng,
    "valorAluguel": valorAluguel,
    "condominio": condominio,
    "iptu": iptu,
    "codImovel": codImovel,
    "agenciaEndereco": agenciaEndereco,
    "valorTotal": valorTotal,
    "agenciaFrase": agenciaFrase,
    "agenciaLead": agenciaLead

  }

  return this.infoProduto;
}

//Linhas abaixo para popular os bairros
function runBairroFlorianopolis(respostaConsultaImovelLink) {

  var respostaConsultaImovelLink = JSON.parse(respostaConsultaImovelLink)
  var bairro = respostaConsultaImovelLink.bairro
  var bairrosLink = [
    {
      bairro: "Abraão",
      id: "1",
      idCidade: "6"
    },
    {
      bairro: "Agronômica",
      id: "2",
      idCidade: "6"
    },
    {
      bairro: "Bom Abrigo",
      id: "3",
      idCidade: "6"
    },
    {
      bairro: "Balneário",
      id: "4",
      idCidade: "6"
    },
    {
      bairro: "Cachoeira do Bom Jesus",
      id: "5",
      idCidade: "6"
    },
    {
      bairro: "Costeira do Pirajubaé",
      id: "6",
      idCidade: "6"
    },
    {
      bairro: "Canasvieiras",
      id: "7",
      idCidade: "6"
    },
    {
      bairro: "Capoeiras",
      id: "8",
      idCidade: "6"
    },
    {
      bairro: "Carianos",
      id: "9",
      idCidade: "6"
    },
    {
      bairro: "Carvoeira",
      id: "10",
      idCidade: "6"
    },
    {
      bairro: "Centro",
      id: "11",
      idCidade: "6"
    },
    {
      bairro: "Coloninha",
      id: "12",
      idCidade: "6"
    },
    {
      bairro: "Coqueiros",
      id: "13",
      idCidade: "6"
    },
    {
      bairro: "Córrego Grande",
      id: "14",
      idCidade: "6"
    },
    {
      bairro: "Estreito",
      id: "15",
      idCidade: "6"
    },
    {
      bairro: "Fatima",
      id: "16",
      idCidade: "6"
    },
    {
      bairro: "Ingleses",
      id: "17",
      idCidade: "6"
    },
    {
      bairro: "Itacorubi",
      id: "18",
      idCidade: "6"
    },
    {
      bairro: "Itaguaçu",
      id: "19",
      idCidade: "6"
    },
    {
      bairro: "José Mendes",
      id: "20",
      idCidade: "6"
    },
    {
      bairro: "Jardim Atlântico",
      id: "21",
      idCidade: "6"
    },
    {
      bairro: "Lagoa da Conceição",
      id: "22",
      idCidade: "6"
    },
    {
      bairro: "Morro da Cruz",
      id: "23",
      idCidade: "6"
    },
    {
      bairro: "Pântano do Sul",
      id: "24",
      idCidade: "6"
    },
    {
      bairro: "Pantanal",
      id: "25",
      idCidade: "6"
    },
    {
      bairro: "Prainha",
      id: "26",
      idCidade: "6"
    },
    {
      bairro: "Ribeirão da Ilha",
      id: "27",
      idCidade: "6"
    },
    {
      bairro: "Ratones",
      id: "28",
      idCidade: "6"
    },
    {
      bairro: "Santa Antônio de Lisboa",
      id: "29",
      idCidade: "6"
    },
    {
      bairro: "Saco Grande",
      id: "30",
      idCidade: "6"
    },
    {
      bairro: "São Jõao do Rio Vermelho",
      id: "31",
      idCidade: "6"
    },
    {
      bairro: "Saco dos Limões",
      id: "32",
      idCidade: "6"
    },
    {
      bairro: "Santa Mônica",
      id: "33",
      idCidade: "6"
    },
    {
      bairro: "Trindade",
      id: "34",
      idCidade: "6"
    },
    {
      bairro: "Jurerê Internacional",
      id: "35",
      idCidade: "6"
    },
    {
      bairro: "Santinho",
      id: "36",
      idCidade: "6"
    },
    {
      bairro: "Santos Dumont",
      id: "37",
      idCidade: "6"
    },
    {
      bairro: "Serrinha",
      id: "38",
      idCidade: "6"
    },
    {
      bairro: "João Paulo",
      id: "40",
      idCidade: "6"
    },
    {
      bairro: "Barra da Lagoa",
      id: "41",
      idCidade: "6"
    },
    {
      bairro: "Monte Cristo",
      id: "42",
      idCidade: "6"
    },
    {
      bairro: "Campeche",
      id: "43",
      idCidade: "6"
    },
    {
      bairro: "Rio Tavares",
      id: "44",
      idCidade: "6"
    },
    {
      bairro: "Jardim Califórnia",
      id: "45",
      idCidade: "6"
    },
    {
      bairro: "Sambaqui",
      id: "46",
      idCidade: "6"
    },
    {
      bairro: "Açores",
      id: "60",
      idCidade: "6"
    },
    {
      bairro: "Jardim Itália",
      id: "47",
      idCidade: "6"
    },
    {
      bairro: "Cacupé",
      id: "48",
      idCidade: "6"
    },
    {
      bairro: "Monte Verde",
      id: "49",
      idCidade: "6"
    },
    {
      bairro: "Parque São Jorge",
      id: "50",
      idCidade: "6"
    },
    {
      bairro: "Praia Brava",
      id: "51",
      idCidade: "6"
    },
    {
      bairro: "Vargem do Bom Jesus",
      id: "52",
      idCidade: "6"
    },
    {
      bairro: "Vargem Grande",
      id: "53",
      idCidade: "6"
    },
    {
      bairro: "Jardim Anchieta",
      id: "54",
      idCidade: "6"
    },
    {
      bairro: "Caeira da Barra do Sul",
      id: "61",
      idCidade: "6"
    },
    {
      bairro: "Jurerê",
      id: "62",
      idCidade: "6"
    },
    {
      bairro: "Morro das Pedras",
      id: "55",
      idCidade: "6"
    },
    {
      bairro: "Armação do Pântano do Sul",
      id: "56",
      idCidade: "6"
    },
    {
      bairro: "Vargem Pequena",
      id: "63",
      idCidade: "6"
    },
    {
      bairro: "Praia Mole",
      id: "64",
      idCidade: "6"
    },
    {
      bairro: "Daniela",
      id: "65",
      idCidade: "6"
    },
    {
      bairro: "Tapera",
      id: "70",
      idCidade: "6"
    },
    {
      bairro: "Aeroporto",
      id: "71",
      idCidade: "6"
    },
    {
      bairro: "Ponta das Canas",
      id: "72",
      idCidade: "6"
    },
    {
      bairro: "Vila São João",
      id: "73",
      idCidade: "6"
    },
    {
      bairro: "Canto",
      id: "74",
      idCidade: "6"
    },
    {
      bairro: "Joaquina",
      id: "75",
      idCidade: "6"
    },
    {
      bairro: "Canto da Lagoa",
      id: "77",
      idCidade: "6"
    },
    {
      bairro: "Lagoinha",
      id: "78",
      idCidade: "6"
    },
    {
      bairro: "Rio Vermelho",
      id: "79",
      idCidade: "6"
    },
    {
      bairro: "Porto da Lagoa",
      id: "80",
      idCidade: "6"
    },
    {
      bairro: "Areias do Campeche",
      id: "81",
      idCidade: "6"
    },
    {
      bairro: "Beira Mar",
      id: "82",
      idCidade: "6"
    },
    {
      bairro: "Jardim Germânia",
      id: "83",
      idCidade: "6"
    },
    {
      bairro: "Jardim das Castanheiras",
      id: "84",
      idCidade: "6"
    },
    {
      bairro: "Barra do Sambaqui",
      id: "85",
      idCidade: "6"
    },
    {
      bairro: "Costa de Dentro",
      id: "86",
      idCidade: "6"
    },
    {
      bairro: "Costa de Dentro",
      id: "87",
      idCidade: "6"
    },
    {
      bairro: "Ingleses do Rio Vermelho",
      id: "88",
      idCidade: "6"
    },
    {
      bairro: "Praia da Solidão",
      id: "90",
      idCidade: "6"
    },
    {
      bairro: "Jardim Anchieta",
      id: "91",
      idCidade: "6"
    },
    {
      bairro: "Sapé",
      id: "92",
      idCidade: "6"
    },
    {
      bairro: "Costeira do Ribeirão",
      id: "93",
      idCidade: "6"
    },
    {
      bairro: "Canto dos Araças",
      id: "94",
      idCidade: "6"
    },
    {
      bairro: "Lagoinha do Norte",
      id: "95",
      idCidade: "6"
    },
    {
      bairro: "Tecnópolis",
      id: "96",
      idCidade: "6"
    },
    {
      bairro: "Armação",
      id: "97",
      idCidade: "6"
    },
    {
      bairro: "Fundos",
      id: "98",
      idCidade: "6"
    },
    {
      bairro: "Novo Campeche",
      id: "99",
      idCidade: "6"
    },
  ]
  var tamanho = bairrosLink.length
  function nomeBairro(bairrosLink, bairro, tamanho) {
    for (i = 0; i < tamanho; i++) {
      if (bairro == bairrosLink[i].id) {
        var nomeBairro = bairrosLink[i].bairro
        return nomeBairro
      }
    }
    return nomeBairro
  }
  nomeBairro = nomeBairro(bairrosLink, bairro, tamanho)
  this.nomeBairroGlobal = nomeBairro;
  return nomeBairro
}

function runBairroBiguacu(respostaConsultaImovelLink) {

  var respostaConsultaImovelLink = JSON.parse(respostaConsultaImovelLink)
  var bairro = respostaConsultaImovelLink.bairro
  var bairrosLink =
    [
      {
        bairro: "Centro",
        id: "1",
        idCidade: "13"
      },
      {
        bairro: "Fundos",
        id: "2",
        idCidade: "13"
      },
      {
        bairro: "Jardim Carandaí",
        id: "3",
        idCidade: "13"
      },
      {
        bairro: "Prado",
        id: "4",
        idCidade: "13"
      },
      {
        bairro: "Vendaval",
        id: "5",
        idCidade: "13"
      },
      {
        bairro: "Saudade",
        id: "6",
        idCidade: "13"
      },
      {
        bairro: "Rio Caveiras",
        id: "7",
        idCidade: "13"
      },
      {
        bairro: "Serraria",
        id: "8",
        idCidade: "13"
      },
      {
        bairro: "Bom Viver",
        id: "10",
        idCidade: "13"
      },
      {
        bairro: "Morro da Bina",
        id: "9",
        idCidade: "13"
      },
      {
        bairro: "Jardim Janaina",
        id: "11",
        idCidade: "13"
      },
      {
        bairro: "Jardim São Nicolau",
        id: "12",
        idCidade: "13"
      },
      {
        bairro: "São Miguel",
        id: "13",
        idCidade: "13"
      },
      {
        bairro: "João Rosa",
        id: "15",
        idCidade: "13"
      },
      {
        bairro: "Jardim Biguaçu",
        id: "16",
        idCidade: "13"
      },
      {
        bairro: "Industrial",
        id: "17",
        idCidade: "13"
      },
      {
        bairro: "Santa Catarina",
        id: "18",
        idCidade: "13"
      },
      {
        bairro: "Jardim Marco Antonio",
        id: "19",
        idCidade: "13"
      },
      {
        bairro: "Jardim Saveiro",
        id: "20",
        idCidade: "13"
      },
      {
        bairro: "Tijuquinhas",
        id: "21",
        idCidade: "13"
      },
      {
        bairro: "Boa Vista",
        id: "22",
        idCidade: "13"
      },
      {
        bairro: "Chácaras Fabiana",
        id: "23",
        idCidade: "13"
      },
      {
        bairro: "Jardim Anápolis",
        id: "24",
        idCidade: "13"
      },
      {
        bairro: "Praia de Baixo",
        id: "25",
        idCidade: "13"
      },
      {
        bairro: "Jardim Janaína",
        id: "26",
        idCidade: "13"
      },
      {
        bairro: "Alto Biguaçu",
        id: "27",
        idCidade: "13"
      },
      {
        bairro: "Jardim São Miguel",
        id: "28",
        idCidade: "13"
      },
      {
        bairro: "Canudos",
        id: "29",
        idCidade: "13"
      },
      {
        bairro: "Encruzilhada",
        id: "30",
        idCidade: "13"
      },
      {
        bairro: "BR 101",
        id: "31",
        idCidade: "13"
      },
      {
        bairro: "Espanha",
        id: "32",
        idCidade: "13"
      },
      {
        bairro: "Jardim Europa",
        id: "33",
        idCidade: "13"
      },
      {
        bairro: "Jardim Suely",
        id: "34",
        idCidade: "13"
      },
      {
        bairro: "Sorocaba de Dentro",
        id: "35",
        idCidade: "13"
      },
      {
        bairro: "Mar das Pedras",
        id: "36",
        idCidade: "13"
      },
      {
        bairro: "Loteamento Primavera II",
        id: "37",
        idCidade: "13"
      },
      {
        bairro: "Cachoeiras",
        id: "38",
        idCidade: "13"
      },
      {
        bairro: "Estiva",
        id: "39",
        idCidade: "13"
      },
      {
        bairro: "Fazenda",
        id: "40",
        idCidade: "13"
      },
      {
        bairro: "Tres Riachos",
        id: "41",
        idCidade: "13"
      },
      {
        bairro: "Loteamento Jardim Ipiranga",
        id: "42",
        idCidade: "13"
      },
      {
        bairro: "Universitário",
        id: "43",
        idCidade: "13"
      },
      {
        bairro: "Jardim Carandai",
        id: "44",
        idCidade: "13"
      },
      {
        bairro: "Areias de Cima",
        id: "45",
        idCidade: "13"
      },
      {
        bairro: "Jardim Primavera",
        id: "46",
        idCidade: "13"
      },
      {
        bairro: "Beira Rio",
        id: "47",
        idCidade: "13"
      },
      {
        bairro: "Praia João Rosa",
        id: "48",
        idCidade: "13"
      },
      {
        bairro: "Russia",
        id: "49",
        idCidade: "13"
      },
      {
        bairro: "Prado de Baixo",
        id: "50",
        idCidade: "13"
      },
      {
        bairro: "Area Rural",
        id: "51",
        idCidade: "13"
      },
      {
        bairro: "Tijuquinhas",
        id: "52",
        idCidade: "13"
      },
      {
        bairro: "Saveiro",
        id: "53",
        idCidade: "13"
      }
    ]
  var tamanho = bairrosLink.length
  function nomeBairro(bairrosLink, bairro, tamanho) {
    for (i = 0; i < tamanho; i++) {
      if (bairro == bairrosLink[i].id) {
        var nomeBairro = bairrosLink[i].bairro
        return nomeBairro
      }
    }
    return nomeBairro
  }
  nomeBairro = nomeBairro(bairrosLink, bairro, tamanho)
  this.nomeBairroGlobal = nomeBairro;
  return nomeBairro
}

function runBairroPalhoca(respostaConsultaImovelLink) {

  var respostaConsultaImovelLink = JSON.parse(respostaConsultaImovelLink)
  var bairro = respostaConsultaImovelLink.bairro
  var bairrosLink =
    [
      {
        bairro: "Pedra Branca",
        id: "1",
        idCidade: "1"
      },
      {
        bairro: "Ponte do Imaruim",
        id: "2",
        idCidade: "1"
      },
      {
        bairro: "Praia de Fora",
        id: "3",
        idCidade: "1"
      },
      {
        bairro: "Furadinho",
        id: "4",
        idCidade: "1"
      },
      {
        bairro: "Passa Vinte",
        id: "5",
        idCidade: "1"
      },
      {
        bairro: "Jardim Eldorado",
        id: "6",
        idCidade: "1"
      },
      {
        bairro: "Bela Vista",
        id: "7",
        idCidade: "1"
      },
      {
        bairro: "Centro",
        id: "8",
        idCidade: "1"
      },
      {
        bairro: "Pagani",
        id: "9",
        idCidade: "1"
      },
      {
        bairro: "Brejarú",
        id: "10",
        idCidade: "1"
      },
      {
        bairro: "Rio Grande",
        id: "11",
        idCidade: "1"
      },
      {
        bairro: "Área Industrial",
        id: "12",
        idCidade: "1"
      },
      {
        bairro: "Jardim Eucaliptus",
        id: "13",
        idCidade: "1"
      },
      {
        bairro: "Passag. do Maciambú",
        id: "14",
        idCidade: "1"
      },
      {
        bairro: "Aririu",
        id: "15",
        idCidade: "1"
      },
      {
        bairro: "Jardim Aquários",
        id: "16",
        idCidade: "1"
      },
      {
        bairro: "Jardim Madri",
        id: "17",
        idCidade: "1"
      },
      {
        bairro: "Jardim Madri",
        id: "18",
        idCidade: "1"
      },
      {
        bairro: "Alto Aririú",
        id: "19",
        idCidade: "1"
      },
      {
        bairro: "Barra do Aririú",
        id: "20",
        idCidade: "1"
      },
      {
        bairro: "Caminho Novo",
        id: "21",
        idCidade: "1"
      },
      {
        bairro: "Guarda do Cubatão",
        id: "22",
        idCidade: "1"
      },
      {
        bairro: "Pacheco",
        id: "23",
        idCidade: "1"
      },
      {
        bairro: "Pinheira",
        id: "24",
        idCidade: "1"
      },
      {
        bairro: "São Sebastião",
        id: "25",
        idCidade: "1"
      },
      {
        bairro: "Terra Fraca",
        id: "26",
        idCidade: "1"
      },
      {
        bairro: "Aririú da Formiga",
        id: "27",
        idCidade: "1"
      },
      {
        bairro: "Enseada do Brito",
        id: "28",
        idCidade: "1"
      },
      {
        bairro: "Ponta do Papagaio",
        id: "29",
        idCidade: "1"
      },
      {
        bairro: "Praia do Sonho",
        id: "30",
        idCidade: "1"
      },
      {
        bairro: "Guarda do Embaú",
        id: "31",
        idCidade: "1"
      },
      {
        bairro: "Jardim das Palmeiras",
        id: "32",
        idCidade: "1"
      },
      {
        bairro: "Praia do Pontal",
        id: "33",
        idCidade: "1"
      },
      {
        bairro: "Picadas do Sul",
        id: "34",
        idCidade: "1"
      },
      {
        bairro: "Casqueiro",
        id: "35",
        idCidade: "1"
      },
      {
        bairro: "Sertão do Campo",
        id: "36",
        idCidade: "1"
      },
      {
        bairro: "Madri",
        id: "37",
        idCidade: "1"
      },
      {
        bairro: "Alaor Silveira",
        id: "38",
        idCidade: "1"
      },
      {
        bairro: "Jardim Eucaliptus",
        id: "40",
        idCidade: "1"
      },
      {
        bairro: "Jardim Coqueiros",
        id: "41",
        idCidade: "1"
      },
      {
        bairro: "Maciambu",
        id: "42",
        idCidade: "1"
      },
      {
        bairro: "Morretes",
        id: "43",
        idCidade: "1"
      },
      {
        bairro: "Vila Nova",
        id: "44",
        idCidade: "1"
      },
      {
        bairro: "Cidade Univers. Pedra Branca",
        id: "45",
        idCidade: "1"
      },
      {
        bairro: "Frei Damião",
        id: "46",
        idCidade: "1"
      },
      {
        bairro: "Portal da Barra",
        id: "47",
        idCidade: "1"
      },
      {
        bairro: "Loteamento Marivone",
        id: "49",
        idCidade: "1"
      },
      {
        bairro: "Nova Palhoça",
        id: "50",
        idCidade: "1"
      },
      {
        bairro: "Praia do Meio",
        id: "51",
        idCidade: "1"
      },
      {
        bairro: "Pachecos",
        id: "52",
        idCidade: "1"
      },
      {
        bairro: "Pontal",
        id: "53",
        idCidade: "1"
      },
      {
        bairro: "Guarda do Embaú",
        id: "54",
        idCidade: "1"
      },
      {
        bairro: "Cruzeiro do Sul",
        id: "55",
        idCidade: "1"
      },
    ]
  var tamanho = bairrosLink.length
  function nomeBairro(bairrosLink, bairro, tamanho) {
    for (i = 0; i < tamanho; i++) {
      if (bairro == bairrosLink[i].id) {
        var nomeBairro = bairrosLink[i].bairro
        return nomeBairro
      }
    }
    return nomeBairro
  }
  nomeBairro = nomeBairro(bairrosLink, bairro, tamanho)
  this.nomeBairroGlobal = nomeBairro;
  return nomeBairro
}

function runBairroSaoJose(respostaConsultaImovelLink) {

  var respostaConsultaImovelLink = JSON.parse(respostaConsultaImovelLink)
  var bairro = respostaConsultaImovelLink.bairro
  var bairrosLink =
    [
      {
        bairro: "Areias",
        id: "1",
      },
      {
        bairro: "Belta Vista",
        id: "2",
      },
      {
        bairro: "Barreiros",
        id: "3",
      },
      {
        bairro: "Jardim Cidade de Florianópolis",
        id: "4",
      },
      {
        bairro: "Campinas",
        id: "5",
      },
      {
        bairro: "Centro",
        id: "6",
      },
      {
        bairro: "Fazenda Santo Antônio",
        id: "7",
      },
      {
        bairro: "Ipiranga",
        id: "8",
      },
      {
        bairro: "Kobrasol",
        id: "9",
      },
      {
        bairro: "Nossa Senhora do Rosário",
        id: "10",
      },
      {
        bairro: "Ponta de Baixo",
        id: "11",
      },
      {
        bairro: "Picadas do Norte",
        id: "12",
      },
      {
        bairro: "Picadas do Sul",
        id: "13",
      },
      {
        bairro: "Praia Comprida",
        id: "14",
      },
      {
        bairro: "Real Parque",
        id: "15",
      },
      {
        bairro: "Roçado",
        id: "16",
      },
      {
        bairro: "Santos Dumont",
        id: "17",
      },
      {
        bairro: "Serraria",
        id: "18",
      },
      {
        bairro: "Forquilhinhas",
        id: "19",
      },
      {
        bairro: "Jardim das Acacias",
        id: "21",
      },
      {
        bairro: "Floresta",
        id: "22",
      },
      {
        bairro: "Dona Vanda",
        id: "23",
      },
      {
        bairro: "Jardim das Acácias",
        id: "24",
      },
      {
        bairro: "São Luiz",
        id: "25",
      },
      {
        bairro: "Dona Adélia",
        id: "26",
      },
      {
        bairro: "Cidade Universitária",
        id: "27",
      },
      {
        bairro: "Flor do Sol",
        id: "28",
      },
      {
        bairro: "Kobrasol II",
        id: "29",
      },
      {
        bairro: "São Pedro",
        id: "31",
      },
      {
        bairro: "Flor de Napolis",
        id: "32",
      },
      {
        bairro: "Bosque das Mansões",
        id: "33",
      },
      {
        bairro: "Loteamento Palmares",
        id: "34",
      },
      {
        bairro: "Jardim Pinheiros",
        id: "35",
      },
      {
        bairro: "Jardim dos Lordes",
        id: "36",
      },
      {
        bairro: "Los Angeles",
        id: "37",
      },
      {
        bairro: "Sertão do Maruim",
        id: "38",
      },
      {
        bairro: "Vila Dourada",
        id: "69",
      },
      {
        bairro: "Potecas",
        id: "60",
      },
      {
        bairro: "Procasa",
        id: "39",
      },
      {
        bairro: "Forquilhas",
        id: "40",
      },
      {
        bairro: "Lisboa",
        id: "70",
      },
      {
        bairro: "Bom Viver",
        id: "42",
      },
      {
        bairro: "Parque Real",
        id: "43",
      },
      {
        bairro: "Área Industrial",
        id: "44",
      },
      {
        bairro: "Jardim Zanelato",
        id: "71",
      },
      {
        bairro: "Morro do Avaí",
        id: "45",
      },
      {
        bairro: "Jardim Floresta",
        id: "72",
      },
      {
        bairro: "Bela Vista II",
        id: "20",
      },
      {
        bairro: "Araucária",
        id: "74",
      },
      {
        bairro: "Colônia Santana",
        id: "75",
      },
      {
        bairro: "Morro do Viveiro",
        id: "76",
      },
      {
        bairro: "Santos Saraiva",
        id: "77",
      },
      {
        bairro: "Fazenda do Max",
        id: "78",
      },
      {
        bairro: "Jardim das Palmeiras",
        id: "82",
      },
      {
        bairro: "Praia de Fora",
        id: "83",
      },
      {
        bairro: "Jardim dos Lordes",
        id: "84",
      },
      {
        bairro: "BR 101",
        id: "85",
      },
      {
        bairro: "Fundos",
        id: "86",
      },
      {
        bairro: "Jardim Santiago",
        id: "87",
      },
      {
        bairro: "Luis Fagundes",
        id: "89",
      },
      {
        bairro: "Bela Vista II",
        id: "90",
      },
      {
        bairro: "Centro Histórico",
        id: "91",
      },
      {
        bairro: "Area Industrial",
        id: "92",
      },
      {
        bairro: "Bela Vista I",
        id: "93",
      },
      {
        bairro: "Distrito Industrial",
        id: "95",
      },
      {
        bairro: "Bela Vista III",
        id: "96",
      },
      {
        bairro: "San Marino",
        id: "97",
      },
      {
        bairro: "Forquilinhas",
        id: "99",
      },
      {
        bairro: "Morar Bem",
        id: "100",
      },
      {
        bairro: "Ceniro Martins",
        id: "101",
      },
      {
        bairro: "Forquilinhas",
        id: "103",
      },
      {
        bairro: "Coqueiros",
        id: "104",
      },
      {
        bairro: "Jardim Botânico",
        id: "105",
      }
    ]
  var tamanho = bairrosLink.length
  function nomeBairro(bairrosLink, bairro, tamanho) {
    for (i = 0; i < tamanho; i++) {
      if (bairro == bairrosLink[i].id) {
        var nomeBairro = bairrosLink[i].bairro
        return nomeBairro
      }
    }
    return nomeBairro
  }
  nomeBairro = nomeBairro(bairrosLink, bairro, tamanho)
  this.nomeBairroGlobal = nomeBairro;
  return nomeBairro
}