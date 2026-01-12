import { createAction, props } from '@ngrx/store';
import { 
  EmployeeTask, 
  EmployeeNotification, 
  EmployeeProfile, 
  EmployeeStats,
  EmployeeSchedule 
} from '../../models/employee.model';

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

// Today's Tasks
export const loadTodayTasks = createAction('[Employee] Load Today Tasks');
export const loadTodayTasksSuccess = createAction(
  '[Employee] Load Today Tasks Success',
  props<{ tasks: EmployeeTask[] }>()
);
export const loadTodayTasksFailure = createAction(
  '[Employee] Load Today Tasks Failure',
  props<{ error: string }>()
);

// Upcoming Tasks
export const loadUpcomingTasks = createAction('[Employee] Load Upcoming Tasks');
export const loadUpcomingTasksSuccess = createAction(
  '[Employee] Load Upcoming Tasks Success',
  props<{ tasks: EmployeeTask[] }>()
);
export const loadUpcomingTasksFailure = createAction(
  '[Employee] Load Upcoming Tasks Failure',
  props<{ error: string }>()
);

// Completed Tasks
export const loadCompletedTasks = createAction(
  '[Employee] Load Completed Tasks',
  props<{ days?: number }>()
);
export const loadCompletedTasksSuccess = createAction(
  '[Employee] Load Completed Tasks Success',
  props<{ tasks: EmployeeTask[] }>()
);
export const loadCompletedTasksFailure = createAction(
  '[Employee] Load Completed Tasks Failure',
  props<{ error: string }>()
);

// Filter Tasks
export const filterTasks = createAction(
  '[Employee] Filter Tasks',
  props<{ status?: string; date?: string; priority?: string }>()
);
export const filterTasksSuccess = createAction(
  '[Employee] Filter Tasks Success',
  props<{ tasks: EmployeeTask[] }>()
);
export const filterTasksFailure = createAction(
  '[Employee] Filter Tasks Failure',
  props<{ error: string }>()
);

// Update Task Status
export const updateTaskStatus = createAction(
  '[Employee] Update Task Status',
  props<{
    taskId: string;
    status: string;
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

// Task Actions
export const startTask = createAction(
  '[Employee] Start Task',
  props<{ taskId: string }>()
);
export const completeTask = createAction(
  '[Employee] Complete Task',
  props<{ taskId: string; notes?: string }>()
);

// Task Details
export const loadTaskDetails = createAction(
  '[Employee] Load Task Details',
  props<{ taskId: string }>()
);
export const loadTaskDetailsSuccess = createAction(
  '[Employee] Load Task Details Success',
  props<{ task: EmployeeTask }>()
);
export const loadTaskDetailsFailure = createAction(
  '[Employee] Load Task Details Failure',
  props<{ error: string }>()
);

// Notifications
export const loadNotifications = createAction('[Employee] Load Notifications');
export const loadNotificationsSuccess = createAction(
  '[Employee] Load Notifications Success',
  props<{ notifications: EmployeeNotification[] }>()
);
export const loadNotificationsFailure = createAction(
  '[Employee] Load Notifications Failure',
  props<{ error: string }>()
);

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

export const markAllNotificationsAsRead = createAction('[Employee] Mark All Notifications as Read');
export const markAllNotificationsAsReadSuccess = createAction('[Employee] Mark All Notifications as Read Success');
export const markAllNotificationsAsReadFailure = createAction(
  '[Employee] Mark All Notifications as Read Failure',
  props<{ error: string }>()
);

export const clearAllNotifications = createAction('[Employee] Clear All Notifications');
export const clearAllNotificationsSuccess = createAction('[Employee] Clear All Notifications Success');
export const clearAllNotificationsFailure = createAction(
  '[Employee] Clear All Notifications Failure',
  props<{ error: string }>()
);

// Stats
export const loadEmployeeStats = createAction(
  '[Employee] Load Employee Stats',
  props<{ period: string }>()
);
export const loadEmployeeStatsSuccess = createAction(
  '[Employee] Load Employee Stats Success',
  props<{ stats: EmployeeStats }>()
);
export const loadEmployeeStatsFailure = createAction(
  '[Employee] Load Employee Stats Failure',
  props<{ error: string }>()
);

// Schedule
export const loadEmployeeSchedule = createAction(
  '[Employee] Load Employee Schedule',
  props<{ startDate?: string; endDate?: string }>()
);
export const loadEmployeeScheduleSuccess = createAction(
  '[Employee] Load Employee Schedule Success',
  props<{ schedule: EmployeeSchedule[] }>()
);
export const loadEmployeeScheduleFailure = createAction(
  '[Employee] Load Employee Schedule Failure',
  props<{ error: string }>()
);

// Availability
export const updateAvailability = createAction(
  '[Employee] Update Availability',
  props<{ isAvailable: boolean }>()
);
export const updateAvailabilitySuccess = createAction('[Employee] Update Availability Success');
export const updateAvailabilityFailure = createAction(
  '[Employee] Update Availability Failure',
  props<{ error: string }>()
);

// Logout
export const logoutEmployee = createAction('[Employee] Logout');

// Initialize
export const initializeEmployeeDashboard = createAction('[Employee] Initialize Dashboard');

// Refresh
export const refreshData = createAction('[Employee] Refresh Data');

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
export const addNotification = createAction(
  '[Employee] Add Notification',
  props<{ notification: EmployeeNotification }>()
);