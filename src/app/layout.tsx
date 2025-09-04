import { AuthProvider } from '@/contexts/Authcontext';
import ThemeWrapper from '../components/themeWrapper'
import { WalletProvider } from '@/contexts/WalletContext';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <WalletProvider>
            <ThemeWrapper>{children}</ThemeWrapper>
          </WalletProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
