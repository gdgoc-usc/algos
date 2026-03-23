export interface ProjectAdditionConfig {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
}

export interface ProjectAdditionStorageState {
  lastSeenAdditionId: string | null;
  hasHiddenCurrentAddition: boolean;
}
