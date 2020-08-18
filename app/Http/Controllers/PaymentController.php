<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class PaymentController extends Controller
{
    /**
     * deleteAccessCode delete an access code in the db
     * @param  mixed $request
     * @param  mixed $id
     * @return \Illuminate\Http\Response success or error message
     */
    public function initiatePayment(Request $request)
    {
        $this->validate($request, [
            'email' => 'required',
            'amount' => 'required'
        ]);

        $email = $request->email;
        $amount = $request->amount;

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
}
