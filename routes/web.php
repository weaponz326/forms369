<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    View::addExtension('html', 'php');
    return View::make('index');
});

Route::get('login', function () {
    View::addExtension('html', 'php');
    return View::make('index');
})->name('login');

Route::get('auth', function () {
    View::addExtension('html', 'php');
    return View::make('index');
});

Route::get('user_auth', function () {
    View::addExtension('html', 'php');
    return View::make('index');
});

Route::get('client_auth', function () {
    View::addExtension('html', 'php');
    return View::make('index');
});

Route::get('register', function () {
    View::addExtension('html', 'php');
    return View::make('index');
});

Route::get('forgot', function () {
    View::addExtension('html', 'php');
    return View::make('index');
});

Route::get('reset', function () {
    View::addExtension('html', 'php');
    return View::make('index');
})->name('reset');

Route::get('master_register', function () {
    View::addExtension('html', 'php');
    return View::make('index');
});

Route::get('change_password', function () {
    View::addExtension('html', 'php');
    return View::make('index');
});

Route::get('valid_confirm_link', function () {
    View::addExtension('html', 'php');
    return View::make('index');
})->name('valid_confirm_link');

Route::get('invalid_confirm_link', function () {
    View::addExtension('html', 'php');
    return View::make('index');
})->name('invalid_confirm_link');

Route::get('invalid_password_link', function () {
    View::addExtension('html', 'php');
    return View::make('index');
})->name('invalid_password_link');

Route::get('git_admin', function () {
    View::addExtension('html', 'php');
    return View::make('index');
});

Route::get('git_admin/setup_form', function () {
    View::addExtension('html', 'php');
    return View::make('index');
});

Route::get('git_admin/create/company', function () {
    View::addExtension('html', 'php');
    return View::make('index');
});

Route::get('git_admin/create/branch', function () {
    View::addExtension('html', 'php');
    return View::make('index');
});

Route::get('git_admin/create/user_account', function () {
    View::addExtension('html', 'php');
    return View::make('index');
});

Route::get('git_admin/create/access_code', function () {
    View::addExtension('html', 'php');
    return View::make('index');
});

Route::get('git_admin/edit/form', function () {
    View::addExtension('html', 'php');
    return View::make('index');
});

Route::get('git_admin/edit/branch', function () {
    View::addExtension('html', 'php');
    return View::make('index');
});

Route::get('git_admin/edit/company', function () {
    View::addExtension('html', 'php');
    return View::make('index');
});

Route::get('git_admin/edit/user_account', function () {
    View::addExtension('html', 'php');
    return View::make('index');
});

Route::get('git_admin/edit/section', function () {
    View::addExtension('html', 'php');
    return View::make('index');
});

Route::get('git_admin/edit/access_code', function () {
    View::addExtension('html', 'php');
    return View::make('index');
});

Route::get('git_admin/lists/company', function () {
    View::addExtension('html', 'php');
    return View::make('index');
});

Route::get('git_admin/lists/admin', function () {
    View::addExtension('html', 'php');
    return View::make('index');
});

Route::get('git_admin/lists/form', function () {
    View::addExtension('html', 'php');
    return View::make('index');
});

Route::get('git_admin/lists/branch_admin', function () {
    View::addExtension('html', 'php');
    return View::make('index');
});

Route::get('git_admin/lists/company_admin', function () {
    View::addExtension('html', 'php');
    return View::make('index');
});

Route::get('git_admin/lists/company_branch', function () {
    View::addExtension('html', 'php');
    return View::make('index');
});

Route::get('git_admin/lists/super_executive', function () {
    View::addExtension('html', 'php');
    return View::make('index');
});

Route::get('git_admin/lists/branch_executive', function () {
    View::addExtension('html', 'php');
    return View::make('index');
});

Route::get('git_admin/lists/branch', function () {
    View::addExtension('html', 'php');
    return View::make('index');
});

Route::get('git_admin/lists/front_desk', function () {
    View::addExtension('html', 'php');
    return View::make('index');
});

Route::get('git_admin/lists/section', function () {
    View::addExtension('html', 'php');
    return View::make('index');
});

Route::get('git_admin/lists/access_code', function () {
    View::addExtension('html', 'php');
    return View::make('index');
});

Route::get('git_admin/details/branch', function () {
    View::addExtension('html', 'php');
    return View::make('index');
});

Route::get('git_admin/details/company', function () {
    View::addExtension('html', 'php');
    return View::make('index');
});

Route::get('git_admin/details/user_account', function () {
    View::addExtension('html', 'php');
    return View::make('index');
});

Route::get('git_admin/details/form', function () {
    View::addExtension('html', 'php');
    return View::make('index');
});

Route::get('git_admin/create/section', function () {
    View::addExtension('html', 'php');
    return View::make('index');
});

/**
 * Client Routes
 */

Route::get('client', function () {
    View::addExtension('html', 'php');
    return View::make('index');
});

Route::get('client/form_merchant', function () {
    View::addExtension('html', 'php');
    return View::make('index');
});

Route::get('client/forms', function () {
    View::addExtension('html', 'php');
    return View::make('index');
});

Route::get('client/forms_filled', function () {
    View::addExtension('html', 'php');
    return View::make('index');
});

Route::get('client/form_entry', function () {
    View::addExtension('html', 'php');
    return View::make('index');
});

Route::get('client/fill_form', function () {
    View::addExtension('html', 'php');
    return View::make('index');
});

Route::get('client/form_link', function () {
    View::addExtension('html', 'php');
    return View::make('index');
})->name('form_link');

Route::get('client/profile', function () {
    View::addExtension('html', 'php');
    return View::make('index');
});

Route::get('client/printing', function () {
    View::addExtension('html', 'php');
    return View::make('index');
});

Route::get('client/pdf_printing', function() {
    View::addExtension('html', 'php');
    return View::make('index');
});

Route::get('client/form_link_redirect', function () {
    View::addExtension('html', 'php');
    return View::make('index');
});

Route::get('client/settings', function () {
    View::addExtension('html', 'php');
    return View::make('index');
});

/**
 * Front Desk Routes.
 */

Route::get('front_desk', function () {
    View::addExtension('html', 'php');
    return View::make('index');
});

Route::get('front_desk/view_form', function () {
    View::addExtension('html', 'php');
    return View::make('index');
});

Route::get('front_desk/preview', function () {
    View::addExtension('html', 'php');
    return View::make('index');
});

Route::get('front_desk/print_form', function () {
    View::addExtension('html', 'php');
    return View::make('index');
});

Route::get('front_desk/print_form_default', function () {
    View::addExtension('html', 'php');
    return View::make('index');
});

Route::get('front_desk/lists/submitted', function () {
    View::addExtension('html', 'php');
    return View::make('index');
});

Route::get('front_desk/lists/processing', function () {
    View::addExtension('html', 'php');
    return View::make('index');
});

Route::get('front_desk/lists/processed', function () {
    View::addExtension('html', 'php');
    return View::make('index');
});

Route::get('front_desk/lists/client_forms', function () {
    View::addExtension('html', 'php');
    return View::make('index');
});

Route::get('front_desk/lists/client_form_data', function () {
    View::addExtension('html', 'php');
    return View::make('index');
});

/**
 * Company Admin Routes.
 */

Route::get('admin', function () {
    View::addExtension('html', 'php');
    return View::make('index');
});

Route::get('admin/create/form', function () {
    View::addExtension('html', 'php');
    return View::make('index');
});

Route::get('admin/create/account', function () {
    View::addExtension('html', 'php');
    return View::make('index');
});

Route::get('admin/edit/form', function () {
    View::addExtension('html', 'php');
    return View::make('index');
});

Route::get('admin/edit/account', function () {
    View::addExtension('html', 'php');
    return View::make('index');
});

Route::get('admin/lists/form', function () {
    View::addExtension('html', 'php');
    return View::make('index');
});

Route::get('admin/lists/branch', function () {
    View::addExtension('html', 'php');
    return View::make('index');
});

Route::get('admin/lists/front_desk', function () {
    View::addExtension('html', 'php');
    return View::make('index');
});

Route::get('admin/lists/branch_admin', function () {
    View::addExtension('html', 'php');
    return View::make('index');
});

Route::get('admin/lists/company_admin', function () {
    View::addExtension('html', 'php');
    return View::make('index');
});

Route::get('admin/lists/branch_executive', function () {
    View::addExtension('html', 'php');
    return View::make('index');
});

Route::get('admin/lists/super_executive', function () {
    View::addExtension('html', 'php');
    return View::make('index');
});

Route::get('admin/lists/settings', function () {
    View::addExtension('html', 'php');
    return View::make('index');
});

Route::get('admin/details/form', function () {
    View::addExtension('html', 'php');
    return View::make('index');
});

Route::get('admin/details/branch', function () {
    View::addExtension('html', 'php');
    return View::make('index');
});

Route::get('admin/details/account', function () {
    View::addExtension('html', 'php');
    return View::make('index');
});

/**
 * Templates Routes.
 */

Route::get('templates/create', function () {
    View::addExtension('html', 'php');
    return View::make('index');
});

Route::get('templates/edit', function () {
    View::addExtension('html', 'php');
    return View::make('index');
});

Route::get('templates/list', function () {
    View::addExtension('html', 'php');
    return View::make('index');
});

Route::get('templates/view', function () {
    View::addExtension('html', 'php');
    return View::make('index');
});

/** Executive Routes */

Route::get('executive', function () {
    View::addExtension('html', 'php');
    return View::make('index');
});

Route::get('executive/submitted', function () {
    View::addExtension('html', 'php');
    return View::make('index');
});

Route::get('executive/processed', function () {
    View::addExtension('html', 'php');
    return View::make('index');
});

Route::get('executive/processing', function () {
    View::addExtension('html', 'php');
    return View::make('index');
});

Route::get('executive/forms', function () {
    View::addExtension('html', 'php');
    return View::make('index');
});

Route::get('executive/accounts', function () {
    View::addExtension('html', 'php');
    return View::make('index');
});

Route::get('executive/branches', function () {
    View::addExtension('html', 'php');
    return View::make('index');
});

Route::get('executive/client_forms', function () {
    View::addExtension('html', 'php');
    return View::make('index');
}); 

Route::get('executive/clients_form_data', function () {
    View::addExtension('html', 'php');
    return View::make('index');
});

Route::get('executive/printing', function () {
    View::addExtension('html', 'php');
    return View::make('index');
});

Route::get('executive/pdf_printing', function () {
    View::addExtension('html', 'php');
    return View::make('index');
});