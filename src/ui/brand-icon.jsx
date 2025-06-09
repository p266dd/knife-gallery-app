import Image from "next/image";

import BrandIconLogo from "@/assets/brand-icon.png";

export default function BrandIcon() {
  return (
    <div className="w-full flex justify-center">
      <Image priority src={BrandIconLogo} alt="Ironclad Logo" className="w-12" />
    </div>
  );
}
