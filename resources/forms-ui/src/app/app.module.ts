import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { OrderModule } from 'ngx-order-pipe';
import { ClipboardModule } from 'ngx-clipboard';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { SignaturePadModule } from 'ngx-signaturepad';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { CountryPickerModule } from 'ngx-country-picker';
import { NgxPageScrollCoreModule } from 'ngx-page-scroll-core';

import { MatIconModule } from '@angular/material/icon';
import { MatInputModule} from '@angular/material/input';
import { LoadingBarModule } from '@ngx-loading-bar/core';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';
import { NgbModalModule, NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { MatAutocompleteModule, MatSelectModule, MatTabsModule } from '@angular/material';

import { AppComponent } from './app.component';
import { SideBarComponent } from './components/side-bar/side-bar.component';
import { FooterBarComponent } from './components/footer-bar/footer-bar.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { WelcomePageComponent } from './pages/welcome-page/welcome-page.component';
import { RegisterPageComponent } from './pages/register-page/register-page.component';
import { NavigationBarComponent } from './components/navigation-bar/navigation-bar.component';
import { HomePageComponent } from './pages/dashboard/git-admin/home-page/home-page.component';
import { ClientHomePageComponent } from './pages/dashboard/client/client-home-page/client-home-page.component';
import { CreateFormPageComponent } from './pages/dashboard/git-admin/create-form-page/create-form-page.component';
import { ClientFormMerchantsPageComponent } from './pages/dashboard/client/client-form-merchants-page/client-form-merchants-page.component';
import { ClientListFormsPageComponent } from './pages/dashboard/client/client-list-forms-page/client-list-forms-page.component';
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
import { NotFoundPageComponent } from './pages/not-found-page/not-found-page.component';
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
import { AccountVerifiedPageComponent } from './pages/account-verified-page/account-verified-page.component';
import { EmailResetPasswordPageComponent } from './pages/email-reset-password-page/email-reset-password-page.component';
import { FrontDeskRejectedFormsListPageComponent } from './pages/dashboard/front-desk/front-desk-rejected-forms-list-page/front-desk-rejected-forms-list-page.component';
import { AdminSettingsPageComponent } from './pages/dashboard/admin/admin-settings-page/admin-settings-page.component';
import { ExecutivePrintingPageComponent } from './pages/dashboard/executive/executive-printing-page/executive-printing-page.component';
import { ExecutivePdfPrintingPageComponent } from './pages/dashboard/executive/executive-pdf-printing-page/executive-pdf-printing-page.component';
import { ClientPrintingPageComponent } from './pages/dashboard/client/client-printing-page/client-printing-page.component';
import { ClientPdfPrintingPageComponent } from './pages/dashboard/client/client-pdf-printing-page/client-pdf-printing-page.component';
import { InvalidPasswordResetPageComponent } from './pages/invalid-password-reset-page/invalid-password-reset-page.component';
import { ClientFormNewEntryPageComponent } from './pages/dashboard/client/client-form-new-entry-page/client-form-new-entry-page.component';
import { ExecRejectedFormsListPageComponent } from './pages/dashboard/executive/exec-rejected-forms-list-page/exec-rejected-forms-list-page.component';
import { ExecViewAccountDetailsPageComponent } from './pages/dashboard/executive/exec-view-account-details-page/exec-view-account-details-page.component';
import { ExecViewBranchAdminsPageComponent } from './pages/dashboard/executive/exec-view-branch-admins-page/exec-view-branch-admins-page.component';
import { ExecViewCompanyAdminsPageComponent } from './pages/dashboard/executive/exec-view-company-admins-page/exec-view-company-admins-page.component';
import { ExecViewSuperExectivesPageComponent } from './pages/dashboard/executive/exec-view-super-exectives-page/exec-view-super-exectives-page.component';
import { ExecViewBranchExectivesPageComponent } from './pages/dashboard/executive/exec-view-branch-exectives-page/exec-view-branch-exectives-page.component';
import { ExecViewFrontDesksPageComponent } from './pages/dashboard/executive/exec-view-front-desks-page/exec-view-front-desks-page.component';
import { FormsCountryPickerComponent } from './components/forms-country-picker/forms-country-picker.component';
import { ClientFavoriteFormsPageComponent } from './pages/dashboard/client/client-favorite-forms-page/client-favorite-forms-page.component';
import { ClientSuggestMerchantPageComponent } from './pages/dashboard/client/client-suggest-merchant-page/client-suggest-merchant-page.component';
import { ClientDeletedFormsPageComponent } from './pages/dashboard/client/client-deleted-forms-page/client-deleted-forms-page.component';
import { CreateSectorPageComponent } from './pages/dashboard/git-admin/create-sector-page/create-sector-page.component';
import { ViewSectorListPageComponent } from './pages/dashboard/git-admin/view-sector-list-page/view-sector-list-page.component';
import { EditSectorPageComponent } from './pages/dashboard/git-admin/edit-sector-page/edit-sector-page.component';
import { ResetPinPageComponent } from './pages/reset-pin-page/reset-pin-page.component';
import { InvalidResetPinPageComponent } from './pages/invalid-reset-pin-page/invalid-reset-pin-page.component';
import { InvalidLinkPageComponent } from './pages/invalid-link-page/invalid-link-page.component';
import { JoinQueueDialogComponent } from './components/join-queue-dialog/join-queue-dialog.component';
import { AlreadyJoinedQueueDialogComponent } from './components/already-joined-queue-dialog/already-joined-queue-dialog.component';
import { TermsPageComponent } from './pages/terms-page/terms-page.component';
import { PrivacyPageComponent } from './pages/privacy-page/privacy-page.component';
import { ClientPDFDownloadingPageComponent } from './pages/dashboard/client/client-pdfdownloading-page/client-pdfdownloading-page.component';

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
    NotFoundPageComponent,
    AdminViewBranchAdminsPageComponent,
    AdminViewCompanyAdminsPageComponent,
    AdminViewBranchExecutivesPageComponent,
    AdminViewCompanyExecutivesPageComponent,
    FrontDeskClientsFormDataPageComponent,
    InvalidConfirmationPageComponent,
    FrontDeskClientsFormPageComponent,
    ExecClientFormsPageComponent,
    ExecClientsFormsDataPageComponent,
    ClientFormLinkPageComponent,
    ClientFormLinkRedirectPageComponent,
    ResetPasswordPageComponent,
    ClientSettingsPageComponent,
    AccountVerifiedPageComponent,
    EmailResetPasswordPageComponent,
    FrontDeskRejectedFormsListPageComponent,
    AdminSettingsPageComponent,
    ExecutivePrintingPageComponent,
    ExecutivePdfPrintingPageComponent,
    ClientPrintingPageComponent,
    ClientPdfPrintingPageComponent,
    InvalidPasswordResetPageComponent,
    ClientFormNewEntryPageComponent,
    ExecRejectedFormsListPageComponent,
    ExecViewAccountDetailsPageComponent,
    ExecViewBranchAdminsPageComponent,
    ExecViewCompanyAdminsPageComponent,
    ExecViewSuperExectivesPageComponent,
    ExecViewBranchExectivesPageComponent,
    ExecViewFrontDesksPageComponent,
    FormsCountryPickerComponent,
    ClientFavoriteFormsPageComponent,
    ClientSuggestMerchantPageComponent,
    ClientDeletedFormsPageComponent,
    CreateSectorPageComponent,
    ViewSectorListPageComponent,
    EditSectorPageComponent,
    ResetPinPageComponent,
    InvalidResetPinPageComponent,
    InvalidLinkPageComponent,
    JoinQueueDialogComponent,
    AlreadyJoinedQueueDialogComponent,
    TermsPageComponent,
    PrivacyPageComponent,
    ClientPDFDownloadingPageComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    OrderModule,
    ClipboardModule,
    PdfViewerModule,
    SignaturePadModule,
    NgbModule,
    NgbAlertModule,
    NgbModalModule,
    NgxChartsModule,
    MatTabsModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatAutocompleteModule,
    LoadingBarHttpClientModule,
    LoadingBarModule,
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
export class AppModule {
}
