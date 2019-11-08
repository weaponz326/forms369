<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

use Illuminate\Support\Facades\Crypt;

use DB;

class FormsController extends Controller
{
    
    /**
     * Store a newly created form in the database
     *
     * @param  \Illuminate\Http\Request  $request
     * @return void\Illuminate\Http\Response success or error message
     */
    public function storeForm(Request $request)
    {

        $this->validate($request, [
            'form_fields' => 'required',
            'name' => 'required',
            'merchant_id' => 'required',
            'form_code' => 'required|unique:forms',
            'status' => 'required'
        ]); 
       

        //request all data on submit
        $formfields = Crypt::encryptString(json_encode($request->form_fields));
        $branch_id = $request->branch_id;
        $merchant_id = $request->merchant_id;
        $form_code = $request->form_code;
        $status = $request->status;
        $name = Crypt::encryptString($request->name);

        $created_at = now();

        //get user creating the new merchant
        $user = $request->user();
        $userid = $user['id'];

        //save new merchant in the database
        try {
            DB::table('forms')->insert(
                [
                    'form_code' => $form_code, 
                    'name' => $name,
                    'form_fields' => $formfields,
                    'status' => $status, 
                    'merchant_id' => $merchant_id,
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
     * editForm edit a form in the database
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Illuminate\Http\Request  $code code of the form to be editted 
     * @return void\Illuminate\Http\Response success or error message
     */
    public function editForm(Request $request, $code)
    {

        $this->validate($request, [
            'form_fields' => 'required',
            'name' => 'required',
            'merchant_id' => 'required',
            'form_code' => 'required',
            'status' => 'required'
        ]); 
       

        //request all data on submit
        $formfields = Crypt::encryptString(json_encode($request->form_fields));
        $branch_id = $request->branch_id;
        $merchant_id = $request->merchant_id;
        $form_code = $request->form_code;
        $status = $request->status;
        $name = Crypt::encryptString($request->name);

        $updated_at = now();

        //get user creating the new merchant
        $user = $request->user();
        $userid = $user['id'];

        //save new merchant in the database
        try {
            DB::table('forms')
            ->where('form_code', $form_code)
            ->update(
                [
                    'form_code' => $form_code, 
                    'name' => $name,
                    'form_fields' => $formfields,
                    'status' => $status, 
                    'merchant_id' => $merchant_id,
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
     * changeFormStatus chnage the status of a form in the database
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Illuminate\Http\Request  $code code of the form to be editted 
     * @param  \Illuminate\Http\Request  $status new status of the form 
     * @return void\Illuminate\Http\Response success or error message
     */
    public function changeFormStatus(Request $request, $code, $status)
    {

        $updated_at = now();

        //get user creating the new merchant
        $user = $request->user();
        $userid = $user['id'];

        //save new merchant in the database
        try {
            DB::table('forms')
            ->where('form_code', $code)
            ->update(
                [
                    'status' => $status, 
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
     * recoverForm recover a form that was initially deleted
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Illuminate\Http\Request  $code code of the form to be recovered 
     *
     * @return void\Illuminate\Http\Response success or error message
     */
    public function recoverForm(Request $request, $code)
    {

        $updated_at = now();

        //get user creating the new merchant
        $user = $request->user();
        $userid = $user['id'];

        //save new merchant in the database
        try {
            DB::table('forms')
            ->where('form_code', $code)
            ->update(
                [
                    'status' => 'Published', 
                    'updated_by' => $userid, 
                    'updated_at' => $updated_at,
                    'deleted_at' => null,
                    'deleted_by' => 0
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
     * deleteForm deleted or archive a form
     *
     * @param  \Illuminate\Http\Request  $request
     * @param $code code of the form to be deleted 
     *
     * @return void\Illuminate\Http\Response success or error message
     */
    public function deleteForm(Request $request, $code)
    {

        $deleted_at = now();

        //get user creating the new merchant
        $user = $request->user();
        $userid = $user['id'];

        //save new merchant in the database
        try {
            DB::table('forms')
            ->where('form_code', $code)
            ->update(
                [
                    'status' => 'Deleted', 
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
     * getFformDetails get all details of a form
     *
     * @param  mixed $request
     * @param  mixed $code form code 
     *
     * @return void\Illuminate\Http\Response all details of a form
     */
    protected function getFormDetails(Request $request, $code){

        //get all registered companies 
        $getform = DB::table('forms')
        ->join('merchants', 'merchants.id', '=', 'merchant_id')
        ->select('forms.*','merchants.merchant_name AS merchant_name')
        ->where('form_code', $code)
        ->get();
      
        //clean data
        $formdata = [];

        $form = $getform->map(function($items){
            $formdata['form_code'] = $items->form_code;
            $formdata['name'] = Crypt::decryptString($items->name);
            $formdata['status'] = $items->status;
            $formdata['form_fields'] = json_decode(Crypt::decryptString($items->form_fields));
            $formdata['merchant_id'] = $items->merchant_id;
            $formdata['merchant_name'] = Crypt::decryptString($items->merchant_name);
            $formdata['created_by'] = $items->created_by;
            $formdata['created_at'] = $items->created_at;
            $formdata['updated_at'] = $items->updated_at;
            $formdata['updated_by'] = $items->updated_by;

            return $formdata;
         });

         $response = [
            'form' => $form
        ];
        return response()->json($response, 200);

    }


    /**
     * getFformDetails get all details of a form
     *
     * @param  mixed $request
     *
     * @return void\Illuminate\Http\Response all details of a form
     */
    protected function getAllForms(Request $request){

        //get all registered companies 
        $getforms = DB::table('forms')
        ->join('merchants', 'merchants.id', '=', 'merchant_id')
        ->select('forms.*','merchants.merchant_name AS merchant_name')
        ->where('merchants.status', 1)
        ->where('forms.deleted_at', null)
        ->simplePaginate(15);
      
        //clean data
        $formdata = [];

        $forms = $getforms->map(function($items){
            $formdata['form_code'] = $items->form_code;
            $formdata['name'] = Crypt::decryptString($items->name);
            $formdata['status'] = $items->status;
            $formdata['form_fields'] = json_decode(Crypt::decryptString($items->form_fields));
            $formdata['merchant_id'] = $items->merchant_id;
            $formdata['merchant_name'] = Crypt::decryptString($items->merchant_name);
            $formdata['created_by'] = $items->created_by;
            $formdata['created_at'] = $items->created_at;
            $formdata['updated_at'] = $items->updated_at;
            $formdata['updated_by'] = $items->updated_by;

            return $formdata;
         });

         $response = [
            'forms' => $forms
        ];
        return response()->json($response, 200);

    }

    /**
     * getNumAllForms get num of all form
     *
     * @param  mixed $request
     *
     * @return void\Illuminate\Http\Response all details of a form
     */
    protected function getNumAllForms(Request $request){

        //get all registered companies 
        $getnumforms = DB::table('forms')
        ->join('merchants', 'merchants.id', '=', 'merchant_id')
        ->select('forms.*','merchants.merchant_name AS merchant_name')
        ->where('merchants.status', 1)
        ->where('forms.deleted_at', null)
        ->count();
      
        $response = [
            'num_forms' => $getnumforms
        ];
        return response()->json($response, 200);

    }

    /**
     * getAllFormsByStatus get all details of all forms by status
     *
     * @param  mixed $request
     * @param  mixed $status form status 
     *
     * @return void\Illuminate\Http\Response all details of forms
     */
    protected function getAllFormsByStatus(Request $request, $status){

        //get all registered companies 
        $getforms = DB::table('forms')
        ->join('merchants', 'merchants.id', '=', 'merchant_id')
        ->select('forms.*','merchants.merchant_name AS merchant_name')
        ->where('forms.status', $status)
        ->where('merchants.status', 1)
        ->where('forms.deleted_at', null)
        ->simplePaginate(15);
      
        //clean data
        $formdata = [];

        $forms = $getforms->map(function($items){
            $formdata['form_code'] = $items->form_code;
            $formdata['name'] = Crypt::decryptString($items->name);
            $formdata['status'] = $items->status;
            $formdata['form_fields'] = json_decode(Crypt::decryptString($items->form_fields));
            $formdata['merchant_id'] = $items->merchant_id;
            $formdata['merchant_name'] = Crypt::decryptString($items->merchant_name);
            $formdata['created_by'] = $items->created_by;
            $formdata['created_at'] = $items->created_at;
            $formdata['updated_at'] = $items->updated_at;
            $formdata['updated_by'] = $items->updated_by;

            return $formdata;
         });

         $response = [
            'forms' => $forms
        ];
        return response()->json($response, 200);

    }

    /**
     * getAllFormsByMerchant get all dforms for a particular merchant
     *
     * @param  mixed $request
     * @param  mixed $id id of the merchant
     *
     * @return void\Illuminate\Http\Response all details of a form
     */
    protected function getAllFormsByMerchant(Request $request, $id){

        //get all registered companies 
        $getforms = DB::table('forms')
        ->join('merchants', 'merchants.id', '=', 'merchant_id')
        ->select('forms.*','merchants.merchant_name AS merchant_name')
        ->where('forms.merchant_id', $id)
        ->where('forms.deleted_at', null)
        ->simplePaginate(15);
      
        //clean data
        $formdata = [];

        $forms = $getforms->map(function($items){
            $formdata['form_code'] = $items->form_code;
            $formdata['name'] = Crypt::decryptString($items->name);
            $formdata['status'] = $items->status;
            $formdata['form_fields'] = json_decode(Crypt::decryptString($items->form_fields));
            $formdata['merchant_id'] = $items->merchant_id;
            $formdata['merchant_name'] = Crypt::decryptString($items->merchant_name);
            $formdata['created_by'] = $items->created_by;
            $formdata['created_at'] = $items->created_at;
            $formdata['updated_at'] = $items->updated_at;
            $formdata['updated_by'] = $items->updated_by;

            return $formdata;
         });

         $response = [
            'forms' => $forms
        ];
        return response()->json($response, 200);

    }

    /**
     * getAllFormsByStatus get all details of all forms by status
     *
     * @param  mixed $request
     * @param  mixed $status form status 
     *@param  mixed $id merchant id
     * @return void\Illuminate\Http\Response all details of forms
     */
    protected function getAllFormsByStatusAndMerchant(Request $request, $status, $id){

        //get all registered companies 
        $getforms = DB::table('forms')
        ->join('merchants', 'merchants.id', '=', 'merchant_id')
        ->select('forms.*','merchants.merchant_name AS merchant_name')
        ->where('forms.status', $status)
        ->where('forms.merchant_id', $id)
        ->where('forms.deleted_at', null)
        ->simplePaginate(15);
      
        //clean data
        $formdata = [];

        $forms = $getforms->map(function($items){
            $formdata['form_code'] = $items->form_code;
            $formdata['name'] = Crypt::decryptString($items->name);
            $formdata['status'] = $items->status;
            $formdata['form_fields'] = json_decode(Crypt::decryptString($items->form_fields));
            $formdata['merchant_id'] = $items->merchant_id;
            $formdata['merchant_name'] = Crypt::decryptString($items->merchant_name);
            $formdata['created_by'] = $items->created_by;
            $formdata['created_at'] = $items->created_at;
            $formdata['updated_at'] = $items->updated_at;
            $formdata['updated_by'] = $items->updated_by;

            return $formdata;
         });

         $response = [
            'forms' => $forms
        ];
        return response()->json($response, 200);

    }

    
    


}   