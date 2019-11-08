<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

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

}
