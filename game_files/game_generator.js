function brb() {
	sessionStorage.setItem("goTo", location.pathname);
	location.replace("/login");
}

function genScope() {
    let game = false;
	const innerSocket = io.connect(location.origin);
    const searchButton = document.getElementById("searchOpponent");
    const gameCanvas = document.getElementById("canvas");

    gameCanvas.style.visibility = "hidden";    
    searchButton.style.left = (innerWidth / 2) - (searchButton.offsetWidth / 2) + "px";
    searchButton.style.top = (innerHeight / 2) - (searchButton.offsetHeight / 2) + "px";
    searchButton.style.visibility = "visible";

    searchButton.onclick = () => {
        innerSocket.emit("wait_opponent");
        searchButton.style.visibility = "hidden";
        document.getElementById("waitAnim").style.display = "block";
    }

	if (localStorage.getItem('psd')) {
		sessionStorage.setItem('psd', localStorage.getItem('psd'))
	}
	if (localStorage.getItem('passwd')) {
		sessionStorage.setItem('passwd', localStorage.getItem('passwd'))
	}
	const connectObj = {
		psd: sessionStorage.getItem('psd'),
		passwd: sessionStorage.getItem('passwd')
	};
	if (connectObj.psd !== null && connectObj.passwd !== null) {
		innerSocket.emit("connectemoistp", connectObj, "hard");
	} else {
        brb();
    }

	innerSocket.emit("genGame");
	function genGame(password, pseudo, ioSocket) {
	
		const game = new World(SQUARE_BY_LINE);
		game.password = password;
		game.pseudo = pseudo;
        game.socket = ioSocket;
        
		return game;
    }
    
    // sockets events

	innerSocket.on("getId", (id, psd) => {
        game = genGame(id, psd, innerSocket);
    });
    
    innerSocket.on("match", (p1, p2, map) => {
        console.log(`Match found : ${p1} VS ${p2}`);
        if (game) {
            game.arr = map;
        }
        searchButton.style.visibility = "hidden";
        document.getElementById("waitAnim").style.display = "none";
        document.getElementById("canvas").style.visibility = "visible";
    });
    innerSocket.on("reco", (p1, p2, map) => {
        console.log(`Reconnection : ${p1} VS ${p2}`);
        if (game) {
            game.arr = map;
        }
        searchButton.style.visibility = "hidden";
        document.getElementById("waitAnim").style.display = "none";
        document.getElementById("canvas").style.visibility = "visible";
    });

    innerSocket.on("update", (map) => {
        if (game) {
            game.arr = map;
        }
    });

    innerSocket.on("turn", (actionsCount) => {
        document.getElementById("actionDisplayer").innerHTML = "Actions restantes : " + actionsCount;
    });

    innerSocket.on("end_game", txt => {
        alert(txt);
        location.reload();
    });

	innerSocket.on("logAndComeBack", ()=>{
		sessionStorage.setItem("goTo", location.pathname);
		location.replace("/login");
	});

	innerSocket.on("MAJ", (txt)=>{
		alert(txt);
		location.reload();
    });
    

}