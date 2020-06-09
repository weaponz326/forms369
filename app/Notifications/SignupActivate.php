<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;

use Illuminate\Support\Facades\URL;
use Illuminate\Support\Carbon;
class SignupActivate extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function via($notifiable)
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function toMail($notifiable)
    {
       
        $url = URL::temporarySignedRoute('signup/activate', now()->addMinute(10), ['token' => $notifiable->active_token]);
        return (new MailMessage)
            ->subject('Activate Your Account')
            ->line('Thank you for signing up to use Forms369!. You are one step away from completing registration and having access to numerous forms to fill and submit online.')
            ->action('ACTIVATE YOUR ACCOUNT', url($url));
    }

    /**
     * Get the array representation of the notification.
     *
     * @param  mixed  $notifiablep
     * @return array
     */
    public function toArray($notifiable)
    {
        return [
            //
        ];
    }
}
