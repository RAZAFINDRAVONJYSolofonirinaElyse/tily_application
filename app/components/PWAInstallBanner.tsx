'use client'
import { useEffect, useState } from 'react'
import Image from 'next/image'

type Platform = 'ios' | 'android' | null

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export default function PWAInstallBanner() {
  const [platform, setPlatform] = useState<Platform>(null)
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Ne pas afficher si déjà installé
    if (window.matchMedia('(display-mode: standalone)').matches) return
    if ((navigator as { standalone?: boolean }).standalone) return

    const ua = navigator.userAgent
    const isIOS = /iPad|iPhone|iPod/.test(ua) && !(window as { MSStream?: unknown }).MSStream
    const isAndroid = /Android/.test(ua)

    if (isIOS) {
      // iOS Safari : prompt manuel requis
      const dismissed = sessionStorage.getItem('pwa-banner-dismissed')
      if (!dismissed) {
        setPlatform('ios')
        setVisible(true)
      }
    }

    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      if (isAndroid || !isIOS) {
        const dismissed = sessionStorage.getItem('pwa-banner-dismissed')
        if (!dismissed) {
          setPlatform('android')
          setVisible(true)
        }
      }
    }

    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return
    await deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') setVisible(false)
    setDeferredPrompt(null)
  }

  const handleDismiss = () => {
    sessionStorage.setItem('pwa-banner-dismissed', '1')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg px-4 py-3 flex items-start gap-3">
      <Image src="/LogoTily.png" alt="Tily" width={48} height={48} className="rounded-xl shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-900 text-sm">Installer Tily</p>
        {platform === 'ios' ? (
          <p className="text-xs text-gray-600 mt-0.5">
            Appuyez sur{' '}
            <span className="inline-block">
              <svg className="inline w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l-4 4h3v8h2V6h3l-4-4zm-7 14v4h14v-4h-2v2H7v-2H5z"/>
              </svg>
            </span>{' '}
            puis <strong>« Sur l&apos;écran d&apos;accueil »</strong>
          </p>
        ) : (
          <p className="text-xs text-gray-600 mt-0.5">Accès rapide depuis votre écran d&apos;accueil</p>
        )}
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {platform !== 'ios' && (
          <button
            onClick={handleInstall}
            className="bg-purple-700 text-white text-xs font-medium px-3 py-1.5 rounded-lg"
          >
            Installer
          </button>
        )}
        <button
          onClick={handleDismiss}
          className="text-gray-400 hover:text-gray-600 p-1"
          aria-label="Fermer"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  )
}
