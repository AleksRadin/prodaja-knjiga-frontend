import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="relative h-screen w-full">
      <Image
        src="/front_page.jpg"
        alt=""
        fill={true}
        className="object-cover"
        priority={true}
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 text-white p-4">
        <Link href="/listings">
          <button className="px-10 py-4 bg-green-600 text-xl font-bold rounded-full shadow-2xl hover:bg-green-700 transition duration-300 transform hover:scale-105 uppercase tracking-wider">
            Explore
          </button>
        </Link>
      </div>
    </main>
  );
}
