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

    static addPassageListener(topic_instances) {
        for (const topic of topic_instances) {
            document.getElementById(`passages ${topic.id}`).addEventListener("click", () => {
                Passage.getPassages(topic)
            })
        }
    }

    static getPassages(topic) {
        fetch(`${baseUrl}/users/1/topics/${topic.id}/passages`)
        .then(resp => resp.json())
        .then(function (passages) {
            let passage_array = passages['data']
            
            for (const passage of passage_array) {
                let new_passage = new Passage (passage['id'], passage['attributes']['content'], passage['attributes']['book'], passage['attributes']['chapter'], passage['attributes']['verse'], passage['attributes']['topic_ids'])

                new_passage.renderPassage(topic)
            }
        })
    }
}
