// app/layout.tsx hoặc app/layout.ts
import Header from '@/components/header/header';
import { LanguageProvider } from '../context/languageContext';
import { Providers } from '@/lib/Providers';

// export const metadata = {
//   title: 'MentalAI',
//   description: 'AI Tư vấn tâm lý',
// };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body>
        <Providers>
        <LanguageProvider>
          <Header />
          <main>{children}</main>
        </LanguageProvider>
        </Providers>
      </body>
    </html>
  );
}
