import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { OrderModule } from 'ngx-order-pipe';
import { ClipboardModule } from 'ngx-clipboard';
import { CountryPickerModule } from 'ngx-country-picker';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxPageScrollCoreModule } from 'ngx-page-scroll-core';
import { PdfViewerModule } from 'ng2-pdf-viewer';

import { MatIconModule } from '@angular/material/icon';
import { MatInputModule} from '@angular/material/input';
import { MatAutocompleteModule, MatSelectModule } from '@angular/material';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
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
import { ClientListFormsPageComponent } from './pages/dashboard/client/client-list-forms-page/client-list-forms-page.component';
import { ClientListFormDataPageComponent } from './pages/dashboard/client/client-list-form-data-page/client-list-form-data-page.component';
import { FrontDesktopHomePageComponent } from './pages/dashboard/front-desk/front-desk-home-page/front-desk-home-page.component';
import { CreateCompanyPageComponent } from './pages/dashboard/git-admin/create-company-page/create-company-page.component';
import { CreateBranchPageComponent } from './pages/dashboard/git-admin/create-branch-page/create-branch-page.component';
import { ExecutiveHomePageComponent } from './pages/dashboard/executive/executive-home-page/executive-home-page.component';
import { ExecSubmittedFormsListPageComponent } from './pages/dashboard/executive/exec-submitted-forms-list-page/exec-submitted-forms-list-page.component';
import { ExecProcessedFormsListPageComponent } from './pages/dashboard/executive/exec-processed-forms-list-page/exec-processed-forms-list-page.component';
import { ExecInProcessedFormsListPageComponent } from './pages/dashboard/executive/exec-in-processed-forms-list-page/exec-in-processed-forms-list-page.component';
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
import { FrontDeskSubmittedFormsListPageComponent } from './pages/dashboard/front-desk/front-desk-submitted-forms-list-page/front-desk-submitted-forms-list-page.component';
import { FrontDeskProcessedFormsListPageComponent } from './pages/dashboard/front-desk/front-desk-processed-forms-list-page/front-desk-processed-forms-list-page.component';
import { FrontDeskProcessingFormsListPageComponent } from './pages/dashboard/front-desk/front-desk-processing-forms-list-page/front-desk-processing-forms-list-page.component';
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
import { CreateAccessCodePageComponent } from './pages/dashboard/git-admin/create-access-code-page/create-access-code-page.component';
import { AuthPageComponent } from './pages/auth-page/auth-page.component';
import { AdminLoginPageComponent } from './pages/admin-login-page/admin-login-page.component';
import { CreateSectionPageComponent } from './pages/dashboard/git-admin/create-section-page/create-section-page.component';
import { EditSectionPageComponent } from './pages/dashboard/git-admin/edit-section-page/edit-section-page.component';
import { ViewSectionsPageComponent } from './pages/dashboard/git-admin/view-sections-page/view-sections-page.component';
import { ViewAccessCodePageComponent } from './pages/dashboard/git-admin/view-access-code-page/view-access-code-page.component';
import { EditAccessCodePageComponent } from './pages/dashboard/git-admin/edit-access-code-page/edit-access-code-page.component';
import { FrontDeskPreviewFormPageComponent } from './pages/dashboard/front-desk/front-desk-preview-form-page/front-desk-preview-form-page.component';
import { ExecBranchesListPageComponent } from './pages/dashboard/executive/exec-branches-list-page/exec-branches-list-page.component';
import { ExecAccountsListPageComponent } from './pages/dashboard/executive/exec-accounts-list-page/exec-accounts-list-page.component';
import { ExecFormsListPageComponent } from './pages/dashboard/executive/exec-forms-list-page/exec-forms-list-page.component';
import { ChangePasswordPageComponent } from './pages/change-password-page/change-password-page.component';
import { ClientAuthPageComponent } from './pages/client-auth-page/client-auth-page.component';
import { FormPrintingPageComponent } from './pages/dashboard/front-desk/form-printing-page/form-printing-page.component';
import { ForgotPasswordPageComponent } from './pages/forgot-password-page/forgot-password-page.component';
import { FormPrintingDefaultPageComponent } from './pages/dashboard/front-desk/form-printing-default-page/form-printing-default-page.component';

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
    ClientListFormsPageComponent,
    ClientListFormDataPageComponent,
    FrontDesktopHomePageComponent,
    CreateCompanyPageComponent,
    CreateBranchPageComponent,
    ExecutiveHomePageComponent,
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
    FrontDeskSubmittedFormsListPageComponent,
    FrontDeskProcessedFormsListPageComponent,
    FrontDeskProcessingFormsListPageComponent,
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
    CreateAccessCodePageComponent,
    AuthPageComponent,
    AdminLoginPageComponent,
    CreateSectionPageComponent,
    EditSectionPageComponent,
    ViewSectionsPageComponent,
    ViewAccessCodePageComponent,
    EditAccessCodePageComponent,
    FrontDeskPreviewFormPageComponent,
    ExecBranchesListPageComponent,
    ExecAccountsListPageComponent,
    ExecFormsListPageComponent,
    ChangePasswordPageComponent,
    ClientAuthPageComponent,
    FormPrintingPageComponent,
    ForgotPasswordPageComponent,
    FormPrintingDefaultPageComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    OrderModule,
    ClipboardModule,
    PdfViewerModule,
    NgbModule,
    NgbAlertModule,
    NgbModalModule,
    ReactiveFormsModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
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
