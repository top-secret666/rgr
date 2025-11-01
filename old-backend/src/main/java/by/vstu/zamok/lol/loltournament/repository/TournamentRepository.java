package by.vstu.zamok.lol.loltournament.repository;

import by.vstu.zamok.lol.loltournament.entity.Tournament;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface TournamentRepository extends JpaRepository<Tournament, Long>, JpaSpecificationExecutor<Tournament> {
    List<Tournament> findByStartDateAfter(LocalDate date);
    List<Tournament> findByStatus(Tournament.TournamentStatus status);
    List<Tournament> findByCreatorId(Long creatorId);
    @Query("SELECT t FROM Tournament t LEFT JOIN FETCH t.teams WHERE t.id = :id")
    Optional<Tournament> findByIdWithTeams(@Param("id") Long id);

}
