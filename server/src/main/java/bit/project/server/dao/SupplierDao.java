package bit.project.server.dao;


import bit.project.server.entity.Supplier;
import bit.project.server.entity.Supplier;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(exported=false)
public interface SupplierDao extends JpaRepository<Supplier, Integer>{
    //uniq ewa thiboth api mehema dagannawa

    Supplier findByEmail (String email);
    Supplier findByCode (String code);
    Supplier findByName(String name);

    @Query("select new Supplier (s.id, s.code, s.name) from Supplier s") //combo box ekata supplierge basic details withrai danne
    Page<Supplier> findAllBasic(PageRequest pageRequest);
}
