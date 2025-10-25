import { Routes } from '@angular/router';
import { HomeComponent } from './components/manage/home/home.component';
import { MembertypeComponent } from './components/manage/membertype/membertype.component';
import { MembertypeFormComponent } from './components/manage/membertype-form/membertype-form.component';
import { MembersComponent } from './components/manage/members/members.component';
import { MembersformComponent } from './components/manage/membersform/membersform.component';
import { MemberprofileComponent } from './components/manage/memberprofile/memberprofile.component';
import { MembershipcardComponent } from './components/manage/membershipcard/membershipcard.component';
import { RenewalComponent } from './components/manage/renewal/renewal.component';
import { RenewaltableComponent } from './components/manage/renewaltable/renewaltable.component';
import { MembershipreportComponent } from './components/manage/membershipreport/membershipreport.component';
import { RevenuereportComponent } from './components/manage/revenuereport/revenuereport.component';
import { LoginComponent } from './components/manage/login/login.component';
import { authGuard } from './auth.guard';
import { SettingsComponent } from './components/manage/settings/settings.component';
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout.component';
import { AdminLayoutComponent } from './layout/admin-layout/admin-layout.component';

export const routes: Routes = [
    {
        path: '',
        component: AuthLayoutComponent, // Layout for unauthenticated routes
        children: [
          { path: 'admin/login', component: LoginComponent },
          { path: '', redirectTo: 'admin/login', pathMatch: 'full' },
        ],
      },
      {
        path: 'admin',
        component: AdminLayoutComponent, // Layout for authenticated admin pages
        canActivate: [authGuard], // Protect all routes under this layout
        children: [
          { path: 'home', component: HomeComponent},
          { path: 'membertypes', component: MembertypeComponent, data: { title: 'Manage Membership Types' } },
          { path: 'membertypes/add', component: MembertypeFormComponent, data: { title: 'Add Membership Type' } },
          { path: 'membertypes/:id', component: MembertypeFormComponent },
          { path: 'members', component: MembersComponent, data: { title: 'Manage Members' } },
          { path: 'members/add', component: MembersformComponent, data: { title: 'Add Members' } },
          { path: 'members/:id', component: MembersformComponent },
          { path: 'membership/:id', component: MemberprofileComponent },
          { path: 'membershipcard', component: MembershipcardComponent },
          { path: 'membershipcard/:id', component: MembershipcardComponent },
          { path: 'renewal', component: RenewalComponent },
          { path: 'renewal/:id', component: RenewalComponent },
          { path: 'renewaltable', component: RenewaltableComponent },
          { path: 'report', component: MembershipreportComponent },
          { path: 'revenuereport', component: RevenuereportComponent },
          { path: 'settings', component: SettingsComponent },
          { path: 'settings/:userId', component: SettingsComponent },
        ],
      },
      { path: '**', redirectTo: 'admin/login' },
];
