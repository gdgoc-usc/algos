import type { ProjectAdditionStorageState } from "@/types/project-addition";

const LAST_SEEN_ADDITION_ID_STORAGE_KEY = "algos.projectAddition.lastSeenId";
const HAS_HIDDEN_CURRENT_ADDITION_STORAGE_KEY =
  "algos.projectAddition.hasHiddenCurrent";

const STORED_BOOLEAN_TRUE = "true";
const STORED_BOOLEAN_FALSE = "false";

const fallbackProjectAdditionStorageState: ProjectAdditionStorageState = {
  lastSeenAdditionId: null,
  hasHiddenCurrentAddition: false,
};

const reportProjectAdditionStorageError = (
  action: "read" | "write",
  error: unknown,
) => {
  console.error(`Failed to ${action} project addition toast state.`, error);
};

const parseStoredBoolean = (value: string | null): boolean =>
  value === STORED_BOOLEAN_TRUE;

export const readProjectAdditionStorageState =
  (): ProjectAdditionStorageState => {
    try {
      const lastSeenAdditionId = window.localStorage.getItem(
        LAST_SEEN_ADDITION_ID_STORAGE_KEY,
      );
      const hasHiddenCurrentAddition = parseStoredBoolean(
        window.localStorage.getItem(HAS_HIDDEN_CURRENT_ADDITION_STORAGE_KEY),
      );

      return {
        lastSeenAdditionId,
        hasHiddenCurrentAddition,
      };
    } catch (error) {
      reportProjectAdditionStorageError("read", error);
      return fallbackProjectAdditionStorageState;
    }
  };

export const writeProjectAdditionStorageState = (
  state: ProjectAdditionStorageState,
): void => {
  try {
    if (state.lastSeenAdditionId === null) {
      window.localStorage.removeItem(LAST_SEEN_ADDITION_ID_STORAGE_KEY);
    } else {
      window.localStorage.setItem(
        LAST_SEEN_ADDITION_ID_STORAGE_KEY,
        state.lastSeenAdditionId,
      );
    }

    const storedBoolean = state.hasHiddenCurrentAddition
      ? STORED_BOOLEAN_TRUE
      : STORED_BOOLEAN_FALSE;

    window.localStorage.setItem(
      HAS_HIDDEN_CURRENT_ADDITION_STORAGE_KEY,
      storedBoolean,
    );
  } catch (error) {
    reportProjectAdditionStorageError("write", error);
  }
};
