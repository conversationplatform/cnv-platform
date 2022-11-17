import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AnalyticsComponent } from './analytics/analytics.component';
import { InteractionComponent } from './interaction/interaction.component';
import { NoderedComponent } from './nodered/nodered.component';
import { PlaygroundComponent } from './playground/playground.component';
import { SessionDetailsComponent } from './session/session-details/session-details.component';
import { SessionComponent } from './session/session.component';
import { SettingsComponent } from './settings/settings.component';
import { TrackDetailsComponent } from './track/track-details/track-details.component';
import { TrackComponent } from './track/track.component';

const routes: Routes = [
 {
    path: 'analytics',
    component: AnalyticsComponent,
    title: 'Analytics'
  },
  {
    path: 'sessions',
    component: SessionComponent,
    title: 'Sessions',
  },
  {
    path: 'session/:sid',
    component: SessionDetailsComponent,
    title: 'Session',
  },
  {
    path: 'tracks',
    component: TrackComponent,
    title: 'Tracks',
  },
  {
    path: 'track/:tid',
    component: TrackDetailsComponent,
    title: 'Track',
  },
  {
    path: 'interactions',
    component: InteractionComponent,
    title: 'Interactions',
  },
  {
    path: 'playground',
    component: PlaygroundComponent,
    title: 'Playground'

  },
  {
    path: 'playground/:id',
    component: PlaygroundComponent,
    title: 'Playground'

  },
  {
    path: 'nodered',
    component: NoderedComponent,
    title: 'NodeRED'

  },
  {
    path: 'settings',
    component: SettingsComponent,
    title: 'Settings'

  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'analytics'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }