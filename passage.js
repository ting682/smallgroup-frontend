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
                        Passage.getFetchPassages(topic)
                        
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

    static getFetchPassages(topic) {
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
                    
                    Passage.instances.push(new_passage)
                    new_passage.renderPassage(topic)
                    topic.passages_rendered = true
                    topic.passages_show = true
                    document.getElementById(`passages ${topic.id}`).innerHTML = "Hide passages"
                }
            }

        })
    }

    static getExistingPassages(topic) {
        
        let passagesFiltered = Passage.instances.filter(function(passage) {
            return passage.topic_ids.find(topic_id => topic_id === topic.id)
        })
        debugger

        return passagesFiltered
    }



    static addPassageForm() {

        Topic.newPassageCount = 0

        document.getElementById('addpassage').addEventListener("click", (event) => {

            Topic.newPassageCount += 1

            document.getElementById('topicpassages').innerHTML +=

                `<div id=\"new passage ${Topic.newPassageCount}\">
                    
                    <label>New passage content</label><br>
                    <textarea id=\"new passage content ${Topic.newPassageCount}\" style=\"width: 500px; height: 100px\"></textarea><br>
                    <label>Book:</label><br>
                    <input type=\"text\" id=\"new passage book ${Topic.newPassageCount}\"></input><br>
                    <label>Chapter:</label><br>
                    <input type=\"text\" id=\"new passage chapter ${Topic.newPassageCount}\"></input><br>
                    <label>Verse:</label><br>
                    <input type=\"text\" id=\"new passage verse ${Topic.newPassageCount}\"></input><br><br>
                </div>
                `
                
            //add event listener and button to remove new passage div
           
            event.preventDefault()
        })
        
    }

    static renderExistingPassagesForm() {



        document.getElementById('addpassage').addEventListener("click", (event) => {

        })
    }
}
