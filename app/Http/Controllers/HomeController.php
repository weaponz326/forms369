<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
class HomeController extends Controller
{
    
    // public function __construct()
    // {
    //     $this->middleware('client');
    // }
    
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
     * candownload indicate wheather a user can print a document or not
     * 1 for yes, 0 for no
     *
     * @param  mixed $request
     *
     * @return \Illuminate\Http\Response success or error message
     */
    protected function candownload(Request $request, $id, $status)
    {
        $message = (new AuthController)->candownload($request, $id, $status);
        return $message;
    }

     /**
      * Business logics 
     * forgotPassword reset user password
     * 
     * @return void\Illuminate\Http\Response success or error message
     * @param  mixed $request
     * @param  mixed $id of the user to be deleted
     */
    protected function forgotPassword(Request $request){
        $message = (new AuthController)->forgotPassword($request);
        return $message;
    }

    /**
     * Business logics
     * resetForgottenPassword reset user forgotten password
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    protected function confirmForgottenPassword(Request $request, $token)
    {
        $message = (new AuthController)->confirmForgottenPassword($request, $token);
        return $message;
    }

    /**
     * forgotPin reset user pin
     * 
     * @return void\Illuminate\Http\Response success or error message
     * @param  mixed $request
     */
     public function forgotPin(Request $request){
        $message = (new AuthController)->forgotPin($request);
        return $message;
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
        $message = (new AuthController)->confirmForgottenPin($request, $token);
        return $message; 
     }

     /**
    * resetPin Reset user pin
    * @param  mixed $request
    * @param mixed $id of the user reseting their password
    * @return \Illuminate\Http\Response success or error message
    */
    public function resetPin(Request $request, $id)
    {
        $message = (new AuthController)->resetPin($request, $id);
        return $message;
    }

     /**
      * Business logics
     * deleteUser delete a user from the database
     * @return void\Illuminate\Http\Response success or error message
     * @param  mixed $request
     * @param  mixed $id of the user to be deleted
     */
    protected function deleteUser(Request $request, $id){
        $message = (new AuthController)->deleteUser($request, $id);
        return $message;
    }


     /**
     * recoverDeletedUser recover a deleted user in the database
     * @return void\Illuminate\Http\Response success or error message
     * @param  mixed $request
     * @param  mixed $id of the user to be recovered
     */
     protected function recoverDeletedUser(Request $request, $id)
     {
        $message = (new AuthController)->recoverDeletedUser($request, $id);
        return $message;
     }

     /**
     * getAllDeletedUsers get the details of all deleted users in a merchant
     *
     * @param  mixed $request
     * @param  mixed $id of the merchant
     *
     * @return [json] all deleted users in the database
     */
     protected function getAllDeletedUsers(Request $request)
     {
        $message = (new AuthController)->getAllDeletedUsers($request);
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
     * suggestMerchant create a suggested merchant by a client
     *
     * @param  mixed $request
     *
     * @return \Illuminate\Http\Response success or error message
     */
     public function suggestMerchant(Request $request){
        $message = (new SetupController)->suggestMerchant($request);
        return $message;
     }

     /**
     * getAllBusinessSectors get all business sectors in the db
     *
     * @param  mixed $request
     *
     * @return void\Illuminate\Http\Response all template categories data
     */
     public function getAllSuggestedMerchants(Request $request){
        $message = (new SetupController)->getAllSuggestedMerchants($request);
        return $message;
    }

    /**
     * getCompanyColors get company colors
     *
     * @param  mixed $request
     * @param  mixed $id compnay id
     *
     * @return void\Illuminate\Http\Response all company colors data
     */
     public function getCompanyColors(Request $request, $id){
        $message = (new SetupController)->getCompanyColors($request, $id);
        return $message;
     }


    /**
    * getMerchantbyName search for a merchant based on a search term
    *
    * @param  mixed $request
    * @param  mixed search term
    *
    * @return void\Illuminate\Http\Response all merchants matching the search term
    **/
    protected function getMerchantbyName(Request $request, $term, $country, $sector)
    {
        $message = (new SetupController)->getMerchantbyName($request, $term, $country, $sector);
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
    protected function getAllMerchantsByCountry(Request $request, $country, $sector)
    {

        $message = (new SetupController)->getAllMerchantsByCountry($request, $country, $sector);
        return $message;

    }

    /**
     * Non paginated api
     * Business logics to get all merchants in a particular country
     * getAllMerchantsByCountry get all registered companies by country 
     *
     * @param  mixed $request
     *  @param  mixed $country merchants country of location
     *
     * @return void\Illuminate\Http\Response all merchants data
     */
    protected function getAllMerchantsByCountryApp(Request $request, $country, $sector)
    {

        $message = (new SetupController)->getAllMerchantsByCountryApp($request, $country, $sector);
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
     * getActiveCompanyBranches get all registered active company branches for forms submission
     *
     * @param  mixed $request
     * @param  mixed $id merchant id
     *
     * @return void\Illuminate\Http\Response all active company branches data
     */
     protected function getActiveCompanyBranches(Request $request, $id)
     {
        $message = (new SetupController)->getActiveCompanyBranches($request, $id);
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
    protected function getFormViaLink(Request $request, $code)
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
     * getFormbyName get forms whose names match the search term
     *
     * @param  mixed $request
     * @param  mixed search term
     *
     * @return void\Illuminate\Http\Response all details of a form
     */
    protected function getFormbyName(Request $request, $term, $country, $sector)
    {
        $message = (new FormsController)->getFormbyName($request, $term, $country, $sector);
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
     * non paginated
     * Business logics to get all forms for a merchant
     * getAllFormsByMerchant get all dforms for a particular merchant
     *
     * @param  mixed $request
     * @param  mixed $id id of the merchant
     *
     * @return void\Illuminate\Http\Response all details of a form
     */
    protected function getAllFormsByMerchantApp(Request $request, $id)
    {
        $message = (new FormsController)->getAllFormsByMerchantApp($request, $id);
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
     * getAllDeletedFormsByMerchant get all deleted forms for a particular merchant
     *
     * @param  mixed $request
     * @param  mixed $id id of the merchant
     *
     * @return void\Illuminate\Http\Response all details of a form
     */
     public function getAllDeletedFormsByMerchant(Request $request, $id)
     {
        $message = (new FormsController)->getAllDeletedFormsByMerchant($request, $id);
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
    protected function uploadattachments(Request $request, $client_id, $form_code, $submission_code)
    {
        $message = (new ClientController)->uploadattachments($request, $client_id, $form_code, $submission_code);
        return $message;
    }

     /**
     * addReview add a review to a rejected form
     *
     * @param  mixed $request
     *
     * @return \Illuminate\Http\Response success or error message
     */
    public function addReview(Request $request)
    {
        $message = (new ClientController)->addReview($request);
        return $message;
    }

      /**
     * getAllReviews get a review for a rejected submitted form
     *
     * @param  mixed $request
     *
     * @return void\Illuminate\Http\Response aa review for the submitted form
     */
    protected function getFormReview(Request $request, $code)
    {
        $message = (new ClientController)->getFormReview($request, $code);
        return $message;
    }


    /**
     * deleteFormReview delete a review for a rejected submitted form
     *
     * @param  mixed $request
     *
     * @return void\Illuminate\Http\Response error or success message
     */
    protected function deleteFormReview(Request $request, $code)
    {
        $message = (new ClientController)->deleteFormReview($request, $code);
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
    
    protected function getAttachments(Request $request, $submission_code)
    {
        $message = (new ClientController)->getAttachments($request, $submission_code);
        return $message;
    }

    /**
     * deleteAttachment delete an attachement from a form
     *
     * @param  mixed $request
     * @param  mixed $key field key 
     * @param  mixed $name file name
     * @param  mixed $sub_code  submission code 
     *
     * @return \Illuminate\Http\Response containing all attachment
     */
    protected function deleteAttachment(Request $request, $client_id, $key, $name, $sub_code)
    {
        $message = (new ClientController)->deleteAttachment($request, $client_id, $key, $name, $sub_code);
        return $message;
    }

    /**
      * Business logics 
     * Upload profile attachements
     *
     * @param  mixed $request
     *
     * @return \Illuminate\Http\Response success or error message
     */
    protected function uploadProfileAttachments(Request $request, $client_id)
    {
        $message = (new ClientController)->uploadProfileAttachments($request, $client_id);
        return $message;
    }

     /**
      * Business logics 
     * getAttachments get all attachments for user profile
     *
     * @param  mixed $request
     *
     * @return \Illuminate\Http\Response containing all attachment
     */

     
    protected function getProfileAttachments(Request $request, $client_id)
    {
        $message = (new ClientController)->getProfileAttachments($request, $client_id);
        return $message;
    }

    /**
      * Business logics 
     * deleteProfileAttachment gdelete an attachement from user profile
     *
     * @param  mixed $request
     *
     * @return \Illuminate\Http\Response containing an error or success message
     */

     
    protected function deleteProfileAttachment(Request $request, $client_id, $key,$name)
    {
        $message = (new ClientController)->deleteProfileAttachment($request, $client_id, $key, $name);
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
    protected function submitForm(Request $request, $id, $code, $edit, $sub_code, $status=null)
    {
        $message = (new ClientController)->submitForm($request, $id, $code, $edit, $sub_code, $status);
        return $message;

    }

    /**
     * checkFormSubmission check if form to be submitted has already been submitted but not yet processed
     *
     * @param  \Illuminate\Http\Request  $request
     * @param $id of the client submitting the form
     * @param $code form code that is being filled 
     * @return void\Illuminate\Http\Response 0 if form is not already submitted or 1 if submission exist
     * status; status of the form that was already submitted (in-process or submitted)
     * submitted; 1 if similar submission exists and 0 if no similar submission exists
     * code; submission code (submission code of the old submission or null if no old submission exists) 
     */
     protected function checkFormSubmission(Request $request, $id, $code)
     {
        $message = (new ClientController)->checkFormSubmission($request, $id, $code);
        return $message;
     }

    /**
     * Business logics 
     * hasPin check if user has pin
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response Yes or no
     */
    protected function hasPin(Request $request, $id)
    {
        $message = (new ClientController)->hasPin($request, $id);
        return $message;
    }

    /**
     * hasPin check if user has pin
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response Yes or no
     */
    protected function setPin(Request $request, $id, $pin)
    {
        $message = (new ClientController)->setPin($request, $id, $pin);
        return $message;
    }

    /**
     * hasPin check if user has pin
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response Yes or no
     */
    protected function changePin(Request $request, $id)
    {
        $message = (new ClientController)->changePin($request, $id);
        return $message;
    }

     /**
     * checkPin check user provided pin during form submission
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response sucess or error message
     */
    protected function checkPin(Request $request, $id, $pin)
    {
        $message = (new ClientController)->checkPin($request, $id, $pin);
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
     * checkBranchSubmittedTo frontdesk check if form was submitted to his/her branch
     * This avoid front desk people from viewing forms submitted to other branches
     *
     * @param  mixed $request
     *  @param  mixed $id of frontdesk user
     *
     * @return void\Illuminate\Http\Response all details of submitted form
     */
     public function checkBranchSubmittedTo(Request $request, $code)
     {
        $message = (new FrontDeskController)->checkBranchSubmittedTo($request, $code);
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
    protected function FormsProcessedByFrontDeskPerson(Request $request, $id, $startdate, $enddate, $status)
    {
        $message = (new FrontDeskController)->FormsProcessedByFrontDeskPerson($request, $request, $id, $startdate, $enddate, $status);
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
    protected function numFormsProcessedByFrontDeskPerson(Request $request, $id, $startdate, $enddate, $status)
    {
        $message = (new FrontDeskController)->numFormsProcessedByFrontDeskPerson($request, $request, $id, $startdate, $enddate, $status);
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
    protected function getAllFormsProcessedByFrontDeskPerson(Request $request, $id, $status)
    {
        $message = (new FrontDeskController)->getAllFormsProcessedByFrontDeskPerson($request, $id, $status);
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
    protected function getNumAllFormsProcessedByFrontDeskPerson(Request $request, $id, $status)
    {
        $message = (new FrontDeskController)->getNumAllFormsProcessedByFrontDeskPerson($request, $id, $status);
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
     *non paginated
      * Business logics 
     * getClientSubmittedForms forms submitted by a client of any status: 
     * submitted, in_process,or processed
     *
     * @param  \Illuminate\Http\Request  $request
     * @param $id of the client 
     * @return void\Illuminate\Http\Response all details of form
     * 
     */
    protected function getClientSubmittedFormsApp(Request $request, $id)
    {
        $message = (new ClientController)->getAllsubmittedFormsApp($request, $id);
        return $message;
    }


    protected function findSubmittedFormByName(Request $request, $id, $form_name, $status)
    {
        $message = (new ClientController)->findSubmittedFormByName($request, $id, $form_name, $status);
        return $message;
    }

    protected function findSubmittedFormByCode(Request $request, $id, $form_code, $status)
    {
        $message = (new ClientController)->findSubmittedFormByCode($request, $id, $form_code, $status);
        return $message;
    }

    /**
     * findSubmittedFormByDate search for a submitted form by a date submitted range
     * @param  \Illuminate\Http\Request  $request
     * @param $id of the client  who submitted the forms
     * @param $sdate start date
     * @param $edate end date
     * @param $status status of submitted forms to be searched, ie. on the processed forms window, search should be on only processed forms and not all submitted forms
     * @return void\Illuminate\Http\Response all details of the submitted form
     * 
     */
     public function findSubmittedFormByDate(Request $request, $id, $status, $sdate, $edate)
     {
        $message = (new ClientController)->findSubmittedFormByDate($request, $id, $status, $sdate, $edate);
        return $message;
     }

    protected function deleteSubmittedForm(Request $request, $client_id, $submission_code)
    {
        $message = (new ClientController)->deleteSubmittedForm($request, $client_id, $submission_code);
        return $message;
    }

    /**
     * recoverDeletedSubmittedForm recover deleted submitted form
     * @param mixed $client_id client id
     * @param  mixed $request
     * @param mixed $submission_code form submission code to be deleted
     * @return \Illuminate\Http\Response error or success message 
     */
     protected function recoverDeletedSubmittedForm(Request $request, $client_id, $submission_code)
     {
        $message = (new ClientController)->recoverDeletedSubmittedForm($request, $client_id, $submission_code);
        return $message;
     }


       /**
     * getAllDeletedSubmittedForms get all deleted submitted forms
     *
     * @param  \Illuminate\Http\Request  $request
     * @param $id of the client  who submitted the forms
     * @return void\Illuminate\Http\Response all details of deleted forms for a client
     * 
     */
    protected function getAllDeletedSubmittedForms(Request $request, $id)
    {
        $message = (new ClientController)->getAllDeletedSubmittedForms($request, $id);
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
     * non paginated
     * Business logics 
     * getClientFormsByStatus get all forms by status: processed, in_process, submitted 
     *
     * @param  \Illuminate\Http\Request  $request
     * @param $id of the client 
     * @param $status search status
     * @return void\Illuminate\Http\Response all details of form
     * 
     */
    protected function getClientFormsByStatusApp(Request $request, $id, $status)
    {
        $message = (new ClientController)->getClientFormsByStatusApp($request, $id, $status);
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
     * createTemplateCategory create a new template category
     *
     * @param  mixed $request
     *
     * @return \Illuminate\Http\Response success or error message
     */
    protected function createTemplateCategory(Request $request)
    {
        $message = (new TemplatesController)->createTemplateCategory($request);
        return $message; 
    }


    /**
     * getAllTemplateCategories get all available template categories in the database  
     *
     * @param  mixed $request
     *
     * @return void\Illuminate\Http\Response all template categories data
     */
    protected function getAllTemplateCategories(Request $request)
    {
        $message = (new TemplatesController)->getAllTemplateCategories($request);
        return $message; 
    }

    /**
     * getAllTemplatesbyCategory get all  templates in the database under a particular category
     *
     * @param  mixed $request
     *
     * @return void\Illuminate\Http\Response all details of templates under the selected category
     */
    protected function getAllTemplatesbyCategory(Request $request, $id)
    {
        $message = (new TemplatesController)->getAllTemplatesbyCategory($request, $id);
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
    protected function searchTemplateByNameOrCategory(Request $request, $term)
    {
        $message = (new TemplatesController)->searchTemplateByNameOrCategory($request, $term);
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

    /**
     * Business logics
     * FormsProcessedByFrontDeskPersonDaily fforms processed by a front desk person on a current day
     *
     * @param  \Illuminate\Http\Request  $request
     * @param $id of front desk person
     * @return void\Illuminate\Http\Response all details of submitted form
     * 
     */
    protected function FormsProcessedByFrontDeskPersonDaily(Request $request, $id, $status)
    {
        $message = (new FrontDeskController)->FormsProcessedByFrontDeskPersonDaily($request, $id, $status);
        return $message;  
    }


 /**
     * numFormsProcessedByFrontDeskPersonDaily get num forms processed by a front desk person on a current day
     *
     * @param  \Illuminate\Http\Request  $request
     * @param $id of front desk person
     * @return void\Illuminate\Http\Response all details of submitted form
     * 
     */
    protected function numFormsProcessedByFrontDeskPersonDaily(Request $request, $id, $status)
    {
        $message = (new FrontDeskController)->numFormsProcessedByFrontDeskPersonDaily($request, $id, $status);
        return $message;  
    }

     /**
      * Business logics 
     * get form for a merchant based on a search term in a particular status category 
     *
     * @param  mixed $request
     * @param  mixed $term search term
     * @param  mixed $merchant_id id of the merchant that the forms belong to
     * @param  mixed $status search for a form based on a particular status
     * @return void\Illuminate\Http\Response all details of a form
     */
    protected function getFormbyNameStatusAndMerchant(Request $request, $term, $status, $merchant_id)
    {
        $message = (new FormsController)->getFormbyNameStatusAndMerchant($request, $term, $status, $merchant_id);
        return $message;
    }
    
    /**
     * Business logics
     * get form for a merchant based on a search term 
     *
     * @param  mixed $request
     * @param  mixed $term search term
     * @param  mixed $merchant_id id of the merchant that the forms belong to
     * @return void\Illuminate\Http\Response all details of a form
     */
    protected function getFormbyNameAndMerchant(Request $request, $term, $merchant_id)
    {
        $message = (new FormsController)->getFormbyNameAndMerchant($request, $term, $merchant_id);
        return $message;
    }

     /**
      * Business logics
     * Get all users under a user type and merchant matching a search term
     *
     * @param  mixed $request
     * @param  mixed $merchant_id of the merchant
     * @param  mixed $user_type_id id of user_type_id of search
     * @param  mixed $term user search term
     * @return [json] all matching users
     */
    public function getUserByTypeAndMerchant(Request $request, $user_type_id, $merchant_id, $term)
    {
        $message = (new AuthController)->getUserByTypeAndMerchant($request, $user_type_id, $merchant_id, $term);
        return $message;
    }

    /**
     * Get all users under a user type and merchant matching a search term under a status categor (active or inactive)
     *
     * @param  mixed $request
     * @param  mixed $merchant_id of the merchant
     * @param  mixed $user_type_id id of user_type_id of search
     * @param  mixed $term user search term
     * @return [json] all matching users
     */
    public function getUserByTypeStatusAndMerchant(Request $request, $user_type_id, $merchant_id, $status, $term)
    {
        $message = (new AuthController)->getUserByTypeStatusAndMerchant($request, $user_type_id, $merchant_id, $status, $term);
        return $message;
    }

    /**
     * Redirect the user to the google authentication page.
     *
     * @return \Illuminate\Http\Response
     */
     protected function redirectToGoogleProvider()
     {
        $message = (new AuthController)->redirectToGoogleProvider();
        return $message;
     }

     /**
     * Obtain the user information from twitter.
     *
     * @return \Illuminate\Http\Response
     */
    protected function handleProviderGoogleCallback()
    {
        $message = (new AuthController)->handleProviderGoogleCallback();
        return $message;
    }

    /**
     * changePassword change user password
    * @param  mixed $request
    * @param  mixed $id user id
    *
    * @return \Illuminate\Http\Response success or error message
    */
    protected function changePassword(Request $request, $id)
    {
        $message = (new AuthController)->changePassword($request, $id);
        return $message;
    }

    /**
     * Business logics 
     * getClientFormsByStatusAndMerchant get all forms by status: processed, in_process, submitted for a merchant
     *
     * @param  \Illuminate\Http\Request  $request
     * @param $id of the merchant
     * @param $status search status
     * @param $term search term
     * @return void\Illuminate\Http\Response all details of form
     * 
     */
     public function getClientFormsByStatusAndMerchant(Request $request, $term, $status, $id)
     {
        $message = (new ClientController)->getClientFormsByStatusAndMerchant($request, $term, $status, $id);
        return $message;
     }

     /**
     * findClientFormsByMerchantName get all forms by status: processed, in_process, submitted for a client based on a merchant 
     *
     * @param  \Illuminate\Http\Request  $request
     * @param $id of the client
     * @param $status search status
     * @param $term search term
       * @param $status status of submitted forms to be searched, ie. on the processed forms window, search should be on only processed forms and not all submitted forms
     * @return void\Illuminate\Http\Response all details of form
     * 
     */
     public function findClientFormsByMerchantName(Request $request, $term, $status, $id)
     {
        $message = (new ClientController)->findClientFormsByMerchantName($request, $term, $status, $id);
        return $message;
     }

     /**
     * createBusinessSector create a new business sector
     *
     * @param  mixed $request
     *
     * @return \Illuminate\Http\Response success or error message
     */
     public function createBusinessSector(Request $request)
     {
        $message = (new SetupController)->createBusinessSector($request);
        return $message;
     }

      /**
     * editBusinessSector edit business sector in the db
     *
     * @param  mixed $request
     *
     * @return \Illuminate\Http\Response success or error message
     */
     public function editBusinessSector(Request $request, $id)
     {
        $message = (new SetupController)->editBusinessSector($request, $id);
        return $message;
     }

     /**
     * deleteBusinessSector delete a business sector in the db
     *
     * @param  mixed $request
     *
     * @return \Illuminate\Http\Response success or error message
     */
     public function deleteBusinessSector(Request $request, $id)
     {
        $message = (new SetupController)->deleteBusinessSector($request, $id);
        return $message;
     }


     /**
     * getAllBusinessSectors get all business sectors in the db
     *
     * @param  mixed $request
     *
     * @return void\Illuminate\Http\Response all template categories data
     */
     public function getAllBusinessSectors(Request $request)
     {
        $message = (new SetupController)->getAllBusinessSectors($request);
        return $message;
     }

      /**
     * getSubmittedFormByCode get all submitted forms by merchant, status and form code 
     *
     * @param  mixed $request
     * @param  mixed $status stautus of submitted forms to sort by
     * @param  mixed $id id of merchant for the submitted forms
     * @param  mixed $code form code
     * @return void\Illuminate\Http\Response all details of submitted form
     */
     public function getSubmittedFormByFormCode(Request $request, $status, $id, $code)
     {
        $message = (new ExecutiveController)->getSubmittedFormByFormCode($request, $status, $id, $code);
        return $message;  
     }

    /**
     * getRecentForms get the top 10 recently submitted forms 
     * @return void\Illuminate\Http\Response all details of a form
     */
     protected function getRecentForms(Request $request){
        $message = (new FormsController)->getRecentForms($request);
        return $message;
    }

    /**
     * generateSubCode generate unique submission code for a submitted form
     * @return void\Illuminate\Http\Response submission code
     * 
     */
     public function generateSubCode()
     {
        $message = (new ClientController)->generateSubCode();
        return $message;
     }

     
     /**
     * reportAbuse merchant report client abuse
     *
     * @param  mixed $request
     *
     * @return \Illuminate\Http\Response success or error message
     */
     public function reportAbuse(Request $request)
     {
        $message = (new SetupController)->reportAbuse($request);
        return $message;
     }

     /**
     * getAllAbuseReports get all abuse reports in the db
     *
     * @param  mixed $request
     *
     * @return void\Illuminate\Http\Response all abuse reports 
     */
     public function getAllAbuseReports(Request $request)
     {
        $message = (new SetupController)->getAllAbuseReports($request);
        return $message;
     }


     /**
     * getAbuseReportsByStatus get all abuse reports in the db by status
     * 0 id report is not addressed and 1 if report is addressed
     *
     * @param  mixed $request
     *
     * @return void\Illuminate\Http\Response all abuse reports matching the selected status
     */
     public function getAbuseReportsByStatus(Request $request, $status)
     {
        $message = (new SetupController)->getAbuseReportsByStatus($request, $status);
        return $message;
     }

       /**
     * addressAbuseReport address an abuse report
     * change abuse report status from 0 to 1
     * @param  mixed $request
     *
     * @return \Illuminate\Http\Response success or error message
     */
     public function addressAbuseReport(Request $request, $id)
     {
        $message = (new SetupController)->addressAbuseReport($request, $id);
        return $message;
     }

     /**
     * getAbuseReportDetails get details of an abuse report
     * @param  mixed $request
     * @param  mixed $id id of the abuse report being viewed
     *
     * @return void\Illuminate\Http\Response all abuse reports matching the selected status
     */
     public function getAbuseReportDetails(Request $request, $id)
     {
        $message = (new SetupController)->getAbuseReportDetails($request, $id);
        return $message; 
     }

     /**
     * reverseSubmittedForm reverse a submitted form
     * @return void\Illuminate\Http\Response error or success message
     * 
     */
    public function reverseSubmittedForm()
    {
        $message = (new ClientController)->reverseSubmittedForm();
        return $message;
    }


}    
