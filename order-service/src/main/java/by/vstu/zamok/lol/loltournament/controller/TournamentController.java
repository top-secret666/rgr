package by.vstu.zamok.lol.loltournament.controller;

import by.vstu.zamok.lol.loltournament.dto.TournamentDTO;
import by.vstu.zamok.lol.loltournament.entity.Tournament;
import by.vstu.zamok.lol.loltournament.entity.User;
import by.vstu.zamok.lol.loltournament.payload.response.MessageResponse;
import by.vstu.zamok.lol.loltournament.repository.TournamentRepository;
import by.vstu.zamok.lol.loltournament.repository.UserRepository;
import by.vstu.zamok.lol.loltournament.security.services.UserDetailsImpl;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/tournaments")
public class TournamentController {
    @Autowired
    TournamentRepository tournamentRepository;

    @Autowired
    UserRepository userRepository;

    @GetMapping
    @Transactional(readOnly = true)
    public ResponseEntity<Page<TournamentDTO>> getAllTournaments(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) Tournament.TournamentStatus status,
            @RequestParam(required = false) LocalDate startDate,
            Pageable pageable) {

        Specification<Tournament> spec = (root, query, cb) -> cb.conjunction();

        if (name != null && !name.isEmpty()) {
            spec = spec.and((root, query, cb) ->
                    cb.like(cb.lower(root.get("name")), "%" + name.toLowerCase() + "%"));
        }

        if (status != null) {
            spec = spec.and((root, query, cb) ->
                    cb.equal(root.get("status"), status));
        }

        if (startDate != null) {
            spec = spec.and((root, query, cb) ->
                    cb.greaterThanOrEqualTo(root.get("startDate"), startDate));
        }

        Page<Tournament> tournaments = tournamentRepository.findAll(spec, pageable);

        List<TournamentDTO> tournamentDTOs = tournaments.getContent().stream()
                .map(TournamentDTO::new)
                .collect(Collectors.toList());

        Page<TournamentDTO> result = new PageImpl<>(tournamentDTOs, pageable, tournaments.getTotalElements());
        return ResponseEntity.ok(result);
    }

    @GetMapping("/{id}")
    @Transactional(readOnly = true)
    public ResponseEntity<Tournament> getTournamentById(@PathVariable Long id) {
        Tournament tournament = tournamentRepository.findByIdWithTeams(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Tournament not found"));

        return ResponseEntity.ok(tournament);
    }


    @PostMapping
    @PreAuthorize("hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<?> createTournament(@Valid @RequestBody Tournament tournament) {
        try {
            // Валидация дат
            tournament.validateDates();

            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

            User creator = userRepository.findById(userDetails.getId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

            tournament.setCreator(creator);
            Tournament savedTournament = tournamentRepository.save(tournament);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedTournament);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<?> updateTournament(@PathVariable Long id, @Valid @RequestBody Tournament tournamentDetails) {
        try {
            Tournament tournament = tournamentRepository.findById(id)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Tournament not found"));

            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

            if (!authentication.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN")) &&
                    !tournament.getCreator().getId().equals(userDetails.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }

            tournamentDetails.validateDates();

            tournament.setName(tournamentDetails.getName());
            tournament.setStartDate(tournamentDetails.getStartDate());
            tournament.setEndDate(tournamentDetails.getEndDate());
            tournament.setDescription(tournamentDetails.getDescription());
            tournament.setStatus(tournamentDetails.getStatus());

            Tournament updatedTournament = tournamentRepository.save(tournament);
            return ResponseEntity.ok(updatedTournament);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MessageResponse> deleteTournament(@PathVariable Long id) {
        if (!tournamentRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Tournament not found");
        }

        tournamentRepository.deleteById(id);
        return ResponseEntity.ok(new MessageResponse("Tournament deleted successfully"));
    }

    @GetMapping("/upcoming")
    @Transactional(readOnly = true)
    public ResponseEntity<List<TournamentDTO>> getUpcomingTournaments() {
        List<Tournament> tournaments = tournamentRepository.findByStartDateAfter(LocalDate.now());
        List<TournamentDTO> tournamentDTOs = tournaments.stream()
                .map(TournamentDTO::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(tournamentDTOs);
    }

    @GetMapping("/status/{status}")
    @Transactional(readOnly = true)
    public ResponseEntity<List<TournamentDTO>> getTournamentsByStatus(@PathVariable Tournament.TournamentStatus status) {
        List<Tournament> tournaments = tournamentRepository.findByStatus(status);
        List<TournamentDTO> tournamentDTOs = tournaments.stream()
                .map(TournamentDTO::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(tournamentDTOs);
    }

    @GetMapping("/creator/{creatorId}")
    @Transactional(readOnly = true)
    public ResponseEntity<List<TournamentDTO>> getTournamentsByCreator(@PathVariable Long creatorId) {
        List<Tournament> tournaments = tournamentRepository.findByCreatorId(creatorId);
        List<TournamentDTO> tournamentDTOs = tournaments.stream()
                .map(TournamentDTO::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(tournamentDTOs);
    }
}
