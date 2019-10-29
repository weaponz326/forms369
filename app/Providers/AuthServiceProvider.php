<?php

namespace App\Providers;
use Laravel\Passport\Passport;
use Illuminate\Support\Facades\Gate;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The policy mappings for the application.
     *
     * @var array
     */
    protected $policies = [
        // 'App\Model' => 'App\Policies\ModelPolicy',
    ];

    /**
     * Register any authentication / authorization services.
     *
     * @return void
     */
    public function boot()
    {
        $this->registerPolicies();
        Passport::routes();
        Passport::tokensExpireIn(now()->addDays(1));
        Passport::refreshTokensExpireIn(now()->addDays(30));
        Passport::personalAccessTokensExpireIn(now()->addMonths(6));

        Passport::tokensCan([
            'GIT_Admin' => 'Create and manage companies and forms',
            'branch_executive' => 'Generate reports and manage all activities for a branch',
            'super_executive' => 'Generate reports and manage all company activities',
            'company_admin' => 'Manage company and its users',
            'branch_admin' => 'Manage branch and its users',
            'frontdesk' => 'View and manage clients submitted forms',
            'client' => 'Submit forms',
        ]);

    }
}
