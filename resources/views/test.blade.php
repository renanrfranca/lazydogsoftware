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

        window.onload = function() {
            Echo.private(`session.{{$session->id}}`)
                .listen('NewSeriesData', (e) => {
                    console.log(e.session);
                });
        };
    </script>
@endsection
