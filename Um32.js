var Um32 = {
	_register: [0,0,0,0,0,0,0,0],
	_platters: [],
	_finger: 0,
    _running: false,
    _debug: true,
    _cmdA: 0,
    _cmdB: 0,
    _cmdC: 0,
    _clock: 0,
    
	_op0: function(){
		// Conditional Move
		if(Um32._register[Um32._cmdC] !== 0)
		{
			Um32._register[Um32._cmdA] = Um32._register[Um32._cmdB];
		}
	},

	_op1: function(){
		// Array index
        Um32._register[Um32._cmdA] = Um32._platters[Um32._register[Um32._cmdB]][Um32._register[Um32._cmdC]];
	},

	_op2: function(){
		// Array ammendment
        Um32._platters[Um32._register[Um32._cmdA]][Um32._register[Um32._cmdB]] = Um32._register[Um32._cmdC];
	},

	_op3: function(){
		// Addition
		Um32._register[Um32._cmdA] = (Um32._register[Um32._cmdB] + Um32._register[Um32._cmdC]) % Math.pow(2,32);
	},

	_op4: function(){
		// Multiplication
		Um32._register[Um32._cmdA] = (Um32._register[Um32._cmdB] * Um32._register[Um32._cmdC]) % Math.pow(2,32);
	},

	_op5: function(){
		// Division
        if(Um32._register[Um32._cmdC] > 0){
            var res = Um32._register[Um32._cmdB]>>>0 / Um32._register[Um32._cmdC]>>>0;
            Um32._register[Um32._cmdA] = res>>>0;
        } else {
            Um32._register[Um32._cmdA] = 0;
        }
	},

	_op6: function(){
		// Not-And
        Um32._register[Um32._cmdA] = ~(Um32._register[Um32._cmdB]>>>0 & Um32._register[Um32._cmdC]>>>0);
	},

	_op7: function(){
		// Halt
        Um32._running = false;
        alert('halted at clock ' + Um32._clock);
	},

	_op8: function(){
		// Allocation
        var maxIndex = Um32._platters.length;
        var index;
        for(index = 0; index < maxIndex; index++){
            if(Um32._platters[index] === null){
                break;
            }
        }
        Um32._platters[index] = [];
        for(var i = 0; i < Um32._register[Um32._cmdC]; i++){
            Um32._platters[index][i] = 0;
        }
        Um32._register[Um32._cmdB] = index;        
	},

	_op9: function(){
		// Abandonment
        Um32._platters[Um32._register[Um32._cmdC]] = null;
	},

	_op10: function(){
		// Output
        userConsole.writeChar(Um32._register[Um32._cmdC]);
	},
    
	_op11: function(){
		// Input
        //var res = prompt();
        //Um32._register[Um32._cmdC] = res.charCodeAt(0);
        Um32._running = false;
        userConsole.getChar(function(e){
            Um32._register[Um32._cmdC] = e;
            Um32._running = true;
            Um32._opDone();
        });
	},

	_op12: function(){
		// Load Program if required
        if(Um32._register[Um32._cmdB] > 0){
            Um32._platters[0] = Um32._platters[Um32._register[Um32._cmdB]].slice(0);
        }
        // Jump
        Um32._finger = Um32._register[Um32._cmdC];
	},

	_op13: function(){
		// Orthography
        var currentPlatter = Um32._platters[0][Um32._finger-1];
        Um32._cmdA = (currentPlatter>>>25)&7;
        var val = currentPlatter>>>0 & (Math.pow(2,25)-1);
        Um32._register[Um32._cmdA] = val;
	},
    
    _spin: function(){
        var currentPlatter = Um32._platters[0][Um32._finger];
        Um32._finger++;
        Um32._clock++;
        var instruction = currentPlatter>>>28;
        Um32._cmdC = currentPlatter>>>0 & 7>>>0;
        Um32._cmdB = (currentPlatter>>>3 & 7);
        Um32._cmdA = (currentPlatter>>>6 & 7);
        var op = Um32._map[instruction];
        if(op == undefined){
            alert('Undefined op');
            Um32._running = false;
        } else {
            op();
            Um32._displayRegisters();
        }
        Um32._opDone();
    },
    
    _opDone: function(){
        if(Um32._running) { // && (!Um32._debug || confirm('Continue?'))){
            //alert('Run ' + instruction);
            if(Um32._debug && (Um32._clock % 1000 == 0)) {
                setTimeout(Um32._spin, 0);
            } else {
                Um32._spin();
            }
        }
    },
    
    _map: [],
    
    start: function(rom){
        Um32._clock = 0;
        Um32._finger = 0;
        Um32._loadRom(rom);
        //Um32._platters[0] = rom;
        Um32._register[0] = 0;
        Um32._register[1] = 0;
        Um32._register[2] = 0;
        Um32._register[3] = 0;
        Um32._register[4] = 0;
        Um32._register[5] = 0;
        Um32._register[6] = 0;
        Um32._register[7] = 0;
        Um32._running = true;
        Um32._spin();
    },
    
    _loadRom: function(rom) {    
        Um32._platters = [];
        Um32._platters[0] = [];
        // TODO: This needs to bit shift 32 bits at a time adding a new platter each time...
        var i = 0;
        var j = 0;
        while(i < rom.length) {
            var a = rom.charCodeAt(i);
            var b = rom.charCodeAt(i+1);
            var c = rom.charCodeAt(i+2);
            var d = rom.charCodeAt(i+3);
            var as = a<<24>>>0;
            var bs = b<<16>>>0;
            var cs = c<<8>>>0;
            var ds = d>>>0;
            var res = (as|bs|cs|ds)>>>0;
            Um32._platters[0][j] = res;
            i = i + 4;
            j++;
        }
    },
    
    _displayRegisters: function() {
        userConsole.displayRegisters(
            Um32._register[0],
            Um32._register[1],
            Um32._register[2],
            Um32._register[3],
            Um32._register[4],
            Um32._register[5],
            Um32._register[6],
            Um32._register[7],
            Um32._platters.length
        );
    }

};

Um32.
    _map = [
        Um32._op0,
        Um32._op1,
        Um32._op2,
        Um32._op3,
        Um32._op4,
        Um32._op5,
        Um32._op6,
        Um32._op7,
        Um32._op8,
        Um32._op9,
        Um32._op10,
        Um32._op11,
        Um32._op12,
        Um32._op13
    ];