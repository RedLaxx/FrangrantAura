interface IconProps {
  size?: number;
  className?: string;
}

function base(size: number) {
  return {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    "aria-hidden": true,
  } as const;
}

export function BackIcon({ size = 22, className }: IconProps) {
  return (
    <svg {...base(size)} className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 19l-7-7 7-7" />
    </svg>
  );
}

export function ArrowRightIcon({ size = 20, className }: IconProps) {
  return (
    <svg {...base(size)} className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function StarIcon({ size = 18, className }: IconProps) {
  return (
    <svg {...base(size)} className={className} fill="currentColor" stroke="none">
      <path d="M12 3.6l2.6 5.3 5.9.86-4.26 4.15 1 5.89L12 17l-5.24 2.75 1-5.89L3.5 9.71l5.9-.86z" />
    </svg>
  );
}

export function CoinIcon({ size = 18, className }: IconProps) {
  return (
    <svg {...base(size)} className={className} fill="none" stroke="currentColor" strokeWidth="1.7">
      <circle cx="12" cy="12" r="8.2" />
      <circle cx="12" cy="12" r="3.4" fill="currentColor" stroke="none" opacity="0.35" />
    </svg>
  );
}

export function LockIcon({ size = 16, className }: IconProps) {
  return (
    <svg {...base(size)} className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="10.5" width="14" height="9.5" rx="2.4" />
      <path d="M8.5 10.5V8a3.5 3.5 0 017 0v2.5" />
    </svg>
  );
}

export function SpeakerIcon({ size = 18, className }: IconProps) {
  return (
    <svg {...base(size)} className={className} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 5.5L6.5 9H3.5v6h3L11 18.5z" />
      <path d="M15.4 9.2a4 4 0 010 5.6" />
      <path d="M18.2 6.6a8 8 0 010 10.8" />
    </svg>
  );
}

export function BookIcon({ size = 20, className }: IconProps) {
  return (
    <svg {...base(size)} className={className} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 5.2A2.2 2.2 0 016.2 3H20v15.2H6.4A2.4 2.4 0 004 20.6z" />
      <path d="M4 18.2V5.2" />
      <path d="M8.5 7.5h7M8.5 11h5" />
    </svg>
  );
}

export function BulbIcon({ size = 20, className }: IconProps) {
  return (
    <svg {...base(size)} className={className} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.2 17.5h5.6M10 20.5h4" />
      <path d="M12 3a6 6 0 00-3.6 10.8c.5.4.8 1 .8 1.6v.6h5.6v-.6c0-.6.3-1.2.8-1.6A6 6 0 0012 3z" />
    </svg>
  );
}

export function ShuffleIcon({ size = 20, className }: IconProps) {
  return (
    <svg {...base(size)} className={className} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 3.5L20.5 7 17 10.5M17 13.5L20.5 17 17 20.5" />
      <path d="M3.5 7h3.6c1.4 0 2.7.7 3.5 1.9l3.3 5.2c.8 1.2 2.1 1.9 3.5 1.9h3.1" />
      <path d="M3.5 17h3.6c1.4 0 2.7-.7 3.5-1.9l.5-.8" />
      <path d="M14.4 9.7l.5-.8c.8-1.2 2.1-1.9 3.5-1.9h2.1" />
    </svg>
  );
}

export function VolumeOnIcon({ size = 20, className }: IconProps) {
  return (
    <svg {...base(size)} className={className} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 5.5L6.5 9H3.5v6h3L11 18.5z" />
      <path d="M15.5 9a4.2 4.2 0 010 6" />
      <path d="M18 6.6a8 8 0 010 10.8" />
    </svg>
  );
}

export function VolumeOffIcon({ size = 20, className }: IconProps) {
  return (
    <svg {...base(size)} className={className} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 5.5L6.5 9H3.5v6h3L11 18.5z" />
      <path d="M16 9.5l5 5M21 9.5l-5 5" />
    </svg>
  );
}

export function CheckIcon({ size = 16, className }: IconProps) {
  return (
    <svg {...base(size)} className={className} fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.5 12.5l4.5 4.5L19.5 6.5" />
    </svg>
  );
}

export function SparkIcon({ size = 16, className }: IconProps) {
  return (
    <svg {...base(size)} className={className} fill="currentColor" stroke="none">
      <path d="M12 2.5l1.8 5.4 5.4 1.8-5.4 1.8L12 16.9l-1.8-5.4L4.8 9.7l5.4-1.8z" />
      <path d="M18.5 15l.9 2.6 2.6.9-2.6.9-.9 2.6-.9-2.6-2.6-.9 2.6-.9z" opacity="0.55" />
    </svg>
  );
}
