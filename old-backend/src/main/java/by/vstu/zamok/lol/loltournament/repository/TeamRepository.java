package by.vstu.zamok.lol.loltournament.repository;

import by.vstu.zamok.lol.loltournament.entity.Team;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TeamRepository extends JpaRepository<Team, Long>, JpaSpecificationExecutor<Team> {
    Optional<Team> findByName(String name);
    Optional<Team> findByTag(String tag);
    List<Team> findByTournamentsId(Long tournamentId);

    @Query("SELECT COUNT(p) FROM Team t JOIN t.players p WHERE t.id = :teamId")
    Long countPlayersByTeamId(@Param("teamId") Long teamId);

    @Query("SELECT COUNT(tour) FROM Team t JOIN t.tournaments tour WHERE t.id = :teamId")
    Long countTournamentsByTeamId(@Param("teamId") Long teamId);
}
