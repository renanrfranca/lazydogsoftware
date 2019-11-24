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

//ISSUE: options nao estao corretas
var optionsChartBar = {
    chart: {
        height: 160,
        type: 'bar',
        brush: {
            enabled: true,
            target: 'candles'
        },
        selection: {
            enabled: true,
            xaxis: {},
            fill: {
                color: '#ccc',
                opacity: 0.4
            },
            stroke: {
                color: '#0D47A1',
            }
        },
    },
    plotOptions: {
        bar: {
            columnWidth: '80%',
            colors: {
                ranges: [
                    {
                        from: -10000,
                        to: 0,
                        color: '#F15B46'
                    }, {
                        from: 1,
                        to: 10000,
                        color: '#FEB019'
                    }
                ],
                
            },
        }        
    },
    stroke: {
        width: 0
    },
    series: [{
        name: "Serie anual",
        data: []
    }],
    xaxis: {
        type: 'datetime',
        axisBorder: {
            offsetX: 13
        }
    },
    yaxis: {
        labels: {
            show: true
        }
    }
    
}

var chartBar = new ApexCharts(
    document.querySelector("#chart-bar"), optionsChartBar
);
chartBar.render();

getData();
var interval = window.setInterval(function(){
    getData();
    if (fim == true) {
        clearInterval(interval);
        alert ("Resultado final: " + moneyFormat(saldo + (estoque * precoAtual)));
    }
}, 1000);

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

        dataBar = {
            x: date,
            y: (close - open)
        };

        //console.log(data);
        console.log(dataBar);

        precoAtual = close;

        appendData(data, dataBar);

        atualiza_valores();

        return true;
    });
}

function appendData(newData, newDataBar) {
    var numDataPoints = chartCandlestick.w.globals.dataPoints;

    var seriesO = chartCandlestick.w.globals.seriesCandleO;
    var seriesH = chartCandlestick.w.globals.seriesCandleH;
    var seriesL = chartCandlestick.w.globals.seriesCandleL;
    var seriesC = chartCandlestick.w.globals.seriesCandleC;
    var seriesX = chartCandlestick.w.globals.seriesX; // Data

    arrayData = [];
    arrayDataBar = [];

    for (i=0;i<numDataPoints;i++) {
        arrayData.push({
            x: seriesX[0][i],
            y: [seriesO[0][i], seriesH[0][i], seriesL[0][i], seriesC[0][i]]
        });
        arrayDataBar.push({
            x: seriesX[0][i],
            y: [seriesC[0][i] - seriesO[0][i]]
        });
    }

    arrayData.push(newData);
    arrayDataBar.push(newDataBar);

    chartCandlestick.updateSeries([{
        data: arrayData
    }]);

    chartBar.updateSeries([{
        data: arrayDataBar
    }]);
}

function compra(qtd) {
    

    if (qtd > estoque || precoAtual == 0) {
        alert("Quantidade indisponível para compra!");
        return false;
    }

    valor_compra = qtd * precoAtual; //calcula o total da compra
    saldo = saldo - valor_compra; //subtrai do caixa atual
    estoque = estoque + qtd; //subtrai do estoque atual

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
   qtd = parseFloat($("#input-compra").val());

   compra(qtd);
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
