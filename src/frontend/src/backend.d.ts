import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface SupportTicket {
    attachmentUrl?: ExternalBlob;
    status: TicketStatus;
    issueType: IssueType;
    name: string;
    createdAt: bigint;
    ticketId: string;
    email: string;
    message: string;
    assignedStaff?: string;
    sessionId?: string;
    phone: string;
    adminResponse?: string;
}
export interface StaffMember {
    staffId: string;
    name: string;
    role: string;
}
export enum IssueType {
    technicalBug = "technicalBug",
    generalFeedback = "generalFeedback",
    paymentIssue = "paymentIssue",
    sessionConnectionIssue = "sessionConnectionIssue",
    accountLoginProblem = "accountLoginProblem"
}
export enum TicketStatus {
    resolved = "resolved",
    closed = "closed",
    open = "open",
    inReview = "inReview"
}
export interface backendInterface {
    addStaffMember(name: string, staffId: string, role: string): Promise<void>;
    assignStaffToTicket(ticketId: string, staffId: string): Promise<void>;
    getAllStaffMembers(): Promise<Array<StaffMember>>;
    getAllTickets(): Promise<Array<SupportTicket>>;
    getTicketStatus(ticketId: string): Promise<[TicketStatus, string | null]>;
    getTicketsByStatus(status: TicketStatus): Promise<Array<SupportTicket>>;
    respondToTicket(ticketId: string, response: string): Promise<void>;
    submitTicket(name: string, email: string, phone: string, sessionId: string | null, issueType: IssueType, message: string, attachmentUrl: ExternalBlob | null): Promise<string>;
    updateTicketStatus(ticketId: string, newStatus: TicketStatus): Promise<void>;
}
