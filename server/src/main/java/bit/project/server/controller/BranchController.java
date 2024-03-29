package bit.project.server.controller;
import bit.project.server.UsecaseList;
import bit.project.server.dao.BranchDao;
import bit.project.server.entity.Branch;
import bit.project.server.entity.Branchstatus;
import bit.project.server.entity.User;
import bit.project.server.util.dto.PageQuery;
import bit.project.server.util.dto.ResourceLink;
import bit.project.server.util.exception.ConflictException;
import bit.project.server.util.exception.DataValidationException;
import bit.project.server.util.exception.ObjectNotFoundException;
import bit.project.server.util.helper.CodeGenerator;
import bit.project.server.util.helper.PageHelper;
import bit.project.server.util.helper.PersistHelper;
import bit.project.server.util.security.AccessControlManager;
import bit.project.server.util.validation.EntityValidator;
import bit.project.server.util.validation.ValidationErrorBag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import javax.persistence.RollbackException;
import javax.servlet.http.HttpServletRequest;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@CrossOrigin
@RestController
@RequestMapping("/branches")
public class BranchController {
    @Autowired
    private BranchDao branchDao;

    @Autowired
    private AccessControlManager accessControlManager;

    @Autowired
    private CodeGenerator codeGenerator;
    private final CodeGenerator.CodeGeneratorConfig codeConfig;

    private static final Sort DEFAULT_SORT = Sort.by(Sort.Direction.DESC, "tocreation");

    public BranchController(){
        codeConfig = new CodeGenerator.CodeGeneratorConfig("branch");
        codeConfig.setColumnName("code");
        codeConfig.setLength(10);
        codeConfig.setPrefix("Br"); //cu21 means year eka ena mulata dala branch code eka hadenwa.
        codeConfig.setYearlyRenew(true);
    }
    @GetMapping
    public Page<Branch> getAll(PageQuery pageQuery, HttpServletRequest request)   {
        accessControlManager.authorize(request, "No privilege to get all branchs", UsecaseList.SHOW_ALL_BRANCHES);

        if(pageQuery.isEmptySearch()){
            return branchDao.findAll(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
        }

        String code = pageQuery.getSearchParam("code");
        String name = pageQuery.getSearchParam("name");
        Integer branchstatusID = pageQuery.getSearchParamAsInteger("branchstatus"); //me tiken api branchwa search karanne


        List<Branch> branchs = branchDao.findAll(DEFAULT_SORT);
        Stream<Branch> stream = branchs.parallelStream();

        //stream ekedi branchsla ganata loop ekak karakila e widiyata filter wenawa
        List<Branch> filteredBranchs = stream.filter(branch -> {
            if(code!=null)
                if(!branch.getCode().toLowerCase().contains(code.toLowerCase())) return false;
            if(name!=null)
                if(!branch.getName().toLowerCase().contains(name.toLowerCase())) return false;
            if(branchstatusID!=null)
                if(!branch.getBranchstatus().getId().equals(branchstatusID)) return false;
            return true;
        }).collect(Collectors.toList());

        return PageHelper.getAsPage(filteredBranchs, pageQuery.getPage(), pageQuery.getSize());

    }

    @GetMapping("/basic")//mekedi dao ekei,entity ekai hadanna ona meke mukuth na
    public Page<Branch> getAllBasic(PageQuery pageQuery, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to get all branches' basic data", UsecaseList.SHOW_ALL_BRANCHES);
        return branchDao.findAllBasic(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
    }

    @GetMapping("/{id}")
    public Branch get(@PathVariable Integer id, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get branch", UsecaseList.SHOW_BRANCH_DETAILS, UsecaseList.UPDATE_BRANCH);
        Optional<Branch> optionalBranch = branchDao.findById(id);
        if(optionalBranch.isEmpty()) throw new ObjectNotFoundException("Branch not found");
        return optionalBranch.get();
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer id, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to delete branches", UsecaseList.DELETE_BRANCH);

        try{
            if(branchDao.existsById(id)) branchDao.deleteById(id);
        }catch (DataIntegrityViolationException | RollbackException e){
            throw new ConflictException("Cannot delete. Because this branch already used in another module");
        }
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResourceLink add(@RequestBody Branch branch, HttpServletRequest request) throws InterruptedException {
        User authUser = accessControlManager.authorize(request, "No privilege to add new branch", UsecaseList.ADD_BRANCH);

        branch.setTocreation(LocalDateTime.now());
        branch.setCreator(authUser);
        branch.setId(null);
        branch.setBranchstatus(new Branchstatus(1));

        EntityValidator.validate(branch);

        ValidationErrorBag errorBag = new ValidationErrorBag();



        if(errorBag.count()>0) throw new DataValidationException(errorBag);

        PersistHelper.save(()->{
            branch.setCode(codeGenerator.getNextId(codeConfig));
            return branchDao.save(branch);
        });

        return new ResourceLink(branch.getId(), "/branches/"+branch.getId());
    }

    @PutMapping("/{id}")
    public ResourceLink update(@PathVariable Integer id, @RequestBody Branch branch, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to update branch details", UsecaseList.UPDATE_BRANCH);

        Optional<Branch> optionalBranch = branchDao.findById(id);
        if(optionalBranch.isEmpty()) throw new ObjectNotFoundException("Branch not found");
        Branch oldBranch = optionalBranch.get();

        branch.setId(id);
        branch.setCode(oldBranch.getCode());
        branch.setCreator(oldBranch.getCreator());
        branch.setTocreation(oldBranch.getTocreation());


        EntityValidator.validate(branch);

        ValidationErrorBag errorBag = new ValidationErrorBag();



        if(errorBag.count()>0) throw new DataValidationException(errorBag);

        branch = branchDao.save(branch);
        return new ResourceLink(branch.getId(), "/branches/"+branch.getId());
    }
    
}
