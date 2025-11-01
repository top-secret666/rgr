package by.vstu.zamok.lol.loltournament.controller;

import by.vstu.zamok.lol.loltournament.dto.TeamDTO;
import by.vstu.zamok.lol.loltournament.entity.Team;
import by.vstu.zamok.lol.loltournament.entity.Tournament;
import by.vstu.zamok.lol.loltournament.payload.response.MessageResponse;
import by.vstu.zamok.lol.loltournament.repository.TeamRepository;
import by.vstu.zamok.lol.loltournament.repository.TournamentRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/teams")
public class TeamController {
    @Autowired
    TeamRepository teamRepository;

    @Autowired
    TournamentRepository tournamentRepository;

    @GetMapping
    @Transactional(readOnly = true)
    public ResponseEntity<Page<TeamDTO>> getAllTeams(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String tag,
            Pageable pageable) {

        try {
            Specification<Team> spec = (root, query, cb) -> cb.conjunction();

            if (name != null && !name.isEmpty()) {
                spec = spec.and((root, query, cb) ->
                        cb.like(cb.lower(root.get("name")), "%" + name.toLowerCase() + "%"));
            }

            if (tag != null && !tag.isEmpty()) {
                spec = spec.and((root, query, cb) ->
                        cb.like(cb.lower(root.get("tag")), "%" + tag.toLowerCase() + "%"));
            }

            Page<Team> teams = teamRepository.findAll(spec, pageable);

            List<TeamDTO> teamDTOs = teams.getContent().stream()
                    .map(team -> {
                        try {
                            return new TeamDTO(team);
                        } catch (Exception e) {
                            // Log the error and create a basic DTO
                            System.err.println("Error creating TeamDTO for team " + team.getId() + ": " + e.getMessage());
                            TeamDTO dto = new TeamDTO();
                            dto.setId(team.getId());
                            dto.setName(team.getName());
                            dto.setTag(team.getTag());
                            dto.setLogo(team.getLogo());
                            dto.setPlayersCount(0);
                            dto.setTournamentsCount(0);
                            return dto;
                        }
                    })
                    .collect(Collectors.toList());

            Page<TeamDTO> result = new PageImpl<>(teamDTOs, pageable, teams.getTotalElements());
            return ResponseEntity.ok(result);

        } catch (Exception e) {
            System.err.println("Error in getAllTeams: " + e.getMessage());
            e.printStackTrace();
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error fetching teams");
        }
    }

    @GetMapping("/{id}")
    @Transactional(readOnly = true)
    public ResponseEntity<TeamDTO> getTeamById(@PathVariable Long id) {
        try {
            Team team = teamRepository.findById(id)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Team not found"));

            TeamDTO teamDTO = new TeamDTO(team);
            return ResponseEntity.ok(teamDTO);
        } catch (ResponseStatusException e) {
            throw e;
        } catch (Exception e) {
            System.err.println("Error in getTeamById: " + e.getMessage());
            e.printStackTrace();
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error fetching team");
        }
    }

    @PostMapping
    @PreAuthorize("hasRole('USER') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<Team> createTeam(@Valid @RequestBody Team team) {
        if (teamRepository.findByName(team.getName()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Team name already exists");
        }

        if (teamRepository.findByTag(team.getTag()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Team tag already exists");
        }

        Team savedTeam = teamRepository.save(team);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedTeam);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<Team> updateTeam(@PathVariable Long id, @Valid @RequestBody Team teamDetails) {
        Team team = teamRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Team not found"));

        if (!team.getName().equals(teamDetails.getName()) &&
                teamRepository.findByName(teamDetails.getName()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Team name already exists");
        }

        if (!team.getTag().equals(teamDetails.getTag()) &&
                teamRepository.findByTag(teamDetails.getTag()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Team tag already exists");
        }

        team.setName(teamDetails.getName());
        team.setTag(teamDetails.getTag());
        team.setLogo(teamDetails.getLogo());

        Team updatedTeam = teamRepository.save(team);
        return ResponseEntity.ok(updatedTeam);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MessageResponse> deleteTeam(@PathVariable Long id) {
        if (!teamRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Team not found");
        }

        teamRepository.deleteById(id);
        return ResponseEntity.ok(new MessageResponse("Team deleted successfully"));
    }

    @GetMapping("/tournament/{tournamentId}")
    @Transactional(readOnly = true)
    public ResponseEntity<List<TeamDTO>> getTeamsByTournament(@PathVariable Long tournamentId) {
        if (!tournamentRepository.existsById(tournamentId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Tournament not found");
        }

        List<Team> teams = teamRepository.findByTournamentsId(tournamentId);
        List<TeamDTO> teamDTOs = teams.stream()
                .map(TeamDTO::new)
                .collect(Collectors.toList());

        return ResponseEntity.ok(teamDTOs);
    }

    @PostMapping("/{teamId}/tournaments/{tournamentId}")
    @PreAuthorize("hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<MessageResponse> addTeamToTournament(
            @PathVariable Long teamId,
            @PathVariable Long tournamentId) {

        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Team not found"));

        Tournament tournament = tournamentRepository.findById(tournamentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Tournament not found"));

        if (tournament.getTeams().contains(team)) {
            return ResponseEntity.badRequest().body(new MessageResponse("Team is already in this tournament"));
        }

        tournament.getTeams().add(team);
        tournamentRepository.save(tournament);

        return ResponseEntity.ok(new MessageResponse("Team added to tournament successfully"));
    }

    @DeleteMapping("/{teamId}/tournaments/{tournamentId}")
    @PreAuthorize("hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<MessageResponse> removeTeamFromTournament(
            @PathVariable Long teamId,
            @PathVariable Long tournamentId) {

        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Team not found"));

        Tournament tournament = tournamentRepository.findById(tournamentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Tournament not found"));

        if (!tournament.getTeams().contains(team)) {
            return ResponseEntity.badRequest().body(new MessageResponse("Team is not in this tournament"));
        }

        tournament.getTeams().remove(team);
        tournamentRepository.save(tournament);

        return ResponseEntity.ok(new MessageResponse("Team removed from tournament successfully"));
    }
}
