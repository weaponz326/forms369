<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Messages\SlackMessage;

class SlackNotification extends Notification
{
    use Queueable;

    public $submission_code;
    public $subject;
    public $email;
    public $phone;    
    public $message; 
    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct(String $code, $subject, $phone, $email, $message)
    {
        $this->submission_code = $code;
        $this->message = $message;
        $this->subject = $subject;
        $this->phone = $phone;
        $this->email = $email;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function via($notifiable)
    {
        return ['slack'];
    }

    // /**
    //  * Get the mail representation of the notification.
    //  *
    //  * @param  mixed  $notifiable
    //  * @return \Illuminate\Notifications\Messages\MailMessage
    //  */
    // public function toMail($notifiable)
    // {
    //     return (new MailMessage)
    //         ->subject('Forms369 - Contact Us')
    //         ->line('A user has submitted GiT Contact Us Form on Forms369 with submission code: '. $submission_code)
    //         ->line('Thank you for your support.');
    // }


    public function toSlack($notifiable)
    {   
        return (new SlackMessage)
            ->from('Forms369')
            ->to('forms369_support')
            ->content('A user has submitted GiT Contact Us Form on Forms369 with submission code: '. $this->submission_code ."\r\n".
            'Subject: '. $this->subject . "\r\n" .
            'Phone Number: '. $this->phone . "\r\n".
            'Contact Email: '. $this->email . "\r\n" .
            'Messasge: '. $this->message);
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
