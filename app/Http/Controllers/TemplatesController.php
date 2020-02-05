<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

use Illuminate\Support\Facades\Crypt;

use DB;
use Illuminate\Pagination\Paginator;
use Illuminate\Support\Facades\Log;
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
            'form_fields' => 'required',
            'category_id' => 'required'
        ]); 
       

        //request all data on submit
        $formfields = Crypt::encryptString(json_encode($request->form_fields));
        $name = Crypt::encryptString($request->name);
        $category_id = $request->category_id;

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
                    'temps' => $request->name,
                    'category_id' => $category_id
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
            'form_fields' => 'required',
            'category_id' => 'required'
        ]); 
       

        //request all data on submit
        $formfields = Crypt::encryptString(json_encode($request->form_fields));
        $name = Crypt::encryptString($request->name);
        $category_id = $request->category_id;

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
                    'temps' => $request->name,
                    'category_id' => $category_id
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
        ->join('template_categories', 'template_categories.id', '=', 'category_id')
        ->select('templates.*','template_categories.name AS cat_name')
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
            $templatedata['category_id'] = $items->category_id;
            $templatedata['category_name'] = $items->cat_name;

            return $templatedata;
         });
      
         $response = [
            'templates' => $gettemplates
        ];
        return response()->json($response, 200);

    }

    /**
     * getAllTemplatesbyCategory get all  templates in the database under a particular category
     *
     * @param  mixed $request
     *
     * @return void\Illuminate\Http\Response all details of templates under the selected category
     */
    public function getAllTemplatesbyCategory(Request $request, $id){

        //get all templates
        $gettemplates = DB::table('templates')
        ->join('template_categories', 'template_categories.id', '=', 'category_id')
        ->select('templates.*','template_categories.name AS cat_name')
        ->where('category_id', $id)
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
            $templatedata['category_id'] = $items->category_id;
            $templatedata['category_name'] = $items->cat_name;

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
    public function searchTemplateByNameOrCategory(Request $request, $term){

        //get all registered companies 
        $gettemplates = DB::table('templates')
        ->join('template_categories', 'template_categories.id', '=', 'category_id')
        ->select('templates.*','template_categories.name AS cat_name')
        ->where('temps', 'like', '%'.$term.'%')
        ->orWhere('template_categories.name', 'like', '%'.$term.'%')
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
            $templatedata['category_id'] = $items->category_id;
            $templatedata['category_name'] = $items->cat_name;

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

    /**
     * createTemplateCategory create a new template category
     *
     * @param  mixed $request
     *
     * @return \Illuminate\Http\Response success or error message
     */
    public function createTemplateCategory(Request $request){

        $this->validate($request, [
            'name' => 'required'
        ]);

        $name = $request->name;

        $created_at = now();

        //get user creating the new merchant
        $user = $request->user();
        $userid = $user['id'];

        try {
            DB::table('template_categories')->insertGetId(
                [
                    'name' => $name, 
                    'created_by' => $userid, 
                    'created_at' => $created_at
                ]
            );

            $message = 'Ok';
            Log::channel('mysql')->info('User with id: ' . $userid .' successsfully created a new template category');

        }catch(Exception $e) {
            Log::channel('mysql')->error('User with id: ' . $userid .' unsuccesssfully created a new template category');
            $message = "Failed";
        } 
            
        return response()->json([
            'message' => $message
        ]);

    }

    /**
     * getAllTemplateCategories get all available template categories in the database  
     *
     * @param  mixed $request
     *
     * @return void\Illuminate\Http\Response all template categories data
     */
    public function getAllTemplateCategories(Request $request){

        //get all template categories 
        $gettemplatecategories = DB::table('template_categories')->get();

         $response = [
            'template_categories' => $gettemplatecategories
        ];
        return response()->json($response, 200);

    }


}
