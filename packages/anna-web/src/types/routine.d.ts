export type Routine = {
  routineId: string;
  name: string;
  interval: string;
  sceneId: string;
  runAtBankHoliday: boolean;
  runWhenUserIsAway: boolean;
  enabled: boolean;
  createdAt?: number;
  updatedAt?: number;
  lastRunAt?: number;
  nextRunAt: number;
  createdBy?: string;
};
