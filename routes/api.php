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

//reset user password routes
Route::post('forgotPassword', 'HomeController@forgotPassword')->name('forgotPassword');
Route::get('forgotpasswordlink/{token}', 'HomeController@confirmForgottenPassword')->name('forgotpasswordlink');

//login user 
Route::post('login', 'HomeController@login')->name('login');

Route::post('checkAccess', 'HomeController@checkAccess')->name('checkAccess');

Route::post('login', 'HomeController@login')->name('login');
Route::post('resetPassword/{id}', 'HomeController@resetPassword')->name('resetPassword');

//check access code
Route::post('ValidateAccessCode/{code}', 'HomeController@ValidateAccessCode')->name('ValidateAccessCode');  

//two way authentication apis
Route::post('sendTwoWayAuthenticationCode/{id}/{phone}', 'HomeController@sendTwoWayAuthenticationCode')->name('sendTwoWayAuthenticationCode'); 
Route::post('twoWayAuthenticationVerification/{id}/{code}/{phone}', 'HomeController@twoWayAuthenticationVerification')->name('twoWayAuthenticationVerification');  

Route::get('getFormViaLink/{id}', 'HomeController@getFormViaLink')->name('getFormViaLink')->middleware('signed');

Route::get('login/google', 'HomeController@redirectToGoogleProvider')->name('login/google')->middleware('web');
Route::get('login/google/callback', 'HomeController@handleProviderGoogleCallback')->name('login/google/callback')->middleware('web');

//reset pin
Route::get('forgotpinlink/{token}', 'HomeController@confirmForgottenPin')->name('forgotpinlink');
Route::post('resetPin/{id}', 'HomeController@resetPin')->name('resetPin');

Route::post('hasPin/{id}', 'HomeController@hasPin')->name('hasPin');
Route::post('setPin/{id}/{pin}', 'HomeController@setPin')->name('setPin');

//protected routes 
Route::group(['middleware' => ['auth:api'], 'prefix' => 'v1'], function(){

    //generate unique code for user submitted form
    Route::get('generateSubCode', 'HomeController@generateSubCode')->name('generateSubCode')->middleware('scope:GIT_Admin,forms_client');
    Route::post('reverseSubmittedForm', 'HomeController@reverseSubmittedForm')->name('reverseSubmittedForm')->middleware('scope:GIT_Admin,forms_client');

    //form submission pin apis 
    Route::post('hasPin/{id}', 'HomeController@hasPin')->name('hasPin')->middleware('scope:GIT_Admin,forms_client');
    Route::post('changePin/{id}', 'HomeController@changePin')->name('changePin')->middleware('scope:GIT_Admin,forms_client');
    Route::post('checkPin/{id}/{pin}', 'HomeController@checkPin')->name('checkPin')->middleware('scope:GIT_Admin,forms_client');

    //reset user pin routes
    Route::post('forgotPin', 'HomeController@forgotPin')->name('forgotPin')->middleware('scope:GIT_Admin,forms_client');
    
    //change user password
    Route::post('changePassword/{id}', 'HomeController@changePassword')->name('changePassword')->middleware('scope:GIT_Admin,forms_client');

    Route::get('getNumAllUsers', 'HomeController@getNumAllUsers')->name('getNumAllUsers')->middleware('scope:GIT_Admin');
  
    // Route::get('getFormViaLink/{id}', 'HomeController@getFormViaLink')->name('getFormViaLink')->middleware('signed');

    //use endpoints 
    Route::post('editUser/{id}', 'HomeController@editUser')->name('editUser');
    Route::get('getUser/{id}', 'HomeController@getUserDetails')->name('getUser');
    Route::post('disableUser/{id}', 'HomeController@diableUser')->name('diableUser')->middleware('scope:GIT_Admin,company_admin,branch_admin');
    Route::post('enableUser/{id}', 'HomeController@enableUser')->name('enableUser')->middleware('scope:GIT_Admin,company_admin,branch_admin');
    
    //get all users in a company, param:merchant_id
    Route::get('getAllUsersByMerchant/{id}', 'HomeController@getAllUsersByMerchant')->name('getAllUsersByMerchant')->middleware('scope:GIT_Admin,company_admin,branch_admin,branch_executive,super_executive');
    //get number of all users in a company, param:merchant_id
    Route::get('getNumAllUsersByMerchant/{id}', 'HomeController@getNumAllUsersByMerchant')->name('getNumAllUsersByMerchant')->middleware('scope:GIT_Admin,company_admin,branch_admin,super_executive,branch_executive');
    
    //get all users in a branch, param:branch_id
    Route::get('getAllUsersByBranch/{id}', 'HomeController@getAllUsersByBranch')->name('getAllUsersByBranch')->middleware('scope:GIT_Admin,company_admin,branch_admin');
    //get number of all users in a branch, param:branch_id
    Route::get('getNumAllUsersByBranch/{id}', 'HomeController@getNumAllUsersByBranch')->name('getNumAllUsersByBranch')->middleware('scope:GIT_Admin,company_admin,branch_admin,branch_executive');
    
    //get all users under a user type for a merchant, param:merchant_id
    Route::get('getMerchantUsersByType/{id}/{type}', 'HomeController@getMerchantUsersByType')->name('getMerchantUsersByType')->middleware('scope:GIT_Admin,company_admin,branch_admin,super_executive,branch_executive');
    
    //get number of all users under a user type for a merchant, param:merchant_id
    Route::get('getNumMerchantUsersByType/{id}/{type}', 'HomeController@getNumMerchantUsersByType')->name('getNumMerchantUsersByType')->middleware('scope:GIT_Admin,company_admin,branch_admin,super_executive');
    
    //get all users under a user type for a branch, param:branch_id
    Route::get('getBranchUsersByType/{id}/{type}', 'HomeController@getBranchUsersByType')->name('getBranchUsersByType')->middleware('scope:GIT_Admin,company_admin,branch_admin');
    
    //get all users under a user type for a branch, param:branch_id
    Route::get('getNumBranchUsersByType/{id}/{type}', 'HomeController@getNumBranchUsersByType')->name('getNumBranchUsersByType')->middleware('scope:GIT_Admin,company_admin,branch_admin,super_executive,branch_executive');
    

    //get all users by type, this can be used when creating a mercahnt and a superadmin is required
    Route::get('getAllUsersByType/{type}', 'HomeController@getAllUsersByType')->name('getAllUsersByType')->middleware('scope:GIT_Admin,company_admin,branch_admin');
    
    //get logged in user
    Route::get('getLoggedinUser', 'HomeController@user')->name('getLoggedinUser');
    
    //logout user
    Route::get('logoutUser', 'HomeController@logout')->name('logoutUser');
    
    //delete and recover deletd user apis
    Route::post('deleteUser/{id}', 'HomeController@deleteUser')->name('deleteUser')->middleware('scope:GIT_Admin');
    Route::post('recoverDeletedUser/{id}', 'HomeController@recoverDeletedUser')->name('recoverDeletedUser')->middleware('scope:GIT_Admin,company_admin');
    Route::get('getAllDeletedUsers', 'HomeController@getAllDeletedUsers')->name('getAllDeletedUsers')->middleware('scope:GIT_Admin');
    
    //merchant setup, view and update apis
    Route::post('uploadImage', 'HomeController@imageUpload')->name('uploadImage')->middleware('scope:GIT_Admin,company_admin,branch_admin');
    Route::post('createMerchant', 'HomeController@createMerchant')->name('createMerchant')->middleware('scope:GIT_Admin');
    Route::post('suggestMerchant', 'HomeController@suggestMerchant')->name('suggestMerchant')->middleware('scope:GIT_Admin,super_executive,company_admin,branch_executive,branch_admin,frontdesk,forms_client');
    Route::post('editMerchant/{id}', 'HomeController@editMerchant')->name('editMerchant')->middleware('scope:GIT_Admin,company_admin');
    Route::get('getAllMerchants', 'HomeController@getMerchants')->name('getAllMerchants')->middleware('scope:GIT_Admin,forms_client');
    Route::get('getAllSuggestedMerchants', 'HomeController@getAllSuggestedMerchants')->name('getAllSuggestedMerchants')->middleware('scope:GIT_Admin,forms_client');
    Route::get('getMerchantDetails/{id}', 'HomeController@getMerchantDetails')->name('getMerchantDetails')->middleware('scope:GIT_Admin,super_executive,company_admin,branch_executive,branch_admin,frontdesk');
    Route::get('getCompanyColors/{id}', 'HomeController@getCompanyColors')->name('getCompanyColors')->middleware('scope:GIT_Admin,super_executive,company_admin,branch_executive,branch_admin,frontdesk,front_client');
    Route::get('getAllMerchantsByCountry/{country}/{sector}', 'HomeController@getAllMerchantsByCountry')->name('getAllMerchantsByCountry');
    Route::get('getAllMerchantsByCountryApp/{country}/{sector}', 'HomeController@getAllMerchantsByCountryApp')->name('getAllMerchantsByCountryApp');
    Route::get('getNumMerchants', 'HomeController@getNumMerchants')->name('getNumMerchants')->middleware('scope:GIT_Admin');
    Route::get('getNumActiveMerchants', 'HomeController@getNumActiveMerchants')->name('getNumActiveMerchants')->middleware('scope:GIT_Admin');
    Route::get('getNumInactiveMerchants', 'HomeController@getNumInactiveMerchants')->name('getNumInactiveMerchants')->middleware('scope:GIT_Admin');
    //get all merchants matching a search term
    Route::get('getMerchantbyName/{term}/{country}/{sector}', 'HomeController@getMerchantbyName')->name('getMerchantbyName')->middleware('scope:GIT_Admin,forms_client');  
    
   //delete and recover forms apis 
   Route::post('deleteForm/{id}', 'HomeController@deleteForm')->name('deleteForm')->middleware('scope:GIT_Admin,company_admin,branch_admin');
   Route::post('recoverForm/{id}', 'HomeController@recoverForm')->name('recoverForm')->middleware('scope:GIT_Admin,company_admin,branch_admin');
   Route::get('getAllDeletedFormsByMerchant/{id}', 'HomeController@getAllDeletedFormsByMerchant')->name('getAllDeletedFormsByMerchant')->middleware('scope:GIT_Admin,company_admin,branch_admin');

   

    //enabling and disabling merchants and branches apis
    Route::post('disableMerchant/{id}', 'HomeController@disableMerchant')->name('disableMerchant')->middleware('scope:GIT_Admin');
    Route::post('enableMerchant/{id}', 'HomeController@enableMerchant')->name('enableMerchant')->middleware('scope:GIT_Admin');
    Route::post('disableBranch/{id}', 'HomeController@disableBranch')->name('disableBranch')->middleware('scope:GIT_Admin');
    Route::post('enableBranch/{id}', 'HomeController@enableBranch')->name('enableBranch')->middleware('scope:GIT_Admin');
   
    
    //company branch setup and update apis
    Route::post('createCompanyBranch', 'HomeController@createCompanyBranches')->name('createCompanyBranch')->middleware('scope:GIT_Admin');
    Route::post('editCompanyBranch/{id}', 'HomeController@editCompanyBranches')->name('editCompanyBranch')->middleware('scope:GIT_Admin');
    Route::get('getAllBranches', 'HomeController@getAllBranches')->name('getAllBranches')->middleware('scope:GIT_Admin,forms_client');
    Route::get('getNumActiveBranches', 'HomeController@getNumActiveBranches')->name('getNumActiveBranches')->middleware('scope:GIT_Admin');
    Route::get('getNumInactiveBranches', 'HomeController@getNumInactiveBranches')->name('getNumInactiveBranches')->middleware('scope:GIT_Admin');
    Route::get('getNumBranches', 'HomeController@getNumBranches')->name('getNumBranches')->middleware('scope:GIT_Admin');

    Route::get('getCompanyBranches/{id}', 'HomeController@getCompanyBranches')->name('getCompanyBranches')->middleware('scope:GIT_Admin,company_admin,branch_admin,super_executive,branch_executive,forms_client');
    //use this for branch dropdown selection during form submission
    Route::get('getActiveCompanyBranches/{id}', 'HomeController@getActiveCompanyBranches')->name('getActiveCompanyBranches')->middleware('scope:GIT_Admin,company_admin,branch_admin,super_executive,branch_executive,forms_client');
    Route::get('getNumCompanyBranches/{id}', 'HomeController@getNumCompanyBranches')->name('getNumCompanyBranches')->middleware('scope:GIT_Admin,company_admin,branch_admin,super_executive,branch_executive');
    Route::get('getCompanyBranchDetails/{id}', 'HomeController@getCompanyBranchDetails')->name('getCompanyBranchDetails')->middleware('scope:GIT_Admin,super_executive,company_admin,branch_executive,branch_admin');
    Route::get('QMSEnabled/{id}', 'HomeController@QMSEnabled')->name('QMSEnabled')->middleware('scope:GIT_Admin,super_executive,company_admin,branch_executive,branch_admin');
    

    //upload and edit form print document for a form apis
    Route::post('uploadPrintFile/{merchant_id}/{code}', 'HomeController@uploadPrintFile')->name('uploadPrintFile')->middleware('scope:GIT_Admin,company_admin');
    Route::post('editPrintFile/{merchant_id}/{code}', 'HomeController@editPrintFile')->name('editPrintFile')->middleware('scope:GIT_Admin,company_admin');
    Route::get('getPrintFile/{merchant_id}/{code}', 'HomeController@getPrintFile')->name('getPrintFile')->middleware('scope:GIT_Admin,company_admin,branch_admin,frontdesk,super_executive,branch_executive,forms_client');

    //form attachments 
    Route::post('uploadattachments/{client_id}/{form_code}/{sub_code}', 'HomeController@uploadattachments')->name('uploadattachments')->middleware('scope:GIT_Admin,forms_client');
    Route::get('getAttachments/{sub_code}', 'HomeController@getAttachments')->name('getAttachments')->middleware('scope:GIT_Admin,forms_client,company_admin,branch_admin,frontdesk,super_executive,branch_executive');
    Route::post('deleteAttachment/{client_id}/{key}/{name}/{sub_code}', 'HomeController@deleteAttachment')->name('deleteAttachment')->middleware('scope:GIT_Admin,forms_client,frontdesk');
    

    //profile attachments 
    Route::post('uploadProfileAttachments/{client_id}', 'HomeController@uploadProfileAttachments')->name('uploadProfileAttachments')->middleware('scope:GIT_Admin,forms_client');
    Route::get('getProfileAttachments/{client_id}', 'HomeController@getProfileAttachments')->name('getProfileAttachments')->middleware('scope:GIT_Admin,forms_client,company_admin,branch_admin,frontdesk');
    Route::post('deleteProfileAttachment/{client_id}/{key}/{name}', 'HomeController@deleteProfileAttachment')->name('deleteProfileAttachment')->middleware('scope:GIT_Admin,forms_client');
  
    
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
    Route::get('getFormDetails/{id}', 'HomeController@getFormDetails')->name('getFormDetails')->middleware('scope:GIT_Admin,company_admin,branch_admin,branch_executive,super_executive,forms_client,frontdesk');
    Route::get('getFormbyName/{term}/{country}/{sector}', 'HomeController@getFormbyName')->name('getFormbyName')->middleware('scope:GIT_Admin,company_admin,branch_admin,branch_executive,super_executive,forms_client,frontdesk');
    Route::post('editForm/{code}', 'HomeController@editForm')->name('editForm')->middleware('scope:GIT_Admin,company_admin,branch_admin');
    Route::post('changeFormStatus/{code}/{status}', 'HomeController@changeFormStatus')->name('changeFormStatus')->middleware('scope:GIT_Admin,company_admin,branch_admin');
    Route::get('getAllForms', 'HomeController@getAllForms')->name('getAllForms')->middleware('scope:GIT_Admin,forms_client');
    Route::get('getNumAllForms', 'HomeController@getNumAllForms')->name('getNumAllForms')->middleware('scope:GIT_Admin');
    Route::get('getAllFormsByStatus/{status}', 'HomeController@getAllFormsByStatus')->name('getAllFormsByStatus');
    Route::get('getAllFormsByMerchant/{id}', 'HomeController@getAllFormsByMerchant')->name('getAllFormsByMerchant')->middleware('scope:GIT_Admin,company_admin,branch_admin,forms_client,super_executive,branch_executive,frontdesk');
    Route::get('getAllFormsByMerchantApp/{id}', 'HomeController@getAllFormsByMerchantApp')->name('getAllFormsByMerchantApp')->middleware('scope:GIT_Admin,company_admin,branch_admin,forms_client,super_executive,branch_executive,frontdesk');
    Route::get('getAllFormsByStatusAndMerchant/{status}/{id}', 'HomeController@getAllFormsByStatusAndMerchant')->name('getAllFormsByStatusAndMerchant');
    
    
  //client, get and edit endpoints
  Route::get('getAllClients', 'HomeController@getAllClients')->name('getAllClients')->middleware('scope:GIT_Admin');
  Route::get('getClientsDetails/{id}', 'HomeController@getClientsDetails')->name('getClientsDetails')->middleware('scope:GIT_Admin,forms_client');
  Route::post('editClientProfile/{id}', 'HomeController@editClientProfile')->name('editClientProfile')->middleware('scope:forms_client,frontdesk');
  Route::post('submitForm/{id}/{code}/{edit}/{sub_code}/{status?}', 'HomeController@submitForm')->name('submitForm')->middleware('scope:GIT_Admin,forms_client');
  //check if form to be submitted has already been submitted and not processed or in process
  Route::get('checkFormSubmission/{id}/{code}', 'HomeController@checkFormSubmission')->name('checkFormSubmission')->middleware('scope:GIT_Admin,forms_client');
  Route::get('getClientSubmittedForms/{id}', 'HomeController@getClientSubmittedForms')->name('getClientSubmittedForms')->middleware('scope:GIT_Admin,forms_client');
  Route::get('getClientSubmittedFormsApp/{id}', 'HomeController@getClientSubmittedFormsApp')->name('getClientSubmittedFormsApp')->middleware('scope:GIT_Admin,forms_client');
  

  //submitted forms endpoints 
  Route::get('getAllSubmittedForms', 'HomeController@getAllSubmittedForms')->name('getAllSubmittedForms')->middleware('scope:GIT_Admin');
  Route::get('getAllSubmittedFormsByMerchant/{id}', 'HomeController@getAllSubmittedFormsByMerchant')->name('getAllSubmittedFormsByMerchant')->middleware('scope:GIT_Admin,frontdesk,super_executive,branch_executive');
  Route::get('getSubmittedFormByCode/{code}', 'HomeController@getSubmittedFormByCode')->name('getSubmittedFormByCode')->middleware('scope:GIT_Admin,frontdesk,super_executive,branch_executive');
  Route::get('FrontDeskGetSubmittedFormByCode/{code}/{id}', 'HomeController@FrontDeskGetSubmittedFormByCode')->name('FrontDeskGetSubmittedFormByCode')->middleware('scope:GIT_Admin,frontdesk,super_executive');
  Route::get('getSubmittedFormByStatusAndMerchant/{status}/{id}', 'HomeController@getSubmittedFormByStatusAndMerchant')->name('getSubmittedFormByStatusAndMerchant')->middleware('scope:GIT_Admin,frontdesk,super_executive,branch_executive');
  Route::get('searchSubmittedFormByCodeorName/{status}/{id}/{term}', 'HomeController@searchSubmittedFormByCodeorName')->name('searchSubmittedFormByCodeorName')->middleware('scope:GIT_Admin,frontdesk,super_executive,branch_executive');
  Route::get('getSubmittedFormByFormCode/{status}/{id}/{code}', 'HomeController@getSubmittedFormByFormCode')->name('getSubmittedFormByFormCode')->middleware('scope:GIT_Admin,frontdesk,super_executive,branch_executive,forms_client');
  Route::post('processSubmitForm/{code}/{status}', 'HomeController@processSubmitForm')->name('processSubmitForm')->middleware('scope:GIT_Admin,frontdesk');
  Route::get('FormsProcessedByFrontDeskPersonDaily/{id}/{status}', 'HomeController@FormsProcessedByFrontDeskPersonDaily')->name('FormsProcessedByFrontDeskPersonDaily')->middleware('scope:GIT_Admin,frontdesk,super_executive,branch_executive,company_admin,branch_admin');
  Route::get('numFormsProcessedByFrontDeskPersonDaily/{id}/{status}', 'HomeController@numFormsProcessedByFrontDeskPersonDaily')->name('numFormsProcessedByFrontDeskPersonDaily')->middleware('scope:GIT_Admin,frontdesk,super_executive,branch_executive,company_admin,branch_admin');

  //check if form was submitted to the logged in frontdesk user's branch
  Route::get('checkBranchSubmittedTo/{code}', 'HomeController@checkBranchSubmittedTo')->name('checkBranchSubmittedTo')->middleware('scope:GIT_Admin,frontdesk,super_executive,branch_executive,company_admin,branch_admin');
  
  // searching for client submitted forms
  Route::get('findSubmittedFormByName/{id}/{form_name}/{status}', 'HomeController@findSubmittedFormByName')->name('findSubmittedFormByName')->middleware('scope:forms_client,GIT_Admin');
  Route::get('findSubmittedFormByCode/{id}/{code}/{status}', 'HomeController@findSubmittedFormByCode')->name('findSubmittedFormByCode')->middleware('scope:forms_client,GIT_Admin');
  Route::get('findSubmittedFormByDate/{id}/{status}/{sdate}/{edate}', 'HomeController@findSubmittedFormByDate')->name('findSubmittedFormByDate')->middleware('scope:forms_client,GIT_Admin');

  // delete and recover submitted form
  Route::post('deleteSubmittedForm/{id}/{code}', 'HomeController@deleteSubmittedForm')->name('deleteSubmittedForm')->middleware('scope:GIT_Admin,forms_client');
  Route::post('recoverDeletedSubmittedForm/{id}/{code}', 'HomeController@recoverDeletedSubmittedForm')->name('recoverDeletedSubmittedForm')->middleware('scope:GIT_Admin,forms_client');
  Route::get('getAllDeletedSubmittedForms/{id}', 'HomeController@getAllDeletedSubmittedForms')->name('getAllDeletedSubmittedForms')->middleware('scope:GIT_Admin,forms_client');
  
  
  //get forms processed by a front desk person within a particular datetime range. NB: end date exclusive
  Route::get('FormsProcessedByFrontDeskPerson/{id}/{startdate}/{enddate}/{status}', 'HomeController@FormsProcessedByFrontDeskPerson')->name('FormsProcessedByFrontDeskPerson')->middleware('scope:GIT_Admin,company_admin,branch_admin,frontdesk');
  Route::get('numFormsProcessedByFrontDeskPerson/{id}/{startdate}/{enddate}/{status}', 'HomeController@numFormsProcessedByFrontDeskPerson')->name('numFormsProcessedByFrontDeskPerson')->middleware('scope:GIT_Admin,company_admin,branch_admin,frontdesk,branch_executive,super_executive');

  //get forms processed by a front desk person of all time. NB: end date exclusive
  Route::get('getAllFormsProcessedByFrontDeskPerson/{id}/{status}', 'HomeController@getAllFormsProcessedByFrontDeskPerson')->name('getAllFormsProcessedByFrontDeskPerson')->middleware('scope:GIT_Admin,company_admin,branch_admin,frontdesk');
  Route::get('getNumAllFormsProcessedByFrontDeskPerson/{id}/{status}', 'HomeController@getNumAllFormsProcessedByFrontDeskPerson')->name('getNumAllFormsProcessedByFrontDeskPerson')->middleware('scope:GIT_Admin,company_admin,branch_admin,frontdesk,branch_executive,super_executive');


  //client summaries and submitted forms
  Route::get('getAllsubmittedForms/{id}', 'HomeController@getAllsubmittedForms')->name('getAllsubmittedForms')->middleware('scope:GIT_Admin,forms_client');
  Route::get('getNumAllsubmittedForms/{id}', 'HomeController@getNumAllsubmittedForms')->name('getNumAllsubmittedForms')->middleware('scope:GIT_Admin,forms_client');
  Route::get('getClientFormsByStatus/{id}/{status}', 'HomeController@getClientFormsByStatus')->name('getClientFormsByStatus')->middleware('scope:GIT_Admin,forms_client');
  Route::get('getClientFormsByStatusApp/{id}/{status}', 'HomeController@getClientFormsByStatusApp')->name('getClientFormsByStatusApp')->middleware('scope:GIT_Admin,forms_client');
  Route::get('getNumClientFormsByStatus/{id}/{status}', 'HomeController@getNumClientFormsByStatus')->name('getNumClientFormsByStatus')->middleware('scope:GIT_Admin,forms_client');                                     
  

  //executives endpoints 
  Route::get('getNumAllFormsByMerchant/{id}', 'HomeController@getNumAllFormsByMerchant')->name('getNumAllFormsByMerchant')->middleware('scope:GIT_Admin,branch_executive,super_executive,branch_admin,company_admin');                                     
  Route::get('getNumAllFormsByStatusAndMerchant/{status}/{id}', 'HomeController@getNumAllFormsByStatusAndMerchant')->name('getNumAllFormsByStatusAndMerchant')->middleware('scope:GIT_Admin,branch_executive,super_executive');                                     

  //get merchant submitted forms by status: proccess, submitted, in_process
  //@param status and merchant_id
  Route::get('getNumSubmittedFormsByStatus/{status}/{id}', 'HomeController@getNumSubmittedFormsByStatus')->name('getNumSubmittedFormsByStatus')->middleware('scope:GIT_Admin,frontdesk,super_executive,branch_executive');   
  //@param status and branch_id                                  
  Route::get('getNumBranchProcessedFormsByStatus/{status}/{id}', 'HomeController@getNumBranchProcessedFormsByStatus')->name('getNumBranchProcessedFormsByStatus')->middleware('scope:GIT_Admin,super_executive,branch_executive');                                     
  Route::get('viewRespondentData/{code}', 'HomeController@viewRespondentData')->name('viewRespondentData')->middleware('scope:GIT_Admin,super_executive,branch_executive,company_admin,branch_admin,frontdesk');                                     

  
  //templates endpoints 
  Route::post('createTemplate', 'HomeController@createTemplate')->name('createTemplate')->middleware('scope:GIT_Admin');                                     
  Route::post('editTemplate/{id}', 'HomeController@editTemplate')->name('editTemplate')->middleware('scope:GIT_Admin');                                     
  Route::get('getAllTemplates', 'HomeController@getAllTemplates')->name('getAllTemplates')->middleware('scope:GIT_Admin,company_admin,branch_admin');                                     
  Route::post('deleteTemplate/{id}', 'HomeController@deleteTemplate')->name('deleteTemplate')->middleware('scope:GIT_Admin');                                     
  //search template by name api
  Route::get('searchTemplateByName/{term}', 'HomeController@searchTemplateByNameOrCategory')->name('searchTemplateByName')->middleware('scope:GIT_Admin,company_admin,branch_admin');
  Route::get('getAllTemplatesbyCategory/{id}', 'HomeController@getAllTemplatesbyCategory')->name('getAllTemplatesbyCategory')->middleware('scope:GIT_Admin,company_admin,branch_admin');                                     


  //access code creation and checks apis 
  Route::post('createAccessCode', 'HomeController@createAccessCode')->name('createAccessCode')->middleware('scope:GIT_Admin');                                     
  Route::post('activateAccessCode/{code}', 'HomeController@activateAccessCode')->name('activateAccessCode')->middleware('scope:GIT_Admin');                                     
  Route::post('deactivateAccessCode/{code}', 'HomeController@deactivateAccessCode')->name('deactivateAccessCode')->middleware('scope:GIT_Admin');
  Route::get('getAllCodes', 'HomeController@getAllCodes')->name('getAllCodes')->middleware('scope:GIT_Admin'); 
  Route::get('getAccessCodesByStatus/{active}', 'HomeController@getAccessCodesByStatus')->name('getAccessCodesByStatus')->middleware('scope:GIT_Admin'); 
  Route::get('getAccessCodesDetails/{code}', 'HomeController@getAccessCodesDetails')->name('getAccessCodesDetails')->middleware('scope:GIT_Admin');                                    
  
  //form sectiosn apis
  Route::post('createSection', 'HomeController@createSection')->name('createSection')->middleware('scope:GIT_Admin'); 
  Route::post('editSection/{id}', 'HomeController@editSection')->name('editSection')->middleware('scope:GIT_Admin'); 
  Route::get('getAllSections', 'HomeController@getAllSections')->name('getAllSections')->middleware('scope:GIT_Admin,company_admin,branch_admin,forms_client');
  Route::post('deleteSection/{id}', 'HomeController@deleteSection')->name('deleteSection')->middleware('scope:GIT_Admin');  
  Route::get('searchSectionByHeading/{term}', 'HomeController@searchSectionByHeading')->name('searchSectionByHeading')->middleware('scope:GIT_Admin,company_admin,branch_admin');
  
  
  //apis for drop down
  Route::get('getMerchantsForDropdown', 'HomeController@getMerchantsForDropdown')->name('getMerchantsForDropdown')->middleware('scope:GIT_Admin,company_admin');
  Route::get('getAllBranchesForDropdown', 'HomeController@getAllBranchesForDropdown')->name('getAllBranchesForDropdown')->middleware('scope:GIT_Admin,company_admin');
  Route::get('getAllUsersByTypeForDropdown/{type_id}', 'HomeController@getAllUsersByTypeForDropdown')->name('getAllUsersByTypeForDropdown')->middleware('scope:GIT_Admin,company_admin,branch_admin');

  //template category
  Route::post('createTemplateCategory', 'HomeController@createTemplateCategory')->name('createTemplateCategory')->middleware('scope:GIT_Admin');
  Route::get('getAllTemplateCategories', 'HomeController@getAllTemplateCategories')->name('getAllTemplateCategories')->middleware('scope:GIT_Admin,company_admin,branch_admin');

  //business/ merchant sector
  Route::post('createBusinessSector', 'HomeController@createBusinessSector')->name('createBusinessSector')->middleware('scope:GIT_Admin');
  Route::get('getAllBusinessSectors', 'HomeController@getAllBusinessSectors')->name('getAllBusinessSectors')->middleware('scope:GIT_Admin,company_admin,branch_admin,forms_client');
  Route::post('editBusinessSector/{id}', 'HomeController@editBusinessSector')->name('editBusinessSector')->middleware('scope:GIT_Admin');
  Route::post('deleteBusinessSector/{id}', 'HomeController@deleteBusinessSector')->name('deleteBusinessSector')->middleware('scope:GIT_Admin');

  
  //reject forms reviews apis 
  Route::post('addReview', 'HomeController@addReview')->name('addReview')->middleware('scope:GIT_Admin,super_executive,branch_executive,company_admin,branch_admin,frontdesk');
  Route::get('getFormReview/{code}', 'HomeController@getFormReview')->name('getFormReview')->middleware('scope:GIT_Admin,super_executive,branch_executive,company_admin,branch_admin,frontdesk,forms_client');
  Route::post('deleteFormReview/{code}', 'HomeController@deleteFormReview')->name('deleteFormReview')->middleware('scope:GIT_Admin,super_executive,branch_executive,company_admin,branch_admin,frontdesk');
 
  //can print
  Route::post('candownload/{id}/{status}', 'HomeController@candownload')->name('candownload')->middleware('scope:GIT_Admin,company_admin,branch_admin');

  //search for a form for a particular merchant and status based on a serach term
  Route::get('getFormbyNameStatusAndMerchant/{term}/{status}/{id}', 'HomeController@getFormbyNameStatusAndMerchant')->name('getFormbyNameStatusAndMerchant')->middleware('scope:GIT_Admin,company_admin,branch_admin,super_executive,branch_executive,forms_client,frontdesk');

  //search for a form for a particular merchant based on a search term
  Route::get('getFormbyNameAndMerchant/{term}/{id}', 'HomeController@getFormbyNameAndMerchant')->name('getFormbyNameAndMerchant')->middleware('scope:GIT_Admin,company_admin,branch_admin,super_executive,branch_executive');

  //search users under a user type and merchant matching a search term
  Route::get('getUserByTypeAndMerchant/{user_type}/{merchant_id}/{term}', 'HomeController@getUserByTypeAndMerchant')->name('getUserByTypeAndMerchant')->middleware('scope:GIT_Admin,company_admin,branch_admin,super_executive,branch_executive');

  //search users under a user type and merchant matching a search term
  Route::get('getUserByTypeStatusAndMerchant/{user_type}/{merchant_id}/{status}/{term}', 'HomeController@getUserByTypeStatusAndMerchant')->name('getUserByTypeStatusAndMerchant')->middleware('scope:GIT_Admin,company_admin,branch_admin,super_executive,branch_executive');

  //get submitted forms by status, name and merchant
  Route::get('getClientFormsByStatusAndMerchant/{term}/{status}/{id}', 'HomeController@getClientFormsByStatusAndMerchant')->name('getClientFormsByStatusAndMerchant')->middleware('scope:GIT_Admin,company_admin,branch_admin,super_executive,branch_executive,forms_client,frontdesk');

  //get submitted forms by merchant name
  Route::get('findClientFormsByMerchantName/{term}/{status}/{id}', 'HomeController@findClientFormsByMerchantName')->name('findClientFormsByMerchantName')->middleware('scope:GIT_Admin,company_admin,branch_admin,super_executive,branch_executive,forms_client,frontdesk');

  //recent and most submitted forms apis
  Route::get('getRecentForms', 'HomeController@getRecentForms')->name('getRecentForms')->middleware('scope:GIT_Admin,forms_client');

  //abuse report endpoints 
  Route::post('reportAbuse', 'HomeController@reportAbuse')->name('reportAbuse')->middleware('scope:GIT_Admin,company_admin,branch_admin,super_executive,branch_executive,frontdesk');
  Route::get('getAllAbuseReports', 'HomeController@getAllAbuseReports')->name('getAllAbuseReports')->middleware('scope:GIT_Admin');
  Route::get('getAbuseReportsByStatus/{status}', 'HomeController@getAbuseReportsByStatus')->name('getAbuseReportsByStatus')->middleware('scope:GIT_Admin');
  Route::post('addressAbuseReport/{id}', 'HomeController@addressAbuseReport')->name('addressAbuseReport')->middleware('scope:GIT_Admin');
  Route::get('getAbuseReportDetails/{id}', 'HomeController@getAbuseReportDetails')->name('getAbuseReportDetails')->middleware('scope:GIT_Admin');

});

 


