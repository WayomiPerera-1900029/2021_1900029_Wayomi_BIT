package bit.project.server.controller;

import bit.project.server.dao.BrandDao;
import bit.project.server.entity.Brand;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/brands")
public class BrandController {

    @Autowired
    private BrandDao brandDao;

    @GetMapping
    public List<Brand> getAll(){
        return brandDao.findAll();
    }
}
