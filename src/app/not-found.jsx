import Image from "next/image";
import Link from "next/link";

export default function NotFoundPage() {
  return (
    <main className="h-full flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Image
          priority
          src="/img/logo.png"
          width={897}
          height={192}
          alt="Ironclad"
          className="w-52"
        />

        <div className="my-8 text-center">
          <h1 className="text-2xl font-light mb-3">
            Page <strong className="font-semibold">Not Found!</strong>
          </h1>
          <p className="text-base">
            Return to{" "}
            <Link className="underline" href="/">
              Home page
            </Link>
            .
          </p>
        </div>
      </div>
    </main>
  );
}
