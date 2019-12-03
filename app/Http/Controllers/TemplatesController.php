<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

use Illuminate\Support\Facades\Crypt;

use DB;
use Illuminate\Pagination\Paginator;
 
class TemplatesController extends Controller
{
    
    /**
     * createTemplate create a form template for use 
     *
     * @param  \Illuminate\Http\Request  $request
     * @return void\Illuminate\Http\Response success or error message
     */
    public function createTemplate(Request $request)
    {

        $this->validate($request, [
            'form_fields' => 'required'
        ]); 
       

        //request all data on submit
        $formfields = Crypt::encryptString(json_encode($request->form_fields));
        $name = Crypt::encryptString($request->name);

        $created_at = now();

        //get user creating the new merchant
        $user = $request->user();
        $userid = $user['id'];

        //save new template in the database
        try {
            DB::table('templates')->insert(
                [
                    'name' => $name,
                    'form_fields' => $formfields,
                    'created_by' => $userid, 
                    'created_at' => $created_at,
                    'temps' => $request->name
                ]
            );

            $message = 'Ok';
            Log::channel('mysql')->info('User with id: ' . $userid .' successsfully created a new template');

        }catch(Exception $e) {
            Log::channel('mysql')->error('User with id: ' . $userid .' unsuccesssfully created a new template');
            $message = "Failed";
        } 
            
        return response()->json([
            'message' => $message
        ]);
    }


    /**
     * editTemplate edit an existing template 
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Illuminate\Http\Request  $id of the template to be editted 
     * @return void\Illuminate\Http\Response success or error message
     */
    public function editTemplate(Request $request, $id)
    {

        $this->validate($request, [
            'form_fields' => 'required'
        ]); 
       

        //request all data on submit
        $formfields = Crypt::encryptString(json_encode($request->form_fields));
        $name = Crypt::encryptString($request->name);

        $updated_at = now();

        //get user creating the new template
        $user = $request->user();
        $userid = $user['id'];

        //edit template in the database
        try {
            DB::table('templates')
            ->where('id', $id)
            ->update(
                [
                    'name' => $name,
                    'form_fields' => $formfields,
                    'updated_by' => $userid, 
                    'updated_at' => $updated_at,
                    'temps' => $request->name
                ]
            );

            $message = 'Ok';
            Log::channel('mysql')->info('User with id: ' . $userid .' successsfully editted a template with id: '. $id);

        }catch(Exception $e) {
            $message = "Failed";
            Log::channel('mysql')->error('User with id: ' . $userid .' successsfully editted a template with id: '. $id);
        } 
            
        return response()->json([
            'message' => $message
        ]);
    }


     /**
     * getAllTemplates get all available templates in the database
     *
     * @param  mixed $request
     *
     * @return void\Illuminate\Http\Response all details of templates
     */
    public function getAllTemplates(Request $request){

        //get all templates
        $gettemplates = DB::table('templates')
        ->paginate(15);
      
        //clean data
        $templatedata = [];

        $gettemplates->transform(function($items){
            $templatedata['id'] = $items->id;
            $templatedata['name'] = Crypt::decryptString($items->name);
            $templatedata['form_fields'] = json_decode(Crypt::decryptString($items->form_fields));
            $templatedata['created_by'] = $items->created_by;
            $templatedata['created_at'] = $items->created_at;
            $templatedata['updated_at'] = $items->updated_at;
            $templatedata['updated_by'] = $items->updated_by;

            return $templatedata;
         });
      
         $response = [
            'templates' => $gettemplates
        ];
        return response()->json($response, 200);

    }


    /**
     * searchTemplateByName get search for a template by the name in the database 
     *
     * @param  mixed $request
     * @param  mixed $term ;  user serach term
     * @return void\Illuminate\Http\Response all details of templates matching the search term
     */
    public function searchTemplateByName(Request $request, $term){

        //get all registered companies 
        $gettemplates = DB::table('templates')
        ->select('templates.*')
        ->where('temps', 'like', '%'.$term.'%')
        ->get();
      
        //clean data
        $templatedata = [];

        $templates = $gettemplates->map(function($items){
            $templatedata['id'] = $items->id;
            $templatedata['name'] = Crypt::decryptString($items->name);
            $templatedata['form_fields'] = json_decode(Crypt::decryptString($items->form_fields));
            $templatedata['created_by'] = $items->created_by;
            $templatedata['created_at'] = $items->created_at;
            $templatedata['updated_at'] = $items->updated_at;
            $templatedata['updated_by'] = $items->updated_by;

            return $templatedata;
         });
        
         $response = [
            'templates' => $templates
        ];
        return response()->json($response, 200);

    }


     /**
     * deleteTemplate delete a template
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Illuminate\Http\Request  $id of the template to be deleted 
     * @return void\Illuminate\Http\Response success or error message
     */
    public function deleteTemplate(Request $request, $id)
    {
        //get user deleting the template
        $user = $request->user();
        $userid = $user['id'];

        //delete a template 
        try {
            DB::table('templates')
            ->where('id', $id)
            ->delete();

            $message = 'Ok';
            Log::channel('mysql')->info('User with id: ' . $userid .' successsfully deleted a template with id: '. $id);

        }catch(Exception $e) {
            Log::channel('mysql')->error('User with id: ' . $userid .' unsuccesssfully deleted a template with id: '. $id);
            $message = "Failed";
        } 
            
        return response()->json([
            'message' => $message
        ]);
    }



}
