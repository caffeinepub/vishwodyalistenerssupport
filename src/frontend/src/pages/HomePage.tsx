import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Clock,
  ExternalLink,
  FileText,
  HeartHandshake,
  MessageCircle,
  Search,
  ShieldCheck,
} from "lucide-react";
import type { Variants } from "motion/react";
import { motion } from "motion/react";

interface HomePageProps {
  onNavigate: (page: string) => void;
}

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.55, ease: "easeOut" },
  }),
};

const CATEGORIES = [
  { icon: "💳", label: "Payment Issues" },
  { icon: "📞", label: "Session Connection" },
  { icon: "🔧", label: "Technical Bugs" },
  { icon: "🔐", label: "Account Problems" },
  { icon: "💬", label: "General Feedback" },
];

export default function HomePage({ onNavigate }: HomePageProps) {
  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5 py-24 md:py-36">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/8 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4 pointer-events-none" />

        <div className="max-w-4xl mx-auto px-6 text-center relative">
          <motion.div
            initial="hidden"
            animate="show"
            variants={fadeUp}
            custom={0}
          >
            <span className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-1.5 rounded-full text-sm font-medium mb-6">
              <HeartHandshake size={15} />
              Emotional Listening Support Platform
            </span>
          </motion.div>

          <motion.h1
            className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-[1.05]"
            initial="hidden"
            animate="show"
            variants={fadeUp}
            custom={1}
          >
            We&apos;re here{" "}
            <span className="text-primary relative">
              to help
              <svg
                aria-hidden="true"
                className="absolute -bottom-2 left-0 w-full"
                height="8"
                viewBox="0 0 100 8"
                preserveAspectRatio="none"
              >
                <path
                  d="M0,6 Q50,0 100,6"
                  stroke="oklch(0.70 0.18 50)"
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </motion.h1>

          <motion.p
            className="text-xl text-muted-foreground max-w-xl mx-auto mb-10 leading-relaxed"
            initial="hidden"
            animate="show"
            variants={fadeUp}
            custom={2}
          >
            Submit a support request and our team will respond within 24 hours.
            We&apos;re committed to resolving every issue with care.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial="hidden"
            animate="show"
            variants={fadeUp}
            custom={3}
          >
            <Button
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-2xl px-8 py-6 text-base font-semibold shadow-soft"
              onClick={() => onNavigate("submit")}
              data-ocid="home.submit_button"
            >
              <FileText size={18} className="mr-2" />
              Submit a Request
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-accent text-accent hover:bg-accent/10 rounded-2xl px-8 py-6 text-base font-semibold"
              onClick={() => onNavigate("track")}
              data-ocid="home.track_button"
            >
              <Search size={18} className="mr-2" />
              Track Your Ticket
            </Button>
          </motion.div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 max-w-6xl mx-auto px-6">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
            How It Works
          </h2>
          <p className="text-muted-foreground text-lg">
            Get support in three simple steps
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: FileText,
              step: "01",
              title: "Submit Request",
              desc: "Fill in your details and describe your issue. Takes less than 2 minutes.",
            },
            {
              icon: Search,
              step: "02",
              title: "Get Ticket ID",
              desc: "Receive a unique Ticket ID instantly to track your support request.",
            },
            {
              icon: MessageCircle,
              step: "03",
              title: "Team Responds",
              desc: "Our support team reviews and responds to your ticket within 24 hours.",
            },
          ].map(({ icon: Icon, step, title, desc }, i) => (
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.5 }}
            >
              <Card className="rounded-3xl border-0 shadow-card p-2 hover:shadow-deep transition-shadow duration-300">
                <CardContent className="p-8">
                  <div className="flex items-start gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                      <Icon size={24} className="text-primary" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-accent uppercase tracking-widest mb-1 block">
                        Step {step}
                      </span>
                      <h3 className="font-display text-xl font-bold mb-2">
                        {title}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {desc}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-3xl font-bold mb-3">
              What We Can Help With
            </h2>
            <p className="text-muted-foreground">
              Our support covers all aspects of the Vishwodya platform
            </p>
          </motion.div>
          <div className="flex flex-wrap justify-center gap-4">
            {CATEGORIES.map(({ icon, label }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -3 }}
                className="bg-background rounded-2xl shadow-soft px-6 py-4 flex items-center gap-3 cursor-default"
              >
                <span className="text-2xl">{icon}</span>
                <span className="font-medium text-sm">{label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust signals */}
      <section className="py-20 max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: Clock,
              title: "24h Response",
              desc: "We aim to respond to every ticket within 24 hours of submission.",
            },
            {
              icon: ShieldCheck,
              title: "Privacy First",
              desc: "Your data and conversations are kept strictly confidential.",
            },
            {
              icon: HeartHandshake,
              title: "Human Support",
              desc: "Every ticket is reviewed by a real person who genuinely cares.",
            },
          ].map(({ icon: Icon, title, desc }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex gap-4 p-6 rounded-2xl bg-primary/4"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center shrink-0">
                <Icon size={20} className="text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Platform Banner */}
      <section className="py-6 px-6 mb-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-r from-primary to-primary/80 rounded-3xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="text-white">
              <p className="text-sm opacity-75 mb-1">
                Looking for emotional listening sessions?
              </p>
              <p className="font-display text-xl font-bold">
                Visit the main Vishwodya Listener platform
              </p>
            </div>
            <a
              href="https://vishwodya.netlify.app"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white text-primary font-semibold px-6 py-3 rounded-2xl hover:bg-white/90 transition-colors shrink-0"
              data-ocid="home.main_platform_link"
            >
              <ExternalLink size={16} />
              vishwodya.netlify.app
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
