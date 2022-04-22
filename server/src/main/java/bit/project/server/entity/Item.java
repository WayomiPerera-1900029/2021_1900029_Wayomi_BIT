package bit.project.server.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties({"hibernateLazyInitializer","handler"})
public class Item {
    private Integer id;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private String code;

    private LocalDateTime tocreation;

    @Lob
    private String description;

    @ManyToOne
    @JsonIgnoreProperties({"creator", "status", "tocreation", "rolelist"})
    private User creator;

    private String name;

    private String photo;

    @ManyToOne
    private Itemtype itemtype;

    @ManyToOne
    private Itemcategory itemcategory;

    @ManyToOne
    private Brand brand;

    @ManyToOne
    private Itemstatus itemstatus;

    @ManyToOne
    private Unit unit;

    //supplier load weddi ona nathi monahri ain karanna @Jsonignorproperty({"logo",,,,}) danna puluwan

    @ManyToMany
    @JoinTable(
            name="itemsupplier",
            joinColumns=@JoinColumn(name="item_id", referencedColumnName="id"),
            inverseJoinColumns=@JoinColumn(name="supplier_id", referencedColumnName="id")
    )
    private List<Supplier> supplierList;

    public Item(Integer id) {
        this.id = id;
    }

    public Item(Integer id, String code,String name) {
        this.id = id;
        this.code = code;
        this.name = name;
    }
}
