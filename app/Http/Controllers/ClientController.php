<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use DB;
use Illuminate\Support\Facades\Crypt;

class ClientController extends Controller
{
    
     /**
     * getAllClients get all clients in the database 
     *
     * @param  mixed $request
     * @return void\Illuminate\Http\Response all details of all clients
     */
    protected function getAllClients(Request $request){

        //get all registered companies 
        $getclients = DB::table('client')->simplePaginate(15);
      
        //clean data
        $clientsdata = [];

        $clients = $getclients->map(function($items){
            $clientsdata['id'] = $items->id;
            $clientsdata['client_details'] = json_decode(Crypt::decryptString($items->details));
            $clientsdata['created_at'] = $items->created_at;
            $clientsdata['updated_at'] = $items->updated_at;
    
            return $clientsdata;
         });

         $response = [
            'clients' => $clients
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
    protected function getClientsDetails(Request $request, $id){

        //get all registered companies 
        $getclient = DB::table('client')
        ->where('id', $id)
        ->first();
      
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
         $status = 'submitted';
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


 
}
