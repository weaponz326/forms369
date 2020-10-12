<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use GuzzleHttp\Exception\GuzzleException;
use GuzzleHttp\Client;
use DB;
use Illuminate\Support\Facades\Http;

class QueueController extends Controller
{
     /**
     * getQMSToken get token to use QMS apis
     * @param  mixed $request
     * @param  mixed $id id of the merchant
     *
     * @return void\Illuminate\Http\Response token
     */
     public function getQMSToken(Request $request, $id){
        $merchantdetails = DB::table('merchants')
        ->where('id', $id)
        ->first();

        $client_id = $merchantdetails->client_id;
        $client_secret = $merchantdetails->client_secret;
        $grant_type = "client_credentials";
        $scope = "join-queue";

        $client = new Client();
        try{
            $response = $client->post('https://qms.gitlog.biz/oauth/token', [
                'form_params' => [
                    'grant_type' => $grant_type,
                    'client_id' => $client_id,
                    'client_secret' => $client_secret,
                    'scope' => $scope,
                ],
            ]);
    
            $result = json_decode($response->getBody()->getContents());
    
            $token = $result->access_token;
            $response = [
                'message' => $token
            ];
            return response()->json($response, 200);
        } catch (RequestException $e){
            $response = $this->StatusCodeHandling($e);
            $response = [
                'message' => $response
            ];
            return response()->json($response, 400);
       
        }
        
    }

    /**
     * getQMSBranchServices get QMS branch services
     * @param  mixed $request
     * @param mixed $ext branch extension
     * @param  mixed $id id of the merchant
     *
     * @return void\Illuminate\Http\Response token
     */
     public function getQMSBranchServices(Request $request)
     {
        $this->validate($request, [
            'ext' => 'required',
            'token' => 'required'
        ]);

        $ext = $request->ext;
        $token = $request->token;

        $payload = json_encode(["branch_ext"=>$ext]);
        $curl = curl_init();

        curl_setopt_array($curl, array(
            CURLOPT_URL => "https://qms.gitlog.biz/api/join/branch_services",
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => "",
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => "POST",
            CURLOPT_SSL_VERIFYPEER => false,
            CURLOPT_POSTFIELDS => $payload,
            CURLOPT_HTTPHEADER => array(
            "Authorization: Bearer {$token}",
            "Cache-Control: no-cache",
            "Content-Type: application/json",
            "Accept: application/json"
            ),
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            $response = [
                'message' => $err
            ];
            return response()->json($response, 400);
        } else {
            $responses = [
                'message' => json_decode($response)
            ];
            return response()->json($responses, 200);
        }

     }

      /**
     * getQMSCustomerServices get token to use QMS apis
     * @param  mixed $request
     * @param mixed $ext branch extension
     * @param  mixed $id id of the merchant
     *
     * @return void\Illuminate\Http\Response token
     */
     public function getQMSCustomerServices(Request $request)
     {
        $this->validate($request, [
            'ext' => 'required',
            'token' => 'required'
        ]);

        $ext = $request->ext;
        $token = $request->token;
    
        $payload = json_encode(["branch_ext"=>$ext]);
        $curl = curl_init();

        curl_setopt_array($curl, array(
            CURLOPT_URL => "https://qms.gitlog.biz/api/join/customer_services",
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => "",
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => "POST",
            CURLOPT_SSL_VERIFYPEER => false,
            CURLOPT_POSTFIELDS => $payload,
            CURLOPT_HTTPHEADER => array(
            "Authorization: Bearer {$token}",
            "Cache-Control: no-cache",
            "Content-Type: application/json",
            "Accept: application/json"
            ),
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            $response = [
                'message' => $err
            ];
            return response()->json($response, 400);
        } else {
            $responses = [
                'message' => json_decode($response)
            ];
            return response()->json($responses, 200);
        }

     }

    /**
     * QMSJoinQueue join a queue
     * @param  mixed $request
     * @return void\Illuminate\Http\Response token
     */
     public function QMSJoinQueue(Request $request)
     {
        $this->validate($request, [
            'ext' => 'required',
            'token' => 'required',
            'client_mobile' => 'required',
            'service_type' => 'required', //service type id
            'join_now' => 'required',
            'join_at_time' => 'required'

        ]);

        $ext = $request->ext;
        $token = $request->token;
        $client_mobile = $request->client_mobile;
        $service_type = $request->service_type;
        $single_service_id = $service_type;
        $is_multi_services = 0;
        $multiple_services = "null";
        $join_now = $request->join_now;
        $join_at_time = $request->join_at_time;
        $entry_src = "FORM369";
    
        $payload = json_encode(["client_mobile"=>$client_mobile, "branch_ext"=>$ext,
        "service_type"=>$service_type, "single_service_id"=>$single_service_id,
        "is_multi_services"=>$is_multi_services, "multiple_services"=>$multiple_services,
        "join_now"=>$join_now, "join_at_time"=>$join_at_time, "entry_src"=>$entry_src]);

        $curl = curl_init();

        curl_setopt_array($curl, array(
            CURLOPT_URL => "https://qms.gitlog.biz/api/join/join_branch_queue",
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => "",
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => "POST",
            CURLOPT_SSL_VERIFYPEER => false,
            CURLOPT_POSTFIELDS => $payload,
            CURLOPT_HTTPHEADER => array(
            "Authorization: Bearer {$token}",
            "Cache-Control: no-cache",
            "Content-Type: application/json", 
            "Accept: application/json"
            ),
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            $response = [
                'message' => $err
            ];
            return response()->json($response, 400);
        } else {
            $responses = [
                'message' => json_decode($response)
            ];
            return response()->json($responses, 200);
        }

     }

      /**
     * QueueCancelRequest cancel queue request
     * @param  mixed $request
     * @param mixed $ext branch extension
     * @param  mixed $id id of the merchant
     *
     * @return void\Illuminate\Http\Response token
     */
     public function QueueCancelRequest(Request $request)
     {
        $this->validate($request, [
            'ext' => 'required',
            'token' => 'required',
            'client_mobile' =>'required'
        ]);

        $ext = $request->ext;
        $token = $request->token;
        $client_mobile = $request->client_mobile;
    
        $payload = json_encode(["branch_ext"=>$ext, 'client_mobile'=>$client_mobile]);
        $curl = curl_init();

        curl_setopt_array($curl, array(
            CURLOPT_URL => "https://qms.gitlog.biz/api/join/cancel_request",
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => "",
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => "POST",
            CURLOPT_SSL_VERIFYPEER => false,
            CURLOPT_POSTFIELDS => $payload,
            CURLOPT_HTTPHEADER => array(
            "Authorization: Bearer {$token}",
            "Cache-Control: no-cache",
            "Content-Type: application/json",
            "Accept: application/json"
            ),
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            $response = [
                'message' => $err
            ];
            return response()->json($response, 400);
        } else {
            $responses = [
                'message' => json_decode($response)
            ];
            return response()->json($responses, 200);
        }

     }
}
