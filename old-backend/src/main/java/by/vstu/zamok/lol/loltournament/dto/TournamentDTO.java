package by.vstu.zamok.lol.loltournament.dto;

import by.vstu.zamok.lol.loltournament.entity.Tournament;
import java.time.LocalDate;

public class TournamentDTO {
    private Long id;
    private String name;
    private LocalDate startDate;
    private LocalDate endDate;
    private String description;
    private Tournament.TournamentStatus status;
    private CreatorDTO creator;
    private int teamsCount;

    public TournamentDTO() {}

    public TournamentDTO(Tournament tournament) {
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

        this.teamsCount = tournament.getTeams() != null ? tournament.getTeams().size() : 0;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }

    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Tournament.TournamentStatus getStatus() { return status; }
    public void setStatus(Tournament.TournamentStatus status) { this.status = status; }

    public CreatorDTO getCreator() { return creator; }
    public void setCreator(CreatorDTO creator) { this.creator = creator; }

    public int getTeamsCount() { return teamsCount; }
    public void setTeamsCount(int teamsCount) { this.teamsCount = teamsCount; }

    public static class CreatorDTO {
        private Long id;
        private String username;

        public CreatorDTO() {}

        public CreatorDTO(Long id, String username) {
            this.id = id;
            this.username = username;
        }

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }

        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
    }
}
