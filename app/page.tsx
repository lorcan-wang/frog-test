'use client'
import { getFrameMetadata } from 'frog/next';
import type { Metadata } from 'next';
import Image from 'next/image';

import styles from './page.module.css';
import { postComposerCreateCastActionMessage } from 'frog/next';

// export async function generateMetadata(): Promise<Metadata> {
//   const frameTags = await getFrameMetadata(`${process.env.VERCEL_URL || 'http://localhost:3000'}/api`);
//   return {
//     other: frameTags,
//   };
// }

export default function Home() {
  return (
    <main className={styles.main}>
      <button
        onClick={() =>
          postComposerCreateCastActionMessage({
            // channelKey?: string | undefined;
            embeds: [],
            // parent?: string | undefined;
            text: 'aga',
          })
        }>
        Button
      </button>
    </main>
  );
}
