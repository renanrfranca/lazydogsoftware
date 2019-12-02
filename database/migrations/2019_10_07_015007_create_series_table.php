<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSeriesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('series', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('exercicio_id');
            $table->date('data');
            $table->unsignedTinyInteger('tipo')->comment('1 = futuro, 2 = spot');
            $table->decimal('fechamento');
            $table->decimal('abertura');
            $table->decimal('minima');
            $table->decimal('maxima');

            $table->index(['exercicio_id', 'data']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('serie_futuros');
    }
}
