class User {
    constructor(name, email, id) {
        this.name = name
        this.email = email
        this.id = id
    }

    static renderSignup() {
        //debugger
        document.getElementsByClassName('modal')[0].className = 'modal is-active'

        document.getElementsByClassName('modal-card-body')[0].innerHTML = ""

        document.getElementsByClassName('modal-card-body')[0].innerHTML = 
            `<div class=\"login form\">
                <form id=\"signupsubmit\">

                    <label>Name</label><br>
                    <input type=\"text\" id=\"signup name\"></input><br><br>
                    <label>Email</label><br>
                    <input type=\"text\" id=\"signup email\"></input><br><br>

                    <label>Password</label><br>
                    <input type=\"password\" id=\"signup password\"></input><br><br>

                    <label>Password confirmation<br>
                    <input type=\"password\" id=\"signup password confirmation\"></input><br><br>

                    <input class=\"button is-primary\" type=\"submit\" value=\"Signup\" ></input>
                </form>
            </div>`

            document.getElementsByClassName('modal-background')[0].addEventListener("click", () => {
                
                if (document.getElementsByClassName('modal is-active')[0] === undefined) {

                } else {
                    document.getElementsByClassName('modal is-active')[0].className = 'modal'
                }
                
                //Topic.addTopic()
            })

            
    }


    static postFetchSignup() {

        let configObj = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            
            body: JSON.stringify({
                
                user: {
                    email_address: document.getElementById('signup email').value,
                    //content: "hello",
                    password: document.getElementById('signup password').value,
                    password_confirmation: document.getElementById('signup password confirmation').value,
                    name: document.getElementById('signup name').value
                }   
                
            })
        }
        
        fetch(`${baseUrl}/signup`, configObj)
        .then(resp => resp.json())
        .then(function (user_data) {
            console.log(user_data);
            User.currentUser = new User(json['user']["data"]["attributes"]["name"], json['user']["data"]["attributes"]["email_address"], json['user']["data"]['id'])
            localStorage.setItem('jwt_token', json.jwt)
            localStorage.setItem('user_id', User.currentUser.id)
            localStorage.setItem('email', User.email)
            localStorage.setItem('name', User.name)
            document.getElementsByClassName('modal is-active')[0].className = 'modal'
        })
    }

    static signupListener() {
        //debugger
        document.getElementById("signup").addEventListener("click", () => {
            console.log("signup");
            User.renderSignup()
            User.signupFormHandler()
        })
    }

    static signupFormHandler() {
        
        document.getElementById("signupsubmit").onsubmit = function (event) {
            //debugger
            event.preventDefault()

            User.postFetchSignup()

            
            return false
        }

    }

    static renderLogin(){
        document.getElementsByClassName('modal')[0].className = 'modal is-active'

        document.getElementsByClassName('modal-card-body')[0].innerHTML = ""

        document.getElementsByClassName('modal-card-body')[0].innerHTML = 
            `<div class=\"login form\">
                <form id=\"loginsubmit\">

                    <label>Email</label><br>
                    <input type=\"text\" id=\"login email\"></input><br><br>

                    <label>Password</label><br>
                    <input type=\"password\" id=\"login password\"></input><br><br>


                    <input class=\"button is-primary\" type=\"submit\" value=\"Login\" ></input>
                </form>
            </div>`

            document.getElementsByClassName('modal-background')[0].addEventListener("click", () => {
                
                if (document.getElementsByClassName('modal is-active')[0] === undefined) {

                } else {
                    document.getElementsByClassName('modal is-active')[0].className = 'modal'
                }
                
                //Topic.addTopic()
            })
    }

    static postFetchLogin() {
        //debugger
        let configObj = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            
            body: JSON.stringify({
                
                user: {
                    email_address: document.getElementById('login email').value,
                    //content: "hello",
                    password: document.getElementById('login password').value
                }   
                
            })
        }
        
        fetch(`${baseUrl}/login`, configObj)
        .then(resp => resp.json())
        .then(function (json) {
            //debugger
            //console.log(json);
            //debugger
            User.currentUser = new User(json['user']["data"]["attributes"]["name"], json['user']["data"]["attributes"]["email_address"], json['user']["data"]['id'])
            localStorage.setItem('jwt_token', json.jwt)
            localStorage.setItem('user_id', User.currentUser.id)
            localStorage.setItem('email', User.currentUser.email)
            localStorage.setItem('name', User.currentUser.name)
            document.getElementsByClassName('modal is-active')[0].className = 'modal'
            
        })
    }

    static loginListener() {
        //debugger
        document.getElementById("login").addEventListener("click", () => {
            console.log("login");
            User.renderLogin()
            User.loginFormHandler()
        })
    }

    static loginFormHandler() {
        
        document.getElementById("loginsubmit").onsubmit = function (event) {
            //debugger
            event.preventDefault()

            User.postFetchLogin()

            
            return false
        }

    }


}