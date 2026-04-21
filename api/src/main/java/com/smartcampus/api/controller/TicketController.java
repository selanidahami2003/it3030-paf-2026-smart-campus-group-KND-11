package com.smartcampus.api.controller;

import com.smartcampus.api.dto.TicketSummaryDTO;
import com.smartcampus.api.model.Comment;
import com.smartcampus.api.model.Ticket;
import com.smartcampus.api.security.UserPrincipal;
import com.smartcampus.api.service.TicketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tickets")
public class TicketController {

    @Autowired
    private TicketService ticketService;

    @GetMapping
    public List<TicketSummaryDTO> getAllTickets() {
        return ticketService.getAllTickets();
    }

    private String resolveUserId(UserPrincipal currentUser, String headerUserId) {
        if (currentUser != null) {
            return currentUser.getId();
        }
        return headerUserId != null ? headerUserId : "2";
    }

    @GetMapping("/my")
    public List<TicketSummaryDTO> getMyTickets(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @RequestHeader(value = "X-User-Id", required = false) String headerUserId) {
        return ticketService.getTicketsByCreator(resolveUserId(currentUser, headerUserId));
    }

    @PostMapping
    public Ticket createTicket(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @RequestHeader(value = "X-User-Id", required = false) String headerUserId,
            @RequestBody Ticket request) {
        return ticketService.createTicket(resolveUserId(currentUser, headerUserId), request);
    }

    @PutMapping("/{id}/status")
    public Ticket updateTicketStatus(@PathVariable("id") String id, @RequestBody Map<String, Object> request) {
        Ticket.Status status = Ticket.Status.valueOf(request.get("status").toString());
        String assigneeId = request.get("assigneeId") != null ? request.get("assigneeId").toString() : null;
        return ticketService.updateTicketStatus(id, status, assigneeId);
    }

    @DeleteMapping("/{id}")
    public void deleteTicket(@PathVariable("id") String id) {
        ticketService.deleteTicket(id);
    }

    @GetMapping("/{id}/comments")
    public List<Comment> getTicketComments(@PathVariable("id") String id) {
        return ticketService.getComments(id);
    }

    @PostMapping("/{id}/comments")
    public Comment addComment(
            @PathVariable("id") String id,
            @AuthenticationPrincipal UserPrincipal currentUser,
            @RequestHeader(value = "X-User-Id", required = false) String headerUserId,
            @RequestBody Map<String, String> request) {
        return ticketService.addComment(id, resolveUserId(currentUser, headerUserId), request.get("content"));
    }
}
