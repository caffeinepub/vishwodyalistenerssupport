import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ExternalBlob, IssueType, TicketStatus } from "../backend";
import { useActor } from "./useActor";

export { IssueType, TicketStatus };

export function useGetAllTickets() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["tickets"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllTickets();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetTicketsByStatus(status: TicketStatus | "all") {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["tickets", "status", status],
    queryFn: async () => {
      if (!actor) return [];
      if (status === "all") return actor.getAllTickets();
      return actor.getTicketsByStatus(status);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetTicketStatus(ticketId: string) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["ticket-status", ticketId],
    queryFn: async () => {
      if (!actor || !ticketId) return null;
      return actor.getTicketStatus(ticketId);
    },
    enabled: !!actor && !isFetching && ticketId.length > 0,
    retry: false,
  });
}

export function useGetAllStaff() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["staff"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllStaffMembers();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSubmitTicket() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (data: {
      name: string;
      email: string;
      phone: string;
      sessionId: string | null;
      issueType: IssueType;
      message: string;
      file: File | null;
    }) => {
      if (!actor) throw new Error("Not connected");
      let attachmentBlob: ExternalBlob | null = null;
      if (data.file) {
        const bytes = new Uint8Array(await data.file.arrayBuffer());
        attachmentBlob = ExternalBlob.fromBytes(bytes);
      }
      return actor.submitTicket(
        data.name,
        data.email,
        data.phone,
        data.sessionId,
        data.issueType,
        data.message,
        attachmentBlob,
      );
    },
  });
}

export function useUpdateTicketStatus() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      ticketId,
      status,
    }: { ticketId: string; status: TicketStatus }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateTicketStatus(ticketId, status);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tickets"] }),
  });
}

export function useRespondToTicket() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      ticketId,
      response,
    }: { ticketId: string; response: string }) => {
      if (!actor) throw new Error("Not connected");
      return actor.respondToTicket(ticketId, response);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tickets"] }),
  });
}

export function useAssignStaff() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      ticketId,
      staffId,
    }: { ticketId: string; staffId: string }) => {
      if (!actor) throw new Error("Not connected");
      return actor.assignStaffToTicket(ticketId, staffId);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tickets"] }),
  });
}

export function useAddStaffMember() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      name,
      staffId,
      role,
    }: { name: string; staffId: string; role: string }) => {
      if (!actor) throw new Error("Not connected");
      return actor.addStaffMember(name, staffId, role);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["staff"] }),
  });
}
