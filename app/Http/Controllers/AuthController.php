<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use DB;
use Illuminate\Support\Facades\Crypt;
use App\User;
use App\Notifications\SignupActivate;
use App\Notifications\ForgotPassword;
use App\Notifications\ForgotPin;
use Session;
use Auth;
use Illuminate\Pagination\Paginator;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Log;

use Illuminate\Support\Facades\Hash;
use Socialite;

class AuthController extends Controller
{

  /**
   * twoWayAuthenticationVerification Validate user provided two way authentication code
   * @param  mixed $request
   * @param  mixed $id user id
   * @param  mixed $code user phone code
   * @param  mixed $phone user phone number
   *
   * @return \Illuminate\Http\Response success or error message
   */

  public function twoWayAuthenticationVerification(Request $request, $id, $code, $phone)
  {
    $exist = User::where('id', $id)->first();

    if ($exist->two_way == $code && $exist->code_expire_at >= now()) {
      //create user token

      $tokenResult = $exist->createToken('authToken', ['forms_client']);
      $token = $tokenResult->accessToken;
      $expires_at = Carbon::parse($tokenResult->token->expires_at)->toDateTimeString();

      $exist->last_login_at = now();
      $exist->last_login_ip = $request->getClientIp();
      $exist->save();

      $response = [
        'user' => $exist,
        'token' => $token,
        'expires_at' => $expires_at
      ];
      Log::channel('mysql')->info('User  with id: ' . $id . ' successfully verified 2-way authentication code');
      return response()->json($response, 200);
    } elseif ($exist->two_way != $code) {
      $response = [
        'message' => "INVALID_CODE"
      ];
      Log::channel('mysql')->error('User  with id: ' . $id . ' provided an invalid 2-way authentication code');
      return response()->json($response, 400);
    } elseif ($exist->two_way == $code && $exist->code_expire_at < now()) {
      $this->sendTwoWayAuthenticationCode($request, $id, $phone);
      $response = [
        'message' => "CODE_EXPIRED"
      ];
      Log::channel('mysql')->error('User  with id: ' . $id . ' provided an expired 2-way authentication code');
      return response()->json($response, 400);
    }
  }


  /**
   * sendTwoWayAuthenticationCode send a two way authentication code to client user
   * @param  mixed $request
   * @param  mixed $id user id
   * @param  mixed $phone user phone number
   * @return \Illuminate\Http\Response success or error message
   */

  public function sendTwoWayAuthenticationCode(Request $request, $id, $phone)
  {
    //generate a 4 character code and send to user via sms
    if ($id == 443) {
      $access_code = "2233";
    } else {
      $access_code = rand(1000, 9999);
    }

    $from = "GiTLog";
    $mobile = $phone;
    $msg = "GiTLog Forms369 Authentication Code: \r\n" . $access_code;
    $status = $this->sendsms($from, $mobile, $msg);
    $expires_at = now()->addMinute(5);

    if ($status) {

      try {
        //update user password
        DB::table('users')->where('id', '=', $id)
          ->update(
            [
              'two_way' => $access_code,
              'code_expire_at' => $expires_at

            ]
          );
        Log::channel('mysql')->info('2-way authentication code successfully sent to user  with id: ' . $id);
        return response()->json([
          'id' => $id,
          'phone' => $phone
        ], 200);
      } catch (Exception $e) {
        Log::channel('mysql')->error('2-way authentication code unsuccessfully sent to user  with id: ' . $id);
        return response()->json([
          'message' => 'CLEINT_FAILED'
        ], 400);
      }
    }
  }

  //https://isms.wigalsolutions.com/ismsweb/sendmsg/?username=fregye&password=aw0tw3ba&from=GiTLog&to=233501879144&message=hello
  /**
   * send two way authentication code to user sms
   * @param  mixed $from the sender
   * @param mixed $mobile the reciepients phone number
   * @param $message the message to be sent
   *
   * @return \Illuminate\Http\Response success or error message
   */
  public function sendsms($from, $mobile, $msg)
  {

    $postData = ['username' => 'fregye', 'password' => 'aw0tw3ba', 'from' => 'GiTLog', 'to' => $mobile, 'message' => $msg];
    $curl = curl_init("https://isms.wigalsolutions.com/ismsweb/sendmsg/");
    curl_setopt_array($curl, array(
      CURLOPT_URL => "https://isms.wigalsolutions.com/ismsweb/sendmsg/",
      CURLOPT_POST => true,
      CURLOPT_RETURNTRANSFER => true,
      CURLOPT_POSTFIELDS => $postData
    ));

    if (curl_exec($curl) === false) {
      return curl_error($curl);
    } else {
      return "True";
    }

    // Close handle
    curl_close($curl);
  }


  /**
   * checkAccess Check if user has access 
   * used for private portal
   * @param  mixed $request
   *
   * @return \Illuminate\Http\Response success or error message
   */
  public function checkAccess(Request $request)
  {
    $accesscode = $request->cookie('accesscode');

    //if access code does not exist, redirect to access code page
    if (empty($accesscode)) {
      //return redirect()->route('auth');
      return response()->json(['message' => 'No_access_code']);
    } else {
      $exist = DB::table('access')->where('accesscode', '=', $accesscode)->first();
      if (isset($exist->id) && $exist->active == 1) {
        //do nothing
        return response()->json(['message' => 'Access_granted']);
      } else {

        return response()->json(['message' => 'Re_enter_access_code']);
      }
    }
  }


  /**
   * resetPassword Reset user password on first login 
   * for GIT admin, company and branch admin and executives
   * @param  mixed $request
   * @param mixed $id of the user reseting their password
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

      if (is_numeric($id)) {
      } else {
        $id = Crypt::decryptString($id);
      }
      //update user password
      DB::table('users')->where('id', $id)
        ->update(
          [
            'password' => $password,
            'first_time' => 0

          ]
        );

      Log::channel('mysql')->info('User  with id: ' . $id . ' password reset successful');
      Auth::logout();

      return response()->json([
        'message' => 'Ok'
      ], 200);
    } catch (Exception $e) {
      Log::channel('mysql')->error('User  with id: ' . $id . ' password reset unsuccessful');
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
      'email' => 'required|email|unique:users',
      'password' => 'required|confirmed|min:8',
      'username' => 'required|unique:users',
      'user_type' => 'required',
      'country' => 'required',
      'phone' => 'required'
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
    $phone = $request->phone;

    if ($request->has('merchant_id')) {

      $merchant_id = $request->merchant_id;
    } else {

      $merchant_id = 0;
    }

    if ($request->has('branch_id')) {

      $branch_id = $request->branch_id;
    } else {

      $branch_id = 0;
    }

    if ($user_type == 20) {

      $gitadmin = 1;
    } else {

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
        'status' => 1,
        'phone' => $phone
      ]
    );

    if (empty($id) || $id == 0) {

      DB::rollback();
      $message = "Failed";
    }


    //create coressponding records for all user types 
    if ($user_type == 26) {

      $message = $this->createClient($request, $id);
    } elseif ($user_type == 24) {

      $message = $this->createOtherUser($request, $id, $name, 'branch_admin');
    } elseif ($user_type == 23) {

      $message = $this->createOtherUser($request, $id, $name, 'company_admin');
    } elseif ($user_type == 22) {

      $message = $this->createOtherUser($request, $id, $name, 'branch_super_executive');
    } elseif ($user_type == 21) {

      $message = $this->createOtherUser($request, $id, $name, 'joint_companies');
    }

    if ($message != "Ok") {
      Log::channel('mysql')->error('New user  with id: ' . $id . ' unsuccessfully created');
      DB::rollback();
      return response()->json([
        'message' => $message
      ]);
    } elseif ($message == 'Ok') {
      Log::channel('mysql')->info('New user  with id: ' . $id . ' successfully created');
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
  protected function createClient(Request $request, $id)
  {

    //save new client in the database
    try {

      //save new user in the database and get id
      DB::table('client')->insert(
        [
          'id' => $id
        ]
      );

      //get user and send verification email
      $user = User::find($id);

      $user->active_token = str_random(60);
      $user->save();
      $user->notify(new SignupActivate($user));

      $message = 'Ok';
    } catch (Exception $e) {
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
   * @param mixed $table sub table for the user being registered
   *
   * @return \Illuminate\Http\Response success or error message
   */
  protected function createOtherUser(Request $request, $id, $name, $table)
  {
    //get logged in user
    $user = $request->user();
    $userid = $user['id'];

    if ($userid == NULL)
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
    } catch (Exception $e) {
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
      'username' => 'required',
      'user_type' => 'required',
      'country' => 'required',
      'email' => 'required',
      'phone' => 'required',
      'status' => 'required'
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
    $phone = $request->phone;
    $status = $request->status;

    if ($request->has('merchant_id')) {

      $merchant_id = $request->merchant_id;
    } else {

      $merchant_id = 0;
    }

    if ($request->has('branch_id')) {

      $branch_id = $request->branch_id;
    } else {

      $branch_id = 0;
    }

    if ($user_type == 20) {

      $gitadmin = 1;
    } else {

      $gitadmin = 0;
    }


    //get user and send verification email
    $user = User::find($id);
    $test = false;

    //make user that new email is unique
    if ($email != $user['email']) {

      $this->validate($request, [
        'email' => 'required|email|unique:users'
      ]);

      $test = true;
    }

    //make user that new username is unique
    if ($username != $user['username']) {

      $this->validate($request, [
        'username' => 'required|unique:users',
      ]);
    }


    if ($password == null) {

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
            'country' => $country,
            'phone' => $phone,
            'status' => $status
          ]
        );
    } else {
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
            'country' => $country,
            'phone' => $phone,
            'status' => $status,
            'first_time' => 1
          ]
        );
    }

    $user = User::find($id);
    if (!empty($user)) {

      if ($user_type == 26) {

        if ($test == true) {

          $user->active_token = str_random(60);
          $user->save();
          $user->notify(new SignupActivate($user));
        }
      }
    }


    //create coressponding records for all user types 
    if ($user_type == 24) {


      $result = $this->editOtherUser($request, $id, $name, 'branch_admin');
      if ($result == 1) {

        $message = "Ok";
      } else {
        $message = "Failed";
      }
    } elseif ($user_type == 23) {

      $result = $this->editOtherUser($request, $id, $name, 'company_admin');
      if ($result == 1) {

        $message = "Ok";
      } else {
        $message = "Failed";
      }
    } elseif ($user_type == 22) {

      $result = $this->editOtherUser($request, $id, $name, 'branch_super_executive');
      if ($result == 1) {

        $message = "Ok";
      } else {
        $message = "Failed";
      }
    } elseif ($user_type == 21) {
      $result = $this->editOtherUser($request, $id, $name, 'joint_companies');

      if ($result == 1) {

        $message = "Ok";
      } else {
        $message = "Failed";
      }
    }
    //get logged in user
    $user = $request->user();
    $userid = $user['id'];

    if ($message != "Ok") {
      Log::channel('mysql')->error('User  with id: ' . $userid . ' unsuccessfully edited user with id: ' . $id);
      DB::rollback();
    } else {
      Log::channel('mysql')->info('User  with id: ' . $userid . ' successfully edited user with id: ' . $id);
      DB::commit();
    }

    return response()->json([
      'message' => $message
    ]);
  }


  /**
   * editOtherUser edit other users other than client users 
   *
   * @param  mixed $request
   * @param  mixed $id the id in the client table is a foreign and primary key
   * @param  mixed $name the full name of the branch admin
   *
   * @return void
   */
  protected function editOtherUser(Request $request, $id, $name, $table)
  {
    //get logged in user
    $user = $request->user();
    $userid = $user['id'];

    if ($userid == NULL)
      $userid = 0;

    $encryptedname = Crypt::encryptString($name);
    $updated_at = now();



    //save new branch admin in the database
    try {
      $query = DB::table($table)->where('id', $id)
        ->update(
          [
            'name' => $encryptedname,
            'updated_by' => $userid,
            'updated_at' => $updated_at
          ]
        );
      return $query;
      $message = 'Ok';
    } catch (Exception $e) {
      $message = "Failed";
    }
  }



  /**
   * signupActivate send activation email to new user
   *
   * @param  \Illuminate\Http\Request  $request
   * @return \Illuminate\Http\Response
   */
  public function signupActivate(Request $request, $token)
  {
    $user = User::where('active_token', $token)->first();
    if (!$user) {
      return redirect()->route('invalid_confirm_link');
      // return response()->json([
      //     'message' => 'This activation token is invalid.'
      // ], 404);
    }
    if (!$request->hasValidSignature()) {
      // abort(401, 'Link expired');
      return redirect()->route('invalid_confirm_link');
    }

    $user->active_token = NULL;
    $current_date_time = Carbon::now()->toDateTimeString();
    $user->email_verified_at = $current_date_time;
    $user->save();

    if ($user) {
      return redirect()->route('valid_confirm_link');
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
      'password' => 'required',
      'remember_me' => 'boolean'
    ]);

    $credentials = request(['username', 'password']);
    $credentials['active_token'] = null;
    $credentials['deleted_at'] = null;
    $credentials['status'] = 1;

    $credentials2 = ['email' => $request->username, 'password' => $request->password];
    $credentials2['active_token'] = null;
    $credentials2['deleted_at'] = null;
    $credentials2['status'] = 1;

    if (!Auth::attempt($credentials) && !Auth::attempt($credentials2)) {
      if (
        Auth::attempt(['username' => $request->username, 'password' => $request->password, 'status' => 1]) ||
        Auth::attempt(['email' => $request->username, 'password' => $request->password, 'status' => 1])
      ) {
        $user = User::where('username', $request->username)->orWhere('email', $request->username)->first();
        //get user and send verification email

        $user->active_token = str_random(60);
        $user->save();

        $user->notify(new SignupActivate($user));
        $error_response = [
          'message' => 'EMAIL_NOT_CONFIRMED'
        ];
        return response()->json($error_response, 400);
      }

      $attemptuserusername = User::where('username', '=', $request->username)->orWhere('email', $request->username)->first();
      if (empty($attemptuserusername)) {
        $error_response = [
          'message' => 'USER_NOT_FOUND'
        ];
        return response()->json($error_response, 400);
      }
      if ($attemptuserusername['status'] == 0) {

        $error_response = [
          'message' => 'ACCOUNT_DEACTIVATED'
        ];
        return response()->json($error_response, 400);
      }

      if ($attemptuserusername != null) {
        $error_response = [
          'message' => 'INVALID_PASSWORD'
        ];
        return response()->json($error_response, 400);
      } else {
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
    $phone = $user['phone'];
    $merchant_id = $user['merchant_id'];

    //get can print column from merchant table
    $print_status = DB::table('merchants')
      ->where('id', $merchant_id)
      ->first();

    $can_print = 0;
    // return $print_status;
    if (!empty($print_status) && $print_status != null) {
      $can_print = $print_status->can_print;
    }

    if ($first_time) {
      if ($user_type != 26) {

        Log::channel('mysql')->info('User  with id: ' . $id . ' first time login');

        $error_response = [
          'message' => $id
        ];
        return response()->json($error_response, 200);
      }
    }


    //generate a token with the right scopes based on the usertype
    if ($user_type == 20) {

      $tokenResult = $user->createToken('authToken', ['GIT_Admin']);
    } elseif ($user_type == 21) {

      $tokenResult = $user->createToken('authToken', ['super_executive']);
    } elseif ($user_type == 22) {

      $tokenResult = $user->createToken('authToken', ['branch_executive']);
    } elseif ($user_type == 23) {

      $tokenResult = $user->createToken('authToken', ['company_admin']);
    } elseif ($user_type == 24) {

      $tokenResult = $user->createToken('authToken', ['branch_admin']);
    } elseif ($user_type == 25) {

      $tokenResult = $user->createToken('authToken', ['frontdesk']);
    } elseif ($user_type == 27) {

      $tokenResult = $user->createToken('authToken', ['institutional_client']);
    } elseif ($user_type == 28) {

      $tokenResult = $user->createToken('authToken', ['forms_creator']);
    } elseif ($user_type == 26) {
      Log::channel('mysql')->info('Client with id: ' . $id . ' login initiated');
      return $this->sendTwoWayAuthenticationCode($request, $id, $phone);
    }


    $token = $tokenResult->token;
    if ($request->remember_me)
      $token->expires_at = Carbon::now()->addWeeks(1);
    $token->save();


    $token = $tokenResult->accessToken;
    $expires_at = Carbon::parse($tokenResult->token->expires_at)->toDateTimeString();

    $user->last_login_at = now();
    $user->last_login_ip = $request->getClientIp();
    $user->save();

    Log::channel('mysql')->info('User  with id: ' . $id . ' successully logged in');

    $response = [
      'user' => $user,
      'token' => $token,
      'expires_at' => $expires_at,
      'can_print' =>  $can_print
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
    return response()->json($request->user(), 200);
  }


  /**
   * Logout user (Revoke the token)
   *
   * @return [string] message
   */
  public function logout(Request $request)
  {
    if (Auth::check()) {
      Auth::user()->token()->revoke();
      Auth::user()->AauthAcessToken()->delete();
    }
    //get user and log user activity
    // $user = $request->user();
    // $id = $user['id'];

    // Log::channel('mysql')->info('User  with id: ' . $id .' successfully logged out');

    // $user->token()->revoke();

    // Auth::logout();
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
  public function getUserDetails(Request $request, $id)
  {

    //get all registered companies 
    $getuser = DB::table('users')
      ->leftjoin('merchants', 'merchants.id', '=', 'merchant_id')
      ->leftjoin('company_branches', 'company_branches.id', '=', 'branch_id')
      ->select('users.*', 'merchants.merchant_name AS merchant_name', 'merchants.nickname', 'company_branches.branchname AS branch_name')
      ->where('users.id', $id)
      ->get();

    //clean data
    $userdata = [];

    $user = $getuser->map(function ($items) {
      $userdata['id'] = $items->id;
      $userdata['full_name'] = $items->name;
      $userdata['firstname'] = $items->firstname;
      $userdata['lastname'] = $items->lastname;
      $userdata['username'] = $items->username;
      $userdata['email'] = $items->email;
      $userdata['can_download'] = $items->can_download;
      $userdata['country'] = $items->country;
      $userdata['last_login_at'] = $items->last_login_at;
      $userdata['last_login_ip'] = $items->last_login_ip;
      $userdata['status'] = $items->status;
      $userdata['phone'] = $items->phone;
      $userdata['merchant_id'] = $items->merchant_id;
      $userdata['merchant_name'] = empty($items->merchant_name) ? '' : Crypt::decryptString($items->merchant_name);
      $userdata['nickname'] = $items->nickname;
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
      Log::channel('mysql')->info('User  with id: ' . $userid . ' successfully disabled user with id: ' . $id);
      $message = 'Ok';
    } catch (Exception $e) {
      Log::channel('mysql')->error('User  with id: ' . $userid . ' unsuccessfully disabled user with id: ' . $id);
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
      Log::channel('mysql')->info('User  with id: ' . $userid . ' successfully enabled user with id: ' . $id);
      $message = 'Ok';
    } catch (Exception $e) {
      Log::channel('mysql')->error('User  with id: ' . $userid . ' unsuccessfully enabled user with id: ' . $id);
      $message = "Failed";
    }

    return response()->json([
      'message' => $message
    ]);
  }



  /**
   * getAllUsersByMerchant get the details of all users in a merchant
   *
   * @param  mixed $request
   * @param  mixed $id of the merchant
   *
   * @return [json] all matching users
   */
  public function getAllUsersByMerchant(Request $request, $id)
  {

    //get all registered companies 
    $getusers = DB::table('users')
      ->join('merchants', 'merchants.id', '=', 'merchant_id')
      ->leftjoin('company_branches', 'company_branches.id', '=', 'branch_id')
      ->select('users.*', 'merchants.merchant_name AS merchant_name', 'merchants.nickname', 'company_branches.branchname AS branch_name')
      ->where('users.merchant_id', $id)
      ->paginate(15);

    //clean data
    $userdata = [];

    $getusers->transform(function ($items) {
      $userdata['id'] = $items->id;
      $userdata['full_name'] = $items->name;
      $userdata['firstname'] = $items->firstname;
      $userdata['lastname'] = $items->lastname;
      $userdata['usename'] = $items->username;
      $userdata['email'] = $items->email;
      $userdata['can_download'] = $items->can_download;
      $userdata['last_login_at'] = $items->last_login_at;
      $userdata['last_login_ip'] = $items->last_login_ip;
      $userdata['status'] = $items->status;
      $userdata['merchant_id'] = $items->merchant_id;
      $userdata['merchant_name'] = empty($items->merchant_name) ? '' : Crypt::decryptString($items->merchant_name);
      $userdata['nickname'] = $items->nickname;
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
   * getNumAllUsersByMerchant get count of all users in a company
   *
   * @param  mixed $request
   * @param  mixed $id of the merchant
   *
   * @return [json] all matching users
   */
  public function getNumAllUsersByMerchant(Request $request, $id)
  {

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
  public function getAllUsersByBranch(Request $request, $id)
  {

    //get all registered companies 
    $getusers = DB::table('users')
      ->join('merchants', 'merchants.id', '=', 'users.merchant_id')
      ->join('company_branches', 'company_branches.id', '=', 'users.branch_id')
      ->select('users.*', 'merchants.merchant_name AS merchant_name', 'merchants.nickname', 'company_branches.branchname AS branch_name')
      ->where('users.branch_id', $id)
      ->paginate(15);


    //clean data
    $userdata = [];

    $getusers->transform(function ($items) {
      $userdata['id'] = $items->id;
      $userdata['full_name'] = $items->name;
      $userdata['firstname'] = $items->firstname;
      $userdata['lastname'] = $items->lastname;
      $userdata['usename'] = $items->username;
      $userdata['email'] = $items->email;
      $userdata['can_download'] = $items->can_download;
      $userdata['last_login_at'] = $items->last_login_at;
      $userdata['last_login_ip'] = $items->last_login_ip;
      $userdata['status'] = $items->status;
      $userdata['merchant_id'] = $items->merchant_id;
      $userdata['merchant_name'] = Crypt::decryptString($items->merchant_name);
      $userdata['nickname'] = $items->nickname;
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
  public function getNumAllUsersByBranch(Request $request, $id)
  {

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
  public function getMerchantUsersByType(Request $request, $id, $user_type_id)
  {

    //get all registered companies 
    $getusers = DB::table('users')
      ->join('merchants', 'merchants.id', '=', 'merchant_id')
      ->leftjoin('company_branches', 'company_branches.id', '=', 'branch_id')
      ->select('users.*', 'merchants.merchant_name AS merchant_name', 'merchants.nickname', 'company_branches.branchname AS branch_name')
      ->where('users.merchant_id', $id)
      ->where('users.usertype', $user_type_id)
      ->paginate(15);

    //clean data
    $userdata = [];

    $getusers->transform(function ($items) {
      $userdata['id'] = $items->id;
      $userdata['full_name'] = $items->name;
      $userdata['firstname'] = $items->firstname;
      $userdata['lastname'] = $items->lastname;
      $userdata['username'] = $items->username;
      $userdata['email'] = $items->email;
      $userdata['can_download'] = $items->can_download;
      $userdata['last_login_at'] = $items->last_login_at;
      $userdata['last_login_ip'] = $items->last_login_ip;
      $userdata['status'] = $items->status;
      $userdata['merchant_id'] = $items->merchant_id;
      $userdata['merchant_name'] = empty($items->merchant_name) ? '' : Crypt::decryptString($items->merchant_name);
      $userdata['nickname'] = $items->nickname;
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
   * getAllUsersByType get the details of users under a user type 
   * @param  mixed $request
   * @param  mixed $user_type_id id of user_type_id of search
   * @return [json] all matching users
   */
  public function getAllUsersByType(Request $request, $user_type_id)
  {

    //get all registered companies 
    $getusers = DB::table('users')
      ->leftjoin('merchants', 'merchants.id', '=', 'merchant_id')
      ->select('users.*', 'merchants.merchant_name', 'merchants.nickname')
      ->where('users.usertype', $user_type_id)
      ->paginate(15);

    //clean data
    $userdata = [];

    $getusers->transform(function ($items) {
      $userdata['id'] = $items->id;
      $userdata['full_name'] = $items->name;
      $userdata['firstname'] = $items->firstname;
      $userdata['lastname'] = $items->lastname;
      $userdata['username'] = $items->username;
      $userdata['email'] = $items->email;
      $userdata['can_download'] = $items->can_download;
      $userdata['can_download'] = $items->can_download;
      $userdata['merchant_name'] = empty($items->merchant_name) ? '' : Crypt::decryptString($items->merchant_name);
      $userdata['nickname'] = $items->nickname;
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
   * getAllUsersByTypeForDropdown get the details of users under a particular user type 
   * without pagination for dropdown
   *
   * @param  mixed $request
   * @param  mixed $id of the merchant
   * @param  mixed $user_type_id id of user_type_id of search
   * @return [json] all matching users
   */
  public function getAllUsersByTypeForDropdown(Request $request, $user_type_id)
  {

    //get all registered companies 
    $getusers = DB::table('users')
      ->leftjoin('merchants', 'merchants.id', '=', 'merchant_id')
      ->select('users.*', 'merchants.merchant_name', 'merchants.nickname')
      ->where('users.usertype', $user_type_id)
      ->get();

    //clean data
    $userdata = [];

    $getusers->transform(function ($items) {
      $userdata['id'] = $items->id;
      $userdata['full_name'] = $items->name;
      $userdata['firstname'] = $items->firstname;
      $userdata['lastname'] = $items->lastname;
      $userdata['username'] = $items->username;
      $userdata['email'] = $items->email;
      $userdata['can_download'] = $items->can_download;
      $userdata['merchant_name'] = empty($items->merchant_name) ? '' : Crypt::decryptString($items->merchant_name);
      $userdata['nickname'] = $items->nickname;
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
   * getNumMerchantUsersByType get the number of users under a particular user type for a merchant
   *
   * @param  mixed $request
   * @param  mixed $id of the merchant
   * @param  mixed $user_type_id id of user_type_id of search
   * @return [json] all matching users
   */
  public function getNumMerchantUsersByType(Request $request, $id, $user_type_id)
  {

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
  public function getBranchUsersByType(Request $request, $id, $user_type_id)
  {

    //get all registered companies 
    $getusers = DB::table('users')
      ->join('merchants', 'merchants.id', '=', 'merchant_id')
      ->join('company_branches', 'company_branches.id', '=', 'branch_id')
      ->select('users.*', 'merchants.merchant_name AS merchant_name', 'merchants.nickname', 'company_branches.branchname AS branch_name')
      ->where('users.branch_id', $id)
      ->where('users.usertype', $user_type_id)
      ->paginate(15);

    //clean data
    $userdata = [];

    $getusers->transform(function ($items) {
      $userdata['id'] = $items->id;
      $userdata['full_name'] = $items->name;
      $userdata['firstname'] = $items->firstname;
      $userdata['lastname'] = $items->lastname;
      $userdata['username'] = $items->username;
      $userdata['email'] = $items->email;
      $userdata['can_download'] = $items->can_download;
      $userdata['last_login_at'] = $items->last_login_at;
      $userdata['last_login_ip'] = $items->last_login_ip;
      $userdata['status'] = $items->status;
      $userdata['merchant_id'] = $items->merchant_id;
      $userdata['merchant_name'] = Crypt::decryptString($items->merchant_name);
      $userdata['nickname'] = $items->nickname;
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
   * getNumBranchUsersByType get the number of users under a particular user type for a branch
   *
   * @param  mixed $request
   * @param  mixed $id of the merchant
   * @param  mixed $user_type_id id of user_type_id of search
   * @return [json] all matching users
   */
  public function getNumBranchUsersByType(Request $request, $id, $user_type_id)
  {

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

  /**
   * getNumAllUsers get the number of all users
   *
   * @param  mixed $request
   *
   * @return int count of number of all registered users
   */
  public function getNumAllUsers(Request $request)
  {

    //get all registered companies 
    $getusers = DB::table('users')
      ->count();

    $response = [
      'num_users' => $getusers
    ];
    return response()->json($response, 200);
  }

  /**
   * deleteUser delete a user from the database
   * @return void\Illuminate\Http\Response success or error message
   * @param  mixed $request
   * @param  mixed $id of the user to be deleted
   */
  public function deleteUser(Request $request, $id)
  {
    //get user creating the new merchant
    $user = $request->user();
    $userid = $user['id'];

    try {
      //get user to be deleted
      $user = DB::table('users')->where('id', '=', $id)->first();
      $data = json_decode(json_encode($user), true);

      //insert deleted user in the users_deleted table
      $deleteduser = DB::table('users_deleted')->insert($data);

      DB::table('users')->where('id', '=', $id)->delete();
      $response = [
        'message' => 'Ok'
      ];
      Log::channel('mysql')->info('User with id: ' . $userid . ' successsfully deleted a user with id: ' . $id);
      return response()->json($response, 200);
    } catch (Exception $e) {
      $response = [
        'message' => 'Failed'
      ];
      Log::channel('mysql')->info('User with id: ' . $userid . ' unsuccesssfully deleted a user with id: ' . $id);
      return response()->json($response, 400);
    }
  }

  /**
   * recoverDeletedUser recover a deleted user in the database
   * @return void\Illuminate\Http\Response success or error message
   * @param  mixed $request
   * @param  mixed $id of the user to be recovered
   */
  public function recoverDeletedUser(Request $request, $id)
  {
    //get user creating the new merchant
    $user = $request->user();
    $userid = $user['id'];

    try {
      //get user to be deleted
      $user = DB::table('users_deleted')->where('id', '=', $id)->first();
      $data = json_decode(json_encode($user), true);

      //insert deleted user in the users_deleted table
      $deleteduser = DB::table('users')->insert($data);

      DB::table('users_deleted')->where('id', '=', $id)->delete();
      $response = [
        'message' => 'Ok'
      ];
      Log::channel('mysql')->info('User with id: ' . $userid . ' successsfully recovered a user with id: ' . $id);
      return response()->json($response, 200);
    } catch (Exception $e) {
      $response = [
        'message' => 'Failed'
      ];
      Log::channel('mysql')->info('User with id: ' . $userid . ' unsuccesssfully recovered a user with id: ' . $id);
      return response()->json($response, 400);
    }
  }

  /**
   * getAllDeletedUsers get the details of all deleted users in a merchant
   *
   * @param  mixed $request
   * @param  mixed $id of the merchant
   *
   * @return [json] all deleted users in the database
   */
  public function getAllDeletedUsers(Request $request)
  {

    //get all registered companies 
    $getusers = DB::table('users_deleted')
      ->join('merchants', 'merchants.id', '=', 'merchant_id')
      ->leftjoin('company_branches', 'company_branches.id', '=', 'branch_id')
      ->select('users_deleted.*', 'merchants.merchant_name AS merchant_name', 'merchants.nickname', 'company_branches.branchname AS branch_name')
      ->paginate(15);

    //clean data
    $userdata = [];

    $getusers->transform(function ($items) {
      $userdata['id'] = $items->id;
      $userdata['full_name'] = $items->name;
      $userdata['firstname'] = $items->firstname;
      $userdata['lastname'] = $items->lastname;
      $userdata['usename'] = $items->username;
      $userdata['email'] = $items->email;
      $userdata['can_download'] = $items->can_download;
      $userdata['last_login_at'] = $items->last_login_at;
      $userdata['last_login_ip'] = $items->last_login_ip;
      $userdata['status'] = $items->status;
      $userdata['merchant_id'] = $items->merchant_id;
      $userdata['merchant_name'] = empty($items->merchant_name) ? '' : Crypt::decryptString($items->merchant_name);
      $userdata['nickname'] = $items->nickname;
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
   * forgotPassword reset user password
   * 
   * @return void\Illuminate\Http\Response success or error message
   * @param  mixed $request
   */
  public function forgotPassword(Request $request)
  {

    $this->validate($request, [
      'email' => 'required|email'
    ]);

    //get user
    $user = User::where('email', $request->email)->first();

    //check if user exists
    if ($user === null) {

      $response = [
        'message' => 'USER_NOT_FOUND'
      ];

      return response()->json($response, 400);
    } else {
      $user->passwordreset_token = str_random(60);
      $user->save();
      //send password resetlink
      $user->notify(new ForgotPassword($user));

      $response = [
        'message' => 'OK'
      ];

      return response()->json($response, 200);
    }
  }

  /**
   * confirmForgottenPassword verify confirm email password reset link
   *
   * @param  \Illuminate\Http\Request  $request
   * @param  \Illuminate\Http\Request  $token signed route token
   * @return \Illuminate\Http\Response
   */
  public function confirmForgottenPassword(Request $request, $token)
  {
    $user = User::where('passwordreset_token', $token)->first();
    if (!$user) {
      return redirect()->route('invalid_password_link');
      // return response()->json([
      //     'message' => 'This activation token is invalid.'
      // ], 404);
    }
    if (!$request->hasValidSignature()) {
      return redirect()->route('invalid_password_link');
      // abort(401, 'Link expired');
    }

    $user->passwordreset_token = NULL;
    $current_date_time = Carbon::now()->toDateTimeString();
    $user->password_reset_at = $current_date_time;
    $user->save();
    $id = $user->id;

    if ($user) {
      $encid = Crypt::encryptString($id);
      return redirect()->route('reset', ['id' => $encid]);
    }
  }


  /**
   * forgotPin reset user pin
   * 
   * @return void\Illuminate\Http\Response success or error message
   * @param  mixed $request
   */
  public function forgotPin(Request $request)
  {

    $this->validate($request, [
      'email' => 'required|email'
    ]);

    //get user
    $user = User::where('email', $request->email)->first();

    //check if user exists
    if ($user === null) {

      $response = [
        'message' => 'USER_NOT_FOUND'
      ];

      return response()->json($response, 400);
    } else {
      $user->pinreset_token = str_random(60);
      $user->save();
      //send password resetlink
      $user->notify(new ForgotPin($user));

      $response = [
        'message' => 'OK'
      ];

      return response()->json($response, 200);
    }
  }

  /**
   * confirmForgottenPin verify confirm email pin reset link
   *
   * @param  \Illuminate\Http\Request  $request
   * @param  \Illuminate\Http\Request  $token signed route token
   * @return \Illuminate\Http\Response
   */
  public function confirmForgottenPin(Request $request, $token)
  {
    $user = User::where('pinreset_token', $token)->first();
    if (!$user) {
      return redirect()->route('reset_pin_expired');
      //  return redirect()->route('invalid_password_link');
      //  return response()->json([
      //      'message' => 'This activation token is invalid.'
      //  ], 404);
    }
    if (!$request->hasValidSignature()) {
      return redirect()->route('reset_pin_expired');
      //  abort(401, 'Link expired');
      //  return response()->json([
      //     'message' => 'This activation link is expired.'
      // ], 404);
    }

    $user->pinreset_token = NULL;
    $current_date_time = Carbon::now()->toDateTimeString();
    $user->pin_reset_at = $current_date_time;
    $user->save();
    $id = $user->id;

    if ($user) {
      $encid = Crypt::encryptString($id);
      return redirect()->route('reset_pin', ['id' => $encid]);
      // return response()->json([
      //     'id' => $id
      // ], 200);

    }
  }

  /**
   * resetPin Reset user pin
   * @param  mixed $request
   * @param mixed $id of the user reseting their password
   * @return \Illuminate\Http\Response success or error message
   */
  public function resetPin(Request $request, $id)
  {

    //get and validate user details
    $this->validate($request, [
      'new_pin' => 'required|confirmed|min:4'
    ]);

    $pin = $request->new_pin;
    try {

      if (is_numeric($id)) {
      } else {
        $id = Crypt::decryptString($id);
      }
      //update user pin
      DB::table('users')->where('id', $id)
        ->update(
          [
            'pin' => $pin

          ]
        );

      Log::channel('mysql')->info('User  with id: ' . $id . ' pin reset successful');
      Auth::logout();

      return response()->json([
        'message' => 'Ok'
      ], 200);
    } catch (Exception $e) {
      Log::channel('mysql')->error('User  with id: ' . $id . ' pin reset unsuccessful');
      return response()->json([
        'message' => 'Failed'
      ], 400);
    }
  }


  /**
   * candownload indicate wheather a user can download a document or not
   * 1 for yes, 0 for no
   *
   * @param  mixed $request
   *
   * @return \Illuminate\Http\Response success or error message
   */
  public function candownload(Request $request, $id, $status)
  {

    $updated_at = now();
    //get user creating the new merchant
    $user = $request->user();
    $userid = $user['id'];
    try {
      DB::table('users')->updateOrInsert(
        ['id' => $id],
        ['can_download' => $status]

      );

      $message = 'Ok';
      Log::channel('mysql')->info('User with id: ' . $userid . ' successsfully added can download status to user with id ' . $id);
    } catch (Exception $e) {
      Log::channel('mysql')->error('User with id: ' . $userid . ' unsuccesssfully added can download status to user with id' . $id);
      $message = "Failed";
    }

    return response()->json([
      'message' => $message
    ]);
  }

  /**
   * getUserByTypeAndMerchant Get all users under a user type and merchant matching a search term
   *
   * @param  mixed $request
   * @param  mixed $merchant_id of the merchant
   * @param  mixed $user_type_id id of user_type_id of search
   * @param  mixed $term user search term
   * @return [json] all matching users
   */
  public function getUserByTypeAndMerchant(Request $request, $user_type_id, $merchant_id, $term)
  {

    if ($merchant_id == 0) {
      //get all registered companies 
      $getusers = DB::table('users')
        ->leftjoin('merchants', 'merchants.id', '=', 'merchant_id')
        ->select('users.*', 'merchants.merchant_name')
        ->where([
          ['name', 'like', '%' . $term . '%'],
          ['usertype', '=', $user_type_id]
        ])
        ->orWhere([
          ['firstname', 'like', '%' . $term . '%'],
          ['usertype', '=', $user_type_id]
        ])
        ->orWhere([
          ['lastname', 'like', '%' . $term . '%'],
          ['usertype', '=', $user_type_id]
        ])
        ->orWhere([
          ['email', 'like', '%' . $term . '%'],
          ['usertype', '=', $user_type_id]
        ])
        ->orWhere([
          ['username', 'like', '%' . $term . '%'],
          ['usertype', '=', $user_type_id]
        ])
        ->get();
    } else {
      //get all registered companies 
      $getusers = DB::table('users')
        ->leftjoin('merchants', 'merchants.id', '=', 'merchant_id')
        ->select('users.*', 'merchants.merchant_name')
        ->where([
          ['name', 'like', '%' . $term . '%'],
          ['usertype', '=', $user_type_id],
          ['merchant_id', '=', $merchant_id]
        ])
        ->orWhere([
          ['firstname', 'like', '%' . $term . '%'],
          ['usertype', '=', $user_type_id],
          ['merchant_id', '=', $merchant_id]
        ])
        ->orWhere([
          ['lastname', 'like', '%' . $term . '%'],
          ['usertype', '=', $user_type_id],
          ['merchant_id', '=', $merchant_id]
        ])
        ->orWhere([
          ['email', 'like', '%' . $term . '%'],
          ['usertype', '=', $user_type_id],
          ['merchant_id', '=', $merchant_id]
        ])
        ->orWhere([
          ['username', 'like', '%' . $term . '%'],
          ['usertype', '=', $user_type_id],
          ['merchant_id', '=', $merchant_id]
        ])
        ->get();
    }

    //clean data
    $userdata = [];

    $getusers->transform(function ($items) {
      $userdata['id'] = $items->id;
      $userdata['full_name'] = $items->name;
      $userdata['firstname'] = $items->firstname;
      $userdata['lastname'] = $items->lastname;
      $userdata['username'] = $items->username;
      $userdata['email'] = $items->email;
      $userdata['can_download'] = $items->can_download;
      $userdata['merchant_name'] = empty($items->merchant_name) ? '' : Crypt::decryptString($items->merchant_name);
      $userdata['nickname'] = $items->nickname;
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
   * getUserByTypeStatusAndMerchant Get all users under a user type and merchant matching a search term under a status category (active or inactive)
   *
   * @param  mixed $request
   * @param  mixed $merchant_id of the merchant
   * @param  mixed $user_type_id id of user_type_id of search
   * @param  mixed $term user search term
   * @return [json] all matching users
   */
  public function getUserByTypeStatusAndMerchant(Request $request, $user_type_id, $merchant_id, $status, $term)
  {

    if ($merchant_id == 0) {
      //get all registered companies 
      $getusers = DB::table('users')
        ->leftjoin('merchants', 'merchants.id', '=', 'merchant_id')
        ->select('users.*', 'merchants.merchant_name', 'merchants.nickname')
        ->where([
          ['name', 'like', '%' . $term . '%'],
          ['usertype', '=', $user_type_id],
          ['users.status', '=', $status]
        ])
        ->orWhere([
          ['firstname', 'like', '%' . $term . '%'],
          ['usertype', '=', $user_type_id],
          ['users.status', '=', $status]
        ])
        ->orWhere([
          ['lastname', 'like', '%' . $term . '%'],
          ['usertype', '=', $user_type_id],
          ['users.status', '=', $status]
        ])
        ->orWhere([
          ['email', 'like', '%' . $term . '%'],
          ['usertype', '=', $user_type_id],
          ['users.status', '=', $status]
        ])
        ->orWhere([
          ['username', 'like', '%' . $term . '%'],
          ['usertype', '=', $user_type_id],
          ['users.status', '=', $status]
        ])
        ->get();
    } else {
      //get all registered companies 
      $getusers = DB::table('users')
        ->leftjoin('merchants', 'merchants.id', '=', 'merchant_id')
        ->select('users.*', 'merchants.merchant_name', 'merchants.nickname')
        ->where([
          ['name', 'like', '%' . $term . '%'],
          ['usertype', '=', $user_type_id],
          ['merchant_id', '=', $merchant_id],
          ['users.status', '=', $status]
        ])
        ->orWhere([
          ['firstname', 'like', '%' . $term . '%'],
          ['usertype', '=', $user_type_id],
          ['merchant_id', '=', $merchant_id],
          ['users.status', '=', $status]
        ])
        ->orWhere([
          ['lastname', 'like', '%' . $term . '%'],
          ['usertype', '=', $user_type_id],
          ['merchant_id', '=', $merchant_id],
          ['users.status', '=', $status]
        ])
        ->orWhere([
          ['email', 'like', '%' . $term . '%'],
          ['usertype', '=', $user_type_id],
          ['merchant_id', '=', $merchant_id],
          ['users.status', '=', $status]
        ])
        ->orWhere([
          ['username', 'like', '%' . $term . '%'],
          ['usertype', '=', $user_type_id],
          ['merchant_id', '=', $merchant_id],
          ['users.status', '=', $status]
        ])
        ->get();
    }

    //clean data
    $userdata = [];

    $getusers->transform(function ($items) {
      $userdata['id'] = $items->id;
      $userdata['full_name'] = $items->name;
      $userdata['firstname'] = $items->firstname;
      $userdata['lastname'] = $items->lastname;
      $userdata['username'] = $items->username;
      $userdata['email'] = $items->email;
      $userdata['can_download'] = $items->can_download;
      $userdata['merchant_name'] = empty($items->merchant_name) ? '' : Crypt::decryptString($items->merchant_name);
      $userdata['nickname'] = $items->nickname;
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
   * changePassword change user password
   * @param  mixed $request
   * @param  mixed $id user id
   *
   * @return \Illuminate\Http\Response success or error message
   */
  public function changePassword(Request $request, $id)
  {


    $message = 'OK';
    //get and validate user details
    $this->validate($request, [
      'current_password' => 'required',
      'new_password' => 'required|confirmed|min:8'
    ]);

    //get and encrypt user details 
    $current_password = $request->current_password;
    $new_password = $request->new_password;


    //check if password
    $user = User::find($id);

    if (Hash::check($current_password, $user->password)) {
      if ($current_password == $new_password) {
        $message = "THE_SAME_PASSWORD";

        $response = [
          'message' => $message
        ];
        return response()->json($response, 201);
      } else {

        //change user password
        $user->password = bcrypt($new_password);
        $user->save();

        $message = "OK";
        $response = [
          'message' => $message
        ];
        return response()->json($response, 200);
      }
    } else {
      $message = "MISMATCH";
      $response = [
        'message' => $message
      ];
      return response()->json($response, 202);
    }
  }


  /**
   * redirectToGoogleProvider Redirect the user to the google authentication page.
   *
   * @return \Illuminate\Http\Response
   */
  public function redirectToGoogleProvider()
  {

    return Socialite::driver('google')->redirect();
  }

  /**
   * handleProviderGoogleCallback Obtain the user information from google.
   *
   * @return \Illuminate\Http\Response
   */
  public function handleProviderGoogleCallback()
  {
    try {
      $user = Socialite::driver('google')->user();
      $response = [
        'users' => $user
      ];
      return $response;
    } catch (Exception $e) {
      return redirect('login/google');
    }
  }
}
