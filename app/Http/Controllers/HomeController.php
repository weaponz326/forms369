<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
class HomeController extends Controller
{
    
    //AUTHCONTROLLER LOGICS 
    /**
     * business logics for creating a new user
     * createNewUser register a new user: GIT admin, Super Super Exective, 
    * branch super executive, company admin, branch admin or client
    *
    * @param  mixed $request
    *
    * @return \Illuminate\Http\Response error message or user id
    */
    protected function createNewUser(Request $request)
    {
        $message = (new AuthController)->createNewUser($request);
        return $message;

    }

     /**
      * Business logics
     * deleteUser delete a user from the database
     * @return void\Illuminate\Http\Response success or error message
     * @param  mixed $request
     * @param  mixed $id of the user to be deleted
     */
    public function deleteUser(Request $request, $id){
        $message = (new AuthController)->deleteUser($request, $id);
        return $message;
    }

    /**
    * Reset user password at first login
    * @param  mixed $request
    *
    * @return \Illuminate\Http\Response success or error message
    */
    protected function checkAccess(Request $request)
    {
        $message = (new AuthController)->checkAccess($request);
        return $message;
    }


    /**
    * send a two way authentication code to client users
    * @param  mixed $request
    *
    * @return \Illuminate\Http\Response success or error message
    */
    
    protected function sendTwoWayAuthenticationCode(Request $request, $id, $phone)
    {
        $message = (new AuthController)->sendTwoWayAuthenticationCode($request, $id, $phone);
        return $message;

    }


     /**
      * Business logics
    * twoWayAuthenticationVerification verify user provided two way access code
    * @param  mixed $request
    * @param  mixed $id user id
    * @param  mixed $code user phone code
    *
    * @return \Illuminate\Http\Response success or error message
    */
    
    protected function twoWayAuthenticationVerification(Request $request, $id, $code, $phone)
    {
        $message = (new AuthController)->twoWayAuthenticationVerification($request, $id, $code, $phone);
        return $message;
    }


 /**
  * Business logics
     * getAllUsersByTypeForDropdown get the details of users under a particular user type for a merchant
     * without pagination for dropdown
     *
     * @param  mixed $request
     * @param  mixed $id of the merchant
     * @param  mixed $user_type_id id of user_type_id of search
     * @return [json] all matching users
     */
    protected function getAllUsersByTypeForDropdown(Request $request, $user_type_id)
    {
        $message = (new AuthController)->getAllUsersByTypeForDropdown($request, $user_type_id);
        return $message;
    }

     /**
     * getNumAllUsers get the number of all users
     *
     * @param  mixed $request
     *
     * @return int count of number of all registered users
     */
    protected function getNumAllUsers(Request $request)
    {
        $message = (new AuthController)->getNumAllUsers($request);
        return $message; 
    }

    /**
     * send activation email to new user business logics 
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    protected function signupActivate(Request $request, $token)
    {
        $message = (new AuthController)->signupActivate($request, $token);
        return $message;

    }

    /**
     * Login user business logics 
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    protected function login(Request $request)
    {
        $message = (new AuthController)->login($request);
        return $message;

    }


    /**
     * Business logics for edit user 
     * editUser edit a user: GIT admin, Super Super Exective, 
    * branch super executive, company admin, branch admin or client
    *
    * @param  mixed $request
    *  @param  mixed $id of the user to be editted
    *
    * @return \Illuminate\Http\Response success or error message
    */
    protected function editUser(Request $request, $id)
    {

        $message = (new AuthController)->editUser($request, $id);
        return $message;

    }
    

     /**
      * Disable registered user business logics 
     * diableUser disable a user. A disbaled user can not log in
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  $id of the user to be disabled
     *
     * @return void\Illuminate\Http\Response success or error message
     */
    protected function diableUser(Request $request, $id)
    {
       
        $message = (new AuthController)->diableUser($request, $id);
        return $message;

    }

    /**
     * enableUser enable a user: business logics 
     * @param  \Illuminate\Http\Request  $request
     * @param  $id of the user to be enabled
     *
     * @return void\Illuminate\Http\Response success or error message
     */
    protected function enableUser(Request $request, $id)
    {

        $message = (new AuthController)->enableUser($request, $id);
        return $message;

    }

    /**
     * getAllUsersByMerchant get the details of all users in a company business logics 
     *
     * @param  mixed $request
     * @param  mixed $id of the merchant
     *
     * @return [json] all matching users
     */
    protected function getAllUsersByMerchant(Request $request, $id)
    {

        $message = (new AuthController)->getAllUsersByMerchant($request, $id);
        return $message;

    }

    /**
     * getNumAllUsersByMerchant get count of all users in a company business logics 
     *
     * @param  mixed $request
     * @param  mixed $id of the merchant
     *
     * @return [json] all matching users
     */
    protected function getNumAllUsersByMerchant(Request $request, $id)
    {
        $message = (new AuthController)->getNumAllUsersByMerchant($request, $id);
        return $message;

    }

    /**
     * getAllUsersByBranch get the details of all users in a branch business logics 
     *
     * @param  mixed $request
     * @param  mixed $id of the branch
     *
     * @return [json] all matching users
     */
    protected function getAllUsersByBranch(Request $request, $id)
    {

        $message = (new AuthController)->getAllUsersByBranch($request, $id);
        return $message;

    }


    /**
     * getNumAllUsersByBranch get the number of users in a branch
     *
     * @param  mixed $request
     * @param  mixed $id of the branch
     *
     * @return int count of number of users in a branch
     */
    protected function getNumAllUsersByBranch(Request $request, $id)
    {

        $message = (new AuthController)->getNumAllUsersByBranch($request, $id);
        return $message;

    }

    /**
     * Business logics for getting users by merchant and type
     * getMerchantUsersByType get the details of users under a particular user type for a merchant
     *
     * @param  mixed $request
     * @param  mixed $id of the merchant
     * @param  mixed $user_type_id id of user_type_id of search
     * @return [json] all matching users
     */
    protected function getMerchantUsersByType(Request $request, $id, $user_type_id)
    {

        $message = (new AuthController)->getMerchantUsersByType($request, $id, $user_type_id);
        return $message;

    }

    /**
     * getUserDetails get the details of a user
     *
     * @param  mixed $request
     * @param  mixed $id of the user
     *
     * @return [json] user object
     */
    protected function getUserDetails(Request $request, $id)
    {
        $message = (new AuthController)->getUserDetails($request, $id);
        return $message;
    }

     /**
      * Business logics to get num of users by merchant and type
     * getMerchantUsersByType get the number of users under a particular user type for a merchant
     *
     * @param  mixed $request
     * @param  mixed $id of the merchant
     * @param  mixed $user_type_id id of user_type_id of search
     * @return [json] all matching users
     */
    protected function getNumMerchantUsersByType(Request $request, $id, $user_type_id)
    {

        $message = (new AuthController)->getNumMerchantUsersByType($request, $id, $user_type_id);
        return $message;
    }

   /**
    * Business logics to get all users in a branch under a particular user type
     * getBranchUsersByType get the details of users under a particular user type for a branch
     *
     * @param  mixed $request
     * @param  mixed $id of the branch
     * @param  mixed $user_type_id id of user_type_id of search
     * @return [json] all matching users
     */
    protected function getBranchUsersByType(Request $request, $id, $user_type_id)
    {

        $message = (new AuthController)->getBranchUsersByType($request, $id, $user_type_id);
        return $message;
    }

    /**
     * Business logics to get the number of users in a branch by a type
     * getNumBranchUsersByType get the details of users under a particular user type for a branch
     *
     * @param  mixed $request
     * @param  mixed $id of the merchant
     * @param  mixed $user_type_id id of user_type_id of search
     * @return [json] all matching users
     */
    protected function getNumBranchUsersByType(Request $request, $id, $user_type_id)
    {

        $message = (new AuthController)->getNumBranchUsersByType($request, $id, $user_type_id);
        return $message;
    }

    /**
     * getMerchantUsersByType get the details of users under a particular user type for a merchant
     *
     * @param  mixed $request
     * @param  mixed $id of the merchant
     * @param  mixed $user_type_id id of user_type_id of search
     * @return [json] all matching users
     */
    protected function getAllUsersByType(Request $request, $user_type_id)
    {
       
        $message = (new AuthController)->getAllUsersByType($request, $user_type_id);
        return $message;
    }


    /**
     * 
     * Business logics to get logged in user
     * Get the authenticated/logged in  User
     *
     * @return [json] user object
     */
    protected function user(Request $request)
    {

        $message = (new AuthController)->user($request);
        return $message;
    }

     /**
      * Business logics for user log out
     * Logout user (Revoke the token)
     *
     * @return [string] message
     */
    protected function logout(Request $request)
    {

        $message = (new AuthController)->logout($request);
        return $message;
    }

    /**
     * Business logics for image upload; mostly used during an edit 
     * upload image to the public folder 
     *
     * @param  \Illuminate\Http\Request  $request 
     * @return response $url
     */
    protected function imageUpload(Request $request)
    {

        $message = (new MediaController)->imageUpload($request);
        return $message;

    }

    /**
     * Business logics to create new merchant 
     * createMerchant create a new merchant
     *
     * @param  mixed $request
     *
     * @return \Illuminate\Http\Response success or error message
     */
    protected function createMerchant(Request $request)
    {

        $message = (new SetupController)->createMerchant($request);
        return $message;
    }

    /**
    * Business logics 
     * uploadPrintFile Upload original form document for printing
     *
     * @param  mixed $request
     *
     * @return \Illuminate\Http\Response success or error message
     */
    protected function uploadPrintFile(Request $request, $merchant_id, $form_code)
     {
        $message = (new SetupController)->uploadPrintFile($request, $merchant_id, $form_code);
        return $message;
     }

     /**
      * Business logics
     * editPrintFile Edit original form document for printing
     *
     * @param  mixed $request
     *
     * @return \Illuminate\Http\Response success or error message
     */
    protected function editPrintFile(Request $request, $merchant_id, $form_code)
    {
        $message = (new SetupController)->editPrintFile($request, $merchant_id, $form_code);
        return $message;  
    }

    /**
     * Business logics 
     * getPrintFile get original form document for printing
     *
     * @param  mixed $request
     *
     * @return \Illuminate\Http\Response success or error message
     */
    protected function getPrintFile(Request $request, $merchant_id, $form_code)
    {
        $message = (new SetupController)->getPrintFile($request, $merchant_id, $form_code);
        return $message;
    }
    

     /**
     * getMerchantsForDropdown get all registered companies to populate dropdown
     *
     * @param  mixed $request
     *
     * @return void\Illuminate\Http\Response all merchants data
     */
    protected function getMerchantsForDropdown(Request $request)
    {
        $message = (new SetupController)->getMerchantsForDropdown($request);
        return $message;
    }

    /**
     * getAllBranches get all registered branches 
     *
     * @param  mixed $request
     *
     * @return void\Illuminate\Http\Response all branches data
     */
    protected function getAllBranchesForDropdown(Request $request)
    {
        $message = (new SetupController)->getAllBranchesForDropdown($request);
        return $message;
    }


    /**
     * Business logics to edit a merchant
     * editMerchant edit a merchant 
     *
     * @param  mixed $request
     * @param  mixed $id of the merchnat to be editted
     *
     * @return \Illuminate\Http\Response success or error message
     */
    protected function editMerchant(Request $request, $id)
    {

        $message = (new SetupController)->editMerchant($request, $id);
        return $message;

    }

    /**
     * Business logics to get all merchants
     * getMerchants get all registered companies 
     *
     * @param  mixed $request
     *
     * @return void\Illuminate\Http\Response all merchants data
     */
    protected function getMerchants(Request $request)
    {

        $message = (new SetupController)->getMerchants($request);
        return $message;

    }

    /**
     * Business logics to get all the details of a merchant
     * getMerchantDetails get all registered companies 
     *
     * @param  mixed $request
     *
     * @return void\Illuminate\Http\Response all merchants data
     */
    protected function getMerchantDetails(Request $request, $id)
    {

        $message = (new SetupController)->getMerchantDetails($request, $id);
        return $message;

    }

    /**
     * Business logics to get all merchants in a particular country
     * getAllMerchantsByCountry get all registered companies by country 
     *
     * @param  mixed $request
     *  @param  mixed $country merchants country of location
     *
     * @return void\Illuminate\Http\Response all merchants data
     */
    protected function getAllMerchantsByCountry(Request $request, $country)
    {

        $message = (new SetupController)->getAllMerchantsByCountry($request, $country);
        return $message;

    }

    /**
     * Business logics to get the numbe rof registered firms in the system
     * getNumMerchants get number of all registered companies 
     *
     * @param  mixed $request
     *
     * @return void\Illuminate\Http\Response all merchants data
     */
    protected function getNumMerchants(Request $request)
    {

        $message = (new SetupController)->getNumMerchants($request);
        return $message;
    }

    /**
     * Business logics to get the number of active registered merchants
     * getNumActiveMerchants get number of active merchants
     *
     * @param  mixed $request
     *
     * @return void\Illuminate\Http\Response all active merchants data
     */
    protected function getNumActiveMerchants(Request $request)
    {

        $message = (new SetupController)->getNumActiveMerchants($request);
        return $message;

    }

    /**
     * Business logics to get all registered but deactivated users in the system
     * getNumInactiveMerchants get number of inactive merchants
     *
     * @param  mixed $request
     *
     * @return void\Illuminate\Http\Response all inactive merchants data
     */
    protected function getNumInactiveMerchants(Request $request)
    {
        $message = (new SetupController)->getNumInactiveMerchants($request);
        return $message;

    }

    /**
     * Business logics to a create a company branch
     * createCompanyBranches create a new company branch
     *
     * @param  mixed $request
     *
     * @return \Illuminate\Http\Response success or error message
     */
    protected function createCompanyBranches(Request $request)
    {

        $message = (new SetupController)->createCompanyBranches($request);
        return $message;

    }

    /**
     * Business logics to edit a company branch
     * editCompanyBranches edit a company branch
     *
     * @param  mixed $request
     * @param  mixed $id of the branch to be editted
     *
     * @return \Illuminate\Http\Response success or error message
     */
    protected function editCompanyBranches(Request $request, $id)
    {

        $message = (new SetupController)->editCompanyBranches($request, $id);
        return $message;

    }

    /**
     * 
     * Business logics to get all registered branches in the system
     * getAllBranches get all registered branches 
     *
     * @param  mixed $request
     *
     * @return void\Illuminate\Http\Response all branches data
     */
    protected function getAllBranches(Request $request)
    {

        $message = (new SetupController)->getAllBranches($request);
        return $message;
    }

    /**
     * Business logics to get the numbe rof registered active branches 
     * getNumActiveBranches get number of all active registered branches 
     *
     * @param  mixed $request
     *
     * @return void\Illuminate\Http\Response num of active branches 
     */
    protected function getNumActiveBranches(Request $request)
    {

        $message = (new SetupController)->getNumActiveBranches($request);
        return $message;
    }

    /**
     * 
     * Business logics to get the number of inactive registered branches 
     * getNumInactiveBranches get number of all inactive registered branches 
     *
     * @param  mixed $request
     *
     * @return void\Illuminate\Http\Response num of inactive branches 
     */
    protected function getNumInactiveBranches(Request $request)
    {

        $message = (new SetupController)->getNumInactiveBranches($request);
        return $message;

    }

     /**
      * Business logics to get all registered branches rregardless of their status
     * getNumBranches get number of all registered branches 
     *
     * @param  mixed $request
     *
     * @return void\Illuminate\Http\Response num of branches 
     */
    protected function getNumBranches(Request $request)
    {

        $message = (new SetupController)->getNumBranches($request);
        return $message;
    }

    /**Business logics to get all registered branches under a merchant
     * getCompanyBranches get all registered company branches 
     *
     * @param  mixed $request
     * @param  mixed $id merchant id
     *
     * @return void\Illuminate\Http\Response all company branches data
     */
    protected function getCompanyBranches(Request $request, $id)
    {
        $message = (new SetupController)->getCompanyBranches($request, $id);
        return $message;

    }

    /**
     * Business logics to get the number of registered barnches under a merchant 
     * getNumCompanyBranches get num of all registered company branches 
     *
     * @param  mixed $request
     * @param  mixed $id merchant id
     *
     * @return void\Illuminate\Http\Response num of all company branches data
     */
    protected function getNumCompanyBranches(Request $request, $id)
    {

        $message = (new SetupController)->getNumCompanyBranches($request, $id);
        return $message;
    }

    /**
     * Business logics to get all the details of a branch
     * getCompanyBranchDetails get all details of a company branches 
     *
     * @param  mixed $request
     * @param  mixed $id branch id
     *
     * @return void\Illuminate\Http\Response all company branches data
     */
    protected function getCompanyBranchDetails(Request $request, $id)
    {
        $message = (new SetupController)->getCompanyBranchDetails($request, $id);
        return $message;
    }

    /**
     * Business logics to create a new user type 
     * createUserType create a new user type 
     *
     * @param  mixed $request
     *
     * @return \Illuminate\Http\Response success or error message
     */
    protected function createUserType(Request $request)
    {
        $message = (new SetupController)->createUserType($request);
        return $message;
    }

    /**
     * Business logics to edit a user type 
     * editUserType edit a user type 
     *
     * @param  mixed $request
     * @param  mixed $id of the user type to be editted
     *
     * @return \Illuminate\Http\Response success or error message
     */
    protected function editUserType(Request $request)
    {
        $message = (new SetupController)->editUserType($request);
        return $message;
    }

    /**
     * Business logics to delete auser type
     * deleteUserType delete a usertypes 
     *
     * @param  mixed $request
     * @param  mixed $id of the user type to be deleted
     * @return void\Illuminate\Http\Response error or success message
     */
    protected function deleteUserType(Request $request, $id)
    {
        $message = (new SetupController)->deleteUserType($request, $id);
        return $message;
    }

     /**
      * Business logics to get all user types in teh system
     * getAllUserTypes get all available usertypes 
     *
     * @param  mixed $request
     *
     * @return void\Illuminate\Http\Response all merchants data
     */
    protected function getAllUserTypes(Request $request)
    {

        $message = (new SetupController)->getAllUserTypes($request);
        return $message;

    }

    /**
     * Business logics to get level one user types that have not been deleted
     * getUserTypesLevel1 get all usertypes for level one
     * can be viewed by GIt_Admin, super-executive and company_admin
     *
     * @param  mixed $request
     *
     * @return void\Illuminate\Http\Response all merchants data
     */
    protected function getUserTypesLevel1(Request $request)
    {
        $message = (new SetupController)->getUserTypesLevel1($request);
        return $message;
    }

     /**
      * Business logics to get all user types at levell 2
     * getUserTypesLevel2 get all usertypes for level two
     * can be viewed by GIt_Admin, super-executive, company_admin, branch_executive and branch_admin
     *
     * @param  mixed $request
     *
     * @return void\Illuminate\Http\Response all merchants data
     */
    protected function getUserTypesLevel2(Request $request)
    {
        $message = (new SetupController)->getUserTypesLevel2($request);
        return $message;

    }

    /**
     * Business logic to get front desk user type; level 3
     * getUserTypesLevel3 get all usertypes for level three (
     * admin create front desk user)
     * can be viewed by GIt_Admin, company_admin, and branch_admin
     *
     * @param  mixed $request
     *
     * @return void\Illuminate\Http\Response all merchants data
     */
    protected function getUserTypesLevel3(Request $request)
    {
        $message = (new SetupController)->getUserTypesLevel3($request);
        return $message;
    }

    /**
     * Business logics to create a new form
     * Store a newly created form in the database
     *
     * @param  \Illuminate\Http\Request  $request
     * @return void\Illuminate\Http\Response success or error message
     */
    protected function storeForm(Request $request)
    {
        $message = (new FormsController)->storeForm($request);
        return $message;
    }  

     /**
      * Business logics
     * getFormViaLink get all details of a form via the shared form link
     *
     * @param  mixed $request
     * @param  mixed $code form code 
     *
     * @return void\Illuminate\Http\Response all details of a form
     */
    public function getFormViaLink(Request $request, $code)
    {
        $message = (new FormsController)->getFormViaLink($request, $code);
        return $message;
    }
    
    /**
     * Business logics to edit a form
     * editForm edit a form in the database
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Illuminate\Http\Request  $code code of the form to be editted 
     * @return void\Illuminate\Http\Response success or error message
     */
    protected function editForm(Request $request, $code)
    {
        $message = (new FormsController)->editForm($request, $code);
        return $message;
    }

    /**
     * Business logics to get a form details 
     * getFformDetails get all details of a form
     *
     * @param  mixed $request
     * @param  mixed $code form code 
     *
     * @return void\Illuminate\Http\Response all details of a form
     */
    protected function getFormDetails(Request $request, $code)
    {
        $message = (new FormsController)->getFormDetails($request, $code);
        return $message;
    }

     /**
      * Business logics to chaneg the ststus of a created form
     * changeFormStatus chnage the status of a form in the database
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Illuminate\Http\Request  $code code of the form to be editted 
     * @param  \Illuminate\Http\Request  $status new status of the form 
     * @return void\Illuminate\Http\Response success or error message
     */
    protected function changeFormStatus(Request $request, $code, $status)
    {
        $message = (new FormsController)->changeFormStatus($request, $code, $status);
        return $message;
    }
    /**
     * getFformDetails get all details of a form that match teh search term : name of the form
     *
     * @param  mixed $request
     * @param  mixed search term
     *
     * @return void\Illuminate\Http\Response all details of a form
     */
    protected function getFormbyName(Request $request, $term)
    {
        $message = (new FormsController)->getFormbyName($request, $term);
        return $message;

    }

    /**
     * Business logic to get all created forms in the system
     * getFformDetails get all details of a form
     *
     * @param  mixed $request
     *
     * @return void\Illuminate\Http\Response all details of a form
     */
    protected function getAllForms(Request $request)
    {
        $message = (new FormsController)->getAllForms($request);
        return $message;
    }

    /**
     * Business logics to get number if forms
     * getNumAllForms get num of all form
     *
     * @param  mixed $request
     *
     * @return void\Illuminate\Http\Response all details of a form
     */
    protected function getNumAllForms(Request $request)
    {
        $message = (new FormsController)->getNumAllForms($request);
        return $message;

    }

    /**
     * Business logics to get all forms by status
     * getAllFormsByStatus get all details of all forms by status
     *
     * @param  mixed $request
     * @param  mixed $status form status 
     *
     * @return void\Illuminate\Http\Response all details of forms
     */
    protected function getAllFormsByStatus(Request $request, $status)
    {
        $message = (new FormsController)->getAllFormsByStatus($request, $status);
        return $message;
    }

    /**
     * Business logics to get all forms for a merchant
     * getAllFormsByMerchant get all dforms for a particular merchant
     *
     * @param  mixed $request
     * @param  mixed $id id of the merchant
     *
     * @return void\Illuminate\Http\Response all details of a form
     */
    protected function getAllFormsByMerchant(Request $request, $id)
    {
        $message = (new FormsController)->getAllFormsByMerchant($request, $id);
        return $message;
    }

    /**
     * Business logics to get all forms for a merchnat by status
     * getAllFormsByStatus get all details of all forms by status
     *
     * @param  mixed $request
     * @param  mixed $status form status 
     *@param  mixed $id merchant id
     * @return void\Illuminate\Http\Response all details of forms
     */
    protected function getAllFormsByStatusAndMerchant(Request $request, $status, $id)
    {
        $message = (new FormsController)->getAllFormsByStatusAndMerchant($request, $status, $id);
        return $message;
    }

    /**
     * Business logics to delete a form
     * deleteForm deleted or archive a form
     *
     * @param  \Illuminate\Http\Request  $request
     * @param $code code of the form to be deleted 
     *
     * @return void\Illuminate\Http\Response success or error message
     */
    protected function deleteForm(Request $request, $code)
    {
        $message = (new FormsController)->deleteForm($request, $code);
        return $message;
    }

    /**
     * Business logics to recover a deleted form
     * recoverForm recover a form that was initially deleted
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Illuminate\Http\Request  $code code of the form to be recovered 
     *
     * @return void\Illuminate\Http\Response success or error message
     */
    protected function recoverForm(Request $request, $code)
    {
        $message = (new FormsController)->recoverForm($request, $code);
        return $message;
    }

     /**
      * Business logics to get all registered clients
     * getAllClients get all clients in the database 
     *
     * @param  mixed $request
     * @return void\Illuminate\Http\Response all details of all clients
     */
    protected function getAllClients(Request $request)
    {
        $message = (new ClientController)->getAllClients($request);
        return $message;
    }

     /**
      * Business logics 
     * Upload form attachements
     *
     * @param  mixed $request
     *
     * @return \Illuminate\Http\Response success or error message
     */
    public function uploadattachments(Request $request, $client_id, $form_code, $submission_code)
    {
        $message = (new ClientController)->uploadattachments($request, $client_id, $form_code, $submission_code);
        return $message;
    }

     /**
      * Business logics 
     * getAttachments get all attachments during a form submission
     *
     * @param  mixed $request
     *
     * @return \Illuminate\Http\Response containing all attachment
     */
    public function getAttachments(Request $request, $submission_code)
    {
        $message = (new ClientController)->getAttachments($request, $submission_code);
        return $message;
    }

     /**
      * Business logics to get details of a client for a clients profile
     * getClientsDetails get all details of a client 
     *
     * @param  mixed $request
     * @param  mixed $id of the client
     * @return void\Illuminate\Http\Response all details of the client
     */
    protected function getClientsDetails(Request $request, $id)
    {
        $message = (new ClientController)->getClientsDetails($request, $id);
        return $message;
    }

     /**
      * Business logics to get all user details for user profile
     * editClientProfile edit a client profile
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Illuminate\Http\Request  $id of teh client to be editted
     * @return void\Illuminate\Http\Response success or error message
     */
    protected function editClientProfile(Request $request, $id)
    {
        $message = (new ClientController)->editClientProfile($request, $id);
        return $message;
    }

    /**
     * Business logics to submit a form
     * submitForm client submit a form
     *
     * @param  \Illuminate\Http\Request  $request
     * @param $id of the client submitting the form
     * @param $code form code that is being filled 
     * @return void\Illuminate\Http\Response submission code
     */
    protected function submitForm(Request $request, $id, $code)
    {
        $message = (new ClientController)->submitForm($request, $id, $code);
        return $message;

    }

     /**
      * Business logics to all submitted forms for a GIt admin
     * getAllSubmittedForms get all submitted forms
     *
     * @param  mixed $request
     *
     * @return void\Illuminate\Http\Response all details of submitted form
     */
    protected function getAllSubmittedForms(Request $request)
    {
        $message = (new FrontDeskController)->getAllSubmittedForms($request);
        return $message;
    }

    /**
     * Business logics to get all submitted forms for a merchant
     * getAllSubmittedForms get all submitted forms
     *
     * @param  mixed $request
     * @param  mixed $id of the merchant
     * @return void\Illuminate\Http\Response all details of a form
     */
    protected function getAllSubmittedFormsByMerchant(Request $request, $id)
    {
        $message = (new FrontDeskController)->getAllSubmittedFormsByMerchant($request, $id);
        return $message;
    }

    /**
     * Business logics to get a submitted form by submitted code
     * getSubmittedFormByCode get form by code
     *
     * @param  mixed $request
     *
     * @return void\Illuminate\Http\Response all details of submitted form
     */
    protected function getSubmittedFormByCode(Request $request, $code)
    {
        $message = (new FrontDeskController)->getSubmittedFormByCode($request, $code);
        return $message;
    }

    /**
     * Business logics for a front desk to get submitted form
     * FrontDeskGetSubmittedFormByCode get submitted form by id and merchant
     * This avoid front desk people from viewing forms submitted to other merchants
     *
     * @param  mixed $request
     *  @param  mixed $id of the merchant
     *
     * @return void\Illuminate\Http\Response all details of submitted form
     */
    protected function FrontDeskGetSubmittedFormByCode(Request $request, $code, $id)
    {
        $message = (new FrontDeskController)->FrontDeskGetSubmittedFormByCode($request, $code, $id);
        return $message;
    }

    /**
     * Business logics to get a submitted form by ststus to a merchant 
     * getSubmittedFormByStatusAndMerchant get all submitted forms by merchant and status 
     *
     * @param  mixed $request
     * @param  mixed $status stautus of submitted forms to sort by
     * @param  mixed $id id of merchant for the submitted forms
     * @return void\Illuminate\Http\Response all details of submitted form
     */
    protected function getSubmittedFormByStatusAndMerchant(Request $request, $status, $id)
    {
        $message = (new FrontDeskController)->getSubmittedFormByStatusAndMerchant($request, $status, $id);
        return $message;
    }

    /**
     * Business logics to process a form; Forms that have already been proceeded can not be processed again
     * processSubmitForm process a submitted form that has not been fully processed
     *
     * @param  \Illuminate\Http\Request  $request
     * @param $code submission code that is being processed 
     * @param $status new processing state stage
     * @return void\Illuminate\Http\Response error or success message
     */
    protected function processSubmitForm(Request $request, $code, $status)
    {
        $message = (new FrontDeskController)->processSubmitForm($request, $code, $status);
        return $message;
    }

      /**
     * FormsProcessedByFrontDeskPerson forms processed by a particular front desk person
     * on a particular date range
     *
     * @param  \Illuminate\Http\Request  $request
     * @param $id of front desk person
     * @param $startdate start date range 
     * @param $enddate start date range 
     * @return void\Illuminate\Http\Response all details of submitted form
     * 
     */
    protected function FormsProcessedByFrontDeskPerson(Request $request, $id, $startdate, $enddate)
    {
        $message = (new FrontDeskController)->FormsProcessedByFrontDeskPerson($request, $request, $id, $startdate, $enddate);
        return $message;
    }

    /**
     * Business logics to get number of forms processed by a front desk person
     * numFormsProcessedByFrontDeskPerson get the number of forms processed by a particular front desk person
     * on a particular date range
     *
     * @param  \Illuminate\Http\Request  $request
     * @param $id of front desk person
     * @param $startdate start date range 
     * @param $enddate start date range 
     * @return int number of forms processed
     */
    protected function numFormsProcessedByFrontDeskPerson(Request $request, $id, $startdate, $enddate)
    {
        $message = (new FrontDeskController)->numFormsProcessedByFrontDeskPerson($request, $request, $id, $startdate, $enddate);
        return $message;
    }

    /**
     * Business logics to get all forms processed by a frontdesk person
     * getAllFormsProcessedByFrontDeskPerson forms processed by a particular front desk person
     * of all time
     *
     * @param  \Illuminate\Http\Request  $request
     * @param $id of front desk person
     * @return void\Illuminate\Http\Response all details of submitted form
     * 
     */
    protected function getAllFormsProcessedByFrontDeskPerson(Request $request, $id)
    {
        $message = (new FrontDeskController)->getAllFormsProcessedByFrontDeskPerson($request, $id);
        return $message;
    }

    /**
     * Business logics to get the numbe rof all forms processed by a frontdek person
     * getNumAllFormsProcessedByFrontDeskPerson get num of forms processed by a particular front desk person
     * of all time
     *
     * @param  \Illuminate\Http\Request  $request
     * @param $id of front desk person
     * @return void\Illuminate\Http\Response all details of submitted form
     * 
     */
    protected function getNumAllFormsProcessedByFrontDeskPerson(Request $request, $id)
    {
        $message = (new FrontDeskController)->getNumAllFormsProcessedByFrontDeskPerson($request, $id);
        return $message;
    }

    /**
     * Business logics
     * viewRespondentData get all respondents data for a particular form
     *
     * @param  \Illuminate\Http\Request  $request
     * @param $code form code 
     * @return void\Illuminate\Http\Response all details of respondents
     * 
     */
    protected function viewRespondentData(Request $request, $code)
    {
        $message = (new FrontDeskController)->viewRespondentData($request, $code);
        return $message;
    }
     /**
      * Business logics 
     * getClientSubmittedForms forms submitted by a client of any status: 
     * submitted, in_process,or processed
     *
     * @param  \Illuminate\Http\Request  $request
     * @param $id of the client 
     * @return void\Illuminate\Http\Response all details of form
     * 
     */
    protected function getClientSubmittedForms(Request $request, $id)
    {
        $message = (new ClientController)->getAllsubmittedForms($request, $id);
        return $message;
    }

    /**
     * Business logics 
     * getNumAllsubmittedForms number of forms submitted by a client of any status: 
     * submitted, in_process,or processed
     *
     * @param  \Illuminate\Http\Request  $request
     * @param $id of the client 
     * @return void\Illuminate\Http\Response number of forms
     * 
     */
    protected function getNumAllsubmittedForms(Request $request, $id)
    {
        $message = (new ClientController)->getNumAllsubmittedForms($request, $id);
        return $message;
    }

    /**
     * Business logics 
     * getClientFormsByStatus get all forms by status: processed, in_process, submitted 
     *
     * @param  \Illuminate\Http\Request  $request
     * @param $id of the client 
     * @param $status search status
     * @return void\Illuminate\Http\Response all details of form
     * 
     */
    protected function getClientFormsByStatus(Request $request, $id, $status)
    {
        $message = (new ClientController)->getClientFormsByStatus($request, $id, $status);
        return $message;
    }

    /**
     * Business logics 
     * getClientFormsByStatus get number of all forms by status: processed, in_process, submitted 
     *
     * @param  \Illuminate\Http\Request  $request
     * @param $id of the client 
     * @param $status search status
     * @return void\Illuminate\Http\Response all details of form
     * 
     */
    protected function getNumClientFormsByStatus(Request $request, $id, $status)
    {
        $message = (new ClientController)->getNumClientFormsByStatus($request, $id, $status);
        return $message;
    }

    /**
     * getNumAllFormsByMerchant get number of all forms (except deleted forms)
     * for a particular merchant
     *
     * @param  mixed $request
     * @param  mixed $id id of the merchant
     *
     * @return void\Illuminate\Http\Response number of form
     */
    protected function getNumAllFormsByMerchant(Request $request, $id)
    {
        $message = (new ExecutiveController)->getNumAllFormsByMerchant($request, $id);
        return $message;
    }

    /**
     * getNumAllFormsByStatusAndMerchant get number of all forms by status
     *
     * @param  mixed $request
     * @param  mixed $status form status 
     *@param  mixed $id merchant id
     * @return void\Illuminate\Http\Response number of forms
     */
    protected function getNumAllFormsByStatusAndMerchant(Request $request, $status, $id)
    {
        $message = (new ExecutiveController)->getNumAllFormsByStatusAndMerchant($request, $status, $id);
        return $message; 
    }

    /**
     * Business logics 
     * getSubmittedFormByStatusAndMerchant get all submitted forms by merchant and status 
     *
     * @param  mixed $request
     * @param  mixed $status stautus of submitted forms to sort by
     * @param  mixed $id id of merchant for the submitted forms
     * @return void\Illuminate\Http\Response num of all submitted form
     */
    protected function getNumSubmittedFormsByStatus(Request $request, $status, $id)
    {
        $message = (new ExecutiveController)->getNumSubmittedFormsByStatus($request, $status, $id);
        return $message; 
    }

    /**
     * Business logics 
     * getNumBranchProcessedFormsByStatus get all procssed forms at a branch and status 
     *
     * @param  mixed $request
     * @param  mixed $status stautus of submitted forms to sort by
     * @param  mixed $id id of branch the submitted forms were processed
     * @return void\Illuminate\Http\Response num of all processed submitted form
     */
    protected function getNumBranchProcessedFormsByStatus(Request $request, $status, $id)
    {
        $message = (new ExecutiveController)->getNumBranchProcessedFormsByStatus($request, $status, $id);
        return $message; 
    }

     /**
      * Business logics
     * createTemplate create a form template for use 
     *
     * @param  \Illuminate\Http\Request  $request
     * @return void\Illuminate\Http\Response success or error message
     */
    protected function createTemplate(Request $request)
    {
        $message = (new TemplatesController)->createTemplate($request);
        return $message; 
    }

    /**
     * editTemplate edit an existing template 
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Illuminate\Http\Request  $id of the template to be editted 
     * @return void\Illuminate\Http\Response success or error message
     */
    protected function editTemplate(Request $request, $id)
    {
        $message = (new TemplatesController)->editTemplate($request, $id);
        return $message;
    }

    /**
     * getAllTemplates get all available templates in the database
     *
     * @param  mixed $request
     *
     * @return void\Illuminate\Http\Response all details of templates
     */
    protected function getAllTemplates(Request $request)
    {
        $message = (new TemplatesController)->getAllTemplates($request);
        return $message;
    }

    /**
     * Business logics 
     * searchTemplateByName get search for a template by the name in the database 
     *
     * @param  mixed $request
     * @param  mixed $term ;  user serach term
     * @return void\Illuminate\Http\Response all details of templates matching the search term
     */
    public function searchTemplateByName(Request $request, $term)
    {
        $message = (new TemplatesController)->searchTemplateByName($request, $term);
        return $message;
    }
    /**
     * deleteTemplate delete a template
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Illuminate\Http\Request  $id of the template to be deleted 
     * @return void\Illuminate\Http\Response success or error message
     */
    protected function deleteTemplate(Request $request, $id)
    {
        $message = (new TemplatesController)->deleteTemplate($request, $id);
        return $message;
    }

    /**
     * diableMerchant disable a merchant business logics 
     * All users under this merchant are disabled as well
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  $id of the merchant to be disabled
     *
     * @return void\Illuminate\Http\Response success or error message
     */
    protected function disableMerchant(Request $request, $id)
    {

        $message = (new SetupController)->disableMerchant($request, $id);
        return $message;
    }

    /**
     * enableMerchant enable a previously disbaled merchant business logics 
     * All users under this merchant that were disabled as a result 
     * of diabling the mercahnt are enabled
     * @param  \Illuminate\Http\Request  $request
     * @param  $id of the merchant to be enabled
     *
     * @return void\Illuminate\Http\Response success or error message
     */
    protected function enableMerchant(Request $request, $id)
    {

        $message = (new SetupController)->enableMerchant($request, $id);
        return $message;
    }

    /**
     * diableBranch disable a branch business logics
     * All users under this branch are disabled as well
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  $id of the branch to be disabled
     *
     * @return void\Illuminate\Http\Response success or error message
     */
    protected function disableBranch(Request $request, $id)
    {

        $message = (new SetupController)->disableBranch($request, $id);
        return $message;
    }

    /**
     * enableBranch enable a previously disbaled branch business logics
     * All users under this branch that were disabled as a result 
     * of diabling the branch are enabled
     * @param  \Illuminate\Http\Request  $request
     * @param  $id of the branch to be enabled
     *
     * @return void\Illuminate\Http\Response success or error message
     */
    protected function enableBranch(Request $request, $id)
    {

        $message = (new SetupController)->enableBranch($request, $id);
        return $message;
    }

    /**
     * Business logics to create an access code
     * createAccessCode GIT admin create an access code 
     * @param  \Illuminate\Http\Request  $request
     * @return void\Illuminate\Http\Response access code
     */
    protected function createAccessCode(Request $request)
    {
        $message = (new AccessController)->createAccessCode($request);
        return $message;
    }

    /**
     * Business logics to create a form section
     * During form creation, a user can drag and drop form section and all fields for this section will be added 
     * @param  \Illuminate\Http\Request  $request
     * @return void\Illuminate\Http\Response success or error message
     */
    protected function createSection(Request $request)
    {

        $message = (new FormsController)->createSection($request);
        return $message;
    }

    /**
     * Business logics 
     * editSection Edit form fields or heading of a section
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Illuminate\Http\Request  $id of the section to be editted 
     * @return void\Illuminate\Http\Response success or error message
     */
    protected function editSection(Request $request, $id)
    {
        $message = (new FormsController)->editSection($request, $id);
        return $message;
    }

     /**
      * Business logics
     * getAllSections get all available sections in the database
     *
     * @param  mixed $request
     *
     * @return void\Illuminate\Http\Response all details of sections
     */
    protected function getAllSections(Request $request)
    {
        $message = (new FormsController)->getAllSections($request);
        return $message;
    }

    /*
     *deleteSection deletes a section from teh database 
     * @param  \Illuminate\Http\Request  $request
     * @param  \Illuminate\Http\Request  $id of the template to be deleted 
     * @return void\Illuminate\Http\Response success or error message
     */
    protected function deleteSection(Request $request, $id)
    {
        $message = (new FormsController)->deleteSection($request, $id);
        return $message;
    }

    /**
     * Business logics 
     * searchSectionByHeading search for a section by the heading name in the database 
     *
     * @param  mixed $request
     * @param  mixed $term ;  user serach term
     * @return void\Illuminate\Http\Response all details of sections matching the search term
     */
    protected function searchSectionByHeading(Request $request, $term)
    {
        $message = (new FormsController)->searchSectionByHeading($request, $term);
        return $message;

    }

    /**
     * Business logics 
     * Reactivate an access code for use 
     * @param  \Illuminate\Http\Request  $request
     * @param  \Illuminate\Http\Request  $code access code to be reactivated 
     * @return void\Illuminate\Http\Response error or success message
     */
    protected function activateAccessCode(Request $request, $code)
    {
        $message = (new AccessController)->activateAccessCode($request, $code);
        return $message;
        
    }

    /**
     * Business logics 
     * Deactivate an access code an access code
     * @param  \Illuminate\Http\Request  $request
     * @param  \Illuminate\Http\Request  $code access code to be deactivated 
     * @return void\Illuminate\Http\Response error or success message
     */
    protected function deactivateAccessCode(Request $request, $code)
    {
        $message = (new AccessController)->deactivateAccessCode($request, $code);
        return $message;
        
    }

    /**
     * Business logics to validate provided access code
     * Check if access code is valid and active 
     * @param  \Illuminate\Http\Request  $request
     * @param  \Illuminate\Http\Request  $code access code provided by user
     * @return void\Illuminate\Http\Response error or success message
     */
    protected function ValidateAccessCode(Request $request, $code)
    {
        $message = (new AccessController)->ValidateAccessCode($request, $code);
        return $message;
    }

    /**
     * Business logics
    * Reset user password at first login
    * @param  mixed $request
    *
    * @return \Illuminate\Http\Response success or error message
    */
    protected function resetPassword(Request $request, $id)
    {
        $message = (new AuthController)->resetPassword($request, $id);
        return $message;
    }
    
     /**
      * Business logics 
     * getAllCodes get the created access codes 
     *
     * @param  mixed $request
     * @return [json] all access codes in teh database 
     */
    protected function getAllCodes(Request $request)
    {
        $message = (new AccessController)->getAllCodes($request);
        return $message;
    }

    /**
     * getAllCodes get the created access codes by active status
     *
     * @param  mixed $request
     * @return [json] all access codes matching active status in the database 
     */
    protected function getAccessCodesByStatus(Request $request, $active)
    {
        $message = (new AccessController)->getAccessCodesByStatus($request, $active);
        return $message; 
    }

    /**
     * Business logics 
     * getAccessCodesDetails get all details of an access code 
     * @param  mixed $request
     * @param  mixed $code access code being searched
     * @return [json] access codes matching the searched code
     */
    protected function getAccessCodesDetails(Request $request, $code)
    {
        $message = (new AccessController)->getAccessCodesDetails($request, $code);
        return $message;  
    }

}
