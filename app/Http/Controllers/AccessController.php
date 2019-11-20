<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class AccessController extends Controller
{
 
    /**
     * enableUser enable a user. 
     * @param  \Illuminate\Http\Request  $request
     * @param  $id of the user to be enabled
     *
     * @return void\Illuminate\Http\Response success or error message
     */
    public function getMACAddress(Request $request)
    {

        $ip = $_SERVER['REMOTE_ADDR'];
        return $ip;
    }

}
