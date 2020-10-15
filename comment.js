class Comment {
    constructor(id, content, name, email, localtime, topic_id) {
        this.id = id
        this.content = content
        this.name = name
        this.email = email
        this.localtime = localtime
        this.topic_id = topic_id
        
    }



    renderComment() {
        
        document.getElementsByClassName(`comments ${this.topic_id}`)[0].innerHTML += 
            `<div class="media-content">
                <div class="content">
                    <p><strong>${this.name}</strong>
                        <small>${this.email}</small>
                        <small>${this.localtime}</small>
                    <br>${this.content}
                    </p>
                </div>
            </div><br>
            `
    }
}