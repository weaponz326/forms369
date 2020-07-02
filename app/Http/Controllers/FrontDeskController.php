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
        ->select('submitted_forms.*','merchants.merchant_name AS merchant_name', 'merchants.nickname',
        'users.name', 'users.email', 'forms.name AS form_name', 'forms.form_fields', 'forms.join_queue', 'forms.can_view')
        ->where('submitted_forms.status', '!=' , 4)
        ->orderBy('submitted_at', 'desc')
        ->paginate(15);
      
        //clean data
        $submittedformdata = [];

        $getsubmittedform->transform(function($items){
            $submittedformdata['submission_code'] = $items->submission_code;
            $submittedformdata['form_code'] = $items->form_id;
            $submittedformdata['form_name'] = Crypt::decryptString($items->form_name);
            $submittedformdata['form_fields'] = json_decode(Crypt::decryptString($items->form_fields));
            $submittedformdata['join_queue'] = $items->join_queue;
            $submittedformdata['merchant_name'] = Crypt::decryptString($items->merchant_name);
            $submittedformdata['nickname'] = $items->nickname;
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
        ->select('submitted_forms.*','merchants.merchant_name AS merchant_name', 'merchants.nickname',
        'users.name', 'users.email', 'forms.name AS form_name', 'forms.form_fields', 'forms.join_queue', 'forms.can_view')
        ->where('merchants.id', $id)
        ->where('submitted_forms.status', '!=' , 4)
        ->orderBy('submitted_at', 'desc')
        ->paginate(15);
      
        //clean data
        $submittedformdata = [];

        $getsubmittedform->transform(function($items){
            $submittedformdata['submission_code'] = $items->submission_code;
            $submittedformdata['form_code'] = $items->form_id;
            $submittedformdata['form_name'] = Crypt::decryptString($items->form_name);
            $submittedformdata['form_fields'] = json_decode(Crypt::decryptString($items->form_fields));
            $submittedformdata['join_queue'] = $items->join_queue;
            $submittedformdata['merchant_name'] = Crypt::decryptString($items->merchant_name);
            $submittedformdata['nickname'] = $items->nickname;
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
        ->select('submitted_forms.*','merchants.merchant_name AS merchant_name', 'merchants.nickname',
        'users.name', 'users.email', 'forms.name AS form_name', 'forms.form_fields', 'forms.join_queue','forms.can_view')
        ->where('submission_code', $code)
        ->where('submitted_forms.status', '!=' , 4)
        ->get();
      
        //clean data
        $submittedformdata = [];

        $submittedform = $getsubmittedform->map(function($items){
            $submittedformdata['submission_code'] = $items->submission_code;
            $submittedformdata['form_code'] = $items->form_id;
            $submittedformdata['form_name'] = Crypt::decryptString($items->form_name);
            $submittedformdata['form_fields'] = json_decode(Crypt::decryptString($items->form_fields));
            $submittedformdata['join_queue'] = $items->join_queue;
            $submittedformdata['merchant_name'] = Crypt::decryptString($items->merchant_name);
            $submittedformdata['nickname'] = $items->nickname;
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
        ->select('submitted_forms.*','merchants.merchant_name AS merchant_name', 'merchants.nickname',
        'users.name', 'users.email', 'forms.name AS form_name', 'forms.form_fields', 'forms.join_queue', 'forms.can_view')
        ->where('submission_code', $code)
        ->where('forms.merchant_id', $id)
        ->whereNotIn('submitted_forms.status', [4, 5])
        ->get();
      
        //clean data
        $submittedformdata = [];

        $submittedform = $getsubmittedform->map(function($items){
            $submittedformdata['submission_code'] = $items->submission_code;
            $submittedformdata['form_code'] = $items->form_id;
            $submittedformdata['form_name'] = Crypt::decryptString($items->form_name);
            $submittedformdata['form_fields'] = json_decode(Crypt::decryptString($items->form_fields));
            $submittedformdata['join_queue'] = $items->join_queue;
            $submittedformdata['merchant_name'] = Crypt::decryptString($items->merchant_name);
            $submittedformdata['nickname'] = $items->nickname;
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
     * checkBranchSubmittedTo frontdesk check if form was submitted to his/her branch
     * This avoid front desk people from viewing forms submitted to other branches
     *
     * @param  mixed $request
     *  @param  mixed $id of frontdesk user
     *
     * @return void\Illuminate\Http\Response all details of submitted form
     */
     public function checkBranchSubmittedTo(Request $request, $code)
     {

        //get logged in user
        $user = $request->user();
        $id = $user['id'];

        $getsubmittedform = DB::table('submitted_forms')
        ->join('forms', 'forms.form_code', '=', 'form_id')
        ->select('forms.merchant_id', 'submitted_forms.status', 'branch_submitted_to')
        ->where('submission_code', $code)
        ->first();

        $getuser = DB::table('users')
        ->where('id', $id)
        ->select('merchant_id', 'branch_id')
        ->first();

        if(!empty($getsubmittedform) && $getsubmittedform != null){
            if($getsubmittedform->merchant_id == $getuser->merchant_id){
               if($getsubmittedform->status !=5){
                    if($getsubmittedform->branch_submitted_to == $getuser->branch_id)
                    {
                        return response()->json([
                            'message' => 'OK'
                        ], 200);
                     
                   }
                   else{
                    return response()->json([
                        'message' => 'WRONG_BRANCH'
                    ], 400);
                   }
                
               }
               else{
                return response()->json([
                    'message' => 'REVERSED'
                ], 350);
               }
            }
            else{
                return response()->json([
                    'message' => 'WRONG_MERCHANT'
                ], 300);
            }
        }
        else{
            return response()->json([
                'message' => 'INCORRECT_CODE'
            ], 250);
        }
        
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
        ->select('submitted_forms.*','merchants.merchant_name AS merchant_name', 'merchants.nickname',
        'users.name', 'users.email', 'forms.name AS form_name', 'forms.form_fields', 'forms.join_queue', 'forms.can_view')
        ->where('submitted_forms.status', $status)
        ->where('merchants.id', $id)
        ->get();
        // ->paginate(15);

        $getdeletedsubmittedforms = DB::table('submitted_forms_deleted')
            ->join('users', 'users.id', '=', 'client_id')
            ->join('forms', 'forms.form_code', '=', 'form_id')
            ->join('merchants', 'merchants.id', '=', 'forms.merchant_id')
            ->select('submitted_forms_deleted.*','merchants.merchant_name AS merchant_name', 'merchants.nickname',
            'users.name', 'users.email', 'forms.name AS form_name', 'forms.form_fields', 'forms.join_queue', 'forms.can_view')
            ->where('submitted_forms_deleted.status', $status)
            ->where('merchants.id', $id)
            ->get();
      
        $merged = $getsubmittedforms->merge($getdeletedsubmittedforms);

        $submittedformdata = [];

        $merged->transform(function($items){
            $submittedformdata['submission_code'] = $items->submission_code;
            $submittedformdata['form_code'] = $items->form_id;
            $submittedformdata['form_name'] = Crypt::decryptString($items->form_name);
            $submittedformdata['form_fields'] = json_decode(Crypt::decryptString($items->form_fields));
            $submittedformdata['join_queue'] = $items->join_queue;
            $submittedformdata['merchant_name'] = Crypt::decryptString($items->merchant_name);
            $submittedformdata['nickname'] = $items->nickname;
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

        if(isset($_GET['page'])){
            $results = $merged->forPage($_GET['page'], 15);
        }else{
            $results = $merged->forPage(1, 15);
        }
        
        $response = [
            'submitted_forms' => $results
        ];
        return response()->json($response, 200);

    }

    /**
     * search for a form by name or form code under submitted, inprocess, processed or rejected.
     * getSubmittedFormByStatusAndMerchant get all submitted forms by merchant and status matching a search term
     * @param mixed $term search term
     * @param  mixed $request
     * @param  mixed $status stautus of submitted forms to sort by
     * @param  mixed $id id of merchant for the submitted forms
     * @return void\Illuminate\Http\Response all details of submitted form
     */
     public function searchSubmittedFormByCodeorName(Request $request, $status, $id, $term){

        $getsubmittedforms = DB::table('submitted_forms')
        ->join('users', 'users.id', '=', 'client_id')
        ->join('forms', 'forms.form_code', '=', 'form_id')
        ->join('merchants', 'merchants.id', '=', 'forms.merchant_id')
        ->select('submitted_forms.*','merchants.merchant_name AS merchant_name', 'merchants.nickname',
        'users.name', 'users.email', 'forms.name AS form_name', 'forms.form_fields', 'forms.join_queue', 'forms.can_view')
        ->where([
            ['submitted_forms.status', $status],
            ['merchants.id', $id],
            ['forms.temps', 'like', '%'.$term.'%']
        ])    
        ->orWhere([
            ['submitted_forms.status', $status],
            ['merchants.id', $id],
            ['submitted_forms.submission_code', 'like', '%'.$term.'%']
        ])    
        ->get();

        $getdeletedsubmittedforms = DB::table('submitted_forms_deleted')
            ->join('users', 'users.id', '=', 'client_id')
            ->join('forms', 'forms.form_code', '=', 'form_id')
            ->join('merchants', 'merchants.id', '=', 'forms.merchant_id')
            ->select('submitted_forms_deleted.*','merchants.merchant_name AS merchant_name', 'merchants.nickname',
            'users.name', 'users.email', 'forms.name AS form_name', 'forms.form_fields', 'forms.join_queue', 'forms.can_view')
            ->where([
                ['submitted_forms_deleted.status', $status],
                ['merchants.id', $id],
                ['forms.temps', 'like', '%'.$term.'%']
            ])    
            ->orWhere([
                ['submitted_forms_deleted.status', $status],
                ['merchants.id', $id],
                ['submitted_forms_deleted.submission_code', 'like', '%'.$term.'%']
            ])    
            ->get();
      
        $merged = $getsubmittedforms->merge($getdeletedsubmittedforms);

        $submittedformdata = [];

        $merged->transform(function($items){
            $submittedformdata['submission_code'] = $items->submission_code;
            $submittedformdata['form_code'] = $items->form_id;
            $submittedformdata['form_name'] = Crypt::decryptString($items->form_name);
            $submittedformdata['form_fields'] = json_decode(Crypt::decryptString($items->form_fields));
            $submittedformdata['join_queue'] = $items->join_queue;
            $submittedformdata['merchant_name'] = Crypt::decryptString($items->merchant_name);
            $submittedformdata['nickname'] = $items->nickname;
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
            'submitted_forms' => $merged
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

        //  //get, encode and encrypt all user details in teh form
        //  $data = $request->all();
        //  $encodeddata = json_encode($data);
        //  $encrypteddata = Crypt::encryptString($encodeddata);

         $last_processed = now();
         $user = $request->user();
         $userid = $user['id'];
     
         //save new client in the database
         try {
             DB::table('submitted_forms')
             ->where('submission_code',$code)
             ->update(
                 [
                     'last_processed' => $last_processed, 
                     'processed_by' => $userid,
                     'status' => $status
                 ]
             );

             if($status == 3){
                 //get user phone
                $user = DB::table('submitted_forms')
                ->join('users', 'users.id', '=', 'client_id')
                ->where('submission_code', $code)
                ->select('phone')
                ->first();

                //send sms to user if form is rejected by processor
                $from = "GiTLog";
                $mobile = $user->phone;
                $msg = "Submitted form rejected." .".\r\n". "Form Submission Code: " .$code;
                $status = (new AuthController)->sendsms($from,$mobile,$msg);
             }

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
    public function FormsProcessedByFrontDeskPerson(Request $request, $id, $startdate, $enddate, $status)
    {
        $startdate = date($startdate);
        $enddate = date($enddate);

        $getprocessedforms = DB::table('submitted_forms')
        ->join('users', 'users.id', '=', 'client_id')
        ->join('forms', 'forms.form_code', '=', 'form_id')
        ->join('merchants', 'merchants.id', '=', 'forms.merchant_id')
        ->select('submitted_forms.*','merchants.merchant_name AS merchant_name', 'merchants.nickname',
        'users.name', 'users.email', 'forms.name AS form_name', 'forms.form_fields', 'forms.join_queue')
        ->where('submitted_forms.processed_by', $id)
        ->where('submitted_forms.status', $status)
        ->whereBetween('last_processed', [$startdate, $enddate])
        ->paginate(15);
      
        //clean data
        $submittedformdata = [];

        $getprocessedforms->transform(function($items){
            $submittedformdata['submission_code'] = $items->submission_code;
            $submittedformdata['form_code'] = $items->form_id;
            $submittedformdata['form_name'] = Crypt::decryptString($items->form_name);
            $submittedformdata['form_fields'] = json_decode(Crypt::decryptString($items->form_fields));
            $submittedformdata['join_queue'] = $items->join_queue;
            $submittedformdata['merchant_name'] = Crypt::decryptString($items->merchant_name);
            $submittedformdata['nickname'] = $items->nickname;
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
     * FormsProcessedByFrontDeskPersonDaily fforms processed by a front desk person on a current day
     *
     * @param  \Illuminate\Http\Request  $request
     * @param $id of front desk person
     * @return void\Illuminate\Http\Response all details of submitted form
     * 
     */
    public function FormsProcessedByFrontDeskPersonDaily(Request $request, $id, $status)
    {

        $date = $current_date_time = Carbon::now()->toDateString();
    
        $getprocessedforms = DB::table('submitted_forms')
        ->join('users', 'users.id', '=', 'client_id')
        ->join('forms', 'forms.form_code', '=', 'form_id')
        ->join('merchants', 'merchants.id', '=', 'forms.merchant_id')
        ->select('submitted_forms.*','merchants.merchant_name AS merchant_name', 'merchants.nickname',
        'users.name', 'users.email', 'forms.name AS form_name', 'forms.form_fields', 'forms.join_queue')
        ->where('submitted_forms.processed_by', $id)
        ->where('submitted_forms.status', $status)
        ->whereDate('last_processed', $date)
        ->paginate(15);
      
        //clean data
        $submittedformdata = [];

        $getprocessedforms->transform(function($items){
            $submittedformdata['submission_code'] = $items->submission_code;
            $submittedformdata['form_code'] = $items->form_id;
            $submittedformdata['form_name'] = Crypt::decryptString($items->form_name);
            $submittedformdata['form_fields'] = json_decode(Crypt::decryptString($items->form_fields));
            $submittedformdata['join_queue'] = $items->join_queue;
            $submittedformdata['merchant_name'] = Crypt::decryptString($items->merchant_name);
            $submittedformdata['nickname'] = $items->nickname;
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
     * numFormsProcessedByFrontDeskPersonDaily get num forms processed by a front desk person on a current day
     *
     * @param  \Illuminate\Http\Request  $request
     * @param $id of front desk person
     * @return void\Illuminate\Http\Response all details of submitted form
     * 
     */
    public function numFormsProcessedByFrontDeskPersonDaily(Request $request, $id, $status)
    {

        $date = $current_date_time = Carbon::now()->toDateString();
    
        $getprocessedforms = DB::table('submitted_forms')
        ->where('submitted_forms.status', $status)
        ->where('submitted_forms.processed_by', $id)
        ->whereDate('last_processed', $date)
        ->count();
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
    public function numFormsProcessedByFrontDeskPerson(Request $request, $id, $startdate, $enddate, $status)
    {
        
        $getnumprocessedforms = DB::table('submitted_forms')
        ->where('submitted_forms.processed_by', $id)
        ->where('submitted_forms.status', $status)
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
    public function getAllFormsProcessedByFrontDeskPerson(Request $request, $id, $status)
    {
        
        $getprocessedforms = DB::table('submitted_forms')
        ->join('users', 'users.id', '=', 'client_id')
        ->join('forms', 'forms.form_code', '=', 'form_id')
        ->join('merchants', 'merchants.id', '=', 'forms.merchant_id')
        ->select('submitted_forms.*','merchants.merchant_name AS merchant_name', 'merchants.nickname',
        'users.name', 'users.email', 'forms.name AS form_name', 'forms.form_fields', 'forms.join_queue')
        ->where('submitted_forms.status', $status)
        ->where('submitted_forms.processed_by', $id)
        ->paginate(15);
      
        //clean data
        $submittedformdata = [];

        $getprocessedforms->transform(function($items){
            $submittedformdata['submission_code'] = $items->submission_code;
            $submittedformdata['form_code'] = $items->form_id;
            $submittedformdata['form_name'] = Crypt::decryptString($items->form_name);
            $submittedformdata['form_fields'] = json_decode(Crypt::decryptString($items->form_fields));
            $submittedformdata['join_queue'] = $items->join_queue;
            $submittedformdata['merchant_name'] = Crypt::decryptString($items->merchant_name);
            $submittedformdata['nickname'] = $items->nickname;
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
    public function getNumAllFormsProcessedByFrontDeskPerson(Request $request, $id, $status)
    {
        
        $getprocessedforms = DB::table('submitted_forms')
        ->where('submitted_forms.status', $status)
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
