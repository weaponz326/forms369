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
Route::post('registerUser', 'HomeController@createNewUser')->name('registerUser');
Route::get('signup/activate/{token}', 'HomeController@signupActivate')->name('signup/activate');

//login user 
Route::post('login', 'HomeController@login')->name('login');

//protected routes 
Route::group(['middleware' => ['auth:api'], 'prefix' => 'v1'], function(){

    //use endpoints 
    Route::post('editUser/{id}', 'HomeController@editUser')->name('editUser');
    Route::get('getUser/{id}', 'HomeController@getUserDetails')->name('getUser');
    Route::post('diableUser/{id}', 'HomeController@diableUser')->name('diableUser')->middleware('scope:GIT_Admin,company_admin');
    Route::post('enableUser/{id}', 'HomeController@enableUser')->name('enableUser')->middleware('scope:GIT_Admin,company_admin');
    
    //get all users in a company, param:merchant_id
    Route::get('getAllUsersByMerchant/{id}', 'HomeController@getAllUsersByMerchant')->name('getAllUsersByMerchant')->middleware('scope:GIT_Admin,company_admin');
    //get number of all users in a company, param:merchant_id
    Route::get('getNumAllUsersByMerchant/{id}', 'HomeController@getNumAllUsersByMerchant')->name('getNumAllUsersByMerchant')->middleware('scope:GIT_Admin,company_admin,super_executive');
    
    //get all users in a branch, param:branch_id
    Route::get('getAllUsersByBranch/{id}', 'HomeController@getAllUsersByBranch')->name('getAllUsersByBranch')->middleware('scope:GIT_Admin,company_admin,branch_admin');
    //get number of all users in a branch, param:branch_id
    Route::get('getNumAllUsersByBranch/{id}', 'HomeController@getNumAllUsersByBranch')->name('getNumAllUsersByBranch')->middleware('scope:GIT_Admin,company_admin,branch_admin,branch_executive');
    
    //get all users under a user type for a merchant, param:merchant_id
    Route::get('getMerchantUsersByType/{id}/{type}', 'HomeController@getMerchantUsersByType')->name('getMerchantUsersByType')->middleware('scope:GIT_Admin,company_admin');
    
    //get number of all users under a user type for a merchant, param:merchant_id
    Route::get('getNumMerchantUsersByType/{id}/{type}', 'HomeController@getNumMerchantUsersByType')->name('getNumMerchantUsersByType')->middleware('scope:GIT_Admin,company_admin,super_executive');
    
    //get all users under a user type for a branch, param:branch_id
    Route::get('getBranchUsersByType/{id}/{type}', 'HomeController@getBranchUsersByType')->name('getBranchUsersByType')->middleware('scope:GIT_Admin,company_admin,branch_admin');
    
    //get all users under a user type for a branch, param:branch_id
    Route::get('getNumBranchUsersByType/{id}/{type}', 'HomeController@getNumBranchUsersByType')->name('getNumBranchUsersByType')->middleware('scope:GIT_Admin,company_admin,branch_admin,super_executive,branch_executive');
    

    //get all users by type, this can be used when creating a mercahnt and a superadmin is required
    Route::get('getAllUsersByType/{type}', 'HomeController@getAllUsersByType')->name('getAllUsersByType')->middleware('scope:GIT_Admin');
    
    //get logged in user
    Route::get('getLoggedinUser', 'HomeController@user')->name('getLoggedinUser');
    
    //logout user
    Route::get('logoutUser', 'HomeController@logout')->name('logoutUser');
    
    

    //merchant setup, view and update apis
    Route::post('uploadImage', 'HomeController@imageUpload')->name('uploadImage')->middleware('scope:GIT_Admin,company_admin');
    Route::post('createMerchant', 'SetupController@createMerchant')->name('createMerchant')->middleware('scope:GIT_Admin');
    Route::post('editMerchant/{id}', 'SetupController@editMerchant')->name('editMerchant')->middleware('scope:GIT_Admin,company_admin');
    Route::get('getAllMerchants', 'SetupController@getMerchants')->name('getAllMerchants')->middleware('scope:GIT_Admin');
    Route::get('getMerchantDetails/{id}', 'SetupController@getMerchantDetails')->name('getMerchantDetails')->middleware('scope:GIT_Admin,super_executive,company_admin,branch_executive,branch_admin');
    Route::get('getAllMerchantsByCountry/{country}', 'SetupController@getAllMerchantsByCountry')->name('getAllMerchantsByCountry');
    Route::get('getNumMerchants', 'SetupController@getNumMerchants')->name('getNumMerchants')->middleware('scope:GIT_Admin');
    Route::get('getNumActiveMerchants', 'SetupController@getNumActiveMerchants')->name('getNumActiveMerchants')->middleware('scope:GIT_Admin');
    Route::get('getNumInactiveMerchants', 'SetupController@getNumInactiveMerchants')->name('getNumInactiveMerchants')->middleware('scope:GIT_Admin');
   
    
    //company branch setup and update apis
    Route::post('createCompanyBranch', 'SetupController@createCompanyBranches')->name('createCompanyBranch')->middleware('scope:GIT_Admin');
    Route::post('editCompanyBranch/{id}', 'SetupController@editCompanyBranches')->name('editCompanyBranch')->middleware('scope:GIT_Admin');
    Route::get('getAllBranches', 'SetupController@getAllBranches')->name('getAllBranches')->middleware('scope:GIT_Admin');
    Route::get('getNumActiveBranches', 'SetupController@getNumActiveBranches')->name('getNumActiveBranches')->middleware('scope:GIT_Admin');
    Route::get('getNumInactiveBranches', 'SetupController@getNumInactiveBranches')->name('getNumInactiveBranches')->middleware('scope:GIT_Admin');
    Route::get('getNumBranches', 'SetupController@getNumBranches')->name('getNumBranches')->middleware('scope:GIT_Admin');

    Route::get('getCompanyBranches/{id}', 'SetupController@getCompanyBranches')->name('getCompanyBranches')->middleware('scope:GIT_Admin,company_admin');
    Route::get('getNumCompanyBranches/{id}', 'SetupController@getNumCompanyBranches')->name('getNumCompanyBranches')->middleware('scope:GIT_Admin,company_admin');
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
    Route::get('getNumAllForms', 'FormsController@getNumAllForms')->name('getNumAllForms')->middleware('scope:GIT_Admin');
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
  Route::get('getSubmittedFormByCode/{code}', 'FrontDeskController@getSubmittedFormByCode')->name('getSubmittedFormByCode')->middleware('scope:GIT_Admin');
  Route::get('FrontDeskGetSubmittedFormByCode/{code}/{id}', 'FrontDeskController@FrontDeskGetSubmittedFormByCode')->name('FrontDeskGetSubmittedFormByCode')->middleware('scope:GIT_Admin,frontdesk');
  Route::get('getSubmittedFormByStatusAndMerchant/{status}/{id}', 'FrontDeskController@getSubmittedFormByStatusAndMerchant')->name('getSubmittedFormByStatusAndMerchant')->middleware('scope:GIT_Admin,frontdesk');
  Route::post('processSubmitForm/{code}/{status}', 'FrontDeskController@processSubmitForm')->name('processSubmitForm')->middleware('scope:frontdesk');

  //get forms processed by a front desk person within a particular datetime range. NB: end date exclusive
  Route::get('FormsProcessedByFrontDeskPerson/{id}/{startdate}/{enddate}', 'FrontDeskController@FormsProcessedByFrontDeskPerson')->name('FormsProcessedByFrontDeskPerson')->middleware('scope:GIT_Admin,company_admin,branch_admin,frontdesk');
  Route::get('numFormsProcessedByFrontDeskPerson/{id}/{startdate}/{enddate}', 'FrontDeskController@numFormsProcessedByFrontDeskPerson')->name('numFormsProcessedByFrontDeskPerson')->middleware('scope:GIT_Admin,company_admin,branch_admin,frontdesk,branch_executive,super_executive');

  //get forms processed by a front desk person of all time. NB: end date exclusive
  Route::get('getAllFormsProcessedByFrontDeskPerson/{id}', 'FrontDeskController@getAllFormsProcessedByFrontDeskPerson')->name('getAllFormsProcessedByFrontDeskPerson')->middleware('scope:GIT_Admin,company_admin,branch_admin,frontdesk');
  Route::get('getNumAllFormsProcessedByFrontDeskPerson/{id}', 'FrontDeskController@getNumAllFormsProcessedByFrontDeskPerson')->name('getNumAllFormsProcessedByFrontDeskPerson')->middleware('scope:GIT_Admin,company_admin,branch_admin,frontdesk,branch_executive,super_executive');


//client summaries and submitted forms
Route::get('getAllsubmittedForms/{id}', 'ClientController@getAllsubmittedForms')->name('getAllsubmittedForms')->middleware('scope:GIT_Admin,client');
Route::get('getNumAllsubmittedForms/{id}', 'ClientController@getNumAllsubmittedForms')->name('getNumAllsubmittedForms')->middleware('scope:GIT_Admin,client');
Route::get('getClientFormsByStatus/{id}/{status}', 'ClientController@getClientFormsByStatus')->name('getClientFormsByStatus')->middleware('scope:GIT_Admin,client');
Route::get('getNumClientFormsByStatus/{id}/{status}', 'ClientController@getNumClientFormsByStatus')->name('getNumClientFormsByStatus')->middleware('scope:GIT_Admin,client');                                     
 

//executives endpoints 
Route::get('getNumAllFormsByMerchant/{id}', 'ExecutiveController@getNumAllFormsByMerchant')->name('getNumAllFormsByMerchant')->middleware('scope:GIT_Admin,branch_executive,super_executive');                                     
Route::get('getNumAllFormsByStatusAndMerchant/{status}/{id}', 'ExecutiveController@getNumAllFormsByStatusAndMerchant')->name('getNumAllFormsByStatusAndMerchant')->middleware('scope:GIT_Admin,branch_executive,super_executive');                                     

//get merchant submitted forms by status: proccess, submitted, in_process
//@param status and merchant_id
Route::get('getNumSubmittedFormsByStatus/{status}/{id}', 'ExecutiveController@getNumSubmittedFormsByStatus')->name('getNumSubmittedFormsByStatus')->middleware('scope:GIT_Admin,super_executive');   
//@param status and branch_id                                  
Route::get('getNumBranchProcessedFormsByStatus/{status}/{id}', 'ExecutiveController@getNumBranchProcessedFormsByStatus')->name('getNumBranchProcessedFormsByStatus')->middleware('scope:GIT_Admin,super_executive,branch_executive');                                     


//templates endpoints 
Route::post('createTemplate', 'TemplatesController@createTemplate')->name('createTemplate')->middleware('scope:GIT_Admin');                                     
Route::post('editTemplate/{id}', 'TemplatesController@editTemplate')->name('editTemplate')->middleware('scope:GIT_Admin');                                     
Route::get('getAllTemplates', 'TemplatesController@getAllTemplates')->name('getAllTemplates')->middleware('scope:GIT_Admin,company_admin');                                     
Route::post('deleteTemplate/{id}', 'TemplatesController@deleteTemplate')->name('deleteTemplate')->middleware('scope:GIT_Admin');                                     




});
 


