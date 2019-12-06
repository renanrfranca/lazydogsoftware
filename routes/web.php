<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

// Route::get('/', 'SimulationController@index')->name('simulation');
Route::get('/getdados', 'SimulationController@getNewData')->name('getNewData');

Auth::routes();

Route::redirect('/home', '/');
Route::get('/', 'HomeController@index')->name('home');

Route::get('/admin', 'AdminController@index')->name('admin')->middleware('admin');

Route::post('/session', 'SessionController@create')->name('session.create')->middleware('admin');
Route::get('/session/{id}', 'SessionController@index')->name('session')->middleware('admin');
Route::post('/simulation/start', 'SimulationController@feed')->name('simulation.start')->middleware('admin');

Route::post('/session/join', 'SessionController@join')->name('session.join')->middleware('auth');
Route::get('/simulation/{session_id}', 'SimulationController@index')->name('simulation')->middleware('auth');
