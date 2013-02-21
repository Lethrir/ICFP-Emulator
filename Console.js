var userConsole = {
	writeChar: function(val){
        var outputConsole = document.getElementById('console');
        if(outputConsole != undefined && outputConsole != null){
            outputConsole.innerText += String.fromCharCode(val);
        }
    },
    displayRegisters: function(a,b,c,d,e,f,g,h,p){
        document.getElementById('a').innerText = a;
        document.getElementById('b').innerText = b;
        document.getElementById('c').innerText = c;
        document.getElementById('d').innerText = d;
        document.getElementById('e').innerText = e;
        document.getElementById('f').innerText = f;
        document.getElementById('g').innerText = g;
        document.getElementById('h').innerText = h;
        document.getElementById('platters').innerText = p;
    },
    getChar: function(callback){
        var outputConsole = document.getElementById('console');
        //outputConsole.innerText += '_';
        document.onkeyup = function(event) {
            if(event.keyCode != 16) {
                outputConsole.innerText += '*';
                document.onkeyup = null;
                callback(event.keyCode);
            }
        };
    }
};