var saldo = 100000000.00;
var estoque = 1000;
var precoAtual = 0;
var fim = false;

function moneyFormat(value) {
    return parseFloat(value).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
}

function quantityFormat(value) {
    return parseFloat(value).toLocaleString('pt-BR', { maximumFractionDigits: 0, style: 'decimal'});
}

var optionsCandlestick = {
    chart: {
        id: 'candles',
        height: 290,
        type: 'candlestick',
    },
    plotOptions: {
        candlestick: {
            colors: {
                upward: '#3C90EB',
                downward: '#DF7D46'
            }
        }
    },
    series: [{
        data: []
    }],
    xaxis: {
        type: 'datetime'
    }
}
var chartCandlestick = new ApexCharts(
    document.querySelector("#chart-candlestick"),
    optionsCandlestick
);
chartCandlestick.render();

getData();
var interval = window.setInterval(function(){
    getData();
    if (fim == true) {
        clearInterval(interval);

        alert ("Resultado final: " + moneyFormat(saldo + (estoque * precoAtual)));
    }
}, 3000);

function getData() {

    $.getJSON("/getdados", function (json) {
        if (typeof json.status !== 'undefined') {
            if (json.status === "fim") {
                fim = true;
                return;
            }
        }

        var date = new Date(json['data']);
        var open = parseFloat(json['abertura']);
        var high = parseFloat(json['maxima']);
        var low = parseFloat(json['minima']);
        var close = parseFloat(json['fechamento']);

        data = {
            x: date,
            y: [open, high, low, close]
        };

        console.log(data);

        precoAtual = close;

        appendData(data);

        atualiza_valores();

        return true;
    });
}

function appendData(newData) {
    var numDataPoints = chartCandlestick.w.globals.dataPoints;

    var seriesO = chartCandlestick.w.globals.seriesCandleO;
    var seriesH = chartCandlestick.w.globals.seriesCandleH;
    var seriesL = chartCandlestick.w.globals.seriesCandleL;
    var seriesC = chartCandlestick.w.globals.seriesCandleC;
    var seriesX = chartCandlestick.w.globals.seriesX; // Data

    arrayData = [];

    for (i=0;i<numDataPoints;i++) {
        arrayData.push({
            x: seriesX[0][i],
            y: [seriesO[0][i], seriesH[0][i], seriesL[0][i], seriesC[0][i]]
        });
    }

    arrayData.push(newData);

    chartCandlestick.updateSeries([{
        data: arrayData
    }]);
}

function compra(custo) {
    qtd = custo/precoAtual;

    if (custo > saldo || precoAtual == 0) {
        alert("Saldo insuficiente para compra");
        return false;
    }

    saldo = saldo - custo;

    estoque = estoque + qtd;

    atualiza_valores();
    return true;
}

function venda(qtd) {
    preco = precoAtual;

    if (qtd > estoque || precoAtual == 0) {
        alert("Quantidade vendida maior que o estoque disponível");
        return false;
    }

    valor_venda = qtd * preco;

    saldo = saldo + valor_venda;
    estoque = estoque - qtd;

    atualiza_valores();

    return true;
}

$("#btn-compra").click(function () {
   value = parseFloat($("#input-compra").val());

   compra(value);
});

$("#btn-venda").click(function () {
    qtd = parseFloat($("#input-venda").val());

    venda(qtd);
});

function atualiza_valores() {
    displaySaldo = moneyFormat(saldo);
    displayPreco = moneyFormat(precoAtual);
    displayEstoque = quantityFormat(estoque);

    $("#display-saldo").text("Saldo: " + displaySaldo);
    $("#display-preco").text("Preço atual: " + displayPreco);
    $("#display-estoque").text("Estoque: " + displayEstoque + " un");
}
