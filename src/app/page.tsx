import { Hero } from '@/components/landing/Hero'
import { Features } from '@/components/landing/Features'
import { Benefits } from '@/components/landing/Benefits'
import { Testimonials } from '@/components/landing/Testimonials'
import { Faq } from '@/components/landing/Faq'
import { CtaFinal } from '@/components/landing/CtaFinal'

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Features />
      <Benefits />
      <Testimonials />
      <Faq />
      <CtaFinal />
    </main>
  )
}
