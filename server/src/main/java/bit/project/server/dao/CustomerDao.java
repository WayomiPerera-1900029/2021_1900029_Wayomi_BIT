package bit.project.server.dao;

import bit.project.server.entity.Civilstatus;
import bit.project.server.entity.Customer;
import bit.project.server.entity.Employee;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(exported=false)
public interface CustomerDao extends JpaRepository<Customer, Integer>{
    //uniq ewa thiboth api mehema dagannawa

    Customer findByEmail(String email);
    Customer findByCode(String code);

    @Query("select new Customer (c.id, c.code, c.name) from Customer c") //combo box ekata customerge basic details withrai danne
    Page<Customer> findAllBasic(PageRequest pageRequest);
}
