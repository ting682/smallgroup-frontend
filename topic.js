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
                                <h2 class=\"title\" id=\"topic ${this.id} title\">${this.title}</h2>
                                <button class=\"button is-primary\" id=\"topicedit${this.id}\">Edit topic</button>
                                <p id=\"topic ${this.id} name\">By: ${this.name}</p>
                                <p id=\"topic ${this.id} localtime\">Updated: ${this.localtime}</p>
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
            Topic.renderNewTopicForm()
            
            
            document.getElementsByClassName('modal')[0].className = 'modal is-active'
            
            document.getElementsByClassName('modal-background')[0].addEventListener("click", () => {
                
                if (document.getElementsByClassName('modal is-active')[0] === undefined) {

                } else {
                    document.getElementsByClassName('modal is-active')[0].className = 'modal'
                }
                
                //Topic.addTopic()
            })

            //debugger
            document.getElementsByClassName('ql-video')[0].addEventListener("click", () => {
                document.getElementsByClassName('ql-tooltip')[0].style = "top: 30px; left: 0px"
            }) 
        })

        //debugger
        
 
    }

    static renderNewTopicForm() {
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
            Passage.addPassageForm()
            Topic.postFetchNewTopic()
    }



    static postFetchNewTopic() {
        
        document.getElementById('submittopic').addEventListener("click", (event) => {
            console.log("submitted")
            
            
            //debugger

            let newPassagesForTopic = Passage.getNewPassagesForm()

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
            .then(function(topic_data) {
                

                document.getElementsByClassName('modal is-active')[0].className = 'modal'
                //debugger
                let new_topic = new Topic (
                    topic_data['data']['id'], 
                    topic_data['data']['attributes']['title'], 
                    topic_data['data']['attributes']['content'], 
                    topic_data['data']['attributes']['localTime'], 
                    topic_data['data']['attributes']['name'], 
                    topic_data['data']['attributes']['passage_ids'], 
                    topic_data['data']['attributes']['comment_ids'])
                
                Topic.instances.push(new_topic)
                new_topic.renderTopic()
                Comment.addShowCommentListener([new_topic])

                Passage.addShowPassageListener([new_topic])
                

                Topic.addEditListener([new_topic])
            })
        })
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
                        
                        if (document.getElementsByClassName('modal is-active')[0] === undefined) {

                        } else {
                            document.getElementsByClassName('modal is-active')[0].className = 'modal'
                        }
                        
                        //Topic.addTopic()
                    })
    
                    //debugger
                    
                    document.querySelector("button.ql-video").addEventListener("click", () => {
                        //debugger
                        document.getElementsByClassName('ql-tooltip')[0].style = "top: 30px; left: 0px"
                    }) 
                    //debugger
                    document.getElementsByClassName('ql-editor')[0].innerHTML = topic.content
                    Passage.addPassageForm()
                    Passage.editPassagesForm(topic)
                    topic.patchFetchNewTopic()
    
                    
                })
            }
    
        
    }


    patchFetchNewTopic() {
        
        document.getElementById('submittopic').addEventListener("click", (event) => {
            
            
            
            //debugger

            let newPassagesForTopic = Passage.getNewPassagesForm()

            let allPassagesForTopic = Passage.getUpdatedPassagesForm(newPassagesForTopic, this)

            let configObj = {
                method: "PATCH",
                headers: {
                    'Content-Type': 'application/json'
                },
                
                body: JSON.stringify({
                    
                    topic: {
                        title: document.getElementById('newtitle').value,
                        content: Topic.quill.root.innerHTML,
                        passages_attributes: allPassagesForTopic,
                        user_id: "1"
                    }   
                    
                })
            }

            fetch(`${baseUrl}/users/1/topics/${this.id}`, configObj)
            .then(resp => resp.json())
            .then(function(topic_data) {
                
                //debugger
                let updatedTopic = Topic.instances.find(topic => 
                    topic.id === topic_data['data']['id']
                )
                updatedTopic.updateRenderTopic(topic_data)
                
                
                //debugger
                Passage.updatePassages(topic_data['data']['attributes']['passages'], updatedTopic)
                
                console.log("updated");
            })
        })
    }

    updateRenderTopic(topic_data) {
        
        //debugger

        document.getElementsByClassName('modal is-active')[0].className = 'modal'



        this.title = topic_data['data']['attributes']['title']
        this.content = topic_data['data']['attributes']['content']
        this.localtime = topic_data['data']['attributes']['localTime']
        this.passage_ids = topic_data['data']['attributes']['passage_ids']
        this.comment_ids = topic_data['data']['attributes']['comment_ids']

        document.getElementById(`topic ${this.id} title`).innerHTML = this.title
        document.getElementById(`topic ${this.id} localtime`).innerHTML = this.localtime
        document.getElementById(`topiccontent${this.id}`).innerHTML = this.content

    }

    
    
}

