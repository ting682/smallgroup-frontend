class Passage {
    constructor(id, content, book, chapter, verse, topic_ids) {
        this.id = id
        this.content = content
        this.book = book
        this.chapter = chapter
        this.verse = verse
        this.topic_ids = topic_ids
        Passage.instances.push(this)
    }

    static renderPassages(topic) {
        
        //debugger
        for (const passage of Passage.getExistingPassages(topic)) {
            
            document.getElementsByClassName(`passages ${topic.id}`)[0].innerHTML += 
                `<div class="content">
                    <small>${passage.book}</small>
                    <small>${passage.chapter}:${passage.verse}</small>
                    <br>
                    ${passage.content}

                </div>`
            
            topic.passages_rendered = true
            topic.passages_show = true
            document.getElementById(`passages ${topic.id}`).innerHTML = "Hide passages"
        }
   
    }

    static createNewPassages(passage_array) {
        //debugger
        for (const passage of passage_array) {
   
            let passageFind = Passage.instances.find(function (passage_match) {
                return passage_match.id === passage['id']
            })
            if (passageFind === undefined) {
                let new_passage = new Passage (
                    passage['id'], 
                    passage['attributes']['content'], 
                    passage['attributes']['book'], 
                    passage['attributes']['chapter'], 
                    passage['attributes']['verse'], 
                    passage['attributes']['topic_ids'])
            }


        }
    }

    static createNewPassage(passage, topic) {
        let new_passage = new Passage (
                    passage['id'], 
                    passage['content'], 
                    passage['book'], 
                    passage['chapter'], 
                    passage['verse'],
                    [parseInt(topic.id)])
                
        //Passage.instances.push(new_passage)
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
           //debugger
           
        let configObj = {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('jwt_token')}`
            }
        }

        fetch(`${baseUrl}/topics/${topic.id}/passages`, configObj)
        .then(resp => resp.json())
        .then(function (passages) {
            let passage_array = passages['data']
            //debugger
            if (passage_array.length === 0) {
                topic.passages_rendered = true
                topic.passages_show = true
                document.getElementById(`passages ${topic.id}`).innerHTML = "Hide passages"
            } else {
                //debugger
                Passage.createNewPassages(passage_array)
                Passage.renderPassages(topic)
                if (topic.existing_passages_form_render) {
                    Passage.editPassagesForm(topic)
                }
            }

        })
    }

    static getExistingPassages(topic) {
        
        //debugger
        let passagesFiltered = Passage.instances.filter(function(passage) { 
            return passage.topic_ids.find(topic_id => topic_id === parseInt(topic.id) )})

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

    static getNewPassagesForm() {

        let newPassages = []
        //debugger
        //let newPassage = []
        for(let i = 1; i < Topic.newPassageCount + 1; i++) {
            //let passage_num = String(i - 1)
            newPassages.push({
                
                content: document.getElementById(`new passage content ${i}`).value,
                book: document.getElementById(`new passage book ${i}`).value,
                chapter: document.getElementById(`new passage chapter ${i}`).value,
                verse: document.getElementById(`new passage verse ${i}`).value,
                user_id: "1"
            
        })

            
            
        }

        return newPassages
    }

    static updatePassages(passages_array, topic) {
        //debugger
        for (const passage of passages_array) {
            let passageFind = Passage.instances.find(passage_match => passage_match.id === String(passage.id))

            if (passageFind === undefined) {
                Passage.createNewPassage(passage, topic)
            } else {
                passageFind.content = passage.content
                passageFind.book = passage.book
                passageFind.chapter = passage.chapter
                passageFind.verse = passage.verse
            }
            


        }

        //debugger
        if (topic.passages_rendered) {
            document.getElementsByClassName(`passages ${topic.id}`)[0].innerHTML = ""
            Passage.renderPassages(topic)
        }


    }

    static editPassagesForm(topic) {
        
        if (topic.passages_rendered) {

        } else {
            
            Passage.getFetchPassages(topic)
        }
        
        
        let topic_passages = Passage.getExistingPassages(topic)
        
        document.getElementById('topicpassages').innerHTML += 
            `<div id=\"existing passages\"></div>`


        for (const passage of topic_passages) {
            document.getElementById('existing passages').innerHTML +=

            `<div id=\"existing passage ${passage.id}\">
                
                <label>Existing passage content</label><br>
                <textarea id=\"existing passage content ${passage.id}\" data-passage-id=\"${passage.id}\" style=\"width: 500px; height: 100px\">${passage.content}</textarea><br>
                <label>Book:</label><br>
                <input type=\"text\" id=\"existing passage book ${passage.id}\" data-passage-id=\"${passage.id}\" value=\"${passage.book}\"></input><br>
                <label>Chapter:</label><br>
                <input type=\"text\" id=\"existing passage chapter ${passage.id}\" data-passage-id=\"${passage.id}\" value=\"${passage.chapter}\"></input><br>
                <label>Verse:</label><br>
                <input type=\"text\" id=\"existing passage verse ${passage.id}\" data-passage-id=\"${passage.id}\" value=\"${passage.verse}\"></input><br><br>
            </div>
            `
        }
    }

    static getUpdatedPassagesForm(passages_attributes, topic) {
        

        let topic_passages = Passage.getExistingPassages(topic)

        for (const passage of topic_passages) {
            passages_attributes.push({
                
                content: document.getElementById(`existing passage content ${passage.id}`).value,
                book: document.getElementById(`existing passage book ${passage.id}`).value,
                chapter: document.getElementById(`existing passage chapter ${passage.id}`).value,
                verse: document.getElementById(`existing passage verse ${passage.id}`).value,
                passage_id: passage.id
            
            })
        }

        return passages_attributes

    }
}
