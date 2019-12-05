<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use DB;
use Illuminate\Support\Facades\Crypt;

use Illuminate\Pagination\Paginator;
use Illuminate\Support\Facades\Log;
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

        //get and validate user details
        $this->validate($request, [
            'firstname' => 'required',
            'lastname' => 'required',
            'email'=>'required|email',
            'country' => 'required'
        ]);

        //get and encrypt user details 
        $firstname = $request->firstname;
        $lastname = $request->lastname;
        $email = $request->email;
        
        $updated_at = now();
        $name = $firstname . ' ' . $lastname;
        $country = $request->country;

        //get user and check if new email and uniqueness
        $getclient = DB::table('users')
        ->where('id', $id)
        ->first();

        if($getclient->email != $email){
            $this->validate($request, [
                'email'=>'required|email|unique:users'
            ]);
        }

        try {
            //edit user in the in the users table
            DB::table('users')
            ->where('id', $id)
            ->update(
                [
                    'name' => $name,
                    'firstname' => $firstname, 
                    'lastname' => $lastname,
                    'email' => $email,
                    'updated_at' => $updated_at,
                    'country' => $country
                ]
            );

            $message = 'Ok';
            
         }catch(Exception $e) {
             $message = "Failed";
         }   


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
     * @return void\Illuminate\Http\Response submission code
     */
    public function submitForm(Request $request, $id, $code)
    {
         $message = 'Ok';

         //get, encode and encrypt all user details in teh form
         $data = $request->all();

         $client_profile = $data['client_profile'];
         $form_data = $data['form_data'];

         $encodedformdata = json_encode($form_data);
         $encodeduserdata = json_encode($client_profile);

         $encryptedformdata = Crypt::encryptString($encodedformdata);
         $encrypteduserdata = Crypt::encryptString($encodeduserdata);

         $submitted_at = now();
         $status = 0;
         $submission_code = str_random(9);
     
         //save new client in the database
         try {
             DB::table('submitted_forms')
             ->insert(
                 [
                    'submission_code' => $submission_code,
                    'form_id' => $code, 
                    'client_id' => $id,
                    'status' => $status,
                    'client_details' => $encryptedformdata,
                    'submitted_at' => $submitted_at
                 ]
             );

             DB::table('client')
             ->where('id', $id)
             ->update(
                 [
                     'details' => $encrypteduserdata, 
                     'updated_at' => $submitted_at
                 ]
             );
             
             Log::channel('mysql')->info('Client  with id: ' . $id .' successsfully submitted form with code: '. $code);
             $message = 'Ok';
 
         }catch(Exception $e) {
            Log::channel('mysql')->error('Client  with id: ' . $id .' unsuccesssfully submitted form with code: '. $code);
             $message = "Failed";
         }   
 
        if($message != "Ok")
            return response()->json([
                'message' => $message
            ], 200);
            
        return response()->json([
            'code' => $submission_code
        ], 200);
    }


    /**
     * getAllsubmittedForms forms submitted by a client of any status: 
     * submitted, in_process,or processed
     *
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
        ->select('submitted_forms.*','merchants.merchant_name AS merchant_name',
        'users.name', 'users.email', 'forms.name AS form_name', 'forms.form_fields')
        ->where('submitted_forms.client_id', $id)
        ->paginate(15);
      
        //clean data
        $submittedformdata = [];

        $getforms->transform(function($items){
            $submittedformdata['submission_code'] = $items->submission_code;
            $submittedformdata['form_code'] = $items->form_id;
            $submittedformdata['form_name'] = Crypt::decryptString($items->form_name);
            $submittedformdata['form_fields'] = json_decode(Crypt::decryptString($items->form_fields));
            $submittedformdata['merchant_name'] = Crypt::decryptString($items->merchant_name);
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
        ->select('submitted_forms.*','merchants.merchant_name AS merchant_name',
        'users.name', 'users.email', 'forms.name AS form_name', 'forms.form_fields')
        ->where('submitted_forms.client_id', $id)
        ->where('submitted_forms.status', $status)
        ->paginate(15);
      
        //clean data
        $submittedformdata = [];

        $getforms->transform(function($items){
            $submittedformdata['submission_code'] = $items->submission_code;
            $submittedformdata['form_code'] = $items->form_id;
            $submittedformdata['form_name'] = Crypt::decryptString($items->form_name);
            $submittedformdata['form_fields'] = json_decode(Crypt::decryptString($items->form_fields));
            $submittedformdata['merchant_name'] = Crypt::decryptString($items->merchant_name);
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
     * getClientFormsByStatus get number of all forms by status: processed, in_process, submitted 
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

 
}
