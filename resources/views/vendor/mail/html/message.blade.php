@component('mail::layout')
    {{-- Header --}}
    @slot('header')
        @component('mail::header', ['url' => config('app.url')])
            <img src="http://127.0.0.1:8000/images/logo.png" alt="GIT">
        @endcomponent
    @endslot

    {{-- Body --}}
    {{ $slot }}

    {{-- Subcopy --}}
    @isset($subcopy)
        @slot('subcopy')
            @component('mail::subcopy')
                {{ $subcopy }}
            @endcomponent
        @endslot
    @endisset

    {{-- Footer --}}
    @slot('footer')
        @component('mail::footer')
            <h1 style="text-align:center">NEEP HELP?</h1>
            contact us on: support@thegitlab.com
           © {{ date('Y') }} GIT. @lang('All rights reserved.')
        @endcomponent
    @endslot
@endcomponent
