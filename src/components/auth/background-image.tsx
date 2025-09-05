'use client';

import Image from 'next/image';

export function BackgroundImage() {
  return (
    <div className="fixed top-0 left-0 w-full h-full overflow-hidden z-0">
      <Image
        src="https://i.postimg.cc/wvTKDFjP/fhdminimal115.jpg"
        alt="Background"
        layout="fill"
        objectFit="cover"
        quality={100}
        priority
      />
      <div className="absolute inset-0 bg-black/30" />
    </div>
  );
}
