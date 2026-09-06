/**
 * Icon set.
 *
 * Every state and evidence glyph the product uses. Colour is never the only
 * carrier of meaning, so each state has a shape as well as a hue — these are
 * the shapes.
 */

type P = { size?: number; className?: string };

const svg = (size: number, className: string, children: React.ReactNode) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden
  >
    {children}
  </svg>
);

/* ── State markers ────────────────────────────────────────────────────────── */

export const DotIcon = ({ size = 14, className = "" }: P) =>
  svg(size, className, <circle cx="8" cy="8" r="3" fill="currentColor" stroke="none" />);

export const RingIcon = ({ size = 14, className = "" }: P) =>
  svg(
    size,
    className,
    <>
      <circle cx="8" cy="8" r="6" />
      <circle cx="8" cy="8" r="2.2" fill="currentColor" stroke="none" />
    </>,
  );

export const AlertIcon = ({ size = 14, className = "" }: P) =>
  svg(
    size,
    className,
    <>
      <path d="M8 2.5 14.5 13.5h-13z" />
      <path d="M8 6.6v3" />
      <circle cx="8" cy="11.6" r=".7" fill="currentColor" stroke="none" />
    </>,
  );

export const WarningIcon = ({ size = 14, className = "" }: P) =>
  svg(
    size,
    className,
    <>
      <circle cx="8" cy="8" r="6" />
      <path d="M8 5v3.4" />
      <circle cx="8" cy="10.9" r=".7" fill="currentColor" stroke="none" />
    </>,
  );

export const CheckIcon = ({ size = 14, className = "" }: P) =>
  svg(size, className, <path d="M3.2 8.4 6.4 11.6l6.4-7" />);

export const DashedIcon = ({ size = 14, className = "" }: P) =>
  svg(size, className, <circle cx="8" cy="8" r="5.6" strokeDasharray="2.4 2.2" />);

/* ── Evidence states ──────────────────────────────────────────────────────── */

export const ShieldIcon = ({ size = 14, className = "" }: P) =>
  svg(
    size,
    className,
    <>
      <path d="M8 1.8 13 3.6v4.1c0 3-2.1 5.4-5 6.5-2.9-1.1-5-3.5-5-6.5V3.6z" />
      <path d="M5.9 7.9 7.4 9.4l3-3.2" />
    </>,
  );

export const SparkIcon = ({ size = 14, className = "" }: P) =>
  svg(
    size,
    className,
    <>
      <path d="M8 1.6l1.5 4L13.5 7l-4 1.4L8 12.4 6.5 8.4 2.5 7l4-1.4z" />
      <path d="M12.6 11.4l.6 1.5 1.4.6-1.4.6-.6 1.4-.6-1.4-1.4-.6 1.4-.6z" />
    </>,
  );

export const QuestionIcon = ({ size = 14, className = "" }: P) =>
  svg(
    size,
    className,
    <>
      <circle cx="8" cy="8" r="6" />
      <path d="M6.3 6.2a1.75 1.75 0 1 1 2.4 1.6c-.5.2-.7.6-.7 1.1v.3" />
      <circle cx="8" cy="11.4" r=".7" fill="currentColor" stroke="none" />
    </>,
  );

export const GapIcon = ({ size = 14, className = "" }: P) =>
  svg(
    size,
    className,
    <>
      <path d="M6 2.4H3.4A1 1 0 0 0 2.4 3.4V6" strokeDasharray="0" />
      <path d="M10 2.4h2.6a1 1 0 0 1 1 1V6" />
      <path d="M13.6 10v2.6a1 1 0 0 1-1 1H10" />
      <path d="M6 13.6H3.4a1 1 0 0 1-1-1V10" />
    </>,
  );

/* ── Interface ────────────────────────────────────────────────────────────── */

export const SearchIcon = ({ size = 14, className = "" }: P) =>
  svg(
    size,
    className,
    <>
      <circle cx="7.2" cy="7.2" r="4.6" />
      <path d="M10.6 10.6 14 14" />
    </>,
  );

export const LockIcon = ({ size = 12, className = "" }: P) =>
  svg(
    size,
    className,
    <>
      <rect x="3.4" y="7" width="9.2" height="6.6" rx="1.2" />
      <path d="M5.6 7V5.2a2.4 2.4 0 0 1 4.8 0V7" />
    </>,
  );

export const ArrowLeftIcon = ({ size = 16, className = "" }: P) =>
  svg(size, className, <><path d="M12.5 8h-9" /><path d="M7 3.5 2.5 8 7 12.5" /></>);

export const ArrowRightIcon = ({ size = 16, className = "" }: P) =>
  svg(size, className, <><path d="M3.5 8h9" /><path d="M9 3.5 13.5 8 9 12.5" /></>);

export const ChevronDownIcon = ({ size = 14, className = "" }: P) =>
  svg(size, className, <path d="M4 6.2 8 10.2l4-4" />);

export const CloseIcon = ({ size = 14, className = "" }: P) =>
  svg(size, className, <><path d="M3.6 3.6l8.8 8.8" /><path d="M12.4 3.6l-8.8 8.8" /></>);

export const MenuIcon = ({ size = 14, className = "" }: P) =>
  svg(size, className, <><path d="M2.5 4.5h11" /><path d="M2.5 8h11" /><path d="M2.5 11.5h11" /></>);

export const ExternalIcon = ({ size = 12, className = "" }: P) =>
  svg(size, className, <><path d="M9 3h4v4" /><path d="M13 3 7.4 8.6" /><path d="M11.6 9.6v3a1 1 0 0 1-1 1H3.4a1 1 0 0 1-1-1V5.4a1 1 0 0 1 1-1h3" /></>);

export const FullscreenIcon = ({ size = 14, className = "" }: P) =>
  svg(size, className, <path d="M5.6 2.4H3.4a1 1 0 0 0-1 1v2.2M10.4 2.4h2.2a1 1 0 0 1 1 1v2.2M10.4 13.6h2.2a1 1 0 0 0 1-1v-2.2M5.6 13.6H3.4a1 1 0 0 1-1-1v-2.2" />);

export const ClockIcon = ({ size = 13, className = "" }: P) =>
  svg(size, className, <><circle cx="8" cy="8" r="6" /><path d="M8 4.8V8l2.2 1.6" /></>);

/* ── Module glyphs — used on carousel cards and in navigation ─────────────── */

export const GrowthIcon = ({ size = 16, className = "" }: P) =>
  svg(size, className, <><path d="M2.4 11.6 6 8l2.6 2.2L13.6 4.6" /><path d="M10.4 4.6h3.2v3.2" /></>);

export const AccountsIcon = ({ size = 16, className = "" }: P) =>
  svg(size, className, <><rect x="2.4" y="4" width="5.2" height="9.6" rx=".8" /><rect x="8.8" y="2.4" width="4.8" height="11.2" rx=".8" /><path d="M4.2 6.6h1.6M4.2 9h1.6M10.4 5h1.6M10.4 7.4h1.6M10.4 9.8h1.6" /></>);

export const DealsIcon = ({ size = 16, className = "" }: P) =>
  svg(size, className, <><path d="M2.4 8h11.2" /><circle cx="4.4" cy="8" r="1.6" /><circle cx="8" cy="8" r="1.6" /><circle cx="11.8" cy="8" r="1.6" /></>);

export const MarketsIcon = ({ size = 16, className = "" }: P) =>
  svg(size, className, <><path d="M8 1.8c-2 2.2-3 4.4-3 6.2 0 1.8 1.4 3.2 3 3.2s3-1.4 3-3.2c0-1.8-1-4-3-6.2z" /><path d="M3.4 13.8h9.2" /></>);

export const PeopleIcon = ({ size = 16, className = "" }: P) =>
  svg(size, className, <><circle cx="6.2" cy="5.8" r="2.4" /><path d="M2.4 13.4a3.9 3.9 0 0 1 7.6 0" /><circle cx="11.6" cy="6.6" r="1.8" /><path d="M10.6 10.4a3.3 3.3 0 0 1 3 3" /></>);

export const DeliveryIcon = ({ size = 16, className = "" }: P) =>
  svg(size, className, <><path d="M2.4 8h11.2" /><path d="M2.4 5.6v4.8M6.1 6.4v3.2M9.8 6.4v3.2M13.6 5.6v4.8" /></>);

export const GraphIcon = ({ size = 16, className = "" }: P) =>
  svg(size, className, <><circle cx="8" cy="4" r="1.9" /><circle cx="3.6" cy="11.6" r="1.9" /><circle cx="12.4" cy="11.6" r="1.9" /><path d="M6.9 5.7 4.7 9.9M9.1 5.7l2.2 4.2M5.5 11.6h5" /></>);

export const GlobeIcon = ({ size = 16, className = "" }: P) =>
  svg(size, className, <><circle cx="8" cy="8" r="6" /><path d="M2.2 8h11.6" /><path d="M8 2.2c1.6 1.7 2.4 3.6 2.4 5.8S9.6 12.1 8 13.8C6.4 12.1 5.6 10.2 5.6 8s.8-4.1 2.4-5.8z" /></>);

export const EvidenceIcon = ({ size = 16, className = "" }: P) =>
  svg(size, className, <><path d="M4 2.4h5.2l3.2 3.2v8a.8.8 0 0 1-.8.8H4a.8.8 0 0 1-.8-.8V3.2a.8.8 0 0 1 .8-.8z" /><path d="M9 2.4v3.4h3.4" /><path d="M5.6 9.2h4.8M5.6 11.4h3.2" /></>);

export const TasksIcon = ({ size = 16, className = "" }: P) =>
  svg(size, className, <><path d="M2.6 4.6 4 6l2.2-2.4" /><path d="M2.6 11 4 12.4 6.2 10" /><path d="M8.4 5h5M8.4 11.4h5" /></>);

export const PrepareIcon = ({ size = 15, className = "" }: P) =>
  svg(size, className, <><rect x="2.6" y="2.6" width="10.8" height="10.8" rx="1.4" /><path d="M5.4 6.4h5.2M5.4 8.8h3.4" /></>);
