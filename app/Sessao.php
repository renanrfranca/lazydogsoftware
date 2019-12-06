<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Sessao extends Model
{
    protected $table = 'sessoes';

    public function users() {
        return $this->belongsToMany(User::class, 'users_sessoes')->withPivot('nome_grupo', 'pontuacao');
    }
}
