<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

//register a user
Route::post('registerUser', 'AuthController@createNewUser')->name('registerUser');
Route::get('signup/activate/{token}', 'AuthController@signupActivate')->name('signup/activate');

//login user 
Route::post('login', 'AuthController@login')->name('login');

//protected routes 
Route::group(['middleware' => ['auth:api'], 'prefix' => 'v1'], function(){

    //use endpoints 
    Route::post('editUser/{id}', 'AuthController@editUser')->name('editUser');
    Route::get('getUser/{id}', 'AuthController@getUserDetails')->name('getUser');
    

    //merchant setup, view and update apis
    Route::post('uploadImage', 'MediaController@imageUpload')->name('uploadImage')->middleware('scope:GIT_Admin,company_admin');
    Route::post('createMerchant', 'SetupController@createMerchant')->name('createMerchant')->middleware('scope:GIT_Admin');
    Route::post('editMerchant/{id}', 'SetupController@editMerchant')->name('editMerchant')->middleware('scope:GIT_Admin,company_admin');
    Route::get('getAllMerchants', 'SetupController@getMerchants')->name('getAllMerchants')->middleware('scope:GIT_Admin');
    Route::get('getMerchantDetails/{id}', 'SetupController@getMerchantDetails')->name('getMerchantDetails')->middleware('scope:GIT_Admin,super_executive,company_admin,branch_executive,branch_admin');
    Route::get('getAllMerchantsByCountry/{country}', 'SetupController@getAllMerchantsByCountry')->name('getAllMerchantsByCountry');
   
    
    
    //company branch setup and update apis
    Route::post('createCompanyBranch', 'SetupController@createCompanyBranches')->name('createCompanyBranch')->middleware('scope:GIT_Admin');
    Route::post('editCompanyBranch/{id}', 'SetupController@editCompanyBranches')->name('editCompanyBranch')->middleware('scope:GIT_Admin');
    Route::get('getAllBranches', 'SetupController@getAllBranches')->name('getAllBranches')->middleware('scope:GIT_Admin');
    Route::get('getCompanyBranches/{id}', 'SetupController@getCompanyBranches')->name('getCompanyBranches')->middleware('scope:GIT_Admin,company_admin');
    Route::get('getCompanyBranchDetails/{id}', 'SetupController@getCompanyBranchDetails')->name('getCompanyBranchDetails')->middleware('scope:GIT_Admin,super_executive,company_admin,branch_executive,branch_admin');
    
    

    //user types setup, view and update apis
    Route::post('createUserType', 'SetupController@createUserType')->name('createUserType')->middleware('scope:GIT_Admin');
    Route::post('editUserType', 'SetupController@editUserType')->name('editUserType')->middleware('scope:GIT_Admin');
    Route::post('deleteUserType/{id}', 'SetupController@deleteUserType')->name('deleteUserType')->middleware('scope:GIT_Admin');
    //Level 0 user types, git admin get all user types
    Route::get('getAllUserTypes', 'SetupController@getAllUserTypes')->name('getAllUserTypes')->middleware('scope:GIT_Admin');
    //Level 1 user types, git admin, super executive, company admin
    Route::get('Level1UserTypes', 'SetupController@getUserTypesLevel1')->name('Level1UserTypes')->middleware('scope:GIT_Admin,super_executive,company_admin');
    //Level 2 user types, git admin, super executive, company admin, branch_executive and branch_admin
    Route::get('Level2UserTypes', 'SetupController@getUserTypesLevel2')->name('Level2UserTypes')->middleware('scope:GIT_Admin,super_executive,company_admin,branch_executive,branch_admin');
    //In a company, an adminc an only create a front desk user. This api allow the admin user to see the frontdesk during create
    Route::get('Level3UserTypes', 'SetupController@getUserTypesLevel3')->name('Level3UserTypes')->middleware('scope:GIT_Admin,company_admin,branch_admin');
    
    //forms endpoints 
    Route::post('createForm', 'FormsController@storeForm')->name('createForm')->middleware('scope:GIT_Admin,company_admin');
    Route::get('getFormDetails/{id}', 'FormsController@getFormDetails')->name('getFormDetails')->middleware('scope:GIT_Admin,company_admin,branch_admin');
    Route::post('editForm/{code}', 'FormsController@editForm')->name('editForm')->middleware('scope:GIT_Admin,company_admin');
    Route::post('changeFormStatus/{code}/{status}', 'FormsController@changeFormStatus')->name('changeFormStatus')->middleware('scope:GIT_Admin,company_admin');
    Route::get('getAllForms', 'FormsController@getAllForms')->name('getAllForms')->middleware('scope:GIT_Admin');
    Route::get('getAllFormsByStatus/{status}', 'FormsController@getAllFormsByStatus')->name('getAllFormsByStatus');
    Route::get('getAllFormsByMerchant/{id}', 'FormsController@getAllFormsByMerchant')->name('getAllFormsByMerchant')->middleware('scope:GIT_Admin,company_admin,branch_admin');
    Route::get('getAllFormsByStatusAndMerchant/{status}/{id}', 'FormsController@getAllFormsByStatusAndMerchant')->name('getAllFormsByStatusAndMerchant');
    Route::post('deleteForm/{id}', 'FormsController@deleteForm')->name('deleteForm')->middleware('scope:GIT_Admin,company_admin,branch_admin');
    Route::post('recoverForm/{id}', 'FormsController@recoverForm')->name('recoverForm')->middleware('scope:GIT_Admin,company_admin,branch_admin');
    
  //client, get and edit endpoints
  Route::get('getAllClients', 'ClientController@getAllClients')->name('getAllClients')->middleware('scope:GIT_Admin');
  Route::get('getClientsDetails/{id}', 'ClientController@getClientsDetails')->name('getClientsDetails')->middleware('scope:GIT_Admin,client');
  Route::post('editClientProfile/{id}', 'ClientController@editClientProfile')->name('editClientProfile')->middleware('scope:client');
  Route::post('submitForm/{id}/{code}', 'ClientController@submitForm')->name('submitForm')->middleware('scope:GIT_Admin,client');
  
  //submitted forms endpoints 
  Route::get('getAllSubmittedForms', 'FrontDeskController@getAllSubmittedForms')->name('getAllSubmittedForms')->middleware('scope:GIT_Admin');
  Route::get('getAllSubmittedFormsByMerchant/{id}', 'FrontDeskController@getAllSubmittedFormsByMerchant')->name('getAllSubmittedFormsByMerchant')->middleware('scope:GIT_Admin,frontdesk');
  Route::get('getSubmittedFormByCode/{code}', 'FrontDeskController@getSubmittedFormByCode')->name('getSubmittedFormByCode')->middleware('scope:GIT_Admin,frontdesk');
  
  
  
});
 


