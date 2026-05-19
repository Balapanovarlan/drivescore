export function CoefficientTag({ coefficient }: { coefficient: number }) {
  return (
    <span className="font-mono text-sm font-semibold tabular-nums">
      {coefficient.toFixed(2)}×
    </span>
  )
}
