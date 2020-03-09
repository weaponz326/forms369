@component('mail::layout')
    {{-- Header --}}
    @slot('header')
        @component('mail::header', ['url' => config('app.url')])
            <img src="https://forms369.com/assets/images/logo1.png" alt="GIT">
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
           © {{ date('Y') }} theGiTLab. @lang('All rights reserved.')
        @endcomponent
    @endslot
@endcomponent
