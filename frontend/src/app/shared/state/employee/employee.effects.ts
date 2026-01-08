import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError, tap, withLatestFrom, switchMap, exhaustMap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import * as EmployeeActions from './employee.actions';
import { EmployeeTask, EmployeeNotification, EmployeeProfile } from '../../models/employee.model';
import { selectEmployeeProfile, selectEmployeeState } from './employee.selector';
//import { environment } from '../../../environments/environment';
//import { AppState} from '../../app.state';

@Injectable()
export class EmployeeEffects {
  private apiUrl = 'http://localhost:8082/api'; // Remplacez par votre URL d'API

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private store: Store,
    private router: Router
  ) {}

  // Charger le profil de l'employé
  loadEmployeeProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EmployeeActions.loadEmployeeProfile),
      exhaustMap(() =>
        this.http.get<EmployeeProfile>(`${this.apiUrl}/employee/profile`).pipe(
          map(profile => EmployeeActions.loadEmployeeProfileSuccess({ profile })),
          catchError(error => of(EmployeeActions.loadEmployeeProfileFailure({ 
            error: error.error?.message || 'Échec du chargement du profil' 
          })))
        )
      )
    )
  );

  // Mettre à jour le profil de l'employé
  updateEmployeeProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EmployeeActions.updateEmployeeProfile),
      mergeMap(({ profile }) =>
        this.http.patch<EmployeeProfile>(`${this.apiUrl}/employee/profile`, profile).pipe(
          map(updatedProfile => EmployeeActions.updateEmployeeProfileSuccess({ profile: updatedProfile })),
          catchError(error => of(EmployeeActions.updateEmployeeProfileFailure({ 
            error: error.error?.message || 'Échec de la mise à jour du profil' 
          })))
        )
      )
    )
  );

  // Charger les tâches de l'employé
  loadEmployeeTasks$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EmployeeActions.loadEmployeeTasks),
      withLatestFrom(this.store.select(selectEmployeeProfile)),
      switchMap(([_, profile]) => {
        if (!profile?.id) {
          return of(EmployeeActions.loadEmployeeTasksFailure({ 
            error: 'Profil employé non trouvé' 
          }));
        }
        
        return this.http.get<EmployeeTask[]>(`${this.apiUrl}/employee/tasks`, {
          params: { employeeId: profile.id }
        }).pipe(
          map(tasks => EmployeeActions.loadEmployeeTasksSuccess({ tasks })),
          catchError(error => of(EmployeeActions.loadEmployeeTasksFailure({ 
            error: error.error?.message || 'Échec du chargement des tâches' 
          })))
        );
      })
    )
  );

  // Mettre à jour le statut d'une tâche
  updateTaskStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EmployeeActions.updateTaskStatus),
      mergeMap(({ taskId, status, startTime, endTime, notes }) =>
        this.http.patch<EmployeeTask>(`${this.apiUrl}/employee/tasks/${taskId}/status`, {
          status,
          startTime,
          endTime,
          notes
        }).pipe(
          map(task => EmployeeActions.updateTaskStatusSuccess({ task })),
          catchError(error => of(EmployeeActions.updateTaskStatusFailure({ 
            error: error.error?.message || 'Échec de la mise à jour du statut' 
          })))
        )
      )
    )
  );

  // Charger les notifications
  loadNotifications$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EmployeeActions.loadNotifications),
      withLatestFrom(this.store.select(selectEmployeeProfile)),
      switchMap(([_, profile]) => {
        if (!profile?.id) {
          return of(EmployeeActions.loadNotificationsFailure({ 
            error: 'Profil employé non trouvé' 
          }));
        }
        
        return this.http.get<EmployeeNotification[]>(`${this.apiUrl}/employee/notifications`, {
          params: { employeeId: profile.id }
        }).pipe(
          map(notifications => EmployeeActions.loadNotificationsSuccess({ notifications })),
          catchError(error => of(EmployeeActions.loadNotificationsFailure({ 
            error: error.error?.message || 'Échec du chargement des notifications' 
          })))
        );
      })
    )
  );

  // Marquer une notification comme lue
  markNotificationAsRead$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EmployeeActions.markNotificationAsRead),
      mergeMap(({ notificationId }) =>
        this.http.patch(`${this.apiUrl}/employee/notifications/${notificationId}/read`, {}).pipe(
          map(() => EmployeeActions.markNotificationAsReadSuccess({ notificationId })),
          catchError(error => of(EmployeeActions.markNotificationAsReadFailure({ 
            error: error.error?.message || 'Échec du marquage de la notification' 
          })))
        )
      )
    )
  );

  // Marquer toutes les notifications comme lues
  markAllNotificationsAsRead$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EmployeeActions.markAllNotificationsAsRead),
      withLatestFrom(this.store.select(selectEmployeeProfile)),
      switchMap(([_, profile]) => {
        if (!profile?.id) {
          return of(EmployeeActions.markAllNotificationsAsReadFailure({ 
            error: 'Profil employé non trouvé' 
          }));
        }
        
        return this.http.post(`${this.apiUrl}/employee/notifications/mark-all-read`, {
          employeeId: profile.id
        }).pipe(
          map(() => EmployeeActions.markAllNotificationsAsReadSuccess()),
          catchError(error => of(EmployeeActions.markAllNotificationsAsReadFailure({ 
            error: error.error?.message || 'Échec du marquage des notifications' 
          })))
        );
      })
    )
  );

  // Effacer toutes les notifications
  clearAllNotifications$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EmployeeActions.clearAllNotifications),
      withLatestFrom(this.store.select(selectEmployeeProfile)),
      switchMap(([_, profile]) => {
        if (!profile?.id) {
          return of(EmployeeActions.clearAllNotificationsFailure({ 
            error: 'Profil employé non trouvé' 
          }));
        }
        
        return this.http.delete(`${this.apiUrl}/employee/notifications`, {
          params: { employeeId: profile.id }
        }).pipe(
          map(() => EmployeeActions.clearAllNotificationsSuccess()),
          catchError(error => of(EmployeeActions.clearAllNotificationsFailure({ 
            error: error.error?.message || 'Échec de la suppression des notifications' 
          })))
        );
      })
    )
  );

  // Effet pour charger automatiquement les données après connexion
  loadEmployeeDataAfterProfileSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EmployeeActions.loadEmployeeProfileSuccess),
      mergeMap(() => [
        EmployeeActions.loadEmployeeTasks(),
        EmployeeActions.loadNotifications()
      ])
    )
  );

  // Effet pour recharger après mise à jour de statut
  refreshAfterTaskUpdate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EmployeeActions.updateTaskStatusSuccess),
      map(() => EmployeeActions.loadEmployeeTasks())
    )
  );

  // Gestion des erreurs - afficher des notifications
  handleErrors$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        EmployeeActions.loadEmployeeProfileFailure,
        EmployeeActions.updateEmployeeProfileFailure,
        EmployeeActions.loadEmployeeTasksFailure,
        EmployeeActions.updateTaskStatusFailure,
        EmployeeActions.loadNotificationsFailure,
        EmployeeActions.markNotificationAsReadFailure,
        EmployeeActions.markAllNotificationsAsReadFailure,
        EmployeeActions.clearAllNotificationsFailure
      ),
      tap(({ error }) => {
        console.error('Erreur employé:', error);
        // Ici vous pourriez afficher une notification toast
        // this.notificationService.showError(error);
      })
    ),
    { dispatch: false }
  );

  // Effet pour la navigation après certaines actions
  navigateOnActions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        EmployeeActions.updateTaskStatusSuccess,
        EmployeeActions.markNotificationAsReadSuccess
      ),
      tap((action) => {
        // Navigation ou autres effets secondaires
        if (action.type === EmployeeActions.updateTaskStatusSuccess.type) {
          const task = (action as any).task;
          if (task.status === 'COMPLETED') {
            // Vous pourriez naviguer vers une page de confirmation
            // this.router.navigate(['/employee/task-completed', task.id]);
          }
        }
      })
    ),
    { dispatch: false }
  );

  // Effet pour les mises à jour en temps réel (WebSocket)
  // Note: Cet effet nécessite un service WebSocket
  // setupRealtimeUpdates$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(EmployeeActions.loadEmployeeProfileSuccess),
  //     tap(({ profile }) => {
  //       // Connexion WebSocket pour les mises à jour en temps réel
  //       const ws = new WebSocket(`${environment.wsUrl}/employee/${profile.id}`);
  //       
  //       ws.onmessage = (event) => {
  //         const data = JSON.parse(event.data);
  //         
  //         switch (data.type) {
  //           case 'TASK_ASSIGNED':
  //             this.store.dispatch(EmployeeActions.taskAssigned({ task: data.task }));
  //             this.store.dispatch(EmployeeActions.addNotification({
  //               notification: {
  //                 id: `notification-${Date.now()}`,
  //                 employeeId: profile.id,
  //                 title: 'Nouvelle tâche assignée',
  //                 message: `Vous avez une nouvelle tâche: ${data.task.serviceName}`,
  //                 type: 'TASK_ASSIGNED',
  //                 read: false,
  //                 data: { taskId: data.task.id },
  //                 createdAt: new Date().toISOString()
  //               }
  //             }));
  //             break;
  //             
  //           case 'TASK_UPDATED':
  //             this.store.dispatch(EmployeeActions.taskUpdated({ task: data.task }));
  //             break;
  //             
  //           case 'TASK_CANCELLED':
  //             this.store.dispatch(EmployeeActions.taskCancelled({ taskId: data.taskId }));
  //             break;
  //         }
  //       };
  //       
  //       // Nettoyage à la destruction
  //       return () => {
  //         ws.close();
  //       };
  //     })
  //   ),
  //   { dispatch: false }
  // );

  // Effet pour les rappels automatiques
  setupTaskReminders$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EmployeeActions.loadEmployeeTasksSuccess),
      tap(({ tasks }) => {
        // Configurer des rappels pour les tâches à venir
        const now = new Date();
        
        tasks.forEach(task => {
          if (task.status === 'CONFIRMED' || task.status === 'PENDING') {
            const taskTime = new Date(task.startTime);
            const timeDiff = taskTime.getTime() - now.getTime();
            
            // Rappel 30 minutes avant
           /* if (timeDiff > 0 && timeDiff <= 30 * 60 * 1000) {
              setTimeout(() => {
                this.store.dispatch(EmployeeActions.addNotification({
                  notification: {
                    id: `reminder-${task.id}-${Date.now()}`,
                    employeeId: task.employeeId,
                    title: 'Rappel de tâche',
                    message: `Votre tâche "${task.serviceName}" commence dans 30 minutes`,
                    type: 'TASK_REMINDER',
                    read: false,
                    data: { taskId: task.id },
                    createdAt: new Date().toISOString()
                  }
                }));
              }, timeDiff - 30 * 60 * 1000);
            }*/
          }
        });
      })
    ),
    { dispatch: false }
  );

  // Effet pour synchroniser l'état de disponibilité
  updateAvailability$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        EmployeeActions.updateTaskStatus,
        EmployeeActions.loadEmployeeTasksSuccess
      ),
      withLatestFrom(this.store.select(selectEmployeeState)),
      tap(([action, state]) => {
        // Mettre à jour l'état de disponibilité basé sur les tâches
        const hasActiveTask = state.tasks.some(task => 
          task.status === 'IN_PROGRESS'
        );
        
        const hasUpcomingTaskSoon = state.tasks.some(task => {
          if (task.status === 'CONFIRMED' || task.status === 'PENDING') {
            const taskTime = new Date(task.startTime);
            const now = new Date();
            const timeDiff = taskTime.getTime() - now.getTime();
            return timeDiff > 0 && timeDiff <= 60 * 60 * 1000; // Dans l'heure qui vient
          }
          return false;
        });
        
        // Mettre à jour le profil avec la disponibilité
        if (state.profile) {
          const isAvailable = !hasActiveTask && !hasUpcomingTaskSoon;
          
          /*if (state.profile.isAvailable !== isAvailable) {
            this.store.dispatch(EmployeeActions.updateEmployeeProfile({
              profile: { isAvailable, ...state.profile }
            }));
          }*/
        }
      })
    ),
    { dispatch: false }
  );

  // Effet pour les statistiques automatiques
  updateStats$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        EmployeeActions.updateTaskStatusSuccess,
        EmployeeActions.loadEmployeeTasksSuccess
      ),
      withLatestFrom(this.store.select(selectEmployeeState)),
      tap(([_, state]) => {
        // Calculer et mettre à jour les statistiques
        // Vous pourriez envoyer des statistiques au serveur ici
        const completedTasks = state.tasks.filter(t => t.status === 'COMPLETED').length;
        const totalTasks = state.tasks.length;
        const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
        
        console.log(`Statistiques mises à jour: ${completionRate}% de complétion`);
      })
    ),
    { dispatch: false }
  );
}

// Si vous avez besoin d'un service de notification séparé
@Injectable({
  providedIn: 'root'
})
export class EmployeeNotificationService {
  showSuccess(message: string): void {
    // Implémentez votre logique de notification ici
    console.log('Success:', message);
  }
  
  showError(message: string): void {
    // Implémentez votre logique de notification ici
    console.error('Error:', message);
  }
  
  showInfo(message: string): void {
    // Implémentez votre logique de notification ici
    console.info('Info:', message);
  }
}