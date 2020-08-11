<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use Illuminate\Support\Carbon;

use Illuminate\Support\Facades\Crypt;

use DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\File;
use Illuminate\Contracts\Support\Jsonable;
use Illuminate\Support\Facades\Log;
use Response;
use App\Notifications\SuggestMerchantSlackNotification;
use Notification;
class SetupController extends Controller
{

    /**
     * uploadPrintFile Upload original form document for printing
     *
     * @param  mixed $request
     *
     * @return \Illuminate\Http\Response success or error message
     */
     public function uploadPrintFile(Request $request, $merchant_id, $form_code){
        
        $this->validate($request, [
            'file' => 'required|mimes:pdf'
        ]);

        $file = $request->file('file');
        $filename = $file->getClientOriginalName();
    
        $url=$merchant_id.'_'.$form_code.'.pdf';
        $upload =  File::move($_FILES['file']['tmp_name'], public_path('storage/files/'.$url ));
        // $upload=Storage::disk('local')->put('files/'.$url,  File::get($file));
        $uploaded_at = now();
        $message = 'Failed';

        if($upload){
            try {
                $id = DB::table('uploads')->insertGetId(
                    [
                        'url' => $url, 
                        'uploaded_at' => $uploaded_at,
                        'merchant_id' => $merchant_id,
                        'form_code' => $form_code
                    ]
                );
    
                 //get user creating the new merchant
                $user = $request->user();
                $userid = $user['id'];

                Log::channel('mysql')->info('User with id: ' . $userid .' successsfully uploaded a print document for merchant with id: '. $merchant_id);
                $message = 'Ok';
    
            }catch(Exception $e) {
                Log::channel('mysql')->info('User with id: ' . $userid .' unsuccesssfully uploaded a print document for merchant with id: '. $merchant_id);
                $message = "Failed";
            } 
        }
        return response()->json([
            'message' => $message
        ]);
    }


    /**
     * editPrintFile Edit original form document for printing
     *
     * @param  mixed $request
     *
     * @return \Illuminate\Http\Response success or error message
     */
     public function editPrintFile(Request $request, $merchant_id, $form_code){
        
        $this->validate($request, [
            'file' => 'required|mimes:pdf'
        ]);

        $file = $request->file('file');
        $filename = $file->getClientOriginalName();
    
        $url=$merchant_id.'_'.$form_code.'.pdf';
        $upload=Storage::disk('local')->put('files/'.$url,  File::get($file));
        $updated_at = now();
        $message = 'Failed';

        if($upload){
            try {
                $attached = DB::table('uploads')
                ->where('form_code', $form_code)
                ->where('merchant_id', $merchant_id)
                ->first();

                // return $attached;
                if(!empty($attached)){
                    DB::table('uploads')
                        ->where([
                            ['form_code', '=', $form_code],
                            ['merchant_id', '=', $merchant_id]
                        ])->update(
                        [
                            'url' => $url, 
                            'updated_at' => $updated_at
                        ]
                    );
                }else{
                    $id = DB::table('uploads')->insertGetId(
                        [
                            'url' => $url, 
                            'uploaded_at' => $updated_at,
                            'merchant_id' => $merchant_id,
                            'form_code' => $form_code
                        ]
                    );
                }
    
                 //get user creating the new merchant
                $user = $request->user();
                $userid = $user['id'];

                Log::channel('mysql')->info('User with id: ' . $userid .' successsfully editted a print document for merchant with id: '. $merchant_id);
                $message = 'Ok';
    
            }catch(Exception $e) {
                Log::channel('mysql')->info('User with id: ' . $userid .' unsuccesssfully editted a print document for merchant with id: '. $merchant_id);
                $message = "Failed";
            } 
        }
        return response()->json([
            'message' => $message
        ]);
    }

    /**
     * getPrintFile get original form document for printing
     *
     * @param  mixed $request
     *
     * @return \Illuminate\Http\Response success or error message
     */
    public function getPrintFile(Request $request, $merchant_id, $form_code)
    {
        //get all registered companies 
        $getfile = DB::table('uploads')->
        where([
            ['merchant_id', '=', $merchant_id],
            ['form_code', '=', $form_code]
            ])->first();

        $response = [
        'file' => $getfile
        ];
        return response()->json($response, 200);
    }
        
    
    /**
     * createMerchant create a new merchant
     *
     * @param  mixed $request
     *
     * @return \Illuminate\Http\Response success or error message
     */
    public function createMerchant(Request $request){
        
        $this->validate($request, [
            'merchant_name' => 'required|unique:merchants',
            'country' => 'required',
            'super_id'=>'required',
            'admin_id'=>'required',
            'logo' => 'required|mimes:jpeg,jpg,png,gif,psd,tiff',
            'small_logo' => 'nullable|mimes:jpeg,jpg,png,gif,psd,tiff',
            'can_print' => 'required',
            'sector_id' => 'required',
            'nickname' => 'required',
            'colors' => 'required'
        ]);

        $logo = NULL;
        $small_logo = NULL;
        //upload logo to storage folder and save file name in the database 
        if($request->hasFile('logo'))
        {
            $image = $request->file('logo');
            $filename = $image->getClientOriginalName();
            $extension = $image->getClientOriginalExtension();

            $current_date_time = Carbon::now()->toDateTimeString(); // Produces something like "2019-03-11 12:25:00"
            $url=$image->getFilename().'_'.$current_date_time.'.'.$extension;
            $url = str_replace(':', '_', $url);
            $upload =  File::move($_FILES['logo']['tmp_name'], public_path('storage/'.$url ));
            // $upload=Storage::disk('local')->put($url,  File::get($image));
            if($upload)
            {
                $logo = $url;
                    // return Response::json($url);
            }else{
                return Response::json('Logo upload unsuccessful');
            }
        }


        //upload small logo to storage folder and save file name in the database 
        if($request->hasFile('small_logo'))
        {
            $image = $request->file('small_logo');
            $filename = $image->getClientOriginalName();
            $extension = $image->getClientOriginalExtension();

            $current_date_time = Carbon::now()->toDateTimeString(); // Produces something like "2019-03-11 12:25:00"
            $url=$image->getFilename().'_'.$current_date_time.'.'.$extension;
            $upload=Storage::disk('local')->put($url,  File::get($image));
            if($upload)
            {
                $small_logo = $url;
                    //return Response::json($url);
            }else{
                return Response::json('Small logo upload unsuccessful');
            }
        }

        $name = Crypt::encryptString($request->merchant_name);
        $temp = $request->merchant_name;
        $country = $request->country;
        $super_id = $request->super_id;
        $admin_id = $request->admin_id;
        $status = 1;
        $created_at = now();
        $can_print = $request->can_print;
        $sector_id = $request->sector_id;
        $nickname = $request->nickname;
        $physical_address = $request->physical_address;
        $colors = $request->colors;
        $enabled_qms = $request->enabled_qms;
        // $client_id = $request->client_id;
        // $client_secret = $request->$client_secret;

        //get user creating the new merchant
        $user = $request->user();
        $userid = $user['id'];

        if($userid == NULL)
            $userid = 0;

        
        //save new merchant in the database
         try {
            $id = DB::table('merchants')->insertGetId(
                [
                    'merchant_name' => $name, 
                    'status' => $status, 
                    'country' => $country, 
                    'logo' => $logo,
                    'small_logo' => $small_logo,
                    'super_id' => $super_id,
                    'admin_id' => $admin_id, 
                    'created_at' => $created_at,
                    'created_by' => $userid,
                    'can_print' => $can_print,
                    'temp' => $temp,
                    'sector_id'=> $sector_id,
                    'nickname' => $nickname,
                    'physical_address' => $physical_address,
                    'colors' => $colors,
                    // 'enabled_qms' => $enabled_qms,
                    // 'client_id' => $client_id,
                    // 'client_secret' => $client_secret
                ]
            );

            //update admin merchant_id column in the users table
            DB::table('users')
            ->where('id', $admin_id)
            ->update(
                [
                    'merchant_id' => $id, 
                    'updated_at' => $created_at
                ]
            );

            //update super executive merchant_id column in the users table
            DB::table('users')
            ->where('id', $super_id)
            ->update(
                [
                    'merchant_id' => $id, 
                    'updated_at' => $created_at
                ]
            );
            Log::channel('mysql')->info('User with id: ' . $userid .' successsfully created new merchant with id: '. $id);
            $message = 'Ok';

        }catch(Exception $e) {
            Log::channel('mysql')->error('User with id: ' . $userid .' unsuccesssfully created new merchant with id: '. $id);
            $message = "Failed";
        } 
            
        return response()->json([
            'message' => $message
        ]);

    }

     /**
     * suggestMerchant create a suggested merchant by a client
     *
     * @param  mixed $request
     *
     * @return \Illuminate\Http\Response success or error message
     */
     public function suggestMerchant(Request $request){
        
        $this->validate($request, [
            'merchant_name' => 'required|unique:merchants',
            'country' => 'required'
        ]);

    
        $name = $request->merchant_name;
        $country = $request->country;

        //get user creating the new merchant
        $user = $request->user();
        $userid = $user['id'];

        if($userid == NULL)
            $userid = 0;

        
        //save new merchant in the database
         try {
            $id = DB::table('suggested_merchants')->insertGetId(
                [
                    'merchant_name' => $name, 
                    'country' => $country,
                ]
            );

            Notification::route('slack', env('SLACK_HOOK'))->notify(new SuggestMerchantSlackNotification($name, $country));

            Log::channel('mysql')->info('User with id: ' . $userid .' successsfully suggested ' . $name . ' as a new merchant.');
            $message = 'Ok';

        }catch(Exception $e) {
            Log::channel('mysql')->error('User with id: ' . $userid .' unsuccesssfully suggested ' . $name . ' as a new merchant.');
            $message = "Failed";
        } 
            
        return response()->json([
            'message' => $message
        ]);

    }

    /**
     * getAllSuggestedMerchants get all suggested merchants in the db
     *
     * @param  mixed $request
     *
     * @return void\Illuminate\Http\Response all template categories data
     */
     public function getAllSuggestedMerchants(Request $request){

        //get all template categories 
        $getsuggestedmerchants = DB::table('suggested_merchants')->get();

         $response = [
            'suggested_merchants' => $getsuggestedmerchants
        ];
        return response()->json($response, 200);

    }

    /**
     * editMerchant edit a merchant 
     *
     * @param  mixed $request
     * @param  mixed $id of the merchnat to be editted
     *
     * @return \Illuminate\Http\Response success or error message
     */
    public function editMerchant(Request $request, $id){
        
        $this->validate($request, [
            'merchant_name' => 'required',
            'country' => 'required',
            'super_id'=>'required',
            'admin_id'=>'required',
            'logo' => 'required',
            'can_print' => 'required',
            'status' => 'required',
            'sector_id' => 'required',
            'nickname' => 'required',
            'colors' => 'required'
        ]); 

        $name = Crypt::encryptString($request->merchant_name);
        $country = $request->country;
        $super_id = $request->super_id;
        $admin_id = $request->admin_id;
        $status = $request->status;
        $updated_at = now();
        $logo = $request->logo;
        $small_logo = $request->small_logo;
        $can_print = $request->can_print;
        $temp = $request->merchant_name;
        $sector_id = $request->sector_id;
        $nickname = $request->nickname;
        $physical_address = $request->physical_address;
        $colors = $request->colors;
        $enabled_qms = $request->enabled_qms;
        // $client_id = $request->client_id;
        // $client_secret = $request->$client_secret;


        //get user creating the new merchant
        $user = $request->user();
        $userid = $user['id'];

        if($userid == NULL)
            $userid = 0;

        
        //save new merchant in the database
         try {

            DB::table('merchants')
            ->where('id', $id)
            ->update(
                [
                    'merchant_name' => $name, 
                    'status' => $status, 
                    'country' => $country, 
                    'logo' => $logo,
                    'small_logo' => $small_logo,
                    'super_id' => $super_id,
                    'admin_id' => $admin_id, 
                    'updated_at' => $updated_at,
                    'updated_by' => $userid,
                    'can_print' => $can_print,
                    'temp' => $temp,
                    'sector_id' => $sector_id,
                    'nickname' => $nickname,
                    'physical_address' => $physical_address,
                    'colors' => $colors,
                    // 'enabled_qms' => $enabled_qms,
                    // 'client_id' => $client_id,
                    // 'client_secret' => $client_secret
                ]
            );

            //update admin merchant_id column in the users table
            DB::table('users')
            ->where('id', $admin_id)
            ->update(
                [
                    'merchant_id' => $id, 
                    'updated_at' => $updated_at
                ]
            );

            //update super executivr merchant_id column in the users table
            DB::table('users')
            ->where('id', $super_id)
            ->update(
                [
                    'merchant_id' => $id, 
                    'updated_at' => $updated_at
                ]
            );

            $message = 'Ok';
            Log::channel('mysql')->info('User with id: ' . $userid .' successsfully editted merchant with id: '. $id);

        }catch(Exception $e) {
            Log::channel('mysql')->error('User with id: ' . $userid .' unsuccesssfully editted merchant with id: '. $id);
            $message = "Failed";
        } 
            
        return response()->json([
            'message' => $message
        ]);

    }

    


    /**
     * createCompanyBranches create a new company branch
     *
     * @param  mixed $request
     *
     * @return \Illuminate\Http\Response success or error message
     */
    public function createCompanyBranches(Request $request){

        $this->validate($request, [
            'branch_name' => 'required',
            'merchant_id' => 'required',
            'branch_super_id'=>'required',
            'branch_admin_id'=>'required',
        ]);

        $name = Crypt::encryptString($request->branch_name);
        $merchant_id = $request->merchant_id;
        $branch_super_id = $request->branch_super_id;
        $branch_admin_id = $request->branch_admin_id;
        $status = 1;
        $created_at = now();
        $physical_address = $request->physical_address;
        $branch_ext = $request->branch_ext;

        //get user creating the new merchant
        $user = $request->user();
        $userid = $user['id'];

         //save new merchant in the database
         try {
            $id = DB::table('company_branches')->insertGetId(
                [
                    'merchant_id' => $merchant_id, 
                    'branchname' => $name, 
                    'status' => $status, 
                    'branch_super_id' => $branch_super_id,
                    'created_by' => $userid, 
                    'created_at' => $created_at,
                    'branch_admin_id' => $branch_admin_id,
                    'physical_address' => $physical_address,
                    'branch_ext' => $branch_ext
                ]
            );

             //update branch amin merchant_id and branch id column in the users table
             DB::table('users')
             ->where('id', $branch_admin_id)
             ->update(
                 [
                     'merchant_id' => $merchant_id, 
                     'branch_id' => $id,
                     'updated_at' => $created_at
                 ]
             );
 
             //update branch super executivr merchant_id and branch id column in the users table
             DB::table('users')
             ->where('id', $branch_super_id)
             ->update(
                 [
                    'merchant_id' => $merchant_id, 
                    'branch_id' => $id,
                    'updated_at' => $created_at
                 ]
             );

            $message = 'Ok';
            Log::channel('mysql')->info('User with id: ' . $userid .' successsfully created new branch with id: '. $id);

        }catch(Exception $e) {
            Log::channel('mysql')->info('User with id: ' . $userid .' unsuccesssfully created new branch with id: '. $id);
            $message = "Failed";
        } 
            
        return response()->json([
            'message' => $message
        ]);

    }


    /**
     * editCompanyBranches edit a company branch
     *
     * @param  mixed $request
     * @param  mixed $id of the branch to be editted
     *
     * @return \Illuminate\Http\Response success or error message
     */
    public function editCompanyBranches(Request $request, $id){

        $this->validate($request, [
            'branch_name' => 'required',
            'merchant_id' => 'required',
            'branch_super_id'=>'required',
            'branch_admin_id'=>'required',
            'status' => 'required'
        ]);

        $name = Crypt::encryptString($request->branch_name);
        $merchant_id = $request->merchant_id;
        $branch_super_id = $request->branch_super_id;
        $branch_admin_id = $request->branch_admin_id;
        $status = $request->status;
        $updated_at = now();
        $physical_address = $request->physical_address;
        $branch_ext = $request->branch_ext;

        //get user creating the new merchant
        $user = $request->user();
        $userid = $user['id'];

         //save new merchant in the database
         try {
            DB::table('company_branches')
            ->where('id', $id)
            ->update(
                [
                    'merchant_id' => $merchant_id, 
                    'branchname' => $name, 
                    'status' => $status, 
                    'branch_super_id' => $branch_super_id,
                    'updated_by' => $userid, 
                    'updated_at' => $updated_at,
                    'branch_admin_id' => $branch_admin_id,
                    'status' => $status,
                    'physical_address' => $physical_address,
                    'branch_ext' => $branch_ext
                ]
            );


             //update branch amin merchant_id and branch id column in the users table
             DB::table('users')
             ->where('id', $branch_admin_id)
             ->update(
                 [
                     'merchant_id' => $merchant_id, 
                     'branch_id' => $id,
                     'updated_at' => $updated_at
                 ]
             );
 
             //update branch super executivr merchant_id and branch id column in the users table
             DB::table('users')
             ->where('id', $branch_super_id)
             ->update(
                 [
                    'merchant_id' => $merchant_id, 
                    'branch_id' => $id,
                    'updated_at' => $updated_at
                 ]
            ); 

            $message = 'Ok';
            Log::channel('mysql')->info('User with id: ' . $userid .' successsfully editted branch with id: '. $id);

        }catch(Exception $e) {
            Log::channel('mysql')->info('User with id: ' . $userid .' unsuccesssfully editted branch with id: '. $id);
            $message = "Failed";
        } 
            
        return response()->json([
            'message' => $message
        ]);

    }

    /**
     * createUserType create a new user type 
     *
     * @param  mixed $request
     *
     * @return \Illuminate\Http\Response success or error message
     */
    public function createUserType(Request $request){

        $this->validate($request, [
            'name' => 'required',
            'id' => 'required'
        ]);

        $name = $request->name;
        $id = $request->id;

        $created_at = now();

        //get user creating the new merchant
        $user = $request->user();
        $userid = $user['id'];

        try {
            DB::table('user_types')->insertGetId(
                [
                    'id' => $id, 
                    'name' => $name, 
                    'created_by' => $userid, 
                    'created_at' => $created_at
                ]
            );

            $message = 'Ok';
            Log::channel('mysql')->info('User with id: ' . $userid .' successsfully created a new user type');

        }catch(Exception $e) {
            Log::channel('mysql')->error('User with id: ' . $userid .' unsuccesssfully created a new user type');
            $message = "Failed";
        } 
            
        return response()->json([
            'message' => $message
        ]);

    }

    /**
     * editUserType edit a user type 
     *
     * @param  mixed $request
     * @param  mixed $id of the user type to be editted
     *
     * @return \Illuminate\Http\Response success or error message
     */
    public function editUserType(Request $request){

        $this->validate($request, [
            'name' => 'required',
            'id' => 'required'
        ]);

        $name = $request->name;
        $id = $request->id;

        $updated_at = now();

        //get user creating the new merchant
        $user = $request->user();
        $userid = $user['id'];

        try {
            DB::table('user_types')
            ->where('id', $id)
            ->update(
                [
                    'id' => $id, 
                    'name' => $name, 
                    'updated_by' => $userid, 
                    'updated_at' => $updated_at
                ]
            );

            $message = 'Ok';
            Log::channel('mysql')->info('User with id: ' . $userid .' successsfully editted a user type');

        }catch(Exception $e) {
            Log::channel('mysql')->error('User with id: ' . $userid .' unsuccesssfully editted user type');
            $message = "Failed";
        } 
            
        return response()->json([
            'message' => $message
        ]);

    }


    /**
     * deleteUserType delete a usertypes 
     *
     * @param  mixed $request
     * @param  mixed $id of the user type to be deleted
     * @return void\Illuminate\Http\Response error or success message
     */
    public function deleteUserType(Request $request, $id){

        $deleted_at = now();

        //get user creating the new merchant
        $user = $request->user();
        $userid = $user['id'];

        try {
            DB::table('user_types')
            ->where('id', $id)
            ->update(
                [
                    'deleted_by' => $userid, 
                    'deleted_at' => $deleted_at
                ]
            );

            $message = 'Ok';
            Log::channel('mysql')->info('User with id: ' . $userid .' successsfully deleted a user type with id: '. $id);

        }catch(Exception $e) {
            Log::channel('mysql')->error('User with id: ' . $userid .' unsuccesssfully deleted a user type with id: '. $id);
            $message = "Failed";
        } 
            
        return response()->json([
            'message' => $message
        ]);

    }


    /**
     * getAllUserTypes get all available usertypes 
     *
     * @param  mixed $request
     *
     * @return void\Illuminate\Http\Response all merchants data
     */
    public function getAllUserTypes(Request $request){

        //get all usertypes
        $getusertypes = DB::table('user_types')->where('deleted_at', null)->get();

         $response = [
            'usertypes' => $getusertypes
        ];
        return response()->json($response, 200);

    }


    /**
     * getUserTypesLevel1 get all usertypes for level one
     * can be viewed by GIt_Admin, super-executive and company_admin
     *
     * @param  mixed $request
     *
     * @return void\Illuminate\Http\Response all merchants data
     */
    public function getUserTypesLevel1(Request $request){

        //get all registered companies 
        $getusertypes = DB::table('user_types')
        ->whereNotIn('id', [20, 26])
        ->where('deleted_at', null)
        ->simplePaginate(15);

         $response = [
            'usertypes' => $getusertypes
        ];
        return response()->json($response, 200);

    }


    /**
     * getUserTypesLevel2 get all usertypes for level two
     * can be viewed by GIt_Admin, super-executive, company_admin, branch_executive and branch_admin
     *
     * @param  mixed $request
     *
     * @return void\Illuminate\Http\Response all merchants data
     */
    public function getUserTypesLevel2(Request $request){

        //get all registered companies 
        $getusertypes = DB::table('user_types')
        ->whereNotIn('id', [20, 26, 21, 23])
        ->where('deleted_at', null)
        ->simplePaginate(15);

         $response = [
            'usertypes' => $getusertypes
        ];
        return response()->json($response, 200);

    }


    /**
     * getUserTypesLevel3 get all usertypes for level three (
     * admin create front desk user)
     * can be viewed by GIt_Admin, company_admin, and branch_admin
     *
     * @param  mixed $request
     *
     * @return void\Illuminate\Http\Response all merchants data
     */
    public function getUserTypesLevel3(Request $request){

        //get all registered companies 
        $getusertypes = DB::table('user_types')
        ->where('id', 26)
        ->where('deleted_at', null)
        ->simplePaginate(15);

         $response = [
            'usertypes' => $getusertypes
        ];
        return response()->json($response, 200);

    }

    /**
     * getMerchants get all registered companies 
     *
     * @param  mixed $request
     *
     * @return void\Illuminate\Http\Response all merchants data
     */
    public function getMerchants(Request $request){
        //get all registered companies
        $getmerchants = DB::table('merchants')
        ->join('joint_companies', 'joint_companies.id', '=', 'super_id')
        ->join('company_admin', 'company_admin.id', '=', 'admin_id')
        ->select('merchants.*','company_admin.name AS admin_name','joint_companies.name AS exec_name')
        ->Paginate(15);

        //clean data
        $merchantsdata = [];
        $getmerchants->transform(function($items, $key){
            $merchantsdata['id'] = $items->id;
            $merchantsdata['merchant_name'] = Crypt::decryptString($items->merchant_name);
            $merchantsdata['nickname'] = $items->nickname;
            $merchantsdata['status'] = $items->status;
            $merchantsdata['country'] = $items->country;
            $merchantsdata['sector_id'] = $items->sector_id;
            $merchantsdata['physical_address'] = $items->physical_address;
            $merchantsdata['logo'] = $items->logo;
            $merchantsdata['small_logo'] = $items->small_logo;
            $merchantsdata['super_executive_id'] = $items->super_id;
            $merchantsdata['super_executive_name'] = Crypt::decryptString($items->exec_name);
            $merchantsdata['company_admin_id'] = $items->admin_id;
            $merchantsdata['company_admin_name'] = Crypt::decryptString($items->admin_name);
            $merchantsdata['can_print'] = $items->can_print;
            $merchantsdata['created_by'] = $items->created_by;
            $merchantsdata['created_at'] = $items->created_at;
            $merchantsdata['updated_at'] = $items->updated_at;
            $merchantsdata['colors'] = $items->colors;
            $merchantsdata['enabled_qms'] = $items->enabled_qms;
            return $merchantsdata;
         });

         $response = [
            'merchants' => $getmerchants
        ];
        return response()->json($response, 200);
    }

    /**
     * getMerchantsForDropdown get all registered companies to populate dropdown
     *
     * @param  mixed $request
     *
     * @return void\Illuminate\Http\Response all merchants data
     */
    public function getMerchantsForDropdown(Request $request){
        //get all registered companies
        $getmerchants = DB::table('merchants')
        ->join('joint_companies', 'joint_companies.id', '=', 'super_id')
        ->join('company_admin', 'company_admin.id', '=', 'admin_id')
        ->select('merchants.*','company_admin.name AS admin_name','joint_companies.name AS exec_name')
        ->get();

        //clean data
        $merchantsdata = [];
        $getmerchants->transform(function($items, $key){
            $merchantsdata['id'] = $items->id;
            $merchantsdata['merchant_name'] = Crypt::decryptString($items->merchant_name);
            $merchantsdata['nickname'] = $items->nickname;
            $merchantsdata['status'] = $items->status;
            $merchantsdata['country'] = $items->country;
            $merchantsdata['sector_id'] = $items->sector_id;
            $merchantsdata['physical_address'] = $items->physical_address;
            $merchantsdata['logo'] = $items->logo;
            $merchantsdata['small_logo'] = $items->small_logo;
            $merchantsdata['super_executive_id'] = $items->super_id;
            $merchantsdata['super_executive_name'] = Crypt::decryptString($items->exec_name);
            $merchantsdata['company_admin_id'] = $items->admin_id;
            $merchantsdata['company_admin_name'] = Crypt::decryptString($items->admin_name);
            $merchantsdata['can_print'] = $items->can_print;
            $merchantsdata['created_by'] = $items->created_by;
            $merchantsdata['created_at'] = $items->created_at;
            $merchantsdata['updated_at'] = $items->updated_at;
            $merchantsdata['enabled_qms'] = $items->enabled_qms;
            return $merchantsdata;
         });

         $response = [
            'merchants' => $getmerchants
        ];
        return response()->json($response, 200);
    }

    

    /**
     * getNumMerchants get number of all registered companies 
     *
     * @param  mixed $request
     *
     * @return void\Illuminate\Http\Response all merchants data
     */
    public function getNumMerchants(Request $request){

        //get all registered companies 
        $getnummerchants = DB::table('merchants')->count();

         $response = [
            'num_merchants' => $getnummerchants
        ];
        return response()->json($response, 200);

    }

    /**
     * getNumActiveMerchants get number of active merchants
     *
     * @param  mixed $request
     *
     * @return void\Illuminate\Http\Response all active merchants data
     */
    public function getNumActiveMerchants(Request $request){

        //get all registered companies 
        $getnummerchants = DB::table('merchants')
        ->where('status', 1)
        ->count();

         $response = [
            'num_active_merchants' => $getnummerchants
        ];
        return response()->json($response, 200);

    }

    /**
     * getNumInactiveMerchants get number of inactive merchants
     *
     * @param  mixed $request
     *
     * @return void\Illuminate\Http\Response all inactive merchants data
     */
    public function getNumInactiveMerchants(Request $request){

        //get all registered companies 
        $getnummerchants = DB::table('merchants')
        ->where('status', 0)
        ->count();

         $response = [
            'num_inactive_merchants' => $getnummerchants
        ];
        return response()->json($response, 200);

    }



    /**
     * getAllMerchantsByCountry get all registered companies by country 
     *
     * @param  mixed $request
     *
     * @return void\Illuminate\Http\Response all merchants data
     */
    public function getAllMerchantsByCountry(Request $request, $country, $sector){

        if($sector == 0){
            //get all registered companies 
            $getmerchants = DB::table('merchants')
            ->leftjoin('joint_companies', 'joint_companies.id', '=', 'super_id')
            ->join('company_admin', 'company_admin.id', '=', 'admin_id')
            ->select('merchants.*','company_admin.name AS admin_name','joint_companies.name AS exec_name')
            ->where('country', $country)
            ->where('merchants.status', 1)
            ->paginate(15);
        }else{
             //get all registered companies 
             $getmerchants = DB::table('merchants')
             ->leftjoin('joint_companies', 'joint_companies.id', '=', 'super_id')
             ->join('company_admin', 'company_admin.id', '=', 'admin_id')
             ->select('merchants.*','company_admin.name AS admin_name','joint_companies.name AS exec_name')
             ->where('country', $country)
             ->where('merchants.status', 1)
             ->where('sector_id', $sector)
             ->paginate(15);
        }
        
      
        //clean data
        $merchantsdata = [];

        $getmerchants->transform(function($items){
            $merchantsdata['id'] = $items->id;
            $merchantsdata['merchant_name'] = Crypt::decryptString($items->merchant_name);
            $merchantsdata['nickname'] = $items->nickname;
            $merchantsdata['status'] = $items->status;
            $merchantsdata['country'] = $items->country;
            $merchantsdata['sector_id'] = $items->sector_id;
            $merchantsdata['physical_address'] = $items->physical_address;
            $merchantsdata['logo'] = $items->logo;
            $merchantsdata['small_logo'] = $items->small_logo;
            $merchantsdata['temp'] = $items->temp;
            $merchantsdata['super_executive_id'] = $items->super_id;
            $merchantsdata['super_executive_name'] = empty($items->exec_name) ? '' : Crypt::decryptString($items->exec_name);
            $merchantsdata['company_admin_id'] = $items->admin_id;
            $merchantsdata['company_admin_name'] = Crypt::decryptString($items->admin_name);
            $merchantsdata['can_print'] = $items->can_print;
            $merchantsdata['created_by'] = $items->created_by;
            $merchantsdata['created_at'] = $items->created_at;
            $merchantsdata['updated_at'] = $items->updated_at;
            $merchantsdata['colors'] = $items->colors;
            $merchantsdata['enabled_qms'] = $items->enabled_qms;

            return $merchantsdata;
         });

         $response = [
            'merchant' => $getmerchants
        ];
        return response()->json($response, 200);

    }

    /**
     * getAllMerchantsByCountry get all registered companies by country 
     *
     * @param  mixed $request
     *
     * @return void\Illuminate\Http\Response all merchants data
     */
    public function getAllMerchantsByCountryApp(Request $request, $country, $sector){

        if($sector == 0){
            //get all registered companies 
            $getmerchants = DB::table('merchants')
            ->leftjoin('joint_companies', 'joint_companies.id', '=', 'super_id')
            ->join('company_admin', 'company_admin.id', '=', 'admin_id')
            ->select('merchants.*','company_admin.name AS admin_name','joint_companies.name AS exec_name')
            ->where('country', $country)
            ->where('merchants.status', 1)
            ->get();
        }else{
             //get all registered companies 
             $getmerchants = DB::table('merchants')
             ->leftjoin('joint_companies', 'joint_companies.id', '=', 'super_id')
             ->join('company_admin', 'company_admin.id', '=', 'admin_id')
             ->select('merchants.*','company_admin.name AS admin_name','joint_companies.name AS exec_name')
             ->where('country', $country)
             ->where('merchants.status', 1)
             ->where('sector_id', $sector)
             ->get();
        }
        
      
        //clean data
        $merchantsdata = [];

        $getmerchants->transform(function($items){
            $merchantsdata['id'] = $items->id;
            $merchantsdata['merchant_name'] = Crypt::decryptString($items->merchant_name);
            $merchantsdata['nickname'] = $items->nickname;
            $merchantsdata['status'] = $items->status;
            $merchantsdata['country'] = $items->country;
            $merchantsdata['sector_id'] = $items->sector_id;
            $merchantsdata['physical_address'] = $items->physical_address;
            $merchantsdata['logo'] = $items->logo;
            $merchantsdata['small_logo'] = $items->small_logo;
            $merchantsdata['temp'] = $items->temp;
            $merchantsdata['super_executive_id'] = $items->super_id;
            $merchantsdata['super_executive_name'] = empty($items->exec_name) ? '' : Crypt::decryptString($items->exec_name);
            $merchantsdata['company_admin_id'] = $items->admin_id;
            $merchantsdata['company_admin_name'] = Crypt::decryptString($items->admin_name);
            $merchantsdata['can_print'] = $items->can_print;
            $merchantsdata['created_by'] = $items->created_by;
            $merchantsdata['created_at'] = $items->created_at;
            $merchantsdata['updated_at'] = $items->updated_at;
            $merchantsdata['colors'] = $items->colors;
            $merchantsdata['enabled_qms'] = $items->enabled_qms;

            return $merchantsdata;
         });

         $response = [
            'merchant' => $getmerchants
        ];
        return response()->json($response, 200);

    }



    /**
     * getMerchantDetails get all registered companies 
     *
     * @param  mixed $request
     *
     * @return void\Illuminate\Http\Response all merchants data
     */
    public function getMerchantDetails(Request $request, $id){

        //get all registered companies 
        $getmerchant = DB::table('merchants')
        ->leftjoin('joint_companies', 'joint_companies.id', '=', 'super_id')
        ->join('company_admin', 'company_admin.id', '=', 'admin_id')
        ->select('merchants.*','company_admin.name AS admin_name','joint_companies.name AS exec_name')
        ->where('merchants.id', $id)
        ->get();

        //clean data
        $merchantsdata = [];

        $merchant = $getmerchant->map(function($items){
            $merchantsdata['id'] = $items->id;
            $merchantsdata['merchant_name'] = Crypt::decryptString($items->merchant_name);
            $merchantsdata['nickname'] = $items->nickname;
            $merchantsdata['status'] = $items->status;
            $merchantsdata['country'] = $items->country;
            $merchantsdata['sector_id'] = $items->sector_id;
            $merchantsdata['physical_address'] = $items->physical_address;
            $merchantsdata['logo'] = $items->logo;
            $merchantsdata['small_logo'] = $items->small_logo;
            $merchantsdata['super_executive_id'] = $items->super_id;
            $merchantsdata['super_executive_name'] = empty($items->exec_name) ? '' : Crypt::decryptString($items->exec_name);
            $merchantsdata['company_admin_id'] = $items->admin_id;
            $merchantsdata['company_admin_name'] = Crypt::decryptString($items->admin_name);
            $merchantsdata['can_print'] = $items->can_print;
            $merchantsdata['created_by'] = $items->created_by;
            $merchantsdata['created_at'] = $items->created_at;
            $merchantsdata['updated_at'] = $items->updated_at;
            $merchantsdata['colors'] = $items->colors;
            $merchantsdata['enabled_qms'] = $items->enabled_qms;

            return $merchantsdata;
         });

         $response = [
            'merchant' => $merchant
        ];
        return response()->json($response, 200);

    }


    /**
     * getAllBranches get all registered branches 
     *
     * @param  mixed $request
     *
     * @return void\Illuminate\Http\Response all branches data
     */
    public function getAllBranches(Request $request){

        //get all registered companies 
        $getbranches = DB::table('company_branches')
        ->join('merchants', 'merchants.id', '=', 'merchant_id')
        ->leftjoin('branch_super_executive', 'branch_super_executive.id', '=', 'branch_super_id')
        ->join('branch_admin', 'branch_admin.id', '=', 'branch_admin_id')
        ->select('company_branches.*','merchants.merchant_name AS merchant_name', 'merchants.nickname',
        'branch_super_executive.name AS exec_name','branch_admin.name AS admin_name')
        ->paginate(15);

        //clean data
        $branchessdata = [];

        $getbranches->transform(function($items){
            $branchessdata['id'] = $items->id;
            $branchessdata['branch_name'] = Crypt::decryptString($items->branchname);
            $branchessdata['status'] = $items->status;
            $branchessdata['status'] = $items->status;
            $branchessdata['physical_address'] = $items->physical_address;
            $branchessdata['merchant_id'] = $items->merchant_id;
            $branchessdata['merchant_name'] = Crypt::decryptString($items->merchant_name);
            $branchessdata['nickname'] = $items->nickname;
            $branchessdata['branch_super_executive_id'] = $items->branch_super_id;
            $branchessdata['branch_super_executive_name'] = empty($items->exec_name) ? '' : Crypt::decryptString($items->exec_name);
            $branchessdata['branch_admin_id'] = $items->branch_admin_id;
            $branchessdata['branch_admin_name'] = Crypt::decryptString($items->admin_name);
            $branchessdata['branch_ext'] = $items->branch_ext;
            $branchessdata['created_by'] = $items->created_by;
            $branchessdata['updated_by'] = $items->updated_by;
            $branchessdata['created_at'] = $items->created_at;
            $branchessdata['updated_at'] = $items->updated_at;

            return $branchessdata;
         });

         $response = [
            'branches' => $getbranches
        ];
        return response()->json($response, 200);

    }

    /**
     * getAllBranches get all registered branches 
     *
     * @param  mixed $request
     *
     * @return void\Illuminate\Http\Response all branches data
     */
    public function getAllBranchesForDropdown(Request $request){

        //get all registered companies 
        $getbranches = DB::table('company_branches')
        ->join('merchants', 'merchants.id', '=', 'merchant_id')
        ->leftjoin('branch_super_executive', 'branch_super_executive.id', '=', 'branch_super_id')
        ->join('branch_admin', 'branch_admin.id', '=', 'branch_admin_id')
        ->select('company_branches.*','merchants.merchant_name AS merchant_name', 'merchants.nickname',
        'branch_super_executive.name AS exec_name','branch_admin.name AS admin_name')
        ->get();

        //clean data
        $branchessdata = [];

        $getbranches->transform(function($items){
            $branchessdata['id'] = $items->id;
            $branchessdata['branch_name'] = Crypt::decryptString($items->branchname);
            $branchessdata['status'] = $items->status;
            $branchessdata['status'] = $items->status;
            $branchessdata['merchant_id'] = $items->merchant_id;
            $branchessdata['merchant_name'] = Crypt::decryptString($items->merchant_name);
            $branchessdata['nickname'] = $items->nickname;
            $branchessdata['branch_super_executive_id'] = $items->branch_super_id;
            $branchessdata['branch_super_executive_name'] = empty($items->exec_name) ? '' : Crypt::decryptString($items->exec_name);
            $branchessdata['branch_admin_id'] = $items->branch_admin_id;
            $branchessdata['branch_admin_name'] = Crypt::decryptString($items->admin_name);
            $branchessdata['physical_address'] = $items->physical_address;
            $branchessdata['branch_ext'] = $items->branch_ext;
            $branchessdata['created_by'] = $items->created_by;
            $branchessdata['updated_by'] = $items->updated_by;
            $branchessdata['created_at'] = $items->created_at;
            $branchessdata['updated_at'] = $items->updated_at;

            return $branchessdata;
         });

         $response = [
            'branches' => $getbranches
        ];
        return response()->json($response, 200);

    }


    /**
     * getNumBranches get number of all registered branches 
     *
     * @param  mixed $request
     *
     * @return void\Illuminate\Http\Response num of branches 
     */
    public function getNumBranches(Request $request){

        //get all registered companies 
        $getnumbranches = DB::table('company_branches')->count();

         $response = [
            'num_branches' => $getnumbranches
        ];
        return response()->json($response, 200);

    }

    /**
     * getNumActiveBranches get number of all active registered branches 
     *
     * @param  mixed $request
     *
     * @return void\Illuminate\Http\Response num of active branches 
     */
    public function getNumActiveBranches(Request $request){

        //get all registered companies 
        $getnumbranches = DB::table('company_branches')
        ->where('status', 1)
        ->count();

         $response = [
            'num_active_branches' => $getnumbranches
        ];
        return response()->json($response, 200);

    }


     /**
     * getNumInactiveBranches get number of all inactive registered branches 
     *
     * @param  mixed $request
     *
     * @return void\Illuminate\Http\Response num of inactive branches 
     */
    public function getNumInactiveBranches(Request $request){

        //get all registered companies 
        $getnumbranches = DB::table('company_branches')
        ->where('status', 0)
        ->count();

         $response = [
            'num_inactive_branches' => $getnumbranches
        ];
        return response()->json($response, 200);

    }


    /**
     * getCompanyBranches get all registered company branches 
     *
     * @param  mixed $request
     * @param  mixed $id merchant id
     *
     * @return void\Illuminate\Http\Response all company branches data
     */
    public function getCompanyBranches(Request $request, $id){

        //get all registered companies 
        $getbranches = DB::table('company_branches')
        ->join('merchants', 'merchants.id', '=', 'merchant_id')
        ->leftjoin('branch_super_executive', 'branch_super_executive.id', '=', 'branch_super_id')
        ->leftjoin('branch_admin', 'branch_admin.id', '=', 'branch_admin_id')
        ->select('company_branches.*','merchants.merchant_name AS merchant_name', 'merchants.nickname',
        'branch_super_executive.name AS exec_name','branch_admin.name AS admin_name')
       ->where('merchant_id', $id)
       ->paginate(15);

        //clean data
        $branchessdata = [];

      $getbranches->transform(function($items){
            $branchessdata['id'] = $items->id;
            $branchessdata['branch_name'] = Crypt::decryptString($items->branchname);
            $branchessdata['status'] = $items->status;
            $branchessdata['merchant_id'] = $items->merchant_id;
            $branchessdata['merchant_name'] = Crypt::decryptString($items->merchant_name);
            $branchessdata['physical_address'] = $items->physical_address;
            $branchessdata['nickname'] = $items->nickname;
            $branchessdata['branch_super_executive_id'] = $items->branch_super_id;
            $branchessdata['branch_super_executive_name'] = empty($items->exec_name) ? '' : Crypt::decryptString($items->exec_name);
            $branchessdata['branch_admin_id'] = $items->branch_admin_id;
            $branchessdata['branch_admin_name'] = empty($items->admin_name) ? '' : Crypt::decryptString($items->admin_name);
            $branchessdata['branch_ext'] = $items->branch_ext;
            $branchessdata['created_by'] = $items->created_by;
            $branchessdata['updated_by'] = $items->updated_by;
            $branchessdata['created_at'] = $items->created_at;
            $branchessdata['updated_at'] = $items->updated_at;

            return $branchessdata;
         });

         $response = [
            'branches' => $getbranches
        ];
        return response()->json($response, 200);

    }

    /**
     * getActiveCompanyBranches get all registered active company branches for forms submission
     *
     * @param  mixed $request
     * @param  mixed $id merchant id
     *
     * @return void\Illuminate\Http\Response all active company branches data
     */
     public function getActiveCompanyBranches(Request $request, $id){

        //get all registered companies 
        $getbranches = DB::table('company_branches')
        ->join('merchants', 'merchants.id', '=', 'merchant_id')
        ->select('company_branches.*')
       ->where('merchant_id', $id)
       ->where('company_branches.status', 1)
       ->get();

       //clean data
       $branchessdata = [];

       $getbranches->transform(function($items){
             $branchessdata['id'] = $items->id;
             $branchessdata['branch_name'] = Crypt::decryptString($items->branchname);
             $branchessdata['branch_ext'] = $items->branch_ext;
 
             return $branchessdata;
          });
 
          $response = [
             'branches' => $getbranches
         ];
         return response()->json($response, 200);
     }


    /**
     * getNumCompanyBranches get num of all registered company branches 
     *
     * @param  mixed $request
     * @param  mixed $id merchant id
     *
     * @return void\Illuminate\Http\Response num of all company branches data
     */
    public function getNumCompanyBranches(Request $request, $id){

        //get all registered companies 
        $getnumbranches = DB::table('company_branches')
       ->where('merchant_id', $id)
       ->count();

         $response = [
            'num_branches' => $getnumbranches
        ];
        return response()->json($response, 200);

    }


     /**
     * getCompanyBranchDetails get all details of a company branches 
     *
     * @param  mixed $request
     * @param  mixed $id branch id
     *
     * @return void\Illuminate\Http\Response all company branches data
     */
    public function getCompanyBranchDetails(Request $request, $id){

        //get all registered companies 
        $getbranch = DB::table('company_branches')
        ->join('merchants', 'merchants.id', '=', 'merchant_id')
        ->leftjoin('branch_super_executive', 'branch_super_executive.id', '=', 'branch_super_id')
        ->leftjoin('branch_admin', 'branch_admin.id', '=', 'branch_admin_id')
        ->select('company_branches.*','merchants.merchant_name AS merchant_name', 'merchants.nickname',
        'branch_super_executive.name AS exec_name','branch_admin.name AS admin_name')
       ->where('company_branches.id', $id)
       ->get();

        //clean data
        $branchessdata = [];

        $branch = $getbranch->map(function($items){
            $branchessdata['id'] = $items->id;
            $branchessdata['branch_name'] = Crypt::decryptString($items->branchname);
            $branchessdata['status'] = $items->status;
            $branchessdata['status'] = $items->status;
            $branchessdata['merchant_id'] = $items->merchant_id;
            $branchessdata['merchant_name'] = Crypt::decryptString($items->merchant_name);
            $branchessdata['physical_address'] = $items->physical_address;
            $branchessdata['nickname'] = $items->nickname;
            $branchessdata['branch_super_executive_id'] = $items->branch_super_id;
            $branchessdata['branch_super_executive_name'] = empty($items->exec_name) ? '' : Crypt::decryptString($items->exec_name);
            $branchessdata['branch_admin_id'] = $items->branch_admin_id;
            $branchessdata['branch_admin_name'] = empty($items->admin_name) ? '' : Crypt::decryptString($items->admin_name);
            $branchessdata['branch_ext'] = $items->branch_ext;
            $branchessdata['created_by'] = $items->created_by;
            $branchessdata['updated_by'] = $items->updated_by;
            $branchessdata['created_at'] = $items->created_at;
            $branchessdata['updated_at'] = $items->updated_at;

            return $branchessdata;
         });

         $response = [
            'branch' => $branch
        ];
        return response()->json($response, 200);

    }

    /**
     * diableMerchant disable a merchant
     * All users under this merchant are disabled as well
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  $id of the merchant to be disabled
     *
     * @return void\Illuminate\Http\Response success or error message
     */
    public function disableMerchant(Request $request, $id)
    {

        $updated_at = now();

        //get user creating the new merchant
        $user = $request->user();
        $userid = $user['id'];

        //disble merchant
        try {
            DB::table('merchants')
            ->where('id', $id)
            ->update(
                [
                    'status' => 0, 
                    'updated_at' => $updated_at,
                    'updated_by' => $userid
                ]
            );

            DB::table('users')
            ->where('merchant_id', $id)
            ->update(
                [
                    'status' => 0, 
                    'updated_at' => $updated_at
                ]
            );

            $message = 'Ok';

        }catch(Exception $e) {
            $message = "Failed";
        } 
            
        return response()->json([
            'message' => $message
        ]);
    }

    /**
     * enableMerchant enable a previously disbaled merchant
     * All users under this merchant that were disabled as a result 
     * of diabling the mercahnt are enabled
     * @param  \Illuminate\Http\Request  $request
     * @param  $id of the merchant to be enabled
     *
     * @return void\Illuminate\Http\Response success or error message
     */
    public function enableMerchant(Request $request, $id)
    {

        $updated_at = now();

        //get user creating the new merchant
        $user = $request->user();
        $userid = $user['id'];

        //disble merchant
        try {
            DB::table('merchants')
            ->where('id', $id)
            ->update(
                [
                    'status' => 1, 
                    'updated_at' => $updated_at,
                    'updated_by' => $userid
                ]
            );

            DB::table('users')
            ->where('merchant_id', $id)
            ->update(
                [
                    'status' => 1, 
                    'updated_at' => $updated_at
                ]
            );

            $message = 'Ok';

        }catch(Exception $e) {
            $message = "Failed";
        } 
            
        return response()->json([
            'message' => $message
        ]);
    }

    /**
     * diableBranch disable a branch
     * All users under this branch are disabled as well
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  $id of the branch to be disabled
     *
     * @return void\Illuminate\Http\Response success or error message
     */
    public function disableBranch(Request $request, $id)
    {

        $updated_at = now();

        //get user creating the new merchant
        $user = $request->user();
        $userid = $user['id'];

        //disble merchant
        try {
            DB::table('company_branches')
            ->where('id', $id)
            ->update(
                [
                    'status' => 0, 
                    'updated_at' => $updated_at,
                    'updated_by' => $userid
                ]
            );

            DB::table('users')
            ->where('branch_id', $id)
            ->update(
                [
                    'status' => 0, 
                    'updated_at' => $updated_at
                ]
            );

            $message = 'Ok';

        }catch(Exception $e) {
            $message = "Failed";
        } 
            
        return response()->json([
            'message' => $message
        ]);
    }

    /**
     * enableBranch enable a previously disbaled branch
     * All users under this branch that were disabled as a result 
     * of diabling the branch are enabled
     * @param  \Illuminate\Http\Request  $request
     * @param  $id of the branch to be enabled
     *
     * @return void\Illuminate\Http\Response success or error message
     */
    public function enableBranch(Request $request, $id)
    {

        $updated_at = now();

        //get user creating the new merchant
        $user = $request->user();
        $userid = $user['id'];

        //disble merchant
        try {
            DB::table('company_branches')
            ->where('id', $id)
            ->update(
                [
                    'status' => 1, 
                    'updated_at' => $updated_at,
                    'updated_by' => $userid
                ]
            );

            DB::table('users')
            ->where('branch_id', $id)
            ->update(
                [
                    'status' => 1, 
                    'updated_at' => $updated_at
                ]
            );

            $message = 'Ok';

        }catch(Exception $e) {
            $message = "Failed";
        } 
            
        return response()->json([
            'message' => $message
        ]);
    }

    
    /**
     * getMerchantbyName search for a merchant based on a search term
     * Search term must much company name or nickname
     * @param  mixed $request
     * @param  mixed search term
     *
     * @return void\Illuminate\Http\Response all merchants matching the search term
     */
    public function getMerchantbyName(Request $request, $term, $country, $sector){

        if($sector == 0){
            //get all registered companies
            $getmerchants = DB::table('merchants')
            ->select('merchants.*')
            ->where([
                ['merchants.temp', 'like', '%'.$term .'%'],
                ['merchants.status','=',1],
                ['merchants.country', '=', $country]
            ])
            ->orWhere([
                ['merchants.nickname', 'like', '%'.$term .'%'],
                ['merchants.status','=',1],
                ['merchants.country', '=', $country]
            ])
            ->get();
        }else{ 
            //get all registered companies
            $getmerchants = DB::table('merchants')
            ->select('merchants.*')
            ->where([
                ['merchants.temp', 'like', '%'.$term .'%'],
                ['merchants.status','=',1],
                ['merchants.country', '=', $country],
                ['sector_id', $sector]
            ])
            ->orWhere([
                ['merchants.nickname', 'like', '%'.$term .'%'],
                ['merchants.status','=',1],
                ['merchants.country', '=', $country],
                ['sector_id', $sector]
            ])
            ->get();
      
        }
        
        //clean data
        $merchantsdata = [];
        $getmerchants->transform(function($items, $key){
            $merchantsdata['id'] = $items->id;
            $merchantsdata['merchant_name'] = Crypt::decryptString($items->merchant_name);
            $merchantsdata['nickname'] = $items->nickname;
            $merchantsdata['status'] = $items->status;
            $merchantsdata['country'] = $items->country;
            $merchantsdata['sector_id'] = $items->sector_id;
            $merchantsdata['physical_address'] = $items->physical_address;
            $merchantsdata['logo'] = $items->logo;
            $merchantsdata['small_logo'] = $items->small_logo;
            $merchantsdata['can_print'] = $items->can_print;
            $merchantsdata['created_by'] = $items->created_by;
            $merchantsdata['created_at'] = $items->created_at;
            $merchantsdata['updated_at'] = $items->updated_at;
            $merchantsdata['colors'] = $items->colors;
            $merchantsdata['sector_id'] = $items->sector_id;
            $merchantsdata['enabled_qms'] = $items->enabled_qms;
            return $merchantsdata;
         });

         $response = [
            'merchants' => $getmerchants
        ];
        return response()->json($response, 200);

    }

     /**
     * createBusinessSector create a new business sector
     *
     * @param  mixed $request
     *
     * @return \Illuminate\Http\Response success or error message
     */
     public function createBusinessSector(Request $request){

        $this->validate($request, [
            'name' => 'required'
        ]);

        $name = $request->name;

        $created_at = now();

        //get user creating the new merchant
        $user = $request->user();
        $userid = $user['id'];

        try {
            DB::table('business_sectors')->insertGetId(
                [
                    'name' => $name, 
                    'created_by' => $userid, 
                    'created_at' => $created_at
                ]
            );

            $message = 'Ok';
            Log::channel('mysql')->info('User with id: ' . $userid .' successsfully created a new business sector');

        }catch(Exception $e) {
            Log::channel('mysql')->error('User with id: ' . $userid .' unsuccesssfully created a new business sector');
            $message = "Failed";
        } 
            
        return response()->json([
            'message' => $message
        ]);

    }

     /**
     * getAllBusinessSectors get all business sectors in the db
     *
     * @param  mixed $request
     *
     * @return void\Illuminate\Http\Response all template categories data
     */
     public function getAllBusinessSectors(Request $request){

        //get all template categories 
        $getbusinesssectors = DB::table('business_sectors')->get();

         $response = [
            'business_sectors' => $getbusinesssectors
        ];
        return response()->json($response, 200);

    }

     /**
     * editBusinessSector edit business sector in the db
     *
     * @param  mixed $request
     *
     * @return \Illuminate\Http\Response success or error message
     */
     public function editBusinessSector(Request $request, $id){

        $this->validate($request, [
            'name' => 'required'
        ]);

        $name = $request->name;

        $updated_at = now();

        //get user creating the new merchant
        $user = $request->user();
        $userid = $user['id'];

        try {

            DB::table('business_sectors')
            ->where('id', $id)
            ->update(
                [
                    'name' => $name, 
                    'updated_by' => $userid, 
                    'updated_at' => $updated_at
                ]
            );

            $message = 'Ok';
            Log::channel('mysql')->info('User with id: ' . $userid .' successsfully updated a business sector with id '. $id);

        }catch(Exception $e) {
            Log::channel('mysql')->error('User with id: ' . $userid .' unsuccesssfully updated a business sector with id '. $id);
            $message = "Failed";
        } 
            
        return response()->json([
            'message' => $message
        ]);

    }

    /**
     * deleteBusinessSector delete a business sector in the db
     *
     * @param  mixed $request
     *
     * @return \Illuminate\Http\Response success or error message
     */
     public function deleteBusinessSector(Request $request, $id){

        //get user creating the new merchant
        $user = $request->user();
        $userid = $user['id'];

        try {

            DB::table('business_sectors')
            ->where('id', $id)
            ->delete();

            $message = 'Ok';
            Log::channel('mysql')->info('User with id: ' . $userid .' successsfully deleted a business sector with id '. $id);

        }catch(Exception $e) {
            Log::channel('mysql')->error('User with id: ' . $userid .' unsuccesssfully deleted a business sector with id '. $id);
            $message = "Failed";
        } 
            
        return response()->json([
            'message' => $message
        ]);

    }

    /**
     * getCompanyColors get company colors
     *
     * @param  mixed $request
     * @param  mixed $id compnay id
     *
     * @return void\Illuminate\Http\Response all company colors data
     */
     public function getCompanyColors(Request $request, $id){

        //get all registered companies 
        $getbranch = DB::table('merchants')
        ->select('merchants.colors')
       ->where('id', $id)
       ->get();

       return $getbranch;
     }  
     
    /**
     * reportAbuse merchant report client abuse
     *
     * @param  mixed $request
     *
     * @return \Illuminate\Http\Response success or error message
     */
     public function reportAbuse(Request $request){
        
        $this->validate($request, [
            'client_id' => 'required',
            'message' => 'required',
            'merchant_id' => 'required'
        ]);

    
        $client_id = $request->client_id;
        $message = $request->message;
        $merchant_id = $request->merchant_id;
        $reported_at = now();


        //get user making the report
        $user = $request->user();
        $userid = $user['id'];

        if($userid == NULL)
            $userid = 0;

        
        //save new client abuse in the database
         try {
            DB::table('abuse_reports')->insert([
                [
                    'client_id' => $client_id, 
                    'message' => $message,
                    'merchant_id' => $merchant_id,
                    'reported_at' => $reported_at
                ]
            ]);

            Log::channel('mysql')->info('User with id: ' . $userid .' successsfully reported user with id  ' . $client_id . ' for abuse.');
            $message = 'Ok';

        }catch(Exception $e) {
            Log::channel('mysql')->error('User with id: ' . $userid .' unsuccesssfully reported user with id ' . $client_id . ' for abuse.');
            $message = "Failed";
        } 
            
        return response()->json([
            'message' => $message
        ]);

    }


    /**
     * getAllAbuseReports get all abuse reports in the db
     *
     * @param  mixed $request
     *
     * @return void\Illuminate\Http\Response all abuse reports 
     */
     public function getAllAbuseReports(Request $request){

        //get all abuse reports
        $abusereports = DB::table('abuse_reports')->orderBy('reported_at', 'desc')->get();

         $response = [
            'abuse_reports' => $abusereports
        ];
        return response()->json($response, 200);

    }
    
    /**
     * getAbuseReportsByStatus get all abuse reports in the db by status
     * 0 id report is not addressed and 1 if report is addressed
     *
     * @param  mixed $request
      * @param  mixed $status abuse report status
     *
     * @return void\Illuminate\Http\Response all abuse reports matching the selected status
     */
     public function getAbuseReportsByStatus(Request $request, $status){

        //get all abuse reports
        $abusereports = DB::table('abuse_reports')
        ->where('status', $status)
        ->orderBy('reported_at', 'desc')
        ->get();

         $response = [
            'abuse_reports' => $abusereports
        ];
        return response()->json($response, 200);

    }

      /**
     * addressAbuseReport address an abuse report
     * change abuse report status from 0 to 1
     * @param  mixed $request
      * @param  mixed $id id of the report being addressed
     *
     * @return \Illuminate\Http\Response success or error message
     */
     public function addressAbuseReport(Request $request, $id)
     {
        
        //get user making the report
        $user = $request->user();
        $userid = $user['id'];

        if($userid == NULL)
            $userid = 0;

        
        $addressed_at = now();

        //save new client abuse in the database
         try {
            DB::table('abuse_reports')
            ->where('id',$id)
            ->update(
                [
                    'addressed_at' => $addressed_at, 
                    'status' => 1
                ]
            );

            Log::channel('mysql')->info('User with id: ' . $userid .' successsfully adressed reported abuse with id  ' . $id . '.');
            $message = 'Ok';

        }catch(Exception $e) {
            Log::channel('mysql')->error('User with id: ' . $userid .' unsuccesssfully addressed reported abuse with id ' . $id . '.');
            $message = "Failed";
        } 
            
        return response()->json([
            'message' => $message
        ]);

    }

    /**
     * getAbuseReportDetails get details of an abuse report
     * @param  mixed $request
     * @param  mixed $id id of the abuse report being viewed
     *
     * @return void\Illuminate\Http\Response all abuse reports matching the selected status
     */
     public function getAbuseReportDetails(Request $request, $id){

        //get all abuse reports
        $getabusereport = DB::table('abuse_reports')
        ->where('id', $id)
        ->first();

         $response = [
            'abuse_report' => $getabusereport
        ];
        return response()->json($response, 200);

    }

     /**
     * QMSEnabled get if compnay has QMS servises enabled
     * needed when setting up a branch to decide on wheather to take branch extension
     * and when creating forms
     * @param  mixed $request
     * @param  mixed $id id of the merchant
     *
     * @return void\Illuminate\Http\Response Yes or no
     */
     public function QMSEnabled(Request $request, $id){
        $message = "NO";
        //get all abuse reports
        $qmsenabled = DB::table('merchants')
        // ->select('enabled_qms')
        ->where('id', $id)
        ->first();

        if($qmsenabled->enabled_qms == 1){
            $message = "YES"; 
        }

         $response = [
            'message' => $message
        ];
        return response()->json($response, 200);

    }

    /**
     * getQMSToken get token to use QMS apis
     * @param  mixed $request
     * @param  mixed $id id of the merchant
     *
     * @return void\Illuminate\Http\Response token
     */
     public function getQMSToken(Request $request, $id){
        $merchantdetails = DB::table('merchants')
        ->where('id', $id)
        ->first();

        $client_id = $merchantdetails->client_id;
        $client_secret = $merchantdetails->client_secret;
        $grant_type = "client_credentials";
        $scope = "join-sandbox";

        





     }

}
