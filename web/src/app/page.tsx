'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Link2,
  UserCheck,
  CircleDollarSign,
  MessageSquare,
  FileSearch,
  Send,
  UtensilsCrossed,
  ArrowRight,
} from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export default function Home() {
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero entrance
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.from('.hero-badge', { opacity: 0, y: 20, duration: 0.6 })
        .from('.hero-title', { opacity: 0, y: 40, duration: 0.8 }, '-=0.3')
        .from('.hero-sub', { opacity: 0, y: 30, duration: 0.7 }, '-=0.4')
        .from('.hero-cta', { opacity: 0, y: 20, duration: 0.6 }, '-=0.3')

      // Features
      gsap.from('.feature-card', {
        scrollTrigger: { trigger: '.features-section', start: 'top 80%' },
        opacity: 0,
        y: 50,
        duration: 0.7,
        stagger: 0.15,
        ease: 'power3.out',
      })

      // Steps
      gsap.from('.step-item', {
        scrollTrigger: { trigger: '.steps-section', start: 'top 80%' },
        opacity: 0,
        y: 40,
        duration: 0.6,
        stagger: 0.15,
        ease: 'power3.out',
      })

      // Stats
      gsap.from('.stat-item', {
        scrollTrigger: { trigger: '.stats-section', start: 'top 85%' },
        opacity: 0,
        y: 30,
        duration: 0.5,
        stagger: 0.1,
        ease: 'power3.out',
      })

      // CTA
      gsap.from('.cta-content', {
        scrollTrigger: { trigger: '.cta-section', start: 'top 80%' },
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: 'power3.out',
      })
    })

    return () => ctx.revert()
  }, [])

  const features = [
    {
      icon: Link2,
      title: 'One Link for Every Lead',
      desc: 'Share your booking link on Instagram, in texts, anywhere. Clients tell you everything you need in 3 minutes.',
    },
    {
      icon: UserCheck,
      title: 'Clients Tracked Automatically',
      desc: 'Every inquiry builds your client database. Search any customer and see their full history in seconds.',
    },
    {
      icon: CircleDollarSign,
      title: 'Quotes That Collect Deposits',
      desc: 'Build professional quotes in minutes. Clients accept and pay deposits right from the link you send.',
    },
  ]

  const steps = [
    {
      icon: MessageSquare,
      step: '01',
      title: 'Client Fills Your Form',
      desc: 'Event details, guest count, dietary needs — everything you need to quote.',
    },
    {
      icon: FileSearch,
      step: '02',
      title: 'You Review & Quote',
      desc: 'See the full inquiry. Build a quote with your menu items and pricing.',
    },
    {
      icon: Send,
      step: '03',
      title: 'Client Accepts & Pays',
      desc: 'They review your quote and pay the deposit online. Done.',
    },
    {
      icon: UtensilsCrossed,
      step: '04',
      title: 'You Do Your Thing',
      desc: 'Focus on creating incredible food. The PlatterPath handles the rest.',
    },
  ]

  const stats = [
    { value: '3 min', label: 'Average form completion' },
    { value: '5+ hrs', label: 'Saved per week on admin' },
    { value: '$0', label: 'To start. Free for 3 months.' },
  ]

  return (
    <div className="overflow-hidden">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-stone-200 shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 h-16">
          <span className="font-display text-xl font-semibold text-stone-900 tracking-tight">
            The PlatterPath
          </span>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Log In
              </Button>
            </Link>
            <Link href="/login">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative flex min-h-screen items-center pt-16 bg-gradient-to-b from-white via-gold-50/40 to-cream">
        {/* Gradient orbs */}
        <div className="pointer-events-none absolute top-32 -left-32 h-[500px] w-[500px] rounded-full bg-gold-200/50 blur-[120px]" />
        <div className="pointer-events-none absolute top-64 right-0 h-[400px] w-[400px] rounded-full bg-gold-100/60 blur-[100px]" />
        <div className="pointer-events-none absolute bottom-32 left-1/3 h-[300px] w-[300px] rounded-full bg-gold-300/30 blur-[80px]" />

        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <div className="hero-badge mb-8 inline-flex items-center gap-2 rounded-full bg-gold-100 px-4 py-1.5 text-sm font-medium text-gold-700">
            <span className="h-1.5 w-1.5 rounded-full bg-gold-500" />
            Built for independent caterers
          </div>

          <h1 className="hero-title mb-6 font-display text-5xl font-semibold leading-[1.1] tracking-tight text-stone-900 sm:text-6xl lg:text-7xl">
            Your Booking Link.
            <br />
            <span className="text-gold-500">Their First Impression.</span>
          </h1>

          <p className="hero-sub mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-stone-600 sm:text-xl">
            Give every client a seamless experience — from first inquiry to
            deposit. One link. One platform. Zero chaos.
          </p>

          <div className="hero-cta flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/login">
              <Button size="lg" className="min-w-[180px]">
                Start Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <a href="#how-it-works">
              <Button variant="outline" size="lg" className="min-w-[180px]">
                See How It Works
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features-section py-24 sm:py-32 bg-white border-y border-stone-100">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-16 text-center">
            <h2 className="mb-4 font-display text-3xl font-semibold text-stone-900 sm:text-4xl">
              Replace Five Tools With One
            </h2>
            <p className="mx-auto max-w-xl text-lg text-stone-600">
              Stop switching between DMs, notebooks, spreadsheets, and payment
              apps.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="feature-card group rounded-2xl border border-stone-200 bg-white p-8 shadow-sm transition-all duration-300 hover:border-gold-300 hover:shadow-xl hover:shadow-gold-100/50"
              >
                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gold-50 text-gold-600 transition-colors group-hover:bg-gold-100">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-3 font-display text-xl font-semibold text-stone-900">
                  {feature.title}
                </h3>
                <p className="leading-relaxed text-stone-600">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section
        id="how-it-works"
        className="steps-section bg-stone-100/60 py-24 sm:py-32"
      >
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-16 text-center">
            <h2 className="mb-4 font-display text-3xl font-semibold text-stone-900 sm:text-4xl">
              How The PlatterPath Works
            </h2>
            <p className="text-lg text-stone-600">
              Four steps. That&apos;s it.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s) => (
              <div key={s.step} className="step-item relative">
                <span className="mb-4 block font-display text-5xl font-bold text-gold-200">
                  {s.step}
                </span>
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gold-50 text-gold-600">
                  <s.icon className="h-5 w-5" />
                </div>
                <h3 className="mb-2 font-display text-lg font-semibold text-stone-900">
                  {s.title}
                </h3>
                <p className="text-sm leading-relaxed text-stone-600">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="stats-section border-y border-stone-200 bg-white py-20">
        <div className="mx-auto max-w-4xl px-6">
          <div className="grid grid-cols-3 gap-8 text-center">
            {stats.map((stat) => (
              <div key={stat.label} className="stat-item">
                <p className="mb-1 font-display text-3xl font-bold text-gold-500 sm:text-4xl">
                  {stat.value}
                </p>
                <p className="text-sm text-stone-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="cta-section bg-stone-900 py-24 text-white sm:py-32">
        <div className="cta-content mx-auto max-w-3xl px-6 text-center">
          <h2 className="mb-6 font-display text-3xl font-semibold leading-tight text-white sm:text-4xl lg:text-5xl">
            Ready to look as professional as your food tastes?
          </h2>
          <p className="mx-auto mb-10 max-w-xl text-lg text-stone-400">
            Join the caterers who stopped chasing bookings and started growing.
          </p>
          <Link href="/login">
            <Button
              size="lg"
              className="min-w-[220px] bg-gold-400 font-semibold text-stone-900 shadow-lg shadow-gold-400/20 hover:bg-gold-500"
            >
              Start Your Free Trial
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <p className="mt-4 text-sm text-stone-600">
            Free for 3 months. No credit card required.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-stone-950 py-12 text-stone-600">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 sm:flex-row">
          <span className="font-display text-lg text-stone-400">
            The PlatterPath
          </span>
          <div className="flex items-center gap-6 text-sm">
            <a
              href="/privacy"
              className="transition-colors hover:text-stone-300"
            >
              Privacy
            </a>
            <a
              href="/terms"
              className="transition-colors hover:text-stone-300"
            >
              Terms
            </a>
          </div>
          <p className="text-sm">Made with care for caterers</p>
        </div>
      </footer>
    </div>
  )
}
