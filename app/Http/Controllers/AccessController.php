<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Crypt;
use Response;
use Cookie;
use Illuminate\Support\Facades\Log;
class AccessController extends Controller
{
 
     /**
     * getAllCodes get all access codes in the database: active or inactive
     *
     * @param  mixed $request
     * @return [json] all access codes in the database 
     */
    public function getAllCodes(Request $request){

        //get all registered companies 
        $getaccesscodes = DB::table('access')
        ->leftjoin('merchants', 'merchants.id', '=', 'merchant_id')
        ->leftjoin('company_branches', 'company_branches.id', '=', 'branch_id')
        ->select('access.*','merchants.merchant_name AS merchant_name', 'merchants.nickname','company_branches.branchname AS branch_name')
       ->paginate(15);

        //clean data
        $accesscodesdata = [];

        $getaccesscodes->transform(function($items){
            $accesscodesdata['code_id'] = $items->id;
            $accesscodesdata['devicename'] =$items->devicename;
            $accesscodesdata['sourceusage'] = $items->sourceusage;
            $accesscodesdata['merchant_id'] = $items->merchant_id;
            $accesscodesdata['merchant_name'] = empty($items->merchant_name) ? '' : Crypt::decryptString($items->merchant_name);
            $accesscodesdata['nickname'] = $items->nickname;
            $accesscodesdata['branch_id'] = $items->branch_id;
            $accesscodesdata['branch_name'] = empty($items->branch_name) ? '' : Crypt::decryptString($items->branch_name); 
            $accesscodesdata['accesscode'] = $items->accesscode;
            $accesscodesdata['active'] = $items->active;
            $accesscodesdata['created_at'] = $items->created_at;
            $accesscodesdata['updated_at'] = $items->updated_at;
            $accesscodesdata['created_by'] = $items->created_by;
           
            return $accesscodesdata;
         });

         $response = [
            'codes' => $getaccesscodes
        ];
        return response()->json($response, 200);
   }

 /**
     * getAccessCodesByStatus get access codes by status
     *
     * @param  mixed $request
     * @return [json] all access codes matching status in the database 
     */
    public function getAccessCodesByStatus(Request $request, $active){

        //get all registered companies 
        $getaccesscodes = DB::table('access')
        ->leftjoin('merchants', 'merchants.id', '=', 'merchant_id')
        ->leftjoin('company_branches', 'company_branches.id', '=', 'branch_id')
        ->select('access.*','merchants.merchant_name AS merchant_name', 'merchants.nickname', 'company_branches.branchname AS branch_name')
        ->where('active', $active)
       ->paginate(15);

        //clean data
        $accesscodesdata = [];

        $getaccesscodes->transform(function($items){
            $accesscodesdata['code_id'] = $items->id;
            $accesscodesdata['devicename'] =$items->devicename;
            $accesscodesdata['sourceusage'] = $items->sourceusage;
            $accesscodesdata['merchant_id'] = $items->merchant_id;
            $accesscodesdata['merchant_name'] = empty($items->merchant_name) ? '' : Crypt::decryptString($items->merchant_name);
            $accesscodesdata['nickname'] = $items->nickname;
            $accesscodesdata['branch_id'] = $items->branch_id;
            $accesscodesdata['branch_name'] = empty($items->branch_name) ? '' : Crypt::decryptString($items->branch_name); 
            $accesscodesdata['accesscode'] = $items->accesscode;
            $accesscodesdata['active'] = $items->active;
            $accesscodesdata['created_at'] = $items->created_at;
            $accesscodesdata['updated_at'] = $items->updated_at;
            $accesscodesdata['created_by'] = $items->created_by;
           
            return $accesscodesdata;
         });

         $response = [
            'codes' => $getaccesscodes
        ];
        return response()->json($response, 200);
   }


   /**
     * getAccessCodesDetails get all details of an access code 
     * @param  mixed $request
     * @param  mixed $code access code being searched
     * @return [json] access codes matching the searched code
     */
    public function getAccessCodesDetails(Request $request, $code){

        //get all registered companies 
        $getaccesscode = DB::table('access')
        ->leftjoin('merchants', 'merchants.id', '=', 'merchant_id')
        ->leftjoin('company_branches', 'company_branches.id', '=', 'branch_id')
        ->select('access.*','merchants.merchant_name AS merchant_name','merchants.nickname','company_branches.branchname AS branch_name')
        ->where('accesscode', $code)
       ->get();

        //clean data
        $accesscodesdata = [];

        $getaccesscode->transform(function($items){
            $accesscodesdata['code_id'] = $items->id;
            $accesscodesdata['devicename'] =$items->devicename;
            $accesscodesdata['sourceusage'] = $items->sourceusage;
            $accesscodesdata['merchant_id'] = $items->merchant_id;
            $accesscodesdata['merchant_name'] = empty($items->merchant_name) ? '' : Crypt::decryptString($items->merchant_name);
            $accesscodesdata['nickname'] = $items->nickname;
            $accesscodesdata['branch_id'] = $items->branch_id;
            $accesscodesdata['branch_name'] = empty($items->branch_name) ? '' : Crypt::decryptString($items->branch_name); 
            $accesscodesdata['accesscode'] = $items->accesscode;
            $accesscodesdata['active'] = $items->active;
            $accesscodesdata['created_at'] = $items->created_at;
            $accesscodesdata['updated_at'] = $items->updated_at;
            $accesscodesdata['created_by'] = $items->created_by;
           
            return $accesscodesdata;
         });

         $response = [
            'code' => $getaccesscode
        ];
        return response()->json($response, 200);
   }


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
        if($request->has('merchant_id'))
        {
            $merchant_id = $request->merchant_id;

        }else{
            $merchant_id =0;
        }

        if($request->has('branch_id'))
        {
            $branch_id = $request->branch_id;

        }else{
            $branch_id =0;
        }

        // $merchant_id = $request->merchant_id;
        // $branch_id = $request->branch_id;
        //generate 6 digit access code
        $access_code = rand(100000, 999999);
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

            Log::channel('mysql')->info('User  with id: ' . $userid .' successfully created an access code');
            $message = $access_code;
            return response()->json([
                'code' => $message
            ]);

        }catch(Exception $e) {
            Log::channel('mysql')->error('User  with id: ' . $userid .' unsuccessfully created an access code');
            $message = "Failed";
            return response()->json([
                'message' => $message
            ]);
        } 
        
    }

    /**
     * activateAccessCode Reactive an access code for use
     * @param  \Illuminate\Http\Request  $request
     * @param  \Illuminate\Http\Request  $code access code to be reactivated 
     * @return void\Illuminate\Http\Response  error or success message 
     */
    public function activateAccessCode(Request $request, $code){

        $updated_at = now();
        $active = 0;

         //get user creating the new access code
         $user = $request->user();
         $userid = $user['id'];

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

            Log::channel('mysql')->info('User  with id: ' . $userid .' successfully reactivated an access code');
            $message = 'Ok';
            return response()->json([
                'message' => $message
            ], 200);

        }catch(Exception $e) {
            Log::channel('mysql')->error('User  with id: ' . $userid .' unsuccessfully reactivated an access code');
            $message = "Failed";
            return response()->json([
                'message' => $message
            ], 400);
        } 
              
    }

    /**
     * deactivateAccessCode Deactivate an access code
     * @param  \Illuminate\Http\Request  $request
     * @param  \Illuminate\Http\Request  $code access code to be deactivated 
     * @return void\Illuminate\Http\Response error or success message
     */
    public function deactivateAccessCode(Request $request, $code){

        $updated_at = now();
        $active = 1;
        //get user creating the new access code
        $user = $request->user();
        $userid = $user['id'];
        
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
            Log::channel('mysql')->info('User  with id: ' . $userid .' successfully deactivated an access code');

            $message = 'Ok';
            return response()->json([
                'message' => $message
            ], 200);

        }catch(Exception $e) {
            Log::channel('mysql')->error('User  with id: ' . $userid .' unsuccessfully deactivated an access code');
            $message = "Failed";
            return response()->json([
                'message' => $message
            ], 400);
        } 
              
    }

   /**
     * ValidateAccessCode  Check if access code is valid and active 
     * @param  \Illuminate\Http\Request  $request
     * @param  \Illuminate\Http\Request  $code access code provided by user
     * @return void\Illuminate\Http\Response error or success message
     */
    public function ValidateAccessCode(Request $request, $code)
    {
        $exist = DB::table('access')->where('accesscode', '=', $code)->first();
        if (isset($exist->id) && $exist->active ==0) 
        {
            //Create a response instance
            $response = response([
                'message'=>'Ok']);

            //deactivate access code in teg database 
            DB::table('access')->where('accesscode','=', $code)->update(['active' => 1]);
            
            //Call the withCookie() method with the response method
            $response->withCookie(cookie('accesscode', $code, 525600));
            // return $request->cookie('accesscode');

            return $response;

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

    /**
     * deleteAccessCode delete an access code in the db
     * @param  mixed $request
     * @param  mixed $id
     * @return \Illuminate\Http\Response success or error message
     */
     public function deleteAccessCode(Request $request, $id){

        //get user creating the new merchant
        $user = $request->user();
        $userid = $user['id'];

        try {

            DB::table('accesscode')
            ->where('id', $id)
            ->delete();

            $message = 'Ok';
            Log::channel('mysql')->info('User with id: ' . $userid .' successsfully deleted an access code with id '. $id);

        }catch(Exception $e) {
            Log::channel('mysql')->error('User with id: ' . $userid .' unsuccesssfully deleted an access code with id '. $id);
            $message = "Failed";
        } 
            
        return response()->json([
            'message' => $message
        ]);

    }


}
