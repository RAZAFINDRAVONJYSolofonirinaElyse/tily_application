export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="flex items-center gap-3">
            <img src="/LogoTily.png"   alt="" className="h-10 w-10 object-contain" />
            <img src="/Fleurdelys.png" alt="" className="h-10 w-10 object-contain" />
          </div>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-500">
            Tily Eto Madagasikara
          </p>
        </div>
        {children}
      </div>
    </div>
  )
}
