import { NgModule } from '@angular/core';
import { AuthGuard } from './services/auth.guard';
import { Routes, RouterModule } from '@angular/router';

import { LoginPageComponent } from './pages/login-page/login-page.component';
import { WelcomePageComponent } from './pages/welcome-page/welcome-page.component';
import { RegisterPageComponent } from './pages/register-page/register-page.component';
import { HomePageComponent } from './pages/dashboard/git-admin/home-page/home-page.component';
import { CreateFormPageComponent } from './pages/dashboard/git-admin/create-form-page/create-form-page.component';
import { ClientHomePageComponent } from './pages/dashboard/client/client-home-page/client-home-page.component';
import { ClientFormMerchantsPageComponent } from './pages/dashboard/client/client-form-merchants-page/client-form-merchants-page.component';
import { ClientListFormsPageComponent } from './pages/dashboard/client/client-list-forms-page/client-list-forms-page.component';
import { FrontDesktopHomePageComponent } from './pages/dashboard/front-desk/front-desk-home-page/front-desk-home-page.component';
import { CreateCompanyPageComponent } from './pages/dashboard/git-admin/create-company-page/create-company-page.component';
import { CreateBranchPageComponent } from './pages/dashboard/git-admin/create-branch-page/create-branch-page.component';
import { ExecutiveHomePageComponent } from './pages/dashboard/executive/executive-home-page/executive-home-page.component';
import { ExecInProcessedFormsListPageComponent } from './pages/dashboard/executive/exec-in-processed-forms-list-page/exec-in-processed-forms-list-page.component';
import { ExecSubmittedFormsListPageComponent } from './pages/dashboard/executive/exec-submitted-forms-list-page/exec-submitted-forms-list-page.component';
import { ExecProcessedFormsListPageComponent } from './pages/dashboard/executive/exec-processed-forms-list-page/exec-processed-forms-list-page.component';
import { AdminHomePageComponent } from './pages/dashboard/admin/admin-home-page/admin-home-page.component';
import { ClientFormsHistoryPageComponent } from './pages/dashboard/client/client-forms-history-page/client-forms-history-page.component';
import { ClientFormsEntryPageComponent } from './pages/dashboard/client/client-forms-entry-page/client-forms-entry-page.component';
import { FrontDeskViewFormPageComponent } from './pages/dashboard/front-desk/front-desk-view-form-page/front-desk-view-form-page.component';
import { AdminFormListsPageComponent } from './pages/dashboard/admin/admin-form-lists-page/admin-form-lists-page.component';
import { AdminFormEditPageComponent } from './pages/dashboard/admin/admin-form-edit-page/admin-form-edit-page.component';
import { AdminFormViewPageComponent } from './pages/dashboard/admin/admin-form-view-page/admin-form-view-page.component';
import { EditFormPageComponent } from './pages/dashboard/git-admin/edit-form-page/edit-form-page.component';
import { EditBranchPageComponent } from './pages/dashboard/git-admin/edit-branch-page/edit-branch-page.component';
import { EditCompanyPageComponent } from './pages/dashboard/git-admin/edit-company-page/edit-company-page.component';
import { ViewCompanyListsPageComponent } from './pages/dashboard/git-admin/view-company-lists-page/view-company-lists-page.component';
import { ViewAdminListsPageComponent } from './pages/dashboard/git-admin/view-admin-lists-page/view-admin-lists-page.component';
import { ViewExecutiveListsPageComponent } from './pages/dashboard/git-admin/view-executive-lists-page/view-executive-lists-page.component';
import { ViewBranchListsPageComponent } from './pages/dashboard/git-admin/view-branch-lists-page/view-branch-lists-page.component';
import { FrontDeskSubmittedFormsListPageComponent } from './pages/dashboard/front-desk/front-desk-submitted-forms-list-page/front-desk-submitted-forms-list-page.component';
import { FrontDeskProcessingFormsListPageComponent } from './pages/dashboard/front-desk/front-desk-processing-forms-list-page/front-desk-processing-forms-list-page.component';
import { FrontDeskProcessedFormsListPageComponent } from './pages/dashboard/front-desk/front-desk-processed-forms-list-page/front-desk-processed-forms-list-page.component';
import { AdminRegisterPageComponent } from './pages/admin-register-page/admin-register-page.component';
import { CreateUserAccountPageComponent } from './pages/dashboard/git-admin/create-user-page/create-user-page.component';
import { ViewFrontDeskListsPageComponent } from './pages/dashboard/git-admin/view-front-desk-lists-page/view-front-desk-lists-page.component';
import { ViewCompanyAdminListsPageComponent } from './pages/dashboard/git-admin/view-company-admin-lists-page/view-company-admin-lists-page.component';
import { ViewBranchAdminListsPageComponent } from './pages/dashboard/git-admin/view-branch-admin-lists-page/view-branch-admin-lists-page.component';
import { ViewBranchExecutiveListsPageComponent } from './pages/dashboard/git-admin/view-branch-executive-lists-page/view-branch-executive-lists-page.component';
import { EditUserPageComponent } from './pages/dashboard/git-admin/edit-user-page/edit-user-page.component';
import { ViewBranchDetailsPageComponent } from './pages/dashboard/git-admin/view-branch-details-page/view-branch-details-page.component';
import { ViewCompanyDetailsPageComponent } from './pages/dashboard/git-admin/view-company-details-page/view-company-details-page.component';
import { ViewAccountDetailsPageComponent } from './pages/dashboard/git-admin/view-account-details-page/view-account-details-page.component';
import { ViewFormListsPageComponent } from './pages/dashboard/git-admin/view-form-lists-page/view-form-lists-page.component';
import { ViewFormDetailsPageComponent } from './pages/dashboard/git-admin/view-form-details-page/view-form-details-page.component';
import { ClientProfilePageComponent } from './pages/dashboard/client/client-profile-page/client-profile-page.component';
import { AddTemplatePageComponent } from './pages/dashboard/form-templates/add-template-page/add-template-page.component';
import { EditTemplatePageComponent } from './pages/dashboard/form-templates/edit-template-page/edit-template-page.component';
import { ListTemplatePageComponent } from './pages/dashboard/form-templates/list-template-page/list-template-page.component';
import { ViewTemplatePageComponent } from './pages/dashboard/form-templates/view-template-page/view-template-page.component';
import { AdminCreateFormPageComponent } from './pages/dashboard/admin/admin-create-form-page/admin-create-form-page.component';
import { AdminCreateUserPageComponent } from './pages/dashboard/admin/admin-create-user-page/admin-create-user-page.component';
import { AdminEditUserPageComponent } from './pages/dashboard/admin/admin-edit-user-page/admin-edit-user-page.component';
import { AdminViewFrontDesksPageComponent } from './pages/dashboard/admin/admin-view-front-desks-page/admin-view-front-desks-page.component';
import { AdminViewBranchesPageComponent } from './pages/dashboard/admin/admin-view-branches-page/admin-view-branches-page.component';
import { AdminViewAccountDetailsPageComponent } from './pages/dashboard/admin/admin-view-account-details-page/admin-view-account-details-page.component';
import { AdminViewBranchDetailsPageComponent } from './pages/dashboard/admin/admin-view-branch-details-page/admin-view-branch-details-page.component';
import { CreateAccessCodePageComponent } from './pages/dashboard/git-admin/create-access-code-page/create-access-code-page.component';
import { AuthPageComponent } from './pages/auth-page/auth-page.component';
import { AdminLoginPageComponent } from './pages/admin-login-page/admin-login-page.component';
import { CreateSectionPageComponent } from './pages/dashboard/git-admin/create-section-page/create-section-page.component';
import { EditSectionPageComponent } from './pages/dashboard/git-admin/edit-section-page/edit-section-page.component';
import { ViewSectionsPageComponent } from './pages/dashboard/git-admin/view-sections-page/view-sections-page.component';
import { EditAccessCodePageComponent } from './pages/dashboard/git-admin/edit-access-code-page/edit-access-code-page.component';
import { ViewAccessCodePageComponent } from './pages/dashboard/git-admin/view-access-code-page/view-access-code-page.component';
import { FrontDeskPreviewFormPageComponent } from './pages/dashboard/front-desk/front-desk-preview-form-page/front-desk-preview-form-page.component';
import { ExecAccountsListPageComponent } from './pages/dashboard/executive/exec-accounts-list-page/exec-accounts-list-page.component';
import { ExecBranchesListPageComponent } from './pages/dashboard/executive/exec-branches-list-page/exec-branches-list-page.component';
import { ExecFormsListPageComponent } from './pages/dashboard/executive/exec-forms-list-page/exec-forms-list-page.component';
import { ChangePasswordPageComponent } from './pages/change-password-page/change-password-page.component';
import { ClientAuthPageComponent } from './pages/client-auth-page/client-auth-page.component';
import { FormPrintingPageComponent } from './pages/dashboard/front-desk/form-printing-page/form-printing-page.component';
import { ForgotPasswordPageComponent } from './pages/forgot-password-page/forgot-password-page.component';
import { FormPrintingDefaultPageComponent } from './pages/dashboard/front-desk/form-printing-default-page/form-printing-default-page.component';
import { AdminViewBranchAdminsPageComponent } from './pages/dashboard/admin/admin-view-branch-admins-page/admin-view-branch-admins-page.component';
import { AdminViewCompanyAdminsPageComponent } from './pages/dashboard/admin/admin-view-company-admins-page/admin-view-company-admins-page.component';
import { AdminViewBranchExecutivesPageComponent } from './pages/dashboard/admin/admin-view-branch-executives-page/admin-view-branch-executives-page.component';
import { AdminViewCompanyExecutivesPageComponent } from './pages/dashboard/admin/admin-view-company-executives-page/admin-view-company-executives-page.component';
import { FrontDeskClientsFormDataPageComponent } from './pages/dashboard/front-desk/front-desk-clients-form-data-page/front-desk-clients-form-data-page.component';
import { InvalidConfirmationPageComponent } from './pages/invalid-confirmation-page/invalid-confirmation-page.component';
import { FrontDeskClientsFormPageComponent } from './pages/dashboard/front-desk/front-desk-clients-form-page/front-desk-clients-form-page.component';
import { ExecClientFormsPageComponent } from './pages/dashboard/executive/exec-client-forms-page/exec-client-forms-page.component';
import { ExecClientsFormsDataPageComponent } from './pages/dashboard/executive/exec-clients-forms-data-page/exec-clients-forms-data-page.component';
import { ClientFormLinkPageComponent } from './pages/dashboard/client/client-form-link-page/client-form-link-page.component';
import { ClientFormLinkRedirectPageComponent } from './pages/dashboard/client/client-form-link-redirect-page/client-form-link-redirect-page.component';
import { ResetPasswordPageComponent } from './pages/reset-password-page/reset-password-page.component';
import { ClientSettingsPageComponent } from './pages/dashboard/client/client-settings-page/client-settings-page.component';
import { FrontDeskRejectedFormsListPageComponent } from './pages/dashboard/front-desk/front-desk-rejected-forms-list-page/front-desk-rejected-forms-list-page.component';
import { AccountVerifiedPageComponent } from './pages/account-verified-page/account-verified-page.component';
import { EmailResetPasswordPageComponent } from './pages/email-reset-password-page/email-reset-password-page.component';
import { AdminSettingsPageComponent } from './pages/dashboard/admin/admin-settings-page/admin-settings-page.component';
import { ExecutivePrintingPageComponent } from './pages/dashboard/executive/executive-printing-page/executive-printing-page.component';
import { ExecutivePdfPrintingPageComponent } from './pages/dashboard/executive/executive-pdf-printing-page/executive-pdf-printing-page.component';
import { ClientPrintingPageComponent } from './pages/dashboard/client/client-printing-page/client-printing-page.component';
import { ClientPdfPrintingPageComponent } from './pages/dashboard/client/client-pdf-printing-page/client-pdf-printing-page.component';
import { InvalidPasswordResetPageComponent } from './pages/invalid-password-reset-page/invalid-password-reset-page.component';
import { ClientFormNewEntryPageComponent } from './pages/dashboard/client/client-form-new-entry-page/client-form-new-entry-page.component';
import { ExecRejectedFormsListPageComponent } from './pages/dashboard/executive/exec-rejected-forms-list-page/exec-rejected-forms-list-page.component';
import { ExecViewFrontDesksPageComponent } from './pages/dashboard/executive/exec-view-front-desks-page/exec-view-front-desks-page.component';
import { ExecViewBranchAdminsPageComponent } from './pages/dashboard/executive/exec-view-branch-admins-page/exec-view-branch-admins-page.component';
import { ExecViewCompanyAdminsPageComponent } from './pages/dashboard/executive/exec-view-company-admins-page/exec-view-company-admins-page.component';
import { ExecViewSuperExectivesPageComponent } from './pages/dashboard/executive/exec-view-super-exectives-page/exec-view-super-exectives-page.component';
import { ExecViewBranchExectivesPageComponent } from './pages/dashboard/executive/exec-view-branch-exectives-page/exec-view-branch-exectives-page.component';
import { ClientFavoriteFormsPageComponent } from './pages/dashboard/client/client-favorite-forms-page/client-favorite-forms-page.component';
import { ClientSuggestMerchantPageComponent } from './pages/dashboard/client/client-suggest-merchant-page/client-suggest-merchant-page.component';
import { ClientDeletedFormsPageComponent } from './pages/dashboard/client/client-deleted-forms-page/client-deleted-forms-page.component';
import { ExecViewAccountDetailsPageComponent } from './pages/dashboard/executive/exec-view-account-details-page/exec-view-account-details-page.component';
import { CreateSectorPageComponent } from './pages/dashboard/git-admin/create-sector-page/create-sector-page.component';
import { EditSectorPageComponent } from './pages/dashboard/git-admin/edit-sector-page/edit-sector-page.component';
import { ViewSectorListPageComponent } from './pages/dashboard/git-admin/view-sector-list-page/view-sector-list-page.component';
import { ResetPinPageComponent } from './pages/reset-pin-page/reset-pin-page.component';
import { InvalidResetPinPageComponent } from './pages/invalid-reset-pin-page/invalid-reset-pin-page.component';
import { InvalidLinkPageComponent } from './pages/invalid-link-page/invalid-link-page.component';
import { TermsPageComponent } from './pages/terms-page/terms-page.component';
import { PrivacyPageComponent } from './pages/privacy-page/privacy-page.component';
import { ClientPDFDownloadingPageComponent } from './pages/dashboard/client/client-pdfdownloading-page/client-pdfdownloading-page.component';
import { ViewFormCreatorListsPageComponent } from './pages/dashboard/git-admin/view-form-creator-lists-page/view-form-creator-lists-page.component';
import { FormCreatorHomePageComponent } from './pages/dashboard/form-creator/form-creator-home-page/form-creator-home-page.component';

const routes: Routes = [
  { path: '', component: WelcomePageComponent },
  { path: 'login', component: LoginPageComponent },
  { path: 'auth', component: AuthPageComponent },
  { path: 'user_auth', component: AdminLoginPageComponent },
  { path: 'client_auth', component: ClientAuthPageComponent },
  { path: 'register', component: RegisterPageComponent },
  { path: 'forgot', component: ForgotPasswordPageComponent },
  { path: 'reset', component: ResetPasswordPageComponent },
  { path: 'reset_pin', component: ResetPinPageComponent },
  { path: 'master_register', component: AdminRegisterPageComponent },
  { path: 'change_password', component: ChangePasswordPageComponent },
  { path: 'valid_confirm_link', component: AccountVerifiedPageComponent },
  { path: 'invalid_confirm_link', component: InvalidConfirmationPageComponent },
  { path: 'invalid_password_link', component: InvalidPasswordResetPageComponent },
  { path: 'invalid_reset_pin', component: InvalidResetPinPageComponent },
  { path: 'invalid_link', component: InvalidLinkPageComponent },
  { path: 'privacy', component: PrivacyPageComponent },
  {
    path: 'terms',
    component: TermsPageComponent
  },
  {
    path: 'git_admin',
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: HomePageComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'setup_form',
        component: CreateFormPageComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        children: [
          {
            path: 'company',
            component: CreateCompanyPageComponent
          },
          {
            path: 'branch',
            component: CreateBranchPageComponent
          },
          {
            path: 'user_account',
            component: CreateUserAccountPageComponent
          },
          {
            path: 'access_code',
            component: CreateAccessCodePageComponent
          },
          {
            path: 'section',
            component: CreateSectionPageComponent
          },
          {
            path: 'sector',
            component: CreateSectorPageComponent
          }
        ]
      },
      {
        path: 'edit',
        canActivate: [AuthGuard],
        children: [
          {
            path: 'form',
            component: EditFormPageComponent
          },
          {
            path: 'branch',
            component: EditBranchPageComponent
          },
          {
            path: 'company',
            component: EditCompanyPageComponent
          },
          {
            path: 'user_account',
            component: EditUserPageComponent
          },
          {
            path: 'section',
            component: EditSectionPageComponent
          },
          {
            path: 'sector',
            component: EditSectorPageComponent
          },
          {
            path: 'access_code',
            component: EditAccessCodePageComponent
          }
        ]
      },
      {
        path: 'lists',
        canActivate: [AuthGuard],
        children: [
          {
            path: 'company',
            component: ViewCompanyListsPageComponent
          },
          {
            path: 'admin',
            component: ViewAdminListsPageComponent
          },
          {
            path: 'form',
            component: ViewFormListsPageComponent
          },
          {
            path: 'branch_admin',
            component: ViewBranchAdminListsPageComponent
          },
          {
            path: 'company_admin',
            component: ViewCompanyAdminListsPageComponent
          },
          {
            path: 'super_executive',
            component: ViewExecutiveListsPageComponent
          },
          {
            path: 'branch_executive',
            component: ViewBranchExecutiveListsPageComponent
          },
          {
            path: 'branch',
            component: ViewBranchListsPageComponent
          },
          {
            path: 'sector',
            component: ViewSectorListPageComponent
          },
          {
            path: 'front_desk',
            component: ViewFrontDeskListsPageComponent
          },
          {
            path: 'form_creator',
            component: ViewFormCreatorListsPageComponent
          },
          {
            path: 'section',
            component: ViewSectionsPageComponent
          },
          {
            path: 'access_code',
            component: ViewAccessCodePageComponent
          }
        ]
      },
      {
        path: 'details',
        canActivate: [AuthGuard],
        children: [
          {
            path: 'branch',
            component: ViewBranchDetailsPageComponent
          },
          {
            path: 'company',
            component: ViewCompanyDetailsPageComponent
          },
          {
            path: 'user_account',
            component: ViewAccountDetailsPageComponent
          },
          {
            path: 'form',
            component: ViewFormDetailsPageComponent
          }
        ]
      }
    ]
  },
  {
    path: 'client',
    children: [
      {
        path: '',
        pathMatch: 'full',
        canActivate: [AuthGuard],
        component: ClientHomePageComponent,
      },
      {
        path: 'form_merchant',
        canActivate: [AuthGuard],
        component: ClientFormMerchantsPageComponent
      },
      {
        path: 'forms',
        canActivate: [AuthGuard],
        component: ClientListFormsPageComponent
      },
      {
        path: 'forms_filled',
        canActivate: [AuthGuard],
        component: ClientFormsHistoryPageComponent
      },
      {
        path: 'form_entry',
        canActivate: [AuthGuard],
        component: ClientFormsEntryPageComponent
      },
      {
        path: 'fill_form',
        canActivate: [AuthGuard],
        component: ClientFormNewEntryPageComponent
      },
      {
        path: 'form_link',
        component: ClientFormLinkPageComponent
      },
      {
        path: 'profile',
        canActivate: [AuthGuard],
        component: ClientProfilePageComponent
      },
      {
        path: 'favorites',
        canActivate: [AuthGuard],
        component: ClientFavoriteFormsPageComponent
      },
      {
        path: 'deleted',
        canActivate: [AuthGuard],
        component: ClientDeletedFormsPageComponent
      },
      {
        path: 'printing',
        canActivate: [AuthGuard],
        component: ClientPrintingPageComponent
      },
      {
        path: 'downloading',
        canActivate: [AuthGuard],
        component: ClientPDFDownloadingPageComponent
      },
      {
        path: 'suggest_merchant',
        canActivate: [AuthGuard],
        component: ClientSuggestMerchantPageComponent
      },
      {
        path: 'pdf_printing',
        canActivate: [AuthGuard],
        component: ClientPdfPrintingPageComponent
      },
      {
        path: 'form_link_redirect',
        component: ClientFormLinkRedirectPageComponent
      },
      {
        path: 'settings',
        canActivate: [AuthGuard],
        component: ClientSettingsPageComponent
      }
    ]
  },
  {
    path: 'front_desk',
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: FrontDesktopHomePageComponent
      },
      {
        path: 'view_form',
        component: FrontDeskViewFormPageComponent
      },
      {
        path: 'preview',
        component: FrontDeskPreviewFormPageComponent
      },
      {
        path: 'print_form',
        component: FormPrintingPageComponent
      },
      {
        path: 'print_form_default',
        component: FormPrintingDefaultPageComponent
      },
      {
        path: 'lists',
        canActivate: [AuthGuard],
        children: [
          {
            path: 'submitted',
            component: FrontDeskSubmittedFormsListPageComponent
          },
          {
            path: 'processed',
            component: FrontDeskProcessedFormsListPageComponent
          },
          {
            path: 'processing',
            component: FrontDeskProcessingFormsListPageComponent
          },
          {
            path: 'rejected',
            component: FrontDeskRejectedFormsListPageComponent
          },
          {
            path: 'client_forms',
            component: FrontDeskClientsFormPageComponent
          },
          {
            path: 'client_form_data',
            component: FrontDeskClientsFormDataPageComponent
          }
        ]
      }
    ]
  },
  {
    path: 'executive',
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: ExecutiveHomePageComponent
      },
      {
        path: 'submitted',
        component: ExecSubmittedFormsListPageComponent
      },
      {
        path: 'processed',
        component: ExecProcessedFormsListPageComponent
      },
      {
        path: 'processing',
        component: ExecInProcessedFormsListPageComponent
      },
      {
        path: 'rejected',
        component: ExecRejectedFormsListPageComponent
      },
      {
        path: 'forms',
        component: ExecFormsListPageComponent
      },
      {
        path: 'accounts',
        component: ExecAccountsListPageComponent
      },
      {
        path: 'account_details',
        component: ExecViewAccountDetailsPageComponent
      },
      {
        path: 'branches',
        component: ExecBranchesListPageComponent
      },
      {
        path: 'client_forms',
        component: ExecClientFormsPageComponent
      },
      {
        path: 'clients_form_data',
        component: ExecClientsFormsDataPageComponent
      },
      {
        path: 'printing',
        component: ExecutivePrintingPageComponent
      },
      {
        path: 'pdf_printing',
        component: ExecutivePdfPrintingPageComponent
      },
      {
        path: 'lists',
        children: [
          {
            path: 'front_desk',
            component: ExecViewFrontDesksPageComponent
          },
          {
            path: 'branch_admin',
            component: ExecViewBranchAdminsPageComponent
          },
          {
            path: 'company_admin',
            component: ExecViewCompanyAdminsPageComponent
          },
          {
            path: 'super_executive',
            component: ExecViewSuperExectivesPageComponent
          },
          {
            path: 'branch_executive',
            component: ExecViewBranchExectivesPageComponent
          }
        ]
      }
    ]
  },
  {
    path: 'admin',
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: AdminHomePageComponent
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        children: [
          {
            path: 'form',
            component: AdminCreateFormPageComponent
          },
          {
            path: 'account',
            component: AdminCreateUserPageComponent
          }
        ]
      },
      {
        path: 'edit',
        canActivate: [AuthGuard],
        children: [
          {
            path: 'form',
            component: AdminFormEditPageComponent
          },
          {
            path: 'account',
            component: AdminEditUserPageComponent
          }
        ]
      },
      {
        path: 'lists',
        canActivate: [AuthGuard],
        children: [
          {
            path: 'form',
            component: AdminFormListsPageComponent
          },
          {
            path: 'front_desk',
            component: AdminViewFrontDesksPageComponent
          },
          {
            path: 'branch',
            component: AdminViewBranchesPageComponent
          },
          {
            path: 'branch_admin',
            component: AdminViewBranchAdminsPageComponent
          },
          {
            path: 'company_admin',
            component: AdminViewCompanyAdminsPageComponent
          },
          {
            path: 'branch_executive',
            component: AdminViewBranchExecutivesPageComponent
          },
          {
            path: 'super_executive',
            component: AdminViewCompanyExecutivesPageComponent
          },
          {
            path: 'settings',
            component: AdminSettingsPageComponent
          }
        ]
      },
      {
        path: 'details',
        canActivate: [AuthGuard],
        children: [
          {
            path: 'form',
            component: AdminFormViewPageComponent
          },
          {
            path: 'account',
            component: AdminViewAccountDetailsPageComponent
          },
          {
            path: 'branch',
            component: AdminViewBranchDetailsPageComponent
          }
        ]
      }
    ]
  },
  {
    path: 'form_creator',
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: FormCreatorHomePageComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'create',
        children: [
          {
            path: 'form',
            component: CreateFormPageComponent
          },
          {
            path: 'section',
            component: CreateSectionPageComponent
          }
        ]
      },
      {
        path: 'edit',
        children: [
          {
            path: 'form',
            component: EditFormPageComponent
          },
          {
            path: 'section',
            component: EditSectionPageComponent
          }
        ]
      },
      {
        path: 'list',
        children: [
          {
            path: 'forms',
            component: ViewFormListsPageComponent
          },
          {
            path: 'sections',
            component: ViewSectionsPageComponent
          }
        ]
      }
    ]
  },
  {
    path: 'templates',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'create',
        component: AddTemplatePageComponent
      },
      {
        path: 'edit',
        component: EditTemplatePageComponent
      },
      {
        path: 'list',
        component: ListTemplatePageComponent
      },
      {
        path: 'view',
        component: ViewTemplatePageComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
