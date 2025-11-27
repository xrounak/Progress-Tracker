import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";

export const ProfilePage: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [signingOut, setSigningOut] = useState(false);

  const handleSignOut = async () => {
    if (signingOut) return;
    setSigningOut(true);
    try {
      await signOut();
      navigate("/auth/login", { replace: true });
    } finally {
      setSigningOut(false);
    }
  };

  return (
    <div className="space-y-4">
      <section className="space-y-1">
        <h1 className="text-lg font-semibold text-foreground sm:text-xl">
          Profile
        </h1>
        <p className="text-xs text-muted-foreground">
          Manage your account and sign out securely.
        </p>
      </section>

      <Card className="max-w-lg">
        <CardHeader>
          <h2 className="text-xs font-semibold text-foreground">
            Account details
          </h2>
        </CardHeader>
        <CardBody className="space-y-3 text-xs text-muted-foreground">
          <p>Email: {user?.email ?? "—"}</p>
          <p>UID: {user?.id ?? "—"}</p>
          <Button
            variant="outline"
            size="sm"
            onClick={handleSignOut}
            isLoading={signingOut}
            disabled={signingOut}
          >
            Sign out
          </Button>
        </CardBody>
      </Card>
    </div>
  );
};

