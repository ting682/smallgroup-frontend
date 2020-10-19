//const {convertHtmlToDelta} = require('/node_modules/');

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
            `
                <div class=\"card article\">
                    <div class=\"card-content\">
                        <div class=\"media\">
                            <div class=\"media-content has-text-left\" id=\"topic ${this.id}\">
                                <h2 class=\"title\">${this.title}</h2>
                                <button class=\"button is-primary\" id=\"topicedit${this.id}\">Edit topic</button>
                                <p>By: ${this.name}</p>
                                <p>Updated: ${this.localtime}</p>
                                <div class=\"subtitle\" id=\"topiccontent${this.id}\"></div>
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

        

        //
            // let quillTopic = new Quill(`#topiccontent${this.id}`)
            // quillTopic.setContents(this.content)
            
            //document.getElementById(`topiccontent${this.id}`).innerHTML = quillTopic.root.innerHTML
        //} else {
        //    debugger
        //    document.getElementById(`topiccontent${this.id}`).innerHTML = this.content
        //}
        document.getElementById(`topiccontent${this.id}`).innerHTML = this.content
    }



    static renderTopicPage() {
        document.body.innerHTML = 
            `

            <section class=\"articles\">
                <div class=\"column is-8 is-offset-2\" id=\"feed\">
                    <div class=\"card article\">
                        <div class=\"card-content\">
                            
                            
                            <button class=\"button is-primary\" id=\"addtopic\">Add topic</button>
                        </div>
                    </div>
                </div>
            </section>
            
            `
            document.body.innerHTML += 
            `<div class=\"modal\">
            <div class=\"modal-background\" style=\"\"></div>
                    <div class="modal-card" style=\"background-color: white\">
                        <section class="modal-card-body" >

                        </section>
                    </div>
                </div>
            </div>`


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
            Topic.addTopic()

            Topic.addEditListener(Topic.instances)
        })

    }

    static addTopic(){
        


        document.getElementById('addtopic').addEventListener("click", () => {
            //debugger
            Topic.renderNewTopic()
            
            
            document.getElementsByClassName('modal')[0].className = 'modal is-active'
            
            document.getElementsByClassName('modal-background')[0].addEventListener("click", () => {
                
                document.getElementsByClassName('modal is-active')[0].className = 'modal'
                Topic.addTopic()
            })

            //debugger
            document.getElementsByClassName('ql-video')[0].addEventListener("click", () => {
                document.getElementsByClassName('ql-tooltip')[0].style = "top: 30px; left: 0px"
            }) 
        })

        //debugger
        
 
    }

    static renderNewTopic() {
        document.getElementsByClassName('modal-card-body')[0].innerHTML = 
            `
                <label><strong>Title</strong></label><br>
                <input type=\"text\" name=\"title\" id=\"newtitle\"></input><br><br>
                <div id=\"editor\" style=\"height: 375px\">
                </div><br>
                <button class=\"button is-primary\" id=\"addpassage\">Add passage</button><br><br>
                <div id=\"topicpassages\"></div>
                <button class=\"button is-primary\" id=\"submittopic\">Submit topic</button>
            `
        
            Topic.quill = new Quill('#editor', {
                modules: {
                  toolbar: [
                    [{ 'font': [] }, { 'size': [] }],
                    [ 'bold', 'italic', 'underline', 'strike' ],
                    [{ 'color': [] }, { 'background': [] }],
                    [{ 'script': 'super' }, { 'script': 'sub' }],
                    [{ 'header': '1' }, { 'header': '2' }, 'blockquote', 'code-block' ],
                    [{ 'list': 'ordered' }, { 'list': 'bullet'}, { 'indent': '-1' }, { 'indent': '+1' }],
                    [ 'direction', { 'align': [] }],
                    [ 'link', 'image', 'video', 'formula' ],
                    [ 'clean' ]]
                },
                placeholder: '',
                theme: 'snow'  // or 'bubble'
              });

            // document.getElementsByClassName('ql-video').addEventListener('click', () => {

            // })
            Topic.addPassageForm()
            Topic.postFetchNewTopic()
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

    static postFetchNewTopic() {
        
        document.getElementById('submittopic').addEventListener("click", (event) => {
            console.log("submitted")
            
            
            //debugger

            let newPassagesForTopic = Topic.getNewPassagesForm()

            let configObj = {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                
                body: JSON.stringify({
                    
                    topic: {
                        title: document.getElementById('newtitle').value,
                        //content: "hello",
                        content: Topic.quill.root.innerHTML,
                        passages_attributes: newPassagesForTopic,
                        user_id: "1"
                    }   
                    
                })
            }

            fetch(`${baseUrl}/users/1/topics`, configObj)
            .then(resp => resp.json())
            .then(function(data) {
                
                

            })
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

    static addEditListener(topic_instances) {
        
        for (const topic of topic_instances) {
            document.getElementById(`topicedit${topic.id}`).addEventListener("click", (event) => {

                document.getElementsByClassName('modal-card-body')[0].innerHTML = 
                `
                    <label><strong>Title</strong></label><br>
                    <input type=\"text\" name=\"title\" id=\"newtitle\" value=\"${topic.title}\"></input><br><br>
                    <div id=\"editor\" style=\"height: 375px\">
                    </div><br>
                    <button class=\"button is-primary\" id=\"addpassage\">Add passage</button><br><br>
                    <div id=\"topicpassages\"></div>
                    <button class=\"button is-primary\" id=\"submittopic\">Submit topic</button>
                `
            
                Topic.quill = new Quill('#editor', {
                    modules: {
                      toolbar: [
                        [{ 'font': [] }, { 'size': [] }],
                        [ 'bold', 'italic', 'underline', 'strike' ],
                        [{ 'color': [] }, { 'background': [] }],
                        [{ 'script': 'super' }, { 'script': 'sub' }],
                        [{ 'header': '1' }, { 'header': '2' }, 'blockquote', 'code-block' ],
                        [{ 'list': 'ordered' }, { 'list': 'bullet'}, { 'indent': '-1' }, { 'indent': '+1' }],
                        [ 'direction', { 'align': [] }],
                        [ 'link', 'image', 'video', 'formula' ],
                        [ 'clean' ]]
                    },
                    placeholder: '',
                    theme: 'snow'  // or 'bubble'
                  });

                              
                document.getElementsByClassName('modal')[0].className = 'modal is-active'
                
                document.getElementsByClassName('modal-background')[0].addEventListener("click", () => {
                    
                    document.getElementsByClassName('modal is-active')[0].className = 'modal'
                    Topic.addTopic()
                })

                //debugger
                document.getElementsByClassName('ql-video')[0].addEventListener("click", () => {
                    document.getElementsByClassName('ql-tooltip')[0].style = "top: 30px; left: 0px"
                }) 
                //debugger
                document.getElementsByClassName('ql-editor')[0].innerHTML = topic.content
                Topic.patchFetchNewTopic(topic)
            })
        }

        
        
    }


    static patchFetchNewTopic(topic) {
        
        document.getElementById('submittopic').addEventListener("click", (event) => {
            console.log("submitted")
            
            
            //debugger

            let newPassagesForTopic = Topic.getNewPassagesForm()

            let configObj = {
                method: "PATCH",
                headers: {
                    'Content-Type': 'application/json'
                },
                
                body: JSON.stringify({
                    
                    topic: {
                        title: document.getElementById('newtitle').value,
                        //content: "hello",
                        content: Topic.quill.root.innerHTML,
                        passages_attributes: newPassagesForTopic,
                        user_id: "1"
                    }   
                    
                })
            }

            fetch(`${baseUrl}/users/1/topics/${topic.id}`, configObj)
            .then(resp => resp.json())
            .then(function(data) {
                
                

            })
        })
    }
}

