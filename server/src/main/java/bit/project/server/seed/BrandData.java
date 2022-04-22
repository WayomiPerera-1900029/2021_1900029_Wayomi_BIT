package bit.project.server.seed;

import bit.project.server.util.seed.AbstractSeedClass;
import bit.project.server.util.seed.SeedClass;

@SeedClass
public class BrandData extends AbstractSeedClass {

    public BrandData(){
       addIdNameData(1, "American");
       addIdNameData(2,"British");
    }
}
