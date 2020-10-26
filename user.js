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


    static postFetchSignup(email_address, password, password_confirmation, name) {

        let configObj = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            
            body: JSON.stringify({
                
                user: {
                    email_address,
                    password,
                    password_confirmation,
                    name
                }   
                
            })
        }
        //debugger
        fetch(`${baseUrl}/signup`, configObj)
        .then(resp => resp.json())
        .then(function (user_data) {
            if (user_data.error) {
                User.displayNotification(user_data.error)
                document.getElementsByClassName('modal is-active')[0].className = 'modal'
            } else {
                console.log(user_data);
                User.currentUser = new User(user_data['user']["data"]["attributes"]["name"], user_data['user']["data"]["attributes"]["email_address"], user_data['user']["data"]['id'])
                localStorage.setItem('jwt_token', user_data.jwt)
                localStorage.setItem('user_id', User.currentUser.id)
                localStorage.setItem('email', User.email)
                localStorage.setItem('name', User.name)
                
                document.getElementsByClassName('modal is-active')[0].className = 'modal'
                Topic.getTopics()
            }
            
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

            User.postFetchSignup(event.target['signup email'].value, event.target['signup password'].value, event.target['signup password confirmation'].value, event.target['signup name'].value)

            
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

    static postFetchLogin(email_address, password) {
        //debugger
        let configObj = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            
            body: JSON.stringify({
                
                user: {
                    email_address,
                    
                    password
                }   
                
            })
        }
        
        fetch(`${baseUrl}/login`, configObj)
        .then(resp => resp.json())
        .then(function (json) {
            //debugger
            //console.log(json);
            //debugger
            if (json.error) {
                User.displayNotification(json.error)
                document.getElementsByClassName('modal is-active')[0].className = 'modal'
            } else {
                User.currentUser = new User(json['user']["data"]["attributes"]["name"], json['user']["data"]["attributes"]["email_address"], json['user']["data"]['id'])
                localStorage.setItem('jwt_token', json.jwt)
                localStorage.setItem('user_id', User.currentUser.id)
                localStorage.setItem('email', User.currentUser.email)
                localStorage.setItem('name', User.currentUser.name)
                document.getElementsByClassName('modal is-active')[0].className = 'modal'
                Topic.getTopics()
            }
            
            
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

            //debugger
            User.postFetchLogin(event.target['login email'].value, event.target['login password'].value)

            
            return false
        }

    }

    static displayNotification(data) {
        
        const scrollToTop = () => {
            const c = document.documentElement.scrollTop || document.body.scrollTop;
            if (c > 0) {
              window.requestAnimationFrame(scrollToTop);
              window.scrollTo(0, c - c / 8);
            }
          };
          scrollToTop();
        document.getElementsByClassName('notification')[0].style = "display: block"
        document.getElementsByClassName('notification')[0].innerHTML =  `<button class=\"delete\"></button>` + data 
        document.getElementsByClassName('delete')[0].addEventListener("click", () => {
            document.getElementsByClassName('notification')[0].innerHTML = ""
            document.getElementsByClassName('notification')[0].style = "display: none"
        })
    }

    static logoutUser() {

        document.getElementById("logout").addEventListener("click", () => {
            localStorage.removeItem('jwt_token')
            localStorage.removeItem('user_id')
            localStorage.removeItem('email')
            localStorage.removeItem('name')
            User.currentUser = undefined
            User.displayNotification("Logged out successfully")
            document.getElementById('feed').innerHTML = ""
            document.getElementById('addtopic').style = "display: none"
        })
        

    }

    static checkLoggedIn() {
        //debugger
        if (User.currentUser.id !== undefined) {
            for (const topic of Topic.instances) {
                document.getElementById(`topicedit${topic.id}`).style = "display: block"
                document.getElementById(`topicdelete${topic.id}`).style = "display: block"
                document.getElementById('addtopic').style = "display: block"
            }
            
            return true
        } else {
            for (const topic of Topic.instances) {
                document.getElementById(`topicedit${topic.id}`).style = "display: none"
                document.getElementById(`topicdelete${topic.id}`).style = "display: none"
                document.getElementById('addtopic').style = "display: none"
            }

            return false
        }
    }

}