package com.smartcampus.api.repository;

import com.smartcampus.api.model.Ticket;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface TicketRepository extends MongoRepository<Ticket, String> {
    List<Ticket> findByCreatorIdOrAssigneeId(String creatorId, String assigneeId);
    List<Ticket> findAllByOrderByCreatedAtDesc();
    List<Ticket> findByCreatorIdOrAssigneeIdOrderByCreatedAtDesc(String creatorId, String assigneeId);
}
