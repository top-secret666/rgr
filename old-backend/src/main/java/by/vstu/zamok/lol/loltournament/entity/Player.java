package by.vstu.zamok.lol.loltournament.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.util.Objects;

@Entity
@Table(name = "players")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Player {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Nickname is required")
    @Column(name = "nickname")
    private String nickname;

    @Column(name = "real_name")
    private String realName;

    @Enumerated(EnumType.STRING)
    @Column(name = "role")
    private PlayerRole role;

    @Enumerated(EnumType.STRING)
    @Column(name = "player_rank")
    private PlayerRank playerRank;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "team_id")
    private Team team;

    public enum PlayerRole {
        Top("TOP"),
        Jungle("JUNGLE"),
        Mid("MID"),
        Adc("ADC"),
        Support("SUPPORT");

        private final String dbValue;

        PlayerRole(String dbValue) {
            this.dbValue = dbValue;
        }

        public String getDbValue() {
            return dbValue;
        }
    }

    public enum PlayerRank {
        Iron("IRON"),
        Bronze("BRONZE"),
        Silver("SILVER"),
        Gold("GOLD"),
        Platinum("PLATINUM"),
        Diamond("DIAMOND"),
        Master("MASTER"),
        Grandmaster("GRANDMASTER"),
        Challenger("CHALLENGER");

        private final String dbValue;

        PlayerRank(String dbValue) {
            this.dbValue = dbValue;
        }

        public String getDbValue() {
            return dbValue;
        }
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Player player = (Player) o;
        return Objects.equals(id, player.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    @Override
    public String toString() {
        return "Player{" +
                "id=" + id +
                ", nickname='" + nickname + '\'' +
                ", realName='" + realName + '\'' +
                ", role=" + role +
                ", playerRank=" + playerRank +
                '}';
    }
}
