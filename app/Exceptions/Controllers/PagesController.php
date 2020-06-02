<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Excel;
use DB;
use Illuminate\Support\Facades\Crypt;
use App\Exports\FormsExport;
use App\User;


class PagesController extends Controller
{

     /**
     * getAllClients get all clients in the database 
     *
     * @param  mixed $request
     * @return void\Illuminate\Http\Response all details of all clients
     */
    public function exportClientFormData(Request $request, $code){
        $timestamp = time();
        $filename = 'Export_data_' . $timestamp. '.pdf';
        
        // header("Content-Type: application/vnd.ms-excel");
        header("Content-Type: application/pdf");
        header("Content-Disposition: attachment; filename=\"$filename\"");
        
        $isPrintHeader = false;

        $records = DB::table('submitted_forms')
            ->select('client_details')
            ->where('submission_code', $code)
            ->first();

        $records = json_decode(Crypt::decryptString($records->client_details)); 
        $records = json_decode($records, true); 

        // foreach ($records as $row) {
            if (! $isPrintHeader) {
                echo implode("\t", array_keys($records)) . "\n";
                $isPrintHeader = true;
            }
            echo implode("\t", array_values($records)) . "\n";
        // }
        exit();
       
       
    }
}
