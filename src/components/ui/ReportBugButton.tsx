import React from "react";
import { Bug } from "lucide-react";
import { Button } from "@/components/ui/Button";

export const ReportBugButton: React.FC = () => {
    const whatsappUrl = "https://api.whatsapp.com/send?phone=916207163458&text=Dear%20Rounak%2C%0AWhile%20browsing%2C%20I%20noticed%20a%20small%20issue%3A%20";

    return (
        <div className="fixed bottom-4 right-4 z-50">
            <Button
                asChild
                variant="destructive"
                size="sm"
                className="rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 gap-2"
            >
                <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Report a bug"
                >
                    <Bug className="h-4 w-4" />
                    <span className="hidden sm:inline">Report Bug</span>
                </a>
            </Button>
        </div>
    );
};
