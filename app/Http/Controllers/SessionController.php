<?php

namespace App\Http\Controllers;

use App\Exercise;
use App\Sessao;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class SessionController extends Controller
{
    public function index($id)
    {
        $session = Sessao::findOrFail($id);

        $view_data = [
            'session' => $session
        ];

        return view('session', $view_data);
    }

    public function create(Request $request) {
        $exercise_id = $request->exercise;
        $exercise = Exercise::findOrFail($exercise_id);

        $session = new Sessao();
        $session->exercicio_id = $exercise->id;
        $session->save();

        return redirect()->route('session', ['id' => $session->id]);
    }

    public function join(Request $request) {
        $group_name = $request->nome;
        $session_id = $request->code;

        $session = Sessao::findOrFail($session_id);
    }
}
