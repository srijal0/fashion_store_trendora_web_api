import Image from "next/image";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <section className="h-screen">
      <div className="h-full w-full grid md:grid-cols-2">

       
      
        <div className="relative hidden md:block h-full">
          <Image
            src="/image1.png"  
            src="/image1.png"   
            alt="Trendora"
            fill
            priority
            className="object-cover"
          />
        </div>

        <div className="flex h-full items-center justify-center px-4 md:px-10 bg-rose-50">
          {children}
        </div>

      </div>
    </section>
  );
}