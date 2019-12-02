@extends('layouts.app')

@section('content')
    <div class="container">
        <div class="row">
            <div class="col-md-8">
                <div class="card">
                    <div class="card-header">Sessão</div>

                    <div class="card-body">
                        <h1>Código: {{$session->id}}</h1>

                        <a name="btn-iniciar" id="btn-iniciar" class="btn btn-success" href="#" role="button">Iniciar</a>
                        <a name="btn-reiniciar" id="btn-reiniciar" class="btn btn-warning" href="#" role="button">Reiniciar</a>
                        <a name="btn-finalizar" id="btn-finalizar" class="btn btn-danger" href="#" role="button">Finalizar</a>
                    </div>
                </div>
            </div>

            <div class="col-md-4">
                <div class="card">
                    <div class="card-header">Usuários</div>

                    <div class="card-body">
                        <ul id="user-list">
                            <li>Sessão vazia. Distribua o código para os participantes entrarem!</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection
