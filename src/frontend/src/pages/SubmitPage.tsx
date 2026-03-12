import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, Copy, Loader2, Paperclip, X } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { IssueType, useSubmitTicket } from "../hooks/useQueries";

const WHATSAPP_NUMBER = "919262269107";

const ISSUE_LABELS: Record<IssueType, string> = {
  [IssueType.paymentIssue]: "Payment Issue",
  [IssueType.sessionConnectionIssue]: "Session Connection Issue",
  [IssueType.technicalBug]: "Technical Bug",
  [IssueType.accountLoginProblem]: "Account / Login Problem",
  [IssueType.generalFeedback]: "General Feedback",
};

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

export default function SubmitPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    sessionId: "",
    issueType: "" as IssueType | "",
    message: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [ticketId, setTicketId] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { mutate: submitTicket, isPending } = useSubmitTicket();

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Enter a valid email";
    if (!form.phone.trim()) e.phone = "Phone number is required";
    if (!form.issueType) e.issueType = "Please select an issue type";
    if (!form.message.trim()) e.message = "Please describe your issue";
    else if (form.message.trim().length < 20)
      e.message = "Please provide at least 20 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    submitTicket(
      {
        name: form.name,
        email: form.email,
        phone: form.phone,
        sessionId: form.sessionId || null,
        issueType: form.issueType as IssueType,
        message: form.message,
        file,
      },
      {
        onSuccess: (id) => {
          setTicketId(id);
          toast.success("Support ticket submitted successfully!");
        },
        onError: (err) => {
          toast.error("Failed to submit ticket. Please try again.");
          console.error(err);
        },
      },
    );
  };

  const copyTicketId = () => {
    if (ticketId) {
      navigator.clipboard.writeText(ticketId);
      toast.success("Ticket ID copied!");
    }
  };

  const openWhatsApp = (prefilledMsg?: string) => {
    const text = prefilledMsg ?? "Hi, I need support from Vishwodya Listener.";
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`,
      "_blank",
    );
  };

  if (ticketId) {
    const waMsg = `Hi, I just submitted a support ticket on Vishwodya Listener.\n\nTicket ID: ${ticketId}\nName: ${form.name}\nIssue: ${form.issueType ? ISSUE_LABELS[form.issueType as IssueType] : ""}\n\nPlease help me with this issue. Thank you!`;

    return (
      <main className="min-h-screen py-16 px-6 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-lg"
          data-ocid="submit.success_state"
        >
          <Card className="rounded-3xl border-0 shadow-deep text-center p-4">
            <CardContent className="p-10">
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={36} className="text-green-600" />
              </div>
              <h2 className="font-display text-2xl font-bold mb-3">
                Ticket Submitted!
              </h2>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                Your support request has been received. Save your Ticket ID
                below to track your request status.
              </p>
              <div className="bg-muted rounded-2xl p-5 mb-6">
                <p className="text-xs text-muted-foreground mb-2 uppercase tracking-widest font-medium">
                  Your Ticket ID
                </p>
                <div className="flex items-center justify-center gap-3">
                  <Input
                    readOnly
                    value={ticketId}
                    className="text-center font-display text-xl font-bold border-0 bg-transparent text-primary"
                    data-ocid="submit.ticket_id_input"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={copyTicketId}
                    className="rounded-xl shrink-0"
                    data-ocid="submit.copy_button"
                  >
                    <Copy size={16} />
                  </Button>
                </div>
              </div>

              {/* WhatsApp CTA */}
              <div className="bg-[#25D366]/10 border border-[#25D366]/30 rounded-2xl p-5 mb-6">
                <p className="text-sm font-semibold mb-1">Need faster help?</p>
                <p className="text-xs text-muted-foreground mb-4">
                  Send your ticket details directly to our WhatsApp support.
                </p>
                <Button
                  className="w-full rounded-xl bg-[#25D366] hover:bg-[#20b858] text-white font-semibold gap-2"
                  onClick={() => openWhatsApp(waMsg)}
                  data-ocid="submit.whatsapp_button"
                >
                  <WhatsAppIcon size={18} />
                  Send on WhatsApp
                </Button>
              </div>

              <p className="text-sm text-muted-foreground">
                We will respond to your ticket within <strong>24 hours</strong>.
              </p>
              <Button
                className="mt-6 rounded-2xl bg-primary text-primary-foreground w-full"
                onClick={() => setTicketId(null)}
                data-ocid="submit.new_request_button"
              >
                Submit Another Request
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="py-16 px-6">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <div className="mb-10">
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-3">
              Submit a Request
            </h1>
            <p className="text-muted-foreground text-lg">
              Describe your issue and we'll get back to you within 24 hours.
            </p>
          </div>

          {/* WhatsApp quick contact banner */}
          <div className="flex items-center gap-4 bg-[#25D366]/10 border border-[#25D366]/30 rounded-2xl p-4 mb-8">
            <div className="w-10 h-10 rounded-xl bg-[#25D366] flex items-center justify-center text-white shrink-0">
              <WhatsAppIcon size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold">Prefer WhatsApp?</p>
              <p className="text-xs text-muted-foreground">
                Chat with us directly for quick help.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl border-[#25D366] text-[#25D366] hover:bg-[#25D366]/10 shrink-0 font-semibold"
              onClick={() => openWhatsApp()}
              data-ocid="submit.whatsapp_quick_button"
            >
              Chat Now
            </Button>
          </div>

          <Card className="rounded-3xl border-0 shadow-card">
            <CardContent className="p-8 md:p-10">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name + Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="font-medium">
                      Full Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="name"
                      placeholder="Your name or nickname"
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                      className={`rounded-xl h-12 ${errors.name ? "border-destructive" : ""}`}
                      data-ocid="submit.name_input"
                    />
                    {errors.name && (
                      <p
                        className="text-xs text-destructive"
                        data-ocid="submit.name_error"
                      >
                        {errors.name}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="font-medium">
                      Email Address <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                      className={`rounded-xl h-12 ${errors.email ? "border-destructive" : ""}`}
                      data-ocid="submit.email_input"
                    />
                    {errors.email && (
                      <p
                        className="text-xs text-destructive"
                        data-ocid="submit.email_error"
                      >
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                {/* Phone + Session ID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="font-medium">
                      Phone Number <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={form.phone}
                      onChange={(e) =>
                        setForm({ ...form, phone: e.target.value })
                      }
                      className={`rounded-xl h-12 ${errors.phone ? "border-destructive" : ""}`}
                      data-ocid="submit.phone_input"
                    />
                    {errors.phone && (
                      <p
                        className="text-xs text-destructive"
                        data-ocid="submit.phone_error"
                      >
                        {errors.phone}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sessionId" className="font-medium">
                      Session ID{" "}
                      <span className="text-muted-foreground text-xs">
                        (optional)
                      </span>
                    </Label>
                    <Input
                      id="sessionId"
                      placeholder="e.g. VS031101"
                      value={form.sessionId}
                      onChange={(e) =>
                        setForm({ ...form, sessionId: e.target.value })
                      }
                      className="rounded-xl h-12"
                      data-ocid="submit.session_id_input"
                    />
                  </div>
                </div>

                {/* Issue Type */}
                <div className="space-y-2">
                  <Label className="font-medium">
                    Issue Type <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={form.issueType}
                    onValueChange={(v) =>
                      setForm({ ...form, issueType: v as IssueType })
                    }
                  >
                    <SelectTrigger
                      className={`rounded-xl h-12 ${errors.issueType ? "border-destructive" : ""}`}
                      data-ocid="submit.issue_type_select"
                    >
                      <SelectValue placeholder="Select an issue type" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl">
                      {Object.entries(ISSUE_LABELS).map(([value, label]) => (
                        <SelectItem
                          key={value}
                          value={value}
                          className="rounded-xl"
                        >
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.issueType && (
                    <p
                      className="text-xs text-destructive"
                      data-ocid="submit.issue_type_error"
                    >
                      {errors.issueType}
                    </p>
                  )}
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <Label htmlFor="message" className="font-medium">
                    Describe Your Issue{" "}
                    <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="message"
                    placeholder="Please describe your issue in detail. The more information you provide, the faster we can help."
                    rows={5}
                    value={form.message}
                    onChange={(e) =>
                      setForm({ ...form, message: e.target.value })
                    }
                    className={`rounded-xl resize-none ${errors.message ? "border-destructive" : ""}`}
                    data-ocid="submit.message_textarea"
                  />
                  {errors.message && (
                    <p
                      className="text-xs text-destructive"
                      data-ocid="submit.message_error"
                    >
                      {errors.message}
                    </p>
                  )}
                </div>

                {/* File upload */}
                <div className="space-y-2">
                  <Label className="font-medium">
                    Attachment{" "}
                    <span className="text-muted-foreground text-xs">
                      (optional screenshot)
                    </span>
                  </Label>
                  <div className="relative">
                    {file ? (
                      <div className="flex items-center gap-3 p-4 rounded-xl border border-border bg-muted/30">
                        <Paperclip size={16} className="text-primary" />
                        <span className="text-sm flex-1 truncate">
                          {file.name}
                        </span>
                        <button
                          type="button"
                          onClick={() => setFile(null)}
                          className="text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <label
                        className="flex items-center justify-center gap-3 p-6 rounded-xl border-2 border-dashed border-border hover:border-primary/50 hover:bg-primary/3 transition-colors cursor-pointer"
                        data-ocid="submit.attachment_upload_button"
                      >
                        <input
                          type="file"
                          accept="image/*"
                          className="sr-only"
                          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                        />
                        <Paperclip
                          size={18}
                          className="text-muted-foreground"
                        />
                        <span className="text-sm text-muted-foreground">
                          Click to upload a screenshot (PNG, JPG)
                        </span>
                      </label>
                    )}
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isPending}
                  className="w-full h-13 rounded-2xl bg-primary text-primary-foreground text-base font-semibold shadow-soft hover:bg-primary/90 mt-2"
                  data-ocid="submit.submit_button"
                >
                  {isPending ? (
                    <>
                      <Loader2 size={18} className="mr-2 animate-spin" />{" "}
                      Submitting...
                    </>
                  ) : (
                    "Submit Support Request"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </main>
  );
}
