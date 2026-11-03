export default function PageHeader({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <h2 className="mt-14 mb-6 text-5xl font-extrabold leading-[1.05] tracking-[-1px] lg:tracking-[-2px] pl-10">
      <em className="bg-linear-to-br from-brand-violet via-brand-blue to-brand-pink bg-clip-text not-italic text-transparent">
        {children}
      </em>
    </h2>
  );
}
