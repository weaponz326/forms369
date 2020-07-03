<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

use Illuminate\Support\Facades\Crypt;

use DB;
use URL;
use Illuminate\Pagination\Paginator;
use App\Notifications\FormUrl;
use Illuminate\Support\Facades\Log;
class FormsController extends Controller
{
    
    /**
     * Store a newly created form in the database
     *
     * @param  \Illuminate\Http\Request  $request
     * @return void\Illuminate\Http\Response success or error message
     */
    public function storeForm(Request $request)
    {

        $this->validate($request, [
            'form_fields' => 'required',
            'name' => 'required',
            'merchant_id' => 'required',
            'form_code' => 'required|unique:forms',
            'status' => 'required'
        ]); 
       

        //request all data on submit
        $formfields = Crypt::encryptString(json_encode($request->form_fields));
        $branch_id = $request->branch_id;
        $merchant_id = $request->merchant_id;
        $form_code = $request->form_code;
        $status = $request->status;
        $join_queue = $request->$join_queue;
        $require_signature = $request->require_signature;

        if($request->has('can_view'))
        {
            $can_view = $request->can_view;

        }else{
            $can_view =0;
        }
        
        $name = Crypt::encryptString($request->name);

        $created_at = now();

        //get user creating the new merchant
        $user = $request->user();
        $userid = $user['id'];

        //save new merchant in the database
        try {
            $id = DB::table('forms')->insertGetId(
                [
                    'form_code' => $form_code, 
                    'name' => $name,
                    'form_fields' => $formfields,
                    'status' => $status, 
                    'merchant_id' => $merchant_id,
                    'created_by' => $userid, 
                    'created_at' => $created_at,
                    'temps' => $request->name,
                    'can_view' => $can_view,
                    'join_queue' => $join_queue,
                    'require_siganature' => $require_signature
                ]
            );
            $title = $request->name;
            //sign form url 
            $signedurl = URL::signedRoute('getFormViaLink', ['form_id' => $form_code]);
            try {
                DB::table('forms')
                ->where('form_code',$form_code)
                ->update(
                    [
                        'form_link' => $signedurl
                    ]
                );

                //get the loggedin user 
                $user = $request->user();
                $user->notify(new FormUrl($id, $signedurl, $title, $form_code));

            }catch(Exception $e) {
               //nothing
            }     

            Log::channel('mysql')->info('User with id: ' . $userid .' successsfully created a form with id: '. $id);
            $message = 'Ok';

        }catch(Exception $e) {
            Log::channel('mysql')->error('User with id: ' . $userid .' unsuccesssfully created a form with id: '. $id);
            $message = "Failed";
        } 
            
        return response()->json([
            'message' => $message
        ]);
    }


    /**
     * editForm edit a form in the database
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Illuminate\Http\Request  $code code of the form to be editted 
     * @return void\Illuminate\Http\Response success or error message
     */
    public function editForm(Request $request, $code)
    {

        $this->validate($request, [
            'form_fields' => 'required',
            'name' => 'required',
            'merchant_id' => 'required',
            'form_code' => 'required',
            'status' => 'required'
        ]); 
       

        //request all data on submit
        $formfields = Crypt::encryptString(json_encode($request->form_fields));
        $branch_id = $request->branch_id;
        $merchant_id = $request->merchant_id;
        $form_code = $request->form_code;
        $status = $request->status;
        $join_queue = $request->join_queue;
        $require_signature = $request->require_signature;
        if($request->has('can_view'))
        {
            $can_view = $request->can_view;

        }else{
            $can_view =0;
        }
        $name = Crypt::encryptString($request->name);

        $updated_at = now();

        //get user creating the new merchant
        $user = $request->user();
        $userid = $user['id'];

        //save new merchant in the database
        try {
            DB::table('forms')
            ->where('form_code', $form_code)
            ->update(
                [
                    'form_code' => $form_code, 
                    'name' => $name,
                    'form_fields' => $formfields,
                    'status' => $status, 
                    'merchant_id' => $merchant_id,
                    'updated_by' => $userid, 
                    'updated_at' => $updated_at,
                    'temps' => $request->name,
                    'can_view' => $can_view,
                    'join_queue' => $join_queue,
                    'require_signature' => $require_signature
                ]
            );

            $message = 'Ok';
            Log::channel('mysql')->info('User with id: ' . $userid .' successsfully editted a form with code: '. $code);
        }catch(Exception $e) {
            Log::channel('mysql')->error('User with id: ' . $userid .' unsuccesssfully editted a form with code: '. $code);
            $message = "Failed";
        } 
            
        return response()->json([
            'message' => $message
        ]);
    }


     /**
     * changeFormStatus chnage the status of a form in the database
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Illuminate\Http\Request  $code code of the form to be editted 
     * @param  \Illuminate\Http\Request  $status new status of the form 
     * @return void\Illuminate\Http\Response success or error message
     */
    public function changeFormStatus(Request $request, $code, $status)
    {

        $updated_at = now();

        //get user creating the new merchant
        $user = $request->user();
        $userid = $user['id'];

        //save new merchant in the database
        try {
            DB::table('forms')
            ->where('form_code', $code)
            ->update(
                [
                    'status' => $status, 
                    'updated_by' => $userid, 
                    'updated_at' => $updated_at
                ]
            );

            $message = 'Ok';
            Log::channel('mysql')->info('User with id: ' . $userid .' successsfully changed a form with code: '. $code. ' status to '. $status );

        }catch(Exception $e) {
            $message = "Failed";
        } 
            Log::channel('mysql')->error('User with id: ' . $userid .' successsfully changed a form with code: '. $code. ' status to '. $status );
            return response()->json([
                'message' => $message
            ]);
    }

    
    /**
     * deleteForm deleted or archive a form
     *
     * @param  \Illuminate\Http\Request  $request
     * @param $code code of the form to be deleted 
     *
     * @return void\Illuminate\Http\Response success or error message
     */
    public function deleteForm(Request $request, $code)
    {
        //get user creating the new merchant
        $user = $request->user();
        $userid = $user['id'];

        try {

            //get form to be deleted
            $form = DB::table('forms')->where('form_code', '=', $code)->first();
            $data= json_decode( json_encode($form), true);

            //insert deleted form in the forms_deleted table
            $deletedform = DB::table('forms_deleted')->insert($data);

            DB::table('forms')->where('form_code', '=', $code)->delete();
            $response = [
                'message' => 'Ok'
            ];

            $message = 'Ok';
            Log::channel('mysql')->info('User with id: ' . $userid .' successsfully deleted a form with code: '. $code);

        }catch(Exception $e) {
            Log::channel('mysql')->error('User with id: ' . $userid .' unsuccesssfully deleted a form with code: '. $code);
            $message = "Failed";
        } 
            
        return response()->json([
            'message' => $message
        ]);
    }

     /**
     * recoverForm recover a form that was initially deleted
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Illuminate\Http\Request  $code code of the form to be recovered 
     *
     * @return void\Illuminate\Http\Response success or error message
     */
     public function recoverForm(Request $request, $code)
     {
 
         //get user creating the new merchant
        $user = $request->user();
        $userid = $user['id'];

        try {

            //get form to be deleted
            $form = DB::table('forms_deleted')->where('form_code', '=', $code)->first();
            $data= json_decode( json_encode($form), true);

            //insert deleted form in the forms_deleted table
            $deletedform = DB::table('forms')->insert($data);

            DB::table('forms_deleted')->where('form_code', '=', $code)->delete();
            $response = [
                'message' => 'Ok'
            ];

            $message = 'Ok';
            Log::channel('mysql')->info('User with id: ' . $userid .' successsfully recovered a form with code: '. $code);

        }catch(Exception $e) {
            Log::channel('mysql')->error('User with id: ' . $userid .' unsuccesssfully recovered a form with code: '. $code);
            $message = "Failed";
        } 
            
        return response()->json([
            'message' => $message
        ]);
     }
  
     /**
     * getAllDeletedFormsByMerchant get all deleted forms for a particular merchant
     *
     * @param  mixed $request
     * @param  mixed $id id of the merchant
     *
     * @return void\Illuminate\Http\Response all details of a form
     */
    public function getAllDeletedFormsByMerchant(Request $request, $id){

        //get all registered companies 
        $getforms = DB::table('forms_deleted')
        ->join('merchants', 'merchants.id', '=', 'merchant_id')
        ->leftjoin('uploads', 'forms_deleted.form_code', '=', 'uploads.form_code')
        ->select('forms_deleted.*','merchants.merchant_name AS merchant_name', 'merchants.nickname','merchants.can_print', 'uploads.url')
        ->where('forms_deleted.merchant_id', $id)
        ->where('forms_deleted.deleted_at', null)
        ->paginate(15);
      
        //clean data
        $formdata = [];

        $getforms->transform(function($items){
            $formdata['form_code'] = $items->form_code;
            $formdata['name'] = Crypt::decryptString($items->name);
            $formdata['status'] = $items->status;
            $formdata['form_fields'] = json_decode(Crypt::decryptString($items->form_fields));
            $formdata['merchant_id'] = $items->merchant_id;
            $formdata['merchant_name'] = Crypt::decryptString($items->merchant_name);
            $formdata['nickname'] = $items->nickname;
            $formdata['can_print'] = $items->can_print;
            $formdata['can_view'] = $items->can_view;
            $formdata['join_queue'] = $items->join_queue;
            $formdata['require_signature'] = $items->require_signature;
            $formdata['file_url'] = $items->url;
            $formdata['created_by'] = $items->created_by;
            $formdata['created_at'] = $items->created_at;
            $formdata['updated_at'] = $items->updated_at;
            $formdata['updated_by'] = $items->updated_by;

            return $formdata;
         });
         
         $response = [
            'forms' => $getforms
        ];
        return response()->json($response, 200);

    }


     /**
     * getFormDetails get all details of a form
     *
     * @param  mixed $request
     * @param  mixed $code form code 
     *
     * @return void\Illuminate\Http\Response all details of a form
     */
    public function getFormDetails(Request $request, $code){

        //get all registered companies 
        $getform = DB::table('forms')
        ->join('merchants', 'merchants.id', '=', 'merchant_id')
        ->leftjoin('uploads', 'forms.form_code', '=', 'uploads.form_code')
        ->select('forms.*','merchants.merchant_name AS merchant_name', 'merchants.nickname','merchants.can_print', 'uploads.url', 'logo')
        ->where('forms.form_code', $code)
        ->get();
      
        //clean data
        $formdata = [];

        $form = $getform->map(function($items){
            $formdata['form_code'] = $items->form_code;
            $formdata['name'] = Crypt::decryptString($items->name);
            $formdata['status'] = $items->status;
            $formdata['form_fields'] = json_decode(Crypt::decryptString($items->form_fields));
            $formdata['merchant_id'] = $items->merchant_id;
            $formdata['merchant_name'] = Crypt::decryptString($items->merchant_name);
            $formdata['nickname'] = $items->nickname;
            $formdata['can_print'] = $items->can_print;
            $formdata['can_view'] = $items->can_view;
            $formdata['join_queue'] = $items->join_queue;
            $formdata['require_signature'] = $items->require_signature;
            $formdata['file_url'] = $items->url;
            $formdata['logo'] = $items->logo;
            $formdata['created_by'] = $items->created_by;
            $formdata['created_at'] = $items->created_at;
            $formdata['updated_at'] = $items->updated_at;
            $formdata['updated_by'] = $items->updated_by;

            return $formdata;
         });

         $response = [
            'form' => $form
        ];
        return response()->json($response, 200);

    }

    /**
     * getFormbyName search for a form by the name of the form
     *
     * @param  mixed $request
     * @param  mixed search term
     * @param mixed $country county to search and pick form from
     *
     * @return void\Illuminate\Http\Response all details of a form
     */
    public function getFormbyName(Request $request, $term, $country, $sector){

        if ($sector == 0) {
            //get all registered companies 
            $getform = DB::table('forms')
            ->join('merchants', 'merchants.id', '=', 'merchant_id')
            ->leftjoin('uploads', 'forms.form_code', '=', 'uploads.form_code')
            ->select('forms.*','merchants.merchant_name AS merchant_name', 'merchants.nickname','merchants.can_print', 'uploads.url', 'logo')
            ->where([
                ['forms.temps', 'like', '%'.$term .'%'],
                ['forms.status','=',1],
                ['merchants.country', '=', $country]
            ])
            ->get();
        }else{
            //get all registered companies 
            $getform = DB::table('forms')
            ->join('merchants', 'merchants.id', '=', 'merchant_id')
            ->leftjoin('uploads', 'forms.form_code', '=', 'uploads.form_code')
            ->select('forms.*','merchants.merchant_name AS merchant_name','merchants.nickname','merchants.can_print', 'uploads.url')
            ->where([
                ['forms.temps', 'like', '%'.$term .'%'],
                ['forms.status','=',1],
                ['merchants.country', '=', $country],
                ['sector_id', $sector]
            ])
            ->get();
        }
        
      
        //clean data
        $formdata = [];

        $form = $getform->map(function($items){
            $formdata['form_code'] = $items->form_code;
            $formdata['name'] = Crypt::decryptString($items->name);
            $formdata['status'] = $items->status;
            $formdata['form_fields'] = json_decode(Crypt::decryptString($items->form_fields));
            $formdata['merchant_id'] = $items->merchant_id;
            $formdata['merchant_name'] = Crypt::decryptString($items->merchant_name);
            $formdata['nickname'] = $items->nickname;
            $formdata['can_print'] = $items->can_print;
            $formdata['can_view'] = $items->can_view;
            $formdata['join_queue'] = $items->join_queue;
            $formdata['require_signature'] = $items->require_signature;
            $formdata['file_url'] = $items->url;
            $formdata['logo'] = $items->logo;
            $formdata['created_by'] = $items->created_by;
            $formdata['created_at'] = $items->created_at;
            $formdata['updated_at'] = $items->updated_at;
            $formdata['updated_by'] = $items->updated_by;

            return $formdata;
         });

         $response = [
            'form' => $form
        ];
        return response()->json($response, 200);

    }


    /**
     * getAllForms get all forms in the database
     *
     * @param  mixed $request
     *
     * @return void\Illuminate\Http\Response all forms
     */
    public function getAllForms(Request $request){

        //get all registered companies 
        $getforms = DB::table('forms')
        ->join('merchants', 'merchants.id', '=', 'merchant_id')
        ->leftjoin('uploads', 'forms.form_code', '=', 'uploads.form_code')
        ->select('forms.*','merchants.merchant_name AS merchant_name','merchants.nickname','merchants.can_print', 'merchants.colors', 'uploads.url')
        ->where('merchants.status', 1)
        ->where('forms.deleted_at', null)
        ->paginate(15);
      
        //clean data
        $formdata = [];

        $getforms->transform(function($items){
            $formdata['form_code'] = $items->form_code;
            $formdata['name'] = Crypt::decryptString($items->name);
            $formdata['status'] = $items->status;
            $formdata['form_fields'] = json_decode(Crypt::decryptString($items->form_fields));
            $formdata['merchant_id'] = $items->merchant_id;
            $formdata['merchant_name'] = Crypt::decryptString($items->merchant_name);
            $formdata['nickname'] = $items->nickname;
            $formdata['can_print'] = $items->can_print;
            $formdata['can_view'] = $items->can_view;
            $formdata['join_queue'] = $items->join_queue;
            $formdata['require_signature'] = $items->require_signature;
            $formdata['colors'] = $items->colors;
            $formdata['file_url'] = $items->url;
            $formdata['created_by'] = $items->created_by;
            $formdata['created_at'] = $items->created_at;
            $formdata['updated_at'] = $items->updated_at;
            $formdata['updated_by'] = $items->updated_by;

            return $formdata;
         });


         $response = [
            'forms' => $getforms
        ];
        return response()->json($response, 200);
    }


    /**
     * getNumAllForms get num of all form
     *
     * @param  mixed $request
     *
     * @return void\Illuminate\Http\Response count of all forms
     */
    public function getNumAllForms(Request $request){

        //get all registered companies 
        $getnumforms = DB::table('forms')
        ->join('merchants', 'merchants.id', '=', 'merchant_id')
        ->select('forms.*','merchants.merchant_name AS merchant_name')
        ->where('merchants.status', 1)
        ->where('forms.deleted_at', null)
        ->count();
      
        $response = [
            'num_forms' => $getnumforms
        ];
        return response()->json($response, 200);

    }

    /**
     * getAllFormsByStatus get all details of all forms by status
     *
     * @param  mixed $request
     * @param  mixed $status form status 
     *
     * @return void\Illuminate\Http\Response all forms under a particular status
     */
    public function getAllFormsByStatus(Request $request, $status){

        //get all registered companies 
        $getforms = DB::table('forms')
        ->join('merchants', 'merchants.id', '=', 'merchant_id')
        ->leftjoin('uploads', 'forms.form_code', '=', 'uploads.form_code')
        ->select('forms.*','merchants.merchant_name AS merchant_name', 'merchants.nickname','merchants.can_print', 'merchants.colors', 'uploads.url')
        ->where('forms.status', $status)
        ->where('merchants.status', 1)
        ->where('forms.deleted_at', null)
        ->paginate(15);
      
        //clean data
        $formdata = [];

        $getforms->transform(function($items){
            $formdata['form_code'] = $items->form_code;
            $formdata['name'] = Crypt::decryptString($items->name);
            $formdata['status'] = $items->status;
            $formdata['form_fields'] = json_decode(Crypt::decryptString($items->form_fields));
            $formdata['merchant_id'] = $items->merchant_id;
            $formdata['merchant_name'] = Crypt::decryptString($items->merchant_name);
            $formdata['nickname'] = $items->nickname;
            $formdata['can_print'] = $items->can_print;
            $formdata['can_view'] = $items->can_view;
            $formdata['join_queue'] = $items->join_queue;
            $formdata['require_signature'] = $items->require_signature;
            $formdata['file_url'] = $items->url;
            $formdata['colors'] = $items->colors;
            $formdata['created_by'] = $items->created_by;
            $formdata['created_at'] = $items->created_at;
            $formdata['updated_at'] = $items->updated_at;
            $formdata['updated_by'] = $items->updated_by;

            return $formdata;
         });
        
         $response = [
            'forms' => $getforms
        ];
        return response()->json($response, 200);

    }

    /**
     * getAllFormsByMerchant get all forms for a particular merchant
     *
     * @param  mixed $request
     * @param  mixed $id id of the merchant
     *
     * @return void\Illuminate\Http\Response all details of a form
     */
    public function getAllFormsByMerchant(Request $request, $id){

        //get all registered companies 
        $getforms = DB::table('forms')
        ->join('merchants', 'merchants.id', '=', 'merchant_id')
        ->leftjoin('uploads', 'forms.form_code', '=', 'uploads.form_code')
        ->select('forms.*','merchants.merchant_name AS merchant_name', 'merchants.nickname','merchants.can_print', 'merchants.colors', 'logo', 'uploads.url')
        ->where('forms.merchant_id', $id)
        ->where('forms.deleted_at', null)
        ->where('forms.status', 1)
        ->paginate(15);
      
        //clean data
        $formdata = [];

        $getforms->transform(function($items){
            $formdata['form_code'] = $items->form_code;
            $formdata['name'] = Crypt::decryptString($items->name);
            $formdata['status'] = $items->status;
            $formdata['form_fields'] = json_decode(Crypt::decryptString($items->form_fields));
            $formdata['merchant_id'] = $items->merchant_id;
            $formdata['merchant_name'] = Crypt::decryptString($items->merchant_name);
            $formdata['nickname'] = $items->nickname;
            $formdata['can_print'] = $items->can_print;
            $formdata['can_view'] = $items->can_view;
            $formdata['join_queue'] = $items->join_queue;
            $formdata['require_signature'] = $items->require_signature;
            $formdata['file_url'] = $items->url;
            $formdata['colors'] = $items->colors;
            $formdata['logo'] = $items->logo;
            $formdata['created_by'] = $items->created_by;
            $formdata['created_at'] = $items->created_at;
            $formdata['updated_at'] = $items->updated_at;
            $formdata['updated_by'] = $items->updated_by;

            return $formdata;
         });
         
         $response = [
            'forms' => $getforms
        ];
        return response()->json($response, 200);

    }

    /**
     * non paginated 
     * getAllFormsByMerchant get all forms for a particular merchant
     *
     * @param  mixed $request
     * @param  mixed $id id of the merchant
     *
     * @return void\Illuminate\Http\Response all details of a form
     */
    public function getAllFormsByMerchantApp(Request $request, $id){

        //get all registered companies 
        $getforms = DB::table('forms')
        ->join('merchants', 'merchants.id', '=', 'merchant_id')
        ->leftjoin('uploads', 'forms.form_code', '=', 'uploads.form_code')
        ->select('forms.*','merchants.merchant_name AS merchant_name', 'merchants.nickname','merchants.can_print', 'merchants.colors', 'logo', 'uploads.url')
        ->where('forms.merchant_id', $id)
        ->where('forms.deleted_at', null)
        ->where('forms.status', 1)
        ->get();
      
        //clean data
        $formdata = [];

        $getforms->transform(function($items){
            $formdata['form_code'] = $items->form_code;
            $formdata['name'] = Crypt::decryptString($items->name);
            $formdata['status'] = $items->status;
            $formdata['form_fields'] = json_decode(Crypt::decryptString($items->form_fields));
            $formdata['merchant_id'] = $items->merchant_id;
            $formdata['merchant_name'] = Crypt::decryptString($items->merchant_name);
            $formdata['nickname'] = $items->nickname;
            $formdata['can_print'] = $items->can_print;
            $formdata['can_view'] = $items->can_view;
            $formdata['join_queue'] = $items->join_queue;
            $formdata['require_signature'] = $items->require_signature;
            $formdata['file_url'] = $items->url;
            $formdata['colors'] = $items->colors;
            $formdata['logo'] = $items->logo;
            $formdata['created_by'] = $items->created_by;
            $formdata['created_at'] = $items->created_at;
            $formdata['updated_at'] = $items->updated_at;
            $formdata['updated_by'] = $items->updated_by;

            return $formdata;
         });
         
         $response = [
            'forms' => $getforms
        ];
        return response()->json($response, 200);

    }

    /**
     * getAllFormsByStatusAndMerchant get all details of all forms by status and merchant
     *
     * @param  mixed $request
     * @param  mixed $status form status 
     *@param  mixed $id merchant id
     * @return void\Illuminate\Http\Response all details of forms
     */
    public function getAllFormsByStatusAndMerchant(Request $request, $status, $id){

        //get all registered companies 
        $getforms = DB::table('forms')
        ->join('merchants', 'merchants.id', '=', 'merchant_id')
        ->leftjoin('uploads', 'forms.form_code', '=', 'uploads.form_code')
        ->select('forms.*','merchants.merchant_name AS merchant_name', 'merchants.nickname','merchants.can_print', 'merchants.colors', 'merchants.logo', 'uploads.url')
        ->where('forms.status', $status)
        ->where('forms.merchant_id', $id)
        ->where('forms.deleted_at', null)
        ->paginate(15);
      
        //clean data
        $formdata = [];

        $getforms->transform(function($items){
            $formdata['form_code'] = $items->form_code;
            $formdata['name'] = Crypt::decryptString($items->name);
            $formdata['status'] = $items->status;
            $formdata['form_fields'] = json_decode(Crypt::decryptString($items->form_fields));
            $formdata['merchant_id'] = $items->merchant_id;
            $formdata['merchant_name'] = Crypt::decryptString($items->merchant_name);
            $formdata['nickname'] = $items->nickname;
            $formdata['can_print'] = $items->can_print;
            $formdata['can_view'] = $items->can_view;
            $formdata['join_queue'] = $items->join_queue;
            $formdata['require_signature'] = $items->require_signature;
            $formdata['file_url'] = $items->url;
            $formdata['colors'] = $items->colors;
            $formdata['logo'] = $items->logo;
            $formdata['created_by'] = $items->created_by;
            $formdata['created_at'] = $items->created_at;
            $formdata['updated_at'] = $items->updated_at;
            $formdata['updated_by'] = $items->updated_by;

            return $formdata;
         });
         
         $response = [
            'forms' => $getforms
        ];
        return response()->json($response, 200);

    }

    
    /**
     * createSection create a form section
     * During form creation, a user can drag and drop form section and all fields for this section will be added 
     * @param  \Illuminate\Http\Request  $request
     * @return void\Illuminate\Http\Response success or error message
     */
    public function createSection(Request $request)
    {

        $this->validate($request, [
            'form_fields' => 'required',
            'heading' => 'required'
        ]); 
       

        //request all data on submit
        $formfields = Crypt::encryptString(json_encode($request->form_fields));
        $heading = Crypt::encryptString($request->heading);

        $created_at = now();

        //get user creating the new merchant
        $user = $request->user();
        $userid = $user['id'];

        //save new section in the database
        try {
            DB::table('sections')->insert(
                [
                    'heading' => $heading,
                    'form_fields' => $formfields,
                    'created_by' => $userid, 
                    'created_at' => $created_at,
                    'temps' => $request->heading
                ]
            );

            $message = 'Ok';
            Log::channel('mysql')->info('User with id: ' . $userid .' successsfully created a form section');

        }catch(Exception $e) {
            Log::channel('mysql')->error('User with id: ' . $userid .' unsuccesssfully created a form section');
            $message = "Failed";
        } 
            
        return response()->json([
            'message' => $message
        ]);
    }

    /**
     * editSection Edit form fields or heading of a section
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Illuminate\Http\Request  $id of the section to be editted 
     * @return void\Illuminate\Http\Response success or error message
     */
    public function editSection(Request $request, $id)
    {

        $this->validate($request, [
            'form_fields' => 'required',
            'heading' => 'required'
        ]); 
       

         //request all data on submit
         $formfields = Crypt::encryptString(json_encode($request->form_fields));
         $heading = Crypt::encryptString($request->heading);

        $updated_at = now();

        //get user creating the new template
        $user = $request->user();
        $userid = $user['id'];

        //edit section in the database
        try {
            DB::table('sections')
            ->where('id', $id)
            ->update(
                [
                    'heading' => $heading,
                    'form_fields' => $formfields,
                    'updated_by' => $userid, 
                    'updated_at' => $updated_at,
                    'temps' => $request->heading
                ]
            );

            $message = 'Ok';
            Log::channel('mysql')->info('User with id: ' . $userid .' successsfully editted a form section');

        }catch(Exception $e) {
            Log::channel('mysql')->error('User with id: ' . $userid .' unsuccesssfully editted a form section');
            $message = "Failed";
        } 
            
        return response()->json([
            'message' => $message
        ]);
    }

    /**
     * getAllSections get all available sections in the database
     *
     * @param  mixed $request
     *
     * @return void\Illuminate\Http\Response all details of sections
     */
    public function getAllSections(Request $request){

        //get all sections
        $getsections = DB::table('sections')
        ->get();
      
        //clean data
        $sectionsdata = [];

        $sections = $getsections->map(function($items){
            $sectionsdata['id'] = $items->id;
            $sectionsdata['heading'] = Crypt::decryptString($items->heading);
            $sectionsdata['form_fields'] = json_decode(Crypt::decryptString($items->form_fields));
            $sectionsdata['created_by'] = $items->created_by;
            $sectionsdata['created_at'] = $items->created_at;
            $sectionsdata['updated_at'] = $items->updated_at;
            $sectionsdata['updated_by'] = $items->updated_by;

            return $sectionsdata;
         });

         $response = [
            'sections' => $sections
        ];
        return response()->json($response, 200);

    }

     /*
     *deleteSection deletes a section from teh database 
     * @param  \Illuminate\Http\Request  $request
     * @param  \Illuminate\Http\Request  $id of the template to be deleted 
     * @return void\Illuminate\Http\Response success or error message
     */
    public function deleteSection(Request $request, $id)
    {
        //get user creating the new merchant
        $user = $request->user();
        $userid = $user['id'];

        //delete a template 
        try {
            DB::table('sections')
            ->where('id', $id)
            ->delete();

            $message = 'Ok';
            Log::channel('mysql')->info('User with id: ' . $userid .' successsfully deleted a form section');

        }catch(Exception $e) {
            Log::channel('mysql')->error('User with id: ' . $userid .' unsuccesssfully deleted a form section');

            $message = "Failed";
        } 
            
        return response()->json([
            'message' => $message
        ]);
    }

     /**
     * searchSectionByHeading search for a section by the heading name in the database 
     *
     * @param  mixed $request
     * @param  mixed $term ;  user serach term
     * @return void\Illuminate\Http\Response all details of sections matching the search term
     */
    public function searchSectionByHeading(Request $request, $term){

        //get all registered companies 
        $getsections = DB::table('sections')
        ->select('sections.*')
        ->where('temps', 'like', '%'.$term.'%')
        ->get();
      
        //clean data
        $sectionsdata = [];

        $sections = $getsections->map(function($items){
            $sectionsdata['id'] = $items->id;
            $sectionsdata['heading'] = Crypt::decryptString($items->heading);
            $sectionsdata['form_fields'] = json_decode(Crypt::decryptString($items->form_fields));
            $sectionsdata['created_by'] = $items->created_by;
            $sectionsdata['created_at'] = $items->created_at;
            $sectionsdata['updated_at'] = $items->updated_at;
            $sectionsdata['updated_by'] = $items->updated_by;

            return $sectionsdata;

         });
         $response = [
            'sections' => $sections
        ];
        return response()->json($response, 200);

    }

    /**
     * getFormViaLink get all details of a form via the shared form link
     *
     * @param  mixed $request
     * @param  mixed $code form code 
     *
     * @return void\Illuminate\Http\Response all details of a form
     */
    public function getFormViaLink(Request $request, $code){

        //get all registered companies 
        // $getform = DB::table('forms')
        // ->join('merchants', 'merchants.id', '=', 'merchant_id')
        // ->select('forms.*','merchants.merchant_name AS merchant_name')
        // ->where('form_code', $code)
        // ->get();
      
        // //clean data
        // $formdata = [];

        // $form = $getform->map(function($items){
        //     $formdata['form_code'] = $items->form_code;
        //     $formdata['name'] = Crypt::decryptString($items->name);
        //     $formdata['status'] = $items->status;
        //     $formdata['form_fields'] = json_decode(Crypt::decryptString($items->form_fields));
        //     $formdata['merchant_id'] = $items->merchant_id;
        //     $formdata['merchant_name'] = Crypt::decryptString($items->merchant_name);
        //     $formdata['created_by'] = $items->created_by;
        //     $formdata['created_at'] = $items->created_at;
        //     $formdata['updated_at'] = $items->updated_at;
        //     $formdata['updated_by'] = $items->updated_by;

        //     return $formdata;
        //  });

        //  $response = [
        //     'form' => $form
        // ];
        // return response()->json($response, 200);
        // echo "<script>window.sessionStorage.setItem('code', '.$code.');</script>";
        // return redirect()->route('form_link');
        return redirect()->route('form_link', ['id' => $code]);
    }

    /**
     * getFormbyNameStatusAndMerchant get form for a merchant based on a search term in a particular status category 
     *
     * @param  mixed $request
     * @param  mixed $term search term
     * @param  mixed $merchant_id id of the merchant that the forms belong to
     * @param  mixed $status search for a form based on a particular status
     * @return void\Illuminate\Http\Response all details of a form
     */
    public function getFormbyNameStatusAndMerchant(Request $request, $term, $status, $merchant_id){

        //get all registered companies 
        $getform = DB::table('forms')
        ->join('merchants', 'merchants.id', '=', 'merchant_id')
        ->leftjoin('uploads', 'forms.form_code', '=', 'uploads.form_code')
        ->select('forms.*','merchants.merchant_name AS merchant_name', 'merchants.nickname','merchants.can_print', 'merchants.colors', 'uploads.url')
        ->where([
            ['forms.temps', 'like', '%'.$term .'%'],
            ['forms.status','=',$status],
            ['forms.merchant_id','=',$merchant_id]
        ])
        ->orWhere([
            ['forms.form_code', 'like', '%'.$term .'%'],
            ['forms.status','=',$status],
            ['forms.merchant_id','=',$merchant_id]
        ])
        ->get();
      
        //clean data
        $formdata = [];

        $form = $getform->map(function($items){
            $formdata['form_code'] = $items->form_code;
            $formdata['name'] = Crypt::decryptString($items->name);
            $formdata['status'] = $items->status;
            $formdata['form_fields'] = json_decode(Crypt::decryptString($items->form_fields));
            $formdata['merchant_id'] = $items->merchant_id;
            $formdata['merchant_name'] = Crypt::decryptString($items->merchant_name);
            $formdata['nickname'] = $items->nickname;
            $formdata['can_print'] = $items->can_print;
            $formdata['can_view'] = $items->can_view;
            $formdata['join_queue'] = $items->join_queue;
            $formdata['require_signature'] = $items->require_signature;
            $formdata['file_url'] = $items->url;
            $formdata['colors'] = $items->colors;
            $formdata['created_by'] = $items->created_by;
            $formdata['created_at'] = $items->created_at;
            $formdata['updated_at'] = $items->updated_at;
            $formdata['updated_by'] = $items->updated_by;

            return $formdata;
         });

         $response = [
            'form' => $form
        ];
        return response()->json($response, 200);

    }

    /**
     * getFormbyNameAndMerchant get form for a merchant based on a search term 
     *
     * @param  mixed $request
     * @param  mixed $term search term
     * @param  mixed $merchant_id id of the merchant that the forms belong to
     * @return void\Illuminate\Http\Response all details of a form
     */
    public function getFormbyNameAndMerchant(Request $request, $term, $merchant_id){

        //get all registered companies 
        $getform = DB::table('forms')
        ->join('merchants', 'merchants.id', '=', 'merchant_id')
        ->leftjoin('uploads', 'forms.form_code', '=', 'uploads.form_code')
        ->select('forms.*','merchants.merchant_name AS merchant_name','merchants.nickname','merchants.can_print', 'merchants.colors', 'uploads.url')
        ->where([
            ['forms.temps', 'like', '%'.$term .'%'],
            ['forms.merchant_id','=',$merchant_id]
        ])
        ->orWhere([
            ['forms.form_code', 'like', '%'.$term .'%'],
            ['forms.merchant_id','=',$merchant_id]
        ])
        ->get();
      
        //clean data
        $formdata = [];

        $form = $getform->map(function($items){
            $formdata['form_code'] = $items->form_code;
            $formdata['name'] = Crypt::decryptString($items->name);
            $formdata['status'] = $items->status;
            $formdata['form_fields'] = json_decode(Crypt::decryptString($items->form_fields));
            $formdata['merchant_id'] = $items->merchant_id;
            $formdata['merchant_name'] = Crypt::decryptString($items->merchant_name);
            $formdata['nickname'] = $items->nickname;
            $formdata['can_print'] = $items->can_print;
            $formdata['can_view'] = $items->can_view;
            $formdata['join_queue'] = $items->join_queue;
            $formdata['require_signature'] = $items->require_signature;
            $formdata['file_url'] = $items->url;
            $formdata['colors'] = $items->colors;
            $formdata['created_by'] = $items->created_by;
            $formdata['created_at'] = $items->created_at;
            $formdata['updated_at'] = $items->updated_at;
            $formdata['updated_by'] = $items->updated_by;

            return $formdata;
         });

         $response = [
            'form' => $form
        ];
        return response()->json($response, 200);

    }

    /**
     * getRecentForms get the top 10 recently submitted forms 
     * @return void\Illuminate\Http\Response all details of a form
     */
     public function getRecentForms(Request $request){

        //get all registered companies 
        $getform = DB::table('forms')
        ->join('merchants', 'merchants.id', '=', 'merchant_id')
        ->leftjoin('uploads', 'forms.form_code', '=', 'uploads.form_code')
        ->join('submitted_forms', 'submitted_forms.form_id', '=', 'forms.form_code')
        ->select('forms.*','merchants.merchant_name AS merchant_name', 'merchants.nickname',
        'merchants.can_print', 'merchants.colors', 'uploads.url', 'submitted_forms.submitted_at', 'logo')
        ->where('forms.status','=',1)
        ->where('submitted_forms.status','!=',4)
        ->latest('submitted_at')
        ->take(10)
        ->get();
      
        $getform = $getform->unique('form_code')->values();
        // return $getform;
        //clean data
        $formdata = [];

        $form = $getform->map(function($items){
            $formdata['form_code'] = $items->form_code;
            $formdata['name'] = Crypt::decryptString($items->name);
            $formdata['status'] = $items->status;
            $formdata['form_fields'] = json_decode(Crypt::decryptString($items->form_fields));
            $formdata['merchant_id'] = $items->merchant_id;
            $formdata['merchant_name'] = Crypt::decryptString($items->merchant_name);
            $formdata['nickname'] = $items->nickname;
            $formdata['can_print'] = $items->can_print;
            $formdata['can_view'] = $items->can_view;
            $formdata['join_queue'] = $items->join_queue;
            $formdata['require_signature'] = $items->require_signature;
            $formdata['file_url'] = $items->url;
            $formdata['colors'] = $items->colors;
            $formdata['logo'] = $items->logo;
            $formdata['created_by'] = $items->created_by;
            $formdata['created_at'] = $items->created_at;
            $formdata['updated_at'] = $items->updated_at;
            $formdata['updated_by'] = $items->updated_by;

            return $formdata;
         });

         $response = [
            'form' => $form
        ];
        return response()->json($response, 200);

    }



}   