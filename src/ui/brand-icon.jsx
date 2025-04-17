import Image from "next/image";

export default function BrandIcon() {
  return (
    <div className="w-full flex justify-center">
      <Image
        priority
        src="/img/brand-icon.png"
        alt="Ironclad Logo"
        width={172}
        height={169}
        className="w-12"
      />
    </div>
  );
}
