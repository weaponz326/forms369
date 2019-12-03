<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use Illuminate\Support\Carbon;

use Illuminate\Support\Facades\Crypt;

use DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\File;


class MediaController extends Controller
{
    
    /**
     * upload image to the public folder 
     *
     * @param  \Illuminate\Http\Request  $request 
     * @return response $url
     */
    public function imageUpload(Request $request)
    {

        $this->validate($request, [
            'image' => 'required|mimes:jpeg,jpg,png,gif,psd,tiff'
        ]); 
       
        $image = $request->file('image');
        $filename = $image->getClientOriginalName();
        $extension = $image->getClientOriginalExtension();
        
        $current_date_time = Carbon::now()->toDateTimeString(); // Produces something like "2019-03-11 12:25:00"
        $url=$image->getFilename().'_'.$current_date_time.'.'.$extension;
        $upload=Storage::disk('local')->put($url,  File::get($image));

        if($upload)
        {
            return response(['image_name'=>$url]);

        }else{
            return Reponse::json('Image upload unsuccessful');
        }     
    
    }


}
