export default function Contour({ className = "" }) {
  return (
    <img
      className={`contour ${className}`.trim()}
      src="/images/contour.svg"
      alt=""
      aria-hidden="true"
      loading="lazy"
      decoding="async"
    />
  );
}
