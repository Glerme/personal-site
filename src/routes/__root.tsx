import { createRootRoute, Outlet } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'

function RootComponent() {
  const { i18n } = useTranslation()

  useEffect(() => {
    document.documentElement.lang = i18n.language
  }, [i18n.language])

  return (
    <div className="min-h-screen bg-background text-foreground">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-accent focus:text-background focus:rounded-md focus:font-medium focus:outline-none"
      >
        {i18n.language === 'pt-BR' ? 'Pular para o conteúdo' : 'Skip to content'}
      </a>
      <Header />
      <main id="main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export const Route = createRootRoute({
  component: RootComponent,
})
