@extends('layouts.app')

@section('content')
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-8">
                <div class="card">
                    <div class="card-header">Dashboard</div>

                    <div class="card-body">
                        <form action="{{route('session.create')}}" method="POST">
                            @csrf
                            <div class="row">
                                <div class="form-group col-md-4">
                                    <select name="exercise" id="exercise" class="form-control">
                                        <option hidden>Selecione um exercício</option>
                                        @foreach($exercises as $exercise)
                                            <option value="{{$exercise->id}}">
                                                {{$exercise->titulo}}
                                            </option>
                                        @endforeach
                                    </select>
                                </div>
                                <div class="col-md-4">
                                    <button class="btn btn-primary">Criar sessão</button>
                                </div>
                            </div>
                        </form>

                        <table class="table">
                            <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Criada em</th>
                                <th scope="col">Status</th>
                                <th scope="col">Ações</th>
                            </tr>
                            </thead>
                            <tbody>
                                @foreach($sessions as $session)
                                    <tr>
                                        <th scope="row">{{$session->id}}</th>
                                        <td>{{$session->created_at}}</td>
                                        <td>Ativa</td>
                                        <td><a href="{{route('session', ['id' => $session->id])}}" class="btn btn-primary">Gerenciar</a></td>
                                    </tr>
                                @endforeach
                            </tbody>
                        </table>

                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection
