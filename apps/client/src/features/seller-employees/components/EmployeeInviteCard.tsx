import type { FormEventHandler } from "react";
import type { UseFormRegister } from "react-hook-form";
import { Input } from "../../../components/ui/Input";
import { Card } from "../../../components/ui/Card";
import { SubmitButton } from "../../../components/shared/SubmitButton";

type InviteFormData = { email: string };

interface EmployeeInviteCardProps {
  emailError?: string;
  inviteLink: string;
  isSubmitting: boolean;
  onSubmit: FormEventHandler<HTMLFormElement>;
  registerEmail: UseFormRegister<InviteFormData>;
}

export const EmployeeInviteCard = ({
  emailError,
  inviteLink,
  isSubmitting,
  onSubmit,
  registerEmail,
}: EmployeeInviteCardProps) => {
  return (
    <Card>
      <h2 className="text-tagline text-ink mb-lg">Invite Employee</h2>
      <form onSubmit={onSubmit} className="space-y-lg">
        <Input label="Email" type="email" {...registerEmail("email")} error={emailError} />
        <SubmitButton isSubmitting={isSubmitting}>Send Invite</SubmitButton>
      </form>
      {inviteLink && (
        <div className="mt-lg p-md bg-canvas-parchment rounded-md">
          <p className="text-caption text-ink-muted-80 mb-sm">Invite Link</p>
          <input
            type="text"
            value={inviteLink}
            readOnly
            className="w-full px-md py-sm border border-hairline rounded-md text-caption text-ink bg-canvas"
            onClick={(event) => event.currentTarget.select()}
          />
        </div>
      )}
    </Card>
  );
};
