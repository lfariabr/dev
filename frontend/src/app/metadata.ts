import { Metadata } from 'next'

const siteUrl = 'https://luisfaria.dev'

export const defaultMetadata: Metadata = {
  title: 'Luis Faria | Full-Stack Developer & Technical Leader',
  description: 'Luis Faria is a Senior Full-Stack Developer and Technical Leader with expertise in modern web technologies, system architecture, and team leadership. Check out my portfolio and projects.',
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: 'Luis Faria | Full-Stack Developer & Technical Leader',
    description: 'Senior Full-Stack Developer and Technical Leader with expertise in modern web technologies and system architecture.',
    url: siteUrl,
    siteName: 'Luis Faria',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Luis Faria | Full-Stack Developer & Technical Leader',
    description: 'Senior Full-Stack Developer and Technical Leader with expertise in modern web technologies and system architecture.',
    creator: '@luisfariabr',
  },
}