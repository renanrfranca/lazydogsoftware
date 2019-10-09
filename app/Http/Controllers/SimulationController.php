<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Serie_futuro;
use Illuminate\Support\Carbon;

class SimulationController extends Controller
{
    public function index() {
        $first_date = Serie_futuro::oldest('data')->first()->data;
        session(['next_date' => $first_date]);
        return view('dashboard');
    }

    public function getNewData() {
        $date = session('next_date');

        // Recupera do banco os dados da primeira data maior ou igual a requisitada
        $values = Serie_futuro::oldest('data')->where('data', '>=', $date->toDateString())->first();

        // Pega data do valor retornado e increnta na sesão
        $date = Carbon::parse($values->data);
        session(['next_date' => $date->addDay()]);

        // Retorna valores
        return $values->toJSON();
    }
}
