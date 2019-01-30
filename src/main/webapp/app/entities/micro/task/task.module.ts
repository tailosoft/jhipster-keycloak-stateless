import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { JhipsterSharedModule } from 'app/shared';
import {
    TaskComponent,
    TaskDetailComponent,
    TaskUpdateComponent,
    TaskDeletePopupComponent,
    TaskDeleteDialogComponent,
    taskRoute,
    taskPopupRoute
} from './';

const ENTITY_STATES = [...taskRoute, ...taskPopupRoute];

@NgModule({
    imports: [JhipsterSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [TaskComponent, TaskDetailComponent, TaskUpdateComponent, TaskDeleteDialogComponent, TaskDeletePopupComponent],
    entryComponents: [TaskComponent, TaskUpdateComponent, TaskDeleteDialogComponent, TaskDeletePopupComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class JhipsterTaskModule {}
