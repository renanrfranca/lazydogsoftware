var saldo = 100000000.00;
var estoque = 1000;
var precoAtual = 0;
var fim = false;
var noticias = [];

function moneyFormat(value) {
    return parseFloat(value).toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' });
}

function quantityFormat(value) {
    return parseFloat(value).toLocaleString('pt-BR', { maximumFractionDigits: 0, style: 'decimal'});
}

function dateFormat(dateString) {
    var date = new Date(dateString);
    return date.toLocaleDateString('pt-br');
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
/*
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
                xaxis: {
                    min: new Date('20 Jan 2017').getTime(),
                    max: new Date('10 Dec 2017').getTime()
                },
                fill: {
                    color: '#ccc',
                    opacity: 0.4
                },
                stroke: {
                    color: '#0D47A1',
                }
            },
        },
        dataLabels: {
            enabled: false
        },
        plotOptions: {
            bar: {
                columnWidth: '80%',
                colors: {
                    ranges: [
                        {
                            from: -1000,
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
                show: false
            }
        }

}

var chartBar = new ApexCharts(
    document.querySelector("#chart-bar"),
);
//chartBar.render();
*/
getData();
var interval = window.setInterval(function(){
    getData();
    if (fim == true) {
        clearInterval(interval);

        var result = "Resultado final: " + moneyFormat(saldo + (estoque * precoAtual));

        $("#resultado").text(result);

        $(".modal").modal({
            backdrop: 'static',
            keyboard: false
        });
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

        var values = json['values'];

        var date = new Date(values['data']);
        var open = parseFloat(values['abertura']);
        var high = parseFloat(values['maxima']);
        var low = parseFloat(values['minima']);
        var close = parseFloat(values['fechamento']);

        data = {
            x: date,
            y: [open, high, low, close]
        };

        precoAtual = close;

        appendData(data);

        atualiza_valores();

        if (typeof json['news'] !== 'undefined') {
            updateNews(json['news']);
        }

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

function updateNews(news) {
    noticias.unshift(news);
    if (noticias.length > 5) {
        noticias.pop();
    }

    var list = '<ul class="list-group">';

    noticias.forEach(function (noticia) {
       list = list + '<li class="list-group-item">' + dateFormat(noticia['date']) + ' - ' + noticia['title'] + '</li>';
    });

    list = list + '</ul>';

    $("#news").html(list);
}
