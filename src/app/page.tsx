"use client";

import { useEffect, useState } from "react";
import Head from "next/head";
import { Header } from "./landing/header";
import { Footer } from "./landing/footer";
import { HeroSection } from "./landing/hero-section";
import { CTASection } from "./landing/cta-section";
import { FeaturesSection } from "./landing/features-section";
import { HowItWorks } from "./landing/how-it-works";
import { SuccessStories } from "./landing/success-stories";

export default function HomePage() {
  const [isVisible, setIsVisible] = useState({
    hero: false,
    features: false,
    howItWorks: false,
    stories: false,
    cta: false,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible({
        hero: true,
        features: true,
        howItWorks: true,
        stories: true,
        cta: true,
      });
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const sectionClass = (visible: boolean, delay: number) =>
    `transition-all duration-700 ease-out ${
      visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
    } delay-${delay}`;

  return (
    <>
      {/* Header */}
      <Header />

      <main className="mt-16">
        {/* Hero Section */}
        <section id="home" className={sectionClass(isVisible.hero, 0)}>
          <HeroSection />
        </section>

        {/* Features / Diferenciais */}
        <section
          id="features"
          className={sectionClass(isVisible.features, 200)}
        >
          <FeaturesSection />
        </section>

        {/* Como Funciona */}
        <section
          id="como-funciona"
          className={sectionClass(isVisible.howItWorks, 400)}
        >
          <HowItWorks />
        </section>

        {/* Histórias de Sucesso */}
        <section
          id="historias"
          className={sectionClass(isVisible.stories, 600)}
        >
          <SuccessStories />
        </section>

        {/* Call To Action */}
        <section id="cta" className={sectionClass(isVisible.cta, 800)}>
          <CTASection />
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </>
  );
}
