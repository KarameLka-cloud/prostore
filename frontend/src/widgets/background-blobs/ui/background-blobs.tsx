export default function BackgroundBlob() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[-1] overflow-hidden"
    >
      <div className="absolute -left-25 -top-37.5 size-125 animate-blob rounded-full bg-brand-violet opacity-50 blur-[120px]" />
      <div className="absolute -right-25 top-[40%] size-100 animate-blob rounded-full bg-brand-blue opacity-50 blur-[120px] [animation-delay:-7s]" />
      <div className="absolute -bottom-37.5 left-[30%] size-112.5 animate-blob rounded-full bg-brand-pink opacity-30 blur-[120px] [animation-delay:-13s]" />
    </div>
  );
}
