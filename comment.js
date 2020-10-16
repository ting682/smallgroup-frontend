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

    static getComments(topic){

        Comment.renderAddComment(topic)

        fetch(`${baseUrl}/users/1/topics/${topic.id}/comments`)
        .then(resp => resp.json())
        .then(function(comments) {

            
            let comment_array = comments['data']
            
            if (comment_array.length === 0) {
                topic.comments_rendered = true
                topic.comments_show = true
                document.getElementById(`comments ${topic.id}`).innerHTML = "Hide Comments"
            } else {
                for (const comment of comment_array) {
                    let new_comment = new Comment(comment['attributes']['id'], comment['attributes']['content'], comment['attributes']['name'], comment['attributes']['email'], comment['attributes']['localTime'], comment['attributes']['topic_id'])
    
                    new_comment.renderComment()
                    topic.comments_rendered = true
                    topic.comments_show = true
                    document.getElementById(`comments ${topic.id}`).innerHTML = "Hide Comments"
                }
            }
            


        })
    }

    static renderAddComment(topic) {
        
        document.getElementsByClassName(`comments ${topic.id}`)[0].innerHTML = 

            `<br><form>
                <textarea class=\"textarea\"></textarea>
                <br><input type=\"submit\" class=\"button is-secondary\" id=\"add comments ${topic.id}" value=\"Add Comment\"></input>
                
            </form><br>`
    }

    static addCommentListener(topic_instances) {
    
        for (const topic of topic_instances)
            document.getElementById(`comments ${topic.id}`).addEventListener("click", () => {
            
                if (topic.comments_rendered === false) {
                    Comment.getComments(topic)
                    
                } else if (topic.comments_show === true) {
                    topic.comments_show = false
                    //debugger
                    document.getElementsByClassName(`comments ${topic.id}`)[0].style = "display: none"
                    document.getElementById(`comments ${topic.id}`).innerHTML = "Show Comments"
                } else if (topic.comments_show === false) {
                    topic.comments_show = true
                    document.getElementsByClassName(`comments ${topic.id}`)[0].style = "display: block"
                    document.getElementById(`comments ${topic.id}`).innerHTML = "Hide Comments"
                }
            
        })
        
    }
}