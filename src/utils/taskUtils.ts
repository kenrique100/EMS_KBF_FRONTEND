// src/utils/taskUtils.ts
import { Task, TaskDTO } from '@/types';

export const mapTaskDTOtoTask = (dto: TaskDTO): Task => {
  if (!dto.id) {
    throw new Error('Task ID is required');
  }

  return {
    id: dto.id,
    title: dto.title,
    description: dto.description || '',
    deadline: dto.deadline,
    employeeId: dto.employeeId,
    employeeName: dto.employeeName || '',
    status: dto.status || 'PENDING',
    expectedHours: dto.expectedHours || 0,
    actualHours: dto.actualHours || 0,
    totalWorkedMinutes: dto.totalWorkedMinutes || 0,
    startTime: dto.startTime,
    stopTime: dto.stopTime,
    lastResumeTime: dto.lastResumeTime,
    isValidated: dto.isValidated || false,
    validationTime: dto.validationTime,
    submitted: dto.submitted || false,
    createdAt: dto.createdAt || new Date().toISOString(),
    updatedAt: dto.updatedAt || new Date().toISOString(),
  };
};