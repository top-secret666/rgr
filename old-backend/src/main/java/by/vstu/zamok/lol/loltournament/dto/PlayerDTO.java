package by.vstu.zamok.lol.loltournament.dto;

import by.vstu.zamok.lol.loltournament.entity.Player;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PlayerDTO {
    private Long id;
    private String nickname;
    private Enum role;

    public PlayerDTO(Player player) {
        this.id = player.getId();
        this.nickname = player.getNickname();
        this.role = player.getRole();
    }
}
