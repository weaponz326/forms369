<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;

class FormUrl extends Notification
{
    use Queueable;
    /**
     * User Object
     *
     * @var form_id
     */
    public $form_id;
    public $url;
    public $form_title;
    public $form_code;
    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct(int $id, String $signedurl, String $title, String $code)
    {
        $this->form_id = $id;
        $this->url = $signedurl;
        $this->form_title = $title;
        $this->form_code = $code;
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
         ->subject('Form URL')
         ->line('Your form has successfully been created. Below is a url to your form. You can directly share this link with respondents.')
         ->line('Form Title/Name:  '. $this->form_title)
         ->line('Form Code:  '. $this->form_code)
         ->line('Form URL:  '. url($this->url))
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
