@extends('layouts.app')

@section('content')
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-10">
                <div class="card">
                    <div class="card-body">
                        <div id="chart-candlestick">

                        </div>

                        <div id="chart-bar">

                        </div>
                        <button id="btn-update" class="btn btn-primary">Atualizar</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection
