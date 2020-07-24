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

    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct(String $code)
    {
        $this->submission_code = $code;
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
            ->content('A user has submitted GiT Contact Us Form on Forms369 with submission code: '. $this->submission_code);
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
