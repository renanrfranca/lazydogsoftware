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
                    </div>
                </div>
            </div>

            <div class="col-md-4">
                <div class="card">
                    <div class="card-header">Usuários</div>

                    <div class="card-body">
                        <ul id="user-list">
                            <li>Carregando usuários conectados...</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
        var users;

        window.onload = function () {
            Echo.join(`session.{{$session->id}}`)
                .here((users) => {
                    this.users = users;
                    console.log(this.users);
                    this.updateUsersList();
                })
                .joining((user) => {
                    console.log(user.name);
                    this.users.push(user);
                    this.updateUsersList();
                })
                .leaving((user) => {
                    console.log(user.name);
                    this.users = this.users.filter(u => (u.id !== user.id));
                    this.updateUsersList();
                })
                .listen('NewSeriesData', (e) => {
                    console.log(e);
                });

            $("#btn-iniciar").click(function () {
                var data = {
                    "_token": "{{ csrf_token() }}",
                    "session_id": '{{$session->id}}'
                };

                $("#btn-iniciar").prop('disabled', true);
                $("#btn-iniciar").text('Em andamento...');
                $.post('{{route('simulation.start')}}', data, function () {
                    $("#btn-iniciar").text('Iniciar');
                    $("#btn-iniciar").prop('disabled', false);
                    alert('Finalizado');
                });
            });
        };

        function updateUsersList() {
            if (users.length == 1) {
                $("#user-list").html('<li>Sessão vazia. Distribua o código para os participantes entrarem!</li>');
                return;
            }

            var list = '';
            users.forEach(function (user) {
                if (user.name != 'admin')
                    list = list + '<li><b>' + user.group_name + '</b> - ' + user.email + '</li>'
            });
            $("#user-list").html(list);
        }
    </script>
@endsection
