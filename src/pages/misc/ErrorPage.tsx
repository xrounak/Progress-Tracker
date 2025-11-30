import React from "react";
import { useRouteError, isRouteErrorResponse, Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { AlertTriangle } from "lucide-react";

export const ErrorPage: React.FC = () => {
    const error = useRouteError();
    let errorMessage: string;

    if (isRouteErrorResponse(error)) {
        // error is type `ErrorResponse`
        errorMessage = error.statusText || error.data?.message || "Unknown error";
    } else if (error instanceof Error) {
        errorMessage = error.message;
    } else if (typeof error === 'string') {
        errorMessage = error;
    } else {
        console.error(error);
        errorMessage = 'Unknown error';
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 text-center">
            <div className="mb-6 rounded-full bg-red-100 p-6 dark:bg-red-900/20">
                <AlertTriangle className="h-12 w-12 text-red-600 dark:text-red-400" />
            </div>
            <h1 className="mb-2 text-3xl font-bold text-foreground">Oops! Something went wrong</h1>
            <p className="mb-8 max-w-md text-muted-foreground">
                We apologize for the inconvenience. An unexpected error has occurred.
            </p>

            <div className="mb-8 rounded-md bg-muted p-4 font-mono text-sm text-muted-foreground">
                {errorMessage}
            </div>

            <div className="flex gap-4">
                <Button asChild variant="outline" onClick={() => window.location.reload()}>
                    <span>Reload Page</span>
                </Button>
                <Button asChild>
                    <Link to="/">Go Home</Link>
                </Button>
            </div>
        </div>
    );
};
