interface PlaceholderProps {
  /** CSS aspect-ratio value, e.g. "16/9", "3/4", "1/1". */
  ratio: string;
  label?: string;
  className?: string;
}

export function Placeholder({ ratio, label, className = '' }: PlaceholderProps) {
  return (
    <div
      style={{ aspectRatio: ratio }}
      className={`relative w-full overflow-hidden bg-gradient-to-br from-[#141414] via-[#1c1a17] to-[#0a0a0a] ${className}`}
      role="img"
      aria-label={label ?? 'Photography coming soon'}
    >
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, #f5f2ec 1px, transparent 0)',
          backgroundSize: '4px 4px',
        }}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-display text-lg tracking-[0.35em] text-gold/40">IKI</span>
      </div>
    </div>
  );
}
