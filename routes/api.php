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
Route::post('login', 'HomeController@login')->name('login')->middleware('checkAccess');

//protected routes 
Route::group(['middleware' => ['auth:api'], 'prefix' => 'v1'], function(){

    //use endpoints 
    Route::post('editUser/{id}', 'HomeController@editUser')->name('editUser');
    Route::get('getUser/{id}', 'HomeController@getUserDetails')->name('getUser');
    Route::post('disableUser/{id}', 'HomeController@diableUser')->name('diableUser')->middleware('scope:GIT_Admin,company_admin');
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
    Route::get('getAllUsersByType/{type}', 'HomeController@getAllUsersByType')->name('getAllUsersByType')->middleware('scope:GIT_Admin,company_admin');
    
    //get logged in user
    Route::get('getLoggedinUser', 'HomeController@user')->name('getLoggedinUser');
    
    //logout user
    Route::get('logoutUser', 'HomeController@logout')->name('logoutUser');
    
    

    //merchant setup, view and update apis
    Route::post('uploadImage', 'HomeController@imageUpload')->name('uploadImage')->middleware('scope:GIT_Admin,company_admin');
    Route::post('createMerchant', 'HomeController@createMerchant')->name('createMerchant')->middleware('scope:GIT_Admin');
    Route::post('editMerchant/{id}', 'HomeController@editMerchant')->name('editMerchant')->middleware('scope:GIT_Admin,company_admin');
    Route::get('getAllMerchants', 'HomeController@getMerchants')->name('getAllMerchants')->middleware('scope:GIT_Admin,client');
    Route::get('getMerchantDetails/{id}', 'HomeController@getMerchantDetails')->name('getMerchantDetails')->middleware('scope:GIT_Admin,super_executive,company_admin,branch_executive,branch_admin');
    Route::get('getAllMerchantsByCountry/{country}', 'HomeController@getAllMerchantsByCountry')->name('getAllMerchantsByCountry');
    Route::get('getNumMerchants', 'HomeController@getNumMerchants')->name('getNumMerchants')->middleware('scope:GIT_Admin');
    Route::get('getNumActiveMerchants', 'HomeController@getNumActiveMerchants')->name('getNumActiveMerchants')->middleware('scope:GIT_Admin');
    Route::get('getNumInactiveMerchants', 'HomeController@getNumInactiveMerchants')->name('getNumInactiveMerchants')->middleware('scope:GIT_Admin');
   
    //enabling and disabling merchants and branches apis
    Route::post('disableMerchant/{id}', 'HomeController@disableMerchant')->name('disableMerchant')->middleware('scope:GIT_Admin');
    Route::post('enableMerchant/{id}', 'HomeController@enableMerchant')->name('enableMerchant')->middleware('scope:GIT_Admin');
    Route::post('disableBranch/{id}', 'HomeController@disableBranch')->name('disableBranch')->middleware('scope:GIT_Admin');
    Route::post('enableBranch/{id}', 'HomeController@enableBranch')->name('enableBranch')->middleware('scope:GIT_Admin');
   
    
    //company branch setup and update apis
    Route::post('createCompanyBranch', 'HomeController@createCompanyBranches')->name('createCompanyBranch')->middleware('scope:GIT_Admin');
    Route::post('editCompanyBranch/{id}', 'HomeController@editCompanyBranches')->name('editCompanyBranch')->middleware('scope:GIT_Admin');
    Route::get('getAllBranches', 'HomeController@getAllBranches')->name('getAllBranches')->middleware('scope:GIT_Admin');
    Route::get('getNumActiveBranches', 'HomeController@getNumActiveBranches')->name('getNumActiveBranches')->middleware('scope:GIT_Admin');
    Route::get('getNumInactiveBranches', 'HomeController@getNumInactiveBranches')->name('getNumInactiveBranches')->middleware('scope:GIT_Admin');
    Route::get('getNumBranches', 'HomeController@getNumBranches')->name('getNumBranches')->middleware('scope:GIT_Admin');

    Route::get('getCompanyBranches/{id}', 'HomeController@getCompanyBranches')->name('getCompanyBranches')->middleware('scope:GIT_Admin,company_admin');
    Route::get('getNumCompanyBranches/{id}', 'HomeController@getNumCompanyBranches')->name('getNumCompanyBranches')->middleware('scope:GIT_Admin,company_admin');
    Route::get('getCompanyBranchDetails/{id}', 'HomeController@getCompanyBranchDetails')->name('getCompanyBranchDetails')->middleware('scope:GIT_Admin,super_executive,company_admin,branch_executive,branch_admin');
    
    

    //user types setup, view and update apis
    Route::post('createUserType', 'HomeController@createUserType')->name('createUserType')->middleware('scope:GIT_Admin');
    Route::post('editUserType', 'HomeController@editUserType')->name('editUserType')->middleware('scope:GIT_Admin');
    Route::post('deleteUserType/{id}', 'HomeController@deleteUserType')->name('deleteUserType')->middleware('scope:GIT_Admin');
    //Level 0 user types, git admin get all user types
    Route::get('getAllUserTypes', 'HomeController@getAllUserTypes')->name('getAllUserTypes')->middleware('scope:GIT_Admin');
    //Level 1 user types, git admin, super executive, company admin
    Route::get('Level1UserTypes', 'HomeController@getUserTypesLevel1')->name('Level1UserTypes')->middleware('scope:GIT_Admin,super_executive,company_admin');
    //Level 2 user types, git admin, super executive, company admin, branch_executive and branch_admin
    Route::get('Level2UserTypes', 'HomeController@getUserTypesLevel2')->name('Level2UserTypes')->middleware('scope:GIT_Admin,super_executive,company_admin,branch_executive,branch_admin');
    //In a company, an admin an only create a front desk user. This api allow the admin user to see the frontdesk during create
    Route::get('Level3UserTypes', 'HomeController@getUserTypesLevel3')->name('Level3UserTypes')->middleware('scope:GIT_Admin,company_admin,branch_admin');
    
    //forms endpoints 
    Route::post('createForm', 'HomeController@storeForm')->name('createForm')->middleware('scope:GIT_Admin,company_admin');
    Route::get('getFormDetails/{id}', 'HomeController@getFormDetails')->name('getFormDetails')->middleware('scope:GIT_Admin,company_admin,branch_admin,branch_executive,super_executive,client');
    Route::get('getFormbyName/{term}', 'HomeController@getFormbyName')->name('getFormbyName')->middleware('scope:GIT_Admin,company_admin,branch_admin,branch_executive,super_executive,client');
    Route::post('editForm/{code}', 'HomeController@editForm')->name('editForm')->middleware('scope:GIT_Admin,company_admin');
    Route::post('changeFormStatus/{code}/{status}', 'HomeController@changeFormStatus')->name('changeFormStatus')->middleware('scope:GIT_Admin,company_admin');
    Route::get('getAllForms', 'HomeController@getAllForms')->name('getAllForms')->middleware('scope:GIT_Admin,client');
    Route::get('getNumAllForms', 'HomeController@getNumAllForms')->name('getNumAllForms')->middleware('scope:GIT_Admin');
    Route::get('getAllFormsByStatus/{status}', 'HomeController@getAllFormsByStatus')->name('getAllFormsByStatus');
    Route::get('getAllFormsByMerchant/{id}', 'HomeController@getAllFormsByMerchant')->name('getAllFormsByMerchant')->middleware('scope:GIT_Admin,company_admin,branch_admin,client');
    Route::get('getAllFormsByStatusAndMerchant/{status}/{id}', 'HomeController@getAllFormsByStatusAndMerchant')->name('getAllFormsByStatusAndMerchant');
    Route::post('deleteForm/{id}', 'HomeController@deleteForm')->name('deleteForm')->middleware('scope:GIT_Admin,company_admin,branch_admin');
    Route::post('recoverForm/{id}', 'HomeController@recoverForm')->name('recoverForm')->middleware('scope:GIT_Admin,company_admin,branch_admin');
    
  //client, get and edit endpoints
  Route::get('getAllClients', 'HomeController@getAllClients')->name('getAllClients')->middleware('scope:GIT_Admin');
  Route::get('getClientsDetails/{id}', 'HomeController@getClientsDetails')->name('getClientsDetails')->middleware('scope:GIT_Admin,client');
  Route::post('editClientProfile/{id}', 'HomeController@editClientProfile')->name('editClientProfile')->middleware('scope:client');
  Route::post('submitForm/{id}/{code}', 'HomeController@submitForm')->name('submitForm')->middleware('scope:GIT_Admin,client');
  
  //submitted forms endpoints 
  Route::get('getAllSubmittedForms', 'HomeController@getAllSubmittedForms')->name('getAllSubmittedForms')->middleware('scope:GIT_Admin');
  Route::get('getAllSubmittedFormsByMerchant/{id}', 'HomeController@getAllSubmittedFormsByMerchant')->name('getAllSubmittedFormsByMerchant')->middleware('scope:GIT_Admin,frontdesk');
  Route::get('getSubmittedFormByCode/{code}', 'HomeController@getSubmittedFormByCode')->name('getSubmittedFormByCode')->middleware('scope:GIT_Admin,frontdesk');
  Route::get('FrontDeskGetSubmittedFormByCode/{code}/{id}', 'HomeController@FrontDeskGetSubmittedFormByCode')->name('FrontDeskGetSubmittedFormByCode')->middleware('scope:GIT_Admin,frontdesk');
  Route::get('getSubmittedFormByStatusAndMerchant/{status}/{id}', 'HomeController@getSubmittedFormByStatusAndMerchant')->name('getSubmittedFormByStatusAndMerchant')->middleware('scope:GIT_Admin,frontdesk');
  Route::post('processSubmitForm/{code}/{status}', 'HomeController@processSubmitForm')->name('processSubmitForm')->middleware('scope:GIT_Admin,frontdesk');

  //get forms processed by a front desk person within a particular datetime range. NB: end date exclusive
  Route::get('FormsProcessedByFrontDeskPerson/{id}/{startdate}/{enddate}', 'HomeController@FormsProcessedByFrontDeskPerson')->name('FormsProcessedByFrontDeskPerson')->middleware('scope:GIT_Admin,company_admin,branch_admin,frontdesk');
  Route::get('numFormsProcessedByFrontDeskPerson/{id}/{startdate}/{enddate}', 'HomeController@numFormsProcessedByFrontDeskPerson')->name('numFormsProcessedByFrontDeskPerson')->middleware('scope:GIT_Admin,company_admin,branch_admin,frontdesk,branch_executive,super_executive');

  //get forms processed by a front desk person of all time. NB: end date exclusive
  Route::get('getAllFormsProcessedByFrontDeskPerson/{id}', 'HomeController@getAllFormsProcessedByFrontDeskPerson')->name('getAllFormsProcessedByFrontDeskPerson')->middleware('scope:GIT_Admin,company_admin,branch_admin,frontdesk');
  Route::get('getNumAllFormsProcessedByFrontDeskPerson/{id}', 'HomeController@getNumAllFormsProcessedByFrontDeskPerson')->name('getNumAllFormsProcessedByFrontDeskPerson')->middleware('scope:GIT_Admin,company_admin,branch_admin,frontdesk,branch_executive,super_executive');


  //client summaries and submitted forms
  Route::get('getAllsubmittedForms/{id}', 'HomeController@getAllsubmittedForms')->name('getAllsubmittedForms')->middleware('scope:GIT_Admin,client');
  Route::get('getNumAllsubmittedForms/{id}', 'HomeController@getNumAllsubmittedForms')->name('getNumAllsubmittedForms')->middleware('scope:GIT_Admin,client');
  Route::get('getClientFormsByStatus/{id}/{status}', 'HomeController@getClientFormsByStatus')->name('getClientFormsByStatus')->middleware('scope:GIT_Admin,client');
  Route::get('getNumClientFormsByStatus/{id}/{status}', 'HomeController@getNumClientFormsByStatus')->name('getNumClientFormsByStatus')->middleware('scope:GIT_Admin,client');                                     
  

  //executives endpoints 
  Route::get('getNumAllFormsByMerchant/{id}', 'HomeController@getNumAllFormsByMerchant')->name('getNumAllFormsByMerchant')->middleware('scope:GIT_Admin,branch_executive,super_executive');                                     
  Route::get('getNumAllFormsByStatusAndMerchant/{status}/{id}', 'HomeController@getNumAllFormsByStatusAndMerchant')->name('getNumAllFormsByStatusAndMerchant')->middleware('scope:GIT_Admin,branch_executive,super_executive');                                     

  //get merchant submitted forms by status: proccess, submitted, in_process
  //@param status and merchant_id
  Route::get('getNumSubmittedFormsByStatus/{status}/{id}', 'HomeController@getNumSubmittedFormsByStatus')->name('getNumSubmittedFormsByStatus')->middleware('scope:GIT_Admin,super_executive');   
  //@param status and branch_id                                  
  Route::get('getNumBranchProcessedFormsByStatus/{status}/{id}', 'HomeController@getNumBranchProcessedFormsByStatus')->name('getNumBranchProcessedFormsByStatus')->middleware('scope:GIT_Admin,super_executive,branch_executive');                                     


  //templates endpoints 
  Route::post('createTemplate', 'HomeController@createTemplate')->name('createTemplate')->middleware('scope:GIT_Admin');                                     
  Route::post('editTemplate/{id}', 'HomeController@editTemplate')->name('editTemplate')->middleware('scope:GIT_Admin');                                     
  Route::get('getAllTemplates', 'HomeController@getAllTemplates')->name('getAllTemplates')->middleware('scope:GIT_Admin,company_admin');                                     
  Route::post('deleteTemplate/{id}', 'HomeController@deleteTemplate')->name('deleteTemplate')->middleware('scope:GIT_Admin');                                     
  //search template by name api
  Route::get('searchTemplateByName/{term}', 'HomeController@searchTemplateByName')->name('searchTemplateByName')->middleware('scope:GIT_Admin,company_admin');                                     


  //access code creation and checks apis 
  Route::post('createAccessCode', 'HomeController@createAccessCode')->name('createAccessCode')->middleware('scope:GIT_Admin');                                     
  Route::post('activateAccessCode/{code}', 'HomeController@activateAccessCode')->name('activateAccessCode')->middleware('scope:GIT_Admin');                                     
  Route::post('deactivateAccessCode/{code}', 'HomeController@deactivateAccessCode')->name('deactivateAccessCode')->middleware('scope:GIT_Admin');                                     
  Route::post('ValidateAccessCode/{code}', 'HomeController@ValidateAccessCode')->name('ValidateAccessCode')->middleware('scope:GIT_Admin,company_admin,branch_admin,frontdesk,branch_executive,super_executive');                                     

  
  //form sectiosn apis
  Route::post('createSection', 'HomeController@createSection')->name('createSection')->middleware('scope:GIT_Admin'); 
  Route::post('editSection/{id}', 'HomeController@editSection')->name('editSection')->middleware('scope:GIT_Admin'); 
  Route::get('getAllSections', 'HomeController@getAllSections')->name('getAllSections')->middleware('scope:GIT_Admin,company_admin,branch_admin');
  Route::post('deleteSection/{id}', 'HomeController@deleteSection')->name('deleteSection')->middleware('scope:GIT_Admin');  
  Route::get('searchSectionByHeading/{term}', 'HomeController@searchSectionByHeading')->name('searchSectionByHeading')->middleware('scope:GIT_Admin,company_admin,branch_admin');
  
  
});
 


