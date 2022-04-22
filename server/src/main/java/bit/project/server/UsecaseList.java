package bit.project.server;

import bit.project.server.util.security.SystemModule;

public enum UsecaseList{
    @SystemModule("User") SHOW_ALL_USERS(1),
    @SystemModule("User") SHOW_USER_DETAILS(2),
    @SystemModule("User") ADD_USER(3),
    @SystemModule("User") UPDATE_USER(4),
    @SystemModule("User") DELETE_USER(5),
    @SystemModule("User") RESET_USER_PASSWORDS(6),

    @SystemModule("Role") SHOW_ALL_ROLES(7),
    @SystemModule("Role") SHOW_ROLE_DETAILS(8),
    @SystemModule("Role") ADD_ROLE(9),
    @SystemModule("Role") UPDATE_ROLE(10),
    @SystemModule("Role") DELETE_ROLE(11),

    @SystemModule("Employee") SHOW_ALL_EMPLOYEES(12),
    @SystemModule("Employee") SHOW_EMPLOYEE_DETAILS(13),
    @SystemModule("Employee") ADD_EMPLOYEE(14),
    @SystemModule("Employee") UPDATE_EMPLOYEE(15),
    @SystemModule("Employee") DELETE_EMPLOYEE(16),

    @SystemModule("Customer") SHOW_ALL_CUSTOMERS(17),
    @SystemModule("Customer") SHOW_CUSTOMER_DETAILS(18),
    @SystemModule("Customer") ADD_CUSTOMER(19),
    @SystemModule("Customer") UPDATE_CUSTOMER(20),
    @SystemModule("Customer") DELETE_CUSTOMER(21),

    @SystemModule("Supplier") SHOW_ALL_SUPPLIERS(22),
    @SystemModule("Supplier") SHOW_SUPPLIER_DETAILS(23),
    @SystemModule("Supplier") ADD_SUPPLIER(24),
    @SystemModule("Supplier") UPDATE_SUPPLIER(25),
    @SystemModule("Supplier") DELETE_SUPPLIER(26),

    @SystemModule("Branch") SHOW_ALL_BRANCHES(27),
    @SystemModule("Branch") SHOW_BRANCH_DETAILS(28),
    @SystemModule("Branch") ADD_BRANCH(29),
    @SystemModule("Branch") UPDATE_BRANCH(30),
    @SystemModule("Branch") DELETE_BRANCH(31),

    @SystemModule("Item") SHOW_ALL_ITEMS(32),
    @SystemModule("Item") SHOW_ITEM_DETAILS(33),
    @SystemModule("Item") ADD_ITEM(34),
    @SystemModule("Item") UPDATE_ITEM(35),
    @SystemModule("Item") DELETE_ITEM(36);




    public final int value;

    UsecaseList(int value){
        this.value = value;
    }

}
