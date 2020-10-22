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
        
        let configObj = {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('jwt_token')}`
            }
        }

        fetch(`${baseUrl}/topics/${topic.id}/comments`, configObj)
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
            
            Comment.newCommentListener(topic)

        })
    }

    static renderAddComment(topic) {
        
        document.getElementsByClassName(`comments ${topic.id}`)[0].innerHTML = 

            `<br><form class=\"new comment${topic.id}\">
                <textarea class=\"textarea\"></textarea>
                <br><input type=\"submit\" class=\"button is-secondary\" id=\"add comments ${topic.id}" data-topic-id=\"${topic.id}\" value=\"Add comment\"></input>
                
            </form><br>`

        
    }

    static addShowCommentListener(topic_instances) {
        
            for (const topic of topic_instances) {
            
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

    static newCommentListener(topic) {
        
        document.querySelectorAll(`form.new.comment${topic.id}`)[0].onsubmit = function(event) {
            
            event.preventDefault()
            
            let configObj = {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('jwt_token')}`
                },
                
                body: JSON.stringify({
                    
                    comment: {
                        topic_id: topic.id,
                        //content: "hello",
                        content: this.getElementsByTagName('textarea')[0].value,
                        user_id: User.currentUser.id
                    }   
                    
                })
            }

            fetch(`${baseUrl}/topics/${topic.id}/comments`, configObj)
            .then(resp => resp.json())
            .then(function(comment_data) {
                
                //debugger

                let new_comment = new Comment(
                    comment_data['data']['attributes']['id'], 
                    comment_data['data']['attributes']['content'], 
                    comment_data['data']['attributes']['name'], 
                    comment_data['data']['attributes']['email'], 
                    comment_data['data']['attributes']['localTime'], 
                    comment_data['data']['attributes']['topic_id'])

                
                new_comment.renderComment()

            })
        }


    }
}