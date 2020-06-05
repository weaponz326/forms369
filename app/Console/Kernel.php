<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;
use DB;
use Illuminate\Support\Carbon;
use App\Http\Controllers\AuthController;

class Kernel extends ConsoleKernel
{
    /**
     * The Artisan commands provided by your application.
     *
     * @var array
     */
    protected $commands = [
        //
    ];

    /**
     * Define the application's command schedule.
     *
     * @param  \Illuminate\Console\Scheduling\Schedule  $schedule
     * @return void
     */
    protected function schedule(Schedule $schedule)
    {

        $schedule->call(function () {
            $users = DB::table('submitted_forms')
            ->join('users', 'users.id', '=', 'client_id')
            ->join('forms', 'forms.form_code', '=', 'form_id')
            ->where('reverse_at', '=', Carbon::now()->toDateTimeString())
           //->where('submitted_at', '<', Carbon::now()->subHours(72)->toDateTimeString())
            ->where('can_view', '=', 0)
            ->where('submitted_forms.status', '=', 0)
            ->select('phone', 'submission_code')
            ->get();
            
            if(!empty($users) || count($users) > 0){
                foreach ($users as $user) {
                    DB::table('submitted_forms')
                    ->where('submission_code',$user->submission_code)
                    ->update(
                        [
                            'status' => 5
                        ]
                    );

                    //send sms to user if form is reversed after 72 hours
                    $from = "GiTLog";
                    $mobile = $user->phone;
                    $code = $user->submission_code;
                    $msg = "Submitted form reversed due to no show up for processing" .".\r\n". "Form Submission Code: " .$code; 
                    return (new AuthController)->sendsms($from,$mobile,$msg);

                }
               
            }
        })->everyMinute();;
    }

    /**
     * Register the commands for the application.
     *
     * @return void
     */
    protected function commands()
    {
        $this->load(__DIR__.'/Commands');

        require base_path('routes/console.php');
    }
}
