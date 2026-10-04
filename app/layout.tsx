import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

/** Geist Sans aporta una tipografía legible para la interfaz y los textos del portfolio. */
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

/** Geist Mono reserva una tipografía técnica para etiquetas y datos del escritorio. */
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AntenehOS — Portfolio de Anteneh",
  description: "Portfolio personal de Anteneh, desarrollador web, con proyectos 3D interactivos.",
};

/** Layout global de Next.js: fija el idioma y carga estilos y fuentes una sola vez. */
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
