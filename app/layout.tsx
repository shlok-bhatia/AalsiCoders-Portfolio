import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AalsiCoders — We Build The Future',
  description: 'Full-stack development, cybersecurity, and machine learning. Enter the headquarters.',
  openGraph: {
    title: 'AalsiCoders',
    description: 'We Build The Future',
    url: 'https://aalsicoders.in',
    siteName: 'AalsiCoders',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
