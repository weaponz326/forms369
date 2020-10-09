<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class PaymentController extends Controller
{
    /**
     * initiate payment: redirect to theteller
     * @param  mixed $request
     * @return \Illuminate\Http\Response success or error message with redirect url
     */
    public function initiatePayment(Request $request)
    {
        $this->validate($request, [
            'email' => 'required',
            'amount' => 'required'
        ]);

        $email = $request->email;
        $amount = $request->amount;

        //format number to 12 digits
        $amount = $amount * 100;
        $amount = str_pad($amount, 12, '0', STR_PAD_LEFT);

        $transaction_id = mt_rand(100000000000, 999999999999);
        $payload = json_encode(["merchant_id"=>"TTM-00004152", "transaction_id"=>$transaction_id,
        "desc"=>"Payment Using Forms369", "amount"=>$amount,
        "redirect_url"=>"https://forms369.com", "email"=>$email]);

    
        $curl = curl_init();

        curl_setopt_array($curl, array(
            CURLOPT_URL => "https://test.theteller.net/checkout/initiate",
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => "",
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => "POST",
            CURLOPT_SSL_VERIFYPEER => false,
            CURLOPT_POSTFIELDS => $payload,
            CURLOPT_HTTPHEADER => array(
            "Authorization: Basic ".base64_encode('global5f341c8066d95:ZDhhNjI4YzU0MmQxOWI1YjY1Zjg3NGYzMjNjYjliZjA=')."",
            "Cache-Control: no-cache",
            "Content-Type: application/json"
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
     * collect payments directly from your web application #theteller
     * @param  mixed $request

     * @return \Illuminate\Http\Response success or error message
     */
     public function collectPayment(Request $request)
     {

        $this->validate($request, [
            'email' => 'required',
            'amount' => 'required',
            'processing_code' => 'required', //This is a transaction type identifier. 404000 is default for transfer to mobile money "000000" for card payment "000200" for mobile money payment
            'r_switch' => 'required', //Account issuer or network on which the account to be debited resides. "VIS" for Visa "MAS" for MasterCard "MTN" for MTN "VDF" for Vodafone "ATL" for Airtel "TGO" for Tigo
            'pan' => 'required', //card pan number on card
            'exp_month' => 'required',
            'exp_year' => 'required',
            'cvv' => 'required',
            'card_holder' => 'required'
        ]);

        $processing_code = $request->processing_code;
        $r_switch = $request->r_switch;
        $transaction_id = mt_rand(100000000000, 999999999999);
        $merchant_id = "TTM-00004152";
        $pan = $request->pan;
        $redirect_url  = "https://forms369.com";
        $exp_month = $request->exp_month;
        $exp_year = $request->exp_year;
        $cvv = $request->cvv;
        $desc = "payment for a form on Forms369";
        
        //amount
        $amount = $request->amount;
        //format amount to 12 digits
        $amount = $amount * 100;
        $amount = str_pad($amount, 12, '0', STR_PAD_LEFT);
        // return $amount;

        $currency = "GHS";
        $card_holder = $request->card_holder;
        $email = $request->email;
        
        //"3d_url_response"=>$redirect_url, 
         
         $payload = json_encode(["processing_code"=>$processing_code, "r-switch"=>$r_switch, "transaction_id"=>$transaction_id,
         "merchant_id"=>$merchant_id, "pan"=>$pan, "exp_month"=>$exp_month, "exp_year"=>$exp_year, "3d_url_response"=>$redirect_url,
         "cvv"=>$cvv, "desc"=>$desc, "amount"=>$amount, "currency"=>$currency, "card_holder"=>$card_holder, "customer_email"=>$email]);
 
     
         $curl = curl_init();
 
         curl_setopt_array($curl, array(
             CURLOPT_URL => "https://test.theteller.net/v1.1/transaction/process",
             CURLOPT_RETURNTRANSFER => true,
             CURLOPT_ENCODING => "",
             CURLOPT_MAXREDIRS => 10,
             CURLOPT_TIMEOUT => 30,
             CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
             CURLOPT_CUSTOMREQUEST => "POST",
             CURLOPT_SSL_VERIFYPEER => false,
             CURLOPT_POSTFIELDS => $payload,
             CURLOPT_HTTPHEADER => array(
             "Authorization: Basic ".base64_encode('global5f341c8066d95:ZDhhNjI4YzU0MmQxOWI1YjY1Zjg3NGYzMjNjYjliZjA=')."",
             "Cache-Control: no-cache",
             "Content-Type: application/json"
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
