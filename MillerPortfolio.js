//SOURCE: CLARK MILLER
//VERSION 1.1 
//NOTES: MADE parseRepos() into a recursive function instead of a loop so that it could properly wait for getJSONAsync

//ENSURE YOU ENTER YOUR ENTER TOKEN OR ELSE IT WON'T WORK
const token = "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";

var jObject;    //Main object which will hold everything along with the main link

function JsObject(url){
    this.obj = new Object();
    //URL for the request you'll make with getJSONAsync
    this.url = url;
}

JsObject.prototype.getJSONAsync = function(url, _callback){
    //Used so the nested function doesn't get confused
    var self = this;
    var request = new XMLHttpRequest();
    request.onload = function(){
        console.log("Loaded");
        if (request.status === 200){
            self.obj = JSON.parse(request.responseText);
            //Calls the function entered into the parameter
            _callback();
        }
    }
    request.open("GET", self.url, true);
    //PINGS THE SERVER USING THE TOKEN TO ACCESS THE API
    request.setRequestHeader('Authorization', 'Bearer ' + token); // setting the Authorization header with the token
    request.send();
}

function createCard(object, contentsObject){
    //*********************************************
    //THESE ARE THE ELEMENTS I CHOSE TO CREATE AND MODIFY WITH THE DATA
    //IF YOU DO CONSOLE.LOG(jObject) YOU CAN SEE OTHER POSSIBLE ATTRIBUTES
    var postsDiv = document.getElementById("posts");
    var cardDiv = document.createElement("div");
    var title = document.createElement("h1");
    var description = document.createElement("p");//Done
    var image = document.createElement("img");//Done
    var link = document.createElement("a");//Done
    //*********************************************
    //Makes the link open in a new tab when you set target to _blank
    link.target = "_blank";
    link.href = object.clone_url;
    link.textContent = "Repo Link";

    //DELETE THIS AND THE LOWER LOOP IF YOU CARE NOT TO INCLUDE AN IMAGE
    //Default image if it can't find the 'Screenshot.png' file
    image.src = "https://upload.wikimedia.org/wikipedia/commons/5/5a/Black_question_mark.png";

    for(var i = 0; i < contentsObject.obj.length; i++){
        //If it finds a file in the repos contents folder named 'Screenshot.png', it will
        //Assign the downloadable url to the src for image
        if(contentsObject.obj[i].name === "Screenshot.png"){
            image.src = contentsObject.obj[i].download_url;
            //Breaks out when it finds the 
            break;
        }
    }

    //Sets title of card to the object name
    title.textContent = object.name;

    //Sets description of the text content to the description paragraph
    description.textContent = object.description;

    //Adds the card to the 'post' class so they can be styled with css all at once
    cardDiv.classList.add("post");
    //Appends attributes to card
    cardDiv.appendChild(title);
    cardDiv.appendChild(description);
    cardDiv.appendChild(image);
    cardDiv.appendChild(link);

    //Appends card to body
    postsDiv.appendChild(cardDiv);
}

function parseRepos(index){
    //Iterates through each repo, creating a card for each of them
    if(index === jObject.obj.length){
        return;
    }
    //Inner function that is called when getJSONAsync finished
    innerCall = function(){
        //Creates all the elements and adds them to DO
        //console.log(object);
        console.log(contentObject.url);
        createCard(object, contentObject);

        // Call the recursive function for the next index
        parseRepos(index + 1, jObject);
    }
    //Simply a shorthand for jObject.obj[i] 
    var object = jObject.obj[index];
    //CREATES THE URL FOR THE CONTENT OBJECT, I USED SUBSTRING BECUASE THE LINK THE API 
    //GAVE CONTAINED JUNK AT THE END
    var contentUrl = object.contents_url.substring(0, object.contents_url.length - 8)
    
    //Creates a new object only for the content, ie) index.html, Screenshot.html, project.css
    contentObject = new JsObject(contentUrl);
    console.log(contentObject.url);
    contentObject.getJSONAsync(contentObject.url, innerCall);
}

function getDataAsync(){
    //REPLACE MY USERNAME WITH YOURS!!! ELSE IT WON'T WORK
    const url = "https://api.github.com/users/DevClarkMiller/repos";

    jObject = new JsObject(url);

    //Is only called once the getJSONAsync is finished!
    printInfo = function(){
        console.log(jObject.obj);
        parseRepos(0);
    }
    jObject.getJSONAsync(url, printInfo);
}