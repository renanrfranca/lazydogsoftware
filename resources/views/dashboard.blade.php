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

                        <div class="row">
                            <div class="col">
                                <div>
                                    <input type="text" id="input-compra">
                                    <button id="btn-compra">Comprar</button>
                                </div>
                            </div>
                            <div class="col">
                                <div>
                                    <input type="text" id="input-venda">
                                    <button id="btn-venda">Vender</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection
