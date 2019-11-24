@extends('layouts.app')

@section('content')
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-10">
                <div class="card">
                    <div class="card-body">
                        <div class="row">
                            <div class="col">
                                <h3 id="display-saldo"></h3>
                            </div>
                            <div class="col">
                                <h3 id="display-preco"></h3>
                            </div>
                            <div class="col">
                                <h3 id="display-estoque"></h3>
                            </div>
                        </div>

                        <div id="chart-candlestick">

                        </div>
                        <div id="chart-bar">

                        </div>

                        <div class="row">
                            <div class="col">
                                <div>
                                    <input required="true" class="money" type="text" id="input-compra" placeholder="Comprar ativos (un)...">
                                    <button id="btn-compra" class="btn btn-success">Comprar</button>
                                </div>
                            </div>
                            <div class="col">
                                <div>
                                    <input required="true" class="money" type="text" id="input-venda" placeholder="Vender ativos (un)...">
                                    <button id="btn-venda" class="btn btn-danger" >Vender</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="card mt-2">
                    <div class="card-body" id="news">

                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="modal" tabindex="-1" role="dialog">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Exercício finalizado</h5>
                </div>
                <div class="modal-body">
                    <p id="resultado"></p>
                    <button class="btn btn-secondary" onclick="location.reload()">Clique para reiniciar</button>
                </div>
            </div>
        </div>
    </div>
@endsection
