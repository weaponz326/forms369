<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use DB;

use Illuminate\Support\Facades\Crypt;

use App\User;
use App\Notifications\SignupActivate;
use Carbon\Carbon;

use Session;
use Auth;
use Illuminate\Pagination\Paginator;

class AuthController extends Controller
{
   
    
  /**
    * Reset user password at first login
    * @param  mixed $request
    *
    * @return \Illuminate\Http\Response success or error message
    */
    public function resetPassword(Request $request, $id)
    {
       
        //get and validate user details
        $this->validate($request, [
            'new_password' => 'required|confirmed|min:8'
        ]);

        $password = bcrypt($request->new_password);
        try {
            //update user password
            DB::table('users')->where('id', $id)
            ->update(
            [
                'password' => $password,
                'first_time' => 0
                
            ]);

            Auth::logout();

            return response()->json([
                'message' => 'Ok'
            ], 200);

        }catch(Exception $e) {
            
            return response()->json([
                'message' => 'Failed'
            ], 400);

        }
       
       
    }


    /**
     * createNewUser register a new user: GIT admin, Super Super Exective, 
    * branch super executive, company admin, branch admin or client
    *
    * @param  mixed $request
    *
    * @return \Illuminate\Http\Response success or error message
    */
    public function createNewUser(Request $request)
    {

        //put all queries involved in creating a new user in transaction
        DB::beginTransaction();

        $message = 'Ok';
        //get and validate user details
        $this->validate($request, [
            'firstname' => 'required',
            'lastname' => 'required',
            'email'=>'required|email|unique:users',
            'password'=>'required|confirmed|min:8',
            'username'=>'required|unique:users',
            'user_type' => 'required',
            'country' => 'required'
        ]);

        //get and encrypt user details 
        $firstname = $request->firstname;
        $lastname = $request->lastname;
        $email = $request->email;
        $password = bcrypt($request->password);
        $username = $request->username;
        $user_type = $request->user_type;
        $created_at = now();
        $name = $firstname . ' ' . $lastname;
        $country = $request->country;

        if($request->has('merchant_id'))
        {

            $merchant_id = $request->merchant_id;

        }else
        {

            $merchant_id = 0;

        }

        if($request->has('branch_id'))
        {

            $branch_id = $request->branch_id;

        }else
        {

            $branch_id = 0;

        }

        if($user_type == 20)
        {

            $gitadmin = 1;

        }else
        {

            $gitadmin = 0;

        }


        //save new user in the database and get id
        $id = DB::table('users')->insertGetId(
            [
                'name' => $name,
                'firstname' => $firstname, 
                'lastname' => $lastname,
                'email' => $email,
                'password' => $password,
                'username' => $username,
                'gitadmin' => $gitadmin,
                'merchant_id' => $merchant_id,
                'branch_id' => $branch_id,
                'usertype' => $user_type,
                'created_at' => $created_at,
                'country' => $country,
                'status' => 1
            ]
        );

        if(empty($id) || $id ==0){

            DB::rollback();
            $message = "Failed";
        }
            

        //create coressponding records for all user types 
        if($user_type == 26)
        {
            
            $message = $this->createClient($request, $id);

        }elseif($user_type == 24){

            $message = $this->createOtherUser($request, $id, $name, 'branch_admin');
            
        }elseif($user_type == 23){

            $message = $this->createOtherUser($request, $id, $name, 'company_admin');
            
        }elseif($user_type == 22){

            $message = $this->createOtherUser($request, $id, $name, 'branch_super_executive');
            
        }elseif($user_type == 21){

            $message = $this->createOtherUser($request, $id, $name, 'joint_companies');
            
        }
        
        if($message != "Ok"){

            DB::rollback();
            return response()->json([
                'message' => $message
            ]);
           
        }elseif($message == 'Ok'){
            DB::commit();
            return response()->json([
                'id' => $id
            ]);

        }
            
   
    }  


    /**
     * createClient create a new cleint
     *
     * @param  mixed $request and $id of the client in the user table
     * @param  mixed $id the id in the client table is a foreign and primary key
     *
     * @return \Illuminate\Http\Response success or error message
     */
    protected function createClient(Request $request, $id){

        //get, encode and encrypt all user details 
        $data = $request->all();
        $encodeddata = json_encode($data);
        $encrypteddata = Crypt::encryptString($encodeddata);
        $created_at = now();
    
        //save new client in the database
        try {
            DB::table('client')->insert(
                [
                    'id' => $id,
                    'details' => $encrypteddata, 
                    'created_at' => $created_at
                ]
            );

            //get user and send verification email
            $user = User::find($id);

            $user->active_token = str_random(60);
            $user->save();
            $user->notify(new SignupActivate($user));

            $message = 'Ok';

        }catch(Exception $e) {
            $message = "Failed";
        }   

       return $message;
    
    }


    /**
     * createOtherUser create other users, exec, branch exec, company admin and branch admin
     *
     * @param  mixed $request
     * @param  mixed $id the id in the client table is a foreign and primary key
     * @param  mixed $name the full name of the branch admin
     *
     * @return void
     */
    protected function createOtherUser(Request $request, $id, $name, $table){
        //get logged in user
        $user = $request->user();
        $userid = $user['id'];

        if($userid == NULL)
            $userid = 0;

        $encryptedname = Crypt::encryptString($name);
        $created_at = now();

         //save new branch admin in the database
         try {
            DB::table($table)->insert(
                [
                    'id' => $id,
                    'name' => $encryptedname, 
                    'created_by' => $userid,
                    'created_at' => $created_at
                ]
            );

            $message = 'Ok';

        }catch(Exception $e) {
            $message = "Failed";
        }   

       return $message;
    }


    /**
     * editUser edit a user: GIT admin, Super Super Exective, 
    * branch super executive, company admin, branch admin or client
    *
    * @param  mixed $request
    *  @param  mixed $id of the user to be editted
    *
    * @return \Illuminate\Http\Response success or error message
    */
    public function editUser(Request $request, $id)
    {
        $message = 'Ok';
        //get and validate user details
        $this->validate($request, [
            'firstname' => 'required',
            'lastname' => 'required',
            'username'=>'required',
            'user_type' => 'required',
            'country' => 'required',
            'email' => 'required'
        ]);

        //get and encrypt user details 
        $firstname = $request->firstname;
        $lastname = $request->lastname;
        $password = $request->password;
        $username = $request->username;
        $user_type = $request->user_type;
        $updated_at = now();
        $name = $firstname . ' ' . $lastname;
        $country = $request->country;
        $email = $request->email;
            
        if($request->has('merchant_id'))
        {

            $merchant_id = $request->merchant_id;

        }else
        {

            $merchant_id = 0;

        }

        if($request->has('branch_id'))
        {

            $branch_id = $request->branch_id;

        }else
        {

            $branch_id = 0;

        }

        if($user_type == 20)
        {

            $gitadmin = 1;

        }else
        {

            $gitadmin = 0;

        }

        
         //get user and send verification email
         $user = User::find($id);
         $test = false;

         //make user that new email is unique
         if($email != $user['email']){

            $this->validate($request, [
                'email'=>'required|email|unique:users'
            ]);

            $test = true;
            
        }

         //make user that new username is unique
         if($username != $user['username']){

            $this->validate($request, [
                'username'=>'required|unique:users',
            ]);
            
        }

         
        if($password == null){

                    //save new user in the database and get id
            DB::table('users')->where('id', $id)
            ->update(
                [
                    'name' => $name,
                    'firstname' => $firstname, 
                    'lastname' => $lastname,
                    'username' => $username,
                    'gitadmin' => $gitadmin,
                    'merchant_id' => $merchant_id,
                    'branch_id' => $branch_id,
                    'usertype' => $user_type,
                    'updated_at' => $updated_at,
                    'email' => $email,
                    'country' => $country
                ]
            );

        }else{
            $password = bcrypt($password);

            DB::table('users')->where('id', $id)
            ->update(
                [
                    'name' => $name,
                    'firstname' => $firstname, 
                    'lastname' => $lastname,
                    'username' => $username,
                    'gitadmin' => $gitadmin,
                    'password' => $password,
                    'merchant_id' => $merchant_id,
                    'branch_id' => $branch_id,
                    'usertype' => $user_type,
                    'updated_at' => $updated_at,
                    'email' => $email,
                    'country' => $country
                ]
            );

        }

        $user = User::find($id);
        if(!empty($user)){

            if($user_type == 26){
                
                if($test == true){
                 
                    $user->active_token = str_random(60);
                    $user->save();
                    $user->notify(new SignupActivate($user));
                }
                
             }

         }
  

        //create coressponding records for all user types 
        if($user_type == 24){

            
            $result = $this->editOtherUser($request, $id, $name, 'branch_admin');
            if($result == 1){

                $message = "Ok";
            }else{
                $message = "Failed";
            }
                

            
        }elseif($user_type == 23){

            $result = $this->editOtherUser($request, $id, $name, 'company_admin');
            if($result == 1){

                $message = "Ok";
            }else{
                $message = "Failed";
            }
            
        }elseif($user_type == 22){

            $result = $this->editOtherUser($request, $id, $name, 'branch_super_executive');
            if($result == 1){

                $message = "Ok";
            }else{
                $message = "Failed";
            }
            
        }elseif($user_type == 21){
            $result = $this->editOtherUser($request, $id, $name, 'joint_companies');

            if($result == 1){

                $message = "Ok";
            }else{
                $message = "Failed";
            }
            
        }
        
        if($message != "Ok")
            DB::rollback();
        
        DB::commit();
        
        return response()->json([
            'message' => $message
        ]);

    }  

    
    /**
     * createBranchAdmin create new branch admin
     *
     * @param  mixed $request
     * @param  mixed $id the id in the client table is a foreign and primary key
     * @param  mixed $name the full name of the branch admin
     *
     * @return void
     */
    protected function editOtherUser(Request $request, $id, $name, $table){
        //get logged in user
        $user = $request->user();
        $userid = $user['id'];

        if($userid == NULL)
            $userid = 0;

        $encryptedname = Crypt::encryptString($name);
        $updated_at = now();

        

         //save new branch admin in the database
         try {
            $query=DB::table($table)->where('id', $id)
            ->update(
                [
                    'name' => $encryptedname, 
                    'updated_by' => $userid,
                    'updated_at' => $updated_at
                ]
            );
            return $query;
            $message = 'Ok';

        }catch(Exception $e) {
            $message = "Failed";
        }   

    }

    

    /**
     * send activation email to new user
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function signupActivate(Request $request, $token)
    {
        $user = User::where('active_token', $token)->first();
        if (!$user) {
            return response()->json([
                'message' => 'This activation token is invalid.'
            ], 404);
        }
        if (! $request->hasValidSignature()) {
            abort(401, 'Link expired');
        }

        $user->active_token = NULL;
        $current_date_time = Carbon::now()->toDateTimeString();
        $user->email_verified_at=$current_date_time;
        $user->save();
        
        if($user){
            return response()->json([
                'message' => 'Successfully verified'
            ]);

        }
    }


    /**
     * Login user
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function login(Request $request)
    {
        $this->validate($request, [
            'username' => 'required',
            'password'=>'required',
            'remember_me' => 'boolean'
        ]);
        
        $credentials = request(['username', 'password']);
        $credentials['active_token'] = null;
        $credentials['deleted_at'] = null;
        $credentials['status'] = 1;

        if(!Auth::attempt($credentials))
        {
            if(Auth::attempt(['username'=>$request->username, 'password'=>$request->password, 'status'=>1]))
            {     
                $user = User::where('username',$request->username)->first();
                //get user and send verification email
            
                $user->active_token = str_random(60);
                $user->save();
            
                $user->notify(new SignupActivate($user));
                $error_response = [
                    'message' => 'EMAIL_NOT_CONFIRMED'
                ];
                return response()->json($error_response, 400);
            }

            $attemptuserusername = User::where('username', '=', $request->username)->first();
            if($attemptuserusername['status'] == 0){

                $error_response = [
                    'message' => 'ACCOUNT_DEACTIVATED'
                ];
                return response()->json($error_response, 400);
            }

            if ($attemptuserusername != null)
            {
                $error_response = [
                    'message' => 'INVALID_PASSWORD'
                ];
                return response()->json($error_response, 400);
            }
            else
            {
                $error_response = [
                    'message' => 'USER_NOT_FOUND'
                ];
                return response()->json($error_response, 401);
            }

        }
        
        //get user and user id and log user activity
        $user = $request->user();
        $id = $user['id'];
        $first_time = $user['first_time'];
        $user_type = $user['usertype'];

        if($first_time){
            if($user_type != 26){
                
                $error_response = [
                    'message' => $id
                ];
                return response()->json($error_response, 200); 
            }
            
        }

        
        //generate a token with the right scopes based on the usertype
        if($user_type == 20)
        {

            $tokenResult = $user->createToken('authToken', ['GIT_Admin']);

        }elseif($user_type == 21)
        {

            $tokenResult = $user->createToken('authToken', ['super_executive']);

        }elseif($user_type == 22)
        {

            $tokenResult = $user->createToken('authToken', ['branch_executive']);

        }elseif($user_type == 23)
        {

            $tokenResult = $user->createToken('authToken', ['company_admin']);

        }elseif($user_type == 24)
        {

            $tokenResult = $user->createToken('authToken', ['branch_admin']);

        }elseif($user_type == 25)
        {

            $tokenResult = $user->createToken('authToken', ['frontdesk']);

        }elseif($user_type == 26)
        {

            $tokenResult = $user->createToken('authToken', ['client']);

        }

        
        $token = $tokenResult->token;
        if ($request->remember_me)
            $token->expires_at = Carbon::now()->addWeeks(1);
         $token->save();


         $token=$tokenResult->accessToken;
         $expires_at = Carbon::parse($tokenResult->token->expires_at)->toDateTimeString();

        $user->last_login_at = now();
        $user->last_login_ip=$request->getClientIp();
        $user->save();
        
        $response = [
            'user' => $user,
            'token' => $token,
            'expires_at' => $expires_at
        ];

        return response()->json($response, 200);
    }


    /**
     * Get the authenticated/logged in  User
     *
     * @return [json] user object
     */
    public function user(Request $request)
    {
        return response()->json($request->user());
    }


    /**
     * Logout user (Revoke the token)
     *
     * @return [string] message
     */
    public function logout(Request $request)
    {
        
        //get user and log user activity
        $user = $request->user();
        $id = $user['id'];

        $user->token()->revoke();

        Auth::logout();
        return response()->json([
            'message' => 'Successfully logged out'
        ]);
    }

    /**
     * getUserDetails get the details of a user
     *
     * @param  mixed $request
     * @param  mixed $id of the user
     *
     * @return [json] user object
     */
    public function getUserDetails(Request $request, $id){

         //get all registered companies 
         $getuser = DB::table('users')
         ->leftjoin('merchants', 'merchants.id', '=', 'merchant_id')
         ->leftjoin('company_branches', 'company_branches.id', '=', 'branch_id')
         ->select('users.*','merchants.merchant_name AS merchant_name','company_branches.branchname AS branch_name')
        ->where('users.id', $id)
        ->get();
 
         //clean data
         $userdata = [];
 
         $user = $getuser->map(function($items){
             $userdata['id'] = $items->id;
             $userdata['full_name'] =$items->name;
             $userdata['firstname'] = $items->firstname;
             $userdata['lastname'] = $items->lastname;
             $userdata['username'] =$items->username;
             $userdata['email'] = $items->email;
             $userdata['country'] = $items->country;
             $userdata['last_login_at'] = $items->last_login_at;
             $userdata['last_login_ip'] = $items->last_login_ip;
             $userdata['status'] = $items->status;
             $userdata['merchant_id'] = $items->merchant_id;
             $userdata['merchant_name'] = empty($items->merchant_name) ? '' : Crypt::decryptString($items->merchant_name);
             $userdata['branch_id'] = $items->branch_id;
             $userdata['branch_name'] = empty($items->branch_name) ? '' : Crypt::decryptString($items->branch_name); 
             $userdata['user_type'] = $items->usertype;
             $userdata['created_at'] = $items->created_at;
             $userdata['updated_at'] = $items->updated_at;
             $userdata['deleted_at'] = $items->deleted_at;
 
             return $userdata;
          });
 
          $response = [
             'user' => $user
         ];
         return response()->json($response, 200);
 
    
    }

     /**
     * diableUser disable a user. A disbaled user can not log in
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  $id of the user to be disabled
     *
     * @return void\Illuminate\Http\Response success or error message
     */
    public function diableUser(Request $request, $id)
    {

        $updated_at = now();

        //get user creating the new merchant
        $user = $request->user();
        $userid = $user['id'];

        //save new merchant in the database
        try {
            DB::table('users')
            ->where('id', $id)
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
     * enableUser enable a user. 
     * @param  \Illuminate\Http\Request  $request
     * @param  $id of the user to be enabled
     *
     * @return void\Illuminate\Http\Response success or error message
     */
    public function enableUser(Request $request, $id)
    {

        $updated_at = now();

        //get user creating the new merchant
        $user = $request->user();
        $userid = $user['id'];

        //save new merchant in the database
        try {
            DB::table('users')
            ->where('id', $id)
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
     * getAllUsersByMerchant get the details of users
     *
     * @param  mixed $request
     * @param  mixed $id of the merchant
     *
     * @return [json] all matching users
     */
    public function getAllUsersByMerchant(Request $request, $id){

        //get all registered companies 
        $getusers = DB::table('users')
        ->join('merchants', 'merchants.id', '=', 'merchant_id')
        ->join('company_branches', 'company_branches.id', '=', 'branch_id')
        ->select('users.*','merchants.merchant_name AS merchant_name','company_branches.branchname AS branch_name')
       ->where('users.merchant_id', $id)
       ->paginate(15);

        //clean data
        $userdata = [];
        
        $getusers->transform(function($items){
            $userdata['id'] = $items->id;
            $userdata['full_name'] =$items->name;
            $userdata['firstname'] = $items->firstname;
            $userdata['lastname'] = $items->lastname;
            $userdata['usename'] =$items->username;
            $userdata['email'] = $items->email;
            $userdata['last_login_at'] = $items->last_login_at;
            $userdata['last_login_ip'] = $items->last_login_ip;
            $userdata['status'] = $items->status;
            $userdata['merchant_id'] = $items->merchant_id;
            $userdata['merchant_name'] = Crypt::decryptString($items->merchant_name);
            $userdata['branch_id'] = $items->branch_id;
            $userdata['branch_name'] = Crypt::decryptString($items->branch_name);
            $userdata['user_type'] = $items->usertype;
            $userdata['created_at'] = $items->created_at;
            $userdata['updated_at'] = $items->updated_at;
            $userdata['deleted_at'] = $items->deleted_at;

            return $userdata;
         });
         
         $response = [
            'users' => $getusers
        ];
        return response()->json($response, 200);
   
   }


   /**
     * getNumAllUsersByMerchant get count of all users in a company
     *
     * @param  mixed $request
     * @param  mixed $id of the merchant
     *
     * @return [json] all matching users
     */
    public function getNumAllUsersByMerchant(Request $request, $id){

        //get all registered companies 
        $getnumusers = DB::table('users')
       ->where('users.merchant_id', $id)
       ->count();

         $response = [
            'num_users' => $getnumusers
        ];
        return response()->json($response, 200);

   
   }


    /**
     * getAllUsersByBranch get the details of users
     *
     * @param  mixed $request
     * @param  mixed $id of the branch
     *
     * @return [json] all matching users
     */
    public function getAllUsersByBranch(Request $request, $id){

        //get all registered companies 
        $getusers = DB::table('users')
        ->join('merchants', 'merchants.id', '=', 'users.merchant_id')
        ->join('company_branches', 'company_branches.id', '=', 'users.branch_id')
        ->select('users.*','merchants.merchant_name AS merchant_name','company_branches.branchname AS branch_name')
       ->where('users.branch_id', $id)
       ->paginate(15);
       

        //clean data
        $userdata = [];

        $getusers->transform(function($items){
            $userdata['id'] = $items->id;
            $userdata['full_name'] =$items->name;
            $userdata['firstname'] = $items->firstname;
            $userdata['lastname'] = $items->lastname;
            $userdata['usename'] =$items->username;
            $userdata['email'] = $items->email;
            $userdata['last_login_at'] = $items->last_login_at;
            $userdata['last_login_ip'] = $items->last_login_ip;
            $userdata['status'] = $items->status;
            $userdata['merchant_id'] = $items->merchant_id;
            $userdata['merchant_name'] = Crypt::decryptString($items->merchant_name);
            $userdata['branch_id'] = $items->branch_id;
            $userdata['branch_name'] = Crypt::decryptString($items->branch_name);
            $userdata['user_type'] = $items->usertype;
            $userdata['created_at'] = $items->created_at;
            $userdata['updated_at'] = $items->updated_at;
            $userdata['deleted_at'] = $items->deleted_at;

            return $userdata;
         });

         $response = [
            'users' => $getusers
        ];
        return response()->json($response, 200);
   
   }

    /**
     * getNumAllUsersByBranch get the number of users in a branch
     *
     * @param  mixed $request
     * @param  mixed $id of the branch
     *
     * @return int count of number of users in a branch
     */
    public function getNumAllUsersByBranch(Request $request, $id){

        //get all registered companies 
        $getusers = DB::table('users')
       ->where('users.branch_id', $id)
       ->count();

         $response = [
            'num_users' => $getusers
        ];
        return response()->json($response, 200);
   
   }


   /**
     * getMerchantUsersByType get the details of users under a particular user type for a merchant
     *
     * @param  mixed $request
     * @param  mixed $id of the merchant
     * @param  mixed $user_type_id id of user_type_id of search
     * @return [json] all matching users
     */
    public function getMerchantUsersByType(Request $request, $id, $user_type_id){

        //get all registered companies 
        $getusers = DB::table('users')
        ->join('merchants', 'merchants.id', '=', 'merchant_id')
        ->leftjoin('company_branches', 'company_branches.id', '=', 'branch_id')
        ->select('users.*','merchants.merchant_name AS merchant_name','company_branches.branchname AS branch_name')
       ->where('users.merchant_id', $id)
       ->where('users.usertype', $user_type_id)
       ->paginate(15);

        //clean data
        $userdata = [];

        $getusers->transform(function($items){
            $userdata['id'] = $items->id;
            $userdata['full_name'] =$items->name;
            $userdata['firstname'] = $items->firstname;
            $userdata['lastname'] = $items->lastname;
            $userdata['username'] =$items->username;
            $userdata['email'] = $items->email;
            $userdata['last_login_at'] = $items->last_login_at;
            $userdata['last_login_ip'] = $items->last_login_ip;
            $userdata['status'] = $items->status;
            $userdata['merchant_id'] = $items->merchant_id;
            $userdata['merchant_name'] = empty($items->merchant_name) ? '' : Crypt::decryptString($items->merchant_name);
            $userdata['branch_id'] = $items->branch_id;
            $userdata['branch_name'] = empty($items->branch_name) ? '' : Crypt::decryptString($items->branch_name);
            $userdata['user_type'] = $items->usertype;
            $userdata['created_at'] = $items->created_at;
            $userdata['updated_at'] = $items->updated_at;
            $userdata['deleted_at'] = $items->deleted_at;

            return $userdata;
         });

         $response = [
            'users' => $getusers
        ];
        return response()->json($response, 200);
   
   }

   /**
     * getMerchantUsersByType get the details of users under a particular user type for a merchant
     *
     * @param  mixed $request
     * @param  mixed $id of the merchant
     * @param  mixed $user_type_id id of user_type_id of search
     * @return [json] all matching users
     */
    public function getAllUsersByType(Request $request, $user_type_id){

        //get all registered companies 
        $getusers = DB::table('users')
        ->leftjoin('merchants', 'merchants.id', '=', 'merchant_id')
        ->select('users.*', 'merchants.merchant_name')
       ->where('users.usertype', $user_type_id)
       ->paginate(15);

        //clean data
        $userdata = [];

        $getusers->transform(function($items){
            $userdata['id'] = $items->id;
            $userdata['full_name'] =$items->name;
            $userdata['firstname'] = $items->firstname;
            $userdata['lastname'] = $items->lastname;
            $userdata['username'] =$items->username;
            $userdata['email'] = $items->email;
            $userdata['merchant_name'] = empty($items->merchant_name) ? '' : Crypt::decryptString($items->merchant_name);
            $userdata['last_login_at'] = $items->last_login_at;
            $userdata['last_login_ip'] = $items->last_login_ip;
            $userdata['status'] = $items->status;
            $userdata['user_type'] = $items->usertype;
            $userdata['created_at'] = $items->created_at;
            $userdata['updated_at'] = $items->updated_at;
            $userdata['deleted_at'] = $items->deleted_at;

            return $userdata;
         });

         $response = [
            'users' => $getusers
        ];
        return response()->json($response, 200);
   
   }

   /**
     * getAllUsersByTypeForDropdown get the details of users under a particular user type for a merchant
     * without pagination for dropdown
     *
     * @param  mixed $request
     * @param  mixed $id of the merchant
     * @param  mixed $user_type_id id of user_type_id of search
     * @return [json] all matching users
     */
    public function getAllUsersByTypeForDropdown(Request $request, $user_type_id){

        //get all registered companies 
        $getusers = DB::table('users')
        ->leftjoin('merchants', 'merchants.id', '=', 'merchant_id')
        ->select('users.*', 'merchants.merchant_name')
       ->where('users.usertype', $user_type_id)
       ->get();

        //clean data
        $userdata = [];

        $getusers->transform(function($items){
            $userdata['id'] = $items->id;
            $userdata['full_name'] =$items->name;
            $userdata['firstname'] = $items->firstname;
            $userdata['lastname'] = $items->lastname;
            $userdata['username'] =$items->username;
            $userdata['email'] = $items->email;
            $userdata['merchant_name'] = empty($items->merchant_name) ? '' : Crypt::decryptString($items->merchant_name);
            $userdata['last_login_at'] = $items->last_login_at;
            $userdata['last_login_ip'] = $items->last_login_ip;
            $userdata['status'] = $items->status;
            $userdata['user_type'] = $items->usertype;
            $userdata['created_at'] = $items->created_at;
            $userdata['updated_at'] = $items->updated_at;
            $userdata['deleted_at'] = $items->deleted_at;

            return $userdata;
         });

         $response = [
            'users' => $getusers
        ];
        return response()->json($response, 200);
   
   }



   /**
     * getMerchantUsersByType get the number of users under a particular user type for a merchant
     *
     * @param  mixed $request
     * @param  mixed $id of the merchant
     * @param  mixed $user_type_id id of user_type_id of search
     * @return [json] all matching users
     */
    public function getNumMerchantUsersByType(Request $request, $id, $user_type_id){

        //get all registered companies 
        $getnumusers = DB::table('users')
        ->where('users.merchant_id', $id)
        ->where('users.usertype', $user_type_id)
        ->count();

         $response = [
            'num_users' => $getnumusers
        ];
        return response()->json($response, 200);
   
   }


   /**
     * getBranchUsersByType get the details of users under a particular user type for a branch
     *
     * @param  mixed $request
     * @param  mixed $id of the branch
     * @param  mixed $user_type_id id of user_type_id of search
     * @return [json] all matching users
     */
    public function getBranchUsersByType(Request $request, $id, $user_type_id){

        //get all registered companies 
        $getusers = DB::table('users')
        ->join('merchants', 'merchants.id', '=', 'merchant_id')
        ->join('company_branches', 'company_branches.id', '=', 'branch_id')
        ->select('users.*','merchants.merchant_name AS merchant_name','company_branches.branchname AS branch_name')
       ->where('users.branch_id', $id)
       ->where('users.usertype', $user_type_id)
       ->paginate(15);

        //clean data
        $userdata = [];

        $getusers->transform(function($items){
            $userdata['id'] = $items->id;
            $userdata['full_name'] =$items->name;
            $userdata['firstname'] = $items->firstname;
            $userdata['lastname'] = $items->lastname;
            $userdata['usename'] =$items->username;
            $userdata['email'] = $items->email;
            $userdata['last_login_at'] = $items->last_login_at;
            $userdata['last_login_ip'] = $items->last_login_ip;
            $userdata['status'] = $items->status;
            $userdata['merchant_id'] = $items->merchant_id;
            $userdata['merchant_name'] = Crypt::decryptString($items->merchant_name);
            $userdata['branch_id'] = $items->branch_id;
            $userdata['branch_name'] = Crypt::decryptString($items->branch_name);
            $userdata['user_type'] = $items->usertype;
            $userdata['created_at'] = $items->created_at;
            $userdata['updated_at'] = $items->updated_at;
            $userdata['deleted_at'] = $items->deleted_at;

            return $userdata;
         });

         $response = [
            'users' => $getusers
        ];
        return response()->json($response, 200);
   
   }

   /**
     * getNumBranchUsersByType get the details of users under a particular user type for a branch
     *
     * @param  mixed $request
     * @param  mixed $id of the merchant
     * @param  mixed $user_type_id id of user_type_id of search
     * @return [json] all matching users
     */
    public function getNumBranchUsersByType(Request $request, $id, $user_type_id){

        //get all registered companies 
        $getnumusers = DB::table('users')
       ->where('users.branch_id', $id)
       ->where('users.usertype', $user_type_id)
       ->count();

         $response = [
            'num_users' => $getnumusers
        ];
        return response()->json($response, 200);
   
   }

}
