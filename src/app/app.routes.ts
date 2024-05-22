import { Routes } from '@angular/router';
import { LoginComponent } from '../login/login.component';
import { IslandComponent } from '../island/island.component';
import { AppComponent } from './app.component';
import { HomepageComponent } from '../homepage/homepage.component';

export const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                component: HomepageComponent,
            },
            {
                path: 'login',
                component: LoginComponent,
            },
            {
                path: 'island/:id',
                component: IslandComponent
            }
        ]
    },
];
