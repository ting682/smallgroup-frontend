class User {
    constructor(name, email, passages) {
        this.name = name
        this.email = email
        this.passages = passages
    }

    static renderSignup() {
        document.getElementById('modal').className = 'modal-active'

        document.getElementsByClassName('modal-card-body')[0].innerHTML = ""

        document.getElementsByClassName('modal-card-body')[0].innerHTML = 
            `<form>
                <label>Email</label><br>
                <input type=\"text\" id=\"signup email\"></input><br><br>

                <label>Password</label><br>
                <input type=\"password\" id=\"signup password\"></input><br><br>

                <label>Password confirmation<br>
                <input type=\"password\" id=\"signup password confirmation\"></input><br><br>

                <input type=\"submit\" id=\"signup\"></input>
            </form>`
    }
}