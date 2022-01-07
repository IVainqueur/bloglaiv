if(location.href.match(/https/)) location.href = "http:" + location.href.slice(6)


class blogCard{
    constructor (toLeft, title, summary, src, link){
        this.card = document.createElement('div')
        this.card.className = "Card"
        let img = document.createElement('img')
        img.src = src
        img.alt = "blogProf"
        let cardText = document.createElement('div')
        cardText.className = "CardText"
        //This is very risk!!!
        cardText.innerHTML = `<h3>${title}</h3>\n<p>${summary}</p>`

        //appending
        this.card.appendChild(img)
        this.card.appendChild(cardText)
        document.querySelector('#Blogs').appendChild(this.card)
        if(!toLeft){
            this.card.style.gridTemplateColumns = "1fr 150px"
            this.card.children[1].style.gridRowStart = "1"
            img.style.transform = "translate(20px, -20px)"
        }
        
        this.listen(link)
    }
    listen(link){
        this.card.addEventListener("click", ()=>{
            // console.log(link)
            location.href = `http://bloglaiv.herokuapp.com/post/${link}`
        })
    }
}


let toLeft = true

const getBlogSummaries = ()=>{
    $.ajax({
        url: "http://bloglaiv.herokuapp.com/getSummaries",
        method: "GET",
        success: (res)=>{
            if("#Error") return alert('Something went wrong mn...')
            appendBlogs(res)
        }
    })
}

const appendBlogs = (theBlogs)=>{
    for(let one of theBlogs){
        new blogCard(toLeft, one.title, one.content.slice(0, 100) + '...', one.profileLink, one._id)
        // toLeft = (toLeft) ? false : true
    }
}

const getPosts = ()=>{
    console.log("called")
    $.ajax({
        url: "http://bloglaiv.herokuapp.com/getPosts",
        method: "get",
        success: (res)=>{
            console.log(res)
            appendBlogs(res)
        },
        error: (err)=>{
            console.log(err)
        }
    })
}

getPosts()

const setLinks = ()=>{
    let theClickables = [["#HomeBTN", "http://bloglaiv.herokuapp.com"], ["#ComposeBTN", "http://bloglaiv.herokuapp.com/compose"]]
    for(let one of theClickables){
        document.querySelector(one[0]).addEventListener('click', ()=>{
            location.href = one[1]
        })
    }
}
setLinks()