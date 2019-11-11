<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use DB;
use Illuminate\Support\Facades\Crypt;

use Illuminate\Pagination\Paginator;

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
        $getclients = DB::table('client')->get();
      
        //clean data
        $clientsdata = [];

        $clients = $getclients->map(function($items){
            $clientsdata['id'] = $items->id;
            $clientsdata['client_details'] = json_decode(Crypt::decryptString($items->details));
            $clientsdata['created_at'] = $items->created_at;
            $clientsdata['updated_at'] = $items->updated_at;
    
            return $clientsdata;
         });
         $objects = new Paginator($clients, 15);
         $response = [
            'clients' => $objects
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
            $clientdata['client_details'] = json_decode(Crypt::decryptString($items->details));
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
 
         }catch(Exception $e) {
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
         $encodeddata = json_encode($data);
         $encrypteddata = Crypt::encryptString($encodeddata);

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
                    'client_details' => $encrypteddata,
                    'submitted_at' => $submitted_at
                 ]
             );
 
             $message = 'Ok';
 
         }catch(Exception $e) {
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
     * @param $id of the client 
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
        ->get();
      
        //clean data
        $submittedformdata = [];

        $forms = $getforms->map(function($items){
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
         $objects = new Paginator($forms, 15);
         $response = [
            'forms' => $objects
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
        ->get();
      
        //clean data
        $submittedformdata = [];

        $forms = $getforms->map(function($items){
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
         $objects = new Paginator($forms, 15);
         $response = [
            'forms' => $objects
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
