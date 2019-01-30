/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { JhipsterTestModule } from '../../../../test.module';
import { TaskComponent } from 'app/entities/micro/task/task.component';
import { TaskService } from 'app/entities/micro/task/task.service';
import { Task } from 'app/shared/model/micro/task.model';

describe('Component Tests', () => {
    describe('Task Management Component', () => {
        let comp: TaskComponent;
        let fixture: ComponentFixture<TaskComponent>;
        let service: TaskService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [JhipsterTestModule],
                declarations: [TaskComponent],
                providers: []
            })
                .overrideTemplate(TaskComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(TaskComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(TaskService);
        });

        it('Should call load all on init', () => {
            // GIVEN
            const headers = new HttpHeaders().append('link', 'link;link');
            spyOn(service, 'query').and.returnValue(
                of(
                    new HttpResponse({
                        body: [new Task(123)],
                        headers
                    })
                )
            );

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.query).toHaveBeenCalled();
            expect(comp.tasks[0]).toEqual(jasmine.objectContaining({ id: 123 }));
        });
    });
});
