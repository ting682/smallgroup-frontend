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
                            <a class=\"button is-primary\" id=\"passages ${this.id}\">Show passages</a>
                            <div class=\"passages ${this.id}\">
                                
                            </div>
                            <br><br>
                            <a class=\"button is-primary\" id=\"comments ${this.id}\">Show Comments</a><br>
                            <div class=\"comments ${this.id}\">
                                
                            </div>
                            <br>
                            
                            <span class=\"icon is-small\"><i class=\"far fa-heart\" id=\"heart ${this.id}\" style=\"color: red\"></i></span>
                           
                        </div>
                    </div>
                </div>
            </div>`


    }

    static renderTopicPage() {
        document.body.innerHTML = 
            `<section class=\"articles\">
                <div class=\"column is-8 is-offset-2\" id=\"feed\">
                </div>
            </section>`
    }

    static getTopics() {
    

        fetch(`${baseUrl}/users/1/topics`)
        .then(resp => resp.json())
        .then(function(topics) {
            
            let topic_array = topics['data']
            Topic.renderTopicPage()
            for (let i = 0; i < topic_array.length; i++) {
                let new_topic = new Topic (topic_array[i]['id'], topic_array[i]['attributes']['title'], topic_array[i]['attributes']['content'], topic_array[i]['attributes']['localTime'], topic_array[i]['attributes']['name'], topic_array[i]['attributes']['passage_ids'], topic_array[i]['attributes']['comment_ids'])
                
                new_topic.renderTopic()
                
                Topic.instances.push(new_topic)
                
            }
            
            Comment.addShowCommentListener(Topic.instances)

            Passage.addShowPassageListener(Topic.instances)
        })

    }
}

