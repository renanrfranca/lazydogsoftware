<?php

namespace App\Http\Controllers;

use App\Events\NewSeriesData;
use App\Sessao;
use Illuminate\Http\Request;
use App\Serie;
use App\News;
use Illuminate\Support\Carbon;
use Faker;

class SimulationController extends Controller
{
    public function index($session_id) {
        $session = Sessao::findOrFail($session_id);

        return view('dashboard', compact('session'));
    }

    public function getNewData() {
        $return = array();

        $date = session('next_date');
        $num_requests = session('num_requests');
        session(['num_requests' => $num_requests + 1]);

        // Recupera do banco os dados da primeira data maior ou igual a requisitada
        $values = Serie::oldest('data')->where('data', '>=', $date->toDateString())->first();

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

    public function feed(Request $request) {
        $session = Sessao::findOrFail($request->session_id);
        $date = Carbon::createFromDate(2012,01,02);
        $faker = Faker\Factory::create();

        $spot = Serie::where('exercicio_id', $session->exercicio_id)->where('tipo', 2)->orderBy('data')->get();
        $futuro = Serie::where('exercicio_id', $session->exercicio_id)->where('tipo', 1)->orderBy('data')->get();
        $news = News::where('exercicio_id', $session->exercicio_id)->orderBy('data')->get();


        for ($i = 0; $i < 35; $i++) {
            $data = [
                'news' => [
                    'date' => $date->toDateString(),
                    'title' => $news[$i]->titulo
                ],
                'values' => [
                    'data' => $date->toDateString(),
                    'abertura' => $spot[$i]->abertura,
                    'maxima' => $spot[$i]->maxima,
                    'minima' => $spot[$i]->minima,
                    'fechamento' => $spot[$i]->fechamento
                ],
                'values_futuro' => [
                    'data' => $date->toDateString(),
                    'abertura' => $futuro[$i]->abertura,
                    'maxima' => $futuro[$i]->maxima,
                    'minima' => $futuro[$i]->minima,
                    'fechamento' => $futuro[$i]->fechamento
                ]
            ];

            broadcast(new newSeriesData($session, $data));

            $date->addDay();

            sleep(5);
        }

        broadcast(new newSeriesData($session, 'fim'));
    }
}
