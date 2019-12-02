@extends('layouts.app')

@section('content')
<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-8">
            <div class="card">
                <div class="card-header">Entre em uma sessão</div>

                <div class="card-body">
                    <form action="{{route('session.join')}}" method="POST">
                        @csrf
                        <div class="form-group">
                            <label for="nome">Nome do grupo</label>
                            <input type="text" class="form-control" id="nome" name="nome" placeholder="Informe o nome do grupo">
                        </div>
                        <div class="form-group">
                            <label for="session-code">Código da sessão</label>
                            <input type="password" class="form-control" id="code" name="code" placeholder="Informe o código da sessão fornecido pelo administrador">
                        </div>
                        <button type="submit" class="btn btn-primary">Entrar</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
