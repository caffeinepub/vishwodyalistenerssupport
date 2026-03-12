import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

const ISSUE_LABELS: Record<IssueType, string> = {
  [IssueType.paymentIssue]: "Payment Issue",
  [IssueType.sessionConnectionIssue]: "Session Connection Issue",
  [IssueType.technicalBug]: "Technical Bug",
  [IssueType.accountLoginProblem]: "Account / Login Problem",
  [IssueType.generalFeedback]: "General Feedback",
};

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

  if (ticketId) {
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
              <p className="text-sm text-muted-foreground">
                We will respond to your ticket within <strong>24 hours</strong>.
              </p>
              <Button
                className="mt-6 rounded-2xl bg-primary text-primary-foreground w-full"
                onClick={() => setTicketId(null)}
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
