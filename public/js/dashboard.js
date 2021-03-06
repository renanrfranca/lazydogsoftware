var saldo = 10000000.00;
var estoque = 1000;
var precoAtual = 0;
var fim = false;
var noticias = [];


$(document).ready(function(){
    $(".money").inputmask("decimal",{
        alias: 'numeric',
        groupSeparator: '.',
        autoGroup: true,
        digits: 2,
        radixPoint: ",",
        digitsOptional: false,
        allowMinus: false,
        placeholder: ''
      });

    var users;

    Echo.join('session.' + session_id)
        .here((users) => {
            this.users = users;
        })
        .joining((user) => {
            console.log(user.name);
        })
        .leaving((user) => {
            console.log(user.name);
        })
        .listen('NewSeriesData', (e) => {
            console.log(e.data.values);
            handleData(e.data);
        });
});

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

// -------------- FUTURO -----------------

var optionsCandlestick2 = {
    chart: {
        id: 'candles2',
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
var chartCandlestick2 = new ApexCharts(
    document.querySelector("#chart-candlestick2"),
    optionsCandlestick2
);
chartCandlestick2.render();

//ISSUE: options nao estao corretas
var optionsChartBar2 = {
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

};

var chartBar2 = new ApexCharts(
    document.querySelector("#chart-bar2"), optionsChartBar2
);
chartBar2.render();


function handleData(socket_data) {
    if (socket_data == 'fim') {
        var result = "Resultado final: " + moneyFormat(saldo + (estoque * precoAtual));

        $("#resultado").text(result);

        $(".modal").modal({
            backdrop: 'static',
            keyboard: false
        });
        return;
    }

    var values = socket_data['values'];
    var values_futuro = socket_data['values_futuro'];

    var date = new Date(values['data']);
    var open = parseFloat(values['abertura']);
    var high = parseFloat(values['maxima']);
    var low = parseFloat(values['minima']);
    var close = parseFloat(values['fechamento']);

    data = {
        x: date,
        y: [open, high, low, close]
    };

    dataBar = {
        x: date,
        y: (close - open)
    };

    //console.log(data);
    // console.log(dataBar);

    precoAtual = close;

    appendData(data, dataBar);

    var date = new Date(values_futuro['data']);
    var open = parseFloat(values_futuro['abertura']);
    var high = parseFloat(values_futuro['maxima']);
    var low = parseFloat(values_futuro['minima']);
    var close = parseFloat(values_futuro['fechamento']);

    data = {
        x: date,
        y: [open, high, low, close]
    };

    dataBar = {
        x: date,
        y: (close - open)
    };

    appendData2(data, dataBar);

    saldo = saldo - 1.6 * estoque;

    atualiza_valores();

    if (typeof socket_data['news'] !== 'undefined') {
        updateNews(socket_data['news']);
    }

    return true;
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

function appendData2(newData, newDataBar) {
    var numDataPoints = chartCandlestick2.w.globals.dataPoints;

    var seriesO = chartCandlestick2.w.globals.seriesCandleO;
    var seriesH = chartCandlestick2.w.globals.seriesCandleH;
    var seriesL = chartCandlestick2.w.globals.seriesCandleL;
    var seriesC = chartCandlestick2.w.globals.seriesCandleC;
    var seriesX = chartCandlestick2.w.globals.seriesX; // Data

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

    chartCandlestick2.updateSeries([{
        data: arrayData
    }]);

    chartBar2.updateSeries([{
        data: arrayDataBar
    }]);
}

function compra(qtd) {
    if (isNaN(qtd) || qtd <= 0){
        alert("Digite uma quantidade válida");
        return false;
    }
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
