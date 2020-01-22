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

        $message = (new SetupController)->getNumMerc