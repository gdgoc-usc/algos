import { useTheme } from "@/hooks/use-theme";
import { Toaster as Sonner, type ToasterProps } from "sonner";

export function Toaster(props: ToasterProps) {
  const { theme } = useTheme();

  return (
    <Sonner
      closeButton={false}
      expand={false}
      gap={10}
      offset={16}
      mobileOffset={16}
      position="bottom-right"
      theme={theme}
      visibleToasts={1}
      {...props}
    />
  );
}
