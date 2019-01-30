import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Task } from 'app/shared/model/micro/task.model';
import { TaskService } from './task.service';
import { TaskComponent } from './task.component';
import { TaskDetailComponent } from './task-detail.component';
import { TaskUpdateComponent } from './task-update.component';
import { TaskDeletePopupComponent } from './task-delete-dialog.component';
import { ITask } from 'app/shared/model/micro/task.model';

@Injectable({ providedIn: 'root' })
export class TaskResolve implements Resolve<ITask> {
    constructor(private service: TaskService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Task> {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(
                filter((response: HttpResponse<Task>) => response.ok),
                map((task: HttpResponse<Task>) => task.body)
            );
        }
        return of(new Task());
    }
}

export const taskRoute: Routes = [
    {
        path: 'task',
        component: TaskComponent,
        data: {
            pageTitle: 'Tasks'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'task/:id/view',
        component: TaskDetailComponent,
        resolve: {
            task: TaskResolve
        },
        data: {
            pageTitle: 'Tasks'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'task/new',
        component: TaskUpdateComponent,
        resolve: {
            task: TaskResolve
        },
        data: {
            pageTitle: 'Tasks'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'task/:id/edit',
        component: TaskUpdateComponent,
        resolve: {
            task: TaskResolve
        },
        data: {
            pageTitle: 'Tasks'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const taskPopupRoute: Routes = [
    {
        path: 'task/:id/delete',
        component: TaskDeletePopupComponent,
        resolve: {
            task: TaskResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Tasks'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
