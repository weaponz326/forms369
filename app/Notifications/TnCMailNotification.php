<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Support\Facades\Storage;

class TnCMailNotification extends Notification
{
    use Queueable;
    public $formname;
    public $formcode;
    public $file_name;
    /**
     * Create a new notification instance.
     *
     * @return void
     */
     public function __construct(String $formname, $formcode)
     {
         $this->formname = $formname;
         $this->formcode = $formcode;

         $this->file_name = $formcode . ".txt";
        
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
        return (new MailMessage)
                    ->subject('Terms and Conditions')
                    ->line('Kindly find attached the Terms and Conditions for '. $this->formname .'.')
                    ->attach(storage_path('app/public/tnc/'.$this->file_name))
                    ->line('Thank you for using Forms369!');
    }

    /**
     * Get the array representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function toArray($notifiable)
    {
        return [
            //
        ];
    }
}
