

class interactions{

    constructor(ADDRESS, PORT = -1, controller){
        if(PORT == -1){
            this.ADDRESS = "https://" + ADDRESS;
        } else{
            this.ADDRESS = "http://" + ADDRESS;
        }
        console.log("ADDRESS: ", this.ADDRESS)
        this.controller = controller
        if (PORT !== -1) {
            this.ADDRESS += ':' + PORT.toString();
        }
    }

    async request(endpoint, type = "GET", data = {}, callBackFunc = null, callBackParams = null, errorFunc = null, errorFuncParam = null, isFile = false){
        if(this.controller.state.loginInfo.token){
            var response = null
            if(type !== "GET"){
                response = await fetch(this.ADDRESS + endpoint, {
                    mode : "cors",
                    method : type,
                    withCredentials : true,
                    headers : new Headers({
                        'Authorization' : "Bearer " + this.controller.state.loginInfo.token,
                        'Content-Type': 'application/json'
                    }),
                    body : JSON.stringify(data)
                }).catch(error => {
                    console.log(error)
                })
            } else {
                response = await fetch(this.ADDRESS + endpoint, {
                    mode : "cors",
                    method : type,
                    withCredentials : true,
                    headers : new Headers({
                        'Authorization' : "Bearer " + this.controller.state.loginInfo.token,
                    }),
                }).catch(error => {
                    console.log(error)
                })
            }
            if(response === null || response.status === 401){ //redirects to login page
                this.controller.setState({
                    connectionLost : true,
                    loginInfo : {loggedIn : false}
                })
            }
            else if(response.status < 400){
                var filename = null
                var content = null
                if(!isFile){
                    content = await response.json()
                } else {
                    filename = response.headers.get("Content-Disposition").split(' ')[1].split('=')[1]
                    console.log(filename)
                    content = await response.blob()
                }
                if(callBackFunc){
                    if(type === "GET"){
                        if(filename){
                            callBackFunc(content, filename)
                        } else{
                            callBackFunc(content)
                        }
                    } else if (callBackParams){
                        callBackFunc(callBackParams)
                    } else{
                        callBackFunc()
                    }
                }
            }
            else{
                if(errorFunc){
                    errorFunc(errorFuncParam)
                } else{
                    console.log("RESPONSE ERROR:", response)
                }
            }       
        } else{
            console.log("NO TOKEN AVAILABLE :(")
        }
    }

    async postDataLogin(endpoint, data = {}, callBackFunc){
        const response = await fetch(this.ADDRESS + endpoint, {
            mode : "cors",
            method : "POST",
            headers : new Headers({
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Credentials': 'true'
            }),
            body : JSON.stringify(data)
        })
        const content = await response.json()
        //calls a function
        if(callBackFunc){
            callBackFunc(content)
        }
    }


    login = (username, password) => {
        console.log("ATTEMPTING TO LOGIN!")
        this.postDataLogin("/login", {username : username, password : password}, this.controller.setToken, true)
    }

    assignTextbook = (student_number, textbook_number, textbook_condition) => {
        this.request(
            "/transactions", 
            "POST",
            {textbook_number : textbook_number, destin_student_number : student_number, origin_student_number : 0, textbook_condition : textbook_condition},
            this.getStudentInfo,
            student_number
        )
    }

    returnTextbook = (student_number, textbook_number, textbook_condition) => {
        this.request(
            "/transactions",
            "POST",
            {textbook_number : textbook_number, destin_student_number : 0, origin_student_number : student_number, textbook_condition : textbook_condition},
            this.getStudentInfo,
            student_number
        )
    }

    //returns info of textbook given the textbook's barcode
    getTextbookInfo = (number) => {
        console.log("TEXTBOOK NUMBER:", number)
        this.request(
            "/textbooks/" + number.toString(),
            "GET",
            {}, 
            this.controller.setTextbookInfo, 
            null,
            this.getStudentInfo, 
            number
        )
    }

    getStudentInfo = (number) => {
        console.log("STUDENT NUMBER:" , number)
        this.request(
            "/students/getall/" + number.toString(),
            "GET",
            {}, 
            this.controller.setStudentInfo, 
            null,
            this.controller.scannedUnknownBarcode, 
            number
        )
    }

    addTextbook = (number, title, cost, condition, callBackFunc) => {
        console.log("ADDING TEXTBOOK", number, title, cost, condition)
        this.request(
            "/textbooks/" + number.toString(),
            "PUT",
            {title : title, cost : cost, condition : condition}, 
            callBackFunc, 
            null,
        )
    }

    deleteTextbook = (number, callBackFunc) => {
        console.log("DELETING TEXTBOOK:", number)
        this.request(
            "/textbooks/" + number.toString(),
            "DELETE",
            {}, 
            callBackFunc, 
            null,
        )
    }

    deleteAbstractTextbook = (abstract_id, callBackFunc) => {
        console.log("DELETING ABSTRACT TEXTBOOK:", abstract_id)
        this.request(
            "/abstract_textbooks/" + abstract_id.toString(),
            "DELETE",
            {},
            callBackFunc
        )
    }

    getAbstractTextbooks = () => {
        console.log("GETTING ABSTRACT TEXTBOOKS")
        this.request(
            "/abstract_textbooks",
            "GET",
            {}, 
            this.controller.setAbstractTextbooks, 
            null,
        )
    }

    getTeachers = (callBackFunc) => {
        console.log("GETTING TEACHERS")
        this.request(
            "/teachers",
            "GET",
            {},
            callBackFunc,
            null
        )    
    }

    setCourseTextbooks = (callBackFunc, abstractId, teacherName, courseName, courseId, add = true) => {
        console.log("ADDING TEXTBOOK", abstractId, teacherName, courseName, courseId, add)
        var type = "POST"
        if(!add){
            type = "DELETE"
        }
        if(courseId == null){ //adding by bulk
            this.request(
                "/textbook_assignments",
                type,
                {abstract_textbook_id : abstractId, course_name : courseName, teacher_name : teacherName}, 
                callBackFunc, 
                null,
            )
        } else{
            this.request(
                "/textbook_assignments",
                type,
                {abstract_textbook_id : abstractId, course_number : courseId}, 
                callBackFunc, 
                null,
            )
        }
    }

    mergeTextbooks = (callBackFunc, badTextbookId, goodTextbookId) => {
        console.log("MERGING TEXTBOOK!")
        console.log("VALUES TO BE REPLACED:", badTextbookId)
        console.log("VALUES TO BE REPLACED WITH:", goodTextbookId)
        this.request(
            "/textbooks/merge",
            "PATCH",
            {bad_textbook : badTextbookId, good_textbook : goodTextbookId},
            callBackFunc
        )
    }

    getBarcodes = (numberOfPages, callBackFunc) => {
        console.log("GETTING BARCODES: ", numberOfPages)
        this.request(
            "/getbarcodes/" + numberOfPages.toString(),
            "GET",
            {},
            callBackFunc,
            null,
            null,
            null,
            true //says its a program
        )
    }

    getInvoice = (studentNumber, callBackFunc) => {
        console.log("GETTING INVOICE: ", studentNumber)
        this.request(
            "/invoice/" + studentNumber.toString(),
            "GET",
            {},
            callBackFunc,
            null,
            null,
            null,
            true
        )
    }

    getInvoicesBound = (callBackFunc, bound) => {
        console.log("GETTING ALL INVOICES")
        this.request(
            "/invoice/all/" + bound.toString(),
            "GET",
            {},
            callBackFunc,
            null,
            null,
            null,
            true
        )
    }

    getStats = (numberOfTransactions, callBackFunc) =>{
        console.log("GETTING STATS!")
        this.request(
            "/stats/" + numberOfTransactions.toString(),
            "GET",
            {},
            callBackFunc
        )
    }

    getStudentList = () => {
        console.log("GETTING STUDENTS!")
        this.request(
            "/students/getlist",
            "GET",
            {},
            this.controller.setStudents
        ) 
    }

    getUsers = (callBackFunc) => {
        console.log("GETTING USERS")
        this.request(
            "/users",
            "GET",
            {},
            callBackFunc
        )
    }

    addUser = (callBackFunc, username, password,  role) => {
        console.log("ADDING USER:", username, password, role)
        this.request(
            "/users",
            "POST",
            {username : username, password : password, role : role},
            callBackFunc
        )
    }

    deleteUser = (callBackFunc, username) => {
        console.log("DELETING USER:", username)
        this.request(
            "/users",
            "DELETE",
            {username : username},
            callBackFunc
        )
    }

}

export default interactions