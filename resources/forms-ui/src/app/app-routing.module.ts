import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WelcomePageComponent } from './pages/welcome-page/welcome-page.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { RegisterPageComponent } from './pages/register-page/register-page.component';
import { HomePageComponent } from './pages/dashboard/git-admin/home-page/home-page.component';
import { CreateFormPageComponent } from './pages/dashboard/git-admin/create-form-page/create-form-page.component';
import { ClientHomePageComponent } from './pages/dashboard/client/client-home-page/client-home-page.component';
import { ClientFormMerchantsPageComponent } from './pages/dashboard/client/client-form-merchants-page/client-form-merchants-page.component';
import { ClientListBranchesPageComponent } from './pages/dashboard/client/client-list-branches-page/client-list-branches-page.component';
import { ClientListFormsPageComponent } from './pages/dashboard/client/client-list-forms-page/client-list-forms-page.component';
import { ClientListFormDataPageComponent } from './pages/dashboard/client/client-list-form-data-page/client-list-form-data-page.component';
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
import { ClientUnsentFormsPageComponent } from './pages/dashboard/client/client-unsent-forms-page/client-unsent-forms-page.component';
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

const routes: Routes = [
  {
    path: '',
    component: WelcomePageComponent
  },
  {
    path: 'login',
    component: LoginPageComponent
  },
  {
    path: 'auth',
    component: AuthPageComponent
  },
  {
    path: 'user_auth',
    component: AdminLoginPageComponent
  },
  {
    path: 'client_auth',
    component: ClientAuthPageComponent
  },
  {
    path: 'register',
    component: RegisterPageComponent
  },
  {
    path: 'master_register',
    component: AdminRegisterPageComponent
  },
  {
    path: 'change_password',
    component: ChangePasswordPageComponent
  },
  {
    path: 'git_admin',
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: HomePageComponent
      },
      {
        path: 'setup_form',
        component: CreateFormPageComponent
      },
      {
        path: 'create',
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
            path: 'access_code',
            component: EditAccessCodePageComponent
          }
        ]
      },
      {
        path: 'lists',
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
            path: 'front_desk',
            component: ViewFrontDeskListsPageComponent
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
        component: ClientHomePageComponent
      },
      {
        path: 'form_merchant',
        component: ClientFormMerchantsPageComponent
      },
      {
        path: 'branchs',
        component: ClientListBranchesPageComponent
      },
      {
        path: 'forms',
        component: ClientListFormsPageComponent
      },
      {
        path: 'form_data',
        component: ClientListFormDataPageComponent
      },
      {
        path: 'forms_filled',
        component: ClientFormsHistoryPageComponent
      },
      {
        path: 'form_entry',
        component: ClientFormsEntryPageComponent
      },
      {
        path: 'profile',
        component: ClientProfilePageComponent
      },
      {
        path: 'unsent_forms',
        component: ClientUnsentFormsPageComponent
      }
    ]
  },
  {
    path: 'front_desk',
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
        path: 'lists',
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
          }
        ]
      }
    ]
  },
  {
    path: 'executive',
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
        path: 'forms',
        component: ExecFormsListPageComponent
      },
      {
        path: 'accounts',
        component: ExecAccountsListPageComponent
      },
      {
        path: 'branches',
        component: ExecBranchesListPageComponent
      }
    ]
  },
  {
    path: 'admin',
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: AdminHomePageComponent
      },
      {
        path: 'create',
        children: [
          {
            path: 'form',
            component: AdminCreateFormPageComponent,
          },
          {
            path: 'account',
            component: AdminCreateUserPageComponent
          }
        ]
      },
      {
        path: 'edit',
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
        children: [
          {
            path: 'form',
            component: AdminFormListsPageComponent
          },
          {
            path: 'account',
            component: AdminViewFrontDesksPageComponent
          },
          {
            path: 'branch',
            component: AdminViewBranchesPageComponent
          }
        ]
      },
      {
        path: 'details',
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
    path: 'templates',
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
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
