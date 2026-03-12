import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink, HelpCircle } from "lucide-react";
import { motion } from "motion/react";

const WHATSAPP_NUMBER = "919262269107";

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

function WhatsAppIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export default function HelpPage() {
  const openWhatsApp = () => {
    const text =
      "Hi, I need help with Vishwodya Listener. Can you please assist me?";
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`,
      "_blank",
    );
  };

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

          {/* Contact section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {/* WhatsApp card */}
            <div className="bg-[#25D366]/10 border border-[#25D366]/30 rounded-3xl p-7 flex flex-col items-center text-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#25D366] flex items-center justify-center text-white">
                <WhatsAppIcon size={28} />
              </div>
              <div>
                <p className="font-semibold mb-1">WhatsApp Support</p>
                <p className="text-muted-foreground text-sm">
                  Chat directly with our support team for instant help.
                </p>
              </div>
              <Button
                className="w-full rounded-xl bg-[#25D366] hover:bg-[#20b858] text-white font-semibold gap-2"
                onClick={openWhatsApp}
                data-ocid="help.whatsapp_button"
              >
                <WhatsAppIcon size={16} />
                Chat on WhatsApp
              </Button>
            </div>

            {/* Ticket card */}
            <div className="bg-gradient-to-br from-primary/8 to-accent/8 rounded-3xl p-7 flex flex-col items-center text-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-primary/15 flex items-center justify-center">
                <HelpCircle size={28} className="text-primary" />
              </div>
              <div>
                <p className="font-semibold mb-1">Still have questions?</p>
                <p className="text-muted-foreground text-sm">
                  Submit a support ticket and our team will help you directly.
                </p>
              </div>
              <a
                href="https://vishwodya.netlify.app"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-primary font-semibold hover:underline text-sm"
                data-ocid="help.main_site_link"
              >
                <ExternalLink size={14} />
                Visit vishwodya.netlify.app
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
