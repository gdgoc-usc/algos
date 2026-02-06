import { GDG_INFO } from "@/lib/constants";
import { Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full py-6 mt-20 border-t border-border/40 bg-background/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 flex justify-center text-center">
        <a
          href={GDG_INFO.github}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors group"
        >
          Made with{" "}
          <Heart className="w-3.5 h-3.5 fill-current text-google-red animate-pulse" />{" "}
          by the
          <span className="font-medium text-foreground group-hover:text-google-blue transition-colors flex items-center gap-1.5 ml-0.5">
            <img
              src={GDG_INFO.logo}
              alt="GDG Logo"
              className="w-5 h-5 rounded-full object-cover"
            />
            GDG-USC Community
          </span>
        </a>
      </div>
    </footer>
  );
}
