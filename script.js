window.onload = function(){
    instantInfo();
}

function instantInfo(){
    //my profile to be shown on the home page
    //c659103ba8714b8dbaa1c83634bc4d74
    fetch("https://cors-anywhere.herokuapp.com/https://sessionserver.mojang.com/session/minecraft/profile/966ad6752b3a4de68e961b4c340d8fb3")
    .then(response => response.json())
    .then(data => displayProfile(data, "player"));

    //display 5 or so servers
    //Hypixel
    fetch("https://cors-anywhere.herokuapp.com/https://mcapi.xdefcon.com/server/mc.hypixel.net/full/json")
    .then(response => response.json())
    .then(data => displayServer("servers", data, "Hypixel", "mc.hypixel.net"));

    //PvP Land
    fetch("https://cors-anywhere.herokuapp.com/https://mcapi.xdefcon.com/server/pvp.land/full/json")
    .then(response => response.json())
    .then(data => displayServer("servers", data, "PvP Land", "pvp.land"));

    //Purple Prison
    fetch("https://cors-anywhere.herokuapp.com/https://mcapi.xdefcon.com/server/prisonfun.co/full/json")
    .then(response => response.json())
    .then(data => displayServer("servers", data, "Purple Prison", "prisonfun.co"));

    //FallenKingdom
    fetch("https://cors-anywhere.herokuapp.com/https://mcapi.xdefcon.com/server/play.fallenkingdom.co/full/json")
    .then(response => response.json())
    .then(data => displayServer("servers", data, "Fallen Kingdom", "play.fallenkingdom.net"));

    //Bedwars Practice
    fetch("https://cors-anywhere.herokuapp.com/https://mcapi.xdefcon.com/server/bedwarspractice.club/full/json")
    .then(response => response.json())
    .then(data => displayServer("servers", data, "Bedwars Practice", "bedwarspractice.club"));
}

function search(){
    searchResults("on");
    let search = document.getElementById("searchbar").value;
    document.getElementById("searchbar").value = "";
    document.getElementById("searchResult").innerHTML = "";
    let url = "https://cors-anywhere.herokuapp.com/https://sessionserver.mojang.com/session/minecraft/profile/";
    let URL = "https://cors-anywhere.herokuapp.com/https://api.mojang.com/users/profiles/minecraft/"
    let serverURL = "https://cors-anywhere.herokuapp.com/https://mcapi.xdefcon.com/server/";
    let badSearch = "false";
    //server search
    //working
    if(search.includes(',')){
        search = search.replaceAll(' ','');
        let location = search.search(',');
        let name = search.slice(0, location);
        let ip = search.slice(location + 1, search.length);
        serverURL += ip;
        serverURL += "/full/json";
        name.toLowerCase();
        let firstLetter = name.charAt(0);
        firstLetter = firstLetter.toUpperCase();
        name = name.replace(name.charAt(0), firstLetter);
        fetch(serverURL)
        .then(function(response){
            console.log(response);
            return response.json();
        })
        .then(function(data){
            console.log(data);
            if(data.serverStatus == "offline"){
                invalidSearch();
            } else {
                displayServer("searchResult", data, name, ip)
            }
        });

    //player uuid search
    //not working
    } else if(search.length > 16 && search.length < 37){
        search.replace('-','');
        url += search;
        
        fetch(url)
        .then(function(response){
            if (response.status != 400){
                return response.json();
            }else {
                return null;
            }
        })
        .then(function(data){
            if (data != null){
                displayProfile(data, "searchResult")
            } else {
                invalidSearch();
            }
        });

    //player username search
    //working
    } else if(search.length < 17){
        let valid = "true";
        URL += search;
            fetch(URL)
            .then(function(response){
                if (response.status != 204){
                    return response.json();
                }else {
                    return null;
                }
            })
            .then(function(data){
                if (data != null) {
                    url += data.id;
                    url.replace('"','');
                    fetch(url)
                    .then(response => response.json())
                    .then(data => displayProfile(data, "searchResult"));
                } else {
                    invalidSearch();
                }
            })
    } else{
        invalidSearch();
    }
}

function displayServer(location, data, sName, sIp){
    let main = document.getElementById(location);

    if(data.serverStatus == "online"){
        //create server box
        let div = document.createElement("div");
        div.id = "serverHolder";

        //add server icon
        let icon = document.createElement("img");
        icon.id = "serverIcon";
        icon.src = data.icon;
        icon.alt = "server icon";
        div.appendChild(icon);

        //display server name
        let name = document.createElement("div");
        name.id = "serverName"
        name.classList.add("title");
        name.innerHTML = sName;
        div.appendChild(name);

        //display server ip
        let ip = document.createElement("div");
        ip.id = "serverIp";
        ip.classList.add("text");
        ip.innerHTML = "Ip : " + sIp;
        div.appendChild(ip);

        //display required version
        let version  = document.createElement("div");
        version.id = "serverVersion";
        version.classList.add("text");
        version.innerHTML = "Version : " + data.version;
        div.appendChild(version);

        //display player count
        let player = document.createElement("div");
        player.id = "serverPlayers";
        player.classList.add("text");
        player.innerHTML = "Players : " + data.players + "/" + data.maxplayers;
        div.appendChild(player);

        //display server status
        let status = document.createElement("div");
        status.id = "serverStatus";
        status.classList.add("text");
        status.innerHTML = "Status : " + data.serverStatus;
        div.appendChild(status);

        //append to main
        main.appendChild(div);
    }

}

function displayProfile(data, location){
    //decode base 64 string and convert to JSON
    let properties = atob(data.properties[0].value);
    let textures = JSON.parse(properties);
    
    //define div to fill
    let main = document.getElementById(location);
    let div = document.createElement("div");
    div.id = "playerHolder";

    //get player skin and display
    let skinURL = "https://crafatar.com/renders/body/" + textures.profileId + "?overlay";
    skinURL.replace('"','');
    let skin = document.createElement("img");
    skin.id = "playerSkin";
    skin.src = skinURL;
    skin.alt = "image of players character";
    div.appendChild(skin);

    //get player name and display
    let name = document.createElement("div");
    name.id = "playerName";
    name.classList.add("title");
    name.innerHTML = textures.profileName;
    div.appendChild(name);

    //get player uuid and display
    let uuidDiv = document.createElement("div");
    uuidDiv.id = "playerUUID";
    uuidDiv.classList.add("title");
    uuidDiv.innerHTML = textures.profileId;
    div.appendChild(uuidDiv);

    //get player previous names and display
    let uuid = textures.profileId;
    uuid.replace('"','')
    let url = "https://cors-anywhere.herokuapp.com/https://api.mojang.com/user/profiles/";
    url += uuid;
    url += "/names";
    fetch(url)
    .then(response => response.json())
    .then(function(data){
        if(data.length != 1){
            let prevNamesDiv = document.createElement("div");
            prevNamesDiv.id = "playerPrevNames";
            prevNamesDiv.classList.add("text");
            let list = document.createElement("ol");
            for(let i = 0; i < data.length; i++){
                list.innerHTML += "<li>" + data[i].name + "</li>"
            }
            prevNamesDiv.appendChild(list);
            div.appendChild(prevNamesDiv);
        }
        

    });

    main.appendChild(div);
     
}

function instructions(choice){
    if(choice == "on"){
        document.getElementById("instructions").style.display = "flex";
    }
    if(choice == "off"){
        document.getElementById("instructions").style.display = "none";
    }
}

function searchResults(choice){
    if(choice == "on"){
        document.getElementById("lightbox").style.display = "flex";
    }
    if(choice == "off"){
        document.getElementById("lightbox").style.display = "none";
    }
}

function invalidSearch(){
    let main = document.getElementById("searchResult");
    let div = document.createElement("div");

    div.innerHTML = "Your search was invalid, please make sure there are no spelling mistakes or invalid characters in your search.";
    div.classList.add("title");

    main.appendChild(div);
}

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js');
  }