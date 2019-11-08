<?php

namespace App\Http\Controllers;
use Illuminate\Support\Carbon;
use DB;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Http\Request;

class ExecutiveController extends Controller
{
    
    /**
     * getNumAllFormsByMerchant get number of all forms (except deleted forms)
     * for a particular merchant
     *
     * @param  mixed $request
     * @param  mixed $id id of the merchant
     *
     * @return void\Illuminate\Http\Response number of form
     */
    public function getNumAllFormsByMerchant(Request $request, $id){

        //get all registered companies 
        $getnumforms = DB::table('forms')
         ->where('forms.merchant_id', $id)
        ->where('forms.deleted_at', null)
        ->count();


         $response = [
            'num_forms' => $getnumforms
        ];
        return response()->json($response, 200);

    }

    /**
     * getNumAllFormsByStatusAndMerchant get number of all forms by status
     *
     * @param  mixed $request
     * @param  mixed $status form status 
     *@param  mixed $id merchant id
     * @return void\Illuminate\Http\Response number of forms
     */
    public function getNumAllFormsByStatusAndMerchant(Request $request, $status, $id){

        //get all registered companies 
        $getnumforms = DB::table('forms')
        ->where('forms.status', $status)
        ->where('forms.merchant_id', $id)
        ->count();
      
         $response = [
            'num_forms' => $getnumforms
        ];
        return response()->json($response, 200);

    }

    /**
     * getSubmittedFormByStatusAndMerchant get all submitted forms by merchant and status 
     *
     * @param  mixed $request
     * @param  mixed $status stautus of submitted forms to sort by
     * @param  mixed $id id of merchant for the submitted forms
     * @return void\Illuminate\Http\Response num of all submitted form
     */
    public function getNumSubmittedFormsByStatus(Request $request, $status, $id){

       
        $getnumforms = DB::table('submitted_forms')
        ->join('forms', 'forms.form_code', '=', 'form_id')
        ->join('merchants', 'merchants.id', '=', 'forms.merchant_id')
        ->select('submitted_forms.*','merchants.merchant_name AS merchant_name',
        'users.name', 'users.email', 'forms.name AS form_name', 'forms.form_fields')
        ->where('submitted_forms.status', $status)
        ->where('merchants.id', $id)
        ->count();
    

         $response = [
            'num_forms' => $getnumforms
        ];
        return response()->json($response, 200);

    }


    /**
     * getNumBranchProcessedFormsByStatus get all procssed forms at a branch and status 
     *
     * @param  mixed $request
     * @param  mixed $status stautus of submitted forms to sort by
     * @param  mixed $id id of branch the submitted forms were processed
     * @return void\Illuminate\Http\Response num of all processed submitted form
     */
    public function getNumBranchProcessedFormsByStatus(Request $request, $status, $id){

       
        $getnumforms = DB::table('submitted_forms')
        ->join('users', 'users.id', '=', 'processed_by')
        ->select('submitted_forms.*','merchants.merchant_name AS merchant_name',
        'users.name', 'users.email', 'forms.name AS form_name', 'forms.form_fields')
        ->where('submitted_forms.status', $status)
        ->where('users.branch_id', $id)
        ->count();
    

         $response = [
            'num_forms' => $getnumforms
        ];
        return response()->json($response, 200);

    }



}
