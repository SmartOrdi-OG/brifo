/** The horizontal Brifo lockup: the mark, then the name.
 *
 * Inline rather than an <img>, for two reasons the supplied file cannot
 * solve on its own.
 *
 * The name is set in a fixed #1C1D3A — the light theme's --text, and
 * invisible against the dark theme's background. Drawn inline it takes
 * `currentColor` instead, so one component serves both themes rather than
 * two files drifting apart.
 *
 * And the sign-in hero is a blue-to-violet gradient built from the same two
 * brand colours the mark is drawn in, so the coloured lockup would all but
 * disappear on it. `tone="reversed"` draws the whole thing in one colour
 * with the paper knocked out, which is what a brand's reversed lockup is
 * for. Both tones take their colour from `currentColor`, so the caller sets
 * it in CSS and dark mode keeps working.
 */
interface Props {
  /** 'brand' for light surfaces; 'reversed' for the coloured hero. */
  tone?: "brand" | "reversed";
  /** Rendered height in px. The width follows the artwork's ratio. */
  height?: number;
  className?: string;
}

/** The outline of the name, as drawn. */
const WORDMARK_PATH =
  "M33.5 1.5Q25.450000000000003 1.5 20.05 -2.25Q19.450000000000003 -2.6500000000000004 18.900000000000002 -3.1V0.0H6.9V-72.0H20.6V-52.25Q25.650000000000002 -55.5 32.800000000000004 -55.5Q40.550000000000004 -55.5 46.300000000000004 -51.8Q52.050000000000004 -48.1 55.22500000000001 -41.675Q58.400000000000006 -35.25 58.400000000000006 -27.0Q58.400000000000006 -18.900000000000002 55.275000000000006 -12.450000000000001Q52.150000000000006 -6.0 46.550000000000004 -2.25Q40.95 1.5 33.5 1.5ZM31.3 -10.600000000000001Q35.7 -10.600000000000001 38.5 -12.8Q41.300000000000004 -15.0 42.650000000000006 -18.725Q44.0 -22.450000000000003 44.0 -27.0Q44.0 -31.5 42.6 -35.225Q41.2 -38.95 38.275000000000006 -41.175000000000004Q35.35 -43.400000000000006 30.8 -43.400000000000006Q26.55 -43.400000000000006 23.925 -41.35000000000001Q21.3 -39.300000000000004 20.1 -35.6Q18.900000000000002 -31.900000000000002 18.900000000000002 -27.0Q18.900000000000002 -22.1 20.1 -18.400000000000002Q21.3 -14.700000000000001 24.025 -12.650000000000002Q26.75 -10.600000000000001 31.3 -10.600000000000001ZM67.4 0.0V-54.0H79.4V-45.300000000000004Q80.05000000000001 -46.5 80.9 -47.6Q82.65 -49.900000000000006 85.2 -51.400000000000006Q87.15 -52.6 89.45 -53.275000000000006Q91.75 -53.95 94.2 -54.125Q96.65 -54.300000000000004 99.10000000000001 -54.0V-41.300000000000004Q96.85000000000001 -42.0 93.875 -41.775000000000006Q90.9 -41.550000000000004 88.5 -40.400000000000006Q86.10000000000001 -39.300000000000004 84.45000000000002 -37.475Q82.80000000000001 -35.65 81.95000000000002 -33.175Q81.10000000000001 -30.700000000000003 81.10000000000001 -27.6V0.0ZM107.60000000000001 -61.5V-73.5H121.20000000000002V-61.5ZM107.60000000000001 0.0V-54.0H121.20000000000002V0.0ZM138.7 0.0V-43.5H130.2V-54.0H138.7Q138.7 -56.0 138.8 -58.45Q138.9 -61.050000000000004 139.625 -63.7Q140.35 -66.35000000000001 142.3 -68.5Q144.8 -71.3 147.72500000000002 -72.325Q150.65 -73.35000000000001 153.4 -73.42500000000001Q156.15 -73.5 158.1 -73.5H164.8V-62.5H158.6Q155.4 -62.5 153.85000000000002 -60.875Q152.3 -59.25 152.3 -57.0V-54.0H164.8V-43.5H152.3V0.0ZM195.10000000000002 1.5Q186.95000000000002 1.5 180.8 -2.1500000000000004Q174.65 -5.800000000000001 171.22500000000002 -12.225000000000001Q167.8 -18.650000000000002 167.8 -27.0Q167.8 -35.45 171.3 -41.875Q174.8 -48.300000000000004 180.95000000000002 -51.900000000000006Q187.10000000000002 -55.5 195.10000000000002 -55.5Q203.25 -55.5 209.425 -51.85Q215.60000000000002 -48.2 219.05 -41.775000000000006Q222.5 -35.35 222.5 -27.0Q222.5 -18.6 219.025 -12.175Q215.55 -5.75 209.375 -2.125Q203.20000000000002 1.5 195.10000000000002 1.5ZM195.10000000000002 -11.200000000000001Q201.65 -11.200000000000001 204.875 -15.625Q208.10000000000002 -20.05 208.10000000000002 -27.0Q208.10000000000002 -34.2 204.82500000000002 -38.5Q201.55 -42.800000000000004 195.10000000000002 -42.800000000000004Q190.65 -42.800000000000004 187.8 -40.800000000000004Q184.95000000000002 -38.800000000000004 183.57500000000002 -35.25Q182.20000000000002 -31.700000000000003 182.20000000000002 -27.0Q182.20000000000002 -19.75 185.47500000000002 -15.475000000000001Q188.75 -11.200000000000001 195.10000000000002 -11.200000000000001Z";

export function BrifoWordmark({
  tone = "brand",
  height = 44,
  className,
}: Props) {
  const reversed = tone === "reversed";
  const envelope = reversed ? "currentColor" : "#3B82F6";
  const calendar = reversed ? "currentColor" : "#8B5CF6";
  // Reversed sits on a coloured ground, so the "paper" is the ground itself.
  const paper = reversed ? "none" : "#FFFFFF";

  return (
    <svg
      viewBox="6 2 362 114"
      height={height}
      width={(height * 362) / 114}
      role="img"
      aria-label="Brifo"
      className={className}
    >
      <path
        d="M46 8 V20 M74 8 V20"
        stroke={calendar}
        strokeWidth="7"
        strokeLinecap="round"
      />
      <rect
        x="34"
        y="14"
        width="52"
        height="52"
        rx="9"
        fill={paper}
        stroke={calendar}
        strokeWidth="7"
      />
      <path
        d="M47 31 L56 40 L73 23"
        fill="none"
        stroke={calendar}
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect
        x="12"
        y="50"
        width="96"
        height="58"
        rx="12"
        fill={paper}
        stroke={envelope}
        strokeWidth="8"
      />
      <path
        d="M18 56 L60 86 L102 56"
        fill="none"
        stroke={envelope}
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        transform="translate(134 94)"
        fill="currentColor"
        d={WORDMARK_PATH}
      />
    </svg>
  );
}
