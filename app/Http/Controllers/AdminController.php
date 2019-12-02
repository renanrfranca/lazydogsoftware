<?php

namespace App\Http\Controllers;

use App\Sessao;
use Illuminate\Http\Request;
use App\Exercise;

class AdminController extends Controller
{
    public function index()
    {
        $exercises = Exercise::all();

        $sessions = Sessao::all()->sortBy('id', SORT_DESC);

        $view_data = [
            'exercises' => $exercises ?? [],
            'sessions' => $sessions ?? []
        ];

        return view('admin', $view_data);
    }
}
