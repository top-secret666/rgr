package by.vstu.zamok.lol.loltournament.repository;

import by.vstu.zamok.lol.loltournament.entity.Player;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PlayerRepository extends JpaRepository<Player, Long>, JpaSpecificationExecutor<Player> {
    Optional<Player> findByNickname(String nickname);
    List<Player> findByTeamId(Long teamId);
    List<Player> findByRole(Player.PlayerRole role);
    List<Player> findByPlayerRank(Player.PlayerRank playerRank);
}
