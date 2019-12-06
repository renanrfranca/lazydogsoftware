<?php

use App\Sessao;
use App\User;

/*
|--------------------------------------------------------------------------
| Broadcast Channels
|--------------------------------------------------------------------------
|
| Here you may register all of the event broadcasting channels that your
| application supports. The given channel authorization callbacks are
| used to check if an authenticated user can listen to the channel.
|
*/

// Broadcast::channel('App.User.{id}', function ($user, $id) {
//     return (int) $user->id === (int) $id;
// });

Broadcast::channel('session.{id}', function (User $user, $id) {
    if (Auth::id() == 1) { // is admin
        return [
            'name' => 'admin',
            'id' => $user->id
        ];
    }

    if ($user->canJoinSession((int) $id)) {
        $user_data = [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'group_name' => $user->sessions->find($id)->pivot->nome_grupo,
            'pontuacao' => $user->sessions->find($id)->pivot->pontuacao,
        ];

        return $user_data;
    }
});
