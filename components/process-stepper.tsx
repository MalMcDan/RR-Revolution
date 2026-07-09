type ProcessStepperProps = {
  steps: string[];
  currentStep: number;
  label?: string;
};

export function ProcessStepper({ steps, currentStep, label = "Process" }: ProcessStepperProps) {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-black/30 p-5">
      <div className="text-xs uppercase tracking-[0.32em] text-rr-purple">{label}</div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, index) => {
          const isCurrent = index === currentStep;
          const isDone = index < currentStep;
          return (
            <div key={step} className={`rounded-2xl border p-3 text-sm ${isCurrent ? "border-rr-purple bg-rr-purple/15 text-white shadow-glow" : isDone ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-100" : "border-white/10 bg-black/20 text-rr-chrome"}`}>
              <div className="text-xs opacity-75">Step {index + 1}</div>
              <div className="mt-1 font-semibold">{step}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
