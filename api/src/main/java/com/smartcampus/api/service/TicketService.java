package com.smartcampus.api.service;

import com.smartcampus.api.dto.TicketSummaryDTO;
import com.smartcampus.api.model.Comment;
import com.smartcampus.api.model.Ticket;
import com.smartcampus.api.model.User;
import com.smartcampus.api.repository.CommentRepository;
import com.smartcampus.api.repository.TicketRepository;
import com.smartcampus.api.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TicketService {
    @Autowired private TicketRepository ticketRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private CommentRepository commentRepository;
    @Autowired private NotificationService notificationService;

    public List<TicketSummaryDTO> getAllTickets() {
        return ticketRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(TicketSummaryDTO::new)
                .collect(Collectors.toList());
    }

    public List<TicketSummaryDTO> getTicketsByCreator(String creatorId) {
        return ticketRepository.findByCreatorIdOrAssigneeIdOrderByCreatedAtDesc(creatorId, creatorId)
                .stream()
                .map(TicketSummaryDTO::new)
                .collect(Collectors.toList());
    }

    public Ticket createTicket(String creatorId, Ticket request) {
        User creator = userRepository.findById(creatorId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Ticket ticket = new Ticket();
        ticket.setCreator(creator);

        ticket.setCategory(request.getCategory());
        ticket.setDescription(request.getDescription());
        ticket.setContactDetails(request.getContactDetails());
        ticket.setPriority(request.getPriority());
        ticket.setStatus(Ticket.Status.OPEN);
        ticket.setAttachment1(request.getAttachment1());
        ticket.setAttachment2(request.getAttachment2());
        ticket.setAttachment3(request.getAttachment3());
        ticket.setReporterName(request.getReporterName());
        ticket.setCreatedAt(LocalDateTime.now());
        ticket.setUpdatedAt(LocalDateTime.now());

        return ticketRepository.save(ticket);
    }

    public void deleteTicket(String ticketId) {
        commentRepository.deleteAll(commentRepository.findByTicketIdOrderByCreatedAtAsc(ticketId));
        ticketRepository.deleteById(ticketId);
    }

    public Ticket updateTicketStatus(String ticketId, Ticket.Status status, String assigneeId) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));
        ticket.setStatus(status);
        ticket.setUpdatedAt(LocalDateTime.now());
        if (assigneeId != null) {
            User assignee = userRepository.findById(assigneeId)
                    .orElseThrow(() -> new RuntimeException("Assignee not found"));
            ticket.setAssignee(assignee);
        }
        Ticket saved = ticketRepository.save(ticket);

        // Trigger Notification for Status Change
        notificationService.createNotification(
            ticket.getCreator().getId(),
            "Your ticket status has been updated to " + status,
            "TICKET_STATUS",
            ticket.getId()
        );

        return saved;
    }

    public Comment addComment(String ticketId, String userId, String content) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));
        User author = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Comment comment = new Comment();
        comment.setTicket(ticket);
        comment.setAuthor(author);
        comment.setContent(content);
        comment.setCreatedAt(LocalDateTime.now());
        Comment saved = commentRepository.save(comment);

        // Notify creator if the commenter is not the creator
        if (!ticket.getCreator().getId().equals(userId)) {
            notificationService.createNotification(
                ticket.getCreator().getId(),
                "New comment on your ticket from " + author.getName(),
                "NEW_COMMENT",
                ticket.getId()
            );
        }
        
        // Notify assignee if there is one and they are not the commenter
        if (ticket.getAssignee() != null && !ticket.getAssignee().getId().equals(userId)) {
             notificationService.createNotification(
                ticket.getAssignee().getId(),
                "New comment on assigned ticket from " + author.getName(),
                "NEW_COMMENT",
                ticket.getId()
            );
        }

        return saved;
    }

    public List<Comment> getComments(String ticketId) {
        return commentRepository.findByTicketIdOrderByCreatedAtAsc(ticketId);
    }

    public Ticket getTicketById(String id) {
        return ticketRepository.findById(id).orElseThrow(() -> new RuntimeException("Ticket not found"));
    }
}
