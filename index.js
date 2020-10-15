const baseUrl = "http://localhost:3000/api/v1"



document.addEventListener('DOMContentLoaded', () => {
    let topic_instances = []

    function getTopics() {
    

        fetch(`${baseUrl}/users/1/topics`)
        .then(resp => resp.json())
        .then(function(topics) {
            
            let topic_array = topics['data']
            renderTopicPage()
            for (let i = 0; i < topic_array.length; i++) {
                let new_topic = new Topic (topic_array[i]['id'], topic_array[i]['attributes']['title'], topic_array[i]['attributes']['content'], topic_array[i]['attributes']['localTime'], topic_array[i]['attributes']['name'], topic_array[i]['attributes']['passage_ids'], topic_array[i]['attributes']['comment_ids'])
                
                new_topic.renderTopic()
                
                topic_instances.push(new_topic)
                
                addCommentListener()

                
            }
        })

        
    }

    getTopics()

    function renderTopicPage() {
        document.body.innerHTML = 
            `<section class=\"articles\">
                <div class=\"column is-8 is-offset-2\" id=\"feed\">
                </div>
            </section>`
    }


    

    function addCommentListener() {
    
        for (const topic of topic_instances)
        document.getElementById(`comments ${topic.id}`).addEventListener("click", () => {
            
            if (topic.comments_rendered === false) {
                getComments(topic)
                
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

    function getComments(topic){

        renderAddComment(topic)

        fetch(`${baseUrl}/users/1/topics/${topic.id}/comments`)
        .then(resp => resp.json())
        .then(function(comments) {
            let comment_array = comments['data']
            
            for (const comment of comment_array) {
                let new_comment = new Comment(comment['attributes']['id'], comment['attributes']['content'], comment['attributes']['name'], comment['attributes']['email'], comment['attributes']['localTime'], comment['attributes']['topic_id'])

                new_comment.renderComment()
                topic.comments_rendered = true
                topic.comments_show = true
                document.getElementById(`comments ${topic.id}`).innerHTML = "Hide Comments"
            }


        })
    }

    function renderAddComment(topic) {
        
        document.getElementsByClassName(`comments ${topic.id}`)[0].innerHTML = 

            `<br><form>
                <textarea class=\"textarea\"></textarea>
                <br><input type=\"submit\" class=\"button is-secondary\" id=\"add comments ${topic.id}" value=\"Add Comment\"></input>
                
            </form><br>`
    }

})







class Passage {
    constructor(content, book, chapter, verse, topic_ids) {
        this.content = content
        this.book = book
        this.chapter = chapter
        this.verse = verse
        this.topic_ids = topic_ids
    }

    getPassages() {

    }

}


