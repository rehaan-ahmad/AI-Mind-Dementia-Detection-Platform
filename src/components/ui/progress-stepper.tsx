"use client"

import * as React from "react"
import { Check, Dot } from "lucide-react"
import { cn } from "@/lib/utils"

interface ProgressStepperProps extends React.HTMLAttributes<HTMLDivElement> {
  steps: string[]
  currentStep: number
}

export function ProgressStepper({
  steps,
  currentStep,
  className,
  ...props
}: ProgressStepperProps) {
  return (
    <div
      className={cn("flex w-full items-center justify-between", className)}
      {...props}
    >
      {steps.map((step, index) => (
        <React.Fragment key={step}>
          <div className="flex flex-col items-center">
            <div
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full border-2",
                index < currentStep
                  ? "border-primary bg-primary text-primary-foreground"
                  : index === currentStep
                  ? "border-primary"
                  : "border-border bg-muted text-muted-foreground"
              )}
            >
              {index < currentStep ? (
                <Check className="h-5 w-5" />
              ) : (
                <span className={cn(index === currentStep && "text-primary")}>
                  {index + 1}
                </span>
              )}
            </div>
            <p
              className={cn(
                "mt-2 text-center text-sm",
                index === currentStep ? "font-medium text-primary" : "text-muted-foreground"
              )}
            >
              {step}
            </p>
          </div>
          {index < steps.length - 1 && (
            <div
              className={cn(
                "h-px flex-1",
                index < currentStep ? "bg-primary" : "bg-border"
              )}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  )
}
