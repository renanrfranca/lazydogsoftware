<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Serie_futuro extends Model
{
    protected $table = 'serie_futuros';
    protected $primaryKey = 'data';
    protected $keyType = 'string';
    protected $dates = ['data'];

    public $incrementing = false;
    public $timestamps = false;


}
