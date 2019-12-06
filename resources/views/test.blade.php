@extends('layouts.app')

@section('content')
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-10">
                <div class="card">
                    <div class="card-body">
                        Test

                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
        var users;

        window.onload = function() {
            Echo.join(`session.{{$session->id}}`)
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
                });
        };
    </script>
@endsection
