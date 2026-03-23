import { useEffect } from "react";
import { toast } from "sonner";
import { ProjectAdditionToastCard } from "@/components/project-addition-toast-card";
import { projectAdditionConfig } from "@/config/project-addition";
import {
  readProjectAdditionStorageState,
  writeProjectAdditionStorageState,
} from "@/lib/project-addition-storage";
import type { ProjectAdditionStorageState } from "@/types/project-addition";

const TOAST_DISPLAY_DELAY_MS = 0;

const hideCurrentProjectAddition = (): void => {
  const consumedState: ProjectAdditionStorageState = {
    lastSeenAdditionId: projectAdditionConfig.id,
    hasHiddenCurrentAddition: true,
  };

  writeProjectAdditionStorageState(consumedState);
  toast.dismiss(projectAdditionConfig.id);
};

export function ProjectAdditionToastController() {
  useEffect(() => {
    if (!projectAdditionConfig.enabled) {
      return;
    }

    const storedState = readProjectAdditionStorageState();
    const hasDifferentAddition =
      storedState.lastSeenAdditionId !== projectAdditionConfig.id;
    const shouldShowCurrentAddition =
      hasDifferentAddition || !storedState.hasHiddenCurrentAddition;

    if (!shouldShowCurrentAddition) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      toast.custom(
        () => (
          <ProjectAdditionToastCard
            title={projectAdditionConfig.title}
            description={projectAdditionConfig.description}
            onHide={hideCurrentProjectAddition}
          />
        ),
        {
          id: projectAdditionConfig.id,
          duration: 8000,
        },
      );
    }, TOAST_DISPLAY_DELAY_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, []);

  return null;
}
