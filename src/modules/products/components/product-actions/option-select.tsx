import { HttpTypes } from "@medusajs/types"
import { clx } from "@medusajs/ui"
import React from "react"

type OptionSelectProps = {
  option: HttpTypes.StoreProductOption
  current: string | undefined
  updateOption: (title: string, value: string) => void
  title: string
  disabled: boolean
  soldOutValues?: Set<string>
  compact?: boolean
  "data-testid"?: string
}

const OptionSelect: React.FC<OptionSelectProps> = ({
  option,
  current,
  updateOption,
  title,
  "data-testid": dataTestId,
  disabled,
  soldOutValues,
  compact,
}) => {
  const filteredOptions = (option.values ?? []).map((v) => v.value)

  return (
    <div className="flex flex-col gap-y-3">
      {!compact && <span className="text-sm">Select {title}</span>}
      <div
        className={clx("flex flex-wrap justify-between gap-2", {
          "flex-nowrap justify-start": compact,
        })}
        data-testid={dataTestId}
      >
        {filteredOptions.map((v) => {
          const isSoldOut = soldOutValues?.has(v) ?? false

          return (
            <button
              onClick={() => updateOption(option.id, v)}
              key={v}
              className={clx(
                compact
                  ? "border-ui-border-base bg-ui-bg-subtle border text-[10px] h-8 rounded-base px-2 flex-none"
                  : "border-ui-border-base bg-ui-bg-subtle border text-small-regular h-10 rounded-rounded p-2 flex-1 ",
                {
                  "border-ui-border-interactive": v === current,
                  "hover:shadow-elevation-card-rest transition-shadow ease-in-out duration-150":
                    v !== current,
                  "text-ui-fg-muted bg-ui-bg-disabled line-through opacity-60 cursor-not-allowed border-ui-border-base":
                    isSoldOut,
                }
              )}
              disabled={disabled || isSoldOut}
              data-testid="option-button"
              aria-disabled={isSoldOut}
            >
              {v}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default OptionSelect
