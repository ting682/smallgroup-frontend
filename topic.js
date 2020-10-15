class Topic {
    
    constructor(id, title, content, localtime, name, passage_ids, comment_ids) {
        this.title = title
        this.content = content
        this.id = id
        this.localtime = localtime
        this.name = name
        this.passage_ids = passage_ids
        this.comment_ids = comment_ids
        this.comments_rendered = false
        this.comments_show = false
        this.passages_rendered = false
        this.passages_show = false

    }

    renderTopic() {
        document.getElementById("feed").innerHTML += 
            `<div class=\"card article\">
                <div class=\"card-content\">
                    <div class=\"media\">
                        <div class=\"media-content has-text-left\" id=\"topic ${this.id}\">
                            <h2 class=\"title\">${this.title}</h2>
                            <p>By: ${this.name}</p>
                            <p>Updated: ${this.localtime}</p>
                            <h2 class=\"subtitle\">${this.content}</h2>
                            <a class=\"button is-primary\" id=\"passages ${this.id}">Passages</a>
                            <div class=\"passages ${this.id}\">
                                
                            </div>
                            <br>
                            <a class=\"button is-primary\" id=\"comments ${this.id}">Show Comments</a><br>
                            <div class=\"comments ${this.id}\">
                                
                            </div>
                            <br>
                            
                            <span class=\"icon is-small\"><i class=\"far fa-heart\" id=\"heart ${this.id}\" style=\"color: red\"></i></span>
                           
                        </div>
                    </div>
                </div>
            </div>`


    }



}