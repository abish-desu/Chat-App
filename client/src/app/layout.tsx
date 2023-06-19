import './globals.css'



export const metadata = {
  title: 'Chatu',
  description: 'Simple chat application',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
