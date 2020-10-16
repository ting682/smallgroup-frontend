class Passage {
    constructor(id, content, book, chapter, verse, topic_ids) {
        this.id = id
        this.content = content
        this.book = book
        this.chapter = chapter
        this.verse = verse
        this.topic_ids = topic_ids
    }

    renderPassage(topic) {

        document.getElementsByClassName(`passages ${topic.id}`)[0].innerHTML += 
        `<div class="content">
            <small>${this.book}</small>
            <small>${this.chapter}:${this.verse}</small>
            <br>
            ${this.content}

        </div>`
    }

    static addShowPassageListener(topic_instances) {

        for (const topic of topic_instances) {
            document.getElementById(`passages ${topic.id}`).addEventListener("click", () => {
                

                if (topic.passages_rendered === false) {
                    Passage.getPassages(topic)
                    
                } else if (topic.passages_show === true) {
                    topic.passages_show = false
                    //debugger
                    document.getElementsByClassName(`passages ${topic.id}`)[0].style = "display: none"
                    document.getElementById(`passages ${topic.id}`).innerHTML = "Show passages"
                } else if (topic.passages_show === false) {
                    topic.passages_show = true
                    document.getElementsByClassName(`passages ${topic.id}`)[0].style = "display: block"
                    document.getElementById(`passages ${topic.id}`).innerHTML = "Hide passages"
                }
            })
        }
    }

    static getPassages(topic) {
        fetch(`${baseUrl}/users/1/topics/${topic.id}/passages`)
        .then(resp => resp.json())
        .then(function (passages) {
            let passage_array = passages['data']
            
            if (passage_array.length === 0) {
                topic.passages_rendered = true
                topic.passages_show = true
                document.getElementById(`passages ${topic.id}`).innerHTML = "Hide passages"
            } else {
                for (const passage of passage_array) {
                    let new_passage = new Passage (passage['id'], passage['attributes']['content'], passage['attributes']['book'], passage['attributes']['chapter'], passage['attributes']['verse'], passage['attributes']['topic_ids'])
    
                    new_passage.renderPassage(topic)
                    topic.passages_rendered = true
                    topic.passages_show = true
                    document.getElementById(`passages ${topic.id}`).innerHTML = "Hide passages"
                }
            }

        })
    }
}
