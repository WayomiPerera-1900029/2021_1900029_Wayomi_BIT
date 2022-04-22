package bit.project.server.dao;

import bit.project.server.entity.Branch;
import bit.project.server.entity.Supplier;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(exported=false)
public interface BranchDao extends JpaRepository<Branch, Integer>{
    //uniq ewa thiboth api mehema dagannawa


    Branch findByCode(String code);

    @Query("select new Branch (b.id, b.code, b.name) from Branch b") //combo box ekata supplierge basic details withrai danne
    Page<Branch> findAllBasic(PageRequest pageRequest);
}
