import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { OrderModule } from 'ngx-order-pipe';
import { CountryPickerModule } from 'ngx-country-picker';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxPageScrollCoreModule } from 'ngx-page-scroll-core';

import { MatAutocompleteModule } from '@angular/material';
import { NgbModalModule, NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { SideBarComponent } from './components/side-bar/side-bar.component';
import { FooterBarComponent } from './components/footer-bar/footer-bar.component';
import { NavigationBarComponent } from './components/navigation-bar/navigation-bar.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { WelcomePageComponent } from './pages/welcome-page/welcome-page.component';
import { RegisterPageComponent } from './pages/register-page/register-page.component';
import { HomePageComponent } from './pages/dashboard/git-admin/home-page/home-page.component';
import { ClientHomePageComponent } from './pages/dashboard/client/client-home-page/client-home-page.component';
import { CreateFormPageComponent } from './pages/dashboard/git-admin/create-form-page/create-form-page.component';
import { ClientFormMerchantsPageComponent } from './pages/dashboard/client/client-form-merchants-page/client-form-merchants-page.component';
import { ClientListBranchesPageComponent } from './pages/dashboard/client/client-list-branches-page/client-list-branches-page.component';
import { ClientListFormsPageComponent } from './pages/dashboard/client/client-list-forms-page/client-list-forms-page.component';
import { ClientListFormDataPageComponent } from './pages/dashboard/client/client-list-form-data-page/client-list-form-data-page.component';
import { FrontDesktopHomePageComponent } from './pages/dashboard/front-desk/front-desk-home-page/front-desk-home-page.component';
import { CreateCompanyPageComponent } from './pages/dashboard/git-admin/create-company-page/create-company-page.component';
import { CreateBranchPageComponent } from './pages/dashboard/git-admin/create-branch-page/create-branch-page.component';
import { ExecSubmittedFormsPageComponent } from './pages/dashboard/branch-executive/exec-submitted-forms-page/exec-submitted-forms-page.component';
import { ExecutiveHomePageComponent } from './pages/dashboard/branch-executive/executive-home-page/executive-home-page.component';
import { ExecProcessedFormsPageComponent } from './pages/dashboard/branch-executive/exec-processed-forms-page/exec-processed-forms-page.component';
import { ExecInProcessedFormsPageComponent } from './pages/dashboard/branch-executive/exec-in-processed-forms-page/exec-in-processed-forms-page.component';
import { ExecSubmittedFormsListPageComponent } from './pages/dashboard/branch-executive/exec-submitted-forms-list-page/exec-submitted-forms-list-page.component';
import { ExecProcessedFormsListPageComponent } from './pages/dashboard/branch-executive/exec-processed-forms-list-page/exec-processed-forms-list-page.component';
import { ExecInProcessedFormsListPageComponent } from './pages/dashboard/branch-executive/exec-in-processed-forms-list-page/exec-in-processed-forms-list-page.component';
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
import { ViewAdminListsPageComponent } from './pages/dashboard/git-admin/view-admin-lists-page/view-admin-lists-page.component';
import { ViewBranchListsPageComponent } from './pages/dashboard/git-admin/view-branch-lists-page/view-branch-lists-page.component';
import { ViewCompanyListsPageComponent } from './pages/dashboard/git-admin/view-company-lists-page/view-company-lists-page.component';
import { ViewExecutiveListsPageComponent } from './pages/dashboard/git-admin/view-executive-lists-page/view-executive-lists-page.component';
import { FrontDeskSubmittedFormsPageComponent } from './pages/dashboard/front-desk/front-desk-submitted-forms-page/front-desk-submitted-forms-page.component';
import { FrontDeskSubmittedFormsListPageComponent } from './pages/dashboard/front-desk/front-desk-submitted-forms-list-page/front-desk-submitted-forms-list-page.component';
import { FrontDeskProcessedFormsPageComponent } from './pages/dashboard/front-desk/front-desk-processed-forms-page/front-desk-processed-forms-page.component';
import { FrontDeskProcessedFormsListPageComponent } from './pages/dashboard/front-desk/front-desk-processed-forms-list-page/front-desk-processed-forms-list-page.component';
import { FrontDeskProcessingFormsListPageComponent } from './pages/dashboard/front-desk/front-desk-processing-forms-list-page/front-desk-processing-forms-list-page.component';
import { FrontDeskProcessingFormsPageComponent } from './pages/dashboard/front-desk/front-desk-processing-forms-page/front-desk-processing-forms-page.component';
import { AdminRegisterPageComponent } from './pages/admin-register-page/admin-register-page.component';
import { UserAccountCreatorComponent } from './pages/dashboard/user-account-creator/user-account-creator.component';
import { CreateUserAccountPageComponent } from './pages/dashboard/git-admin/create-user-page/create-user-page.component';
import { ViewFrontDeskListsPageComponent } from './pages/dashboard/git-admin/view-front-desk-lists-page/view-front-desk-lists-page.component';
import { ViewCompanyAdminListsPageComponent } from './pages/dashboard/git-admin/view-company-admin-lists-page/view-company-admin-lists-page.component';
import { ViewAccountListsPageComponent } from './pages/dashboard/git-admin/view-account-lists-page/view-account-lists-page.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ViewBranchAdminListsPageComponent } from './pages/dashboard/git-admin/view-branch-admin-lists-page/view-branch-admin-lists-page.component';
import { ViewBranchExecutiveListsPageComponent } from './pages/dashboard/git-admin/view-branch-executive-lists-page/view-branch-executive-lists-page.component';
import { EditUserPageComponent } from './pages/dashboard/git-admin/edit-user-page/edit-user-page.component';
import { UserAccountEditorComponent } from './pages/dashboard/user-account-editor/user-account-editor.component';
import { ViewAccountDetailsPageComponent } from './pages/dashboard/git-admin/view-account-details-page/view-account-details-page.component';
import { ViewCompanyDetailsPageComponent } from './pages/dashboard/git-admin/view-company-details-page/view-company-details-page.component';
import { ViewBranchDetailsPageComponent } from './pages/dashboard/git-admin/view-branch-details-page/view-branch-details-page.component';
import { ViewFormListsPageComponent } from './pages/dashboard/git-admin/view-form-lists-page/view-form-lists-page.component';
import { ViewFormDetailsPageComponent } from './pages/dashboard/git-admin/view-form-details-page/view-form-details-page.component';
import { ClientProfilePageComponent } from './pages/dashboard/client/client-profile-page/client-profile-page.component';
import { ClientUnsentFormsPageComponent } from './pages/dashboard/client/client-unsent-forms-page/client-unsent-forms-page.component';
import { AddTemplatePageComponent } from './pages/dashboard/form-templates/add-template-page/add-template-page.component';
import { EditTemplatePageComponent } from './pages/dashboard/form-templates/edit-template-page/edit-template-page.component';
import { ListTemplatePageComponent } from './pages/dashboard/form-templates/list-template-page/list-template-page.component';
import { ViewTemplatePageComponent } from './pages/dashboard/form-templates/view-template-page/view-template-page.component';
import { AdminViewFrontDesksPageComponent } from './pages/dashboard/admin/admin-view-front-desks-page/admin-view-front-desks-page.component';
import { AdminViewBranchesPageComponent } from './pages/dashboard/admin/admin-view-branches-page/admin-view-branches-page.component';
import { AdminCreateFormPageComponent } from './pages/dashboard/admin/admin-create-form-page/admin-create-form-page.component';
import { AdminCreateUserPageComponent } from './pages/dashboard/admin/admin-create-user-page/admin-create-user-page.component';
import { AdminEditUserPageComponent } from './pages/dashboard/admin/admin-edit-user-page/admin-edit-user-page.component';
import { AdminViewAccountDetailsPageComponent } from './pages/dashboard/admin/admin-view-account-details-page/admin-view-account-details-page.component';
import { AdminViewBranchDetailsPageComponent } from './pages/dashboard/admin/admin-view-branch-details-page/admin-view-branch-details-page.component';
import { BranchAdminHomePageComponent } from './pages/dashboard/branch-admin/branch-admin-home-page/branch-admin-home-page.component';
import { BranchAdminCreateUserPageComponent } from './pages/dashboard/branch-admin/branch-admin-create-user-page/branch-admin-create-user-page.component';
import { BranchAdminEditUserPageComponent } from './pages/dashboard/branch-admin/branch-admin-edit-user-page/branch-admin-edit-user-page.component';
import { CreateAccessCodePageComponent } from './pages/dashboard/git-admin/create-access-code-page/create-access-code-page.component';
import { AuthPageComponent } from './pages/auth-page/auth-page.component';

@NgModule({
  declarations: [
    AppComponent,
    SideBarComponent,
    FooterBarComponent,
    NavigationBarComponent,
    LoginPageComponent,
    WelcomePageComponent,
    RegisterPageComponent,
    HomePageComponent,
    CreateFormPageComponent,
    ClientHomePageComponent,
    ClientFormMerchantsPageComponent,
    ClientListBranchesPageComponent,
    ClientListFormsPageComponent,
    ClientListFormDataPageComponent,
    FrontDesktopHomePageComponent,
    CreateCompanyPageComponent,
    CreateBranchPageComponent,
    ExecSubmittedFormsPageComponent,
    ExecutiveHomePageComponent,
    ExecProcessedFormsPageComponent,
    ExecInProcessedFormsPageComponent,
    ExecSubmittedFormsListPageComponent,
    ExecProcessedFormsListPageComponent,
    ExecInProcessedFormsListPageComponent,
    AdminHomePageComponent,
    ClientFormsHistoryPageComponent,
    ClientFormsEntryPageComponent,
    FrontDeskViewFormPageComponent,
    AdminFormListsPageComponent,
    AdminFormEditPageComponent,
    AdminFormViewPageComponent,
    EditFormPageComponent,
    EditBranchPageComponent,
    EditCompanyPageComponent,
    ViewAdminListsPageComponent,
    ViewBranchListsPageComponent,
    ViewCompanyListsPageComponent,
    ViewExecutiveListsPageComponent,
    FrontDeskSubmittedFormsPageComponent,
    FrontDeskSubmittedFormsListPageComponent,
    FrontDeskProcessedFormsPageComponent,
    FrontDeskProcessedFormsListPageComponent,
    FrontDeskProcessingFormsListPageComponent,
    FrontDeskProcessingFormsPageComponent,
    AdminRegisterPageComponent,
    UserAccountCreatorComponent,
    CreateUserAccountPageComponent,
    ViewFrontDeskListsPageComponent,
    ViewCompanyAdminListsPageComponent,
    ViewAccountListsPageComponent,
    ViewBranchAdminListsPageComponent,
    ViewBranchExecutiveListsPageComponent,
    EditUserPageComponent,
    UserAccountEditorComponent,
    ViewAccountDetailsPageComponent,
    ViewCompanyDetailsPageComponent,
    ViewBranchDetailsPageComponent,
    ViewFormListsPageComponent,
    ViewFormDetailsPageComponent,
    ClientProfilePageComponent,
    ClientUnsentFormsPageComponent,
    AddTemplatePageComponent,
    EditTemplatePageComponent,
    ListTemplatePageComponent,
    ViewTemplatePageComponent,
    AdminViewFrontDesksPageComponent,
    AdminViewBranchesPageComponent,
    AdminCreateFormPageComponent,
    AdminCreateUserPageComponent,
    AdminEditUserPageComponent,
    AdminViewAccountDetailsPageComponent,
    AdminViewBranchDetailsPageComponent,
    BranchAdminHomePageComponent,
    BranchAdminCreateUserPageComponent,
    BranchAdminEditUserPageComponent,
    CreateAccessCodePageComponent,
    AuthPageComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    OrderModule,
    NgbModule,
    NgbAlertModule,
    NgbModalModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    CountryPickerModule.forRoot({
      baseUrl: 'assets/',
      filename: 'countries.json'
    }),
    BrowserAnimationsModule,
    NgxPageScrollCoreModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
