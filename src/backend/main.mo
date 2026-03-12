import Iter "mo:core/Iter";
import Map "mo:core/Map";
import Order "mo:core/Order";
import Set "mo:core/Set";
import Time "mo:core/Time";
import Nat "mo:core/Nat";
import List "mo:core/List";
import Array "mo:core/Array";
import Text "mo:core/Text";
import Int "mo:core/Int";
import Runtime "mo:core/Runtime";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";

actor {
  include MixinStorage();

  type SupportTicket = {
    ticketId : Text;
    name : Text;
    email : Text;
    phone : Text;
    sessionId : ?Text;
    issueType : IssueType;
    message : Text;
    attachmentUrl : ?Storage.ExternalBlob;
    status : TicketStatus;
    adminResponse : ?Text;
    createdAt : Int;
    assignedStaff : ?Text;
  };

  module SupportTicket {
    public func compare(ticket1 : SupportTicket, ticket2 : SupportTicket) : Order.Order {
      Text.compare(ticket1.ticketId, ticket2.ticketId);
    };
  };

  type IssueType = {
    #paymentIssue;
    #sessionConnectionIssue;
    #technicalBug;
    #accountLoginProblem;
    #generalFeedback;
  };

  type TicketStatus = {
    #open;
    #inReview;
    #resolved;
    #closed;
  };

  type StaffMember = {
    name : Text;
    staffId : Text;
    role : Text;
  };

  module StaffMember {
    public func compare(member1 : StaffMember, member2 : StaffMember) : Order.Order {
      Text.compare(member1.staffId, member2.staffId);
    };
  };

  let ticketEntries = Map.empty<Text, SupportTicket>();
  let staffEntries = Map.empty<Text, StaffMember>();
  let dailySerials = Map.empty<Text, Nat>();

  public shared ({ caller }) func submitTicket(
    name : Text,
    email : Text,
    phone : Text,
    sessionId : ?Text,
    issueType : IssueType,
    message : Text,
    attachmentUrl : ?Storage.ExternalBlob,
  ) : async Text {
    let ticketId = await generateTicketId();

    let ticket : SupportTicket = {
      ticketId;
      name;
      email;
      phone;
      sessionId;
      issueType;
      message;
      attachmentUrl;
      status = #open;
      adminResponse = null;
      createdAt = Time.now();
      assignedStaff = null;
    };

    ticketEntries.add(ticketId, ticket);
    ticketId;
  };

  public query ({ caller }) func getTicketStatus(ticketId : Text) : async (TicketStatus, ?Text) {
    switch (ticketEntries.get(ticketId)) {
      case (null) { Runtime.trap("No ticket found with id " # ticketId) };
      case (?ticket) { (ticket.status, ticket.adminResponse) };
    };
  };

  public shared ({ caller }) func addStaffMember(name : Text, staffId : Text, role : Text) : async () {
    if (staffEntries.containsKey(staffId)) {
      Runtime.trap("Staff member with id " # staffId # " already exists!");
    };

    let staff : StaffMember = {
      name;
      staffId;
      role;
    };

    staffEntries.add(staffId, staff);
  };

  public query ({ caller }) func getAllStaffMembers() : async [StaffMember] {
    staffEntries.values().toArray().sort();
  };

  public shared ({ caller }) func updateTicketStatus(ticketId : Text, newStatus : TicketStatus) : async () {
    switch (ticketEntries.get(ticketId)) {
      case (null) { Runtime.trap("No ticket found with id " # ticketId) };
      case (?ticket) {
        let updatedTicket : SupportTicket = {
          ticket with
          status = newStatus;
        };
        ticketEntries.add(ticketId, updatedTicket);
      };
    };
  };

  public shared ({ caller }) func assignStaffToTicket(ticketId : Text, staffId : Text) : async () {
    if (not staffEntries.containsKey(staffId)) {
      Runtime.trap("Staff with id " # staffId # " does not exist!");
    };

    switch (ticketEntries.get(ticketId)) {
      case (null) { Runtime.trap("No ticket found with id " # ticketId) };
      case (?ticket) {
        let updatedTicket : SupportTicket = {
          ticket with
          assignedStaff = ?staffId;
        };
        ticketEntries.add(ticketId, updatedTicket);
      };
    };
  };

  public shared ({ caller }) func respondToTicket(ticketId : Text, response : Text) : async () {
    switch (ticketEntries.get(ticketId)) {
      case (null) { Runtime.trap("No ticket found with id " # ticketId) };
      case (?ticket) {
        let updatedTicket : SupportTicket = {
          ticket with
          adminResponse = ?response;
        };
        ticketEntries.add(ticketId, updatedTicket);
      };
    };
  };

  public query ({ caller }) func getAllTickets() : async [SupportTicket] {
    ticketEntries.values().toArray().sort();
  };

  public query ({ caller }) func getTicketsByStatus(status : TicketStatus) : async [SupportTicket] {
    let filtered = ticketEntries.values().filter(
      func(ticket) {
        ticket.status == status;
      }
    );
    filtered.toArray().sort();
  };

  func getCurrentTimestamp() : Int {
    Time.now();
  };

  func generateTicketId() : async Text {
    let now = Time.now();
    let currentTimestamp = now / 1_000_000; // Convert to seconds
    let currentDay = currentTimestamp / 86400; // Divide by number of seconds in a day

    let dailyKey = currentDay.toText();

    let serial = switch (dailySerials.get(dailyKey)) {
      case (?value) {
        dailySerials.add(dailyKey, value + 1);
        value + 1;
      };
      case (null) {
        dailySerials.add(dailyKey, 1);
        1;
      };
    };

    "VLSW" # serial.toText() # dailyKey;
  };
};
