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
            console.log(`${topic.id} clicked`);
            getComments(topic.id)
        })
        
    }

    function getComments(topic_id){
        fetch(`${baseUrl}/users/1/topics/${topic_id}/comments`)
        .then(resp => resp.json())
        .then(function(comments) {
            let comment_array = comments['data']


        })
    }

})





class Topic {
    
    constructor(id, title, content, localtime, name, passage_ids, comment_ids) {
        this.title = title
        this.content = content
        this.id = id
        this.localtime = localtime
        this.name = name
        this.passage_ids = passage_ids
        this.comment_ids = comment_ids

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
                            
                            <button class=\"button is-primary\" id=\"comments ${this.id}">Comments</button> <a class=\"button is-primary\" id=\"passages ${this.id}">Passages</a>
                            <span class=\"icon is-small\"><i class=\"far fa-heart\" id=\"heart ${this.id}\" style=\"color: red\"></i></span>
                            <div class=\"comments\"></div>
                            <div class=\"passages\"></div>
                        </div>
                    </div>
                </div>
            </div>`


    }



}

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

    }
}
