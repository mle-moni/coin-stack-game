function brb() {
	sessionStorage.setItem("goTo", location.pathname);
	location.replace("/login");
}

function genScope() {
	let game = false;
	const innerSocket = io.connect(location.origin);

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
        
        game.canvas.onclick = (e) => {
            const click = {
                x: Math.floor(e.layerX / game.SQUARE_WIDTH),
                y: Math.floor(e.layerY / game.SQUARE_WIDTH)
            };
            switch (G_MODE) {
                case "add":
                    game.socket.emit("turn", G_MODE, click);
                    break;
                case "split":
                    game.socket.emit("turn", G_MODE, click);
                    break;
                default:
                    game.socket.emit("turn", "add", click);
                    break;
            }
        }
		return game;
    }
    
    // sockets events

	innerSocket.on("getId", (id, psd) => {
        game = genGame(id, psd, innerSocket);
        console.log("waiting");
        innerSocket.emit("wait_opponent");
    });
    
    innerSocket.on("match", (p1, p2, map) => {
        console.log(`Match found : ${p1} VS ${p2}`);
        if (game) {
            game.arr = map;
        }
    });
    innerSocket.on("reco", (p1, p2, map) => {
        console.log(`Reconnection : ${p1} VS ${p2}`);
        if (game) {
            game.arr = map;
        }
    });

    innerSocket.on("update", (map) => {
        if (game) {
            game.arr = map;
        }
    });

    innerSocket.on("turn", (actionsCount) => {
        console.log("turn "+ actionsCount);
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