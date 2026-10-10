const PROJECT_STATUSES = Object.freeze({
  ACTIVE: 'active',
  COMPLETED: 'completed',
  ARCHIVED: 'archived',
  PENDING: 'pending',
});

const TASK_STATUSES = Object.freeze({
  PENDING: 'pending',
  IN_PROGRESS: 'in-progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
});

const TASK_PRIORITIES = Object.freeze({
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent',
});


const ROLES = Object.freeze({
  MANAGER: 'manager',
  USER: 'user',
});

module.exports = {
  PROJECT_STATUSES,
  TASK_STATUSES,
  TASK_PRIORITIES,
  ROLES,
};