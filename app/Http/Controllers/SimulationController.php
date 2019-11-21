<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Serie_futuro;
use App\News;
use Illuminate\Support\Carbon;

class SimulationController extends Controller
{
    public function index() {
        $first_date = Serie_futuro::oldest('data')->first()->data;
        session(['next_date' => $first_date]);
        session(['num_requests' => 0]);
        return view('dashboard');
    }

    public function getNewData() {
        $return = array();

        $date = session('next_date');
        $num_requests = session('num_requests');
        session(['num_requests' => $num_requests + 1]);

        // Recupera do banco os dados da primeira data maior ou igual a requisitada
        $values = Serie_futuro::oldest('data')->where('data', '>=', $date->toDateString())->first();

        if (!isset($values) || $num_requests > 5) {
            return '{"status": "fim"}';
        }

        $news = News::where('date', $values->data->toDateString())->first();

        // Pega data do valor retornado e increnta na sesão
        $date = Carbon::parse($values->data);
        session(['next_date' => $date->addDay()]);

        if (!empty($news)) {
            $return['news'] = [
                'date' => $news->date,
                'title' => $news->title
            ];
        }

        $return['values'] = $values;

        // Retorna valores
        return response()->json($return);
    }
}
