<?php

namespace App\Http\Middleware;
use Illuminate\Support\Facades\DB;
use Exception;
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
        $accesscode = $request->cookie('accesscode');

        //if access code does not exist, redirect to access code page
        if (empty($accesscode)) {
            //return redirect()->route('auth');
            return response()->json(['message' => 'Np_access_code']);

        }else{
            $exist = DB::table('access')->where('accesscode', '=', $accesscode)->first();
            if (isset($exist->id) && $exist->active ==1) {
                //do nothing
                //return response()->json(['message' => 'Access granted']);

            }else{

                return response()->json(['message' => 'Re-enter_access_code']);

            }
                
        }
         
        return $next($request);
    }

}
