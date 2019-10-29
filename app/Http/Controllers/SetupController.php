<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use Illuminate\Support\Carbon;

use Illuminate\Support\Facades\Crypt;

use DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\File;

class SetupController extends Controller
{
    
    /**
     * createMerchant create a new merchant
     *
     * @param  mixed $request
     *
     * @return \Illuminate\Http\Response success or error message
     */
    protected function createMerchant(Request $request){
        
        $this->validate($request, [
            'merchant_name' => 'required',
            'country' => 'required',
            'super_id'=>'required',
            'admin_id'=>'required',
            'logo' => 'required|mimes:jpeg,jpg,png,gif,psd,tiff',
            'small_logo' => 'nullable|mimes:jpeg,jpg,png,gif,psd,tiff'
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
            $upload=Storage::disk('local')->put($url,  File::get($image));
            if($upload)
            {
                $logo = $url;
                    //return Response::json($url);
            }else{
                return Reponse::json('Logo upload unsuccessful');
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
                return Reponse::json('Small logo upload unsuccessful');
            }
        }

        $name = Crypt::encryptString($request->merchant_name);
        $country = $request->country;
        $super_id = $request->super_id;
        $admin_id = $request->admin_id;
        $status = 1;
        $created_at = now();

        //get user creating the new merchant
        $user = $request->user();
        $userid = $user['id'];

        if($userid == NULL)
            $userid = 0;

        
        //save new merchant in the database
         try {
            DB::table('merchants')->insertGetId(
                [
                    'merchant_name' => $name, 
                    'status' => $status, 
                    'country' => $country, 
                    'logo' => $logo,
                    'small_logo' => $small_logo,
                    'super_id' => $super_id,
                    'admin_id' => $admin_id, 
                    'created_at' => $created_at,
                    'created_by' => $userid
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
     * editMerchant edit a merchant 
     *
     * @param  mixed $request
     * @param  mixed $id of the merchnat to be editted
     *
     * @return \Illuminate\Http\Response success or error message
     */
    protected function editMerchant(Request $request, $id){
        
        $this->validate($request, [
            'merchant_name' => 'required',
            'country' => 'required',
            'super_id'=>'required',
            'admin_id'=>'required',
            'logo' => 'required'
        ]); 

        $name = Crypt::encryptString($request->merchant_name);
        $country = $request->country;
        $super_id = $request->super_id;
        $admin_id = $request->admin_id;
        $status = 1;
        $updated_at = now();
        $logo = $request->logo;
        $small_logo = $request->small_logo;

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
                    'updated_by' => $userid
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
     * createCompanyBranches create a new company branch
     *
     * @param  mixed $request
     *
     * @return \Illuminate\Http\Response success or error message
     */
    protected function createCompanyBranches(Request $request){

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

        //get user creating the new merchant
        $user = $request->user();
        $userid = $user['id'];

         //save new merchant in the database
         try {
            DB::table('company_branches')->insertGetId(
                [
                    'merchant_id' => $merchant_id, 
                    'branchname' => $name, 
                    'status' => $status, 
                    'branch_super_id' => $branch_super_id,
                    'created_by' => $userid, 
                    'created_at' => $created_at,
                    'branch_admin_id' => $branch_admin_id
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
     * editCompanyBranches edit a company branch
     *
     * @param  mixed $request
     * @param  mixed $id of the branch to be editted
     *
     * @return \Illuminate\Http\Response success or error message
     */
    protected function editCompanyBranches(Request $request, $id){

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
        $updated_at = now();

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
                    'branch_admin_id' => $branch_admin_id
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
     * createUserType create a new user type 
     *
     * @param  mixed $request
     *
     * @return \Illuminate\Http\Response success or error message
     */
    protected function createUserType(Request $request){

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

        }catch(Exception $e) {
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
    protected function editUserType(Request $request){

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

        }catch(Exception $e) {
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
    protected function deleteUserType(Request $request, $id){

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

        }catch(Exception $e) {
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
    protected function getAllUserTypes(Request $request){

        //get all registered companies 
        $getusertypes = DB::table('user_types')->where('deleted_at', null)->simplePaginate(15);

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
    protected function getUserTypesLevel1(Request $request){

        //get all registered companies 
        $getusertypes = DB::table('user_types')->whereNotIn('id', [20, 26])->simplePaginate(15);

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
    protected function getUserTypesLevel2(Request $request){

        //get all registered companies 
        $getusertypes = DB::table('user_types')->whereNotIn('id', [20, 26, 21, 23])->simplePaginate(15);

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
    protected function getUserTypesLevel3(Request $request){

        //get all registered companies 
        $getusertypes = DB::table('user_types')->where('id', 26)->simplePaginate(15);

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
    protected function getMerchants(Request $request){

        //get all registered companies 
        $getmerchants = DB::table('merchants')
        ->join('joint_companies', 'joint_companies.id', '=', 'super_id')
        ->join('company_admin', 'company_admin.id', '=', 'admin_id')
        ->select('merchants.*','company_admin.name AS admin_name','joint_companies.name AS exec_name')
        ->simplePaginate(15);
      
        //clean data
        $merchantsdata = [];

        $merchants = $getmerchants->map(function($items){
            $merchantsdata['id'] = $items->id;
            $merchantsdata['merchant_name'] = Crypt::decryptString($items->merchant_name);
            $merchantsdata['status'] = $items->status;
            $merchantsdata['country'] = $items->country;
            $merchantsdata['logo'] = $items->logo;
            $merchantsdata['small_logo'] = $items->small_logo;
            $merchantsdata['super_executive_id'] = $items->super_id;
            $merchantsdata['super_executive_name'] = Crypt::decryptString($items->exec_name);
            $merchantsdata['company_admin_id'] = $items->admin_id;
            $merchantsdata['company_admin_name'] = Crypt::decryptString($items->admin_name);
            $merchantsdata['created_by'] = $items->created_by;
            $merchantsdata['created_at'] = $items->created_at;
            $merchantsdata['updated_at'] = $items->updated_at;

            return $merchantsdata;
         });

         $response = [
            'merchants' => $merchants
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
    protected function getAllMerchantsByCountry(Request $request, $country){

        //get all registered companies 
        $getmerchants = DB::table('merchants')
        ->join('joint_companies', 'joint_companies.id', '=', 'super_id')
        ->join('company_admin', 'company_admin.id', '=', 'admin_id')
        ->select('merchants.*','company_admin.name AS admin_name','joint_companies.name AS exec_name')
        ->where('country', $country)
        ->simplePaginate(15);
      
        //clean data
        $merchantsdata = [];

        $merchants = $getmerchants->map(function($items){
            $merchantsdata['id'] = $items->id;
            $merchantsdata['merchant_name'] = Crypt::decryptString($items->merchant_name);
            $merchantsdata['status'] = $items->status;
            $merchantsdata['country'] = $items->country;
            $merchantsdata['logo'] = $items->logo;
            $merchantsdata['small_logo'] = $items->small_logo;
            $merchantsdata['super_executive_id'] = $items->super_id;
            $merchantsdata['super_executive_name'] = Crypt::decryptString($items->exec_name);
            $merchantsdata['company_admin_id'] = $items->admin_id;
            $merchantsdata['company_admin_name'] = Crypt::decryptString($items->admin_name);
            $merchantsdata['created_by'] = $items->created_by;
            $merchantsdata['created_at'] = $items->created_at;
            $merchantsdata['updated_at'] = $items->updated_at;

            return $merchantsdata;
         });

         $response = [
            'merchants' => $merchants
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
    protected function getMerchantDetails(Request $request, $id){

        //get all registered companies 
        $getmerchant = DB::table('merchants')
        ->join('joint_companies', 'joint_companies.id', '=', 'super_id')
        ->join('company_admin', 'company_admin.id', '=', 'admin_id')
        ->select('merchants.*','company_admin.name AS admin_name','joint_companies.name AS exec_name')
        ->where('merchants.id', $id)
        ->get();

        //clean data
        $merchantsdata = [];

        $merchant = $getmerchant->map(function($items){
            $merchantsdata['id'] = $items->id;
            $merchantsdata['merchant_name'] = Crypt::decryptString($items->merchant_name);
            $merchantsdata['status'] = $items->status;
            $merchantsdata['country'] = $items->country;
            $merchantsdata['logo'] = $items->logo;
            $merchantsdata['small_logo'] = $items->small_logo;
            $merchantsdata['super_executive_id'] = $items->super_id;
            $merchantsdata['super_executive_name'] = Crypt::decryptString($items->exec_name);
            $merchantsdata['company_admin_id'] = $items->admin_id;
            $merchantsdata['company_admin_name'] = Crypt::decryptString($items->admin_name);
            $merchantsdata['created_by'] = $items->created_by;
            $merchantsdata['created_at'] = $items->created_at;
            $merchantsdata['updated_at'] = $items->updated_at;

            return $merchantsdata;
         });

         $response = [
            'merchant' => $merchant
        ];
        return response()->json($response, 200);

    }


    /**
     * getMerchants get all registered company branches 
     *
     * @param  mixed $request
     *
     * @return void\Illuminate\Http\Response all merchants data
     */
    protected function getAllBranches(Request $request){

        //get all registered companies 
        $getbranches = DB::table('company_branches')
        ->join('merchants', 'merchants.id', '=', 'merchant_id')
        ->join('branch_super_executive', 'branch_super_executive.id', '=', 'branch_super_id')
        ->join('branch_admin', 'branch_admin.id', '=', 'branch_admin_id')
        ->select('company_branches.*','merchants.merchant_name AS merchant_name','branch_super_executive.name AS exec_name','branch_admin.name AS admin_name')
        ->simplePaginate(15);

        //clean data
        $branchessdata = [];

        $branches = $getbranches->map(function($items){
            $branchessdata['id'] = $items->id;
            $branchessdata['branch_name'] = Crypt::decryptString($items->branchname);
            $branchessdata['status'] = $items->status;
            $branchessdata['status'] = $items->status;
            $branchessdata['merchant_id'] = $items->merchant_id;
            $branchessdata['merchant_name'] = Crypt::decryptString($items->merchant_name);
            $branchessdata['branch_super_executive_id'] = $items->branch_super_id;
            $branchessdata['branch_super_executive_name'] = Crypt::decryptString($items->exec_name);
            $branchessdata['branch_admin_id'] = $items->branch_admin_id;
            $branchessdata['branch_admin_name'] = Crypt::decryptString($items->admin_name);
            $branchessdata['created_by'] = $items->created_by;
            $branchessdata['updated_by'] = $items->updated_by;
            $branchessdata['created_at'] = $items->created_at;
            $branchessdata['updated_at'] = $items->updated_at;

            return $branchessdata;
         });

         $response = [
            'branches' => $branches
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
    protected function getCompanyBranches(Request $request, $id){

        //get all registered companies 
        $getbranches = DB::table('company_branches')
        ->join('merchants', 'merchants.id', '=', 'merchant_id')
        ->join('branch_super_executive', 'branch_super_executive.id', '=', 'branch_super_id')
        ->join('branch_admin', 'branch_admin.id', '=', 'branch_admin_id')
        ->select('company_branches.*','merchants.merchant_name AS merchant_name','branch_super_executive.name AS exec_name','branch_admin.name AS admin_name')
       ->where('merchant_id', $id)
       ->simplePaginate(15);

        //clean data
        $branchessdata = [];

        $branches = $getbranches->map(function($items){
            $branchessdata['id'] = $items->id;
            $branchessdata['branch_name'] = Crypt::decryptString($items->branchname);
            $branchessdata['status'] = $items->status;
            $branchessdata['status'] = $items->status;
            $branchessdata['merchant_id'] = $items->merchant_id;
            $branchessdata['merchant_name'] = Crypt::decryptString($items->merchant_name);
            $branchessdata['branch_super_executive_id'] = $items->branch_super_id;
            $branchessdata['branch_super_executive_name'] = Crypt::decryptString($items->exec_name);
            $branchessdata['branch_admin_id'] = $items->branch_admin_id;
            $branchessdata['branch_super_executive_id'] = $items->branch_super_id;
            $branchessdata['branch_admin_id'] = $items->branch_admin_id;
            $branchessdata['created_by'] = $items->created_by;
            $branchessdata['updated_by'] = $items->updated_by;
            $branchessdata['created_at'] = $items->created_at;
            $branchessdata['updated_at'] = $items->updated_at;

            return $branchessdata;
         });

         $response = [
            'branches' => $branches
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
    protected function getCompanyBranchDetails(Request $request, $id){

        //get all registered companies 
        $getbranch = DB::table('company_branches')
        ->join('merchants', 'merchants.id', '=', 'merchant_id')
        ->join('branch_super_executive', 'branch_super_executive.id', '=', 'branch_super_id')
        ->join('branch_admin', 'branch_admin.id', '=', 'branch_admin_id')
        ->select('company_branches.*','merchants.merchant_name AS merchant_name','branch_super_executive.name AS exec_name','branch_admin.name AS admin_name')
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
            $branchessdata['branch_super_executive_id'] = $items->branch_super_id;
            $branchessdata['branch_super_executive_name'] = Crypt::decryptString($items->exec_name);
            $branchessdata['branch_admin_id'] = $items->branch_admin_id;
            $branchessdata['branch_super_executive_id'] = $items->branch_super_id;
            $branchessdata['branch_admin_id'] = $items->branch_admin_id;
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
}
