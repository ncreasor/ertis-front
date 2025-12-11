import Image from "next/image";

export function Logo() {
  return (
    <div className="relative w-[50px] h-[50px] md:w-[60px] md:h-[60px] shrink-0">
      <Image
        src="/image_4.png"
        alt="Shanyrak - Ertis Service Logo"
        width={60}
        height={60}
        className="object-contain"
        priority
      />
    </div>
  );
}

export function LogoText() {
  return (
    <span 
      className="logo-text text-sm sm:text-base md:text-xl lg:text-2xl font-bold tracking-wide whitespace-nowrap"
      style={{
        fontFamily: "'NauryzRedKeds', 'Montserrat', sans-serif",
        color: '#FFFFFF',
      }}
    >
      ERTIS SERVICE
    </span>
  );
}
