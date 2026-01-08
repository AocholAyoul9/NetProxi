import { createAction, props } from '@ngrx/store';
import { EmployeeTask, EmployeeNotification, EmployeeProfile } from '../../models/employee.model';

// Load Profile
export const loadEmployeeProfile = createAction('[Employee] Load Profile');
export const loadEmployeeProfileSuccess = createAction(
  '[Employee] Load Profile Success',
  props<{ profile: EmployeeProfile }>()
);
export const loadEmployeeProfileFailure = createAction(
  '[Employee] Load Profile Failure',
  props<{ error: string }>()
);

// Update Profile
export const updateEmployeeProfile = createAction(
  '[Employee] Update Profile',
  props<{ profile: Partial<EmployeeProfile> }>()
);
export const updateEmployeeProfileSuccess = createAction(
  '[Employee] Update Profile Success',
  props<{ profile: EmployeeProfile }>()
);
export const updateEmployeeProfileFailure = createAction(
  '[Employee] Update Profile Failure',
  props<{ error: string }>()
);

// Load Tasks
export const loadEmployeeTasks = createAction('[Employee] Load Tasks');
export const loadEmployeeTasksSuccess = createAction(
  '[Employee] Load Tasks Success',
  props<{ tasks: EmployeeTask[] }>()
);
export const loadEmployeeTasksFailure = createAction(
  '[Employee] Load Tasks Failure',
  props<{ error: string }>()
);

// Update Task Status
export const updateTaskStatus = createAction(
  '[Employee] Update Task Status',
  props<{
    taskId: string;
    status: EmployeeTask['status'];
    startTime?: string;
    endTime?: string;
    notes?: string;
  }>()
);
export const updateTaskStatusSuccess = createAction(
  '[Employee] Update Task Status Success',
  props<{ task: EmployeeTask }>()
);
export const updateTaskStatusFailure = createAction(
  '[Employee] Update Task Status Failure',
  props<{ error: string }>()
);

// Load Notifications
export const loadNotifications = createAction('[Employee] Load Notifications');
export const loadNotificationsSuccess = createAction(
  '[Employee] Load Notifications Success',
  props<{ notifications: EmployeeNotification[] }>()
);
export const loadNotificationsFailure = createAction(
  '[Employee] Load Notifications Failure',
  props<{ error: string }>()
);

// Mark Notification as Read
export const markNotificationAsRead = createAction(
  '[Employee] Mark Notification as Read',
  props<{ notificationId: string }>()
);
export const markNotificationAsReadSuccess = createAction(
  '[Employee] Mark Notification as Read Success',
  props<{ notificationId: string }>()
);
export const markNotificationAsReadFailure = createAction(
  '[Employee] Mark Notification as Read Failure',
  props<{ error: string }>()
);

// Mark All Notifications as Read
export const markAllNotificationsAsRead = createAction('[Employee] Mark All Notifications as Read');
export const markAllNotificationsAsReadSuccess = createAction('[Employee] Mark All Notifications as Read Success');
export const markAllNotificationsAsReadFailure = createAction(
  '[Employee] Mark All Notifications as Read Failure',
  props<{ error: string }>()
);

// Clear All Notifications
export const clearAllNotifications = createAction('[Employee] Clear All Notifications');
export const clearAllNotificationsSuccess = createAction('[Employee] Clear All Notifications Success');
export const clearAllNotificationsFailure = createAction(
  '[Employee] Clear All Notifications Failure',
  props<{ error: string }>()
);

// Add Notification (for real-time updates)
export const addNotification = createAction(
  '[Employee] Add Notification',
  props<{ notification: EmployeeNotification }>()
);

// Real-time updates
export const taskAssigned = createAction(
  '[Employee] Task Assigned',
  props<{ task: EmployeeTask }>()
);

export const taskUpdated = createAction(
  '[Employee] Task Updated',
  props<{ task: EmployeeTask }>()
);

export const taskCancelled = createAction(
  '[Employee] Task Cancelled',
  props<{ taskId: string }>()
);

// Set Loading
export const setEmployeeLoading = createAction(
  '[Employee] Set Loading',
  props<{ loading: boolean }>()
);

// Clear Errors
export const clearEmployeeErrors = createAction('[Employee] Clear Errors');