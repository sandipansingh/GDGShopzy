import { passwordRequirements } from "../schemas";

interface PasswordCriteriaProps {
  password: string;
}

export const PasswordCriteria = ({ password }: PasswordCriteriaProps) => {
  const checks = passwordRequirements.map((criterion) => ({
    ...criterion,
    met: criterion.test(password),
  }));

  return (
    <div aria-live="polite" className="space-y-3 rounded-md border border-border bg-muted/30 p-4">
      <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
        Password requirements
      </p>
      <ul className="space-y-2 text-sm">
        {checks.map((criterion) => (
          <li
            key={criterion.id}
            className={`flex items-start gap-2 ${criterion.met ? "text-emerald-400" : "text-muted-foreground"}`}
          >
            <span className="mt-0.5 text-xs">{criterion.met ? "✓" : "○"}</span>
            <span>{criterion.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
