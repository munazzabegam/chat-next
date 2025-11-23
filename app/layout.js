// app/layout.jsx
import './globals.css';

export const metadata = {
  title: 'Live Group Chat',
  description: 'Real-time chat application built with Next.js, Prisma, and Pusher.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}