import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, MessageSquare, Search } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { TicketStatus, useGetTicketStatus } from "../hooks/useQueries";

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

export default function TrackPage() {
  const [input, setInput] = useState("");
  const [ticketId, setTicketId] = useState("");

  const { data, isLoading, isError, isFetching } = useGetTicketStatus(ticketId);

  const handleCheck = () => {
    if (!input.trim()) return;
    setTicketId(input.trim().toUpperCase());
  };

  const statusConfig = data ? STATUS_CONFIG[data[0]] : null;

  return (
    <main className="py-16 px-6">
      <div className="max-w-xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <div className="mb-10 text-center">
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-3">
              Track Your Ticket
            </h1>
            <p className="text-muted-foreground text-lg">
              Enter your Ticket ID to check the status of your support request.
            </p>
          </div>

          <Card className="rounded-3xl border-0 shadow-card mb-8">
            <CardContent className="p-8">
              <div className="space-y-4">
                <Label htmlFor="ticket-id" className="font-medium text-base">
                  Ticket ID
                </Label>
                <Input
                  id="ticket-id"
                  placeholder="e.g. VLS031101"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleCheck()}
                  className="rounded-xl h-13 text-center text-lg font-display tracking-widest uppercase"
                  data-ocid="track.ticket_id_input"
                />
                <Button
                  onClick={handleCheck}
                  disabled={!input.trim() || isFetching}
                  className="w-full h-12 rounded-2xl bg-primary text-primary-foreground font-semibold"
                  data-ocid="track.check_button"
                >
                  {isFetching ? (
                    <>
                      <Loader2 size={16} className="mr-2 animate-spin" />{" "}
                      Checking...
                    </>
                  ) : (
                    <>
                      <Search size={16} className="mr-2" /> Check Status
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {isLoading || isFetching ? (
            <Card
              className="rounded-3xl border-0 shadow-soft"
              data-ocid="track.loading_state"
            >
              <CardContent className="p-8 flex items-center justify-center gap-3 text-muted-foreground">
                <Loader2 size={20} className="animate-spin" />
                <span>Looking up your ticket...</span>
              </CardContent>
            </Card>
          ) : isError || (ticketId && !data) ? (
            <Card
              className="rounded-3xl border-0 shadow-soft border-destructive/20"
              data-ocid="track.error_state"
            >
              <CardContent className="p-8 text-center">
                <p className="text-destructive font-medium mb-1">
                  Ticket not found
                </p>
                <p className="text-sm text-muted-foreground">
                  Please check your Ticket ID and try again.
                </p>
              </CardContent>
            </Card>
          ) : data ? (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              data-ocid="track.result_card"
            >
              <Card className="rounded-3xl border-0 shadow-card">
                <CardContent className="p-8 space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">
                        Ticket ID
                      </p>
                      <p className="font-display font-bold text-xl text-primary">
                        {ticketId}
                      </p>
                    </div>
                    {statusConfig && (
                      <Badge
                        className={`${statusConfig.bg} ${statusConfig.color} border-0 px-4 py-1.5 rounded-full font-semibold text-sm`}
                      >
                        {statusConfig.label}
                      </Badge>
                    )}
                  </div>

                  {data[1] && (
                    <div className="bg-muted/50 rounded-2xl p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <MessageSquare size={16} className="text-primary" />
                        <span className="font-semibold text-sm">
                          Admin Response
                        </span>
                      </div>
                      <p className="text-sm text-foreground leading-relaxed">
                        {data[1]}
                      </p>
                    </div>
                  )}

                  {!data[1] && data[0] !== TicketStatus.resolved && (
                    <p className="text-sm text-muted-foreground text-center py-2">
                      Our team is reviewing your ticket. We'll respond within 24
                      hours.
                    </p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ) : null}
        </motion.div>
      </div>
    </main>
  );
}
