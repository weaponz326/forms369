<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Messages\SlackMessage;

class SuggestMerchantSlackNotification extends Notification
{
    use Queueable;

    public $merchant;
    public $country;
    
    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct(String $merchant, $country)
    {
        $this->merchant = $merchant;
        $this->country = $country;
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
    //                 ->line('The introduction to the notification.')
    //                 ->action('Notification Action', url('/'))
    //                 ->line('Thank you for using our application!');
    // }

    /**
        * Get the slack representation of the notification.
        *
        * @param  mixed  $notifiable
        * @return \Illuminate\Notifications\Messages\SlackMessage
    */
    public function toSlack($notifiable)
    {   
        return (new SlackMessage)
            ->from('Forms369')
            ->to('forms369_support')
            ->content('New Merchant Suggested.' ."\r\n".
            'Merchant Name: '. $this->name . "\r\n" .
            'Merchant Country: '. $this->country);
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
