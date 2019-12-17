<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use DB;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Pagination\Paginator;
use Illuminate\Support\Facades\Log;
class FrontDeskController extends Controller
{
    /**
     * getAllSubmittedForms get all submitted forms
     *
     * @param  mixed $request
     *
     * @return void\Illuminate\Http\Response all details of submitted form
     */
    public function getAllSubmittedForms(Request $request){
 
        $getsubmittedform = DB::table('submitted_forms')
        ->join('users', 'users.id', '=', 'client_id')
        ->join('forms', 'forms.form_code', '=', 'form_id')
        ->join('merchants', 'merchants.id', '=', 'forms.merchant_id')
        ->select('submitted_forms.*','merchants.merchant_name AS merchant_name',
        'users.name', 'users.email', 'forms.name AS form_name', 'forms.form_fields', 'forms.can_view')
        ->paginate(15);
      
        //clean data
        $submittedformdata = [];

        $getsubmittedform->transform(function($items){
            $submittedformdata['submission_code'] = $items->submission_code;
            $submittedformdata['form_code'] = $items->form_id;
            $submittedformdata['form_name'] = Crypt::decryptString($items->form_name);
            $submittedformdata['form_fields'] = json_decode(Crypt::decryptString($items->form_fields));
            $submittedformdata['merchant_name'] = Crypt::decryptString($items->merchant_name);
            $submittedformdata['client_id'] = $items->client_id;
            $submittedformdata['client_name'] = $items->name;
            $submittedformdata['email'] = $items->email;
            $submittedformdata['can_view'] = $items->can_view;
            $submittedformdata['client_submitted_details'] = json_decode(Crypt::decryptString($items->client_details));
            $submittedformdata['form_status'] = $items->status;
            $submittedformdata['submitted_at'] = $items->submitted_at;
            $submittedformdata['last_processed'] = $items->last_processed;
            $submittedformdata['processed_by'] = $items->processed_by;

            return $submittedformdata;
         });
        
         $response = [
            'submitted_forms' => $getsubmittedform
        ];
        return response()->json($response, 200);

    }


    /**
     * getAllSubmittedForms get all submitted forms
     *
     * @param  mixed $request
     * @param  mixed $id of the merchant
     * @return void\Illuminate\Http\Response all details of a form
     */
    public function getAllSubmittedFormsByMerchant(Request $request, $id){

        $getsubmittedform = DB::table('submitted_forms')
        ->join('users', 'users.id', '=', 'client_id')
        ->join('forms', 'forms.form_code', '=', 'form_id')
        ->join('merchants', 'merchants.id', '=', 'forms.merchant_id')
        ->select('submitted_forms.*','merchants.merchant_name AS merchant_name',
        'users.name', 'users.email', 'forms.name AS form_name', 'forms.form_fields', 'forms.can_view')
        ->where('merchants.id', $id)
        ->paginate(15);
      
        //clean data
        $submittedformdata = [];

        $getsubmittedform->transform(function($items){
            $submittedformdata['submission_code'] = $items->submission_code;
            $submittedformdata['form_code'] = $items->form_id;
            $submittedformdata['form_name'] = Crypt::decryptString($items->form_name);
            $submittedformdata['form_fields'] = json_decode(Crypt::decryptString($items->form_fields));
            $submittedformdata['merchant_name'] = Crypt::decryptString($items->merchant_name);
            $submittedformdata['client_id'] = $items->client_id;
            $submittedformdata['client_name'] = $items->name;
            $submittedformdata['email'] = $items->email;
            $submittedformdata['can_view'] = $items->can_view;
            $submittedformdata['client_submitted_details'] = json_decode(Crypt::decryptString($items->client_details));
            $submittedformdata['form_status'] = $items->status;
            $submittedformdata['submitted_at'] = $items->submitted_at;
            $submittedformdata['last_processed'] = $items->last_processed;
            $submittedformdata['processed_by'] = $items->processed_by;

            return $submittedformdata;
         });
    
         $response = [
            'submitted_forms' => $getsubmittedform
        ];
        return response()->json($response, 200);

    }

     /**
     * getSubmittedFormByCode get form by code
     *
     * @param  mixed $request
     *
     * @return void\Illuminate\Http\Response all details of submitted form
     */
    public function getSubmittedFormByCode(Request $request, $code){

        $getsubmittedform = DB::table('submitted_forms')
        ->join('users', 'users.id', '=', 'client_id')
        ->join('forms', 'forms.form_code', '=', 'form_id')
        ->join('merchants', 'merchants.id', '=', 'forms.merchant_id')
        ->select('submitted_forms.*','merchants.merchant_name AS merchant_name',
        'users.name', 'users.email', 'forms.name AS form_name', 'forms.form_fields', 'forms.can_view')
        ->where('submission_code', $code)
        ->get();
      
        //clean data
        $submittedformdata = [];

        $submittedform = $getsubmittedform->map(function($items){
            $submittedformdata['submission_code'] = $items->submission_code;
            $submittedformdata['form_code'] = $items->form_id;
            $submittedformdata['form_name'] = Crypt::decryptString($items->form_name);
            $submittedformdata['form_fields'] = json_decode(Crypt::decryptString($items->form_fields));
            $submittedformdata['merchant_name'] = Crypt::decryptString($items->merchant_name);
            $submittedformdata['client_id'] = $items->client_id;
            $submittedformdata['client_name'] = $items->name;
            $submittedformdata['email'] = $items->email;
            $submittedformdata['can_view'] = $items->can_view;
            $submittedformdata['client_submitted_details'] = json_decode(Crypt::decryptString($items->client_details));
            $submittedformdata['form_status'] = $items->status;
            $submittedformdata['submitted_at'] = $items->submitted_at;
            $submittedformdata['last_processed'] = $items->last_processed;
            $submittedformdata['processed_by'] = $items->processed_by;

            return $submittedformdata;
         });

         $response = [
            'submitted_form' => $submittedform
        ];
        return response()->json($response, 200);

    }

    /**
     * FrontDeskGetSubmittedFormByCode get submitted form by id and merchant
     * This avoid front desk people from viewing forms submitted to other merchants
     *
     * @param  mixed $request
     *  @param  mixed $id of the merchant
     *
     * @return void\Illuminate\Http\Response all details of submitted form
     */
    public function FrontDeskGetSubmittedFormByCode(Request $request, $code, $id){

        $getsubmittedform = DB::table('submitted_forms')
        ->join('users', 'users.id', '=', 'client_id')
        ->join('forms', 'forms.form_code', '=', 'form_id')
        ->join('merchants', 'merchants.id', '=', 'forms.merchant_id')
        ->select('submitted_forms.*','merchants.merchant_name AS merchant_name',
        'users.name', 'users.email', 'forms.name AS form_name', 'forms.form_fields', 'forms.can_view')
        ->where('submission_code', $code)
        ->where('forms.merchant_id', $id)
        ->get();
      
        //clean data
        $submittedformdata = [];

        $submittedform = $getsubmittedform->map(function($items){
            $submittedformdata['submission_code'] = $items->submission_code;
            $submittedformdata['form_code'] = $items->form_id;
            $submittedformdata['form_name'] = Crypt::decryptString($items->form_name);
            $submittedformdata['form_fields'] = json_decode(Crypt::decryptString($items->form_fields));
            $submittedformdata['merchant_name'] = Crypt::decryptString($items->merchant_name);
            $submittedformdata['client_id'] = $items->client_id;
            $submittedformdata['client_name'] = $items->name;
            $submittedformdata['email'] = $items->email;
            $submittedformdata['can_view'] = $items->can_view;
            $submittedformdata['client_submitted_details'] = json_decode(Crypt::decryptString($items->client_details));
            $submittedformdata['form_status'] = $items->status;
            $submittedformdata['submitted_at'] = $items->submitted_at;
            $submittedformdata['last_processed'] = $items->last_processed;
            $submittedformdata['processed_by'] = $items->processed_by;

            return $submittedformdata;
         });

         $response = [
            'submitted_form' => $submittedform
        ];
        return response()->json($response, 200);

    }



    /**
     * getSubmittedFormByStatusAndMerchant get all submitted forms by merchant and status 
     *
     * @param  mixed $request
     * @param  mixed $status stautus of submitted forms to sort by
     * @param  mixed $id id of merchant for the submitted forms
     * @return void\Illuminate\Http\Response all details of submitted form
     */
    public function getSubmittedFormByStatusAndMerchant(Request $request, $status, $id){

        $getsubmittedforms = DB::table('submitted_forms')
        ->join('users', 'users.id', '=', 'client_id')
        ->join('forms', 'forms.form_code', '=', 'form_id')
        ->join('merchants', 'merchants.id', '=', 'forms.merchant_id')
        ->select('submitted_forms.*','merchants.merchant_name AS merchant_name',
        'users.name', 'users.email', 'forms.name AS form_name', 'forms.form_fields', 'forms.can_view')
        ->where('submitted_forms.status', $status)
        ->where('merchants.id', $id)
        ->paginate(15);
      
        //clean data
        $submittedformdata = [];

        $getsubmittedforms->transform(function($items){
            $submittedformdata['submission_code'] = $items->submission_code;
            $submittedformdata['form_code'] = $items->form_id;
            $submittedformdata['form_name'] = Crypt::decryptString($items->form_name);
            $submittedformdata['form_fields'] = json_decode(Crypt::decryptString($items->form_fields));
            $submittedformdata['merchant_name'] = Crypt::decryptString($items->merchant_name);
            $submittedformdata['client_id'] = $items->client_id;
            $submittedformdata['client_name'] = $items->name;
            $submittedformdata['email'] = $items->email;
            $submittedformdata['can_view'] = $items->can_view;
            $submittedformdata['client_submitted_details'] = json_decode(Crypt::decryptString($items->client_details));
            $submittedformdata['form_status'] = $items->status;
            $submittedformdata['submitted_at'] = $items->submitted_at;
            $submittedformdata['last_processed'] = $items->last_processed;
            $submittedformdata['processed_by'] = $items->processed_by;

            return $submittedformdata;
         });
        
         $response = [
            'submitted_forms' => $getsubmittedforms
        ];
        return response()->json($response, 200);

    }


    /**
     * processSubmitForm process a submitted form that has not been fully processed
     *
     * @param  \Illuminate\Http\Request  $request
     * @param $code submission code that is being processed 
     * @param $status new processing state stage
     * @return void\Illuminate\Http\Response error or success message
     */
    public function processSubmitForm(Request $request, $code, $status)
    {
         $message = 'Ok';

         //get all registered companies 
        $getsubmittedform = DB::table('submitted_forms')
        ->where('submission_code', $code)
        ->first();

        if($getsubmittedform->status == 2){

            return response()->json([
                'message' => 'Form already processed'
            ], 200);

        }

         //get, encode and encrypt all user details in teh form
         $data = $request->all();
         $encodeddata = json_encode($data);
         $encrypteddata = Crypt::encryptString($encodeddata);

         $last_processed = now();
         $user = $request->user();
         $userid = $user['id'];
     
         //save new client in the database
         try {
             DB::table('submitted_forms')
             ->where('submission_code',$code)
             ->update(
                 [
                     'client_details' => $encrypteddata,
                     'last_processed' => $last_processed, 
                     'processed_by' => $userid,
                     'status' => $status
                 ]
             );
             Log::channel('mysql')->info('User with id: ' . $userid .' successsfully processed a form with code: '. $code . 'new status: '. $status);
             $message = 'Ok';
 
         }catch(Exception $e) {
            Log::channel('mysql')->error('User with id: ' . $userid .' unsuccesssfully processed a form with code: '. $code);
             $message = "Failed";
         }   
 
        
        return response()->json([
            'message' => $message
        ], 200);
            
    }


     /**
     * FormsProcessedByFrontDeskPerson forms processed by a particular front desk person
     * on a particular date range
     *
     * @param  \Illuminate\Http\Request  $request
     * @param $id of front desk person
     * @param $startdate start date range 
     * @param $enddate start date range 
     * @return void\Illuminate\Http\Response all details of submitted form
     * 
     */
    public function FormsProcessedByFrontDeskPerson(Request $request, $id, $startdate, $enddate)
    {
        $startdate = date($startdate);
        $enddate = date($enddate);

        $getprocessedforms = DB::table('submitted_forms')
        ->join('users', 'users.id', '=', 'client_id')
        ->join('forms', 'forms.form_code', '=', 'form_id')
        ->join('merchants', 'merchants.id', '=', 'forms.merchant_id')
        ->select('submitted_forms.*','merchants.merchant_name AS merchant_name',
        'users.name', 'users.email', 'forms.name AS form_name', 'forms.form_fields')
        ->where('submitted_forms.processed_by', $id)
        ->whereBetween('last_processed', [$startdate, $enddate])
        ->paginate(15);
      
        //clean data
        $submittedformdata = [];

        $getprocessedforms->transform(function($items){
            $submittedformdata['submission_code'] = $items->submission_code;
            $submittedformdata['form_code'] = $items->form_id;
            $submittedformdata['form_name'] = Crypt::decryptString($items->form_name);
            $submittedformdata['form_fields'] = json_decode(Crypt::decryptString($items->form_fields));
            $submittedformdata['merchant_name'] = Crypt::decryptString($items->merchant_name);
            $submittedformdata['client_id'] = $items->client_id;
            $submittedformdata['client_name'] = $items->name;
            $submittedformdata['email'] = $items->email;
            $submittedformdata['client_submitted_details'] = json_decode(Crypt::decryptString($items->client_details));
            $submittedformdata['form_status'] = $items->status;
            $submittedformdata['submitted_at'] = $items->submitted_at;
            $submittedformdata['last_processed'] = $items->last_processed;
            $submittedformdata['processed_by'] = $items->processed_by;

            return $submittedformdata;
         });
       
         $response = [
            'processed_forms' => $getprocessedforms
        ];
        return response()->json($response, 200);
    }


    /**
     * numFormsProcessedByFrontDeskPerson get the number of forms processed by a particular front desk person
     * on a particular date range
     *
     * @param  \Illuminate\Http\Request  $request
     * @param $id of front desk person
     * @param $startdate start date range 
     * @param $enddate start date range 
     * @return int number of forms processed
     */
    public function numFormsProcessedByFrontDeskPerson(Request $request, $id, $startdate, $enddate)
    {
        
        $getnumprocessedforms = DB::table('submitted_forms')
        ->where('submitted_forms.processed_by', $id)
        ->whereBetween('last_processed', [$startdate, $enddate])
        ->count();
      

         $response = [
            'num_processed_forms' => $getnumprocessedforms
        ];
        return response()->json($response, 200);
    }


    /**
     * getAllFormsProcessedByFrontDeskPerson forms processed by a particular front desk person
     * of all time
     *
     * @param  \Illuminate\Http\Request  $request
     * @param $id of front desk person
     * @return void\Illuminate\Http\Response all details of submitted form
     * 
     */
    public function getAllFormsProcessedByFrontDeskPerson(Request $request, $id)
    {
        
        $getprocessedforms = DB::table('submitted_forms')
        ->join('users', 'users.id', '=', 'client_id')
        ->join('forms', 'forms.form_code', '=', 'form_id')
        ->join('merchants', 'merchants.id', '=', 'forms.merchant_id')
        ->select('submitted_forms.*','merchants.merchant_name AS merchant_name',
        'users.name', 'users.email', 'forms.name AS form_name', 'forms.form_fields')
        ->where('submitted_forms.processed_by', $id)
        ->paginate(15);
      
        //clean data
        $submittedformdata = [];

        $getprocessedforms->transform(function($items){
            $submittedformdata['submission_code'] = $items->submission_code;
            $submittedformdata['form_code'] = $items->form_id;
            $submittedformdata['form_name'] = Crypt::decryptString($items->form_name);
            $submittedformdata['form_fields'] = json_decode(Crypt::decryptString($items->form_fields));
            $submittedformdata['merchant_name'] = Crypt::decryptString($items->merchant_name);
            $submittedformdata['client_id'] = $items->client_id;
            $submittedformdata['client_name'] = $items->name;
            $submittedformdata['email'] = $items->email;
            $submittedformdata['client_submitted_details'] = json_decode(Crypt::decryptString($items->client_details));
            $submittedformdata['form_status'] = $items->status;
            $submittedformdata['submitted_at'] = $items->submitted_at;
            $submittedformdata['last_processed'] = $items->last_processed;
            $submittedformdata['processed_by'] = $items->processed_by;

            return $submittedformdata;
         });
         
         $response = [
            'processed_forms' => $getprocessedforms
        ];
        return response()->json($response, 200);
    }


    /**
     * getNumAllFormsProcessedByFrontDeskPerson get num of forms processed by a particular front desk person
     * of all time
     *
     * @param  \Illuminate\Http\Request  $request
     * @param $id of front desk person
     * @return void\Illuminate\Http\Response all details of submitted form
     * 
     */
    public function getNumAllFormsProcessedByFrontDeskPerson(Request $request, $id)
    {
        
        $getprocessedforms = DB::table('submitted_forms')
        ->where('submitted_forms.processed_by', $id)
        ->count();

         $response = [
            'num_processed_forms' => $getprocessedforms
        ];
        return response()->json($response, 200);
    }

  /**
     * viewRespondentData get all respondents data for a particular form
     *
     * @param  \Illuminate\Http\Request  $request
     * @param $code form code 
     * @return void\Illuminate\Http\Response all details of respondents
     * 
     */
    public function viewRespondentData(Request $request, $code)
    {
        $getrespondentsdata = DB::table('submitted_forms')
        ->select('submitted_forms.*')
        ->where('form_id', $code)
        ->paginate(15);

        //clean data
        $submitteddata = [];

        $getrespondentsdata->transform(function($items){
            $submittedformdata['submission_code'] = $items->submission_code;
            $submittedformdata['form_code'] = $items->form_id;
            $submittedformdata['client_id'] = $items->client_id;
            $submittedformdata['client_submitted_details'] = json_decode(Crypt::decryptString($items->client_details));
            $submittedformdata['form_status'] = $items->status;
            $submittedformdata['submitted_at'] = $items->submitted_at;
            $submittedformdata['last_processed'] = $items->last_processed;
            $submittedformdata['processed_by'] = $items->processed_by;

            return $submittedformdata;
         });
         
         $response = [
            'respondents_data' => $getrespondentsdata
        ];
        return response()->json($response, 200);

    }
}
