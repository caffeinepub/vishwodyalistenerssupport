import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  CheckCircle,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  Lock,
  MessageSquare,
  Settings,
  UserPlus,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { SupportTicket } from "../backend";
import {
  IssueType,
  TicketStatus,
  useAddStaffMember,
  useGetAllStaff,
  useGetAllTickets,
  useRespondToTicket,
  useUpdateTicketStatus,
} from "../hooks/useQueries";

const DEFAULT_PIN = "ADMIN2024";
const PIN_STORAGE_KEY = "admin_pin";

function getStoredPin(): string {
  return localStorage.getItem(PIN_STORAGE_KEY) ?? DEFAULT_PIN;
}

const STATUS_CONFIG: Record<
  TicketStatus,
  { label: string; color: string; bg: string }
> = {
  [TicketStatus.open]: {
    label: "Open",
    color: "text-blue-700",
    bg: "bg-blue-100",
  },
  [TicketStatus.inReview]: {
    label: "In Review",
    color: "text-orange-700",
    bg: "bg-orange-100",
  },
  [TicketStatus.resolved]: {
    label: "Resolved",
    color: "text-green-700",
    bg: "bg-green-100",
  },
  [TicketStatus.closed]: {
    label: "Closed",
    color: "text-gray-600",
    bg: "bg-gray-100",
  },
};

const ISSUE_LABELS: Record<IssueType, string> = {
  [IssueType.paymentIssue]: "Payment",
  [IssueType.sessionConnectionIssue]: "Session",
  [IssueType.technicalBug]: "Tech Bug",
  [IssueType.accountLoginProblem]: "Account",
  [IssueType.generalFeedback]: "Feedback",
};

function formatDate(ts: bigint) {
  return new Date(Number(ts) / 1_000_000).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function PinGate({ onUnlock }: { onUnlock: () => void }) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [showPin, setShowPin] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === getStoredPin()) {
      sessionStorage.setItem("admin_auth", "1");
      onUnlock();
    } else {
      setError("Incorrect PIN. Please try again.");
      setPin("");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <Card className="rounded-3xl border-0 shadow-deep">
          <CardContent className="p-10">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Lock size={28} className="text-primary" />
              </div>
              <h1 className="font-display text-2xl font-bold">Admin Access</h1>
              <p className="text-muted-foreground text-sm mt-2">
                Enter your admin PIN to continue
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="pin">Admin PIN</Label>
                <div className="relative">
                  <Input
                    id="pin"
                    type={showPin ? "text" : "password"}
                    placeholder="Enter PIN"
                    value={pin}
                    onChange={(e) => {
                      setPin(e.target.value);
                      setError("");
                    }}
                    className={`rounded-xl h-12 pr-12 text-center tracking-widest ${error ? "border-destructive" : ""}`}
                    data-ocid="admin.pin_input"
                    autoComplete="off"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPin((p) => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    data-ocid="admin.pin_toggle"
                  >
                    {showPin ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {error && (
                  <p
                    className="text-xs text-destructive"
                    data-ocid="admin.pin_error"
                  >
                    {error}
                  </p>
                )}
              </div>
              <Button
                type="submit"
                className="w-full h-12 rounded-2xl bg-primary text-primary-foreground font-semibold"
                disabled={!pin}
                data-ocid="admin.pin_submit_button"
              >
                Unlock Dashboard
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </main>
  );
}

function TicketsTable() {
  const { data: tickets = [], isLoading } = useGetAllTickets();
  const { mutate: updateStatus, isPending: updatingStatus } =
    useUpdateTicketStatus();
  const { mutate: respondToTicket, isPending: responding } =
    useRespondToTicket();

  const [statusFilter, setStatusFilter] = useState<TicketStatus | "all">("all");
  const [respondDialog, setRespondDialog] = useState<{
    open: boolean;
    ticket: SupportTicket | null;
  }>({ open: false, ticket: null });
  const [responseText, setResponseText] = useState("");

  const filtered =
    statusFilter === "all"
      ? tickets
      : tickets.filter((t) => t.status === statusFilter);

  const handleRespond = () => {
    if (!respondDialog.ticket || !responseText.trim()) return;
    respondToTicket(
      { ticketId: respondDialog.ticket.ticketId, response: responseText },
      {
        onSuccess: () => {
          toast.success("Response sent!");
          setRespondDialog({ open: false, ticket: null });
          setResponseText("");
        },
        onError: () => toast.error("Failed to send response"),
      },
    );
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-4">
        <Select
          value={statusFilter}
          onValueChange={(v) => setStatusFilter(v as TicketStatus | "all")}
        >
          <SelectTrigger
            className="rounded-xl w-48"
            data-ocid="admin.status_filter_select"
          >
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent className="rounded-2xl">
            <SelectItem value="all">All Statuses</SelectItem>
            {Object.entries(STATUS_CONFIG).map(([v, { label }]) => (
              <SelectItem key={v} value={v}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-sm text-muted-foreground">
          {filtered.length} ticket{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {isLoading ? (
        <div
          className="flex items-center justify-center py-16 gap-3 text-muted-foreground"
          data-ocid="admin.tickets_loading_state"
        >
          <Loader2 size={20} className="animate-spin" />
          <span>Loading tickets...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div
          className="text-center py-16 text-muted-foreground"
          data-ocid="admin.tickets_empty_state"
        >
          No tickets found.
        </div>
      ) : (
        <div
          className="rounded-2xl border border-border overflow-hidden"
          data-ocid="admin.tickets_table"
        >
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="font-semibold">Ticket ID</TableHead>
                <TableHead className="font-semibold">Name</TableHead>
                <TableHead className="font-semibold">Issue Type</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Date</TableHead>
                <TableHead className="font-semibold text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((ticket, idx) => {
                const sc = STATUS_CONFIG[ticket.status];
                return (
                  <TableRow
                    key={ticket.ticketId}
                    data-ocid={`admin.ticket_row.${idx + 1}`}
                  >
                    <TableCell className="font-mono text-xs font-bold text-primary">
                      {ticket.ticketId}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-sm">{ticket.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {ticket.email}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs">
                        {ISSUE_LABELS[ticket.issueType]}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`${sc.bg} ${sc.color} border-0 text-xs px-3 py-1 rounded-full`}
                      >
                        {sc.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {formatDate(ticket.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Select
                          value={ticket.status}
                          onValueChange={(v) =>
                            updateStatus({
                              ticketId: ticket.ticketId,
                              status: v as TicketStatus,
                            })
                          }
                          disabled={updatingStatus}
                        >
                          <SelectTrigger className="rounded-lg h-8 w-28 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl">
                            {Object.entries(STATUS_CONFIG).map(
                              ([v, { label }]) => (
                                <SelectItem
                                  key={v}
                                  value={v}
                                  className="text-xs"
                                >
                                  {label}
                                </SelectItem>
                              ),
                            )}
                          </SelectContent>
                        </Select>
                        <Button
                          size="sm"
                          variant="outline"
                          className="rounded-lg h-8 px-3 text-xs"
                          onClick={() => {
                            setRespondDialog({ open: true, ticket });
                            setResponseText(ticket.adminResponse ?? "");
                          }}
                          data-ocid={`admin.respond_button.${idx + 1}`}
                        >
                          <MessageSquare size={12} className="mr-1" />
                          Respond
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Respond Dialog */}
      <Dialog
        open={respondDialog.open}
        onOpenChange={(open) =>
          setRespondDialog({ open, ticket: respondDialog.ticket })
        }
      >
        <DialogContent className="rounded-3xl" data-ocid="admin.respond_dialog">
          <DialogHeader>
            <DialogTitle className="font-display">
              Respond to Ticket
            </DialogTitle>
          </DialogHeader>
          {respondDialog.ticket && (
            <div className="space-y-4">
              <div className="bg-muted/40 rounded-2xl p-4 text-sm">
                <p className="font-semibold mb-1">
                  {respondDialog.ticket.name}
                </p>
                <p className="text-muted-foreground text-xs mb-2">
                  {respondDialog.ticket.email} · {respondDialog.ticket.ticketId}
                </p>
                <p className="text-sm leading-relaxed">
                  {respondDialog.ticket.message}
                </p>
              </div>
              <Textarea
                placeholder="Type your response to the user..."
                rows={4}
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
                className="rounded-xl resize-none"
                data-ocid="admin.response_textarea"
              />
            </div>
          )}
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              className="rounded-xl"
              onClick={() => setRespondDialog({ open: false, ticket: null })}
              data-ocid="admin.cancel_button"
            >
              Cancel
            </Button>
            <Button
              className="rounded-xl bg-primary text-primary-foreground"
              disabled={!responseText.trim() || responding}
              onClick={handleRespond}
              data-ocid="admin.save_response_button"
            >
              {responding ? (
                <Loader2 size={14} className="mr-1.5 animate-spin" />
              ) : null}
              Send Response
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function StaffPanel() {
  const { data: staff = [], isLoading } = useGetAllStaff();
  const { mutate: addStaff, isPending } = useAddStaffMember();

  const [form, setForm] = useState({ name: "", staffId: "", role: "Support" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const e2: Record<string, string> = {};
    if (!form.name.trim()) e2.name = "Required";
    if (!form.staffId.trim()) e2.staffId = "Required";
    if (!form.role.trim()) e2.role = "Required";
    setErrors(e2);
    if (Object.keys(e2).length > 0) return;
    addStaff(form, {
      onSuccess: () => {
        toast.success("Staff member added!");
        setForm({ name: "", staffId: "", role: "Support" });
      },
      onError: () => toast.error("Failed to add staff member"),
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Add staff form */}
      <Card className="rounded-2xl border-0 shadow-card">
        <CardHeader className="pb-4">
          <CardTitle className="font-display text-lg flex items-center gap-2">
            <UserPlus size={18} className="text-primary" />
            Add Staff Member
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="space-y-1.5">
              <Label>Name</Label>
              <Input
                placeholder="Staff name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={`rounded-xl h-11 ${errors.name ? "border-destructive" : ""}`}
                data-ocid="admin.staff_name_input"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Staff ID</Label>
              <Input
                placeholder="e.g. STF001"
                value={form.staffId}
                onChange={(e) => setForm({ ...form, staffId: e.target.value })}
                className={`rounded-xl h-11 ${errors.staffId ? "border-destructive" : ""}`}
                data-ocid="admin.staff_id_input"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Role</Label>
              <Select
                value={form.role}
                onValueChange={(v) => setForm({ ...form, role: v })}
              >
                <SelectTrigger
                  className="rounded-xl h-11"
                  data-ocid="admin.staff_role_input"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="Support">Support</SelectItem>
                  <SelectItem value="Listener">Listener</SelectItem>
                  <SelectItem value="Admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              type="submit"
              className="w-full rounded-xl bg-primary text-primary-foreground"
              disabled={isPending}
              data-ocid="admin.add_staff_button"
            >
              {isPending ? (
                <Loader2 size={14} className="mr-1.5 animate-spin" />
              ) : null}
              Add Staff Member
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Staff list */}
      <div className="space-y-3">
        <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
          Current Staff ({staff.length})
        </h3>
        {isLoading ? (
          <div className="flex items-center gap-2 text-muted-foreground py-4">
            <Loader2 size={16} className="animate-spin" />
            <span className="text-sm">Loading...</span>
          </div>
        ) : staff.length === 0 ? (
          <p
            className="text-sm text-muted-foreground py-4"
            data-ocid="admin.staff_empty_state"
          >
            No staff members yet.
          </p>
        ) : (
          staff.map((s, i) => (
            <Card
              key={s.staffId}
              className="rounded-2xl border-0 shadow-soft"
              data-ocid={`admin.staff_item.${i + 1}`}
            >
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                  {s.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm">{s.name}</p>
                  <p className="text-xs text-muted-foreground">{s.staffId}</p>
                </div>
                <Badge className="bg-secondary text-secondary-foreground border-0 rounded-full text-xs">
                  {s.role}
                </Badge>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

function SettingsPanel() {
  const [currentPin, setCurrentPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  const handleChangePin = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!currentPin) errs.currentPin = "Current PIN is required";
    else if (currentPin !== getStoredPin())
      errs.currentPin = "Current PIN is incorrect";
    if (!newPin) errs.newPin = "New PIN is required";
    else if (newPin.length < 4)
      errs.newPin = "PIN must be at least 4 characters";
    if (!confirmPin) errs.confirmPin = "Please confirm your new PIN";
    else if (newPin !== confirmPin) errs.confirmPin = "PINs do not match";
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    localStorage.setItem(PIN_STORAGE_KEY, newPin);
    setSuccess(true);
    setCurrentPin("");
    setNewPin("");
    setConfirmPin("");
    toast.success("Admin PIN changed successfully!");
    setTimeout(() => setSuccess(false), 4000);
  };

  return (
    <div className="max-w-md">
      <Card className="rounded-2xl border-0 shadow-card">
        <CardHeader className="pb-4">
          <CardTitle className="font-display text-lg flex items-center gap-2">
            <KeyRound size={18} className="text-primary" />
            Change Admin PIN
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Update your admin dashboard access PIN. Make sure to remember it.
          </p>
        </CardHeader>
        <CardContent>
          {success && (
            <div
              className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl p-4 mb-5"
              data-ocid="admin.pin_change_success_state"
            >
              <CheckCircle size={18} className="text-green-600 shrink-0" />
              <p className="text-sm text-green-800 font-medium">
                PIN updated successfully!
              </p>
            </div>
          )}
          <form onSubmit={handleChangePin} className="space-y-5">
            {/* Current PIN */}
            <div className="space-y-1.5">
              <Label>Current PIN</Label>
              <div className="relative">
                <Input
                  type={showCurrent ? "text" : "password"}
                  placeholder="Enter current PIN"
                  value={currentPin}
                  onChange={(e) => {
                    setCurrentPin(e.target.value);
                    setErrors({ ...errors, currentPin: "" });
                  }}
                  className={`rounded-xl h-12 pr-12 tracking-widest ${errors.currentPin ? "border-destructive" : ""}`}
                  data-ocid="admin.current_pin_input"
                  autoComplete="off"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.currentPin && (
                <p
                  className="text-xs text-destructive"
                  data-ocid="admin.current_pin_error"
                >
                  {errors.currentPin}
                </p>
              )}
            </div>

            {/* New PIN */}
            <div className="space-y-1.5">
              <Label>New PIN</Label>
              <div className="relative">
                <Input
                  type={showNew ? "text" : "password"}
                  placeholder="Enter new PIN (min 4 chars)"
                  value={newPin}
                  onChange={(e) => {
                    setNewPin(e.target.value);
                    setErrors({ ...errors, newPin: "" });
                  }}
                  className={`rounded-xl h-12 pr-12 tracking-widest ${errors.newPin ? "border-destructive" : ""}`}
                  data-ocid="admin.new_pin_input"
                  autoComplete="off"
                />
                <button
                  type="button"
                  onClick={() => setShowNew((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.newPin && (
                <p
                  className="text-xs text-destructive"
                  data-ocid="admin.new_pin_error"
                >
                  {errors.newPin}
                </p>
              )}
            </div>

            {/* Confirm PIN */}
            <div className="space-y-1.5">
              <Label>Confirm New PIN</Label>
              <div className="relative">
                <Input
                  type={showConfirm ? "text" : "password"}
                  placeholder="Confirm new PIN"
                  value={confirmPin}
                  onChange={(e) => {
                    setConfirmPin(e.target.value);
                    setErrors({ ...errors, confirmPin: "" });
                  }}
                  className={`rounded-xl h-12 pr-12 tracking-widest ${errors.confirmPin ? "border-destructive" : ""}`}
                  data-ocid="admin.confirm_pin_input"
                  autoComplete="off"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.confirmPin && (
                <p
                  className="text-xs text-destructive"
                  data-ocid="admin.confirm_pin_error"
                >
                  {errors.confirmPin}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-semibold"
              data-ocid="admin.change_pin_button"
            >
              Update PIN
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function AdminPage() {
  const [unlocked, setUnlocked] = useState(
    () => sessionStorage.getItem("admin_auth") === "1",
  );

  if (!unlocked) return <PinGate onUnlock={() => setUnlocked(true)} />;

  return (
    <main className="py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <div className="mb-10 flex items-center justify-between">
            <div>
              <h1 className="font-display text-3xl md:text-4xl font-bold mb-1">
                Admin Dashboard
              </h1>
              <p className="text-muted-foreground">
                Manage support tickets and staff members
              </p>
            </div>
            <Button
              variant="outline"
              className="rounded-xl"
              onClick={() => {
                sessionStorage.removeItem("admin_auth");
                setUnlocked(false);
              }}
              data-ocid="admin.lock_button"
            >
              <Lock size={14} className="mr-2" />
              Lock
            </Button>
          </div>

          <Tabs defaultValue="tickets">
            <TabsList className="rounded-2xl bg-muted/60 p-1 mb-8 h-auto">
              <TabsTrigger
                value="tickets"
                className="rounded-xl px-6 py-2.5 font-medium data-[state=active]:bg-background data-[state=active]:shadow-soft"
                data-ocid="admin.tickets_tab"
              >
                All Tickets
              </TabsTrigger>
              <TabsTrigger
                value="staff"
                className="rounded-xl px-6 py-2.5 font-medium data-[state=active]:bg-background data-[state=active]:shadow-soft"
                data-ocid="admin.staff_tab"
              >
                Staff
              </TabsTrigger>
              <TabsTrigger
                value="settings"
                className="rounded-xl px-6 py-2.5 font-medium data-[state=active]:bg-background data-[state=active]:shadow-soft"
                data-ocid="admin.settings_tab"
              >
                <Settings size={14} className="mr-2" />
                Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="tickets">
              <TicketsTable />
            </TabsContent>

            <TabsContent value="staff">
              <StaffPanel />
            </TabsContent>

            <TabsContent value="settings">
              <SettingsPanel />
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </main>
  );
}
