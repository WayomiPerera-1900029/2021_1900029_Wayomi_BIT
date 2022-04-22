package bit.project.server.seed;

import bit.project.server.util.seed.AbstractSeedClass;
import bit.project.server.util.seed.SeedClass;

@SeedClass
public class UnitData extends AbstractSeedClass {

    public UnitData(){
       addIdNameData(1, "Milligram");
       addIdNameData(2,"Milliliter");
    }
}
