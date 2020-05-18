<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use DB;
use Illuminate\Support\Facades\Crypt;

use Illuminate\Pagination\Paginator;
use Illuminate\Support\Facades\Log;
use Response;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\File;
class ClientController extends Controller
{
    
     /**
     * getAllClients get all clients in the database 
     *
     * @param  mixed $request
     * @return void\Illuminate\Http\Response all details of all clients
     */
    public function getAllClients(Request $request){

        //get all registered companies 
        $getclients = DB::table('client')->paginate(15);
      
        //clean data
        $clientsdata = [];

        $getclients->transform(function($items){
            $clientsdata['id'] = $items->id;
            $clientsdata['client_details'] = json_decode(Crypt::decryptString($items->details));
            $clientsdata['created_at'] = $items->created_at;
            $clientsdata['updated_at'] = $items->updated_at;
    
            return $clientsdata;
         });
    
         $response = [
            'clients' => $getclients
        ];
        return response()->json($response, 200);

    }


     /**
     * getClientsDetails get all details of a client 
     *
     * @param  mixed $request
     * @param  mixed $id of the client
     * @return void\Illuminate\Http\Response all details of the client
     */
    public function getClientsDetails(Request $request, $id){

        //get all registered companies 
        $getclient = DB::table('client')
        ->where('id', $id)
        ->get();
      
        //clean data
        $clientdata = [];

        $client = $getclient->map(function($items){
            $clientdata['id'] = $items->id;
            $clientdata['client_details'] = [json_decode(Crypt::decryptString($items->details))];
            $clientdata['created_at'] = $items->created_at;
            $clientdata['updated_at'] = $items->updated_at;
    
            return $clientdata;
         });

         $response = [
            'client' => $client
        ];
        return response()->json($response, 200);

    }


    /**
     * editClientProfile edit a client profile
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Illuminate\Http\Request  $id of teh client to be editted
     * @return void\Illuminate\Http\Response success or error message
     */
    public function editClientProfile(Request $request, $id)
    {

         //put all queries involved in creating a new user in transaction
         DB::beginTransaction();
         $message = 'Ok';
         $updated_at = now();

         //get, encode and encrypt all user details 
         $data = $request->all();
         $encodeddata = json_encode($data);
         $encrypteddata = Crypt::encryptString($encodeddata);
     
         //save new client in the database
         try {
             DB::table('client')
             ->where('id', $id)
             ->update(
                 [
                     'id' => $id,
                     'details' => $encrypteddata, 
                     'updated_at' => $updated_at
                 ]
             );
 
             $message = 'Ok';
             Log::channel('mysql')->info('Client  with id: ' . $id .' profile update successful');
 
         }catch(Exception $e) {
            Log::channel('mysql')->error('Client  with id: ' . $id .' profile update unsuccessful');
             $message = "Failed";
         }   
 
         if($message != "Ok")
            DB::rollback();
        
        DB::commit();
         return response()->json([
            'message' => $message
        ], 200);
    }


    /**
     * submitForm client submit a form
     *
     * @param  \Illuminate\Http\Request  $request
     * @param $id of the client submitting the form
     * @param $code form code that is being filled 
     * @param $status submitted form status, 0 if subnitted and 4 if form is saved to draft
     * @return void\Illuminate\Http\Response submission code
     */
    public function submitForm(Request $request, $id, $code, $edit, $sub_code, $status)
    {

    	if($status == null){
    		$status = 0;
    	}
        

         $message = 'Ok';

         //get, encode and encrypt all user details in the form
         $data = $request->all();

         $client_profile = $data['client_profile'];
         $form_data = $data['form_data'];

         $encodedformdata = json_encode($form_data);
         $encodeduserdata = json_encode($client_profile);

         $encryptedformdata = Crypt::encryptString($encodedformdata);
         $encrypteduserdata = Crypt::encryptString($encodeduserdata);

         $submitted_at = now();
         
         //save new client in the database
         try {
             DB::table('submitted_forms')
                ->updateOrInsert(
                 [ 'submission_code' => $sub_code],

                 [
                    'form_id' => $code, 
                    'client_id' => $id,
                    'status' => $status,
                    'client_details' => $encryptedformdata,
                    'submitted_at' => $submitted_at
                 ]
             );

             if($edit == 1){
                DB::table('client')
                ->where('id', $id)
                ->update(
                    [
                        'details' => $encrypteduserdata, 
                        'updated_at' => $submitted_at
                    ]
                );
             }

            if($status == 0){

                //get logged in user
                $user = $request->user();
                $phone = $user['phone'];

                //get merchant name and form name
                $getdetails = DB::table('forms')
                ->join('merchants', 'forms.merchant_id', '=', 'merchants.id')
                ->select('merchants.merchant_name AS merchant_name','forms.name AS form_name')
                ->where('forms.form_code', $code)
                ->first();;

                $merchant = Crypt::decryptString($getdetails->merchant_name);
                $form_name = Crypt::decryptString($getdetails->form_name);
            
                //send submission code to users SMS
                $from = "GiTLog";
                $mobile = $phone;
                $msg = $form_name ." successfully submitted to ". $merchant .".\r\n". "Submission Code: " .$sub_code;
                $status = (new AuthController)->sendsms($from,$mobile,$msg);
                if($status){
                    Log::channel('mysql')->info('Client  with id: ' . $id .' successsfully submitted form with code: '. $code);
                    $message = 'Ok';
                }    
            }    
        }catch(Exception $e) {
            Log::channel('mysql')->error('Client  with id: ' . $id .' unsuccesssfully submitted form with code: '. $code);
            $message = "Failed";
        }   
        
        if($message != "Ok"){
            return response()->json([
                'message' => $message
            ], 400);
        }else{
            return response()->json([
                'message' => $message
            ], 200);
        }
           
    }


    /**
     * getAllsubmittedForms forms submitted by a client of any status: 
     * submitted, in_process,or processed
     * return with recently submitted first
     * @param  \Illuminate\Http\Request  $request
     * @param $id of the client  who submitted the forms
     * @return void\Illuminate\Http\Response all details of form
     * 
     */
    public function getAllsubmittedForms(Request $request, $id)
    {
        $getforms = DB::table('submitted_forms')
        ->join('users', 'users.id', '=', 'client_id')
        ->join('forms', 'forms.form_code', '=', 'form_id')
        ->join('merchants', 'merchants.id', '=', 'forms.merchant_id')
        // ->join('attachments','attachments.submission_code', '=', 'submitted_forms.submission_code')
        ->select('submitted_forms.*','merchants.merchant_name AS merchant_name', 'merchants.nickname',
        'users.name', 'users.email', 'forms.name AS form_name', 'forms.form_fields')
        ->where('submitted_forms.client_id', $id)
        ->where('submitted_forms.status', '!=', 4)
        ->orderBy('submitted_at', 'desc')
        ->paginate(15);
      
        // return $getforms;a
        //clean data
        $submittedformdata = [];

        $getforms->transform(function($items){
            $submittedformdata['submission_code'] = $items->submission_code;
            $submittedformdata['form_code'] = $items->form_id;
            $submittedformdata['form_name'] = Crypt::decryptString($items->form_name);
            $submittedformdata['form_fields'] = json_decode(Crypt::decryptString($items->form_fields));
            $submittedformdata['merchant_name'] = Crypt::decryptString($items->merchant_name);
            $submittedformdata['nickname'] = $items->nickname;
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
            'forms' => $getforms
        ];
        return response()->json($response, 200);
    }


	/**
	 * non paginated
     * getAllsubmittedForms forms submitted by a client of any status: 
     * submitted, in_process,or processed
     * return with recently submitted first
     * @param  \Illuminate\Http\Request  $request
     * @param $id of the client  who submitted the forms
     * @return void\Illuminate\Http\Response all details of form
     * 
     */
    public function getAllsubmittedFormsApp(Request $request, $id)
    {
        $getforms = DB::table('submitted_forms')
        ->join('users', 'users.id', '=', 'client_id')
        ->join('forms', 'forms.form_code', '=', 'form_id')
        ->join('merchants', 'merchants.id', '=', 'forms.merchant_id')
        // ->join('attachments','attachments.submission_code', '=', 'submitted_forms.submission_code')
        ->select('submitted_forms.*','merchants.merchant_name AS merchant_name', 'merchants.nickname',
        'users.name', 'users.email', 'forms.name AS form_name', 'forms.form_fields')
        ->where('submitted_forms.client_id', $id)
        ->where('submitted_forms.status', '!=', 4)
        ->orderBy('submitted_at', 'desc')
        ->get();
      
        // return $getforms;a
        //clean data
        $submittedformdata = [];

        $getforms->transform(function($items){
            $submittedformdata['submission_code'] = $items->submission_code;
            $submittedformdata['form_code'] = $items->form_id;
            $submittedformdata['form_name'] = Crypt::decryptString($items->form_name);
            $submittedformdata['form_fields'] = json_decode(Crypt::decryptString($items->form_fields));
            $submittedformdata['merchant_name'] = Crypt::decryptString($items->merchant_name);
            $submittedformdata['nickname'] = $items->nickname;
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
            'forms' => $getforms
        ];
        return response()->json($response, 200);
    }


    /**
     * findSubmittedFormByName search for a submitted form by name
     * @param  \Illuminate\Http\Request  $request
     * @param $id of the client  who submitted the forms
      * @param $form_name search term 
     * @return void\Illuminate\Http\Response all details of the submitted form
     * 
     */
    public function findSubmittedFormByName(Request $request, $id, $form_name)
    {
        $getforms = DB::table('submitted_forms')
        ->join('users', 'users.id', '=', 'client_id')
        ->join('forms', 'forms.form_code', '=', 'form_id')
        ->join('merchants', 'merchants.id', '=', 'forms.merchant_id')
        ->select('submitted_forms.*','merchants.merchant_name AS merchant_name', 'merchants.nickname',
        'users.name', 'users.email', 'forms.name AS form_name', 'forms.form_fields')
        ->where([
            ['submitted_forms.client_id', $id],
            ['forms.temps', 'like', '%'.$form_name.'%'],
            ['submitted_forms.status', '!=', 4]
        ])
        ->get();
      
        // return $getforms;a
        //clean data
        $submittedformdata = [];

        $getforms->transform(function($items){
            $submittedformdata['submission_code'] = $items->submission_code;
            $submittedformdata['form_code'] = $items->form_id;
            $submittedformdata['form_name'] = Crypt::decryptString($items->form_name);
            $submittedformdata['form_fields'] = json_decode(Crypt::decryptString($items->form_fields));
            $submittedformdata['merchant_name'] = Crypt::decryptString($items->merchant_name);
            $submittedformdata['nickname'] = $items->nickname;
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
            'forms' => $getforms
        ];
        return response()->json($response, 200);
    }


    /**
     * findSubmittedFormByCode search for a submitted form by the submission code
     * @param  \Illuminate\Http\Request  $request
     * @param $id of the client  who submitted the forms
      * @param $code search term / submission code
     * @return void\Illuminate\Http\Response all details of the submitted form
     * 
     */
    public function findSubmittedFormByCode(Request $request, $id, $code)
    {
        $getforms = DB::table('submitted_forms')
        ->join('users', 'users.id', '=', 'client_id')
        ->join('forms', 'forms.form_code', '=', 'form_id')
        ->join('merchants', 'merchants.id', '=', 'forms.merchant_id')
        ->select('submitted_forms.*','merchants.merchant_name AS merchant_name', 'merchants.nickname',
        'users.name', 'users.email', 'forms.name AS form_name', 'forms.form_fields')
        ->where([
            ['submitted_forms.client_id', $id],
            ['submitted_forms.submission_code', 'like', '%'.$code.'%'],
            ['submitted_forms.status', '!=', 4]
        ])
        ->get();
    
        // return $getforms;a
        //clean data
        $submittedformdata = [];

        $getforms->transform(function($items){
            $submittedformdata['submission_code'] = $items->submission_code;
            $submittedformdata['form_code'] = $items->form_id;
            $submittedformdata['form_name'] = Crypt::decryptString($items->form_name);
            $submittedformdata['form_fields'] = json_decode(Crypt::decryptString($items->form_fields));
            $submittedformdata['merchant_name'] = Crypt::decryptString($items->merchant_name);
            $submittedformdata['nickname'] = $items->nickname;
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
            'forms' => $getforms
        ];
        return response()->json($response, 200);
    }

    /**
     * getNumAllsubmittedForms number of forms submitted by a client of any status: 
     * submitted, in_process,or processed
     *
     * @param  \Illuminate\Http\Request  $request
     * @param $id of the client 
     * @return void\Illuminate\Http\Response number of forms
     * 
     */
    public function getNumAllsubmittedForms(Request $request, $id)
    {
        
        $getnumforms = DB::table('submitted_forms')
        ->where('submitted_forms.client_id', $id)
        ->where('status', '!=', 4)
        ->count();
    

         $response = [
            'num_forms' => $getnumforms
        ];
        return response()->json($response, 200);
    }


    /**
     * getClientFormsByStatus get all forms by status: processed, in_process, submitted 
     *
     * @param  \Illuminate\Http\Request  $request
     * @param $id of the client 
     * @param $status search status
     * @return void\Illuminate\Http\Response all details of form
     * 
     */
    public function getClientFormsByStatus(Request $request, $id, $status)
    {
        $getforms = DB::table('submitted_forms')
        ->join('users', 'users.id', '=', 'client_id')
        ->join('forms', 'forms.form_code', '=', 'form_id')
        ->join('merchants', 'merchants.id', '=', 'forms.merchant_id')
        ->select('submitted_forms.*','merchants.merchant_name AS merchant_name', 'merchants.nickname',
        'users.name', 'users.email', 'forms.name AS form_name', 'forms.form_fields')
        ->where('submitted_forms.client_id', $id)
        ->where('submitted_forms.status', $status)
        ->orderBy('submitted_at', 'desc')
        ->paginate(15);
      
        //clean data
        $submittedformdata = [];

        $getforms->transform(function($items){
            $submittedformdata['submission_code'] = $items->submission_code;
            $submittedformdata['form_code'] = $items->form_id;
            $submittedformdata['form_name'] = Crypt::decryptString($items->form_name);
            $submittedformdata['form_fields'] = json_decode(Crypt::decryptString($items->form_fields));
            $submittedformdata['merchant_name'] = Crypt::decryptString($items->merchant_name);
            $submittedformdata['nickname'] = $items->nickname;
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
            'forms' => $getforms
        ];
        return response()->json($response, 200);
    }


	/**
	* non paginated
     * getClientFormsByStatus get all forms by status: processed, in_process, submitted 
     *
     * @param  \Illuminate\Http\Request  $request
     * @param $id of the client 
     * @param $status search status
     * @return void\Illuminate\Http\Response all details of form
     * 
     */
    public function getClientFormsByStatusApp(Request $request, $id, $status)
    {
        $getforms = DB::table('submitted_forms')
        ->join('users', 'users.id', '=', 'client_id')
        ->join('forms', 'forms.form_code', '=', 'form_id')
        ->join('merchants', 'merchants.id', '=', 'forms.merchant_id')
        ->select('submitted_forms.*','merchants.merchant_name AS merchant_name', 'merchants.nickname',
        'users.name', 'users.email', 'forms.name AS form_name', 'forms.form_fields')
        ->where('submitted_forms.client_id', $id)
        ->where('submitted_forms.status', $status)
        ->orderBy('submitted_at', 'desc')
        ->get();
      
        //clean data
        $submittedformdata = [];

        $getforms->transform(function($items){
            $submittedformdata['submission_code'] = $items->submission_code;
            $submittedformdata['form_code'] = $items->form_id;
            $submittedformdata['form_name'] = Crypt::decryptString($items->form_name);
            $submittedformdata['form_fields'] = json_decode(Crypt::decryptString($items->form_fields));
            $submittedformdata['merchant_name'] = Crypt::decryptString($items->merchant_name);
            $submittedformdata['nickname'] = $items->nickname;
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
            'forms' => $getforms
        ];
        return response()->json($response, 200);
    }


 
     /**
     * getNumClientFormsByStatus get number of all forms by status: processed, in_process, submitted 
     *
     * @param  \Illuminate\Http\Request  $request
     * @param $id of the client 
     * @param $status search status
     * @return void\Illuminate\Http\Response all details of form
     * 
     */
    public function getNumClientFormsByStatus(Request $request, $id, $status)
    {
        
        $getnumforms = DB::table('submitted_forms')
        ->where('submitted_forms.client_id', $id)
        ->where('submitted_forms.status', $status)
        ->count();
      
         $response = [
            'num_forms' => $getnumforms
        ];
        return response()->json($response, 200);
    }

    /**
        * uploadattachments Upload form attachments
        * @param mixed $client_id client id
        * @param  mixed $request
        * @param mixed $form_code form code 
        * @param mixed $submission code form submission code
        * @return \Illuminate\Http\Response success or error message
     */
    public function uploadattachments(Request $request, $client_id, $form_code, $submission_code){

        //file to storage and save name in database
        if($request->hasFile('file'))
        {
            $this->validate($request, [
                'key' => 'required'
            ]);
            
            $attachment = $request->file('file');
            $filename = $attachment->getClientOriginalName();
            $extension = $attachment->getClientOriginalExtension();

            $excludedfileExtension=['exec','zip','dmg', 'rar', 'iso', 'phar', 'sql', 'js', 'html', 'php'];
            $key = $request->key;

            $check=in_array($extension,$excludedfileExtension);

            if($check){
                $message = "Invalid_Attachment";
                $response = [
                    'message' => $message
                ];
                return response()->json( $response, 400);
            }else{

                $current_date_time = Carbon::now()->toDateTimeString(); // Produces something like "2019-03-11 12:25:00"
                $url=$attachment->getFilename().'_'.$submission_code. '_'.$current_date_time.'.'.$extension;
                $url = str_replace(':', '_', $url);
                $url = str_replace(' ', '_', $url);

                 //get and delete attachment if it already
                 try {
                    $attached = DB::table('attachments')
                    ->where('client_id', $client_id)
                    ->where('key', $key)
                    ->where('submission_code', $submission_code)
                    ->first();

            
                    // return $attached;
                    if(!empty($attached)){
                        $delete = $this->deleteAttachment($request, $client_id, $key, $attached->url, $submission_code);
                    }
        
                 }catch(Exception $e) {
                     $message = "Failed";
                     $response = [
                        'message' => $message
                    ];
                    return response()->json( $response, 400);
                 } 

                $upload =  File::move($_FILES['file']['tmp_name'], public_path('storage/attachments/'.$url ));
                // $upload=Storage::disk('local')->put('attachments/'.$url,  File::get($attachment));
                if($upload)
                {
                    $logo = $url;
                        
                }else{
                    $message = 'Attachment upload unsuccessful';
                    $response = [
                        'message' => $message
                    ];
                    return response()->json( $response, 400);
                }
            }
            $message = 'Failed';

            if($upload){
                $uploaded_at = now();

                try {
                    $id = DB::table('attachments')->insertGetId(
                        [
                            'url' => $url, 
                            'uploaded_at' => $uploaded_at,
                            'submission_code' => $submission_code,
                            'form_code' => $form_code,
                            'client_id' => $client_id,
                            'key' => $key
                        ]
                    );

                    Log::channel('mysql')->info('Client with id: ' . $client_id .' successsfully uploaded attachments for form with submission code: '. $submission_code);
                    $message = 'Ok';
        
                }catch(Exception $e) {
                    Log::channel('mysql')->error('Client with id: ' . $client_id .' unsuccesssfully uploaded attachments for form with submission code: '. $submission_code);
                    $message = "Failed";
                } 
            }
            $response = [
                'message' => $message
            ];
            if($message == 'Ok'){
                return response()->json( $response, 200);
    
            }else{
                return response()->json( $response, 400);
    
            }
            
                
        }else{
            $message = 'No Attachment';
            $response = [
                'message' => $message
            ];
            return response()->json( $response, 400);
        }
    }

    /**
     * getAttachments get all attachments during a form submission
     *
     * @param  mixed $request
     *
     * @return \Illuminate\Http\Response containing all attachment
     */
    public function getAttachments(Request $request, $submission_code)
    {
        $getattachements = DB::table('attachments')
        ->where('submission_code', $submission_code)
        ->get(); 

        $response = [
            'attachments' => $getattachements
        ];
        return response()->json($response, 200);
    }


     /**
     * deleteAttachment delete an attachement from a form
     *
     * @param  mixed $request
     * @param  mixed $key field key 
     * @param  mixed $name file name
     * @param  mixed $sub_code  submission code 
     *
     * @return \Illuminate\Http\Response containing all attachment
     */
    public function deleteAttachment(Request $request, $client_id, $key, $name, $sub_code)
    {
        $message ="Failed";
        $deleteattachements = DB::table('attachments')
        ->where([
            ['submission_code', $sub_code],
            ['key', $key],
            ['client_id', $client_id]
        ])
        ->delete(); 
 
        if($deleteattachements){
            unlink(storage_path('app/public/attachments/'.$name));
            $message = "Ok";
        }

        $response = [
            'message' => $message
        ];

        if($message == "Ok"){
            return response()->json($response, 200);
        }else{
            return response()->json($response, 400);
        }
        
    }

    /**
     * uploadProfileAttachments Upload attachments for user profile
     *
     * @param  mixed $request
     *
     * @return \Illuminate\Http\Response success or error message
     */
    public function uploadProfileAttachments(Request $request, $client_id){

        //file to storage and save name in database
        if($request->hasFile('file'))
        {
            $this->validate($request, [
                'key' => 'required'
            ]);
            
            $attachment = $request->file('file');
            $filename = $attachment->getClientOriginalName();
            $extension = $attachment->getClientOriginalExtension();

            $excludedfileExtension=['exec','zip','dmg', 'rar', 'iso', 'phar', 'sql', 'js', 'html', 'php'];
            $key = $request->key;

            $check=in_array($extension,$excludedfileExtension);

            if($check){
                return Response::json('Invalid_Attachment');
            }else{

                $current_date_time = Carbon::now()->toDateTimeString(); // Produces something like "2019-03-11 12:25:00"
                $url=$attachment->getFilename().'_'.$current_date_time.'.'.$extension;
                $url = str_replace(':', '_', $url);
                $url = str_replace(' ', '_', $url);

                //get and delete attachment if it already
                try {
                    $attached = DB::table('profile_atachments')
                    ->where('client_id', $client_id)
                    ->where('key', $key)
                    ->first();

            
                    // return $attached;
                    if(!empty($attached)){
                        $delete = $this->deleteProfileAttachment($request, $client_id, $key, $attached->url);
                    }
        
                 }catch(Exception $e) {
                     $message = "Failed";
                     $response = [
                        'message' => $message
                    ];
                    return response()->json( $response, 400);
                 }  

                $upload =  File::move($_FILES['file']['tmp_name'], public_path('storage/attachments/'.$url ));
                // $upload=Storage::disk('local')->put('attachments/'.$url,  File::get($attachment));
                if($upload)
                {
                    $logo = $url;
                        
                }else{
                    return Response::json('Attachment upload unsuccessful');
                }
            }
            $message = 'Failed';

            if($upload){
                $uploaded_at = now();

                try {
                    $id = DB::table('profile_atachments')->insertGetId(
                        [
                            'url' => $url, 
                            'uploaded_at' => $uploaded_at,
                            'client_id' => $client_id,
                            'key' => $key
                        ]
                    );

                    Log::channel('mysql')->info('Client with id: ' . $client_id .' successsfully uploaded files to profile');
                    $message = 'Ok';
        
                }catch(Exception $e) {
                    Log::channel('mysql')->error('Client with id: ' . $client_id .' unsuccesssfully uploaded files to profile');
                    $message = "Failed";
                } 
            }
            return response()->json([
                'message' => $message
            ]);

                
        }else{
            return Response::json('No Attachment');
        }
    }


    /**
     * getProfileAttachments get all attachments for user profile
     *
     * @param  mixed $request
     *
     * @return \Illuminate\Http\Response containing all attachment
     */
    public function getProfileAttachments(Request $request, $client_id)
    {
        $getattachements = DB::table('profile_atachments')
        ->where('client_id', $client_id)
        ->get(); 

        $response = [
            'attachments' => $getattachements
        ];
        return response()->json($response, 200);
    }

    /**
     * getProfileAttachments get all attachments for user profile
     *
     * @param  mixed $request
     *
     * @return \Illuminate\Http\Response containing all attachment
     */
    public function deleteProfileAttachment(Request $request, $client_id, $key, $name)
    {
        $message ="Failed";
        $deleteattachements = DB::table('profile_atachments')
        ->where([
            ['client_id', $client_id],
            ['key', $key]
        ])
        ->delete(); 
 
        if($deleteattachements){
            unlink(storage_path('app/public/attachments/'.$name));
            $message = "Ok";
        }

        $response = [
            'message' => $message
        ];

        if($message == "Ok"){
            return response()->json($response, 200);
        }else{
            return response()->json($response, 400);
        }
        
    }

     /**
     * deleteSubmittedForm delete submitted form
     * @param mixed $client_id client id
     * @param  mixed $request
     * @param mixed $submission_code form submission code to be deleted
     * @return \Illuminate\Http\Response error or success message 
     */
    public function deleteSubmittedForm(Request $request, $client_id, $submission_code)
    {
        $message = 'failed';
        //get form to be deleted
        $form = DB::table('submitted_forms')->where([
            ['client_id', $client_id],
            ['submission_code', $submission_code]
         ])->first();

        $data= json_decode( json_encode($form), true);

        //insert deleted form in the submitted_forms_deleted table
        $deletedform = DB::table('submitted_forms_deleted')->insert($data);

        $deleteSubmittedForm = DB::table( 'submitted_forms' )
            ->where([
                ['client_id', $client_id],
                ['submission_code', $submission_code]
            ])
            ->delete();

        if ( $deleteSubmittedForm )
        {
            $message = 'ok';
        }

        $response = [
            'message' => $message
        ];

        if ( $message == 'ok' )
        {
            return response()->json( $response, 200 );
        }
        else
        {
            return response()->json( $response, 400 );
        }
    }


    /**
     * recoverDeletedSubmittedForm recover deleted submitted form
     * @param mixed $client_id client id
     * @param  mixed $request
     * @param mixed $submission_code form submission code to be deleted
     * @return \Illuminate\Http\Response error or success message 
     */
     public function recoverDeletedSubmittedForm(Request $request, $client_id, $submission_code)
     {
         $message = 'failed';
         //get form to be deleted
         $form = DB::table('submitted_forms_deleted')->where([
             ['client_id', $client_id],
             ['submission_code', $submission_code]
          ])->first();
          
         $data= json_decode( json_encode($form), true);
 
         //insert deleted form in the submitted_forms_deleted table
         $deletedform = DB::table('submitted_forms')->insert($data);
 
         $deleteSubmittedForm = DB::table( 'submitted_forms_deleted' )
             ->where([
                 ['client_id', $client_id],
                 ['submission_code', $submission_code]
             ])
             ->delete();
 
         if ( $deleteSubmittedForm )
         {
             $message = 'ok';
         }
 
         $response = [
             'message' => $message
         ];
 
         if ( $message == 'ok' )
         {
             return response()->json( $response, 200 );
         }
         else
         {
             return response()->json( $response, 400 );
         }
     }


      /**
     * getAllDeletedSubmittedForms get all deleted submitted forms
     *
     * @param  \Illuminate\Http\Request  $request
     * @param $id of the client  who submitted the forms
     * @return void\Illuminate\Http\Response all details of deleted forms for a client
     * 
     */
    public function getAllDeletedSubmittedForms(Request $request, $id)
    {
        $getforms = DB::table('submitted_forms_deleted')
        ->join('users', 'users.id', '=', 'client_id')
        ->join('forms', 'forms.form_code', '=', 'form_id')
        ->join('merchants', 'merchants.id', '=', 'forms.merchant_id')
        // ->join('attachments','attachments.submission_code', '=', 'submitted_forms.submission_code')
        ->select('submitted_forms_deleted.*','merchants.merchant_name AS merchant_name', 'merchants.nickname',
        'users.name', 'users.email', 'forms.name AS form_name', 'forms.form_fields')
        ->where('submitted_forms_deleted.client_id', $id)
        ->paginate(15);
      
        // return $getforms;a
        //clean data
        $submittedformdata = [];

        $getforms->transform(function($items){
            $submittedformdata['submission_code'] = $items->submission_code;
            $submittedformdata['form_code'] = $items->form_id;
            $submittedformdata['form_name'] = Crypt::decryptString($items->form_name);
            $submittedformdata['form_fields'] = json_decode(Crypt::decryptString($items->form_fields));
            $submittedformdata['merchant_name'] = Crypt::decryptString($items->merchant_name);
            $submittedformdata['nickname'] = $items->nickname;
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
            'forms' => $getforms
        ];
        return response()->json($response, 200);
    }

     
     /**
     * hasPin check if user has pin
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response Yes or no
     */
    public function hasPin(Request $request, $id)
    {
        $user = DB::table('users')
        ->where('id', $id)
        ->whereNull('pin')
        ->get();

        if(empty($user) || count($user) == 0){
            $message = "YES";
        }else{
            $message = "NO";
        }

        $response = [
            'message' => $message
        ];
        return response()->json( $response, 200 );

    }

     /**
     * setPin set pin for a user if user does not have a pin
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response error or success message
     */
    public function setPin(Request $request, $id, $pin)
    {
        $updated_at = now();
        try {
            //set user pin
            DB::table('users')
            ->where('id', $id)
            ->update(
                [
                    'pin' => $pin,
                    'updated_at' => $updated_at
                ]
            );

            $message = 'Ok';
            $response = [
                'message' => $message
            ];
            return response()->json( $response, 200 );
            
         }catch(Exception $e) {
             $message = "Failed";
             $response = [
                'message' => $message
            ];
            return response()->json( $response, 400);
         }   
    }

    /**
     * changePin change user pin
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response error or success message
     */
    public function changePin(Request $request, $id)
    {
         //get and validate details
         $this->validate($request, [
            'old_pin' => 'required',
            'new_pin' => 'required'
        ]);

        //get details from request
        $old_pin = $request->old_pin;
        $new_pin = $request->new_pin;
        $updated_at = now();
        
        try {
            $hasuser = DB::table('users')
            ->where('id', $id)
            ->where('pin', $old_pin)
            ->get();

            if(empty($hasuser) || count($hasuser) == 0){
                $message = "INCORRECT_PIN";
                $response = [
                    'message' => $message
                ];
                return response()->json( $response, 400 );
            }else{
                //set user pin
                DB::table('users')
                ->where('id', $id)
                ->update(
                    [
                        'pin' => $new_pin,
                        'updated_at' => $updated_at
                    ]
                );

                $message = 'Ok';
                $response = [
                    'message' => $message
                ];
                return response()->json( $response, 200 );
            
            }

         }catch(Exception $e) {
             $message = "Failed";
             $response = [
                'message' => $message
            ];
            return response()->json( $response, 400);
         }   
    }

     /**
     * checkPin check user provided pin during form submission
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response sucess or error message
     */
    public function checkPin(Request $request, $id, $pin)
    {
    
        try {
            $checkuser = DB::table('users')
            ->where('id', $id)
            ->where('pin', $pin)
            ->get();

            if(!empty($checkuser) && count($checkuser) > 0){
                $message = "Ok";
                $response = [
                    'message' => $message
                ];
                return response()->json( $response, 200 );
            }else{
                $message = "Failed";
                $response = [
                    'message' => $message
                ];
                return response()->json( $response, 400 );
            
            }

         }catch(Exception $e) {
             $message = "Failed";
             $response = [
                'message' => $message
            ];
            return response()->json( $response, 400);
         }   
    }

     /**
     * addReview add a review to a rejected form
     *
     * @param  mixed $request
     *
     * @return \Illuminate\Http\Response success or error message
     */
    public function addReview(Request $request){

        $this->validate($request, [
            'review' => 'required',
            'submission_code' => 'required'
        ]);

        $review = $request->review;
        $submission_code = $request->submission_code;

        $reviewed_at = now();

        //get user creating the new merchant
        $user = $request->user();
        $userid = $user['id'];

        try {
            DB::table('rejected_forms_reviews')->updateOrInsert(
                [ 'form_sub_code' => $submission_code],
                ['review' => $review, 
                'reviewed_by' => $userid, 
                'reviewed_at' => $reviewed_at
                ]
                    
                
            );

            $message = 'Ok';
            Log::channel('mysql')->info('User with id: ' . $userid .' successsfully rejected a form with submission' . $submission_code);

        }catch(Exception $e) {
            Log::channel('mysql')->error('User with id: ' . $userid .' unsuccesssfully rejected a form with submission' . $submission_code);
            $message = "Failed";
        } 
            
        return response()->json([
            'message' => $message
        ]);

    }

    /**
     * getFormReview get a review for a rejected submitted form
     *
     * @param  mixed $request
     *
     * @return void\Illuminate\Http\Response aa review for the submitted form
     */
    public function getFormReview(Request $request, $code){

        //get a review for a form
        $getreview = DB::table('rejected_forms_reviews')
        ->where('form_sub_code', $code)
        ->first();

         $response = [
            'form_review' => $getreview
        ];
        return response()->json($response, 200);

    }

     /**
     * deleteFormReview delete a review for a rejected submitted form
     *
     * @param  mixed $request
     *
     * @return void\Illuminate\Http\Response error or success message
     */
    public function deleteFormReview(Request $request, $code){

        try {
            DB::table('rejected_forms_reviews')
                ->where('form_sub_code', $code)
                ->delete(); 

            $message = 'Ok';
            Log::channel('mysql')->info('User with id: ' . $userid .' successsfully deleted a review for form with submission' . $code);

        }catch(Exception $e) {
            Log::channel('mysql')->error('User with id: ' . $userid .' unsuccesssfully deleted a review form with submission' . $code);
            $message = "Failed";
        } 
            
        return response()->json([
            'message' => $message
        ]);

    }

     /**
     * getClientFormsByStatusAndMerchant get all forms by status: processed, in_process, submitted for a merchant
     *
     * @param  \Illuminate\Http\Request  $request
     * @param $id of the merchant
     * @param $status search status
     * @param $term search term
     * @return void\Illuminate\Http\Response all details of form
     * 
     */
     public function getClientFormsByStatusAndMerchant(Request $request, $term, $status, $id)
     {
         $getforms = DB::table('submitted_forms')
         ->join('users', 'users.id', '=', 'client_id')
         ->join('forms', 'forms.form_code', '=', 'form_id')
         ->join('merchants', 'merchants.id', '=', 'forms.merchant_id')
         ->select('submitted_forms.*','merchants.merchant_name AS merchant_name', 'merchants.nickname',
         'users.name', 'users.email', 'forms.name AS form_name', 'forms.form_fields')
         ->where('merchants.id', $id)
         ->where('submitted_forms.status', $status)
         ->where('forms.temps', 'like', '%'.$term .'%')
         ->get();
       
         //clean data
         $submittedformdata = [];
 
         $forms = $getforms->map(function($items){
             $submittedformdata['submission_code'] = $items->submission_code;
             $submittedformdata['form_code'] = $items->form_id;
             $submittedformdata['form_name'] = Crypt::decryptString($items->form_name);
             $submittedformdata['form_fields'] = json_decode(Crypt::decryptString($items->form_fields));
             $submittedformdata['merchant_name'] = Crypt::decryptString($items->merchant_name);
             $submittedformdata['nickname'] = $items->nickname;
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
             'forms' => $forms
         ];
         return response()->json($response, 200);
     }
 
}