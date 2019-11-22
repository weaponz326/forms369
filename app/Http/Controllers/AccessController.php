<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AccessController extends Controller
{
 
    /**
     * createAccessCode GIT admin create an access code 
     * @param  \Illuminate\Http\Request  $request
     * @return void\Illuminate\Http\Response access code
     */
    public function createAccessCode(Request $request){

        $this->validate($request, [
            'device_name' => 'required',
            'source_usage' => 'required',
            'merchant_id' => 'required'
        ]);

        $device_name = $request->device_name;
        $source_usage = $request->source_usage; 
        $merchant_id = $request->merchant_id;
        $branch_id = $request->branch_id;
        $access_code = rand();
        $active = 0;
        $created_at = now();

         //get user creating the new access code
         $user = $request->user();
         $userid = $user['id'];

         //save new access code in the database
         try {
            $id = DB::table('access')->insert(
                [
                    'merchant_id' => $merchant_id, 
                    'devicename' => $device_name, 
                    'active' => $active, 
                    'branch_id' => $branch_id,
                    'created_by' => $userid, 
                    'created_at' => $created_at,
                    'accesscode' => $access_code,
                    'sourceusage' => $source_usage
                ]
            );


            $message = $access_code;
            return response()->json([
                'code' => $message
            ]);

        }catch(Exception $e) {
            $message = "Failed";
            return response()->json([
                'message' => $message
            ]);
        } 
        
    }


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
