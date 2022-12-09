import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { ActiveConnectionsComponent } from './widgets/stats/active-connections/active-connections.component';
import { MaterialModule } from '../material.module';
import { ActiveFlowsComponent } from './analytics/active-flows/active-flows.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { AnalyticsComponent } from './analytics/analytics.component';
import { NoderedComponent } from './nodered/nodered.component';
import { PlaygroundComponent } from './playground/playground.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComponentsModule } from '../components/components.module';
import { TabsComponent } from './playground/tabs/tabs.component';
import { FlowsComponent } from './analytics/flows/flows.component';
import { TimeframeTableComponent } from './analytics/timeframe-table/timeframe-table.component';
import { PieChartComponent } from './analytics/timeframe-table/pie-chart/pie-chart.component';
import { CumulativeGraphComponent } from './analytics/timeframe-table/cumulative-graph/cumulative-graph.component';
import { MapComponent } from './analytics/timeframe-table/map/map.component';
import { TrackComponent } from './track/track.component';
import { TrackListComponent } from './track/track-list/track-list.component';
import { TrackDetailsComponent } from './track/track-details/track-details.component';
import { TrackDescriptionComponent } from './track/track-description/track-description.component';
import { SessionDescriptionComponent } from './session/session-description/session-description.component';
import { SessionComponent } from './session/session.component';
import { SessionDetailsComponent } from './session/session-details/session-details.component';
import { SessionListComponent } from './session/session-list/session-list.component';
import { InteractionComponent } from './interaction/interaction.component';
import { InteractionListComponent } from './interaction/interaction-list/interaction-list.component';
import { InteractionRawComponent } from './interaction/interaction-raw/interaction-raw.component';
import { SettingsComponent } from './settings/settings.component';

@NgModule({
  declarations: [
    DashboardComponent,
    ActiveConnectionsComponent,
    ActiveFlowsComponent,
    SidenavComponent,
    ToolbarComponent,
    AnalyticsComponent,
    NoderedComponent,
    PlaygroundComponent,
    TabsComponent,
    FlowsComponent,
    TimeframeTableComponent,
    PieChartComponent,
    CumulativeGraphComponent,
    MapComponent,
    SessionComponent,
    SessionDetailsComponent,
    TrackComponent,
    TrackListComponent,
    TrackDetailsComponent,
    TrackDescriptionComponent,
    SessionDescriptionComponent,
    SessionListComponent,
    InteractionComponent,
    InteractionListComponent,
    InteractionRawComponent,
    SettingsComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    ComponentsModule,
  ]
})
export class DashboardModule { }
