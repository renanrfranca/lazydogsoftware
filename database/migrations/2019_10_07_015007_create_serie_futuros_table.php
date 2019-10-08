<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSerieFuturosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('serie_futuros', function (Blueprint $table) {
            $table->date('data')->primary();
            $table->decimal('fechamento');
            $table->decimal('abertura');
            $table->decimal('minima');
            $table->decimal('maxima');
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
