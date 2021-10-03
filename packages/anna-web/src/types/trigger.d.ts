export type Trigger = {
  aliasId: string;
  sceneId: string;
  name: string;
  description: string;
  enabled: boolean;
  createdAt?: number;
  updatedAt?: number;
  createdBy?: string;
  startTime?: number;
  endTime?: number;
};
