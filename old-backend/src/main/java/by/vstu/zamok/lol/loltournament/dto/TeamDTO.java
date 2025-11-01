package by.vstu.zamok.lol.loltournament.dto;

import by.vstu.zamok.lol.loltournament.entity.Team;
import java.util.List;
import java.util.stream.Collectors;

public class TeamDTO {
    private Long id;
    private String name;
    private String tag;
    private String logo;
    private List<PlayerDTO> players;
    private int playersCount;
    private int tournamentsCount;

    public TeamDTO() {}

    public TeamDTO(Team team) {
        this.id = team.getId();
        this.name = team.getName();
        this.tag = team.getTag();
        this.logo = team.getLogo();
        this.playersCount = team.getPlayers() != null ? team.getPlayers().size() : 0;
        this.tournamentsCount = team.getTournaments() != null ? team.getTournaments().size() : 0;

        if (team.getPlayers() != null) {
            this.players = team.getPlayers().stream()
                    .map(player -> new PlayerDTO(
                            player.getId(),
                            player.getNickname(),
                            player.getRole() != null ? player.getRole().toString() : null
                    ))
                    .collect(Collectors.toList());
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getTag() { return tag; }
    public void setTag(String tag) { this.tag = tag; }

    public String getLogo() { return logo; }
    public void setLogo(String logo) { this.logo = logo; }

    public List<PlayerDTO> getPlayers() { return players; }
    public void setPlayers(List<PlayerDTO> players) { this.players = players; }

    public int getPlayersCount() { return playersCount; }
    public void setPlayersCount(int playersCount) { this.playersCount = playersCount; }

    public int getTournamentsCount() { return tournamentsCount; }
    public void setTournamentsCount(int tournamentsCount) { this.tournamentsCount = tournamentsCount; }

    public static class PlayerDTO {
        private Long id;
        private String nickname;
        private String role;

        public PlayerDTO() {}

        public PlayerDTO(Long id, String nickname, String role) {
            this.id = id;
            this.nickname = nickname;
            this.role = role;
        }

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }

        public String getNickname() { return nickname; }
        public void setNickname(String nickname) { this.nickname = nickname; }

        public String getRole() { return role; }
        public void setRole(String role) { this.role = role; }
    }
}
