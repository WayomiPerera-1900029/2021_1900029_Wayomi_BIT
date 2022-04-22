package bit.project.server.seed;

import bit.project.server.util.seed.AbstractSeedClass;
import bit.project.server.util.seed.SeedClass;

@SeedClass
public class ItemtypeData extends AbstractSeedClass {

    public ItemtypeData(){
       addIdNameData(1, "Tablets");
       addIdNameData(2,"Liquid");
    }
}
