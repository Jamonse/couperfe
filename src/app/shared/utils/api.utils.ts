    export {
        API_URL,
        ADMIN_LOGIN_URL,
        COMPANY_LOGIN_URL,
        CUSTOMER_LOGIN_URL,
        COMPANY_LOAD_URL,
        CUSTOMER_LOAD_URL,
        CATEGORY_POST_URL,
        CATEGORY_PUT_URL,
        CATEGORY_GET_ALL_URL,
        CATEGORY_DELETE_URL,
        COMPANY_POST_URL,
        COMPANY_PUT_URL,
        COMPANY_GET_ALL_URL,
        COMPANY_DELETE_URL,
        COMPANY_GET_URL,
        COMPANY_GET_PAGED_URL,
        COMPANY_GET_PAGED_SORTED_URL,
        COMPANY_GET_EXAMPLE_URL,
        CUSTOMER_POST_URL,
        CUSTOMER_PUT_URL,
        CUSTOMER_GET_ALL_URL,
        CUSTOMER_DELETE_URL,
        CUSTOMER_GET_URL,
        CUSTOMER_GET_PAGED_URL,
        CUSTOMER_GET_PAGED_SORTED_URL,
        CUSTOMER_GET_EXAMPLE_URL,
        AUTH_URL
     }
    
    const API_URL = 'http://localhost:8080/coupersb/';

    const ADMIN_URL = API_URL + 'admin/';
    const COMPANY_URL = API_URL + 'company/';
    const CUSTOMER_URL = API_URL + 'customer/';

    const ADMIN_LOGIN_URL = ADMIN_URL + 'login';
    const COMPANY_LOGIN_URL = COMPANY_URL + 'login';
    const CUSTOMER_LOGIN_URL = CUSTOMER_URL + 'login';

    const COMPANY_LOAD_URL = COMPANY_URL + 'getDetails';
    const CUSTOMER_LOAD_URL = CUSTOMER_URL + 'getDetails';

    const CATEGORY_URL = ADMIN_URL + 'category/';
    const CATEGORY_POST_URL = CATEGORY_URL + 'add';
    const CATEGORY_PUT_URL = CATEGORY_URL + 'update';
    const CATEGORY_GET_ALL_URL = CATEGORY_URL + 'get/all';
    const CATEGORY_DELETE_URL = CATEGORY_URL + 'delete/';

    const COMPANY_ADMIN_URL = ADMIN_URL + 'company/';
    const COMPANY_POST_URL = COMPANY_ADMIN_URL + 'add';
    const COMPANY_PUT_URL = COMPANY_ADMIN_URL + 'update';
    const COMPANY_GET_URL = COMPANY_ADMIN_URL + 'get/';
    const COMPANY_GET_ALL_URL = COMPANY_ADMIN_URL + 'get/all';
    const COMPANY_GET_PAGED_URL = COMPANY_ADMIN_URL + 'get/paged';
    const COMPANY_GET_PAGED_SORTED_URL = COMPANY_ADMIN_URL + 'get/pagedSorted';
    const COMPANY_GET_EXAMPLE_URL = COMPANY_ADMIN_URL + 'get/example';
    const COMPANY_DELETE_URL = COMPANY_ADMIN_URL + 'delete/';

    const CUSTOMER_ADMIN_URL = ADMIN_URL + 'customer/';
    const CUSTOMER_POST_URL = CUSTOMER_ADMIN_URL + 'add';
    const CUSTOMER_PUT_URL = CUSTOMER_ADMIN_URL + 'update';
    const CUSTOMER_GET_URL = CUSTOMER_ADMIN_URL + 'get/';
    const CUSTOMER_GET_ALL_URL = CUSTOMER_ADMIN_URL + 'get/all';
    const CUSTOMER_GET_PAGED_URL = CUSTOMER_ADMIN_URL + 'get/paged';
    const CUSTOMER_GET_PAGED_SORTED_URL = CUSTOMER_ADMIN_URL + 'get/pagedSorted';
    const CUSTOMER_GET_EXAMPLE_URL = CUSTOMER_ADMIN_URL + 'get/example';
    const CUSTOMER_DELETE_URL = CUSTOMER_ADMIN_URL + 'delete/';

    const AUTH_URL = API_URL + 'authenticated';



