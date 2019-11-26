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
     * Reactive access code for use
     * @param  \Illuminate\Http\Request  $request
     * @param  \Illuminate\Http\Request  $code access code to be reactivated 
     * @return void\Illuminate\Http\Response  error or success message 
     */
    public function activateAccessCode(Request $request, $code){

        $updated_at = now();
        $active = 0;

        //save new merchant in the database
        try {
            DB::table('access')
            ->where('accesscode', $code)
            ->update(
                [
                    'active' => $active, 
                    'updated_at' => $updated_at
                ]
            );

            $message = 'Ok';
            return response()->json([
                'message' => $message
            ], 200);

        }catch(Exception $e) {
            $message = "Failed";
            return response()->json([
                'message' => $message
            ], 400);
        } 
              
    }

    /**
     * Deactivate an access code
     * @param  \Illuminate\Http\Request  $request
     * @param  \Illuminate\Http\Request  $code access code to be deactivated 
     * @return void\Illuminate\Http\Response error or success message
     */
    public function deactivateAccessCode(Request $request, $code){

        $updated_at = now();
        $active = 1;

        //save new merchant in the database
        try {
            DB::table('access')
            ->where('accesscode', $code)
            ->update(
                [
                    'active' => $active, 
                    'updated_at' => $updated_at
                ]
            );

            $message = 'Ok';
            return response()->json([
                'message' => $message
            ], 200);

        }catch(Exception $e) {
            $message = "Failed";
            return response()->json([
                'message' => $message
            ], 400);
        } 
              
    }

   /**
     * Check if access code is valid and active 
     * @param  \Illuminate\Http\Request  $request
     * @param  \Illuminate\Http\Request  $code access code provided by user
     * @return void\Illuminate\Http\Response error or success message
     */
    public function ValidateAccessCode(Request $request, $code)
    {
        $exist = DB::table('access')->where('accesscode', '=', $code)->first();
        if (isset($exist->id) && $exist->active ==0) 
        {
            //save access code in cookies for a year
            cookie('accesscode', $code, 525600);

            //deactivate access code in teg database 
            DB::table('access')->where('accesscode','=', $code)->update(['active' => 1]);

            //return success message
            $message = "Ok";
            return response()->json([
                'message' => $message
            ], 200); 
        }elseif (isset($exist->id) && $exist->active ==1) 
        {
            //return error message if user entered an access code that has already been used
            $message = "Access code already used";
            return response()->json([
                'message' => $message
            ], 400); 
        }else{

           //return error message if user entered an invalid access code 
           $message = "Invalid access code";
           return response()->json([
               'message' => $message
           ], 400);  
        }

    }

}
