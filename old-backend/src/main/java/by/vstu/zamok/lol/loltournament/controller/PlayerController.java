package by.vstu.zamok.lol.loltournament.controller;

import by.vstu.zamok.lol.loltournament.entity.Player;
import by.vstu.zamok.lol.loltournament.entity.Team;
import by.vstu.zamok.lol.loltournament.payload.response.MessageResponse;
import by.vstu.zamok.lol.loltournament.repository.PlayerRepository;
import by.vstu.zamok.lol.loltournament.repository.TeamRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/players")
public class PlayerController {
    @Autowired
    PlayerRepository playerRepository;

    @Autowired
    TeamRepository teamRepository;

    @GetMapping
    public ResponseEntity<Page<Player>> getAllPlayers(
            @RequestParam(required = false) String nickname,
            @RequestParam(required = false) Player.PlayerRole role,
            @RequestParam(required = false) String rank,
            Pageable pageable) {

        Specification<Player> spec = (root, query, cb) -> cb.conjunction();

        if (nickname != null && !nickname.isEmpty()) {
            spec = spec.and((root, query, cb) ->
                    cb.like(cb.lower(root.get("nickname")), "%" + nickname.toLowerCase() + "%"));
        }

        if (role != null) {
            spec = spec.and((root, query, cb) ->
                    cb.equal(root.get("role"), role));
        }

        if (rank != null && !rank.isEmpty()) {
            spec = spec.and((root, query, cb) ->
                    cb.like(cb.lower(root.get("playerRank")), "%" + rank.toLowerCase() + "%"));
        }

        Page<Player> players = playerRepository.findAll(spec, pageable);
        return ResponseEntity.ok(players);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Player> getPlayerById(@PathVariable Long id) {
        Player player = playerRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Player not found"));
        return ResponseEntity.ok(player);
    }

    @PostMapping
    @PreAuthorize("hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<Player> createPlayer(@Valid @RequestBody Player player) {
        if (playerRepository.findByNickname(player.getNickname()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Player nickname already exists");
        }

        if (player.getTeam() != null && player.getTeam().getId() != null) {
            Team team = teamRepository.findById(player.getTeam().getId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Team not found"));
            player.setTeam(team);
        }

        Player savedPlayer = playerRepository.save(player);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedPlayer);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<Player> updatePlayer(@PathVariable Long id, @Valid @RequestBody Player playerDetails) {
        Player player = playerRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Player not found"));

        // Check if nickname is already taken by another player
        if (!player.getNickname().equals(playerDetails.getNickname()) &&
                playerRepository.findByNickname(playerDetails.getNickname()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Player nickname already exists");
        }

        // If team is provided, check if it exists
        if (playerDetails.getTeam() != null && playerDetails.getTeam().getId() != null) {
            Team team = teamRepository.findById(playerDetails.getTeam().getId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Team not found"));
            player.setTeam(team);
        } else {
            player.setTeam(null);
        }

        player.setNickname(playerDetails.getNickname());
        player.setRealName(playerDetails.getRealName());
        player.setRole(playerDetails.getRole());
        player.setPlayerRank(playerDetails.getPlayerRank()); // Changed from setRank() to setPlayerRank()

        Player updatedPlayer = playerRepository.save(player);
        return ResponseEntity.ok(updatedPlayer);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MessageResponse> deletePlayer(@PathVariable Long id) {
        if (!playerRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Player not found");
        }

        playerRepository.deleteById(id);
        return ResponseEntity.ok(new MessageResponse("Player deleted successfully"));
    }

    @GetMapping("/team/{teamId}")
    public ResponseEntity<List<Player>> getPlayersByTeam(@PathVariable Long teamId) {
        if (!teamRepository.existsById(teamId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Team not found");
        }

        List<Player> players = playerRepository.findByTeamId(teamId);
        return ResponseEntity.ok(players);
    }

    @GetMapping("/role/{role}")
    public ResponseEntity<List<Player>> getPlayersByRole(@PathVariable Player.PlayerRole role) {
        List<Player> players = playerRepository.findByRole(role);
        return ResponseEntity.ok(players);
    }
}
