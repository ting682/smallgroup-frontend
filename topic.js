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
            `<form>
                <label><strong>Title</strong></label><br>
                <input type=\"text\" name=\"title\"></input><br><br>
                <div id=\"editor\" style=\"height: 375px\">
                </div><br>
                <button class=\"button is-primary\" id=\"addpassage\">Add passage</button><br><br>
                <div id=\"topicpassages\"></div>
                <input class=\"button is-primary\" type=\"submit\" value=\"Submit topic\" id=\"submittopic\"></input>
            </form>`
            
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
    }

    static addPassageForm() {
        document.getElementById('addpassage').addEventListener("click", () => {

            
            document.getElementById('topicpassages').innerHTML +=

                ``
        })
    }
}

