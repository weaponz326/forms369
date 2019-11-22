<?php

namespace App\Http\Middleware;

use Closure;

class CheckAccess
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        ///check internet connection
        if ($this->checkinternet() < 15000){
            return redirect('poor_internet');
        }
            
        if($request->wantsJson()){
            //pass
        }else{

            //get access code from cookies 
            $accesscode = $request->cookie('accesscode');
            if (empty($accesscode)) {
                if (env('ACCESS_CODE_RENEW')){

                    try{
                        $renew = DB::table('access')->where('active', '=','0')->first();
                        DB::table('access')->where('accesscode','=', $renew->accesscode)->update(['active' => 1]);

                        if($request->getHost()==env('APP_ADMIN_DOMAIN'))
                            return redirect('execlogin')->cookie('accesscode', $renew->accesscode,525600);
                        else
                            return redirect('login')->cookie('accesscode',$renew->accesscode,525600);

                    }catch (Exception $exceptione){
                        //do nothing
                    }

                }elseif ($request->url()!='wdc')
                    return redirect('access');
            } 
        }

        return $next($request);
    }

    //checks if internet connection is strong
    private function checkinternet(){

        $kb=512;
        flush();
        $time = explode(" ",microtime());
        $start = $time[0] + $time[1];
        for($x=0;$x<$kb;$x++){
            flush();
        }
        $time = explode(" ",microtime());
        $finish = $time[0] + $time[1];
        $deltat = $finish - $start;

        return round($kb / $deltat, 3);
    }
}
