import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink, HelpCircle } from "lucide-react";
import { motion } from "motion/react";

const FAQS = [
  {
    id: "faq-1",
    q: "How do I book a listening session?",
    a: "Visit the main Vishwodya platform at vishwodya.netlify.app and click 'Talk to a Listener'. Fill in the session request form with your details, preferred listener, and problem category. You'll receive a unique Session ID once your request is submitted.",
  },
  {
    id: "faq-2",
    q: "How do I upload a payment screenshot?",
    a: "When submitting a support ticket for payment issues, you can attach a screenshot using the file upload field on the Submit Request page. Accepted formats are PNG and JPG. Make sure the screenshot clearly shows the transaction details.",
  },
  {
    id: "faq-3",
    q: "How does the referral system work?",
    a: "Every registered user on Vishwodya receives a unique Referral Code (e.g., REF2451). Share this code with friends — when they use it to sign up, both of you earn rewards. 1 referral = 5 free minutes, 3 referrals = 15 free minutes, 5 referrals = 30 free minutes.",
  },
  {
    id: "faq-4",
    q: "How do coupon codes work?",
    a: "Coupon codes can be entered during session booking to get discounts. Examples: FIRST50 (50% off), LISTEN30 (30% off), WELCOME20 (₹20 off). Each coupon has an expiry date and usage limit. If a coupon isn't working, it may have expired or reached its usage limit.",
  },
  {
    id: "faq-5",
    q: "How do I check my session status?",
    a: "You can track your session using the Session ID provided after booking. Visit the main platform at vishwodya.netlify.app and enter your Session ID in the tracking section. Session statuses include: Pending, Assigned, Connected, Completed, and Cancelled.",
  },
];

export default function HelpPage() {
  return (
    <main className="py-16 px-6">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <div className="text-center mb-12">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <HelpCircle size={28} className="text-primary" />
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-3">
              Help Center
            </h1>
            <p className="text-muted-foreground text-lg">
              Answers to frequently asked questions
            </p>
          </div>

          <Card className="rounded-3xl border-0 shadow-card mb-10">
            <CardContent className="p-6 md:p-10">
              <Accordion type="single" collapsible className="space-y-2">
                {FAQS.map(({ id, q, a }, i) => (
                  <AccordionItem
                    key={id}
                    value={id}
                    className="border border-border rounded-2xl px-6 data-[state=open]:shadow-soft"
                    data-ocid={`help.faq_item.${i + 1}`}
                  >
                    <AccordionTrigger className="font-semibold text-left py-5 hover:no-underline hover:text-primary">
                      {q}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
                      {a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          <div className="bg-gradient-to-r from-primary/8 to-accent/8 rounded-3xl p-8 text-center">
            <p className="font-semibold mb-2">Still have questions?</p>
            <p className="text-muted-foreground text-sm mb-4">
              Submit a support ticket and our team will help you directly.
            </p>
            <a
              href="https://vishwodya.netlify.app"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-primary font-semibold hover:underline text-sm"
            >
              <ExternalLink size={14} />
              Visit vishwodya.netlify.app
            </a>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
