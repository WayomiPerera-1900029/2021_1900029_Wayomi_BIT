package bit.project.server.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;
import lombok.NoArgsConstructor;
import net.minidev.json.annotate.JsonIgnore;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties({"hibernateLazyInitializer","handler"})
public class Supplier {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String code;

    private LocalDateTime tocreation;

    @Lob
    private String description;

    private String name;

    private String contact1;

    private String contact2;

    private String address;

    private String email;

    private String fax;

    @ManyToOne
    private Suppliertype suppliertype;

    @ManyToOne
    private Supplierstatus supplierstatus;

    @ManyToOne
    @JsonIgnoreProperties({"creator", "status", "tocreation", "rolelist"})
    private User creator;

    @JsonIgnore
   @ManyToMany(mappedBy = "supplierList")
   private List<Item> itemList;

    public Supplier(Integer id){
        this.id=id;
    }

    public Supplier(Integer id, String code,String name) {
        this.id = id;
        this.code = code;
        this.name = name;
    }
}

