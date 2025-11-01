package by.vstu.zamok.lol.loltournament.dto;

import by.vstu.zamok.lol.loltournament.entity.Tournament;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
public class TournamentWithTeamsDTO {
    private Long id;
    private String name;
    private LocalDate startDate;
    private LocalDate endDate;
    private String description;
    private Tournament.TournamentStatus status;
    private CreatorDTO creator;
    private List<TeamDTO> teams;

    public TournamentWithTeamsDTO(Tournament tournament) {
        this.id = tournament.getId();
        this.name = tournament.getName();
        this.startDate = tournament.getStartDate();
        this.endDate = tournament.getEndDate();
        this.description = tournament.getDescription();
        this.status = tournament.getStatus();

        if (tournament.getCreator() != null) {
            this.creator = new CreatorDTO(
                    tournament.getCreator().getId(),
                    tournament.getCreator().getUsername()
            );
        }

        this.teams = tournament.getTeams().stream()
                .map(TeamDTO::new)
                .collect(Collectors.toList());
    }

    @Getter
    @Setter
    public static class CreatorDTO {
        private Long id;
        private String username;

        public CreatorDTO(Long id, String username) {
            this.id = id;
            this.username = username;
        }
    }
}
