export type Routine = {
  routineId: string;
  name: string;
  interval: string;
  sceneId: string;
  runAtBankHoliday: boolean;
  enabled: boolean;
  createdAt?: number;
  updatedAt?: number;
  lastFailedAt?: number;
  lastRunAt?: number;
  nextRunAt: number;
  failReason?: null;
  createdBy?: string;
};
