<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Messages\SlackMessage;

class SlackAbuseReportNotification extends Notification
{
    use Queueable;

    public $id;
    public $reporter_id;
    public $message; 
    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct(String $id, $message, $reporter_id)
    {
        $this->id = $id;
        $this->message = $message;
        $this->$reporter_id = $reporter_id;
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
            ->from('Forms369 - Abuse Report')
            ->to('forms369_support')
            ->content('User with ID: '. $this->reporter_id .' reported a client with ID: '. $this->id . ' for abuse.' . "\r\n".
            'Reason for Report: '. $this->message);
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
