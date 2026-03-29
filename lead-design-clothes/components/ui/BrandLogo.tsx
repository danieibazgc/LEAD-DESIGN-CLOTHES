import Image from "next/image";

interface BrandLogoProps {
  className?: string;
}

export function BrandLogo({ className }: BrandLogoProps) {
  return (
    <div className={className}>
      <Image
        src="/brand/lead-clothes-logo.jpeg"
        alt="LEAD design clothes"
        width={1376}
        height={768}
        className="h-full w-auto object-contain"
        sizes="(max-width: 640px) 180px, 240px"
        priority
      />
    </div>
  );
}
