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
import { ExecSubmittedFormsPageComponent } from './pages/dashboard/executive/exec-submitted-forms-page/exec-submitted-forms-page.component';
import { ExecProcessedFormsPageComponent } from './pages/dashboard/executive/exec-processed-forms-page/exec-processed-forms-page.component';
import { ExecInProcessedFormsPageComponent } from './pages/dashboard/executive/exec-in-processed-forms-page/exec-in-processed-forms-page.component';
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
import { FrontDeskSubmittedFormsPageComponent } from './pages/dashboard/front-desk/front-desk-submitted-forms-page/front-desk-submitted-forms-page.component';
import { FrontDeskProcessingFormsPageComponent } from './pages/dashboard/front-desk/front-desk-processing-forms-page/front-desk-processing-forms-page.component';
import { FrontDeskProcessedFormsPageComponent } from './pages/dashboard/front-desk/front-desk-processed-forms-page/front-desk-processed-forms-page.component';
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
    path: 'register',
    component: RegisterPageComponent
  },
  {
    path: 'master_register',
    component: AdminRegisterPageComponent
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
          }
        ]
      },
      {
        path: 'edit',
        children: [
          {
            path: 'form/:id',
            component: EditFormPageComponent
          },
          {
            path: 'branch/:id',
            component: EditBranchPageComponent
          },
          {
            path: 'company/:id',
            component: EditCompanyPageComponent
          },
          {
            path: 'user_account',
            component: EditUserPageComponent
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
        path: 'forms/:company',
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
        path: 'form_entry/:form',
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
        path: 'submitted',
        component: FrontDeskSubmittedFormsPageComponent
      },
      {
        path: 'processing',
        component: FrontDeskProcessingFormsPageComponent
      },
      {
        path: 'processed',
        component: FrontDeskProcessedFormsPageComponent
      },
      {
        path: 'lists',
        children: [
          {
            path: 'submitted',
            component: FrontDeskSubmittedFormsListPageComponent
          },
          {
            path: 'processing',
            component: FrontDeskProcessingFormsListPageComponent
          },
          {
            path: 'processed',
            component: FrontDeskProcessedFormsListPageComponent
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
        component: ExecSubmittedFormsPageComponent
      },
      {
        path: 'processed',
        component: ExecProcessedFormsPageComponent
      },
      {
        path: 'processing',
        component: ExecInProcessedFormsPageComponent
      },
      {
        path: 'submitted_list/:type',
        component: ExecSubmittedFormsListPageComponent
      },
      {
        path: 'processed_list/:type',
        component: ExecProcessedFormsListPageComponent
      },
      {
        path: 'processing_list/:type',
        component: ExecInProcessedFormsListPageComponent
      },
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
        path: 'setup_form',
        component: CreateFormPageComponent
      },
      {
        path: 'form_lists',
        component: AdminFormListsPageComponent
      },
      {
        path: 'edit_form',
        component: AdminFormEditPageComponent
      },
      {
        path: 'view_form',
        component: AdminFormViewPageComponent
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
