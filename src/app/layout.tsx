import type { Metadata } from "next";
import "./globals.css";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import SessionProvider from "../components/SessionProvider";
import { getServerSession } from "next-auth";

export const metadata: Metadata = {
  title: "KAI Inventory",
  description: "",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession();

  return (
    <html>
      <body>
        <SessionProvider session={session} refetchInterval={5 * 60}>
          <AntdRegistry>{children}</AntdRegistry>
        </SessionProvider>
      </body>
    </html>
  );
}
