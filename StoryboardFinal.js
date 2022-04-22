(function (cjs, an) {

var p; // shortcut to reference prototypes
var lib={};var ss={};var img={};
lib.ssMetadata = [
		{name:"StoryboardFinal_atlas_1", frames: [[0,0,1689,1888]]},
		{name:"StoryboardFinal_atlas_2", frames: [[119,207,182,66],[0,423,182,66],[184,423,71,61],[257,423,71,61],[0,0,117,408],[119,332,306,89],[342,0,127,330],[119,0,221,205],[119,275,49,42],[471,0,39,79],[471,81,39,79],[471,162,39,79],[471,243,39,79],[427,332,67,109]]},
		{name:"StoryboardFinal_atlas_3", frames: [[0,0,1462,1948]]},
		{name:"StoryboardFinal_atlas_4", frames: [[0,0,1567,1773]]},
		{name:"StoryboardFinal_atlas_5", frames: [[0,0,1444,1875]]},
		{name:"StoryboardFinal_atlas_6", frames: [[0,0,1289,1621]]},
		{name:"StoryboardFinal_atlas_7", frames: [[0,637,791,1006],[793,637,480,1358],[1468,0,502,1294],[0,0,1466,635]]},
		{name:"StoryboardFinal_atlas_8", frames: [[1034,1613,341,240],[1250,1172,341,240],[1377,868,341,240],[1593,1110,341,240],[462,1110,415,235],[462,828,388,280],[1074,534,891,332],[1866,1352,178,416],[1593,1352,271,295],[880,828,152,979],[1720,868,310,214],[1034,1172,214,439],[1377,1649,219,281],[1034,868,341,302],[1598,1649,149,335],[880,1855,300,160],[0,1348,878,640],[462,0,610,826],[1074,0,918,532],[0,0,460,1346]]},
		{name:"StoryboardFinal_atlas_9", frames: [[0,0,2032,1451]]}
];


(lib.AnMovieClip = function(){
	this.actionFrames = [];
	this.ignorePause = false;
	this.currentSoundStreamInMovieclip;
	this.soundStreamDuration = new Map();
	this.streamSoundSymbolsList = [];

	this.gotoAndPlayForStreamSoundSync = function(positionOrLabel){
		cjs.MovieClip.prototype.gotoAndPlay.call(this,positionOrLabel);
	}
	this.gotoAndPlay = function(positionOrLabel){
		this.clearAllSoundStreams();
		var pos = this.timeline.resolve(positionOrLabel);
		if (pos != null) { this.startStreamSoundsForTargetedFrame(pos); }
		cjs.MovieClip.prototype.gotoAndPlay.call(this,positionOrLabel);
	}
	this.play = function(){
		this.clearAllSoundStreams();
		this.startStreamSoundsForTargetedFrame(this.currentFrame);
		cjs.MovieClip.prototype.play.call(this);
	}
	this.gotoAndStop = function(positionOrLabel){
		cjs.MovieClip.prototype.gotoAndStop.call(this,positionOrLabel);
		this.clearAllSoundStreams();
	}
	this.stop = function(){
		cjs.MovieClip.prototype.stop.call(this);
		this.clearAllSoundStreams();
	}
	this.startStreamSoundsForTargetedFrame = function(targetFrame){
		for(var index=0; index<this.streamSoundSymbolsList.length; index++){
			if(index <= targetFrame && this.streamSoundSymbolsList[index] != undefined){
				for(var i=0; i<this.streamSoundSymbolsList[index].length; i++){
					var sound = this.streamSoundSymbolsList[index][i];
					if(sound.endFrame > targetFrame){
						var targetPosition = Math.abs((((targetFrame - sound.startFrame)/lib.properties.fps) * 1000));
						var instance = playSound(sound.id);
						var remainingLoop = 0;
						if(sound.offset){
							targetPosition = targetPosition + sound.offset;
						}
						else if(sound.loop > 1){
							var loop = targetPosition /instance.duration;
							remainingLoop = Math.floor(sound.loop - loop);
							if(targetPosition == 0){ remainingLoop -= 1; }
							targetPosition = targetPosition % instance.duration;
						}
						instance.loop = remainingLoop;
						instance.position = Math.round(targetPosition);
						this.InsertIntoSoundStreamData(instance, sound.startFrame, sound.endFrame, sound.loop , sound.offset);
					}
				}
			}
		}
	}
	this.InsertIntoSoundStreamData = function(soundInstance, startIndex, endIndex, loopValue, offsetValue){ 
 		this.soundStreamDuration.set({instance:soundInstance}, {start: startIndex, end:endIndex, loop:loopValue, offset:offsetValue});
	}
	this.clearAllSoundStreams = function(){
		this.soundStreamDuration.forEach(function(value,key){
			key.instance.stop();
		});
 		this.soundStreamDuration.clear();
		this.currentSoundStreamInMovieclip = undefined;
	}
	this.stopSoundStreams = function(currentFrame){
		if(this.soundStreamDuration.size > 0){
			var _this = this;
			this.soundStreamDuration.forEach(function(value,key,arr){
				if((value.end) == currentFrame){
					key.instance.stop();
					if(_this.currentSoundStreamInMovieclip == key) { _this.currentSoundStreamInMovieclip = undefined; }
					arr.delete(key);
				}
			});
		}
	}

	this.computeCurrentSoundStreamInstance = function(currentFrame){
		if(this.currentSoundStreamInMovieclip == undefined){
			var _this = this;
			if(this.soundStreamDuration.size > 0){
				var maxDuration = 0;
				this.soundStreamDuration.forEach(function(value,key){
					if(value.end > maxDuration){
						maxDuration = value.end;
						_this.currentSoundStreamInMovieclip = key;
					}
				});
			}
		}
	}
	this.getDesiredFrame = function(currentFrame, calculatedDesiredFrame){
		for(var frameIndex in this.actionFrames){
			if((frameIndex > currentFrame) && (frameIndex < calculatedDesiredFrame)){
				return frameIndex;
			}
		}
		return calculatedDesiredFrame;
	}

	this.syncStreamSounds = function(){
		this.stopSoundStreams(this.currentFrame);
		this.computeCurrentSoundStreamInstance(this.currentFrame);
		if(this.currentSoundStreamInMovieclip != undefined){
			var soundInstance = this.currentSoundStreamInMovieclip.instance;
			if(soundInstance.position != 0){
				var soundValue = this.soundStreamDuration.get(this.currentSoundStreamInMovieclip);
				var soundPosition = (soundValue.offset?(soundInstance.position - soundValue.offset): soundInstance.position);
				var calculatedDesiredFrame = (soundValue.start)+((soundPosition/1000) * lib.properties.fps);
				if(soundValue.loop > 1){
					calculatedDesiredFrame +=(((((soundValue.loop - soundInstance.loop -1)*soundInstance.duration)) / 1000) * lib.properties.fps);
				}
				calculatedDesiredFrame = Math.floor(calculatedDesiredFrame);
				var deltaFrame = calculatedDesiredFrame - this.currentFrame;
				if((deltaFrame >= 0) && this.ignorePause){
					cjs.MovieClip.prototype.play.call(this);
					this.ignorePause = false;
				}
				else if(deltaFrame >= 2){
					this.gotoAndPlayForStreamSoundSync(this.getDesiredFrame(this.currentFrame,calculatedDesiredFrame));
				}
				else if(deltaFrame <= -2){
					cjs.MovieClip.prototype.stop.call(this);
					this.ignorePause = true;
				}
			}
		}
	}
}).prototype = p = new cjs.MovieClip();
// symbols:



(lib.CachedBmp_57 = function() {
	this.initialize(ss["StoryboardFinal_atlas_2"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_62 = function() {
	this.initialize(ss["StoryboardFinal_atlas_8"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_55 = function() {
	this.initialize(ss["StoryboardFinal_atlas_2"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_61 = function() {
	this.initialize(ss["StoryboardFinal_atlas_8"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_53 = function() {
	this.initialize(ss["StoryboardFinal_atlas_8"]);
	this.gotoAndStop(2);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_52 = function() {
	this.initialize(ss["StoryboardFinal_atlas_8"]);
	this.gotoAndStop(3);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_51 = function() {
	this.initialize(ss["StoryboardFinal_atlas_8"]);
	this.gotoAndStop(4);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_50 = function() {
	this.initialize(ss["StoryboardFinal_atlas_8"]);
	this.gotoAndStop(5);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_49 = function() {
	this.initialize(ss["StoryboardFinal_atlas_8"]);
	this.gotoAndStop(6);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_48 = function() {
	this.initialize(ss["StoryboardFinal_atlas_2"]);
	this.gotoAndStop(2);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_47 = function() {
	this.initialize(ss["StoryboardFinal_atlas_2"]);
	this.gotoAndStop(3);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_46 = function() {
	this.initialize(ss["StoryboardFinal_atlas_8"]);
	this.gotoAndStop(7);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_45 = function() {
	this.initialize(ss["StoryboardFinal_atlas_2"]);
	this.gotoAndStop(4);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_44 = function() {
	this.initialize(ss["StoryboardFinal_atlas_7"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_43 = function() {
	this.initialize(ss["StoryboardFinal_atlas_8"]);
	this.gotoAndStop(8);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_42 = function() {
	this.initialize(ss["StoryboardFinal_atlas_2"]);
	this.gotoAndStop(5);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_41 = function() {
	this.initialize(ss["StoryboardFinal_atlas_8"]);
	this.gotoAndStop(9);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_40 = function() {
	this.initialize(ss["StoryboardFinal_atlas_8"]);
	this.gotoAndStop(10);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_39 = function() {
	this.initialize(ss["StoryboardFinal_atlas_8"]);
	this.gotoAndStop(11);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_38 = function() {
	this.initialize(ss["StoryboardFinal_atlas_2"]);
	this.gotoAndStop(6);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_37 = function() {
	this.initialize(ss["StoryboardFinal_atlas_2"]);
	this.gotoAndStop(7);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_36 = function() {
	this.initialize(ss["StoryboardFinal_atlas_2"]);
	this.gotoAndStop(8);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_35 = function() {
	this.initialize(ss["StoryboardFinal_atlas_8"]);
	this.gotoAndStop(12);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_34 = function() {
	this.initialize(ss["StoryboardFinal_atlas_8"]);
	this.gotoAndStop(13);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_33 = function() {
	this.initialize(ss["StoryboardFinal_atlas_8"]);
	this.gotoAndStop(14);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_32 = function() {
	this.initialize(ss["StoryboardFinal_atlas_8"]);
	this.gotoAndStop(15);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_31 = function() {
	this.initialize(img.CachedBmp_31);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,2279,2015);


(lib.CachedBmp_30 = function() {
	this.initialize(ss["StoryboardFinal_atlas_7"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_29 = function() {
	this.initialize(ss["StoryboardFinal_atlas_8"]);
	this.gotoAndStop(16);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_28 = function() {
	this.initialize(img.CachedBmp_28);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,2280,1435);


(lib.CachedBmp_27 = function() {
	this.initialize(ss["StoryboardFinal_atlas_2"]);
	this.gotoAndStop(9);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_26 = function() {
	this.initialize(img.CachedBmp_26);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,2282,2027);


(lib.CachedBmp_25 = function() {
	this.initialize(ss["StoryboardFinal_atlas_3"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_24 = function() {
	this.initialize(ss["StoryboardFinal_atlas_8"]);
	this.gotoAndStop(17);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_23 = function() {
	this.initialize(img.CachedBmp_23);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,2280,1435);


(lib.CachedBmp_22 = function() {
	this.initialize(ss["StoryboardFinal_atlas_2"]);
	this.gotoAndStop(10);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_21 = function() {
	this.initialize(img.CachedBmp_21);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,2282,2027);


(lib.CachedBmp_20 = function() {
	this.initialize(ss["StoryboardFinal_atlas_1"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_19 = function() {
	this.initialize(img.CachedBmp_19);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,2280,1435);


(lib.CachedBmp_18 = function() {
	this.initialize(ss["StoryboardFinal_atlas_2"]);
	this.gotoAndStop(11);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_17 = function() {
	this.initialize(img.CachedBmp_17);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,2282,2027);


(lib.CachedBmp_16 = function() {
	this.initialize(ss["StoryboardFinal_atlas_4"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_15 = function() {
	this.initialize(img.CachedBmp_15);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,2280,1435);


(lib.CachedBmp_14 = function() {
	this.initialize(ss["StoryboardFinal_atlas_2"]);
	this.gotoAndStop(12);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_13 = function() {
	this.initialize(img.CachedBmp_13);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,2282,2027);


(lib.CachedBmp_12 = function() {
	this.initialize(ss["StoryboardFinal_atlas_6"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_60 = function() {
	this.initialize(ss["StoryboardFinal_atlas_9"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_59 = function() {
	this.initialize(ss["StoryboardFinal_atlas_2"]);
	this.gotoAndStop(13);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_58 = function() {
	this.initialize(img.CachedBmp_58);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,2278,2018);


(lib.CachedBmp_8 = function() {
	this.initialize(ss["StoryboardFinal_atlas_5"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_7 = function() {
	this.initialize(img.CachedBmp_7);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,2496,2024);


(lib.CachedBmp_6 = function() {
	this.initialize(ss["StoryboardFinal_atlas_7"]);
	this.gotoAndStop(2);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_5 = function() {
	this.initialize(ss["StoryboardFinal_atlas_8"]);
	this.gotoAndStop(18);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_4 = function() {
	this.initialize(img.CachedBmp_4);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,2496,2024);


(lib.CachedBmp_3 = function() {
	this.initialize(ss["StoryboardFinal_atlas_7"]);
	this.gotoAndStop(3);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_2 = function() {
	this.initialize(img.CachedBmp_2);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,2360,2024);


(lib.CachedBmp_1 = function() {
	this.initialize(ss["StoryboardFinal_atlas_8"]);
	this.gotoAndStop(19);
}).prototype = p = new cjs.Sprite();
// helper functions:

function mc_symbol_clone() {
	var clone = this._cloneProps(new this.constructor(this.mode, this.startPosition, this.loop, this.reversed));
	clone.gotoAndStop(this.currentFrame);
	clone.paused = this.paused;
	clone.framerate = this.framerate;
	return clone;
}

function getMCSymbolPrototype(symbol, nominalBounds, frameBounds) {
	var prototype = cjs.extend(symbol, cjs.MovieClip);
	prototype.clone = mc_symbol_clone;
	prototype.nominalBounds = nominalBounds;
	prototype.frameBounds = frameBounds;
	return prototype;
	}


(lib.replaybtnover = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_57();
	this.instance.setTransform(39.95,5.75,0.5,0.5);

	this.instance_1 = new lib.CachedBmp_62();
	this.instance_1.setTransform(0,0,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_1},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,170.5,120);


(lib.playbtnover = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_53();
	this.instance.setTransform(0,0,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,170.5,120);


(lib.ידימין9 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_51();
	this.instance.setTransform(0,-0.05,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,207.5,117.5);


(lib.ידשמאל9 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_50();
	this.instance.setTransform(-0.1,-0.05,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-0.1,0,194,140);


(lib.שמש = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.rf(["#F4E606","#F9EA3B","#FFFFFF"],[0.42,0.718,0.992],0,0,0,0,0,33.5).s().p("AjsGmQhiivAAj3QAAj2BiivQBjivCJAAQCLAABiCvQBiCvAAD2QAAD3hiCvQhjCviKAAQiJAAhjivg");
	this.shape.setTransform(64.1038,70.2192,1.9129,1.1766);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,128.2,140.5);


(lib.שלט9 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_49();
	this.instance.setTransform(0,0,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,445.5,166);


(lib.אצבעותימין9 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_48();
	this.instance.setTransform(0,-0.05,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,35.5,30.5);


(lib.אצבעותשמאל9 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_47();
	this.instance.setTransform(0,-0.05,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,35.5,30.5);


(lib.אדםרגלימין8 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_46();
	this.instance.setTransform(0,0,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,89,208);


(lib.אדםרגלשמאל8 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_45();
	this.instance.setTransform(-0.05,-0.05,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,58.5,204);


(lib.אדםגוף8 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_44();
	this.instance.setTransform(0,-0.05,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,395.5,503);


(lib.ידואייפד7 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_43();
	this.instance.setTransform(-0.35,-1.25,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-0.3,-1.2,135.5,147.5);


(lib.תווים7 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_42();
	this.instance.setTransform(0,0,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.תווים7, new cjs.Rectangle(0,0,153,44.5), null);


(lib.וילוןימין = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_41();
	this.instance.setTransform(-1.5,-0.7,0.4164,0.4164);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-1.5,-0.7,63.3,407.7);


(lib.sea1 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_40();
	this.instance.setTransform(0,0,0.4181,0.4181);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,129.6,89.5);


(lib.ליסהידימין6 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#E63B6B").s().p("ABKLZQgEiagSiIQgYiygOjPQgwhLgyhkQhOifg2iuQALgzAZg+QAxh7BHg0IAlBaQArBvAlBnQB1FNgBCNQBAEVgdGgQgjAOghAAQgiAAgggOg");
	this.shape.setTransform(27.5859,95.102,1.276,1.2806);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#F7AF86").s().p("AgVDSQgPgLADhZIAGhYIgqBpQgUAugDgcQgEgdAWhfIAVhVIgFAMQgKATgUAUQgRAPgPgCQgQgDAKgVIA0hoQANgYAZgbIAWgXQANgJAuAAQAXABAVACQAoA5ACCEQACB5gWAMQgHAEgKgzIgJgzIgIBQQgKBQgNACQgLACgJhMIgGhMIgOBkQgOBUgQAAQgDAAgCgCg");
	this.shape_1.setTransform(40.5392,212.8153,1.2761,1.2807);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-0.1,-0.1,57.4,240.1);


(lib.ליסהידשמאל6 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_39();
	this.instance.setTransform(-0.05,-0.05,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,107,219.5);


(lib.ידימין6 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_38();
	this.instance.setTransform(0,-0.05,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,63.5,165);


(lib.Path_20 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#699DEE").s().p("AmaKBIGIqnIAAnoIkghyIJlAAIkgByIAAHoIGIKng");
	this.shape.setTransform(41.1,64.1);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_20, new cjs.Rectangle(0,0,82.2,128.2), null);


(lib.Path_19 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#699DEE").s().p("AmaKBIGIqnIAAnoIkghyIJlAAIkgByIAAHoIGIKng");
	this.shape.setTransform(41.125,64.1);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_19, new cjs.Rectangle(0,0,82.3,128.2), null);


(lib.Path_18 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#699DEE").s().p("AmaKBIGIqnIAAnoIkghyIJlAAIkgByIAAHoIGIKng");
	this.shape.setTransform(41.1,64.1);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_18, new cjs.Rectangle(0,0,82.2,128.2), null);


(lib.Path_17 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#699DEE").s().p("AmaKBIGIqnIAAnoIkghyIJlAAIkgByIAAHoIGIKng");
	this.shape.setTransform(41.125,64.1);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_17, new cjs.Rectangle(0,0,82.3,128.2), null);


(lib.Path_16 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#699DEE").s().p("AmaKBIGIqnIAAnoIkghyIJlAAIkgByIAAHoIGIKng");
	this.shape.setTransform(41.125,64.1);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_16, new cjs.Rectangle(0,0,82.3,128.2), null);


(lib.Path_15 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#699DEE").s().p("AmaKBIGIqnIAAnoIkghyIJlAAIkgByIAAHoIGIKng");
	this.shape.setTransform(41.125,64.1);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_15, new cjs.Rectangle(0,0,82.3,128.2), null);


(lib.Path_14 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#699DEE").s().p("AmaKBIGIqnIAAnoIkghyIJlAAIkgByIAAHoIGIKng");
	this.shape.setTransform(41.1,64.1);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_14, new cjs.Rectangle(0,0,82.2,128.2), null);


(lib.Path_13 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#699DEE").s().p("AmaKBIGIqnIAAnoIkghyIJlAAIkgByIAAHoIGIKng");
	this.shape.setTransform(41.1,64.1);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_13, new cjs.Rectangle(0,0,82.2,128.2), null);


(lib.Path = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#699DEE").s().p("AkyKBIEghzIAAnoImIqmIM1AAImIKmIAAHoIEgBzg");
	this.shape.setTransform(41.125,64.1);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path, new cjs.Rectangle(0,0,82.3,128.2), null);


(lib.פה6 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#FFFFFF").s().p("AhJAjQgRgRgMgSQgLgQADgBIArgBQAvgBAZgGQApgIBBgoQACgBgDAVQgDAXgJAWQgYBEgxAMQgKACgJAAQgnAAgogng");
	this.shape.setTransform(14.2435,9.4565,1.2761,1.2807);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,28.5,19);


(lib.לב5 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_37();
	this.instance.setTransform(0.15,0.15,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.לב5, new cjs.Rectangle(0.2,0.2,110.5,102.5), null);


(lib.פה5 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_36();
	this.instance.setTransform(-0.35,-0.3,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-0.3,-0.3,24.5,21);


(lib.ידימין4 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_35();
	this.instance.setTransform(-0.1,-0.05,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-0.1,0,109.5,140.5);


(lib.פה4 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#FFFFFF").s().p("AhNAkQgSgRgMgTQgMgQAEgBIAsgBQAygCAagFQArgJBEgqQACAAgDAVQgDAYgJAXQgaBGgzANQgKACgJAAQgpAAgrgpg");
	this.shape.setTransform(15.725,9.187,1.3538,1.1999);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-0.1,0,31.700000000000003,18.4);


(lib.ידשמאל3 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_34();
	this.instance.setTransform(-0.15,-0.05,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-0.1,0,170.5,151);


(lib.ידימין2 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_33();
	this.instance.setTransform(0,-0.1,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,-0.1,74.5,167.5);


(lib.Symbol1 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#FFFFFF").s().p("AhFAgQgQgPgLgRQgKgPADAAIAogBQAsgCAXgFQAngIA9glQACAAgDATQgDAVgIAVQgXA/gtALQgJACgJAAQglAAgmglg");
	this.shape.setTransform(5.027,1.4759,0.5832,0.5832);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Symbol1, new cjs.Rectangle(-1.1,-2.5,12.2,8), null);


(lib.arm_scene1 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_32();
	this.instance.setTransform(0,-0.25,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.arm_scene1, new cjs.Rectangle(0,-0.2,150,80), null);


(lib.fade = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#252525").ss(1,0,0,4).p("EhRyhOoMCjlAAAMAAACdRMijlAAAg");
	this.shape.setTransform(523.525,503.25);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#FFFFFF").s().p("EhRyBOoMAAAidQMCjlAAAMAAACdQg");
	this.shape_1.setTransform(523.525,503.25);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.fade, new cjs.Rectangle(-1,-1,1049.1,1008.5), null);


(lib.replay_button = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// timeline functions:
	this.frame_2 = function() {
		playSound("startclickwav");
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).wait(2).call(this.frame_2).wait(2));

	// btn
	this.instance = new lib.CachedBmp_55();
	this.instance.setTransform(40.05,325.05,0.5,0.5);

	this.instance_1 = new lib.CachedBmp_61();
	this.instance_1.setTransform(0,319.75,0.5,0.5);

	this.instance_2 = new lib.replaybtnover("synched",0);
	this.instance_2.setTransform(85.1,379.65,1,1,0,0,0,85.1,59.9);
	this.instance_2.alpha = 0.7305;

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_1},{t:this.instance}]}).to({state:[{t:this.instance_2}]},1).to({state:[{t:this.instance_2}]},1).to({state:[{t:this.instance_2}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,319.8,170.5,120);


(lib.play_button = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// timeline functions:
	this.frame_2 = function() {
		playSound("startclickwav");
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).wait(2).call(this.frame_2).wait(2));

	// btn
	this.instance = new lib.CachedBmp_52();
	this.instance.setTransform(0,319.75,0.5,0.5);

	this.instance_1 = new lib.playbtnover("synched",0);
	this.instance_1.setTransform(85.1,379.65,1,1,0,0,0,85.1,59.9);
	this.instance_1.alpha = 0.7305;

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_1}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,319.8,170.5,120);


(lib.תווים7_דהוי = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.תווים7();
	this.instance.setTransform(76.5,22.2,1,1,0,0,0,76.5,22.2);
	this.instance.alpha = 0.0508;

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1).to({x:78.05,alpha:0.0726},0).wait(1).to({x:79.6,alpha:0.0952},0).wait(1).to({x:81.15,alpha:0.1179},0).wait(1).to({x:82.7,alpha:0.1405},0).wait(1).to({x:84.25,alpha:0.1631},0).wait(1).to({x:85.85,alpha:0.1857},0).wait(1).to({x:87.4,alpha:0.2083},0).wait(1).to({x:88.95,alpha:0.231},0).wait(1).to({x:90.5,alpha:0.2536},0).wait(1).to({x:92.05,alpha:0.2762},0).wait(1).to({x:93.65,alpha:0.2988},0).wait(1).to({x:95.2,alpha:0.3214},0).wait(1).to({x:96.75,alpha:0.344},0).wait(1).to({x:98.3,alpha:0.3667},0).wait(1).to({x:99.85,alpha:0.3893},0).wait(1).to({x:101.4,alpha:0.4119},0).wait(1).to({x:103,alpha:0.4345},0).wait(1).to({x:104.55,alpha:0.4571},0).wait(1).to({x:106.1,alpha:0.4798},0).wait(1).to({x:107.65,alpha:0.5024},0).wait(1).to({x:109.2,alpha:0.525},0).wait(1).to({x:110.8,alpha:0.5476},0).wait(1).to({x:112.35,alpha:0.5702},0).wait(1).to({x:113.9,alpha:0.5929},0).wait(1).to({x:115.45,alpha:0.6155},0).wait(1).to({x:117,alpha:0.6381},0).wait(1).to({x:118.6,alpha:0.6607},0).wait(1).to({x:120.15,alpha:0.6833},0).wait(1).to({x:121.7,alpha:0.706},0).wait(1).to({x:123.25,alpha:0.7286},0).wait(1).to({x:124.8,alpha:0.7512},0).wait(1).to({x:126.35,alpha:0.7738},0).wait(1).to({x:127.95,alpha:0.7964},0).wait(1).to({x:129.5,alpha:0.819},0).wait(1).to({x:131.05,alpha:0.8417},0).wait(1).to({x:132.6,alpha:0.8643},0).wait(1).to({x:134.15,alpha:0.8869},0).wait(1).to({x:135.75,alpha:0.9095},0).wait(1).to({x:137.3,alpha:0.9321},0).wait(1).to({x:138.85,alpha:0.9548},0).wait(1).to({x:140.4,alpha:0.9774},0).wait(1).to({x:141.95,alpha:1},0).wait(1).to({x:143.55,alpha:0.9412},0).wait(1).to({x:145.1,alpha:0.8824},0).wait(1).to({x:146.65,alpha:0.8235},0).wait(1).to({x:148.2,alpha:0.7647},0).wait(1).to({x:149.75,alpha:0.7059},0).wait(1).to({x:151.3,alpha:0.6471},0).wait(1).to({x:152.9,alpha:0.5882},0).wait(1).to({x:154.45,alpha:0.5294},0).wait(1).to({x:156,alpha:0.4706},0).wait(1).to({x:157.55,alpha:0.4118},0).wait(1).to({x:159.1,alpha:0.3529},0).wait(1).to({x:160.7,alpha:0.2941},0).wait(1).to({x:162.25,alpha:0.2353},0).wait(1).to({x:163.8,alpha:0.1765},0).wait(1).to({x:165.35,alpha:0.1176},0).wait(1).to({x:166.9,alpha:0.0588},0).wait(1).to({x:168.5,alpha:0},0).wait(2));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,245,44.5);


(lib.לב5דהוי = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_2
	this.instance = new lib.לב5();
	this.instance.setTransform(55.15,51.25,0.3436,0.32,0,0,0,54.6,51.2);
	this.instance.alpha = 0.0508;

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1).to({regX:55.4,regY:51.4,scaleY:0.3201,rotation:1.6071,x:53.15,y:43.5,alpha:0.0825},0).wait(1).to({rotation:3.2142,x:51.2,y:35.95,alpha:0.115},0).wait(1).to({rotation:4.8212,x:49.6,y:28.8,alpha:0.1475},0).wait(1).to({rotation:6.4283,x:48.4,y:21.9,alpha:0.18},0).wait(1).to({scaleY:0.32,rotation:8.0354,x:47.6,y:15.35,alpha:0.2125},0).wait(1).to({scaleY:0.3201,rotation:9.6425,x:47.15,y:9,alpha:0.245},0).wait(1).to({rotation:11.2496,x:47.05,y:3,alpha:0.2775},0).wait(1).to({rotation:12.8566,x:47.35,y:-2.75,alpha:0.31},0).wait(1).to({rotation:14.4637,x:48,y:-8.2,alpha:0.3425},0).wait(1).to({rotation:16.0708,x:49,y:-13.45,alpha:0.375},0).wait(1).to({rotation:17.6779,x:50.4,y:-18.3,alpha:0.4075},0).wait(1).to({rotation:19.2849,x:52.05,y:-22.9,alpha:0.44},0).wait(1).to({rotation:20.892,x:54.25,y:-27.3,alpha:0.4725},0).wait(1).to({rotation:22.4991,x:56.65,y:-31.35,alpha:0.505},0).wait(1).to({rotation:24.1062,x:59.45,y:-35.2,alpha:0.5375},0).wait(1).to({rotation:25.7133,x:62.65,y:-38.7,alpha:0.57},0).wait(1).to({rotation:27.3203,x:66.2,y:-41.9,alpha:0.6025},0).wait(1).to({rotation:28.9274,x:70.1,y:-44.85,alpha:0.635},0).wait(1).to({rotation:30.5345,x:74.4,y:-47.6,alpha:0.6675},0).wait(1).to({rotation:32.1416,x:79,y:-49.9,alpha:0.7},0).wait(1).to({rotation:33.7487,x:84.05,y:-52.1,alpha:0.7325},0).wait(1).to({rotation:35.3557,x:89.4,y:-54,alpha:0.765},0).wait(1).to({rotation:36.9628,x:95.15,y:-55.5,alpha:0.7975},0).wait(1).to({scaleY:0.32,rotation:38.5699,x:101.35,y:-56.85,alpha:0.83},0).wait(1).to({rotation:40.177,x:107.85,y:-57.85,alpha:0.8625},0).wait(1).to({scaleY:0.3201,rotation:41.784,x:114.7,y:-58.6,alpha:0.895},0).wait(1).to({rotation:43.3911,x:122,y:-59.05,alpha:0.9275},0).wait(1).to({scaleY:0.32,rotation:44.9982,x:129.6,y:-59.2,alpha:0.96},0).wait(1).to({alpha:0.8589},0).wait(1).to({alpha:0.7578},0).wait(1).to({alpha:0.6567},0).wait(1).to({alpha:0.5556},0).wait(1).to({alpha:0.4544},0).wait(1).to({alpha:0.3533},0).wait(1).to({alpha:0.2522},0).wait(1).to({alpha:0.1511},0).wait(1).to({alpha:0.05},0).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(25.3,-84.1,129.39999999999998,151.8);


(lib.פה2 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Symbol_1
	this.instance = new lib.Symbol1();
	this.instance.setTransform(6.1,4,1,1,0,0,0,6.1,4);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(7));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-1.1,-2.5,12.2,8);


(lib.פה = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Symbol_1
	this.instance = new lib.Symbol1();
	this.instance.setTransform(6.1,4,1,1,0,0,0,6.1,4);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(7));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-1.1,-2.5,12.2,8);


// stage content:
(lib.StoryboardFinal = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	this.actionFrames = [0,11,1040];
	this.streamSoundSymbolsList[11] = [{id:"_1minutedancemusicwavquiet",startFrame:11,endFrame:1029,loop:1,offset:0}];
	// timeline functions:
	this.frame_0 = function() {
		this.clearAllSoundStreams();
		 
		var _this = this;
		/*
		Stop a Movie Clip/Video
		Stops the specified movie clip or video.
		*/
		_this.stop();
		
		
		var _this = this;
		/*
		Clicking on the specified symbol instance executes a function.
		*/
		_this.play_btn.on('click', function(){
		/*
		Play a Movie Clip/Video or the current timeline.
		Plays the specified movie clip or video.
		*/
		_this.play();
		});
	}
	this.frame_11 = function() {
		var soundInstance = playSound("_1minutedancemusicwavquiet",0);
		this.InsertIntoSoundStreamData(soundInstance,11,1029,1);
	}
	this.frame_1040 = function() {
		var _this = this;
		/*
		Stop a Movie Clip/Video
		Stops the specified movie clip or video.
		*/
		_this.stop();
		
		
		var _this = this;
		/*
		Clicking on the specified symbol instance executes a function.
		*/
		_this.replay_btn.on('click', function(){
		/*
		Moves the playhead to the specified frame number in the timeline and continues playback from that frame.
		Can be used on the main timeline or on movie clip timelines.
		*/
		_this.gotoAndPlay(3);
		});
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(11).call(this.frame_11).wait(1029).call(this.frame_1040).wait(16));

	// button
	this.play_btn = new lib.play_button();
	this.play_btn.name = "play_btn";
	this.play_btn.setTransform(538.05,568,1,1,0,0,0,89,222.2);
	new cjs.ButtonHelper(this.play_btn, 0, 1, 2, false, new lib.play_button(), 3);

	this.replay_btn = new lib.replay_button();
	this.replay_btn.name = "replay_btn";
	this.replay_btn.setTransform(487.15,318.1);
	new cjs.ButtonHelper(this.replay_btn, 0, 1, 2, false, new lib.replay_button(), 3);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.play_btn}]}).to({state:[]},2).to({state:[{t:this.replay_btn}]},1038).to({state:[]},13).wait(3));

	// fadein
	this.instance = new lib.fade();
	this.instance.setTransform(607.55,503.45,1.1918,1,0,0,0,523,503.2);
	this.instance._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(903).to({_off:false},0).wait(1).to({regX:523.5,scaleX:1.1919,x:608.15,alpha:0.9231},0).wait(1).to({alpha:0.8462},0).wait(1).to({alpha:0.7692},0).wait(1).to({alpha:0.6923},0).wait(1).to({alpha:0.6154},0).wait(1).to({alpha:0.5385},0).wait(1).to({alpha:0.4615},0).wait(1).to({alpha:0.3846},0).wait(1).to({alpha:0.3077},0).wait(1).to({alpha:0.2308},0).wait(1).to({alpha:0.1538},0).wait(1).to({alpha:0.0769},0).wait(1).to({alpha:0},0).to({_off:true},1).wait(139));

	// שמש
	this.instance_1 = new lib.שמש("synched",0);
	this.instance_1.setTransform(593.3,232.45,0.6118,0.6531,0,0,0,64.2,70.3);
	this.instance_1._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(903).to({_off:false},0).wait(112).to({scaleX:0.649,x:593.25},0).to({regX:63.6,regY:69.7,scaleX:12.3039,scaleY:11.091,x:560.45,y:518.4},25).wait(16));

	// masking (mask)
	var mask = new cjs.Shape();
	mask._off = true;
	var mask_graphics_1008 = new cjs.Graphics().p("EhrTBemMAAAi9LMDWnAAAMAAAC9Lg");
	var mask_graphics_1009 = new cjs.Graphics().p("EhrTBdiMAAAi7DMDWnAAAMAAAC7Dg");
	var mask_graphics_1010 = new cjs.Graphics().p("EhrTBceMAAAi47MDWnAAAMAAAC47g");
	var mask_graphics_1011 = new cjs.Graphics().p("EhrTBbaMAAAi2zMDWnAAAMAAAC2zg");
	var mask_graphics_1012 = new cjs.Graphics().p("EhrTBaWMAAAi0rMDWnAAAMAAAC0rg");
	var mask_graphics_1013 = new cjs.Graphics().p("EhrTBZSMAAAiyjMDWnAAAMAAACyjg");
	var mask_graphics_1014 = new cjs.Graphics().p("EhrTBYNMAAAiwZMDWnAAAMAAACwZg");
	var mask_graphics_1015 = new cjs.Graphics().p("EhrTBXJMAAAiuRMDWnAAAMAAACuRg");
	var mask_graphics_1016 = new cjs.Graphics().p("EhrTBWFMAAAisJMDWnAAAMAAACsJg");
	var mask_graphics_1017 = new cjs.Graphics().p("EhrTBVBMAAAiqBMDWnAAAMAAACqBg");
	var mask_graphics_1018 = new cjs.Graphics().p("EhrTBT9MAAAin5MDWnAAAMAAACn5g");
	var mask_graphics_1019 = new cjs.Graphics().p("EhrTBS5MAAAilxMDWnAAAMAAAClxg");
	var mask_graphics_1020 = new cjs.Graphics().p("EhrTBR1MAAAijpMDWnAAAMAAACjpg");
	var mask_graphics_1021 = new cjs.Graphics().p("EhrTBQxMAAAihhMDWnAAAMAAAChhg");
	var mask_graphics_1022 = new cjs.Graphics().p("EhrTBPtMAAAifZMDWnAAAMAAACfZg");
	var mask_graphics_1023 = new cjs.Graphics().p("EhrTBOpMAAAidRMDWnAAAMAAACdRg");

	this.timeline.addTween(cjs.Tween.get(mask).to({graphics:null,x:0,y:0}).wait(1008).to({graphics:mask_graphics_1008,x:547.515,y:504.9036}).wait(1).to({graphics:mask_graphics_1009,x:546.3828,y:437.7101}).wait(1).to({graphics:mask_graphics_1010,x:545.2506,y:370.5165}).wait(1).to({graphics:mask_graphics_1011,x:544.1179,y:303.3229}).wait(1).to({graphics:mask_graphics_1012,x:542.9857,y:236.1294}).wait(1).to({graphics:mask_graphics_1013,x:541.8535,y:168.9354}).wait(1).to({graphics:mask_graphics_1014,x:540.7213,y:101.7423}).wait(1).to({graphics:mask_graphics_1015,x:539.5886,y:34.5483}).wait(1).to({graphics:mask_graphics_1016,x:538.4565,y:-32.6448}).wait(1).to({graphics:mask_graphics_1017,x:537.3243,y:-99.8388}).wait(1).to({graphics:mask_graphics_1018,x:536.1921,y:-167.0324}).wait(1).to({graphics:mask_graphics_1019,x:535.0599,y:-234.2255}).wait(1).to({graphics:mask_graphics_1020,x:533.9277,y:-301.4195}).wait(1).to({graphics:mask_graphics_1021,x:532.795,y:-368.6126}).wait(1).to({graphics:mask_graphics_1022,x:531.6628,y:-435.8066}).wait(1).to({graphics:mask_graphics_1023,x:530.4649,y:-503.0001}).wait(33));

	// אצבעותימין9
	this.instance_2 = new lib.אצבעותימין9("synched",0);
	this.instance_2.setTransform(893.95,471.35,1,1,0,0,0,17.7,15.2);
	this.instance_2._off = true;

	var maskedShapeInstanceList = [this.instance_2];

	for(var shapedInstanceItr = 0; shapedInstanceItr < maskedShapeInstanceList.length; shapedInstanceItr++) {
		maskedShapeInstanceList[shapedInstanceItr].mask = mask;
	}

	this.timeline.addTween(cjs.Tween.get(this.instance_2).wait(903).to({_off:false},0).wait(1).to({regX:17.8,x:894.05,y:470.25},0).wait(1).to({y:469.2},0).wait(1).to({y:468.15},0).wait(1).to({y:467.1},0).wait(1).to({y:466.05},0).wait(1).to({y:465},0).wait(1).to({y:463.95},0).wait(1).to({y:462.9},0).wait(1).to({y:461.85},0).wait(1).to({y:460.8},0).wait(1).to({y:459.75},0).wait(1).to({y:458.7},0).wait(1).to({y:457.65},0).wait(1).to({y:456.6},0).wait(1).to({y:455.55},0).wait(1).to({y:454.5},0).wait(1).to({y:453.45},0).wait(1).to({y:452.4},0).wait(1).to({y:451.35},0).wait(1).to({y:452.4},0).wait(1).to({y:453.45},0).wait(1).to({y:454.5},0).wait(1).to({y:455.55},0).wait(1).to({y:456.6},0).wait(1).to({y:457.65},0).wait(1).to({y:458.7},0).wait(1).to({y:459.75},0).wait(1).to({y:460.8},0).wait(1).to({y:461.85},0).wait(1).to({y:462.9},0).wait(1).to({y:463.95},0).wait(1).to({y:465},0).wait(1).to({y:466.05},0).wait(1).to({y:467.1},0).wait(1).to({y:468.15},0).wait(1).to({y:469.2},0).wait(1).to({y:470.25},0).wait(1).to({y:471.35},0).wait(1).to({y:470.45},0).wait(1).to({y:469.6},0).wait(1).to({y:468.7},0).wait(1).to({y:467.85},0).wait(1).to({y:467},0).wait(1).to({y:466.1},0).wait(1).to({y:465.25},0).wait(1).to({y:464.35},0).wait(1).to({y:463.5},0).wait(1).to({y:462.65},0).wait(1).to({y:461.75},0).wait(1).to({y:460.9},0).wait(1).to({y:460},0).wait(1).to({y:459.15},0).wait(1).to({y:458.3},0).wait(1).to({y:457.4},0).wait(1).to({y:456.55},0).wait(1).to({y:455.65},0).wait(1).to({y:454.8},0).wait(1).to({y:453.95},0).wait(1).to({y:453.05},0).wait(1).to({y:452.2},0).wait(1).to({y:451.35},0).wait(1).to({y:452.35},0).wait(1).to({y:453.35},0).wait(1).to({y:454.35},0).wait(1).to({y:455.35},0).wait(1).to({y:456.35},0).wait(1).to({y:457.35},0).wait(1).to({y:458.35},0).wait(1).to({y:459.35},0).wait(1).to({y:460.35},0).wait(1).to({y:461.35},0).wait(1).to({y:462.35},0).wait(1).to({y:463.35},0).wait(1).to({y:464.35},0).wait(1).to({y:465.35},0).wait(1).to({y:466.35},0).wait(1).to({y:467.35},0).wait(1).to({y:468.35},0).wait(1).to({y:469.35},0).wait(1).to({y:470.35},0).wait(1).to({y:471.35},0).wait(1).to({y:470.1},0).wait(1).to({y:468.85},0).wait(1).to({y:467.6},0).wait(1).to({y:466.35},0).wait(1).to({y:465.1},0).wait(1).to({y:463.85},0).wait(1).to({y:462.6},0).wait(1).to({y:461.35},0).wait(1).to({y:460.1},0).wait(1).to({y:458.85},0).wait(1).to({y:457.6},0).wait(1).to({y:456.35},0).wait(1).to({y:455.1},0).wait(1).to({y:453.85},0).wait(1).to({y:452.6},0).wait(1).to({y:451.35},0).wait(1).to({y:452.35},0).wait(1).to({y:453.35},0).wait(1).to({y:454.35},0).wait(1).to({y:455.35},0).wait(1).to({y:456.35},0).wait(1).to({y:457.35},0).wait(1).to({y:458.35},0).wait(1).to({y:459.35},0).wait(1).to({y:460.35},0).wait(1).to({y:461.35},0).wait(1).to({y:462.35},0).wait(1).to({y:463.35},0).wait(1).to({y:464.35},0).wait(1).to({y:465.35},0).wait(1).to({y:466.35},0).wait(1).to({y:467.35},0).wait(1).to({y:468.35},0).wait(1).to({y:469.35},0).wait(1).to({y:470.35},0).wait(1).to({y:471.35},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).to({_off:true},1).wait(32));

	// אצבעותשמאל9
	this.instance_3 = new lib.אצבעותשמאל9("synched",0);
	this.instance_3.setTransform(448.4,490.35,1,1,0,0,0,17.8,15.2);
	this.instance_3._off = true;

	var maskedShapeInstanceList = [this.instance_3];

	for(var shapedInstanceItr = 0; shapedInstanceItr < maskedShapeInstanceList.length; shapedInstanceItr++) {
		maskedShapeInstanceList[shapedInstanceItr].mask = mask;
	}

	this.timeline.addTween(cjs.Tween.get(this.instance_3).wait(903).to({_off:false},0).wait(1).to({y:489.25},0).wait(1).to({y:488.2},0).wait(1).to({y:487.15},0).wait(1).to({y:486.1},0).wait(1).to({y:485.05},0).wait(1).to({y:484},0).wait(1).to({y:482.95},0).wait(1).to({y:481.9},0).wait(1).to({y:480.85},0).wait(1).to({y:479.8},0).wait(1).to({y:478.75},0).wait(1).to({y:477.7},0).wait(1).to({y:476.65},0).wait(1).to({y:475.6},0).wait(1).to({y:474.55},0).wait(1).to({y:473.5},0).wait(1).to({y:472.45},0).wait(1).to({y:471.4},0).wait(1).to({y:470.35},0).wait(1).to({y:471.4},0).wait(1).to({y:472.45},0).wait(1).to({y:473.5},0).wait(1).to({y:474.55},0).wait(1).to({y:475.6},0).wait(1).to({y:476.65},0).wait(1).to({y:477.7},0).wait(1).to({y:478.75},0).wait(1).to({y:479.8},0).wait(1).to({y:480.85},0).wait(1).to({y:481.9},0).wait(1).to({y:482.95},0).wait(1).to({y:484},0).wait(1).to({y:485.05},0).wait(1).to({y:486.1},0).wait(1).to({y:487.15},0).wait(1).to({y:488.2},0).wait(1).to({y:489.25},0).wait(1).to({y:490.35},0).wait(1).to({y:489.45},0).wait(1).to({y:488.6},0).wait(1).to({y:487.7},0).wait(1).to({y:486.85},0).wait(1).to({y:486},0).wait(1).to({y:485.1},0).wait(1).to({y:484.25},0).wait(1).to({y:483.35},0).wait(1).to({y:482.5},0).wait(1).to({y:481.65},0).wait(1).to({y:480.75},0).wait(1).to({y:479.9},0).wait(1).to({y:479},0).wait(1).to({y:478.15},0).wait(1).to({y:477.3},0).wait(1).to({y:476.4},0).wait(1).to({y:475.55},0).wait(1).to({y:474.65},0).wait(1).to({y:473.8},0).wait(1).to({y:472.95},0).wait(1).to({y:472.05},0).wait(1).to({y:471.2},0).wait(1).to({y:470.35},0).wait(1).to({y:471.35},0).wait(1).to({y:472.35},0).wait(1).to({y:473.35},0).wait(1).to({y:474.35},0).wait(1).to({y:475.35},0).wait(1).to({y:476.35},0).wait(1).to({y:477.35},0).wait(1).to({y:478.35},0).wait(1).to({y:479.35},0).wait(1).to({y:480.35},0).wait(1).to({y:481.35},0).wait(1).to({y:482.35},0).wait(1).to({y:483.35},0).wait(1).to({y:484.35},0).wait(1).to({y:485.35},0).wait(1).to({y:486.35},0).wait(1).to({y:487.35},0).wait(1).to({y:488.35},0).wait(1).to({y:489.35},0).wait(1).to({y:490.35},0).wait(1).to({y:489.1},0).wait(1).to({y:487.85},0).wait(1).to({y:486.6},0).wait(1).to({y:485.35},0).wait(1).to({y:484.1},0).wait(1).to({y:482.85},0).wait(1).to({y:481.6},0).wait(1).to({y:480.35},0).wait(1).to({y:479.1},0).wait(1).to({y:477.85},0).wait(1).to({y:476.6},0).wait(1).to({y:475.35},0).wait(1).to({y:474.1},0).wait(1).to({y:472.85},0).wait(1).to({y:471.6},0).wait(1).to({y:470.35},0).wait(1).to({y:471.35},0).wait(1).to({y:472.35},0).wait(1).to({y:473.35},0).wait(1).to({y:474.35},0).wait(1).to({y:475.35},0).wait(1).to({y:476.35},0).wait(1).to({y:477.35},0).wait(1).to({y:478.35},0).wait(1).to({y:479.35},0).wait(1).to({y:480.35},0).wait(1).to({y:481.35},0).wait(1).to({y:482.35},0).wait(1).to({y:483.35},0).wait(1).to({y:484.35},0).wait(1).to({y:485.35},0).wait(1).to({y:486.35},0).wait(1).to({y:487.35},0).wait(1).to({y:488.35},0).wait(1).to({y:489.35},0).wait(1).to({y:490.35},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).to({_off:true},1).wait(32));

	// שלט9
	this.instance_4 = new lib.שלט9("synched",0);
	this.instance_4.setTransform(672.15,506.1,1,1,0,0,0,222.8,83);
	this.instance_4._off = true;

	var maskedShapeInstanceList = [this.instance_4];

	for(var shapedInstanceItr = 0; shapedInstanceItr < maskedShapeInstanceList.length; shapedInstanceItr++) {
		maskedShapeInstanceList[shapedInstanceItr].mask = mask;
	}

	this.timeline.addTween(cjs.Tween.get(this.instance_4).wait(903).to({_off:false},0).wait(1).to({y:505},0).wait(1).to({y:503.95},0).wait(1).to({y:502.9},0).wait(1).to({y:501.85},0).wait(1).to({y:500.8},0).wait(1).to({y:499.75},0).wait(1).to({y:498.7},0).wait(1).to({y:497.65},0).wait(1).to({y:496.6},0).wait(1).to({y:495.55},0).wait(1).to({y:494.5},0).wait(1).to({y:493.45},0).wait(1).to({y:492.4},0).wait(1).to({y:491.35},0).wait(1).to({y:490.3},0).wait(1).to({y:489.25},0).wait(1).to({y:488.2},0).wait(1).to({y:487.15},0).wait(1).to({y:486.1},0).wait(1).to({y:487.15},0).wait(1).to({y:488.2},0).wait(1).to({y:489.25},0).wait(1).to({y:490.3},0).wait(1).to({y:491.35},0).wait(1).to({y:492.4},0).wait(1).to({y:493.45},0).wait(1).to({y:494.5},0).wait(1).to({y:495.55},0).wait(1).to({y:496.6},0).wait(1).to({y:497.65},0).wait(1).to({y:498.7},0).wait(1).to({y:499.75},0).wait(1).to({y:500.8},0).wait(1).to({y:501.85},0).wait(1).to({y:502.9},0).wait(1).to({y:503.95},0).wait(1).to({y:505},0).wait(1).to({y:506.1},0).wait(1).to({y:505.2},0).wait(1).to({y:504.35},0).wait(1).to({y:503.45},0).wait(1).to({y:502.6},0).wait(1).to({y:501.75},0).wait(1).to({y:500.85},0).wait(1).to({y:500},0).wait(1).to({y:499.1},0).wait(1).to({y:498.25},0).wait(1).to({y:497.4},0).wait(1).to({y:496.5},0).wait(1).to({y:495.65},0).wait(1).to({y:494.75},0).wait(1).to({y:493.9},0).wait(1).to({y:493.05},0).wait(1).to({y:492.15},0).wait(1).to({y:491.3},0).wait(1).to({y:490.4},0).wait(1).to({y:489.55},0).wait(1).to({y:488.7},0).wait(1).to({y:487.8},0).wait(1).to({y:486.95},0).wait(1).to({y:486.1},0).wait(1).to({y:487.1},0).wait(1).to({y:488.1},0).wait(1).to({y:489.1},0).wait(1).to({y:490.1},0).wait(1).to({y:491.1},0).wait(1).to({y:492.1},0).wait(1).to({y:493.1},0).wait(1).to({y:494.1},0).wait(1).to({y:495.1},0).wait(1).to({y:496.1},0).wait(1).to({y:497.1},0).wait(1).to({y:498.1},0).wait(1).to({y:499.1},0).wait(1).to({y:500.1},0).wait(1).to({y:501.1},0).wait(1).to({y:502.1},0).wait(1).to({y:503.1},0).wait(1).to({y:504.1},0).wait(1).to({y:505.1},0).wait(1).to({y:506.1},0).wait(1).to({y:504.85},0).wait(1).to({y:503.6},0).wait(1).to({y:502.35},0).wait(1).to({y:501.1},0).wait(1).to({y:499.85},0).wait(1).to({y:498.6},0).wait(1).to({y:497.35},0).wait(1).to({y:496.1},0).wait(1).to({y:494.85},0).wait(1).to({y:493.6},0).wait(1).to({y:492.35},0).wait(1).to({y:491.1},0).wait(1).to({y:489.85},0).wait(1).to({y:488.6},0).wait(1).to({y:487.35},0).wait(1).to({y:486.1},0).wait(1).to({y:487.1},0).wait(1).to({y:488.1},0).wait(1).to({y:489.1},0).wait(1).to({y:490.1},0).wait(1).to({y:491.1},0).wait(1).to({y:492.1},0).wait(1).to({y:493.1},0).wait(1).to({y:494.1},0).wait(1).to({y:495.1},0).wait(1).to({y:496.1},0).wait(1).to({y:497.1},0).wait(1).to({y:498.1},0).wait(1).to({y:499.1},0).wait(1).to({y:500.1},0).wait(1).to({y:501.1},0).wait(1).to({y:502.1},0).wait(1).to({y:503.1},0).wait(1).to({y:504.1},0).wait(1).to({y:505.1},0).wait(1).to({y:506.1},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).to({_off:true},1).wait(32));

	// סיפורים
	this.instance_5 = new lib.CachedBmp_1();
	this.instance_5.setTransform(572.85,330.65,0.5,0.5);
	this.instance_5._off = true;

	var maskedShapeInstanceList = [this.instance_5];

	for(var shapedInstanceItr = 0; shapedInstanceItr < maskedShapeInstanceList.length; shapedInstanceItr++) {
		maskedShapeInstanceList[shapedInstanceItr].mask = mask;
	}

	this.timeline.addTween(cjs.Tween.get(this.instance_5).wait(903).to({_off:false},0).to({_off:true},121).wait(32));

	// ידימין9
	this.instance_6 = new lib.ידימין9("synched",0);
	this.instance_6.setTransform(806.55,511.85,1,1,0,0,0,103.7,58.8);
	this.instance_6._off = true;

	var maskedShapeInstanceList = [this.instance_6];

	for(var shapedInstanceItr = 0; shapedInstanceItr < maskedShapeInstanceList.length; shapedInstanceItr++) {
		maskedShapeInstanceList[shapedInstanceItr].mask = mask;
	}

	this.timeline.addTween(cjs.Tween.get(this.instance_6).wait(903).to({_off:false},0).wait(1).to({regX:103.8,regY:58.7,x:806.65,y:510.65},0).wait(1).to({y:509.6},0).wait(1).to({y:508.55},0).wait(1).to({y:507.5},0).wait(1).to({y:506.45},0).wait(1).to({y:505.4},0).wait(1).to({y:504.35},0).wait(1).to({y:503.3},0).wait(1).to({y:502.25},0).wait(1).to({y:501.2},0).wait(1).to({y:500.15},0).wait(1).to({y:499.1},0).wait(1).to({y:498.05},0).wait(1).to({y:497},0).wait(1).to({y:495.95},0).wait(1).to({y:494.9},0).wait(1).to({y:493.85},0).wait(1).to({y:492.8},0).wait(1).to({y:491.75},0).wait(1).to({y:492.8},0).wait(1).to({y:493.85},0).wait(1).to({y:494.9},0).wait(1).to({y:495.95},0).wait(1).to({y:497},0).wait(1).to({y:498.05},0).wait(1).to({y:499.1},0).wait(1).to({y:500.15},0).wait(1).to({y:501.2},0).wait(1).to({y:502.25},0).wait(1).to({y:503.3},0).wait(1).to({y:504.35},0).wait(1).to({y:505.4},0).wait(1).to({y:506.45},0).wait(1).to({y:507.5},0).wait(1).to({y:508.55},0).wait(1).to({y:509.6},0).wait(1).to({y:510.65},0).wait(1).to({y:511.75},0).wait(1).to({y:510.85},0).wait(1).to({y:510},0).wait(1).to({y:509.1},0).wait(1).to({y:508.25},0).wait(1).to({y:507.4},0).wait(1).to({y:506.5},0).wait(1).to({y:505.65},0).wait(1).to({y:504.75},0).wait(1).to({y:503.9},0).wait(1).to({y:503.05},0).wait(1).to({y:502.15},0).wait(1).to({y:501.3},0).wait(1).to({y:500.4},0).wait(1).to({y:499.55},0).wait(1).to({y:498.7},0).wait(1).to({y:497.8},0).wait(1).to({y:496.95},0).wait(1).to({y:496.05},0).wait(1).to({y:495.2},0).wait(1).to({y:494.35},0).wait(1).to({y:493.45},0).wait(1).to({y:492.6},0).wait(1).to({y:491.75},0).wait(1).to({y:492.75},0).wait(1).to({y:493.75},0).wait(1).to({y:494.75},0).wait(1).to({y:495.75},0).wait(1).to({y:496.75},0).wait(1).to({y:497.75},0).wait(1).to({y:498.75},0).wait(1).to({y:499.75},0).wait(1).to({y:500.75},0).wait(1).to({y:501.75},0).wait(1).to({y:502.75},0).wait(1).to({y:503.75},0).wait(1).to({y:504.75},0).wait(1).to({y:505.75},0).wait(1).to({y:506.75},0).wait(1).to({y:507.75},0).wait(1).to({y:508.75},0).wait(1).to({y:509.75},0).wait(1).to({y:510.75},0).wait(1).to({y:511.75},0).wait(1).to({y:510.5},0).wait(1).to({y:509.25},0).wait(1).to({y:508},0).wait(1).to({y:506.75},0).wait(1).to({y:505.5},0).wait(1).to({y:504.25},0).wait(1).to({y:503},0).wait(1).to({y:501.75},0).wait(1).to({y:500.5},0).wait(1).to({y:499.25},0).wait(1).to({y:498},0).wait(1).to({y:496.75},0).wait(1).to({y:495.5},0).wait(1).to({y:494.25},0).wait(1).to({y:493},0).wait(1).to({y:491.75},0).wait(1).to({y:492.75},0).wait(1).to({y:493.75},0).wait(1).to({y:494.75},0).wait(1).to({y:495.75},0).wait(1).to({y:496.75},0).wait(1).to({y:497.75},0).wait(1).to({y:498.75},0).wait(1).to({y:499.75},0).wait(1).to({y:500.75},0).wait(1).to({y:501.75},0).wait(1).to({y:502.75},0).wait(1).to({y:503.75},0).wait(1).to({y:504.75},0).wait(1).to({y:505.75},0).wait(1).to({y:506.75},0).wait(1).to({y:507.75},0).wait(1).to({y:508.75},0).wait(1).to({y:509.75},0).wait(1).to({y:510.75},0).wait(1).to({y:511.75},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).to({_off:true},1).wait(32));

	// ידשמאל9
	this.instance_7 = new lib.ידשמאל9("synched",0);
	this.instance_7.setTransform(530.05,541.9,1,1,0,0,0,97,69.9);
	this.instance_7._off = true;

	var maskedShapeInstanceList = [this.instance_7];

	for(var shapedInstanceItr = 0; shapedInstanceItr < maskedShapeInstanceList.length; shapedInstanceItr++) {
		maskedShapeInstanceList[shapedInstanceItr].mask = mask;
	}

	this.timeline.addTween(cjs.Tween.get(this.instance_7).wait(903).to({_off:false},0).wait(1).to({regX:96.9,x:529.95,y:540.8},0).wait(1).to({y:539.75},0).wait(1).to({y:538.7},0).wait(1).to({y:537.65},0).wait(1).to({y:536.6},0).wait(1).to({y:535.55},0).wait(1).to({y:534.5},0).wait(1).to({y:533.45},0).wait(1).to({y:532.4},0).wait(1).to({y:531.35},0).wait(1).to({y:530.3},0).wait(1).to({y:529.25},0).wait(1).to({y:528.2},0).wait(1).to({y:527.15},0).wait(1).to({y:526.1},0).wait(1).to({y:525.05},0).wait(1).to({y:524},0).wait(1).to({y:522.95},0).wait(1).to({y:521.9},0).wait(1).to({y:522.95},0).wait(1).to({y:524},0).wait(1).to({y:525.05},0).wait(1).to({y:526.1},0).wait(1).to({y:527.15},0).wait(1).to({y:528.2},0).wait(1).to({y:529.25},0).wait(1).to({y:530.3},0).wait(1).to({y:531.35},0).wait(1).to({y:532.4},0).wait(1).to({y:533.45},0).wait(1).to({y:534.5},0).wait(1).to({y:535.55},0).wait(1).to({y:536.6},0).wait(1).to({y:537.65},0).wait(1).to({y:538.7},0).wait(1).to({y:539.75},0).wait(1).to({y:540.8},0).wait(1).to({y:541.9},0).wait(1).to({y:541},0).wait(1).to({y:540.15},0).wait(1).to({y:539.25},0).wait(1).to({y:538.4},0).wait(1).to({y:537.55},0).wait(1).to({y:536.65},0).wait(1).to({y:535.8},0).wait(1).to({y:534.9},0).wait(1).to({y:534.05},0).wait(1).to({y:533.2},0).wait(1).to({y:532.3},0).wait(1).to({y:531.45},0).wait(1).to({y:530.55},0).wait(1).to({y:529.7},0).wait(1).to({y:528.85},0).wait(1).to({y:527.95},0).wait(1).to({y:527.1},0).wait(1).to({y:526.2},0).wait(1).to({y:525.35},0).wait(1).to({y:524.5},0).wait(1).to({y:523.6},0).wait(1).to({y:522.75},0).wait(1).to({y:521.9},0).wait(1).to({y:522.9},0).wait(1).to({y:523.9},0).wait(1).to({y:524.9},0).wait(1).to({y:525.9},0).wait(1).to({y:526.9},0).wait(1).to({y:527.9},0).wait(1).to({y:528.9},0).wait(1).to({y:529.9},0).wait(1).to({y:530.9},0).wait(1).to({y:531.9},0).wait(1).to({y:532.9},0).wait(1).to({y:533.9},0).wait(1).to({y:534.9},0).wait(1).to({y:535.9},0).wait(1).to({y:536.9},0).wait(1).to({y:537.9},0).wait(1).to({y:538.9},0).wait(1).to({y:539.9},0).wait(1).to({y:540.9},0).wait(1).to({y:541.9},0).wait(1).to({y:540.65},0).wait(1).to({y:539.4},0).wait(1).to({y:538.15},0).wait(1).to({y:536.9},0).wait(1).to({y:535.65},0).wait(1).to({y:534.4},0).wait(1).to({y:533.15},0).wait(1).to({y:531.9},0).wait(1).to({y:530.65},0).wait(1).to({y:529.4},0).wait(1).to({y:528.15},0).wait(1).to({y:526.9},0).wait(1).to({y:525.65},0).wait(1).to({y:524.4},0).wait(1).to({y:523.15},0).wait(1).to({y:521.9},0).wait(1).to({y:522.9},0).wait(1).to({y:523.9},0).wait(1).to({y:524.9},0).wait(1).to({y:525.9},0).wait(1).to({y:526.9},0).wait(1).to({y:527.9},0).wait(1).to({y:528.9},0).wait(1).to({y:529.9},0).wait(1).to({y:530.9},0).wait(1).to({y:531.9},0).wait(1).to({y:532.9},0).wait(1).to({y:533.9},0).wait(1).to({y:534.9},0).wait(1).to({y:535.9},0).wait(1).to({y:536.9},0).wait(1).to({y:537.9},0).wait(1).to({y:538.9},0).wait(1).to({y:539.9},0).wait(1).to({y:540.9},0).wait(1).to({y:541.9},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).to({_off:true},1).wait(32));

	// וילוןשמאל
	this.instance_8 = new lib.וילוןימין("synched",0);
	this.instance_8.setTransform(519.25,376.85,1.1319,1,0,0,180,30.7,203.2);
	this.instance_8._off = true;

	var maskedShapeInstanceList = [this.instance_8];

	for(var shapedInstanceItr = 0; shapedInstanceItr < maskedShapeInstanceList.length; shapedInstanceItr++) {
		maskedShapeInstanceList[shapedInstanceItr].mask = mask;
	}

	this.timeline.addTween(cjs.Tween.get(this.instance_8).wait(903).to({_off:false},0).to({_off:true},121).wait(32));

	// וילוןימין
	this.instance_9 = new lib.וילוןימין("synched",0);
	this.instance_9.setTransform(670.25,376.85,0.9427,1,0,0,0,30.7,203.2);
	this.instance_9._off = true;

	var maskedShapeInstanceList = [this.instance_9];

	for(var shapedInstanceItr = 0; shapedInstanceItr < maskedShapeInstanceList.length; shapedInstanceItr++) {
		maskedShapeInstanceList[shapedInstanceItr].mask = mask;
	}

	this.timeline.addTween(cjs.Tween.get(this.instance_9).wait(903).to({_off:false},0).to({_off:true},121).wait(32));

	// sea1
	this.instance_10 = new lib.sea1("synched",0);
	this.instance_10.setTransform(611.3,530.3,1.1958,1,0,0,0,65,44.8);
	this.instance_10._off = true;

	var maskedShapeInstanceList = [this.instance_10];

	for(var shapedInstanceItr = 0; shapedInstanceItr < maskedShapeInstanceList.length; shapedInstanceItr++) {
		maskedShapeInstanceList[shapedInstanceItr].mask = mask;
	}

	this.timeline.addTween(cjs.Tween.get(this.instance_10).wait(903).to({_off:false},0).wait(1).to({regX:64.8,regY:44.7,scaleX:1.3845,scaleY:0.9986,x:610.15,y:530.15},0).wait(1).to({scaleX:1.3858,scaleY:0.9972,x:609.35},0).wait(1).to({scaleX:1.3872,scaleY:0.9959,x:608.55,y:530.05},0).wait(1).to({scaleX:1.3885,scaleY:0.9945,x:607.7},0).wait(1).to({scaleX:1.3899,scaleY:0.9931,x:606.85},0).wait(1).to({scaleX:1.3913,scaleY:0.9917,x:606.05,y:530},0).wait(1).to({scaleX:1.3926,scaleY:0.9903,x:605.25,y:529.95},0).wait(1).to({scaleX:1.394,scaleY:0.989,x:604.45,y:529.9},0).wait(1).to({scaleX:1.3953,scaleY:0.9876,x:603.55},0).wait(1).to({scaleX:1.3967,scaleY:0.9862,x:602.75},0).wait(1).to({scaleX:1.398,scaleY:0.9848,x:601.95,y:529.8},0).wait(1).to({scaleX:1.3994,scaleY:0.9834,x:601.15},0).wait(1).to({scaleX:1.4008,scaleY:0.982,x:600.3},0).wait(1).to({scaleX:1.4021,scaleY:0.9807,x:599.5,y:529.75},0).wait(1).to({scaleX:1.4035,scaleY:0.9793,x:598.65,y:529.7},0).wait(1).to({scaleX:1.4048,scaleY:0.9779,x:597.85,y:529.65},0).wait(1).to({scaleX:1.4062,scaleY:0.9765,x:597},0).wait(1).to({scaleX:1.4075,scaleY:0.9751,x:596.2},0).wait(1).to({scaleX:1.4089,scaleY:0.9738,x:595.4,y:529.6},0).wait(1).to({scaleX:1.4103,scaleY:0.9724,x:594.55,y:529.55},0).wait(1).to({scaleX:1.4116,scaleY:0.971,x:593.7,y:529.5},0).wait(1).to({scaleX:1.4051,scaleY:0.9696,x:593.05,y:529.7},0).wait(1).to({scaleX:1.3985,scaleY:0.9682,x:592.35,y:529.85},0).wait(1).to({scaleX:1.392,scaleY:0.9669,x:591.7,y:529.95},0).wait(1).to({scaleX:1.3854,scaleY:0.9655,x:591,y:530.1},0).wait(1).to({scaleX:1.3789,scaleY:0.9641,x:590.35,y:530.3},0).wait(1).to({scaleX:1.3723,scaleY:0.9627,x:589.7,y:530.45},0).wait(1).to({scaleX:1.3658,scaleY:0.9613,x:589,y:530.55},0).wait(1).to({scaleX:1.3592,scaleY:0.9599,x:588.35,y:530.7},0).wait(1).to({scaleX:1.3527,scaleY:0.9586,x:587.65,y:530.85},0).wait(1).to({scaleX:1.3461,scaleY:0.9572,x:587,y:531.05},0).wait(1).to({scaleX:1.3396,scaleY:0.9558,x:586.3,y:531.15},0).wait(1).to({scaleX:1.3478,scaleY:0.9544,x:585.65,y:531.3},0).wait(1).to({scaleX:1.3561,scaleY:0.953,x:584.95,y:531.45},0).wait(1).to({scaleX:1.3643,scaleY:0.9517,x:584.3,y:531.6},0).wait(1).to({scaleX:1.3726,scaleY:0.9503,x:583.65,y:531.8},0).wait(1).to({scaleX:1.3808,scaleY:0.9489,x:582.95,y:531.9},0).wait(1).to({scaleX:1.3891,scaleY:0.9475,x:582.25,y:532.05},0).wait(1).to({scaleX:1.3973,scaleY:0.9461,x:581.6,y:532.2},0).wait(1).to({scaleX:1.4056,scaleY:0.9448,x:580.95,y:532.35},0).wait(1).to({scaleX:1.4138,scaleY:0.9434,x:580.25,y:532.5},0).wait(1).to({scaleX:1.4221,scaleY:0.942,x:579.55,y:532.65},0).wait(1).to({scaleX:1.4303,scaleY:0.9406,x:578.9,y:532.8},0).wait(1).to({scaleX:1.4295,scaleY:0.9392,x:580.4,y:532.9},0).wait(1).to({scaleX:1.4287,scaleY:0.9378,x:581.85,y:532.95},0).wait(1).to({scaleX:1.4279,scaleY:0.9365,x:583.35,y:533.05},0).wait(1).to({scaleX:1.4271,scaleY:0.9351,x:584.8,y:533.15},0).wait(1).to({scaleX:1.4263,scaleY:0.9337,x:586.25,y:533.25},0).wait(1).to({scaleX:1.4255,scaleY:0.9323,x:587.75,y:533.35},0).wait(1).to({scaleX:1.4246,scaleY:0.9309,x:589.2,y:533.45},0).wait(1).to({scaleX:1.4238,scaleY:0.9296,x:590.7,y:533.55},0).wait(1).to({scaleX:1.423,scaleY:0.9282,x:592.15,y:533.65},0).wait(1).to({scaleX:1.4222,scaleY:0.9268,x:593.65,y:533.75},0).wait(1).to({scaleX:1.4214,scaleY:0.9254,x:595.15,y:533.8},0).wait(1).to({scaleX:1.4206,scaleY:0.924,x:596.6,y:533.9},0).wait(1).to({scaleX:1.4198,scaleY:0.9227,x:598.1,y:534},0).wait(1).to({scaleX:1.419,scaleY:0.9213,x:599.55,y:534.1},0).wait(1).to({scaleX:1.4182,scaleY:0.9199,x:601.05,y:534.15},0).wait(1).to({scaleX:1.4321,scaleY:0.9185,x:600.9,y:534.3},0).wait(1).to({scaleX:1.4459,scaleY:0.9171,x:600.7,y:534.45},0).wait(1).to({scaleX:1.4598,scaleY:0.9157,x:600.55,y:534.55},0).wait(1).to({scaleX:1.4737,scaleY:0.9144,x:600.4,y:534.65},0).wait(1).to({scaleX:1.4875,scaleY:0.913,x:600.2,y:534.8},0).wait(1).to({scaleX:1.5014,scaleY:0.9116,x:600.05,y:534.9},0).wait(1).to({scaleX:1.498,scaleY:0.9103,x:597.8,y:535},0).wait(1).to({scaleX:1.4947,scaleY:0.909,x:595.6,y:535.1},0).wait(1).to({scaleX:1.4913,scaleY:0.9076,x:593.35,y:535.15},0).wait(1).to({scaleX:1.488,scaleY:0.9063,x:591.1,y:535.2},0).wait(1).to({scaleX:1.4846,scaleY:0.905,x:588.9,y:535.3},0).wait(1).to({scaleX:1.4813,scaleY:0.9037,x:586.7,y:535.4},0).wait(1).to({scaleX:1.4779,scaleY:0.9024,x:584.4,y:535.5},0).wait(1).to({scaleX:1.4745,scaleY:0.901,x:582.2,y:535.55},0).wait(1).to({scaleX:1.4712,scaleY:0.8997,x:580,y:535.6},0).wait(1).to({scaleX:1.4678,scaleY:0.8984,x:580.95},0).wait(1).to({scaleX:1.4645,scaleY:0.8971,x:581.95,y:535.55},0).wait(1).to({scaleX:1.4611,scaleY:0.8958,x:582.95,y:535.5},0).wait(1).to({scaleX:1.4578,scaleY:0.8945,x:583.9},0).wait(1).to({scaleX:1.4544,scaleY:0.8931,x:584.9,y:535.4},0).wait(1).to({scaleX:1.451,scaleY:0.8918,x:585.9},0).wait(1).to({scaleX:1.4477,scaleY:0.8905,x:586.85,y:535.35},0).wait(1).to({scaleX:1.4443,scaleY:0.8892,x:587.85},0).wait(1).to({scaleX:1.441,scaleY:0.8879,x:588.8,y:535.3},0).wait(1).to({scaleX:1.4376,scaleY:0.8865,x:589.8,y:535.25},0).wait(1).to({scaleX:1.4343,scaleY:0.8852,x:590.8,y:535.2},0).wait(1).to({scaleX:1.4309,scaleY:0.8839,x:591.75,y:535.15},0).wait(1).to({scaleX:1.4276,scaleY:0.8826,x:592.75},0).wait(1).to({scaleX:1.4242,scaleY:0.8813,x:593.75,y:535.1},0).wait(1).to({scaleX:1.4208,scaleY:0.8799,x:594.7,y:535.05},0).wait(1).to({scaleX:1.4175,scaleY:0.8786,x:595.7,y:535},0).wait(1).to({scaleX:1.4141,scaleY:0.8773,x:596.75,y:534.95},0).wait(1).to({scaleX:1.4108,scaleY:0.876,x:597.7},0).wait(1).to({scaleX:1.4074,scaleY:0.8747,x:598.7,y:534.9},0).wait(1).to({scaleX:1.4041,scaleY:0.8733,x:599.7,y:534.85},0).wait(1).to({scaleX:1.4007,scaleY:0.872,x:600.65},0).wait(1).to({scaleX:1.3973,scaleY:0.8707,x:601.65,y:534.75},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).to({_off:true},1).wait(32));

	// bg1
	this.instance_11 = new lib.CachedBmp_2();
	this.instance_11.setTransform(1.85,-0.25,0.5,0.5);
	this.instance_11._off = true;

	var maskedShapeInstanceList = [this.instance_11];

	for(var shapedInstanceItr = 0; shapedInstanceItr < maskedShapeInstanceList.length; shapedInstanceItr++) {
		maskedShapeInstanceList[shapedInstanceItr].mask = mask;
	}

	this.timeline.addTween(cjs.Tween.get(this.instance_11).wait(903).to({_off:false},0).to({_off:true},121).wait(32));

	// fadeout
	this.instance_12 = new lib.fade();
	this.instance_12.setTransform(563.4,503.45,1.1918,1,0,0,0,523.1,503.2);
	this.instance_12.alpha = 0;
	this.instance_12._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_12).wait(888).to({_off:false},0).wait(1).to({regX:523.5,scaleX:1.1919,x:563.9,alpha:0.0714},0).wait(1).to({alpha:0.1429},0).wait(1).to({alpha:0.2143},0).wait(1).to({alpha:0.2857},0).wait(1).to({alpha:0.3571},0).wait(1).to({alpha:0.4286},0).wait(1).to({alpha:0.5},0).wait(1).to({alpha:0.5714},0).wait(1).to({alpha:0.6429},0).wait(1).to({alpha:0.7143},0).wait(1).to({alpha:0.7857},0).wait(1).to({alpha:0.8571},0).wait(1).to({alpha:0.9286},0).wait(1).to({alpha:1},0).to({_off:true},1).wait(153));

	// fadein
	this.instance_13 = new lib.fade();
	this.instance_13.setTransform(563.55,503.45,1.1918,1,0,0,0,523.4,503.2);
	this.instance_13._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_13).wait(782).to({_off:false},0).wait(1).to({regX:523.5,scaleX:1.1919,x:563.7,alpha:0.9231},0).wait(1).to({alpha:0.8462},0).wait(1).to({alpha:0.7692},0).wait(1).to({alpha:0.6923},0).wait(1).to({alpha:0.6154},0).wait(1).to({alpha:0.5385},0).wait(1).to({alpha:0.4615},0).wait(1).to({alpha:0.3846},0).wait(1).to({alpha:0.3077},0).wait(1).to({alpha:0.2308},0).wait(1).to({alpha:0.1538},0).wait(1).to({alpha:0.0769},0).wait(1).to({alpha:0},0).to({_off:true},1).wait(260));

	// סיפורים
	this.instance_14 = new lib.CachedBmp_3();
	this.instance_14.setTransform(402.35,89.95,0.5,0.5);
	this.instance_14._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_14).wait(782).to({_off:false},0).to({_off:true},121).wait(153));

	// אדםגוף8
	this.instance_15 = new lib.אדםגוף8("synched",0);
	this.instance_15.setTransform(342.25,563.7,1,1,0,0,0,197.8,251.6);
	this.instance_15._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_15).wait(782).to({_off:false},0).wait(1).to({regY:251.4,y:561.25},0).wait(1).to({y:559},0).wait(1).to({y:556.8},0).wait(1).to({y:554.55},0).wait(1).to({y:552.35},0).wait(1).to({y:550.1},0).wait(1).to({y:547.9},0).wait(1).to({y:545.65},0).wait(1).to({y:543.45},0).wait(1).to({y:541.2},0).wait(1).to({y:539},0).wait(1).to({y:536.75},0).wait(1).to({y:534.5},0).wait(1).to({y:532.3},0).wait(1).to({y:530.05},0).wait(1).to({y:527.85},0).wait(1).to({y:525.6},0).wait(1).to({y:523.4},0).wait(1).to({y:521.15},0).wait(1).to({y:518.95},0).wait(1).to({y:516.7},0).wait(1).to({y:514.5},0).wait(1).to({y:516.25},0).wait(1).to({y:518},0).wait(1).to({y:519.75},0).wait(1).to({y:521.5},0).wait(1).to({y:523.25},0).wait(1).to({y:525},0).wait(1).to({y:526.75},0).wait(1).to({y:528.5},0).wait(1).to({y:530.25},0).wait(1).to({y:532},0).wait(1).to({y:533.75},0).wait(1).to({y:535.5},0).wait(1).to({y:537.25},0).wait(1).to({y:539},0).wait(1).to({y:540.75},0).wait(1).to({y:542.5},0).wait(1).to({y:544.25},0).wait(1).to({y:546},0).wait(1).to({y:547.75},0).wait(1).to({y:549.5},0).wait(1).to({y:551.25},0).wait(1).to({y:553},0).wait(1).to({y:554.75},0).wait(1).to({y:556.5},0).wait(1).to({y:558.25},0).wait(1).to({y:560},0).wait(1).to({y:561.75},0).wait(1).to({y:563.5},0).wait(1).to({y:561.5},0).wait(1).to({y:559.55},0).wait(1).to({y:557.6},0).wait(1).to({y:555.65},0).wait(1).to({y:553.7},0).wait(1).to({y:551.7},0).wait(1).to({y:549.75},0).wait(1).to({y:547.8},0).wait(1).to({y:545.85},0).wait(1).to({y:543.9},0).wait(1).to({y:541.9},0).wait(1).to({y:539.95},0).wait(1).to({y:538},0).wait(1).to({y:536.05},0).wait(1).to({y:534.1},0).wait(1).to({y:532.1},0).wait(1).to({y:530.15},0).wait(1).to({y:528.2},0).wait(1).to({y:526.25},0).wait(1).to({y:524.3},0).wait(1).to({y:522.3},0).wait(1).to({y:520.35},0).wait(1).to({y:518.4},0).wait(1).to({y:516.45},0).wait(1).to({y:514.5},0).wait(1).to({y:516.15},0).wait(1).to({y:517.85},0).wait(1).to({y:519.55},0).wait(1).to({y:521.25},0).wait(1).to({y:522.9},0).wait(1).to({y:524.6},0).wait(1).to({y:526.3},0).wait(1).to({y:528},0).wait(1).to({y:529.7},0).wait(1).to({y:531.35},0).wait(1).to({y:533.05},0).wait(1).to({y:534.75},0).wait(1).to({y:536.45},0).wait(1).to({y:538.15},0).wait(1).to({y:539.8},0).wait(1).to({y:541.5},0).wait(1).to({y:543.2},0).wait(1).to({y:544.9},0).wait(1).to({y:546.6},0).wait(1).to({y:548.25},0).wait(1).to({y:549.95},0).wait(1).to({y:551.65},0).wait(1).to({y:553.35},0).wait(1).to({y:555.05},0).wait(1).to({y:556.7},0).wait(1).to({y:558.4},0).wait(1).to({y:560.1},0).wait(1).to({y:561.8},0).wait(1).to({y:563.5},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).to({_off:true},1).wait(153));

	// אדםרגלימין8
	this.instance_16 = new lib.אדםרגלימין8("synched",0);
	this.instance_16.setTransform(385.65,778.75,1,1,0,0,0,22.9,7.8);
	this.instance_16._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_16).wait(782).to({_off:false},0).wait(1).to({regX:44.5,regY:104,rotation:-0.2929,x:407.75,y:872.8},0).wait(1).to({rotation:-0.5857,x:408.2,y:870.7},0).wait(1).to({rotation:-0.8786,x:408.7,y:868.6},0).wait(1).to({rotation:-1.1715,x:409.15,y:866.5},0).wait(1).to({rotation:-1.4643,x:409.7,y:864.3},0).wait(1).to({rotation:-1.7572,x:410.2,y:862.25},0).wait(1).to({rotation:-2.0501,x:410.6,y:860.1},0).wait(1).to({rotation:-2.343,x:411.15,y:857.95},0).wait(1).to({rotation:-2.6358,x:411.65,y:855.85},0).wait(1).to({rotation:-2.9287,x:412.1,y:853.7},0).wait(1).to({rotation:-3.2216,x:412.65,y:851.6},0).wait(1).to({rotation:-3.5144,x:413.05,y:849.4},0).wait(1).to({rotation:-3.8073,x:413.55,y:847.25},0).wait(1).to({rotation:-4.1002,x:414.1,y:845.15},0).wait(1).to({rotation:-4.393,x:414.5,y:843},0).wait(1).to({rotation:-4.6859,x:415,y:840.85},0).wait(1).to({rotation:-4.9788,x:415.5,y:838.7},0).wait(1).to({rotation:-5.2717,x:415.95,y:836.5},0).wait(1).to({rotation:-5.5645,x:416.5,y:834.4},0).wait(1).to({rotation:-5.8574,x:416.9,y:832.2},0).wait(1).to({rotation:-6.1503,x:417.45,y:830.1},0).wait(1).to({rotation:-6.4431,x:417.85,y:827.9},0).wait(1).to({rotation:-6.2204,x:417.5,y:829.65},0).wait(1).to({rotation:-5.9976,x:417.15,y:831.3},0).wait(1).to({rotation:-5.7748,x:416.75,y:832.95},0).wait(1).to({rotation:-5.552,x:416.45,y:834.65},0).wait(1).to({rotation:-5.3293,x:416.05,y:836.35},0).wait(1).to({rotation:-5.1065,x:415.7,y:838.1},0).wait(1).to({rotation:-4.8837,x:415.35,y:839.7},0).wait(1).to({rotation:-4.6609,x:414.95,y:841.45},0).wait(1).to({rotation:-4.4382,x:414.6,y:843.1},0).wait(1).to({rotation:-4.2154,x:414.25,y:844.8},0).wait(1).to({rotation:-3.9926,x:413.9,y:846.5},0).wait(1).to({rotation:-3.7698,x:413.5,y:848.1},0).wait(1).to({rotation:-3.5471,x:413.15,y:849.85},0).wait(1).to({rotation:-3.3243,x:412.75,y:851.45},0).wait(1).to({rotation:-3.1015,x:412.45,y:853.2},0).wait(1).to({rotation:-2.8787,x:412,y:854.85},0).wait(1).to({rotation:-2.656,x:411.65,y:856.55},0).wait(1).to({rotation:-2.4332,x:411.25,y:858.2},0).wait(1).to({rotation:-2.2104,x:410.9,y:859.85},0).wait(1).to({rotation:-1.9876,x:410.5,y:861.55},0).wait(1).to({rotation:-1.7649,x:410.2,y:863.25},0).wait(1).to({rotation:-1.5421,x:409.8,y:864.85},0).wait(1).to({rotation:-1.3193,x:409.45,y:866.55},0).wait(1).to({rotation:-1.0965,x:409.1,y:868.25},0).wait(1).to({rotation:-0.8738,x:408.7,y:869.85},0).wait(1).to({rotation:-0.651,x:408.35,y:871.55},0).wait(1).to({rotation:-0.4282,x:407.95,y:873.2},0).wait(1).to({rotation:-0.2054,x:407.55,y:874.85},0).wait(1).to({rotation:-0.3949,x:407.85,y:873},0).wait(1).to({rotation:-0.5844,x:408.2,y:871.2},0).wait(1).to({rotation:-0.7739,x:408.5,y:869.35},0).wait(1).to({rotation:-0.9633,x:408.85,y:867.5},0).wait(1).to({rotation:-1.1528,x:409.15,y:865.7},0).wait(1).to({rotation:-1.3423,x:409.5,y:863.8},0).wait(1).to({rotation:-1.5317,x:409.85,y:861.95},0).wait(1).to({rotation:-1.7212,x:410.1,y:860.15},0).wait(1).to({rotation:-1.9107,x:410.4,y:858.3},0).wait(1).to({rotation:-2.1001,x:410.7,y:856.45},0).wait(1).to({rotation:-2.2896,x:411.05,y:854.6},0).wait(1).to({rotation:-2.4791,x:411.35,y:852.8},0).wait(1).to({rotation:-2.6685,x:411.7,y:850.95},0).wait(1).to({rotation:-2.858,x:412,y:849.1},0).wait(1).to({rotation:-3.0475,x:412.35,y:847.25},0).wait(1).to({rotation:-3.2369,x:412.6,y:845.4},0).wait(1).to({rotation:-3.4264,x:412.9,y:843.55},0).wait(1).to({rotation:-3.6159,x:413.25,y:841.7},0).wait(1).to({rotation:-3.8054,x:413.55,y:839.85},0).wait(1).to({rotation:-3.9948,x:413.9,y:838},0).wait(1).to({rotation:-4.1843,x:414.2,y:836.1},0).wait(1).to({rotation:-4.3738,x:414.5,y:834.3},0).wait(1).to({rotation:-4.5632,x:414.8,y:832.4},0).wait(1).to({rotation:-4.7527,x:415.1,y:830.55},0).wait(1).to({rotation:-4.9422,x:415.45,y:828.7},0).wait(1).to({rotation:-4.754,x:415.1,y:830.3},0).wait(1).to({rotation:-4.5658,x:414.85,y:831.9},0).wait(1).to({rotation:-4.3776,x:414.5,y:833.55},0).wait(1).to({rotation:-4.1895,x:414.2,y:835.15},0).wait(1).to({rotation:-4.0013,x:413.9,y:836.8},0).wait(1).to({rotation:-3.8131,x:413.55,y:838.35},0).wait(1).to({rotation:-3.6249,x:413.25,y:840},0).wait(1).to({rotation:-3.4368,x:412.95,y:841.6},0).wait(1).to({rotation:-3.2486,x:412.65,y:843.25},0).wait(1).to({rotation:-3.0604,x:412.35,y:844.8},0).wait(1).to({rotation:-2.8722,x:412,y:846.35},0).wait(1).to({rotation:-2.6841,x:411.7,y:848},0).wait(1).to({rotation:-2.4959,x:411.4,y:849.6},0).wait(1).to({rotation:-2.3077,x:411.1,y:851.2},0).wait(1).to({rotation:-2.1195,x:410.75,y:852.85},0).wait(1).to({rotation:-1.9314,x:410.45,y:854.45},0).wait(1).to({rotation:-1.7432,x:410.15,y:856},0).wait(1).to({rotation:-1.555,x:409.8,y:857.6},0).wait(1).to({rotation:-1.3668,x:409.55,y:859.2},0).wait(1).to({rotation:-1.1787,x:409.2,y:860.85},0).wait(1).to({rotation:-0.9905,x:408.9,y:862.45},0).wait(1).to({rotation:-0.8023,x:408.55,y:864.05},0).wait(1).to({rotation:-0.6141,x:408.25,y:865.55},0).wait(1).to({rotation:-0.426,x:407.9,y:867.15},0).wait(1).to({rotation:-0.2378,x:407.65,y:868.75},0).wait(1).to({rotation:-0.0496,x:407.3,y:870.35},0).wait(1).to({rotation:0.1386,x:407,y:871.95},0).wait(1).to({rotation:0.3267,x:406.65,y:873.55},0).wait(1).to({rotation:0.5149,x:406.35,y:875.1},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).to({_off:true},1).wait(153));

	// אדםרגלשמאל8
	this.instance_17 = new lib.אדםרגלשמאל8("synched",0);
	this.instance_17.setTransform(298.1,785.9,1,1,0,0,0,37.8,11);
	this.instance_17._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_17).wait(782).to({_off:false},0).wait(1).to({regX:29.2,regY:101.9,rotation:0.3174,x:289,y:874.7},0).wait(1).to({rotation:0.6347,x:288.45,y:872.65},0).wait(1).to({rotation:0.9521,x:287.95,y:870.65},0).wait(1).to({rotation:1.2695,x:287.5,y:868.55},0).wait(1).to({rotation:1.5868,x:287,y:866.5},0).wait(1).to({rotation:1.9042,x:286.45,y:864.45},0).wait(1).to({rotation:2.2216,x:286,y:862.35},0).wait(1).to({rotation:2.5389,x:285.45,y:860.3},0).wait(1).to({rotation:2.8563,x:284.9,y:858.2},0).wait(1).to({rotation:3.1737,x:284.45,y:856.15},0).wait(1).to({rotation:3.491,x:283.95,y:854.1},0).wait(1).to({rotation:3.8084,x:283.5,y:852},0).wait(1).to({rotation:4.1258,x:282.9,y:849.95},0).wait(1).to({rotation:4.4431,x:282.45,y:847.85},0).wait(1).to({rotation:4.7605,x:281.95,y:845.75},0).wait(1).to({rotation:5.0779,x:281.5,y:843.65},0).wait(1).to({rotation:5.3952,x:280.95,y:841.55},0).wait(1).to({rotation:5.7126,x:280.45,y:839.45},0).wait(1).to({rotation:6.03,x:280,y:837.35},0).wait(1).to({rotation:6.3473,x:279.45,y:835.25},0).wait(1).to({rotation:6.6647,x:278.95,y:833.15},0).wait(1).to({rotation:6.9821,x:278.5,y:831.05},0).wait(1).to({rotation:6.7424,x:278.9,y:832.75},0).wait(1).to({rotation:6.5027,x:279.2,y:834.35},0).wait(1).to({rotation:6.263,x:279.65,y:836.05},0).wait(1).to({rotation:6.0233,x:280,y:837.65},0).wait(1).to({rotation:5.7837,x:280.4,y:839.35},0).wait(1).to({rotation:5.544,x:280.7,y:840.9},0).wait(1).to({rotation:5.3043,x:281.1,y:842.6},0).wait(1).to({rotation:5.0646,x:281.5,y:844.25},0).wait(1).to({rotation:4.8249,x:281.9,y:845.9},0).wait(1).to({rotation:4.5853,x:282.25,y:847.5},0).wait(1).to({rotation:4.3456,x:282.6,y:849.15},0).wait(1).to({rotation:4.1059,x:282.95,y:850.8},0).wait(1).to({rotation:3.8662,x:283.4,y:852.4},0).wait(1).to({rotation:3.6265,x:283.75,y:854.05},0).wait(1).to({rotation:3.3869,x:284.15,y:855.65},0).wait(1).to({rotation:3.1472,x:284.5,y:857.3},0).wait(1).to({rotation:2.9075,x:284.9,y:858.95},0).wait(1).to({rotation:2.6678,x:285.25,y:860.55},0).wait(1).to({rotation:2.4281,x:285.6,y:862.2},0).wait(1).to({rotation:2.1885,x:286,y:863.8},0).wait(1).to({rotation:1.9488,x:286.4,y:865.45},0).wait(1).to({rotation:1.7091,x:286.75,y:867},0).wait(1).to({rotation:1.4694,x:287.15,y:868.65},0).wait(1).to({rotation:1.2297,x:287.5,y:870.35},0).wait(1).to({rotation:0.9901,x:287.9,y:871.9},0).wait(1).to({rotation:0.7504,x:288.25,y:873.55},0).wait(1).to({rotation:0.5107,x:288.65,y:875.1},0).wait(1).to({rotation:0.271,x:289.05,y:876.75},0).wait(1).to({rotation:0.4791,x:288.7,y:874.95},0).wait(1).to({rotation:0.6872,x:288.4,y:873.15},0).wait(1).to({rotation:0.8952,x:288.05,y:871.35},0).wait(1).to({rotation:1.1033,x:287.75,y:869.55},0).wait(1).to({rotation:1.3114,x:287.4,y:867.7},0).wait(1).to({rotation:1.5195,x:287.1,y:865.9},0).wait(1).to({rotation:1.7275,x:286.75,y:864.15},0).wait(1).to({rotation:1.9356,x:286.4,y:862.35},0).wait(1).to({rotation:2.1437,x:286.1,y:860.6},0).wait(1).to({rotation:2.3517,x:285.75,y:858.75},0).wait(1).to({rotation:2.5598,x:285.4,y:856.95},0).wait(1).to({rotation:2.7679,x:285.1,y:855.15},0).wait(1).to({rotation:2.9759,x:284.75,y:853.3},0).wait(1).to({rotation:3.184,x:284.45,y:851.5},0).wait(1).to({rotation:3.3921,x:284.1,y:849.7},0).wait(1).to({rotation:3.6002,x:283.8,y:847.9},0).wait(1).to({rotation:3.8082,x:283.5,y:846.05},0).wait(1).to({rotation:4.0163,x:283.15,y:844.25},0).wait(1).to({rotation:4.2244,x:282.8,y:842.45},0).wait(1).to({rotation:4.4324,x:282.5,y:840.65},0).wait(1).to({rotation:4.6405,x:282.15,y:838.8},0).wait(1).to({rotation:4.8486,x:281.85,y:837},0).wait(1).to({rotation:5.0566,x:281.5,y:835.15},0).wait(1).to({rotation:5.2647,x:281.2,y:833.35},0).wait(1).to({rotation:5.4728,x:280.85,y:831.55},0).wait(1).to({rotation:5.2841,x:281.15,y:833.1},0).wait(1).to({rotation:5.0954,x:281.45,y:834.7},0).wait(1).to({rotation:4.9066,x:281.75,y:836.3},0).wait(1).to({rotation:4.7179,x:282,y:837.8},0).wait(1).to({rotation:4.5292,x:282.3,y:839.4},0).wait(1).to({rotation:4.3405,x:282.6,y:840.95},0).wait(1).to({rotation:4.1518,x:282.85,y:842.55},0).wait(1).to({rotation:3.9631,x:283.25,y:844.1},0).wait(1).to({rotation:3.7743,x:283.55,y:845.65},0).wait(1).to({rotation:3.5856,x:283.85,y:847.25},0).wait(1).to({rotation:3.3969,x:284.1,y:848.8},0).wait(1).to({rotation:3.2082,x:284.4,y:850.4},0).wait(1).to({rotation:3.0195,x:284.7,y:851.9},0).wait(1).to({rotation:2.8308,x:284.95,y:853.5},0).wait(1).to({rotation:2.642,x:285.25,y:855.05},0).wait(1).to({rotation:2.4533,x:285.6,y:856.6},0).wait(1).to({rotation:2.2646,x:285.9,y:858.15},0).wait(1).to({rotation:2.0759,x:286.2,y:859.7},0).wait(1).to({rotation:1.8872,x:286.5,y:861.25},0).wait(1).to({rotation:1.6985,x:286.8,y:862.8},0).wait(1).to({rotation:1.5097,x:287.1,y:864.35},0).wait(1).to({rotation:1.321,x:287.4,y:865.9},0).wait(1).to({rotation:1.1323,x:287.7,y:867.55},0).wait(1).to({rotation:0.9436,x:287.95,y:869.05},0).wait(1).to({rotation:0.7549,x:288.25,y:870.6},0).wait(1).to({rotation:0.5662,x:288.6,y:872.15},0).wait(1).to({rotation:0.3774,x:288.9,y:873.7},0).wait(1).to({rotation:0.1887,x:289.15,y:875.25},0).wait(1).to({rotation:0,x:289.5,y:876.8},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).to({_off:true},1).wait(153));

	// וילוןשמאל
	this.instance_18 = new lib.וילוןימין("synched",0);
	this.instance_18.setTransform(514.6,376.85,1.2007,1,0,0,180,30.8,203.2);
	this.instance_18._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_18).wait(782).to({_off:false},0).to({_off:true},121).wait(153));

	// וילוןימין
	this.instance_19 = new lib.וילוןימין("synched",0);
	this.instance_19.setTransform(674.9,376.85,1,1,0,0,0,30.7,203.2);
	this.instance_19._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_19).wait(782).to({_off:false},0).to({_off:true},121).wait(153));

	// sea1
	this.instance_20 = new lib.sea1("synched",0);
	this.instance_20.setTransform(611.3,530.3,1.1958,1,0,0,0,65,44.8);
	this.instance_20._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_20).wait(782).to({_off:false},0).wait(1).to({regX:64.8,regY:44.7,scaleX:1.3845,scaleY:0.9987,x:610.2,y:530.15},0).wait(1).to({scaleX:1.3857,scaleY:0.9975,x:609.5},0).wait(1).to({scaleX:1.3869,scaleY:0.9962,x:608.7,y:530.1},0).wait(1).to({scaleX:1.3882,scaleY:0.9949,x:608,y:530.05},0).wait(1).to({scaleX:1.3894,scaleY:0.9937,x:607.25,y:530},0).wait(1).to({scaleX:1.3906,scaleY:0.9924,x:606.45},0).wait(1).to({scaleX:1.3919,scaleY:0.9912,x:605.75,y:529.95},0).wait(1).to({scaleX:1.3931,scaleY:0.9899,x:604.95},0).wait(1).to({scaleX:1.3943,scaleY:0.9886,x:604.25},0).wait(1).to({scaleX:1.3956,scaleY:0.9874,x:603.5,y:529.9},0).wait(1).to({scaleX:1.3968,scaleY:0.9861,x:602.7},0).wait(1).to({scaleX:1.398,scaleY:0.9848,x:602,y:529.8},0).wait(1).to({scaleX:1.3993,scaleY:0.9836,x:601.2},0).wait(1).to({scaleX:1.4005,scaleY:0.9823,x:600.5,y:529.75},0).wait(1).to({scaleX:1.4017,scaleY:0.9811,x:599.75},0).wait(1).to({scaleX:1.403,scaleY:0.9798,x:598.95},0).wait(1).to({scaleX:1.4042,scaleY:0.9785,x:598.25,y:529.7},0).wait(1).to({scaleX:1.4054,scaleY:0.9773,x:597.45},0).wait(1).to({scaleX:1.4067,scaleY:0.976,x:596.75,y:529.65},0).wait(1).to({scaleX:1.4079,scaleY:0.9747,x:596,y:529.6},0).wait(1).to({scaleX:1.4091,scaleY:0.9735,x:595.2,y:529.55},0).wait(1).to({scaleX:1.4104,scaleY:0.9722,x:594.5},0).wait(1).to({scaleX:1.4116,scaleY:0.971,x:593.7,y:529.5},0).wait(1).to({scaleX:1.4124,scaleY:0.9697,x:593.05,y:529.65},0).wait(1).to({scaleX:1.4132,scaleY:0.9684,x:592.45,y:529.8},0).wait(1).to({scaleX:1.414,scaleY:0.9672,x:591.8,y:529.95},0).wait(1).to({scaleX:1.4149,scaleY:0.9659,x:591.15,y:530.1},0).wait(1).to({scaleX:1.4157,scaleY:0.9646,x:590.5,y:530.2},0).wait(1).to({scaleX:1.4165,scaleY:0.9634,x:589.85,y:530.35},0).wait(1).to({scaleX:1.4173,scaleY:0.9621,x:589.25,y:530.5},0).wait(1).to({scaleX:1.4181,scaleY:0.9609,x:588.6,y:530.65},0).wait(1).to({scaleX:1.4189,scaleY:0.9596,x:587.95,y:530.8},0).wait(1).to({scaleX:1.4197,scaleY:0.9583,x:587.3,y:530.95},0).wait(1).to({scaleX:1.4206,scaleY:0.9571,x:586.65,y:531.1},0).wait(1).to({scaleX:1.4214,scaleY:0.9558,x:586,y:531.2},0).wait(1).to({scaleX:1.4222,scaleY:0.9545,x:585.35,y:531.35},0).wait(1).to({scaleX:1.423,scaleY:0.9533,x:584.7,y:531.5},0).wait(1).to({scaleX:1.4238,scaleY:0.952,x:584.05,y:531.65},0).wait(1).to({scaleX:1.4246,scaleY:0.9508,x:583.4,y:531.8},0).wait(1).to({scaleX:1.4254,scaleY:0.9495,x:582.75,y:531.95},0).wait(1).to({scaleX:1.4262,scaleY:0.9482,x:582.1,y:532.1},0).wait(1).to({scaleX:1.4271,scaleY:0.947,x:581.45,y:532.25},0).wait(1).to({scaleX:1.4279,scaleY:0.9457,x:580.85,y:532.35},0).wait(1).to({scaleX:1.4287,scaleY:0.9444,x:580.2,y:532.5},0).wait(1).to({scaleX:1.4295,scaleY:0.9432,x:579.55,y:532.65},0).wait(1).to({scaleX:1.4303,scaleY:0.9419,x:578.9,y:532.8},0).wait(1).to({scaleX:1.4296,scaleY:0.9406,x:580.3,y:532.9},0).wait(1).to({scaleX:1.4288,scaleY:0.9394,x:581.7,y:533},0).wait(1).to({scaleX:1.428,scaleY:0.9381,x:583.05,y:533.1},0).wait(1).to({scaleX:1.4273,scaleY:0.9369,x:584.45,y:533.15},0).wait(1).to({scaleX:1.4265,scaleY:0.9356,x:585.85,y:533.2},0).wait(1).to({scaleX:1.4258,scaleY:0.9343,x:587.2,y:533.3},0).wait(1).to({scaleX:1.425,scaleY:0.9331,x:588.6,y:533.4},0).wait(1).to({scaleX:1.4242,scaleY:0.9318,x:590,y:533.5},0).wait(1).to({scaleX:1.4235,scaleY:0.9305,x:591.35,y:533.6},0).wait(1).to({scaleX:1.4227,scaleY:0.9293,x:592.75,y:533.7},0).wait(1).to({scaleX:1.422,scaleY:0.928,x:594.15,y:533.75},0).wait(1).to({scaleX:1.4212,scaleY:0.9268,x:595.5,y:533.85},0).wait(1).to({scaleX:1.4205,scaleY:0.9255,x:596.9,y:533.9},0).wait(1).to({scaleX:1.4197,scaleY:0.9242,x:598.3,y:534},0).wait(1).to({scaleX:1.4189,scaleY:0.923,x:599.65,y:534.1},0).wait(1).to({scaleX:1.4182,scaleY:0.9217,x:601.05,y:534.2},0).wait(1).to({scaleX:1.4286,scaleY:0.9204,x:600.9,y:534.3},0).wait(1).to({scaleX:1.439,scaleY:0.9192,x:600.8,y:534.4},0).wait(1).to({scaleX:1.4494,scaleY:0.9179,x:600.65,y:534.5},0).wait(1).to({scaleX:1.4598,scaleY:0.9167,x:600.55,y:534.55},0).wait(1).to({scaleX:1.4702,scaleY:0.9154,x:600.4,y:534.65},0).wait(1).to({scaleX:1.4806,scaleY:0.9141,x:600.3,y:534.7},0).wait(1).to({scaleX:1.491,scaleY:0.9129,x:600.15,y:534.8},0).wait(1).to({scaleX:1.5014,scaleY:0.9116,x:600.05,y:534.9},0).wait(1).to({scaleX:1.4982,scaleY:0.9104,x:597.85,y:535},0).wait(1).to({scaleX:1.4951,scaleY:0.9091,x:595.6,y:535.1},0).wait(1).to({scaleX:1.4919,scaleY:0.9079,x:593.4,y:535.15},0).wait(1).to({scaleX:1.4888,scaleY:0.9066,x:591.1,y:535.25},0).wait(1).to({scaleX:1.4856,scaleY:0.9054,x:588.9,y:535.3},0).wait(1).to({scaleX:1.4825,scaleY:0.9042,x:586.65,y:535.4},0).wait(1).to({scaleX:1.4793,scaleY:0.9029,x:584.4,y:535.45},0).wait(1).to({scaleX:1.4762,scaleY:0.9017,x:582.2,y:535.55},0).wait(1).to({scaleX:1.473,scaleY:0.9004,x:579.95,y:535.65},0).wait(1).to({scaleX:1.4699,scaleY:0.8992,x:580.9,y:535.6},0).wait(1).to({scaleX:1.4667,scaleY:0.898,x:581.8,y:535.55},0).wait(1).to({scaleX:1.4636,scaleY:0.8967,x:582.7},0).wait(1).to({scaleX:1.4604,scaleY:0.8955,x:583.6,y:535.5},0).wait(1).to({scaleX:1.4573,scaleY:0.8943,x:584.5,y:535.45},0).wait(1).to({scaleX:1.4541,scaleY:0.893,x:585.35,y:535.4},0).wait(1).to({scaleX:1.4509,scaleY:0.8918,x:586.25,y:535.35},0).wait(1).to({scaleX:1.4478,scaleY:0.8905,x:587.2},0).wait(1).to({scaleX:1.4446,scaleY:0.8893,x:588.1,y:535.3},0).wait(1).to({scaleX:1.4415,scaleY:0.8881,x:589},0).wait(1).to({scaleX:1.4383,scaleY:0.8868,x:589.9,y:535.25},0).wait(1).to({scaleX:1.4352,scaleY:0.8856,x:590.8,y:535.2},0).wait(1).to({scaleX:1.432,scaleY:0.8843,x:591.7},0).wait(1).to({scaleX:1.4289,scaleY:0.8831,x:592.6,y:535.1},0).wait(1).to({scaleX:1.4257,scaleY:0.8819,x:593.5},0).wait(1).to({scaleX:1.4226,scaleY:0.8806,x:594.45,y:535.05},0).wait(1).to({scaleX:1.4194,scaleY:0.8794,x:595.35,y:535},0).wait(1).to({scaleX:1.4163,scaleY:0.8781,x:596.2},0).wait(1).to({scaleX:1.4131,scaleY:0.8769,x:597.1,y:534.95},0).wait(1).to({scaleX:1.41,scaleY:0.8757,x:598},0).wait(1).to({scaleX:1.4068,scaleY:0.8744,x:598.9,y:534.9},0).wait(1).to({scaleX:1.4036,scaleY:0.8732,x:599.8,y:534.85},0).wait(1).to({scaleX:1.4005,scaleY:0.8719,x:600.75},0).wait(1).to({scaleX:1.3973,scaleY:0.8707,x:601.65,y:534.75},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).to({_off:true},1).wait(153));

	// bg1
	this.instance_21 = new lib.CachedBmp_4();
	this.instance_21.setTransform(-30.4,-0.25,0.5,0.5);
	this.instance_21._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_21).wait(782).to({_off:false},0).to({_off:true},121).wait(153));

	// fadeout
	this.instance_22 = new lib.fade();
	this.instance_22.setTransform(563.4,503.45,1.1076,1,0,0,0,523,503.2);
	this.instance_22.alpha = 0;
	this.instance_22._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_22).wait(767).to({_off:false},0).wait(1).to({regX:523.5,x:563.95,alpha:0.0714},0).wait(1).to({alpha:0.1429},0).wait(1).to({alpha:0.2143},0).wait(1).to({alpha:0.2857},0).wait(1).to({alpha:0.3571},0).wait(1).to({alpha:0.4286},0).wait(1).to({alpha:0.5},0).wait(1).to({alpha:0.5714},0).wait(1).to({alpha:0.6429},0).wait(1).to({alpha:0.7143},0).wait(1).to({alpha:0.7857},0).wait(1).to({alpha:0.8571},0).wait(1).to({alpha:0.9286},0).wait(1).to({alpha:1},0).to({_off:true},1).wait(274));

	// fadein
	this.instance_23 = new lib.fade();
	this.instance_23.setTransform(563.4,503.45,1.1918,1,0,0,0,523.1,503.2);
	this.instance_23._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_23).wait(661).to({_off:false},0).wait(1).to({regX:523.5,scaleX:1.1919,x:563.9,alpha:0.9231},0).wait(1).to({alpha:0.8462},0).wait(1).to({alpha:0.7692},0).wait(1).to({alpha:0.6923},0).wait(1).to({alpha:0.6154},0).wait(1).to({alpha:0.5385},0).wait(1).to({alpha:0.4615},0).wait(1).to({alpha:0.3846},0).wait(1).to({alpha:0.3077},0).wait(1).to({alpha:0.2308},0).wait(1).to({alpha:0.1538},0).wait(1).to({alpha:0.0769},0).wait(1).to({alpha:0},0).to({_off:true},1).wait(381));

	// מוזיקה7
	this.instance_24 = new lib.תווים7_דהוי("synched",10);
	this.instance_24.setTransform(848.2,437.75,1,1,0,0,0,76.5,22.2);
	this.instance_24._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_24).wait(661).to({_off:false},0).to({_off:true},121).wait(274));

	// ידואייפד7
	this.instance_25 = new lib.ידואייפד7("synched",0);
	this.instance_25.setTransform(795.55,548.45,1,1,0,0,0,118.1,131.9);
	this.instance_25._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_25).wait(661).to({_off:false},0).wait(1).to({regX:67.4,regY:72.5,rotation:0.1355,x:745,y:488.9},0).wait(1).to({rotation:0.2711,x:745.1,y:488.75},0).wait(1).to({rotation:0.4066,x:745.25,y:488.7},0).wait(1).to({rotation:0.5421,x:745.4,y:488.55},0).wait(1).to({rotation:0.6777,x:745.55,y:488.45},0).wait(1).to({rotation:0.8132,x:745.65,y:488.3},0).wait(1).to({rotation:0.9488,x:745.85,y:488.2},0).wait(1).to({rotation:1.0843,x:746,y:488.1},0).wait(1).to({rotation:1.2198,x:746.1,y:488},0).wait(1).to({rotation:1.3554,x:746.3,y:487.85},0).wait(1).to({rotation:1.4909,x:746.4,y:487.7},0).wait(1).to({rotation:1.6264,x:746.5,y:487.6},0).wait(1).to({rotation:1.762,x:746.65,y:487.45},0).wait(1).to({rotation:1.8975,x:746.8,y:487.4},0).wait(1).to({rotation:2.033,x:747,y:487.25},0).wait(1).to({rotation:2.1686,x:747.1,y:487.15},0).wait(1).to({rotation:2.3041,x:747.3,y:487.05},0).wait(1).to({rotation:2.4396,x:747.4,y:486.9},0).wait(1).to({rotation:2.5752,x:747.55,y:486.85},0).wait(1).to({rotation:2.7107,x:747.65,y:486.7},0).wait(1).to({rotation:2.8463,x:747.8,y:486.55},0).wait(1).to({rotation:2.9818,x:748,y:486.45},0).wait(1).to({rotation:3.1173,x:748.15,y:486.35},0).wait(1).to({rotation:3.2529,x:748.3,y:486.25},0).wait(1).to({rotation:3.3884,x:748.45,y:486.15},0).wait(1).to({rotation:3.5239,x:748.55,y:486},0).wait(1).to({rotation:3.6595,x:748.7,y:485.9},0).wait(1).to({rotation:3.795,x:748.85,y:485.8},0).wait(1).to({rotation:3.9305,x:749.05,y:485.7},0).wait(1).to({rotation:4.0661,x:749.2,y:485.6},0).wait(1).to({rotation:4.2016,x:749.3,y:485.5},0).wait(1).to({rotation:4.3371,x:749.45,y:485.35},0).wait(1).to({rotation:4.4727,x:749.6,y:485.25},0).wait(1).to({rotation:4.6082,x:749.8,y:485.1},0).wait(1).to({rotation:4.7438,x:749.9,y:485},0).wait(1).to({rotation:4.8793,x:750.1,y:484.95},0).wait(1).to({rotation:5.0148,x:750.2,y:484.8},0).wait(1).to({rotation:5.1504,x:750.4,y:484.7},0).wait(1).to({rotation:5.2859,x:750.5,y:484.6},0).wait(1).to({rotation:5.4214,x:750.65,y:484.45},0).wait(1).to({rotation:5.557,x:750.85,y:484.4},0).wait(1).to({rotation:5.6925,x:750.95,y:484.3},0).wait(1).to({rotation:5.828,x:751.15,y:484.15},0).wait(1).to({rotation:5.9636,x:751.25,y:484.05},0).wait(1).to({rotation:6.0991,x:751.4,y:483.95},0).wait(1).to({rotation:6.2346,x:751.6,y:483.85},0).wait(1).to({rotation:6.3702,x:751.75,y:483.8},0).wait(1).to({rotation:6.5057,x:751.9,y:483.7},0).wait(1).to({rotation:6.6413,x:752.05,y:483.55},0).wait(1).to({rotation:6.7768,x:752.2,y:483.45},0).wait(1).to({rotation:6.9123,x:752.3,y:483.3},0).wait(1).to({rotation:7.0479,x:752.5,y:483.25},0).wait(1).to({rotation:7.1834,x:752.65,y:483.2},0).wait(1).to({rotation:7.3189,x:752.8,y:483.05},0).wait(1).to({rotation:7.4545,x:753,y:482.95},0).wait(1).to({rotation:7.3729,x:752.9,y:483},0).wait(1).to({rotation:7.2913,x:752.8,y:483.05},0).wait(1).to({rotation:7.2097,x:752.65,y:483.15},0).wait(1).to({rotation:7.1281,x:752.6,y:483.2},0).wait(1).to({rotation:7.0465,x:752.5,y:483.25},0).wait(1).to({rotation:6.9649,x:752.4,y:483.3},0).wait(1).to({rotation:6.8833,x:752.3,y:483.4},0).wait(1).to({rotation:6.8017,x:752.2,y:483.45},0).wait(1).to({rotation:6.7201,x:752.15,y:483.5},0).wait(1).to({rotation:6.6386,x:752,y:483.55},0).wait(1).to({rotation:6.557,x:751.9,y:483.65},0).wait(1).to({rotation:6.4754,x:751.8,y:483.7},0).wait(1).to({rotation:6.3938,y:483.75},0).wait(1).to({rotation:6.3122,x:751.7,y:483.8},0).wait(1).to({rotation:6.2306,x:751.6,y:483.85},0).wait(1).to({rotation:6.149,x:751.5,y:483.95},0).wait(1).to({rotation:6.0674,x:751.4,y:484},0).wait(1).to({rotation:5.9858,x:751.35,y:484.1},0).wait(1).to({rotation:5.9042,x:751.2,y:484.15},0).wait(1).to({rotation:5.8226,x:751.1},0).wait(1).to({rotation:5.7411,x:751,y:484.25},0).wait(1).to({rotation:5.6595,x:750.9,y:484.3},0).wait(1).to({rotation:5.5779,x:750.85,y:484.35},0).wait(1).to({rotation:5.4963,x:750.75,y:484.4},0).wait(1).to({rotation:5.4147,x:750.65,y:484.5},0).wait(1).to({rotation:5.3331,x:750.55,y:484.55},0).wait(1).to({rotation:5.2515,x:750.45,y:484.6},0).wait(1).to({rotation:5.1699,x:750.4,y:484.65},0).wait(1).to({rotation:5.0883,x:750.3,y:484.75},0).wait(1).to({rotation:5.0067,x:750.2,y:484.8},0).wait(1).to({rotation:4.9251,x:750.15,y:484.9},0).wait(1).to({rotation:4.8435,x:750.05,y:484.95},0).wait(1).to({rotation:4.762,x:749.95,y:485.05},0).wait(1).to({rotation:4.6804,x:749.85,y:485.1},0).wait(1).to({rotation:4.5988,x:749.8,y:485.15},0).wait(1).to({rotation:4.5172,x:749.7,y:485.2},0).wait(1).to({rotation:4.4356,x:749.6,y:485.3},0).wait(1).to({rotation:4.354,x:749.5,y:485.35},0).wait(1).to({rotation:4.2724,x:749.4,y:485.4},0).wait(1).to({rotation:4.1908,x:749.3,y:485.5},0).wait(1).to({rotation:4.1092,x:749.25,y:485.55},0).wait(1).to({rotation:4.0276,x:749.15,y:485.6},0).wait(1).to({rotation:3.946,x:749.05,y:485.7},0).wait(1).to({rotation:3.8644,x:748.95,y:485.75},0).wait(1).to({rotation:3.7829,x:748.85,y:485.8},0).wait(1).to({rotation:3.7013,x:748.75,y:485.9},0).wait(1).to({rotation:3.6197,x:748.65,y:485.95},0).wait(1).to({rotation:3.5381,x:748.6,y:486},0).wait(1).to({rotation:3.4565,x:748.55,y:486.05},0).wait(1).to({rotation:3.3749,x:748.45,y:486.1},0).wait(1).to({rotation:3.2933,x:748.35,y:486.2},0).wait(1).to({rotation:3.2117,x:748.25,y:486.3},0).wait(1).to({rotation:3.1301,x:748.15,y:486.35},0).wait(1).to({rotation:3.0485,x:748.05,y:486.45},0).wait(1).to({rotation:2.9669,x:747.95,y:486.5},0).wait(1).to({rotation:2.8854,x:747.85,y:486.55},0).wait(1).to({rotation:2.8038,x:747.75,y:486.6},0).wait(1).to({rotation:2.7222,x:747.65,y:486.65},0).wait(1).to({rotation:2.6406,y:486.7},0).wait(1).to({rotation:2.559,x:747.55,y:486.85},0).wait(1).to({rotation:2.4774,x:747.45,y:486.9},0).wait(1).to({rotation:2.3958,x:747.35,y:486.95},0).wait(1).to({rotation:2.3142,x:747.25,y:487},0).wait(1).to({rotation:2.2326,x:747.2,y:487.1},0).wait(1).to({startPosition:0},0).to({_off:true},1).wait(274));

	// סיפורים
	this.instance_26 = new lib.CachedBmp_5();
	this.instance_26.setTransform(146,150.15,0.5,0.5);
	this.instance_26._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_26).wait(661).to({_off:false},0).to({_off:true},121).wait(274));

	// סיפורים
	this.instance_27 = new lib.CachedBmp_6();
	this.instance_27.setTransform(563.1,326.2,0.5,0.5);
	this.instance_27._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_27).wait(661).to({_off:false},0).to({_off:true},121).wait(274));

	// וילוןשמאל
	this.instance_28 = new lib.וילוןימין("synched",0);
	this.instance_28.setTransform(514.6,376.85,1.2007,1,0,0,180,30.8,203.2);
	this.instance_28._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_28).wait(661).to({_off:false},0).to({_off:true},121).wait(274));

	// וילוןימין
	this.instance_29 = new lib.וילוןימין("synched",0);
	this.instance_29.setTransform(674.9,376.85,1,1,0,0,0,30.7,203.2);
	this.instance_29._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_29).wait(661).to({_off:false},0).to({_off:true},121).wait(274));

	// sea1
	this.instance_30 = new lib.sea1("synched",0);
	this.instance_30.setTransform(611.3,530.3,1.1958,1,0,0,0,65,44.8);
	this.instance_30._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_30).wait(661).to({_off:false},0).wait(1).to({regX:64.8,regY:44.7,scaleX:1.3845,scaleY:0.9989,x:610.3,y:530.15},0).wait(1).to({scaleX:1.3856,scaleY:0.9978,x:609.65,y:530.1},0).wait(1).to({scaleX:1.3867,scaleY:0.9967,x:609},0).wait(1).to({scaleX:1.3877,scaleY:0.9956,x:608.3,y:530.05},0).wait(1).to({scaleX:1.3888,scaleY:0.9945,x:607.65},0).wait(1).to({scaleX:1.3899,scaleY:0.9935,x:607,y:530},0).wait(1).to({scaleX:1.391,scaleY:0.9924,x:606.35},0).wait(1).to({scaleX:1.3921,scaleY:0.9913,x:605.65,y:529.95},0).wait(1).to({scaleX:1.3932,scaleY:0.9902,x:605.05},0).wait(1).to({scaleX:1.3942,scaleY:0.9891,x:604.35,y:529.9},0).wait(1).to({scaleX:1.3953,scaleY:0.988,x:603.65},0).wait(1).to({scaleX:1.3964,scaleY:0.9869,x:603.05,y:529.85},0).wait(1).to({scaleX:1.3975,scaleY:0.9858,x:602.35},0).wait(1).to({scaleX:1.3986,scaleY:0.9847,x:601.7,y:529.8},0).wait(1).to({scaleX:1.3997,scaleY:0.9836,x:601.05},0).wait(1).to({scaleX:1.4008,scaleY:0.9825,x:600.35,y:529.75},0).wait(1).to({scaleX:1.4018,scaleY:0.9814,x:599.7},0).wait(1).to({scaleX:1.4029,scaleY:0.9804,x:599.05,y:529.7},0).wait(1).to({scaleX:1.404,scaleY:0.9793,x:598.4},0).wait(1).to({scaleX:1.4051,scaleY:0.9782,x:597.7,y:529.65},0).wait(1).to({scaleX:1.4062,scaleY:0.9771,x:597.05,y:529.7},0).wait(1).to({scaleX:1.4073,scaleY:0.976,x:596.4,y:529.65},0).wait(1).to({scaleX:1.4084,scaleY:0.9749,x:595.7,y:529.6},0).wait(1).to({scaleX:1.4094,scaleY:0.9738,x:595.1},0).wait(1).to({scaleX:1.4105,scaleY:0.9727,x:594.4,y:529.55},0).wait(1).to({scaleX:1.4116,scaleY:0.9716,x:593.7},0).wait(1).to({scaleX:1.4123,scaleY:0.9705,x:593.15,y:529.65},0).wait(1).to({scaleX:1.413,scaleY:0.9694,x:592.6,y:529.8},0).wait(1).to({scaleX:1.4137,scaleY:0.9684,x:592.1,y:529.9},0).wait(1).to({scaleX:1.4144,scaleY:0.9673,x:591.55,y:530},0).wait(1).to({scaleX:1.4151,scaleY:0.9662,x:591,y:530.15},0).wait(1).to({scaleX:1.4158,scaleY:0.9651,x:590.45,y:530.25},0).wait(1).to({scaleX:1.4165,scaleY:0.964,x:589.9,y:530.4},0).wait(1).to({scaleX:1.4172,scaleY:0.9629,x:589.35,y:530.5},0).wait(1).to({scaleX:1.4178,scaleY:0.9618,x:588.8,y:530.6},0).wait(1).to({scaleX:1.4185,scaleY:0.9607,x:588.2,y:530.75},0).wait(1).to({scaleX:1.4192,scaleY:0.9596,x:587.65,y:530.85},0).wait(1).to({scaleX:1.4199,scaleY:0.9585,x:587.15,y:531},0).wait(1).to({scaleX:1.4206,scaleY:0.9574,x:586.6,y:531.1},0).wait(1).to({scaleX:1.4213,scaleY:0.9563,x:586.05,y:531.2},0).wait(1).to({scaleX:1.422,scaleY:0.9553,x:585.5,y:531.35},0).wait(1).to({scaleX:1.4227,scaleY:0.9542,x:584.95,y:531.45},0).wait(1).to({scaleX:1.4234,scaleY:0.9531,x:584.4,y:531.6},0).wait(1).to({scaleX:1.4241,scaleY:0.952,x:583.85,y:531.7},0).wait(1).to({scaleX:1.4248,scaleY:0.9509,x:583.25,y:531.85},0).wait(1).to({scaleX:1.4255,scaleY:0.9498,x:582.7,y:531.95},0).wait(1).to({scaleX:1.4262,scaleY:0.9487,x:582.2,y:532.05},0).wait(1).to({scaleX:1.4268,scaleY:0.9476,x:581.65,y:532.2},0).wait(1).to({scaleX:1.4275,scaleY:0.9465,x:581.1,y:532.3},0).wait(1).to({scaleX:1.4282,scaleY:0.9454,x:580.55,y:532.45},0).wait(1).to({scaleX:1.4289,scaleY:0.9443,x:580,y:532.55},0).wait(1).to({scaleX:1.4296,scaleY:0.9433,x:579.45,y:532.65},0).wait(1).to({scaleX:1.4303,scaleY:0.9422,x:578.9,y:532.8},0).wait(1).to({scaleX:1.4296,scaleY:0.9411,x:580.15,y:532.85},0).wait(1).to({scaleX:1.429,scaleY:0.94,x:581.35,y:532.95},0).wait(1).to({scaleX:1.4283,scaleY:0.9389,x:582.6,y:533},0).wait(1).to({scaleX:1.4276,scaleY:0.9378,x:583.8,y:533.1},0).wait(1).to({scaleX:1.4269,scaleY:0.9367,x:585.05,y:533.15},0).wait(1).to({scaleX:1.4263,scaleY:0.9356,x:586.25,y:533.25},0).wait(1).to({scaleX:1.4256,scaleY:0.9345,x:587.55,y:533.3},0).wait(1).to({scaleX:1.4249,scaleY:0.9334,x:588.75,y:533.4},0).wait(1).to({scaleX:1.4242,scaleY:0.9323,x:590,y:533.5},0).wait(1).to({scaleX:1.4236,scaleY:0.9312,x:591.2,y:533.6},0).wait(1).to({scaleX:1.4229,scaleY:0.9302,x:592.45,y:533.65},0).wait(1).to({scaleX:1.4222,scaleY:0.9291,x:593.65,y:533.75},0).wait(1).to({scaleX:1.4215,scaleY:0.928,x:594.85,y:533.8},0).wait(1).to({scaleX:1.4209,scaleY:0.9269,x:596.1,y:533.9},0).wait(1).to({scaleX:1.4202,scaleY:0.9258,x:597.35,y:533.95},0).wait(1).to({scaleX:1.4195,scaleY:0.9247,x:598.6,y:534.05},0).wait(1).to({scaleX:1.4189,scaleY:0.9236,x:599.8,y:534.1},0).wait(1).to({scaleX:1.4182,scaleY:0.9225,x:601.05,y:534.2},0).wait(1).to({scaleX:1.4265,scaleY:0.9214,x:600.95,y:534.25},0).wait(1).to({scaleX:1.4348,scaleY:0.9203,x:600.85,y:534.35},0).wait(1).to({scaleX:1.4431,scaleY:0.9192,x:600.75,y:534.4},0).wait(1).to({scaleX:1.4515,scaleY:0.9182,x:600.65,y:534.5},0).wait(1).to({scaleX:1.4598,scaleY:0.9171,x:600.55,y:534.55},0).wait(1).to({scaleX:1.4681,scaleY:0.916,x:600.45,y:534.65},0).wait(1).to({scaleX:1.4764,scaleY:0.9149,x:600.3,y:534.7},0).wait(1).to({scaleX:1.4848,scaleY:0.9138,x:600.25,y:534.8},0).wait(1).to({scaleX:1.4931,scaleY:0.9127,x:600.15,y:534.85},0).wait(1).to({scaleX:1.5014,scaleY:0.9116,x:600.05,y:534.9},0).wait(1).to({scaleX:1.4987,scaleY:0.9105,x:598.05,y:535},0).wait(1).to({scaleX:1.4959,scaleY:0.9095,x:596.05,y:535.05},0).wait(1).to({scaleX:1.4932,scaleY:0.9084,x:594,y:535.15},0).wait(1).to({scaleX:1.4904,scaleY:0.9073,x:592.05,y:535.2},0).wait(1).to({scaleX:1.4877,scaleY:0.9062,x:590,y:535.25},0).wait(1).to({scaleX:1.485,scaleY:0.9051,x:588.05,y:535.35},0).wait(1).to({scaleX:1.4822,scaleY:0.9041,x:586,y:535.4},0).wait(1).to({scaleX:1.4795,scaleY:0.903,x:583.95,y:535.45},0).wait(1).to({scaleX:1.4768,scaleY:0.9019,x:582,y:535.55},0).wait(1).to({scaleX:1.474,scaleY:0.9008,x:579.95,y:535.6},0).wait(1).to({scaleX:1.4713,scaleY:0.8998,x:580.75},0).wait(1).to({scaleX:1.4685,scaleY:0.8987,x:581.5,y:535.55},0).wait(1).to({scaleX:1.4658,scaleY:0.8976,x:582.3,y:535.5},0).wait(1).to({scaleX:1.4631,scaleY:0.8965,x:583.05},0).wait(1).to({scaleX:1.4603,scaleY:0.8955,x:583.85},0).wait(1).to({scaleX:1.4576,scaleY:0.8944,x:584.6,y:535.45},0).wait(1).to({scaleX:1.4548,scaleY:0.8933,x:585.35},0).wait(1).to({scaleX:1.4521,scaleY:0.8922,x:586.15,y:535.4},0).wait(1).to({scaleX:1.4494,scaleY:0.8912,x:586.9,y:535.35},0).wait(1).to({scaleX:1.4466,scaleY:0.8901,x:587.7},0).wait(1).to({scaleX:1.4439,scaleY:0.889,x:588.45,y:535.3},0).wait(1).to({scaleX:1.4412,scaleY:0.8879,x:589.25},0).wait(1).to({scaleX:1.4384,scaleY:0.8868,x:590,y:535.25},0).wait(1).to({scaleX:1.4357,scaleY:0.8858,x:590.8,y:535.2},0).wait(1).to({scaleX:1.4329,scaleY:0.8847,x:591.55},0).wait(1).to({scaleX:1.4302,scaleY:0.8836,x:592.35,y:535.15},0).wait(1).to({scaleX:1.4275,scaleY:0.8825,x:593.1,y:535.1},0).wait(1).to({scaleX:1.4247,scaleY:0.8815,x:593.9},0).wait(1).to({scaleX:1.422,scaleY:0.8804,x:594.7,y:535.05},0).wait(1).to({scaleX:1.4192,scaleY:0.8793,x:595.45,y:535},0).wait(1).to({scaleX:1.4165,scaleY:0.8782,x:596.25},0).wait(1).to({scaleX:1.4138,scaleY:0.8772,x:597,y:534.95},0).wait(1).to({scaleX:1.411,scaleY:0.8761,x:597.8,y:534.9},0).wait(1).to({scaleX:1.4083,scaleY:0.875,x:598.55},0).wait(1).to({scaleX:1.4056,scaleY:0.8739,x:599.35,y:534.85},0).wait(1).to({scaleX:1.4028,scaleY:0.8729,x:600.1},0).wait(1).to({scaleX:1.4001,scaleY:0.8718,x:600.85,y:534.8},0).wait(1).to({scaleX:1.3973,scaleY:0.8707,x:601.65,y:534.75},0).wait(1).to({startPosition:0},0).to({_off:true},1).wait(274));

	// bg1
	this.instance_31 = new lib.CachedBmp_7();
	this.instance_31.setTransform(-30.4,-0.25,0.5,0.5);
	this.instance_31._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_31).wait(661).to({_off:false},0).to({_off:true},121).wait(274));

	// fadeout
	this.instance_32 = new lib.fade();
	this.instance_32.setTransform(559.3,503.45,1.1173,1,0,0,0,522.9,503.2);
	this.instance_32.alpha = 0;
	this.instance_32._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_32).wait(646).to({_off:false},0).wait(1).to({regX:523.5,x:560,alpha:0.0714},0).wait(1).to({alpha:0.1429},0).wait(1).to({alpha:0.2143},0).wait(1).to({alpha:0.2857},0).wait(1).to({alpha:0.3571},0).wait(1).to({alpha:0.4286},0).wait(1).to({alpha:0.5},0).wait(1).to({alpha:0.5714},0).wait(1).to({alpha:0.6429},0).wait(1).to({alpha:0.7143},0).wait(1).to({alpha:0.7857},0).wait(1).to({alpha:0.8571},0).wait(1).to({alpha:0.9286},0).wait(1).to({alpha:1},0).to({_off:true},1).wait(395));

	// fadein
	this.instance_33 = new lib.fade();
	this.instance_33.setTransform(567.3,504.2,1.1089,1,0,0,0,523,503.2);
	this.instance_33._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_33).wait(573).to({_off:false},0).wait(1).to({regX:523.5,x:567.9,alpha:0.9231},0).wait(1).to({alpha:0.8462},0).wait(1).to({alpha:0.7692},0).wait(1).to({alpha:0.6923},0).wait(1).to({alpha:0.6154},0).wait(1).to({alpha:0.5385},0).wait(1).to({alpha:0.4615},0).wait(1).to({alpha:0.3846},0).wait(1).to({alpha:0.3077},0).wait(1).to({alpha:0.2308},0).wait(1).to({alpha:0.1538},0).wait(1).to({alpha:0.0769},0).wait(1).to({alpha:0},0).to({_off:true},1).wait(469));

	// פה6
	this.instance_34 = new lib.פה6("synched",0);
	this.instance_34.setTransform(286,424.1,1,1,0,0,0,14.2,9.5);
	this.instance_34._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_34).wait(573).to({_off:false},0).wait(1).to({scaleY:0.95,y:424.05},0).wait(1).to({scaleY:0.9},0).wait(1).to({scaleY:0.85},0).wait(1).to({scaleY:0.8},0).wait(1).to({scaleY:0.75,y:424.1},0).wait(1).to({scaleY:0.7,y:424.05},0).wait(1).to({scaleY:0.65},0).wait(1).to({scaleY:0.6},0).wait(1).to({scaleY:0.55},0).wait(1).to({scaleY:0.5},0).wait(1).to({scaleY:0.45},0).wait(1).to({scaleY:0.4},0).wait(1).to({scaleY:0.35},0).wait(1).to({scaleY:0.3},0).wait(1).to({scaleY:0.324,y:424.1},0).wait(1).to({scaleY:0.3479,y:424.05},0).wait(1).to({scaleY:0.3718,y:424.1},0).wait(1).to({scaleY:0.3958,y:424.05},0).wait(1).to({scaleY:0.4197,y:424.1},0).wait(1).to({scaleY:0.4437,y:424.05},0).wait(1).to({scaleY:0.4676,y:424.1},0).wait(1).to({scaleY:0.4916,y:424.05},0).wait(1).to({scaleY:0.5155,y:424.1},0).wait(1).to({scaleY:0.5395,y:424.05},0).wait(1).to({scaleY:0.5634},0).wait(1).to({scaleY:0.5874,y:424.1},0).wait(1).to({scaleY:0.6113,y:424.05},0).wait(1).to({scaleY:0.6353,y:424.1},0).wait(1).to({scaleY:0.6592,y:424.05},0).wait(1).to({scaleY:0.6832,y:424.1},0).wait(1).to({scaleY:0.7071,y:424.05},0).wait(1).to({scaleY:0.731,y:424.1},0).wait(1).to({scaleY:0.7031},0).wait(1).to({scaleY:0.6751,y:424.05},0).wait(1).to({scaleY:0.6471,y:424.1},0).wait(1).to({scaleY:0.6192},0).wait(1).to({scaleY:0.5912,y:424.05},0).wait(1).to({scaleY:0.5632},0).wait(1).to({scaleY:0.5353,y:424.1},0).wait(1).to({scaleY:0.5073,y:424.05},0).wait(1).to({scaleY:0.4793},0).wait(1).to({scaleY:0.4513,y:424.1},0).wait(1).to({scaleY:0.4234,y:424.05},0).wait(1).to({scaleY:0.3954},0).wait(1).to({scaleY:0.3674,y:424.1},0).wait(1).to({scaleY:0.4103},0).wait(1).to({scaleY:0.4532,y:424.05},0).wait(1).to({scaleY:0.4961},0).wait(1).to({scaleY:0.539},0).wait(1).to({scaleY:0.5819,y:424.1},0).wait(1).to({scaleY:0.6248},0).wait(1).to({scaleY:0.6677},0).wait(1).to({scaleY:0.7106,y:424.05},0).wait(1).to({scaleY:0.7535},0).wait(1).to({scaleY:0.7964},0).wait(1).to({scaleY:0.7485},0).wait(1).to({scaleY:0.7005},0).wait(1).to({scaleY:0.6526,y:424.1},0).wait(1).to({scaleY:0.6046},0).wait(1).to({scaleY:0.5567},0).wait(1).to({scaleY:0.5087},0).wait(1).to({scaleY:0.4607},0).wait(1).to({scaleY:0.4128,y:424.05},0).wait(1).to({scaleY:0.4612,y:424.1},0).wait(1).to({scaleY:0.5095},0).wait(1).to({scaleY:0.5579,y:424.05},0).wait(1).to({scaleY:0.6063},0).wait(1).to({scaleY:0.6547},0).wait(1).to({scaleY:0.703,y:424.1},0).wait(1).to({scaleY:0.7514},0).wait(1).to({scaleY:0.7998},0).wait(1).to({scaleY:0.8482,y:424.05},0).wait(1).to({scaleY:0.8965},0).wait(1).to({scaleY:0.8543},0).wait(1).to({scaleY:0.812},0).wait(1).to({scaleY:0.7698},0).wait(1).to({scaleY:0.7275},0).wait(1).to({scaleY:0.6853},0).wait(1).to({scaleY:0.6431},0).wait(1).to({scaleY:0.6008},0).wait(1).to({scaleY:0.5586},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).to({_off:true},1).wait(395));

	// ליסהידימין6
	this.instance_35 = new lib.ליסהידימין6("synched",0);
	this.instance_35.setTransform(818.9,475.25,1,1,0,0,0,-14.4,0.2);
	this.instance_35._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_35).wait(573).to({_off:false},0).wait(1).to({regX:28.6,regY:119.9,rotation:1.125,x:859.55,y:595.75},0).wait(1).to({rotation:2.25,x:857.15,y:596.5},0).wait(1).to({rotation:3.375,x:854.75,y:597.25},0).wait(1).to({rotation:4.5,x:852.35,y:597.95},0).wait(1).to({rotation:5.625,x:849.95,y:598.55},0).wait(1).to({rotation:6.75,x:847.5,y:599.1},0).wait(1).to({rotation:7.875,x:845.05,y:599.65},0).wait(1).to({rotation:9,x:842.65,y:600.15},0).wait(1).to({rotation:10.125,x:840.15,y:600.65},0).wait(1).to({rotation:11.25,x:837.7,y:601.05},0).wait(1).to({rotation:12.375,x:835.25,y:601.35},0).wait(1).to({rotation:13.5,x:832.75,y:601.7},0).wait(1).to({rotation:14.625,x:830.25,y:601.85},0).wait(1).to({rotation:15.75,x:827.8,y:602.1},0).wait(1).to({rotation:16.875,x:825.3,y:602.25},0).wait(1).to({rotation:18,x:822.8,y:602.4},0).wait(1).to({rotation:19.125,x:820.25},0).wait(1).to({rotation:20.25,x:817.8},0).wait(1).to({rotation:21.375,x:815.35,y:602.35},0).wait(1).to({rotation:22.5,x:812.75,y:602.25},0).wait(1).to({rotation:23.625,x:810.3,y:602.1},0).wait(1).to({rotation:24.75,x:807.8,y:601.95},0).wait(1).to({rotation:25.875,x:805.4,y:601.75},0).wait(1).to({rotation:27,x:802.85,y:601.45},0).wait(1).to({rotation:28.125,x:800.4,y:601.1},0).wait(1).to({rotation:29.25,x:797.9,y:600.65},0).wait(1).to({rotation:30.375,x:795.4,y:600.25},0).wait(1).to({rotation:31.5,x:793.05,y:599.8},0).wait(1).to({rotation:32.625,x:790.6,y:599.25},0).wait(1).to({rotation:33.75,x:788.2,y:598.65},0).wait(1).to({rotation:34.875,x:785.75,y:598},0).wait(1).to({rotation:36,x:783.3,y:597.35},0).wait(1).to({rotation:37.125,x:780.95,y:596.6},0).wait(1).to({rotation:38.25,x:778.55,y:595.85},0).wait(1).to({rotation:39.375,x:776.2,y:595.05},0).wait(1).to({rotation:40.5,x:773.9,y:594.15},0).wait(1).to({rotation:41.625,x:771.55,y:593.25},0).wait(1).to({rotation:42.75,x:769.2,y:592.3},0).wait(1).to({rotation:43.875,x:766.95,y:591.35},0).wait(1).to({rotation:45,x:764.65,y:590.3},0).wait(1).to({rotation:46.125,x:762.4,y:589.2},0).wait(1).to({rotation:47.25,x:760.2,y:588.1},0).wait(1).to({rotation:48.375,x:758.05,y:586.9},0).wait(1).to({rotation:49.5,x:755.8,y:585.65},0).wait(1).to({rotation:50.625,x:753.65,y:584.4},0).wait(1).to({rotation:51.75,x:751.55,y:583.15},0).wait(1).to({rotation:52.875,x:749.4,y:581.75},0).wait(1).to({rotation:54,x:747.35,y:580.45},0).wait(1).to({rotation:55.125,x:745.3,y:578.95},0).wait(1).to({rotation:56.25,x:743.3,y:577.5},0).wait(1).to({rotation:57.375,x:741.25,y:576},0).wait(1).to({rotation:58.5,x:739.3,y:574.45},0).wait(1).to({rotation:59.625,x:737.35,y:572.85},0).wait(1).to({rotation:60.75,x:735.5,y:571.25},0).wait(1).to({rotation:61.875,x:733.65,y:569.55},0).wait(1).to({rotation:63,x:731.8,y:567.95},0).wait(1).to({rotation:64.125,x:730,y:566.15},0).wait(1).to({rotation:65.25,x:728.2,y:564.4},0).wait(1).to({rotation:66.375,x:726.45,y:562.6},0).wait(1).to({rotation:67.5,x:724.8,y:560.8},0).wait(1).to({rotation:68.625,x:723.1,y:558.95},0).wait(1).to({rotation:69.75,x:721.5,y:557.05},0).wait(1).to({rotation:70.875,x:719.9,y:555.1},0).wait(1).to({rotation:72,x:718.35,y:553.15},0).wait(1).to({rotation:73.125,x:716.85,y:551.15},0).wait(1).to({rotation:74.25,x:715.35,y:549.15},0).wait(1).to({rotation:75.375,x:713.95,y:547.05},0).wait(1).to({rotation:76.5,x:712.6,y:545},0).wait(1).to({rotation:77.625,x:711.25,y:542.95},0).wait(1).to({rotation:78.75,x:709.95,y:540.8},0).wait(1).to({rotation:79.875,x:708.65,y:538.65},0).wait(1).to({rotation:81,x:707.4,y:536.45},0).wait(1).to({rotation:82.125,x:706.25,y:534.3},0).wait(1).to({rotation:83.25,x:705.1,y:532.05},0).wait(1).to({rotation:84.375,x:704.05,y:529.8},0).wait(1).to({rotation:85.5,x:702.95,y:527.5},0).wait(1).to({rotation:86.625,x:701.95,y:525.25},0).wait(1).to({rotation:87.75,x:701,y:522.95},0).wait(1).to({rotation:88.875,x:700.05,y:520.6},0).wait(1).to({rotation:90,x:699.25,y:518.3},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).to({_off:true},1).wait(395));

	// סיפורים
	this.instance_36 = new lib.CachedBmp_8();
	this.instance_36.setTransform(159.65,70,0.5,0.5);
	this.instance_36._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_36).wait(573).to({_off:false},0).to({_off:true},88).wait(395));

	// ליסהידשמאל6
	this.instance_37 = new lib.ליסהידשמאל6("synched",0);
	this.instance_37.setTransform(791.3,498.1,1,1,0,0,0,116.5,29.1);
	this.instance_37._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_37).wait(573).to({_off:false},0).wait(1).to({regX:53.5,regY:109.7,rotation:0.8092,x:727.15,y:577.8},0).wait(1).to({rotation:1.6183,x:726.05,y:576.85},0).wait(1).to({rotation:2.4275,x:724.9,y:575.9},0).wait(1).to({rotation:3.2366,x:723.8,y:574.95},0).wait(1).to({rotation:4.0458,x:722.7,y:574.05},0).wait(1).to({rotation:4.8549,x:721.65,y:573.05},0).wait(1).to({rotation:5.664,x:720.6,y:572.05},0).wait(1).to({rotation:6.4732,x:719.6,y:571.1},0).wait(1).to({rotation:7.2824,x:718.55,y:570.05},0).wait(1).to({rotation:8.0915,x:717.55,y:569},0).wait(1).to({rotation:8.9007,x:716.6,y:568},0).wait(1).to({rotation:9.7098,x:715.6,y:566.9},0).wait(1).to({rotation:10.519,x:714.6,y:565.8},0).wait(1).to({rotation:11.3281,x:713.65,y:564.7},0).wait(1).to({rotation:12.1373,x:712.75,y:563.65},0).wait(1).to({rotation:12.9464,x:711.8,y:562.55},0).wait(1).to({rotation:13.7556,x:710.9,y:561.35},0).wait(1).to({rotation:14.5647,x:710.05,y:560.25},0).wait(1).to({rotation:15.3739,x:709.15,y:559.1},0).wait(1).to({rotation:16.183,x:708.35,y:557.9},0).wait(1).to({rotation:16.9922,x:707.45,y:556.75},0).wait(1).to({rotation:17.8013,x:706.65,y:555.55},0).wait(1).to({rotation:18.6105,x:705.85,y:554.35},0).wait(1).to({rotation:19.4196,x:705.1,y:553.15},0).wait(1).to({rotation:20.2288,x:704.25,y:551.95},0).wait(1).to({rotation:21.0379,x:703.55,y:550.7},0).wait(1).to({rotation:21.8471,x:702.8,y:549.45},0).wait(1).to({rotation:22.6562,x:702.05,y:548.2},0).wait(1).to({rotation:23.4654,x:701.4,y:546.95},0).wait(1).to({rotation:24.2745,x:700.7,y:545.65},0).wait(1).to({rotation:25.0837,x:700.05,y:544.4},0).wait(1).to({rotation:25.8928,x:699.4,y:543.1},0).wait(1).to({rotation:26.702,x:698.75,y:541.8},0).wait(1).to({rotation:27.5111,x:698.2,y:540.45},0).wait(1).to({rotation:28.3203,x:697.55,y:539.15},0).wait(1).to({rotation:29.1294,x:697,y:537.85},0).wait(1).to({rotation:29.9386,x:696.45,y:536.5},0).wait(1).to({rotation:30.7477,x:695.9,y:535.2},0).wait(1).to({rotation:31.5569,x:695.4,y:533.85},0).wait(1).to({rotation:32.366,x:694.9,y:532.45},0).wait(1).to({rotation:33.1752,x:694.45,y:531.05},0).wait(1).to({rotation:33.9843,x:694,y:529.7},0).wait(1).to({rotation:34.7935,x:693.55,y:528.4},0).wait(1).to({rotation:35.6026,x:693.15,y:526.95},0).wait(1).to({rotation:36.4118,x:692.75,y:525.6},0).wait(1).to({rotation:37.2209,x:692.35,y:524.15},0).wait(1).to({rotation:38.0301,x:692,y:522.75},0).wait(1).to({rotation:38.8392,x:691.6,y:521.4},0).wait(1).to({rotation:39.6484,x:691.35,y:519.95},0).wait(1).to({rotation:40.4575,x:691,y:518.5},0).wait(1).to({rotation:41.2667,x:690.75,y:517.15},0).wait(1).to({rotation:42.0758,x:690.5,y:515.7},0).wait(1).to({rotation:42.885,x:690.25,y:514.3},0).wait(1).to({rotation:43.6941,x:690.05,y:512.85},0).wait(1).to({rotation:44.5033,x:689.8,y:511.45},0).wait(1).to({rotation:45.3124,x:689.6,y:510},0).wait(1).to({rotation:46.1216,x:689.55,y:508.55},0).wait(1).to({rotation:46.9307,x:689.35,y:507.15},0).wait(1).to({rotation:47.7398,x:689.25,y:505.65},0).wait(1).to({rotation:48.549,x:689.15,y:504.25},0).wait(1).to({rotation:49.3582,x:689.05,y:502.8},0).wait(1).to({rotation:50.1673,x:689,y:501.35},0).wait(1).to({rotation:50.9765,y:499.9},0).wait(1).to({rotation:51.7856,x:688.95,y:498.5},0).wait(1).to({rotation:52.5948,y:497.05},0).wait(1).to({rotation:53.4039,x:689,y:495.6},0).wait(1).to({rotation:54.2131,x:689.05,y:494.15},0).wait(1).to({rotation:55.0222,y:492.75},0).wait(1).to({rotation:55.8314,x:689.2,y:491.25},0).wait(1).to({rotation:56.6405,x:689.25,y:489.8},0).wait(1).to({rotation:57.4497,x:689.45,y:488.35},0).wait(1).to({rotation:58.2588,x:689.55,y:486.95},0).wait(1).to({rotation:59.068,x:689.75,y:485.55},0).wait(1).to({rotation:59.8771,x:689.9,y:484.05},0).wait(1).to({rotation:60.6863,x:690.15,y:482.65},0).wait(1).to({rotation:61.4954,x:690.35,y:481.2},0).wait(1).to({rotation:62.3046,x:690.55,y:479.8},0).wait(1).to({rotation:63.1137,x:690.85,y:478.35},0).wait(1).to({rotation:63.9229,x:691.1,y:476.95},0).wait(1).to({rotation:64.732,x:691.5,y:475.6},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).to({_off:true},1).wait(395));

	// ידימין6
	this.instance_38 = new lib.ידימין6("synched",0);
	this.instance_38.setTransform(395.45,581.4,1,1,0,0,0,9.3,163.8);
	this.instance_38._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_38).wait(573).to({_off:false},0).wait(1).to({regX:31.8,regY:82.4,rotation:1.0714,x:419.45,y:500.45},0).wait(1).to({rotation:2.1427,x:420.95,y:500.9},0).wait(1).to({rotation:3.2141,x:422.45,y:501.35},0).wait(1).to({rotation:4.2854,x:423.95,y:501.9},0).wait(1).to({rotation:5.3568,x:425.4,y:502.4},0).wait(1).to({rotation:6.4281,x:426.9,y:503},0).wait(1).to({rotation:7.4995,x:428.4,y:503.6},0).wait(1).to({rotation:8.5708,x:429.8,y:504.25},0).wait(1).to({rotation:9.6422,x:431.25,y:504.95},0).wait(1).to({rotation:10.7135,x:432.7,y:505.55},0).wait(1).to({rotation:11.7849,x:434.05,y:506.3},0).wait(1).to({rotation:12.8562,x:435.45,y:507.05},0).wait(1).to({rotation:13.9276,x:436.8,y:507.8},0).wait(1).to({rotation:14.9989,x:438.2,y:508.6},0).wait(1).to({rotation:14.4211,x:437.5,y:508.1},0).wait(1).to({rotation:13.8433,x:436.8,y:507.7},0).wait(1).to({rotation:13.2656,x:436,y:507.3},0).wait(1).to({rotation:12.6878,x:435.2,y:506.95},0).wait(1).to({rotation:12.11,x:434.5,y:506.45},0).wait(1).to({rotation:11.5322,x:433.75,y:506.1},0).wait(1).to({rotation:10.9545,x:432.95,y:505.75},0).wait(1).to({rotation:10.3767,x:432.2,y:505.4},0).wait(1).to({rotation:9.7989,x:431.5,y:505},0).wait(1).to({rotation:9.2211,x:430.7,y:504.65},0).wait(1).to({rotation:8.6433,x:429.9,y:504.3},0).wait(1).to({rotation:8.0656,x:429.15,y:503.95},0).wait(1).to({rotation:7.4878,x:428.35,y:503.6},0).wait(1).to({rotation:6.91,x:427.55,y:503.3},0).wait(1).to({rotation:6.3322,x:426.75,y:502.95},0).wait(1).to({rotation:5.7545,x:426,y:502.65},0).wait(1).to({rotation:5.1767,x:425.15,y:502.3},0).wait(1).to({rotation:4.5989,x:424.4,y:502.05},0).wait(1).to({rotation:4.0211,x:423.55,y:501.8},0).wait(1).to({rotation:4.5926,x:424.35,y:502.05},0).wait(1).to({rotation:5.1641,x:425.15,y:502.3},0).wait(1).to({rotation:5.7356,x:425.95,y:502.65},0).wait(1).to({rotation:6.307,x:426.7,y:502.95},0).wait(1).to({rotation:6.8785,x:427.5,y:503.25},0).wait(1).to({rotation:7.45,x:428.3,y:503.55},0).wait(1).to({rotation:8.0215,x:429.05,y:503.95},0).wait(1).to({rotation:8.593,x:429.85,y:504.2},0).wait(1).to({rotation:9.1645,x:430.6,y:504.6},0).wait(1).to({rotation:9.7359,x:431.35,y:504.95},0).wait(1).to({rotation:10.3074,x:432.1,y:505.3},0).wait(1).to({rotation:10.8789,x:432.9,y:505.65},0).wait(1).to({rotation:11.4504,x:433.6,y:506.05},0).wait(1).to({rotation:12.0219,x:434.4,y:506.45},0).wait(1).to({rotation:12.5933,x:435.15,y:506.85},0).wait(1).to({rotation:13.1648,x:435.85,y:507.25},0).wait(1).to({rotation:13.7363,x:436.6,y:507.65},0).wait(1).to({rotation:13.1237,x:435.8,y:507.2},0).wait(1).to({rotation:12.5111,x:435,y:506.8},0).wait(1).to({rotation:11.8985,x:434.2,y:506.4},0).wait(1).to({rotation:11.2859,x:433.4,y:505.9},0).wait(1).to({rotation:10.6733,x:432.6,y:505.55},0).wait(1).to({rotation:10.0606,x:431.75,y:505.15},0).wait(1).to({rotation:9.448,x:430.95,y:504.75},0).wait(1).to({rotation:8.8354,x:430.15,y:504.4},0).wait(1).to({rotation:8.2228,x:429.3,y:504.05},0).wait(1).to({rotation:7.6102,x:428.5,y:503.65},0).wait(1).to({rotation:6.9976,x:427.65,y:503.3},0).wait(1).to({rotation:6.385,x:426.85,y:503},0).wait(1).to({rotation:5.7724,x:426,y:502.65},0).wait(1).to({rotation:6.7098,x:427.25,y:503.15},0).wait(1).to({rotation:7.6472,x:428.55,y:503.7},0).wait(1).to({rotation:8.5846,x:429.8,y:504.25},0).wait(1).to({rotation:9.5221,x:431.05,y:504.8},0).wait(1).to({rotation:10.4595,x:432.3,y:505.4},0).wait(1).to({rotation:11.3969,x:433.5,y:506},0).wait(1).to({rotation:12.3343,x:434.75,y:506.65},0).wait(1).to({rotation:13.2717,x:436,y:507.3},0).wait(1).to({rotation:14.2092,x:437.2,y:508},0).wait(1).to({rotation:15.1466,x:438.4,y:508.7},0).wait(1).to({rotation:16.084,x:439.55,y:509.35},0).wait(1).to({rotation:17.0214,x:440.75,y:510.15},0).wait(1).to({rotation:17.9588,x:441.9,y:510.9},0).wait(1).to({rotation:18.8963,x:443.05,y:511.65},0).wait(1).to({rotation:19.8337,x:444.2,y:512.45},0).wait(1).to({rotation:20.7711,x:445.35,y:513.25},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).to({_off:true},1).wait(395));

	// רקע6
	this.instance_39 = new lib.CachedBmp_60();
	this.instance_39.setTransform(61.6,174.7,0.5,0.5);

	this.instance_40 = new lib.Path();
	this.instance_40.setTransform(413.1,489.2,0.3795,0.5044,0,0,0,41.6,64.8);
	this.instance_40.alpha = 0.5;

	this.instance_41 = new lib.CachedBmp_59();
	this.instance_41.setTransform(388.1,432.75,0.5,0.5);

	this.instance_42 = new lib.Path_13();
	this.instance_42.setTransform(806.7,217.6,0.3796,0.5044,0,0,0,41.9,64.5);
	this.instance_42.alpha = 0.5;

	this.instance_43 = new lib.Path_14();
	this.instance_43.setTransform(704.45,217.6,0.3796,0.5044,0,0,0,41.8,64.5);
	this.instance_43.alpha = 0.5;

	this.instance_44 = new lib.Path_15();
	this.instance_44.setTransform(645.8,217.6,0.3796,0.5044,0,0,0,41.8,64.5);
	this.instance_44.alpha = 0.5;

	this.instance_45 = new lib.Path_16();
	this.instance_45.setTransform(663.15,217.6,0.3796,0.5044,0,0,0,41.8,64.5);
	this.instance_45.alpha = 0.5;

	this.instance_46 = new lib.Path_17();
	this.instance_46.setTransform(721.75,217.6,0.3796,0.5044,0,0,0,41.6,64.5);
	this.instance_46.alpha = 0.5;

	this.instance_47 = new lib.Path_18();
	this.instance_47.setTransform(739.05,217.6,0.3796,0.5044,0,0,0,41.9,64.5);
	this.instance_47.alpha = 0.5;

	this.instance_48 = new lib.Path_19();
	this.instance_48.setTransform(866.9,217.6,0.3796,0.5044,0,0,0,41.6,64.5);
	this.instance_48.alpha = 0.5;

	this.instance_49 = new lib.Path_20();
	this.instance_49.setTransform(884.1,217.6,0.3796,0.5044,0,0,0,41.6,64.5);
	this.instance_49.alpha = 0.5;

	this.instance_50 = new lib.CachedBmp_58();
	this.instance_50.setTransform(-2.05,-2.55,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.instance_50},{t:this.instance_49},{t:this.instance_48},{t:this.instance_47},{t:this.instance_46},{t:this.instance_45},{t:this.instance_44},{t:this.instance_43},{t:this.instance_42},{t:this.instance_41},{t:this.instance_40},{t:this.instance_39}]},573).to({state:[]},88).wait(395));

	// fadeout
	this.instance_51 = new lib.fade();
	this.instance_51.setTransform(559.45,503.45,1.1173,1,0,0,0,522.9,503.2);
	this.instance_51.alpha = 0;
	this.instance_51._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_51).wait(556).to({_off:false},0).wait(1).to({regX:523.5,x:560.15,alpha:0.0714},0).wait(1).to({alpha:0.1429},0).wait(1).to({alpha:0.2143},0).wait(1).to({alpha:0.2857},0).wait(1).to({alpha:0.3571},0).wait(1).to({alpha:0.4286},0).wait(1).to({alpha:0.5},0).wait(1).to({alpha:0.5714},0).wait(1).to({alpha:0.6429},0).wait(1).to({alpha:0.7143},0).wait(1).to({alpha:0.7857},0).wait(1).to({alpha:0.8571},0).wait(1).to({alpha:0.9286},0).wait(1).to({alpha:1},0).to({_off:true},1).wait(485));

	// fadein
	this.instance_52 = new lib.fade();
	this.instance_52.setTransform(567.4,504.2,1.1089,1,0,0,0,523,503.2);
	this.instance_52._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_52).wait(451).to({_off:false},0).wait(1).to({regX:523.5,x:568,alpha:0.9231},0).wait(1).to({alpha:0.8462},0).wait(1).to({alpha:0.7692},0).wait(1).to({alpha:0.6923},0).wait(1).to({alpha:0.6154},0).wait(1).to({alpha:0.5385},0).wait(1).to({alpha:0.4615},0).wait(1).to({alpha:0.3846},0).wait(1).to({alpha:0.3077},0).wait(1).to({alpha:0.2308},0).wait(1).to({alpha:0.1538},0).wait(1).to({alpha:0.0769},0).wait(1).to({alpha:0},0).to({_off:true},1).wait(591));

	// לב5_1_copy_copy_copy
	this.instance_53 = new lib.לב5דהוי("synched",0);
	this.instance_53.setTransform(872.5,319.95,1,1,0,0,0,90,-8.3);
	this.instance_53._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_53).wait(451).to({_off:false},0).to({_off:true},120).wait(485));

	// לב5_1_copy_copy
	this.instance_54 = new lib.לב5דהוי("synched",0);
	this.instance_54.setTransform(881.9,166.4,1,1,0,0,0,90,-8.3);
	this.instance_54._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_54).wait(451).to({_off:false},0).to({_off:true},120).wait(485));

	// לב5_1_copy_copy
	this.instance_55 = new lib.לב5דהוי("synched",0);
	this.instance_55.setTransform(578.05,149.45,1,1,0,0,180,90,-8.3);
	this.instance_55._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_55).wait(451).to({_off:false},0).to({_off:true},120).wait(485));

	// לב5_1_copy
	this.instance_56 = new lib.לב5דהוי("synched",0);
	this.instance_56.setTransform(564.25,327.15,1,1,0,0,180,90,-8.3);
	this.instance_56._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_56).wait(451).to({_off:false},0).to({_off:true},120).wait(485));

	// פה5
	this.instance_57 = new lib.פה5("synched",0);
	this.instance_57.setTransform(396.15,343.35,1,1,0,0,0,12,10.2);
	this.instance_57._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_57).wait(451).to({_off:false},0).wait(1).to({regX:11.9,scaleY:0.9801,x:396.05},0).wait(1).to({scaleY:0.9602},0).wait(1).to({scaleY:0.9403},0).wait(1).to({scaleY:0.9204},0).wait(1).to({scaleY:0.9005},0).wait(1).to({scaleY:0.8806},0).wait(1).to({scaleY:0.8607},0).wait(1).to({scaleY:0.8408},0).wait(1).to({scaleY:0.821,y:343.3},0).wait(1).to({scaleY:0.8011},0).wait(1).to({scaleY:0.7812},0).wait(1).to({scaleY:0.7613},0).wait(1).to({scaleY:0.7414},0).wait(1).to({scaleY:0.7215},0).wait(1).to({scaleY:0.7016},0).wait(1).to({scaleY:0.6817},0).wait(1).to({scaleY:0.6618},0).wait(1).to({scaleY:0.6419,y:343.35},0).wait(1).to({scaleY:0.622},0).wait(1).to({scaleY:0.6021},0).wait(1).to({scaleY:0.5822},0).wait(1).to({scaleY:0.5623},0).wait(1).to({scaleY:0.5424},0).wait(1).to({scaleY:0.5225},0).wait(1).to({scaleY:0.5027},0).wait(1).to({scaleY:0.4828,y:343.3},0).wait(1).to({scaleY:0.4629},0).wait(1).to({scaleY:0.443},0).wait(1).to({scaleY:0.4231},0).wait(1).to({scaleY:0.4491,y:343.35},0).wait(1).to({scaleY:0.4752},0).wait(1).to({scaleY:0.5013,y:343.3},0).wait(1).to({scaleY:0.5273,y:343.35},0).wait(1).to({scaleY:0.5534},0).wait(1).to({scaleY:0.5795,y:343.3},0).wait(1).to({scaleY:0.6055,y:343.35},0).wait(1).to({scaleY:0.6316},0).wait(1).to({scaleY:0.6577,y:343.3},0).wait(1).to({scaleY:0.6837},0).wait(1).to({scaleY:0.7098,y:343.35},0).wait(1).to({scaleY:0.7359,y:343.3},0).wait(1).to({scaleY:0.7619},0).wait(1).to({scaleY:0.788,y:343.35},0).wait(1).to({scaleY:0.8141,y:343.3},0).wait(1).to({scaleY:0.8401},0).wait(1).to({scaleY:0.8662,y:343.35},0).wait(1).to({scaleY:0.8923,y:343.3},0).wait(1).to({scaleY:0.9183},0).wait(1).to({scaleY:0.9444,y:343.35},0).wait(1).to({scaleY:0.9107},0).wait(1).to({scaleY:0.8769},0).wait(1).to({scaleY:0.8432,y:343.3},0).wait(1).to({scaleY:0.8094},0).wait(1).to({scaleY:0.7757},0).wait(1).to({scaleY:0.742},0).wait(1).to({scaleY:0.7082},0).wait(1).to({scaleY:0.6745,y:343.35},0).wait(1).to({scaleY:0.6407},0).wait(1).to({scaleY:0.607},0).wait(1).to({scaleY:0.5733},0).wait(1).to({scaleY:0.5395,y:343.3},0).wait(1).to({scaleY:0.5058},0).wait(1).to({scaleY:0.472},0).wait(1).to({scaleY:0.4383},0).wait(1).to({scaleY:0.4638,y:343.35},0).wait(1).to({scaleY:0.4893},0).wait(1).to({scaleY:0.5148,y:343.3},0).wait(1).to({scaleY:0.5403},0).wait(1).to({scaleY:0.5658},0).wait(1).to({scaleY:0.5913,y:343.35},0).wait(1).to({scaleY:0.6168},0).wait(1).to({scaleY:0.6423,y:343.3},0).wait(1).to({scaleY:0.6678},0).wait(1).to({scaleY:0.6933},0).wait(1).to({scaleY:0.7187,y:343.35},0).wait(1).to({scaleY:0.7442},0).wait(1).to({scaleY:0.7697,y:343.3},0).wait(1).to({scaleY:0.7952},0).wait(1).to({scaleY:0.8207},0).wait(1).to({scaleY:0.8462,y:343.35},0).wait(1).to({scaleY:0.8717},0).wait(1).to({scaleY:0.8972,y:343.3},0).wait(1).to({scaleY:0.9227},0).wait(1).to({scaleY:0.8877},0).wait(1).to({scaleY:0.8526,y:343.35},0).wait(1).to({scaleY:0.8175},0).wait(1).to({scaleY:0.7825},0).wait(1).to({scaleY:0.7474,y:343.3},0).wait(1).to({scaleY:0.7124},0).wait(1).to({scaleY:0.6773},0).wait(1).to({scaleY:0.6422},0).wait(1).to({scaleY:0.6072,y:343.35},0).wait(1).to({scaleY:0.5721},0).wait(1).to({scaleY:0.5371},0).wait(1).to({scaleY:0.502,y:343.3},0).wait(1).to({scaleY:0.4669},0).wait(1).to({scaleY:0.4319},0).wait(1).to({scaleY:0.3968,y:343.35},0).wait(1).to({scaleY:0.3618},0).wait(1).to({scaleY:0.3267},0).wait(1).to({scaleY:0.3679,y:343.3},0).wait(1).to({scaleY:0.409},0).wait(1).to({scaleY:0.4502,y:343.35},0).wait(1).to({scaleY:0.4914,y:343.3},0).wait(1).to({scaleY:0.5326,y:343.35},0).wait(1).to({scaleY:0.5737,y:343.3},0).wait(1).to({scaleY:0.6149},0).wait(1).to({scaleY:0.6561,y:343.35},0).wait(1).to({scaleY:0.6972,y:343.3},0).wait(1).to({scaleY:0.7384,y:343.35},0).wait(1).to({scaleY:0.7796,y:343.3},0).wait(1).to({scaleY:0.8208},0).wait(1).to({scaleY:0.8619,y:343.35},0).wait(1).to({scaleY:0.9031,y:343.3},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).to({_off:true},1).wait(485));

	// סיפורים
	this.instance_58 = new lib.CachedBmp_12();
	this.instance_58.setTransform(295.25,-0.5,0.5,0.5);
	this.instance_58._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_58).wait(451).to({_off:false},0).to({_off:true},120).wait(485));

	// רקע
	this.instance_59 = new lib.CachedBmp_15();
	this.instance_59.setTransform(0,139.45,0.5,0.5);

	this.instance_60 = new lib.CachedBmp_14();
	this.instance_60.setTransform(366.8,523.6,0.5,0.5);

	this.instance_61 = new lib.CachedBmp_13();
	this.instance_61.setTransform(-0.5,-0.5,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.instance_61},{t:this.instance_60},{t:this.instance_59}]},451).to({state:[]},120).wait(485));

	// fadeout
	this.instance_62 = new lib.fade();
	this.instance_62.setTransform(559.45,503.45,1.1173,1,0,0,0,522.8,503.2);
	this.instance_62.alpha = 0;
	this.instance_62._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_62).wait(436).to({_off:false},0).wait(1).to({regX:523.5,x:560.25,alpha:0.0714},0).wait(1).to({alpha:0.1429},0).wait(1).to({alpha:0.2143},0).wait(1).to({alpha:0.2857},0).wait(1).to({alpha:0.3571},0).wait(1).to({alpha:0.4286},0).wait(1).to({alpha:0.5},0).wait(1).to({alpha:0.5714},0).wait(1).to({alpha:0.6429},0).wait(1).to({alpha:0.7143},0).wait(1).to({alpha:0.7857},0).wait(1).to({alpha:0.8571},0).wait(1).to({alpha:0.9286},0).wait(1).to({alpha:1},0).to({_off:true},1).wait(605));

	// fadein
	this.instance_63 = new lib.fade();
	this.instance_63.setTransform(567.5,504.2,1.1089,1,0,0,0,523,503.2);
	this.instance_63._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_63).wait(363).to({_off:false},0).wait(1).to({regX:523.5,x:568.1,alpha:0.9231},0).wait(1).to({alpha:0.8462},0).wait(1).to({alpha:0.7692},0).wait(1).to({alpha:0.6923},0).wait(1).to({alpha:0.6154},0).wait(1).to({alpha:0.5385},0).wait(1).to({alpha:0.4615},0).wait(1).to({alpha:0.3846},0).wait(1).to({alpha:0.3077},0).wait(1).to({alpha:0.2308},0).wait(1).to({alpha:0.1538},0).wait(1).to({alpha:0.0769},0).wait(1).to({alpha:0},0).to({_off:true},1).wait(679));

	// ידימין4
	this.instance_64 = new lib.ידימין4("synched",0);
	this.instance_64.setTransform(832.25,544.35,1,1,0,0,0,13.5,120.3);
	this.instance_64._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_64).wait(363).to({_off:false},0).wait(1).to({regX:54.7,regY:70.2,rotation:0.3451,x:873.75,y:494.5},0).wait(1).to({rotation:0.6902,x:874.05,y:494.7},0).wait(1).to({rotation:1.0353,x:874.35,y:495},0).wait(1).to({rotation:1.3804,x:874.65,y:495.25},0).wait(1).to({rotation:1.7255,x:874.9,y:495.45},0).wait(1).to({rotation:2.0706,x:875.2,y:495.75},0).wait(1).to({rotation:2.4158,x:875.5,y:496},0).wait(1).to({rotation:2.7609,x:875.8,y:496.25},0).wait(1).to({rotation:3.106,x:876.05,y:496.5},0).wait(1).to({rotation:3.4511,x:876.35,y:496.8},0).wait(1).to({rotation:3.7962,x:876.65,y:497.05},0).wait(1).to({rotation:4.1413,x:876.95,y:497.3},0).wait(1).to({rotation:4.4864,x:877.25,y:497.65},0).wait(1).to({rotation:4.8315,x:877.5,y:497.85},0).wait(1).to({rotation:5.1766,x:877.8,y:498.15},0).wait(1).to({rotation:5.5217,x:878.05,y:498.4},0).wait(1).to({rotation:5.8668,x:878.35,y:498.75},0).wait(1).to({rotation:6.2119,x:878.6,y:498.95},0).wait(1).to({rotation:6.5571,x:878.9,y:499.25},0).wait(1).to({rotation:6.9022,x:879.15,y:499.5},0).wait(1).to({rotation:7.2473,x:879.4,y:499.85},0).wait(1).to({rotation:7.5924,x:879.7,y:500.15},0).wait(1).to({rotation:7.9375,x:879.95,y:500.4},0).wait(1).to({rotation:8.2826,x:880.25,y:500.7},0).wait(1).to({rotation:8.6277,x:880.45,y:500.95},0).wait(1).to({rotation:8.9728,x:880.75,y:501.3},0).wait(1).to({rotation:8.0571,x:880,y:500.45},0).wait(1).to({rotation:7.1415,x:879.35,y:499.75},0).wait(1).to({rotation:6.2258,x:878.65,y:499},0).wait(1).to({rotation:5.3102,x:877.85,y:498.25},0).wait(1).to({rotation:4.3945,x:877.15,y:497.55},0).wait(1).to({rotation:3.4788,x:876.4,y:496.8},0).wait(1).to({rotation:2.5632,x:875.6,y:496.15},0).wait(1).to({rotation:1.6475,x:874.9,y:495.4},0).wait(1).to({rotation:0.7318,x:874.05,y:494.75},0).wait(1).to({rotation:-0.1838,x:873.25,y:494.05},0).wait(1).to({rotation:-1.0995,x:872.45,y:493.45},0).wait(1).to({rotation:-2.0151,x:871.6,y:492.8},0).wait(1).to({rotation:-2.9308,x:870.85,y:492.15},0).wait(1).to({rotation:-3.8465,x:870,y:491.6},0).wait(1).to({rotation:-4.7621,x:869.15,y:490.95},0).wait(1).to({rotation:-5.6778,x:868.3,y:490.4},0).wait(1).to({rotation:-6.5935,x:867.4,y:489.8},0).wait(1).to({rotation:-7.5091,x:866.5,y:489.25},0).wait(1).to({rotation:-8.4248,x:865.65,y:488.75},0).wait(1).to({rotation:-9.3404,x:864.75,y:488.15},0).wait(1).to({rotation:-10.2561,x:863.85,y:487.7},0).wait(1).to({rotation:-9.1274,x:864.95,y:488.3},0).wait(1).to({rotation:-7.9988,x:866,y:488.95},0).wait(1).to({rotation:-6.8701,x:867.15,y:489.65},0).wait(1).to({rotation:-5.7414,x:868.2,y:490.4},0).wait(1).to({rotation:-4.6127,x:869.25,y:491.05},0).wait(1).to({rotation:-3.4841,x:870.3,y:491.8},0).wait(1).to({rotation:-2.3554,x:871.35,y:492.6},0).wait(1).to({rotation:-1.2267,x:872.35,y:493.4},0).wait(1).to({rotation:-0.098,x:873.3,y:494.15},0).wait(1).to({rotation:1.0306,x:874.35,y:495},0).wait(1).to({rotation:2.1593,x:875.25,y:495.8},0).wait(1).to({rotation:3.288,x:876.2,y:496.7},0).wait(1).to({rotation:4.4167,x:877.2,y:497.55},0).wait(1).to({rotation:5.5453,x:878.05,y:498.45},0).wait(1).to({rotation:6.674,x:879,y:499.3},0).wait(1).to({rotation:7.8027,x:879.85,y:500.3},0).wait(1).to({rotation:8.9314,x:880.7,y:501.25},0).wait(1).to({rotation:10.06,x:881.55,y:502.15},0).wait(1).to({rotation:11.1887,x:882.35,y:503.15},0).wait(1).to({rotation:10.3993,x:881.8,y:502.45},0).wait(1).to({rotation:9.6098,x:881.25,y:501.8},0).wait(1).to({rotation:8.8204,x:880.65,y:501.15},0).wait(1).to({rotation:8.031,x:880,y:500.45},0).wait(1).to({rotation:7.2415,x:879.4,y:499.85},0).wait(1).to({rotation:6.4521,x:878.8,y:499.15},0).wait(1).to({rotation:5.6627,x:878.15,y:498.55},0).wait(1).to({rotation:4.8732,x:877.55,y:497.9},0).wait(1).to({rotation:4.0838,x:876.9,y:497.25},0).wait(1).to({rotation:3.2944,x:876.2,y:496.7},0).wait(1).to({rotation:2.5049,x:875.6,y:496.1},0).wait(1).to({rotation:1.7155,x:874.9,y:495.45},0).wait(1).to({rotation:0.9261,x:874.2,y:494.9},0).wait(1).to({rotation:0.1366,x:873.55,y:494.35},0).wait(1).to({rotation:-0.6528,x:872.85,y:493.8},0).wait(1).to({rotation:-1.4422,x:872.15,y:493.2},0).wait(1).to({rotation:-2.2317,x:871.45,y:492.65},0).wait(1).to({rotation:-3.0211,x:870.7,y:492.1},0).wait(1).to({rotation:-3.8105,x:870,y:491.6},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).to({_off:true},1).wait(605));

	// פה4
	this.instance_65 = new lib.פה4("synched",0);
	this.instance_65.setTransform(707.9,406,1,1,0,0,0,15.8,9.2);
	this.instance_65._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_65).wait(363).to({_off:false},0).wait(1).to({regX:15.7,scaleY:0.9743,x:707.8,y:405.95},0).wait(1).to({scaleY:0.9486,y:406},0).wait(1).to({scaleY:0.923},0).wait(1).to({scaleY:0.8973,y:405.95},0).wait(1).to({scaleY:0.8716},0).wait(1).to({scaleY:0.8459,y:406},0).wait(1).to({scaleY:0.8203},0).wait(1).to({scaleY:0.7946,y:405.95},0).wait(1).to({scaleY:0.7689},0).wait(1).to({scaleY:0.7432,y:406},0).wait(1).to({scaleY:0.7176,y:405.95},0).wait(1).to({scaleY:0.6919},0).wait(1).to({scaleY:0.6662,y:406},0).wait(1).to({scaleY:0.6405},0).wait(1).to({scaleY:0.6149,y:405.95},0).wait(1).to({scaleY:0.5892},0).wait(1).to({scaleY:0.5635,y:406},0).wait(1).to({scaleY:0.5378},0).wait(1).to({scaleY:0.5122,y:405.95},0).wait(1).to({scaleY:0.4865,y:406},0).wait(1).to({scaleY:0.4608},0).wait(1).to({scaleY:0.4351,y:405.95},0).wait(1).to({scaleY:0.4095},0).wait(1).to({scaleY:0.3838,y:406},0).wait(1).to({scaleY:0.4136,y:405.95},0).wait(1).to({scaleY:0.4433,y:406},0).wait(1).to({scaleY:0.4731,y:405.95},0).wait(1).to({scaleY:0.5029,y:406},0).wait(1).to({scaleY:0.5326,y:405.95},0).wait(1).to({scaleY:0.5624},0).wait(1).to({scaleY:0.5922,y:406},0).wait(1).to({scaleY:0.6219,y:405.95},0).wait(1).to({scaleY:0.6517,y:406},0).wait(1).to({scaleY:0.6815,y:405.95},0).wait(1).to({scaleY:0.7112,y:406},0).wait(1).to({scaleY:0.741,y:405.95},0).wait(1).to({scaleY:0.7708,y:406},0).wait(1).to({scaleY:0.8006,y:405.95},0).wait(1).to({scaleY:0.8303,y:406},0).wait(1).to({scaleY:0.8601,y:405.95},0).wait(1).to({scaleY:0.8899,y:406},0).wait(1).to({scaleY:0.9196,y:405.95},0).wait(1).to({scaleY:0.9494,y:406},0).wait(1).to({scaleY:0.9792,y:405.95},0).wait(1).to({scaleY:0.9492,y:406},0).wait(1).to({scaleY:0.9192,y:405.95},0).wait(1).to({scaleY:0.8892,y:406},0).wait(1).to({scaleY:0.8592,y:405.95},0).wait(1).to({scaleY:0.8292,y:406},0).wait(1).to({scaleY:0.7992,y:405.95},0).wait(1).to({scaleY:0.7692,y:406},0).wait(1).to({scaleY:0.7392,y:405.95},0).wait(1).to({scaleY:0.7092},0).wait(1).to({scaleY:0.6792,y:406},0).wait(1).to({scaleY:0.6492,y:405.95},0).wait(1).to({scaleY:0.6193,y:406},0).wait(1).to({scaleY:0.5893,y:405.95},0).wait(1).to({scaleY:0.5593,y:406},0).wait(1).to({scaleY:0.5293,y:405.95},0).wait(1).to({scaleY:0.4993,y:406},0).wait(1).to({scaleY:0.4693,y:405.95},0).wait(1).to({scaleY:0.4393,y:406},0).wait(1).to({scaleY:0.4093,y:405.95},0).wait(1).to({scaleY:0.3793,y:406},0).wait(1).to({scaleY:0.3493,y:405.95},0).wait(1).to({scaleY:0.3966,y:406},0).wait(1).to({scaleY:0.4438},0).wait(1).to({scaleY:0.4911,y:405.95},0).wait(1).to({scaleY:0.5384},0).wait(1).to({scaleY:0.5856,y:406},0).wait(1).to({scaleY:0.6329,y:405.95},0).wait(1).to({scaleY:0.6802},0).wait(1).to({scaleY:0.7274,y:406},0).wait(1).to({scaleY:0.7747},0).wait(1).to({scaleY:0.822,y:405.95},0).wait(1).to({scaleY:0.8692,y:406},0).wait(1).to({scaleY:0.9165},0).wait(1).to({scaleY:0.9638,y:405.95},0).wait(1).to({scaleY:1.011},0).wait(1).to({scaleY:1.0583,y:406},0).wait(1).to({scaleY:1.1055,y:405.95},0).wait(1).to({scaleY:1.1528},0).wait(1).to({scaleY:1.2001,y:406},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).to({_off:true},1).wait(605));

	// סיפורים
	this.instance_66 = new lib.CachedBmp_16();
	this.instance_66.setTransform(72.5,89.25,0.5,0.5);
	this.instance_66._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_66).wait(363).to({_off:false},0).to({_off:true},88).wait(605));

	// רקע
	this.instance_67 = new lib.CachedBmp_19();
	this.instance_67.setTransform(0,139.45,0.5,0.5);

	this.instance_68 = new lib.CachedBmp_18();
	this.instance_68.setTransform(366.8,523.6,0.5,0.5);

	this.instance_69 = new lib.CachedBmp_17();
	this.instance_69.setTransform(-0.5,-0.5,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.instance_69},{t:this.instance_68},{t:this.instance_67}]},363).to({state:[]},88).wait(605));

	// fadeout
	this.instance_70 = new lib.fade();
	this.instance_70.setTransform(559.4,503.45,1.1173,1,0,0,0,522.6,503.2);
	this.instance_70.alpha = 0;
	this.instance_70._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_70).wait(347).to({_off:false},0).wait(1).to({regX:523.5,x:560.4,alpha:0.0714},0).wait(1).to({alpha:0.1429},0).wait(1).to({alpha:0.2143},0).wait(1).to({alpha:0.2857},0).wait(1).to({alpha:0.3571},0).wait(1).to({alpha:0.4286},0).wait(1).to({alpha:0.5},0).wait(1).to({alpha:0.5714},0).wait(1).to({alpha:0.6429},0).wait(1).to({alpha:0.7143},0).wait(1).to({alpha:0.7857},0).wait(1).to({alpha:0.8571},0).wait(1).to({alpha:0.9286},0).wait(1).to({alpha:1},0).to({_off:true},1).wait(694));

	// fadein
	this.instance_71 = new lib.fade();
	this.instance_71.setTransform(567.6,504.2,1.1089,1,0,0,0,523,503.2);
	this.instance_71._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_71).wait(271).to({_off:false},0).wait(1).to({regX:523.5,x:568.2,alpha:0.9231},0).wait(1).to({alpha:0.8462},0).wait(1).to({alpha:0.7692},0).wait(1).to({alpha:0.6923},0).wait(1).to({alpha:0.6154},0).wait(1).to({alpha:0.5385},0).wait(1).to({alpha:0.4615},0).wait(1).to({alpha:0.3846},0).wait(1).to({alpha:0.3077},0).wait(1).to({alpha:0.2308},0).wait(1).to({alpha:0.1538},0).wait(1).to({alpha:0.0769},0).wait(1).to({alpha:0},0).to({_off:true},1).wait(771));

	// ידשמאל3
	this.instance_72 = new lib.ידשמאל3("synched",0);
	this.instance_72.setTransform(776.8,457.4,1,1,0,0,0,64.7,2.5);
	this.instance_72._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_72).wait(271).to({_off:false},0).wait(1).to({regX:85.1,regY:75.4,rotation:-2.1919,x:800,y:529.45},0).wait(1).to({rotation:-4.3838,x:802.65,y:528.5},0).wait(1).to({rotation:-6.5757,x:805.4,y:527.45},0).wait(1).to({rotation:-8.7676,x:808.05,y:526.3},0).wait(1).to({rotation:-10.9595,x:810.7,y:525},0).wait(1).to({rotation:-13.1514,x:813.2,y:523.7},0).wait(1).to({rotation:-15.3433,x:815.7,y:522.25},0).wait(1).to({rotation:-17.5353,x:818.2,y:520.7},0).wait(1).to({rotation:-19.7272,x:820.6,y:519.1},0).wait(1).to({rotation:-21.9191,x:822.9,y:517.4},0).wait(1).to({rotation:-24.111,x:825.2,y:515.55},0).wait(1).to({rotation:-26.3029,x:827.35,y:513.7},0).wait(1).to({rotation:-28.4948,x:829.45,y:511.65},0).wait(1).to({rotation:-30.6867,x:831.55,y:509.6},0).wait(1).to({rotation:-32.8786,x:833.45,y:507.45},0).wait(1).to({rotation:-35.0705,x:835.35,y:505.3},0).wait(1).to({rotation:-37.2624,x:837.15,y:503.05},0).wait(1).to({rotation:-39.4543,x:838.8,y:500.65},0).wait(1).to({rotation:-41.6462,x:840.45,y:498.25},0).wait(1).to({rotation:-43.8381,x:841.95,y:495.8},0).wait(1).to({rotation:-46.03,x:843.4,y:493.25},0).wait(1).to({rotation:-48.2219,x:844.75,y:490.7},0).wait(1).to({rotation:-50.4138,x:845.95,y:488.05},0).wait(1).to({rotation:-52.6058,x:847.1,y:485.4},0).wait(1).to({rotation:-54.7977,x:848.05,y:482.65},0).wait(1).to({rotation:-56.9896,x:849,y:480},0).wait(1).to({rotation:-59.1815,x:849.8,y:477.15},0).wait(1).to({rotation:-61.3734,x:850.5,y:474.3},0).wait(1).to({rotation:-63.5653,x:851.1,y:471.5},0).wait(1).to({rotation:-65.7572,x:851.6,y:468.65},0).wait(1).to({rotation:-67.9491,x:852,y:465.8},0).wait(1).to({rotation:-66.2711,x:851.7,y:468},0).wait(1).to({rotation:-64.5931,x:851.35,y:470.2},0).wait(1).to({rotation:-62.9152,x:850.95,y:472.4},0).wait(1).to({rotation:-61.2372,x:850.45,y:474.55},0).wait(1).to({rotation:-59.5592,x:849.9,y:476.7},0).wait(1).to({rotation:-57.8812,x:849.35,y:478.85},0).wait(1).to({rotation:-56.2033,x:848.7,y:480.95},0).wait(1).to({rotation:-54.5253,x:847.95,y:483},0).wait(1).to({rotation:-52.8473,x:847.2,y:485.1},0).wait(1).to({rotation:-51.1693,x:846.35,y:487.15},0).wait(1).to({rotation:-49.4914,x:845.5,y:489.2},0).wait(1).to({rotation:-47.8134,x:844.45,y:491.2},0).wait(1).to({rotation:-46.1354,x:843.4,y:493.15},0).wait(1).to({rotation:-44.4574,x:842.4,y:495.05},0).wait(1).to({rotation:-42.7795,x:841.25,y:497},0).wait(1).to({rotation:-41.1015,x:840.05,y:498.85},0).wait(1).to({rotation:-39.4235,x:838.85,y:500.7},0).wait(1).to({rotation:-37.7455,x:837.5,y:502.45},0).wait(1).to({rotation:-36.0676,x:836.2,y:504.25},0).wait(1).to({rotation:-34.3896,x:834.8,y:506},0).wait(1).to({rotation:-32.7116,x:833.35,y:507.65},0).wait(1).to({rotation:-31.0336,x:831.8,y:509.3},0).wait(1).to({rotation:-29.3557,x:830.25,y:510.9},0).wait(1).to({rotation:-27.6777,x:828.65,y:512.4},0).wait(1).to({rotation:-25.9997,x:827.05,y:513.9},0).wait(1).to({rotation:-24.3217,x:825.4,y:515.35},0).wait(1).to({rotation:-22.6438,x:823.7,y:516.8},0).wait(1).to({rotation:-20.9658,x:821.9,y:518.1},0).wait(1).to({rotation:-19.2878,x:820.1,y:519.4},0).wait(1).to({rotation:-17.6098,x:818.25,y:520.65},0).wait(1).to({rotation:-15.9319,x:816.4,y:521.85},0).wait(1).to({rotation:-14.2539,x:814.5,y:523},0).wait(1).to({rotation:-12.5759,x:812.55,y:524.05},0).wait(1).to({rotation:-10.8979,x:810.55,y:525.1},0).wait(1).to({rotation:-9.22,x:808.6,y:526.05},0).wait(1).to({rotation:-7.542,x:806.55,y:527},0).wait(1).to({rotation:-5.864,x:804.5,y:527.8},0).wait(1).to({rotation:-4.186,x:802.4,y:528.6},0).wait(1).to({rotation:-2.5081,x:800.35,y:529.35},0).wait(1).to({rotation:-0.8301,x:798.25,y:529.95},0).wait(1).to({rotation:0.8479,x:796.1,y:530.55},0).wait(1).to({rotation:2.5259,x:793.95,y:531.15},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).to({_off:true},1).wait(694));

	// סיפורים
	this.instance_73 = new lib.CachedBmp_20();
	this.instance_73.setTransform(110.45,40.1,0.5,0.5);
	this.instance_73._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_73).wait(271).to({_off:false},0).to({_off:true},91).wait(694));

	// רקע
	this.instance_74 = new lib.CachedBmp_23();
	this.instance_74.setTransform(0.1,133.4,0.5,0.5);

	this.instance_75 = new lib.CachedBmp_22();
	this.instance_75.setTransform(366.9,517.55,0.5,0.5);

	this.instance_76 = new lib.CachedBmp_21();
	this.instance_76.setTransform(-0.4,-6.55,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.instance_76},{t:this.instance_75},{t:this.instance_74}]},271).to({state:[]},91).wait(694));

	// fadeout
	this.instance_77 = new lib.fade();
	this.instance_77.setTransform(559.45,503.45,1.1173,1,0,0,0,522.5,503.2);
	this.instance_77.alpha = 0;
	this.instance_77._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_77).wait(256).to({_off:false},0).wait(1).to({regX:523.5,x:560.6,alpha:0.0714},0).wait(1).to({alpha:0.1429},0).wait(1).to({alpha:0.2143},0).wait(1).to({alpha:0.2857},0).wait(1).to({alpha:0.3571},0).wait(1).to({alpha:0.4286},0).wait(1).to({alpha:0.5},0).wait(1).to({alpha:0.5714},0).wait(1).to({alpha:0.6429},0).wait(1).to({alpha:0.7143},0).wait(1).to({alpha:0.7857},0).wait(1).to({alpha:0.8571},0).wait(1).to({alpha:0.9286},0).wait(1).to({alpha:1},0).to({_off:true},1).wait(785));

	// fadein
	this.instance_78 = new lib.fade();
	this.instance_78.setTransform(567.65,504.2,1.1089,1,0,0,0,522.9,503.2);
	this.instance_78._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_78).wait(180).to({_off:false},0).wait(1).to({regX:523.5,x:568.35,alpha:0.9231},0).wait(1).to({alpha:0.8462},0).wait(1).to({alpha:0.7692},0).wait(1).to({alpha:0.6923},0).wait(1).to({alpha:0.6154},0).wait(1).to({alpha:0.5385},0).wait(1).to({alpha:0.4615},0).wait(1).to({alpha:0.3846},0).wait(1).to({alpha:0.3077},0).wait(1).to({alpha:0.2308},0).wait(1).to({alpha:0.1538},0).wait(1).to({alpha:0.0769},0).wait(1).to({alpha:0},0).to({_off:true},1).wait(862));

	// פה2
	this.instance_79 = new lib.פה2("synched",0);
	this.instance_79.setTransform(239.3,393.65,2.3361,2.5926,0,0,0,5.4,1.4);
	this.instance_79._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_79).wait(180).to({_off:false},0).wait(1).to({regX:5,regY:1.5,scaleY:2.49,x:238.35,y:393.85,startPosition:1},0).wait(1).to({scaleY:2.3873,startPosition:2},0).wait(1).to({scaleY:2.2847,startPosition:3},0).wait(1).to({scaleY:2.1821,y:393.8,startPosition:4},0).wait(1).to({scaleY:2.0795,startPosition:5},0).wait(1).to({scaleY:1.9768,startPosition:6},0).wait(1).to({scaleY:1.8742,startPosition:0},0).wait(1).to({scaleY:1.7716,startPosition:1},0).wait(1).to({scaleY:1.669,startPosition:2},0).wait(1).to({scaleY:1.5664,startPosition:3},0).wait(1).to({scaleY:1.4637,startPosition:4},0).wait(1).to({scaleY:1.3611,startPosition:5},0).wait(1).to({scaleY:1.2585,startPosition:6},0).wait(1).to({scaleY:1.1559,startPosition:0},0).wait(1).to({scaleY:1.0532,startPosition:1},0).wait(1).to({scaleY:0.9506,startPosition:2},0).wait(1).to({scaleY:0.848,y:393.75,startPosition:3},0).wait(1).to({scaleY:0.7454,startPosition:4},0).wait(1).to({scaleY:0.8014,startPosition:5},0).wait(1).to({scaleY:0.8574,y:393.8,startPosition:6},0).wait(1).to({scaleY:0.9134,y:393.75,startPosition:0},0).wait(1).to({scaleY:0.9694,y:393.8,startPosition:1},0).wait(1).to({scaleY:1.0254,startPosition:2},0).wait(1).to({scaleY:1.0814,y:393.75,startPosition:3},0).wait(1).to({scaleY:1.1374,y:393.8,startPosition:4},0).wait(1).to({scaleY:1.1934,startPosition:5},0).wait(1).to({scaleY:1.2494,y:393.75,startPosition:6},0).wait(1).to({scaleY:1.3054,y:393.8,startPosition:0},0).wait(1).to({scaleY:1.3615,startPosition:1},0).wait(1).to({scaleY:1.4175,y:393.85,startPosition:2},0).wait(1).to({scaleY:1.4735,y:393.8,startPosition:3},0).wait(1).to({scaleY:1.5295,startPosition:4},0).wait(1).to({scaleY:1.5855,y:393.85,startPosition:5},0).wait(1).to({scaleY:1.6415,y:393.8,startPosition:6},0).wait(1).to({scaleY:1.6975,startPosition:0},0).wait(1).to({scaleY:1.7535,y:393.85,startPosition:1},0).wait(1).to({scaleY:1.8095,y:393.8,startPosition:2},0).wait(1).to({scaleY:1.8655,y:393.85,startPosition:3},0).wait(1).to({scaleY:1.9215,startPosition:4},0).wait(1).to({scaleY:1.9775,y:393.8,startPosition:5},0).wait(1).to({scaleY:2.0336,y:393.85,startPosition:6},0).wait(1).to({scaleY:1.982,y:393.8,startPosition:0},0).wait(1).to({scaleY:1.9305,y:393.85,startPosition:1},0).wait(1).to({scaleY:1.879,y:393.8,startPosition:2},0).wait(1).to({scaleY:1.8275,y:393.85,startPosition:3},0).wait(1).to({scaleY:1.776,y:393.8,startPosition:4},0).wait(1).to({scaleY:1.7245,y:393.85,startPosition:5},0).wait(1).to({scaleY:1.673,y:393.8,startPosition:6},0).wait(1).to({scaleY:1.6215,y:393.85,startPosition:0},0).wait(1).to({scaleY:1.57,y:393.8,startPosition:1},0).wait(1).to({scaleY:1.5185,y:393.85,startPosition:2},0).wait(1).to({scaleY:1.467,y:393.8,startPosition:3},0).wait(1).to({scaleY:1.4155,startPosition:4},0).wait(1).to({scaleY:1.364,startPosition:5},0).wait(1).to({scaleY:1.3125,startPosition:6},0).wait(1).to({scaleY:1.2609,startPosition:0},0).wait(1).to({scaleY:1.2094,startPosition:1},0).wait(1).to({scaleY:1.1579,startPosition:2},0).wait(1).to({scaleY:1.1064,startPosition:3},0).wait(1).to({scaleY:1.0549,startPosition:4},0).wait(1).to({scaleY:1.0034,startPosition:5},0).wait(1).to({scaleY:0.9519,startPosition:6},0).wait(1).to({scaleY:0.9004,startPosition:0},0).wait(1).to({scaleY:0.8489,y:393.75,startPosition:1},0).wait(1).to({scaleY:0.7974,y:393.8,startPosition:2},0).wait(1).to({scaleY:0.7459,y:393.75,startPosition:3},0).wait(1).to({scaleY:0.6944,y:393.8,startPosition:4},0).wait(1).to({scaleY:0.7621,startPosition:5},0).wait(1).to({scaleY:0.8298,startPosition:6},0).wait(1).to({scaleY:0.8975,startPosition:0},0).wait(1).to({scaleY:0.9652,startPosition:1},0).wait(1).to({scaleY:1.033,startPosition:2},0).wait(1).to({scaleY:1.1007,startPosition:3},0).wait(1).to({scaleY:1.1684,startPosition:4},0).wait(1).to({scaleY:1.2361,startPosition:5},0).wait(1).to({scaleY:1.3038,startPosition:6},0).wait(1).to({scaleY:1.3716,startPosition:0},0).wait(1).to({scaleY:1.4393,startPosition:1},0).wait(1).to({scaleY:1.507,startPosition:2},0).wait(1).to({scaleY:1.5747,startPosition:3},0).wait(1).to({scaleY:1.6424,startPosition:4},0).wait(1).to({scaleY:1.7102,startPosition:5},0).wait(1).to({scaleY:1.7779,startPosition:6},0).wait(1).to({scaleY:1.8456,startPosition:0},0).wait(1).to({scaleY:1.9133,startPosition:1},0).wait(1).to({scaleY:1.981,startPosition:2},0).wait(1).to({scaleY:2.0488,startPosition:3},0).wait(1).to({startPosition:4},0).wait(1).to({startPosition:5},0).wait(1).to({startPosition:6},0).to({_off:true},1).wait(785));

	// ידימין2
	this.instance_80 = new lib.ידימין2("synched",0);
	this.instance_80.setTransform(377.4,538.2,1,1,0,0,0,20,153.7);
	this.instance_80._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_80).wait(180).to({_off:false},0).wait(1).to({regX:37.2,regY:83.7,rotation:0.6818,x:395.4,y:468.4},0).wait(1).to({rotation:1.3635,x:396.25,y:468.65},0).wait(1).to({rotation:2.0453,x:397.05,y:468.85},0).wait(1).to({rotation:2.7271,x:397.85,y:469.05},0).wait(1).to({rotation:3.4088,x:398.7,y:469.3},0).wait(1).to({rotation:4.0906,x:399.55,y:469.6},0).wait(1).to({rotation:4.7724,x:400.35,y:469.85},0).wait(1).to({rotation:5.4541,x:401.15,y:470.1},0).wait(1).to({rotation:6.1359,x:401.95,y:470.4},0).wait(1).to({rotation:6.8177,x:402.75,y:470.7},0).wait(1).to({rotation:7.4995,x:403.6,y:471.05},0).wait(1).to({rotation:8.1812,x:404.35,y:471.35},0).wait(1).to({rotation:8.863,x:405.15,y:471.7},0).wait(1).to({rotation:9.5448,x:405.95,y:472},0).wait(1).to({rotation:10.2265,x:406.75,y:472.3},0).wait(1).to({rotation:10.9083,x:407.5,y:472.7},0).wait(1).to({rotation:11.5901,x:408.3,y:473.05},0).wait(1).to({rotation:12.2718,x:409.05,y:473.45},0).wait(1).to({rotation:12.9536,x:409.85,y:473.8},0).wait(1).to({rotation:13.6354,x:410.55,y:474.2},0).wait(1).to({rotation:14.3171,x:411.35,y:474.6},0).wait(1).to({rotation:14.9989,x:412.15,y:475.05},0).wait(1).to({rotation:14.2077,x:411.2,y:474.55},0).wait(1).to({rotation:13.4165,x:410.4,y:474.1},0).wait(1).to({rotation:12.6252,x:409.45,y:473.65},0).wait(1).to({rotation:11.834,x:408.55,y:473.2},0).wait(1).to({rotation:11.0428,x:407.65,y:472.75},0).wait(1).to({rotation:10.2516,x:406.75,y:472.3},0).wait(1).to({rotation:9.4604,x:405.85,y:471.95},0).wait(1).to({rotation:8.6692,x:404.9,y:471.55},0).wait(1).to({rotation:7.8779,x:404.05,y:471.2},0).wait(1).to({rotation:7.0867,x:403.05,y:470.85},0).wait(1).to({rotation:6.2955,x:402.15,y:470.5},0).wait(1).to({rotation:5.5043,x:401.2,y:470.1},0).wait(1).to({rotation:4.7131,x:400.2,y:469.8},0).wait(1).to({rotation:3.9219,x:399.35,y:469.5},0).wait(1).to({rotation:3.1306,x:398.4,y:469.2},0).wait(1).to({rotation:2.3394,x:397.4,y:468.95},0).wait(1).to({rotation:1.5482,x:396.5,y:468.65},0).wait(1).to({rotation:0.757,x:395.5,y:468.4},0).wait(1).to({rotation:-0.0342,x:394.55,y:468.2},0).wait(1).to({rotation:-0.8254,x:393.55,y:467.95},0).wait(1).to({rotation:-1.6167,x:392.6,y:467.7},0).wait(1).to({rotation:-2.4079,x:391.6,y:467.55},0).wait(1).to({rotation:-3.1991,x:390.65,y:467.3},0).wait(1).to({rotation:-2.1214,x:391.95,y:467.55},0).wait(1).to({rotation:-1.0437,x:393.3,y:467.85},0).wait(1).to({rotation:0.034,x:394.6,y:468.15},0).wait(1).to({rotation:1.1118,x:395.95,y:468.5},0).wait(1).to({rotation:2.1895,x:397.2,y:468.85},0).wait(1).to({rotation:3.2672,x:398.55,y:469.25},0).wait(1).to({rotation:4.3449,x:399.85,y:469.65},0).wait(1).to({rotation:5.4226,x:401.15,y:470.05},0).wait(1).to({rotation:6.5003,x:402.35,y:470.55},0).wait(1).to({rotation:7.5781,x:403.6,y:471.05},0).wait(1).to({rotation:8.6558,x:404.95,y:471.55},0).wait(1).to({rotation:9.7335,x:406.15,y:472.1},0).wait(1).to({rotation:10.8112,x:407.4,y:472.65},0).wait(1).to({rotation:11.8889,x:408.6,y:473.2},0).wait(1).to({rotation:12.9666,x:409.8,y:473.8},0).wait(1).to({rotation:14.0444,x:411.05,y:474.45},0).wait(1).to({rotation:15.1221,x:412.2,y:475.1},0).wait(1).to({rotation:16.1998,x:413.4,y:475.8},0).wait(1).to({rotation:17.2775,x:414.6,y:476.4},0).wait(1).to({rotation:16.5632,x:413.8,y:476},0).wait(1).to({rotation:15.849,x:413.05,y:475.5},0).wait(1).to({rotation:15.1347,x:412.25,y:475.1},0).wait(1).to({rotation:14.4205,x:411.5,y:474.65},0).wait(1).to({rotation:13.7062,x:410.65,y:474.2},0).wait(1).to({rotation:12.9919,x:409.9,y:473.8},0).wait(1).to({rotation:12.2777,x:409.05,y:473.45},0).wait(1).to({rotation:11.5634,x:408.25,y:473.05},0).wait(1).to({rotation:10.8491,x:407.45,y:472.65},0).wait(1).to({rotation:10.1349,x:406.6,y:472.3},0).wait(1).to({rotation:9.4206,x:405.8,y:471.9},0).wait(1).to({rotation:8.7064,x:404.95,y:471.6},0).wait(1).to({rotation:7.9921,x:404.15,y:471.25},0).wait(1).to({rotation:7.2778,x:403.3,y:470.95},0).wait(1).to({rotation:6.5636,x:402.45,y:470.6},0).wait(1).to({rotation:5.8493,x:401.6,y:470.3},0).wait(1).to({rotation:5.135,x:400.75,y:470},0).wait(1).to({rotation:4.4208,x:399.95,y:469.7},0).wait(1).to({rotation:3.7065,x:399.05,y:469.4},0).wait(1).to({rotation:2.9923,x:398.25,y:469.2},0).wait(1).to({rotation:2.278,x:397.3,y:468.95},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).to({_off:true},1).wait(785));

	// סיפורים
	this.instance_81 = new lib.CachedBmp_25();
	this.instance_81.setTransform(96.25,8.9,0.5,0.5);

	this.instance_82 = new lib.CachedBmp_24();
	this.instance_82.setTransform(91.1,396.6,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.instance_82},{t:this.instance_81}]},180).to({state:[]},91).wait(785));

	// רקע
	this.instance_83 = new lib.CachedBmp_28();
	this.instance_83.setTransform(0.1,133.4,0.5,0.5);

	this.instance_84 = new lib.CachedBmp_27();
	this.instance_84.setTransform(366.9,517.55,0.5,0.5);

	this.instance_85 = new lib.CachedBmp_26();
	this.instance_85.setTransform(-0.4,-6.55,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.instance_85},{t:this.instance_84},{t:this.instance_83}]},180).to({state:[]},91).wait(785));

	// רקעלכפתור
	this.instance_86 = new lib.שמש("synched",0);
	this.instance_86.setTransform(582.9,512.1,13.9292,11.6475,0,0,0,63.8,70.4);

	this.timeline.addTween(cjs.Tween.get(this.instance_86).to({_off:true},1).wait(1055));

	// fadeout
	this.instance_87 = new lib.fade();
	this.instance_87.setTransform(559.4,503.45,1.1173,1,0,0,0,522.3,503.2);
	this.instance_87.alpha = 0;
	this.instance_87._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_87).wait(165).to({_off:false},0).wait(1).to({regX:523.5,x:560.75,alpha:0.0714},0).wait(1).to({alpha:0.1429},0).wait(1).to({alpha:0.2143},0).wait(1).to({alpha:0.2857},0).wait(1).to({alpha:0.3571},0).wait(1).to({alpha:0.4286},0).wait(1).to({alpha:0.5},0).wait(1).to({alpha:0.5714},0).wait(1).to({alpha:0.6429},0).wait(1).to({alpha:0.7143},0).wait(1).to({alpha:0.7857},0).wait(1).to({alpha:0.8571},0).wait(1).to({alpha:0.9286},0).wait(1).to({alpha:1},0).to({_off:true},1).wait(876));

	// fadein
	this.instance_88 = new lib.fade();
	this.instance_88.setTransform(567.65,504.2,1.1089,1,0,0,0,522.8,503.2);

	this.timeline.addTween(cjs.Tween.get(this.instance_88).wait(1).to({regX:523.5,x:568.45,alpha:0.9231},0).wait(1).to({alpha:0.8462},0).wait(1).to({alpha:0.7692},0).wait(1).to({alpha:0.6923},0).wait(1).to({alpha:0.6154},0).wait(1).to({alpha:0.5385},0).wait(1).to({alpha:0.4615},0).wait(1).to({alpha:0.3846},0).wait(1).to({alpha:0.3077},0).wait(1).to({alpha:0.2308},0).wait(1).to({alpha:0.1538},0).wait(1).to({alpha:0.0769},0).wait(1).to({alpha:0},0).to({_off:true},1).wait(1042));

	// פה1
	this.instance_89 = new lib.פה();
	this.instance_89.setTransform(402.2,388.65,2.2951,2.2125,0,0,0,5.3,1.4);

	this.timeline.addTween(cjs.Tween.get(this.instance_89).wait(1).to({regX:5,regY:1.5,scaleY:2.1746,x:401.55,y:388.85},0).wait(1).to({scaleY:2.1368},0).wait(1).to({scaleY:2.099},0).wait(1).to({scaleY:2.0611},0).wait(1).to({scaleY:2.0233},0).wait(1).to({scaleY:1.9854},0).wait(1).to({scaleY:1.9476,y:388.8},0).wait(1).to({scaleY:1.9097},0).wait(1).to({scaleY:1.8719},0).wait(1).to({scaleY:1.834},0).wait(1).to({scaleY:1.7962,y:388.85},0).wait(1).to({scaleY:1.7583},0).wait(1).to({scaleY:1.7205},0).wait(1).to({scaleY:1.6827,y:388.8},0).wait(1).to({scaleY:1.6448},0).wait(1).to({scaleY:1.607},0).wait(1).to({scaleY:1.5691},0).wait(1).to({scaleY:1.5313},0).wait(1).to({scaleY:1.4934},0).wait(1).to({scaleY:1.4556},0).wait(1).to({scaleY:1.4177,y:388.85},0).wait(1).to({scaleY:1.3799,y:388.8},0).wait(1).to({scaleY:1.342},0).wait(1).to({scaleY:1.3042},0).wait(1).to({scaleY:1.2663},0).wait(1).to({scaleY:1.2285},0).wait(1).to({scaleY:1.1907},0).wait(1).to({scaleY:1.1528},0).wait(1).to({scaleY:1.115,y:388.75},0).wait(1).to({scaleY:1.0771},0).wait(1).to({scaleY:1.0393,y:388.8},0).wait(1).to({scaleY:1.0014},0).wait(1).to({scaleY:0.9636},0).wait(1).to({scaleY:0.9257},0).wait(1).to({scaleY:0.8879},0).wait(1).to({scaleY:0.85},0).wait(1).to({scaleY:0.8122,y:388.75},0).wait(1).to({scaleY:0.7744},0).wait(1).to({scaleY:0.8068},0).wait(1).to({scaleY:0.8393},0).wait(1).to({scaleY:0.8717},0).wait(1).to({scaleY:0.9042},0).wait(1).to({scaleY:0.9366,y:388.8},0).wait(1).to({scaleY:0.9691},0).wait(1).to({scaleY:1.0015},0).wait(1).to({scaleY:1.034},0).wait(1).to({scaleY:1.0664},0).wait(1).to({scaleY:1.0989},0).wait(1).to({scaleY:1.1313},0).wait(1).to({scaleY:1.1638},0).wait(1).to({scaleY:1.1962},0).wait(1).to({scaleY:1.2287},0).wait(1).to({scaleY:1.2611},0).wait(1).to({scaleY:1.2936},0).wait(1).to({scaleY:1.326},0).wait(1).to({scaleY:1.3585},0).wait(1).to({scaleY:1.3909},0).wait(1).to({scaleY:1.4234},0).wait(1).to({scaleY:1.4558},0).wait(1).to({scaleY:1.4883,y:388.85},0).wait(1).to({scaleY:1.5207},0).wait(1).to({scaleY:1.5532},0).wait(1).to({scaleY:1.5856},0).wait(1).to({scaleY:1.6181},0).wait(1).to({scaleY:1.6505},0).wait(1).to({scaleY:1.683,y:388.8},0).wait(1).to({scaleY:1.7154},0).wait(1).to({scaleY:1.7479},0).wait(1).to({scaleY:1.7803},0).wait(1).to({scaleY:1.8128},0).wait(1).to({scaleY:1.8452},0).wait(1).to({scaleY:1.8777},0).wait(1).to({scaleY:1.9101},0).wait(1).to({scaleY:1.9426},0).wait(1).to({scaleY:1.975},0).wait(1).to({scaleY:2.0075},0).wait(1).to({scaleY:1.9857,y:388.85},0).wait(1).to({scaleY:1.9639},0).wait(1).to({scaleY:1.9422,y:388.8},0).wait(1).to({scaleY:1.9204,y:388.85},0).wait(1).to({scaleY:1.8987},0).wait(1).to({scaleY:1.8769,y:388.8},0).wait(1).to({scaleY:1.8551,y:388.85},0).wait(1).to({scaleY:1.8334,y:388.8},0).wait(1).to({scaleY:1.8116},0).wait(1).to({scaleY:1.7898,y:388.85},0).wait(1).to({scaleY:1.7681,y:388.8},0).wait(1).to({scaleY:1.7463},0).wait(1).to({scaleY:1.7246,y:388.85},0).wait(1).to({scaleY:1.7028,y:388.8},0).wait(1).to({scaleY:1.681},0).wait(1).to({scaleY:1.6593,y:388.85},0).wait(1).to({scaleY:1.6375,y:388.8},0).wait(1).to({scaleY:1.6157},0).wait(1).to({scaleY:1.594},0).wait(1).to({scaleY:1.5722},0).wait(1).to({scaleY:1.5505,y:388.85},0).wait(1).to({scaleY:1.5287,y:388.8},0).wait(1).to({scaleY:1.5069},0).wait(1).to({scaleY:1.4852,y:388.85},0).wait(1).to({scaleY:1.4634,y:388.8},0).wait(1).to({scaleY:1.4416},0).wait(1).to({scaleY:1.4199},0).wait(1).to({scaleY:1.3981},0).wait(1).to({scaleY:1.3764},0).wait(1).to({scaleY:1.3546},0).wait(1).to({scaleY:1.3328},0).wait(1).to({scaleY:1.3111},0).wait(1).to({scaleY:1.2893},0).wait(1).to({scaleY:1.2676},0).wait(1).to({scaleY:1.2458},0).wait(1).to({scaleY:1.224},0).wait(1).to({scaleY:1.2023},0).wait(1).to({scaleY:1.1805,y:388.75},0).wait(1).to({scaleY:1.1587,y:388.8},0).wait(1).to({scaleY:1.137},0).wait(1).to({scaleY:1.1152,y:388.75},0).wait(1).to({scaleY:1.1333,y:388.8},0).wait(1).to({scaleY:1.1513},0).wait(1).to({scaleY:1.1694},0).wait(1).to({scaleY:1.1874},0).wait(1).to({scaleY:1.2055},0).wait(1).to({scaleY:1.2235},0).wait(1).to({scaleY:1.2416},0).wait(1).to({scaleY:1.2596},0).wait(1).to({scaleY:1.2777},0).wait(1).to({scaleY:1.2957},0).wait(1).to({scaleY:1.3138},0).wait(1).to({scaleY:1.3318},0).wait(1).to({scaleY:1.3499},0).wait(1).to({scaleY:1.3679},0).wait(1).to({scaleY:1.386},0).wait(1).to({scaleY:1.404},0).wait(1).to({scaleY:1.4221},0).wait(1).to({scaleY:1.4401},0).wait(1).to({scaleY:1.4581},0).wait(1).to({scaleY:1.4762},0).wait(1).to({scaleY:1.4942},0).wait(1).to({scaleY:1.5123},0).wait(1).to({scaleY:1.5303},0).wait(1).to({scaleY:1.5484},0).wait(1).to({scaleY:1.5664},0).wait(1).to({scaleY:1.5845,y:388.85},0).wait(1).to({scaleY:1.6025,y:388.8},0).wait(1).to({scaleY:1.6206,y:388.85},0).wait(1).to({scaleY:1.6386,y:388.8},0).wait(1).to({scaleY:1.6567,y:388.85},0).wait(1).to({scaleY:1.6747,y:388.8},0).wait(1).to({scaleY:1.6928,y:388.85},0).wait(1).to({scaleY:1.7108,y:388.8},0).wait(1).to({scaleY:1.7289,y:388.85},0).wait(1).to({scaleY:1.7469,y:388.8},0).wait(1).to({scaleY:1.765},0).wait(1).to({scaleY:1.783},0).wait(1).to({scaleY:1.8011},0).wait(1).to({scaleY:1.8191,y:388.85},0).wait(1).to({scaleY:1.8372,y:388.8},0).wait(1).to({scaleY:1.8552,y:388.85},0).wait(1).to({scaleY:1.8733,y:388.8},0).wait(1).to({scaleY:1.8913,y:388.85},0).wait(1).to({scaleY:1.9094,y:388.8},0).wait(1).to({scaleY:1.9274,y:388.85},0).wait(1).to({scaleY:1.9455,y:388.8},0).wait(1).to({scaleY:1.9635,y:388.85},0).wait(1).to({scaleY:1.9816,y:388.8},0).wait(1).to({scaleY:1.9996,y:388.85},0).wait(1).to({scaleY:2.0177},0).wait(1).to({scaleY:2.0357},0).wait(1).to({scaleY:2.0538},0).wait(1).to({scaleY:2.0718},0).wait(1).to({scaleY:2.0899},0).wait(1).to({scaleY:2.1079},0).wait(7).to({_off:true},1).wait(876));

	// arm_scence1
	this.instance_90 = new lib.arm_scene1();
	this.instance_90.setTransform(570.95,501.85,1,1,0,0,0,75.1,39.9);

	this.timeline.addTween(cjs.Tween.get(this.instance_90).wait(1).to({regX:75,regY:39.8,rotation:1.1538,x:571.3,y:502.8},0).wait(1).to({rotation:2.3075,x:571.75,y:503.85},0).wait(1).to({rotation:3.4613,x:572.2,y:505.05},0).wait(1).to({rotation:4.615,x:572.7,y:506.05},0).wait(1).to({rotation:5.7688,x:573.1,y:507.15},0).wait(1).to({rotation:6.9226,x:573.6,y:508.25},0).wait(1).to({rotation:8.0763,x:574.05,y:509.35},0).wait(1).to({rotation:9.2301,x:574.55,y:510.45},0).wait(1).to({rotation:10.3839,x:575,y:511.5},0).wait(1).to({rotation:11.5376,x:575.5,y:512.6},0).wait(1).to({rotation:12.6914,x:575.9,y:513.7},0).wait(1).to({rotation:13.8451,x:576.4,y:514.75},0).wait(1).to({rotation:14.9989,x:576.85,y:515.85},0).wait(1).to({rotation:13.9213,x:576.5,y:514.85},0).wait(1).to({rotation:12.8437,x:576.2,y:513.8},0).wait(1).to({rotation:11.7662,x:575.9,y:512.8},0).wait(1).to({rotation:10.6886,x:575.55,y:511.75},0).wait(1).to({rotation:9.611,x:575.25,y:510.75},0).wait(1).to({rotation:8.5334,x:574.95,y:509.75},0).wait(1).to({rotation:7.4559,x:574.65,y:508.7},0).wait(1).to({rotation:6.3783,x:574.35,y:507.7},0).wait(1).to({rotation:5.3007,x:574,y:506.7},0).wait(1).to({rotation:4.2231,x:573.65,y:505.65},0).wait(1).to({rotation:3.1456,x:573.35,y:504.6},0).wait(1).to({rotation:2.068,x:573,y:503.6},0).wait(1).to({rotation:0.9904,x:572.7,y:502.6},0).wait(1).to({rotation:-0.0872,x:572.4,y:501.6},0).wait(1).to({rotation:-1.1647,x:572.1,y:500.6},0).wait(1).to({rotation:-2.2423,x:571.75,y:499.5},0).wait(1).to({rotation:-3.3199,x:571.4,y:498.5},0).wait(1).to({rotation:-4.3975,x:571.15,y:497.5},0).wait(1).to({rotation:-5.475,x:570.8,y:496.45},0).wait(1).to({rotation:-6.5526,x:570.5,y:495.45},0).wait(1).to({rotation:-7.6302,x:570.2,y:494.45},0).wait(1).to({rotation:-8.7078,x:569.9,y:493.4},0).wait(1).to({rotation:-9.7853,x:569.5,y:492.35},0).wait(1).to({rotation:-10.8629,x:569.2,y:491.35},0).wait(1).to({rotation:-11.9405,x:568.95,y:490.4},0).wait(1).to({rotation:-9.984,x:569.65,y:492.6},0).wait(1).to({rotation:-8.0276,x:570.35,y:494.8},0).wait(1).to({rotation:-6.0711,x:571.1,y:497.05},0).wait(1).to({rotation:-4.1147,x:571.85,y:499.25},0).wait(1).to({rotation:-2.1582,x:572.6,y:501.5},0).wait(1).to({rotation:-0.2018,x:573.3,y:503.75},0).wait(1).to({rotation:1.7547,x:574.05,y:506},0).wait(1).to({rotation:3.7112,x:574.75,y:508.2},0).wait(1).to({rotation:5.6676,x:575.5,y:510.4},0).wait(1).to({rotation:7.6241,x:576.25,y:512.65},0).wait(1).to({rotation:9.5805,x:577,y:514.9},0).wait(1).to({rotation:11.537,x:577.75,y:517.15},0).wait(1).to({rotation:13.4934,x:578.45,y:519.35},0).wait(1).to({rotation:15.4499,x:579.2,y:521.6},0).wait(1).to({rotation:17.4063,x:579.9,y:523.85},0).wait(1).to({rotation:19.3628,x:580.65,y:526.05},0).wait(1).to({rotation:21.3193,x:581.4,y:528.3},0).wait(1).to({rotation:23.2757,x:582.1,y:530.5},0).wait(1).to({rotation:25.2322,x:582.9,y:532.75},0).wait(1).to({rotation:27.1886,x:583.55,y:534.95},0).wait(1).to({rotation:29.1451,x:584.3,y:537.25},0).wait(1).to({rotation:31.1015,x:585.05,y:539.5},0).wait(1).to({rotation:33.058,x:585.8,y:541.65},0).wait(1).to({rotation:31.5196,x:585.05,y:540},0).wait(1).to({rotation:29.9811,x:584.25,y:538.3},0).wait(1).to({rotation:28.4427,x:583.55,y:536.6},0).wait(1).to({rotation:26.9042,x:582.8,y:534.95},0).wait(1).to({rotation:25.3658,x:582,y:533.25},0).wait(1).to({rotation:23.8273,x:581.25,y:531.55},0).wait(1).to({rotation:22.2889,x:580.5,y:529.9},0).wait(1).to({rotation:20.7504,x:579.75,y:528.15},0).wait(1).to({rotation:19.212,x:579,y:526.55},0).wait(1).to({rotation:17.6735,x:578.2,y:524.8},0).wait(1).to({rotation:16.1351,x:577.5,y:523.15},0).wait(1).to({rotation:14.5966,x:576.75,y:521.45},0).wait(1).to({rotation:13.0582,x:575.95,y:519.75},0).wait(1).to({rotation:11.5197,x:575.25,y:518.1},0).wait(1).to({rotation:9.9813,x:574.45,y:516.4},0).wait(1).to({rotation:8.4428,x:573.75,y:514.7},0).wait(1).to({rotation:6.9044,x:572.95,y:513},0).wait(1).to({rotation:5.3659,x:572.2,y:511.35},0).wait(1).to({rotation:3.8275,x:571.5,y:509.65},0).wait(1).to({rotation:2.289,x:570.7,y:507.95},0).wait(1).to({rotation:0.7506,x:570,y:506.3},0).wait(1).to({rotation:-0.7879,x:569.2,y:504.6},0).wait(1).to({rotation:-2.3263,x:568.45,y:502.9},0).wait(1).to({rotation:-3.8648,x:567.75,y:501.25},0).wait(1).to({rotation:-5.4032,x:566.9,y:499.55},0).wait(1).to({rotation:-6.9417,x:566.15,y:497.9},0).wait(1).to({rotation:-8.4801,x:565.45,y:496.2},0).wait(1).to({rotation:-10.0186,x:564.65,y:494.5},0).wait(1).to({rotation:-11.557,x:563.9,y:492.85},0).wait(1).to({rotation:-13.0955,x:563.15,y:491.1},0).wait(1).to({rotation:-14.6339,x:562.4,y:489.45},0).wait(1).to({rotation:-16.1724,x:561.7,y:487.75},0).wait(1).to({rotation:-17.7108,x:560.9,y:486.1},0).wait(1).to({rotation:-19.2493,x:560.15,y:484.4},0).wait(1).to({rotation:-20.7877,x:559.4,y:482.7},0).wait(1).to({rotation:-22.3262,x:558.65,y:481},0).wait(1).to({rotation:-23.8646,x:557.9,y:479.35},0).wait(1).to({rotation:-25.4031,x:557.1,y:477.7},0).wait(1).to({rotation:-26.9415,x:556.4,y:476},0).wait(1).to({rotation:-25.513,x:557.05,y:477.45},0).wait(1).to({rotation:-24.0844,x:557.65,y:479},0).wait(1).to({rotation:-22.6559,x:558.3,y:480.5},0).wait(1).to({rotation:-21.2273,x:558.9,y:481.95},0).wait(1).to({rotation:-19.7988,x:559.55,y:483.45},0).wait(1).to({rotation:-18.3702,x:560.2,y:484.9},0).wait(1).to({rotation:-16.9417,x:560.8,y:486.45},0).wait(1).to({rotation:-15.5131,x:561.4,y:487.95},0).wait(1).to({rotation:-14.0846,x:562.1,y:489.45},0).wait(1).to({rotation:-12.656,x:562.7,y:490.95},0).wait(1).to({rotation:-11.2275,x:563.3,y:492.45},0).wait(1).to({rotation:-9.799,x:563.9,y:493.9},0).wait(1).to({rotation:-8.3704,x:564.6,y:495.45},0).wait(1).to({rotation:-6.9419,x:565.2,y:496.95},0).wait(1).to({rotation:-5.5133,x:565.8,y:498.4},0).wait(1).to({rotation:-4.0848,x:566.5,y:499.9},0).wait(1).to({rotation:-2.6562,x:567.1,y:501.4},0).wait(1).to({rotation:-1.2277,x:567.75,y:502.9},0).wait(1).to({rotation:0.2009,x:568.35,y:504.4},0).wait(1).to({rotation:1.6294,x:568.95,y:505.95},0).wait(1).to({rotation:3.058,x:569.65,y:507.4},0).wait(1).to({rotation:4.4865,x:570.25,y:508.9},0).wait(1).to({rotation:5.915,x:570.9,y:510.4},0).wait(1).to({rotation:7.3436,x:571.55,y:511.85},0).wait(1).to({rotation:8.7721,x:572.15,y:513.4},0).wait(1).to({rotation:10.2007,x:572.75,y:514.85},0).wait(1).to({rotation:11.6292,x:573.45,y:516.35},0).wait(1).to({rotation:13.0578,x:574.05,y:517.85},0).wait(1).to({rotation:14.4863,x:574.65,y:519.35},0).wait(1).to({rotation:15.9149,x:575.35,y:520.85},0).wait(1).to({rotation:17.3434,x:575.95,y:522.35},0).wait(1).to({rotation:18.7719,x:576.55,y:523.9},0).wait(1).to({rotation:20.2005,x:577.2,y:525.35},0).wait(1).to({rotation:21.629,x:577.85,y:526.85},0).wait(1).to({rotation:23.0576,x:578.45,y:528.3},0).wait(1).to({rotation:24.4861,x:579.1,y:529.85},0).wait(1).to({rotation:25.9147,x:579.7,y:531.35},0).wait(1).to({rotation:27.3432,x:580.35,y:532.85},0).wait(1).to({rotation:28.7718,x:581,y:534.35},0).wait(1).to({rotation:30.2003,x:581.65,y:535.85},0).wait(1).to({rotation:31.6289,x:582.3,y:537.35},0).wait(1).to({rotation:33.0574,x:582.9,y:538.8},0).wait(1).to({rotation:31.9797,x:582.55,y:537.6},0).wait(1).to({rotation:30.902,x:582.3,y:536.45},0).wait(1).to({rotation:29.8243,x:581.95,y:535.3},0).wait(1).to({rotation:28.7465,x:581.65,y:534.05},0).wait(1).to({rotation:27.6688,x:581.35,y:532.9},0).wait(1).to({rotation:26.5911,x:581.1,y:531.7},0).wait(1).to({rotation:25.5134,x:580.8,y:530.5},0).wait(1).to({rotation:24.4357,x:580.5,y:529.3},0).wait(1).to({rotation:23.358,x:580.15,y:528.15},0).wait(1).to({rotation:22.2802,x:579.85,y:527},0).wait(1).to({rotation:21.2025,x:579.55,y:525.7},0).wait(1).to({rotation:20.1248,x:579.25,y:524.55},0).wait(1).to({rotation:19.0471,x:578.95,y:523.4},0).wait(1).to({rotation:17.9694,x:578.65,y:522.2},0).wait(1).to({rotation:16.8917,x:578.35,y:521.05},0).wait(1).to({rotation:15.814,x:578.05,y:519.85},0).wait(1).to({rotation:14.7362,x:577.8,y:518.65},0).wait(1).to({rotation:13.6585,x:577.45,y:517.4},0).wait(1).to({rotation:12.5808,x:577.15,y:516.25},0).wait(1).to({rotation:11.5031,x:576.85,y:515.05},0).wait(1).to({rotation:10.4254,x:576.55,y:513.85},0).wait(1).to({rotation:9.3477,x:576.25,y:512.7},0).wait(1).to({rotation:8.27,x:575.95,y:511.5},0).wait(1).to({rotation:7.1922,x:575.6,y:510.35},0).wait(1).to({rotation:6.1145,x:575.3,y:509.1},0).wait(1).to({rotation:5.0368,x:575,y:507.95},0).wait(1).to({rotation:3.9591,x:574.7,y:506.75},0).wait(1).to({rotation:2.8814,x:574.45,y:505.55},0).wait(1).to({rotation:1.8037,x:574.1,y:504.35},0).wait(1).to({rotation:0.7259,x:573.85,y:503.2},0).wait(1).to({rotation:-0.3518,x:573.55,y:502},0).wait(1).to({rotation:-1.4295,x:573.25,y:500.85},0).wait(1).to({rotation:-2.5072,x:572.95,y:499.6},0).wait(1).to({rotation:-3.5849,x:572.65,y:498.4},0).wait(1).to({rotation:-4.6626,x:572.35,y:497.2},0).wait(2).to({_off:true},1).wait(876));

	// בועתדיבור1
	this.instance_91 = new lib.CachedBmp_29();
	this.instance_91.setTransform(437.1,60.9,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance_91).to({_off:true},180).wait(876));

	// scence1
	this.instance_92 = new lib.CachedBmp_30();
	this.instance_92.setTransform(295.85,292.5,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance_92).to({_off:true},180).wait(876));

	// וילוןשמאל
	this.instance_93 = new lib.וילוןימין("synched",0);
	this.instance_93.setTransform(603.2,377.1,1.2007,1,0,0,180,30.8,203.2);

	this.timeline.addTween(cjs.Tween.get(this.instance_93).to({_off:true},180).wait(876));

	// וילוןימין
	this.instance_94 = new lib.וילוןימין("synched",0);
	this.instance_94.setTransform(763.5,377.1,1,1,0,0,0,30.7,203.2);

	this.timeline.addTween(cjs.Tween.get(this.instance_94).to({_off:true},180).wait(876));

	// sea1
	this.instance_95 = new lib.sea1("synched",0);
	this.instance_95.setTransform(699.9,530.55,1.1958,1,0,0,0,65,44.8);

	this.timeline.addTween(cjs.Tween.get(this.instance_95).wait(1).to({regX:64.8,regY:44.7,scaleX:1.3845,scaleY:0.9993,x:699.1,y:530.4},0).wait(1).to({scaleX:1.3852,scaleY:0.9985,x:698.65},0).wait(1).to({scaleX:1.3859,scaleY:0.9978,x:698.2,y:530.35},0).wait(1).to({scaleX:1.3867,scaleY:0.9971,x:697.75},0).wait(1).to({scaleX:1.3874,scaleY:0.9963,x:697.3},0).wait(1).to({scaleX:1.3881,scaleY:0.9956,x:696.85,y:530.3},0).wait(1).to({scaleX:1.3889,scaleY:0.9949,x:696.4},0).wait(1).to({scaleX:1.3896,scaleY:0.9942,x:695.95},0).wait(1).to({scaleX:1.3903,scaleY:0.9934,x:695.5,y:530.25},0).wait(1).to({scaleX:1.3911,scaleY:0.9927,x:695.05},0).wait(1).to({scaleX:1.3918,scaleY:0.992,x:694.6},0).wait(1).to({scaleX:1.3925,scaleY:0.9912,x:694.15,y:530.2},0).wait(1).to({scaleX:1.3933,scaleY:0.9905,x:693.7,y:530.25},0).wait(1).to({scaleX:1.394,scaleY:0.9898,x:693.25,y:530.2},0).wait(1).to({scaleX:1.3947,scaleY:0.989,x:692.8,y:530.15},0).wait(1).to({scaleX:1.3955,scaleY:0.9883,x:692.35},0).wait(1).to({scaleX:1.3962,scaleY:0.9876,x:691.85},0).wait(1).to({scaleX:1.3969,scaleY:0.9869,x:691.4,y:530.1},0).wait(1).to({scaleX:1.3977,scaleY:0.9861,x:690.95},0).wait(1).to({scaleX:1.3984,scaleY:0.9854,x:690.5},0).wait(1).to({scaleX:1.3991,scaleY:0.9847,x:690.05,y:530.05},0).wait(1).to({scaleX:1.3999,scaleY:0.9839,x:689.6},0).wait(1).to({scaleX:1.4006,scaleY:0.9832,x:689.15},0).wait(1).to({scaleX:1.4013,scaleY:0.9825,x:688.7,y:530},0).wait(1).to({scaleX:1.4021,scaleY:0.9817,x:688.25},0).wait(1).to({scaleX:1.4028,scaleY:0.981,x:687.8},0).wait(1).to({scaleX:1.4035,scaleY:0.9803,x:687.35,y:529.95},0).wait(1).to({scaleX:1.4043,scaleY:0.9795,x:686.85},0).wait(1).to({scaleX:1.405,scaleY:0.9788,x:686.4},0).wait(1).to({scaleX:1.4057,scaleY:0.9781,x:685.95,y:529.9},0).wait(1).to({scaleX:1.4065,scaleY:0.9774,x:685.5},0).wait(1).to({scaleX:1.4072,scaleY:0.9766,x:685.05,y:529.85},0).wait(1).to({scaleX:1.4079,scaleY:0.9759,x:684.6},0).wait(1).to({scaleX:1.4087,scaleY:0.9752,x:684.15},0).wait(1).to({scaleX:1.4094,scaleY:0.9744,x:683.7,y:529.8},0).wait(1).to({scaleX:1.4101,scaleY:0.9737,x:683.25},0).wait(1).to({scaleX:1.4109,scaleY:0.973,x:682.75},0).wait(1).to({scaleX:1.4116,scaleY:0.9722,x:682.3,y:529.75},0).wait(1).to({scaleX:1.4121,scaleY:0.9715,x:681.95,y:529.9},0).wait(1).to({scaleX:1.4125,scaleY:0.9708,x:681.65,y:529.95},0).wait(1).to({scaleX:1.413,scaleY:0.97,x:681.25,y:530},0).wait(1).to({scaleX:1.4134,scaleY:0.9693,x:680.9,y:530.1},0).wait(1).to({scaleX:1.4139,scaleY:0.9686,x:680.5,y:530.2},0).wait(1).to({scaleX:1.4143,scaleY:0.9679,x:680.15,y:530.25},0).wait(1).to({scaleX:1.4148,scaleY:0.9671,x:679.8,y:530.35},0).wait(1).to({scaleX:1.4153,scaleY:0.9664,x:679.45,y:530.4},0).wait(1).to({scaleX:1.4157,scaleY:0.9657,x:679.1,y:530.5},0).wait(1).to({scaleX:1.4162,scaleY:0.9649,x:678.7,y:530.6},0).wait(1).to({scaleX:1.4166,scaleY:0.9642,x:678.35,y:530.65},0).wait(1).to({scaleX:1.4171,scaleY:0.9635,x:678,y:530.7},0).wait(1).to({scaleX:1.4175,scaleY:0.9627,x:677.6,y:530.85},0).wait(1).to({scaleX:1.418,scaleY:0.962,x:677.3,y:530.9},0).wait(1).to({scaleX:1.4185,scaleY:0.9613,x:676.9,y:530.95},0).wait(1).to({scaleX:1.4189,scaleY:0.9606,x:676.55,y:531.05},0).wait(1).to({scaleX:1.4194,scaleY:0.9598,x:676.15,y:531.15},0).wait(1).to({scaleX:1.4198,scaleY:0.9591,x:675.8,y:531.2},0).wait(1).to({scaleX:1.4203,scaleY:0.9584,x:675.45,y:531.3},0).wait(1).to({scaleX:1.4207,scaleY:0.9576,x:675.1,y:531.35},0).wait(1).to({scaleX:1.4212,scaleY:0.9569,x:674.75,y:531.45},0).wait(1).to({scaleX:1.4216,scaleY:0.9562,x:674.35,y:531.55},0).wait(1).to({scaleX:1.4221,scaleY:0.9554,x:674,y:531.6},0).wait(1).to({scaleX:1.4226,scaleY:0.9547,x:673.65,y:531.65},0).wait(1).to({scaleX:1.423,scaleY:0.954,x:673.25,y:531.8},0).wait(1).to({scaleX:1.4235,scaleY:0.9532,x:672.95,y:531.85},0).wait(1).to({scaleX:1.4239,scaleY:0.9525,x:672.55,y:531.95},0).wait(1).to({scaleX:1.4244,scaleY:0.9518,x:672.2,y:532},0).wait(1).to({scaleX:1.4248,scaleY:0.9511,x:671.85,y:532.1},0).wait(1).to({scaleX:1.4253,scaleY:0.9503,x:671.45,y:532.2},0).wait(1).to({scaleX:1.4257,scaleY:0.9496,x:671.15,y:532.25},0).wait(1).to({scaleX:1.4262,scaleY:0.9489,x:670.75,y:532.3},0).wait(1).to({scaleX:1.4267,scaleY:0.9481,x:670.4,y:532.45},0).wait(1).to({scaleX:1.4271,scaleY:0.9474,x:670.05,y:532.5},0).wait(1).to({scaleX:1.4276,scaleY:0.9467,x:669.65,y:532.55},0).wait(1).to({scaleX:1.428,scaleY:0.9459,x:669.3,y:532.65},0).wait(1).to({scaleX:1.4285,scaleY:0.9452,x:668.95,y:532.75},0).wait(1).to({scaleX:1.4289,scaleY:0.9445,x:668.6,y:532.8},0).wait(1).to({scaleX:1.4294,scaleY:0.9437,x:668.2,y:532.9},0).wait(1).to({scaleX:1.4299,scaleY:0.943,x:667.85,y:532.95},0).wait(1).to({scaleX:1.4303,scaleY:0.9423,x:667.5,y:533.05},0).wait(1).to({scaleX:1.4299,scaleY:0.9416,x:668.3,y:533.1},0).wait(1).to({scaleX:1.4294,scaleY:0.9408,x:669.1,y:533.15},0).wait(1).to({scaleX:1.429,scaleY:0.9401,x:669.85,y:533.2},0).wait(1).to({scaleX:1.4286,scaleY:0.9394,x:670.65,y:533.25},0).wait(1).to({scaleX:1.4281,scaleY:0.9386,x:671.45,y:533.3},0).wait(1).to({scaleX:1.4277,scaleY:0.9379,x:672.25},0).wait(1).to({scaleX:1.4273,scaleY:0.9372,x:673.05,y:533.4},0).wait(1).to({scaleX:1.4268,scaleY:0.9364,x:673.8,y:533.45},0).wait(1).to({scaleX:1.4264,scaleY:0.9357,x:674.65,y:533.5},0).wait(1).to({scaleX:1.426,scaleY:0.935,x:675.4,y:533.55},0).wait(1).to({scaleX:1.4255,scaleY:0.9343,x:676.15,y:533.6},0).wait(1).to({scaleX:1.4251,scaleY:0.9335,x:677,y:533.65},0).wait(1).to({scaleX:1.4247,scaleY:0.9328,x:677.75,y:533.7},0).wait(1).to({scaleX:1.4242,scaleY:0.9321,x:678.6,y:533.75},0).wait(1).to({scaleX:1.4238,scaleY:0.9313,x:679.35,y:533.8},0).wait(1).to({scaleX:1.4234,scaleY:0.9306,x:680.15,y:533.85},0).wait(1).to({scaleX:1.4229,scaleY:0.9299,x:680.95,y:533.9},0).wait(1).to({scaleX:1.4225,scaleY:0.9291,x:681.75,y:533.95},0).wait(1).to({scaleX:1.4221,scaleY:0.9284,x:682.5,y:534},0).wait(1).to({scaleX:1.4216,scaleY:0.9277,x:683.3},0).wait(1).to({scaleX:1.4212,scaleY:0.9269,x:684.1,y:534.1},0).wait(1).to({scaleX:1.4208,scaleY:0.9262,x:684.9,y:534.15},0).wait(1).to({scaleX:1.4203,scaleY:0.9255,x:685.7},0).wait(1).to({scaleX:1.4199,scaleY:0.9248,x:686.45,y:534.25},0).wait(1).to({scaleX:1.4195,scaleY:0.924,x:687.3,y:534.3},0).wait(1).to({scaleX:1.419,scaleY:0.9233,x:688.05},0).wait(1).to({scaleX:1.4186,scaleY:0.9226,x:688.85,y:534.4},0).wait(1).to({scaleX:1.4182,scaleY:0.9218,x:689.65,y:534.45},0).wait(1).to({scaleX:1.4241,scaleY:0.9211,x:689.6},0).wait(1).to({scaleX:1.4301,scaleY:0.9204,x:689.5,y:534.55},0).wait(1).to({scaleX:1.436,scaleY:0.9196,x:689.45,y:534.6},0).wait(1).to({scaleX:1.442,scaleY:0.9189,x:689.35},0).wait(1).to({scaleX:1.4479,scaleY:0.9182,x:689.25,y:534.7},0).wait(1).to({scaleX:1.4538,scaleY:0.9175,x:689.2,y:534.75},0).wait(1).to({scaleX:1.4598,scaleY:0.9167,x:689.15,y:534.8},0).wait(1).to({scaleX:1.4657,scaleY:0.916,x:689.1,y:534.85},0).wait(1).to({scaleX:1.4717,scaleY:0.9153,x:689,y:534.9},0).wait(1).to({scaleX:1.4776,scaleY:0.9145,x:688.95,y:535},0).wait(1).to({scaleX:1.4836,scaleY:0.9138,x:688.9},0).wait(1).to({scaleX:1.4895,scaleY:0.9131,x:688.75,y:535.05},0).wait(1).to({scaleX:1.4955,scaleY:0.9123,x:688.7,y:535.15},0).wait(1).to({scaleX:1.5014,scaleY:0.9116,x:688.65},0).wait(1).to({scaleX:1.4995,scaleY:0.9109,x:687.3,y:535.2},0).wait(1).to({scaleX:1.4977,scaleY:0.9101,x:685.95,y:535.3},0).wait(1).to({scaleX:1.4958,scaleY:0.9094,x:684.65},0).wait(1).to({scaleX:1.494,scaleY:0.9087,x:683.3,y:535.35},0).wait(1).to({scaleX:1.4921,scaleY:0.908,x:681.95,y:535.4},0).wait(1).to({scaleX:1.4903,scaleY:0.9072,x:680.6,y:535.45},0).wait(1).to({scaleX:1.4884,scaleY:0.9065,x:679.3,y:535.5},0).wait(1).to({scaleX:1.4865,scaleY:0.9058,x:677.95,y:535.55},0).wait(1).to({scaleX:1.4847,scaleY:0.905,x:676.6,y:535.6},0).wait(1).to({scaleX:1.4828,scaleY:0.9043,x:675.3},0).wait(1).to({scaleX:1.481,scaleY:0.9036,x:673.9,y:535.7},0).wait(1).to({scaleX:1.4791,scaleY:0.9028,x:672.6,y:535.75},0).wait(1).to({scaleX:1.4772,scaleY:0.9021,x:671.2},0).wait(1).to({scaleX:1.4754,scaleY:0.9014,x:669.9,y:535.85},0).wait(1).to({scaleX:1.4735,scaleY:0.9006,x:668.6},0).wait(1).to({scaleX:1.4717,scaleY:0.8999,x:669.1,y:535.9},0).wait(1).to({scaleX:1.4698,scaleY:0.8992,x:669.65,y:535.85},0).wait(1).to({scaleX:1.468,scaleY:0.8985,x:670.15,y:535.8},0).wait(1).to({scaleX:1.4661,scaleY:0.8977,x:670.7},0).wait(1).to({scaleX:1.4642,scaleY:0.897,x:671.25},0).wait(1).to({scaleX:1.4624,scaleY:0.8963,x:671.75,y:535.75},0).wait(1).to({scaleX:1.4605,scaleY:0.8955,x:672.3},0).wait(1).to({scaleX:1.4587,scaleY:0.8948,x:672.8,y:535.7},0).wait(1).to({scaleX:1.4568,scaleY:0.8941,x:673.35},0).wait(1).to({scaleX:1.4549,scaleY:0.8933,x:673.9},0).wait(1).to({scaleX:1.4531,scaleY:0.8926,x:674.35,y:535.65},0).wait(1).to({scaleX:1.4512,scaleY:0.8919,x:674.9,y:535.6},0).wait(1).to({scaleX:1.4494,scaleY:0.8912,x:675.4,y:535.65},0).wait(1).to({scaleX:1.4475,scaleY:0.8904,x:675.95,y:535.6},0).wait(1).to({scaleX:1.4457,scaleY:0.8897,x:676.5,y:535.55},0).wait(1).to({scaleX:1.4438,scaleY:0.889,x:677},0).wait(1).to({scaleX:1.4419,scaleY:0.8882,x:677.55,y:535.5},0).wait(1).to({scaleX:1.4401,scaleY:0.8875,x:678.05},0).wait(1).to({scaleX:1.4382,scaleY:0.8868,x:678.6},0).wait(1).to({scaleX:1.4364,scaleY:0.886,x:679.15,y:535.45},0).wait(1).to({scaleX:1.4345,scaleY:0.8853,x:679.65,y:535.4},0).wait(1).to({scaleX:1.4326,scaleY:0.8846,x:680.2,y:535.45},0).wait(1).to({scaleX:1.4308,scaleY:0.8838,x:680.7,y:535.4},0).wait(1).to({scaleX:1.4289,scaleY:0.8831,x:681.25,y:535.35},0).wait(1).to({scaleX:1.4271,scaleY:0.8824,x:681.75},0).wait(1).to({scaleX:1.4252,scaleY:0.8817,x:682.3},0).wait(1).to({scaleX:1.4234,scaleY:0.8809,x:682.85},0).wait(1).to({scaleX:1.4215,scaleY:0.8802,x:683.35,y:535.3},0).wait(1).to({scaleX:1.4196,scaleY:0.8795,x:683.9,y:535.25},0).wait(1).to({scaleX:1.4178,scaleY:0.8787,x:684.4,y:535.3},0).wait(1).to({scaleX:1.4159,scaleY:0.878,x:684.95,y:535.25},0).wait(1).to({scaleX:1.4141,scaleY:0.8773,x:685.5,y:535.2},0).wait(1).to({scaleX:1.4122,scaleY:0.8765,x:686},0).wait(1).to({scaleX:1.4103,scaleY:0.8758,x:686.55},0).wait(1).to({scaleX:1.4085,scaleY:0.8751,x:687.05,y:535.15},0).wait(1).to({scaleX:1.4066,scaleY:0.8743,x:687.6},0).wait(1).to({scaleX:1.4048,scaleY:0.8736,x:688.15,y:535.1},0).wait(1).to({scaleX:1.4029,scaleY:0.8729,x:688.65},0).wait(1).to({scaleX:1.4011,scaleY:0.8722,x:689.2},0).wait(1).to({scaleX:1.3992,scaleY:0.8714,x:689.7,y:535.05},0).wait(1).to({scaleX:1.3973,scaleY:0.8707,x:690.25,y:535},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).to({_off:true},1).wait(876));

	// bg1
	this.instance_96 = new lib.CachedBmp_31();
	this.instance_96.setTransform(-5.15,0,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance_96).to({_off:true},180).wait(876));

	this._renderFirstFrame();

}).prototype = p = new lib.AnMovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,1479.8,1327.9);
// library properties:
lib.properties = {
	id: '006F4E1C926E914287B6F42815302C08',
	width: 1132,
	height: 1007,
	fps: 30,
	color: "#FFFFFF",
	opacity: 1.00,
	manifest: [
		{src:"images/CachedBmp_31.png?1650627356488", id:"CachedBmp_31"},
		{src:"images/CachedBmp_28.png?1650627356488", id:"CachedBmp_28"},
		{src:"images/CachedBmp_26.png?1650627356488", id:"CachedBmp_26"},
		{src:"images/CachedBmp_23.png?1650627356488", id:"CachedBmp_23"},
		{src:"images/CachedBmp_21.png?1650627356488", id:"CachedBmp_21"},
		{src:"images/CachedBmp_19.png?1650627356488", id:"CachedBmp_19"},
		{src:"images/CachedBmp_17.png?1650627356488", id:"CachedBmp_17"},
		{src:"images/CachedBmp_15.png?1650627356488", id:"CachedBmp_15"},
		{src:"images/CachedBmp_13.png?1650627356488", id:"CachedBmp_13"},
		{src:"images/CachedBmp_58.png?1650627356488", id:"CachedBmp_58"},
		{src:"images/CachedBmp_7.png?1650627356488", id:"CachedBmp_7"},
		{src:"images/CachedBmp_4.png?1650627356488", id:"CachedBmp_4"},
		{src:"images/CachedBmp_2.png?1650627356488", id:"CachedBmp_2"},
		{src:"images/StoryboardFinal_atlas_1.png?1650627356177", id:"StoryboardFinal_atlas_1"},
		{src:"images/StoryboardFinal_atlas_2.png?1650627356178", id:"StoryboardFinal_atlas_2"},
		{src:"images/StoryboardFinal_atlas_3.png?1650627356178", id:"StoryboardFinal_atlas_3"},
		{src:"images/StoryboardFinal_atlas_4.png?1650627356178", id:"StoryboardFinal_atlas_4"},
		{src:"images/StoryboardFinal_atlas_5.png?1650627356178", id:"StoryboardFinal_atlas_5"},
		{src:"images/StoryboardFinal_atlas_6.png?1650627356178", id:"StoryboardFinal_atlas_6"},
		{src:"images/StoryboardFinal_atlas_7.png?1650627356178", id:"StoryboardFinal_atlas_7"},
		{src:"images/StoryboardFinal_atlas_8.png?1650627356178", id:"StoryboardFinal_atlas_8"},
		{src:"images/StoryboardFinal_atlas_9.png?1650627356178", id:"StoryboardFinal_atlas_9"},
		{src:"sounds/_1minutedancemusicwavquiet.mp3?1650627356488", id:"_1minutedancemusicwavquiet"},
		{src:"sounds/startclickwav.mp3?1650627356488", id:"startclickwav"}
	],
	preloads: []
};



// bootstrap callback support:

(lib.Stage = function(canvas) {
	createjs.Stage.call(this, canvas);
}).prototype = p = new createjs.Stage();

p.setAutoPlay = function(autoPlay) {
	this.tickEnabled = autoPlay;
}
p.play = function() { this.tickEnabled = true; this.getChildAt(0).gotoAndPlay(this.getTimelinePosition()) }
p.stop = function(ms) { if(ms) this.seek(ms); this.tickEnabled = false; }
p.seek = function(ms) { this.tickEnabled = true; this.getChildAt(0).gotoAndStop(lib.properties.fps * ms / 1000); }
p.getDuration = function() { return this.getChildAt(0).totalFrames / lib.properties.fps * 1000; }

p.getTimelinePosition = function() { return this.getChildAt(0).currentFrame / lib.properties.fps * 1000; }

an.bootcompsLoaded = an.bootcompsLoaded || [];
if(!an.bootstrapListeners) {
	an.bootstrapListeners=[];
}

an.bootstrapCallback=function(fnCallback) {
	an.bootstrapListeners.push(fnCallback);
	if(an.bootcompsLoaded.length > 0) {
		for(var i=0; i<an.bootcompsLoaded.length; ++i) {
			fnCallback(an.bootcompsLoaded[i]);
		}
	}
};

an.compositions = an.compositions || {};
an.compositions['006F4E1C926E914287B6F42815302C08'] = {
	getStage: function() { return exportRoot.stage; },
	getLibrary: function() { return lib; },
	getSpriteSheet: function() { return ss; },
	getImages: function() { return img; }
};

an.compositionLoaded = function(id) {
	an.bootcompsLoaded.push(id);
	for(var j=0; j<an.bootstrapListeners.length; j++) {
		an.bootstrapListeners[j](id);
	}
}

an.getComposition = function(id) {
	return an.compositions[id];
}


an.makeResponsive = function(isResp, respDim, isScale, scaleType, domContainers) {		
	var lastW, lastH, lastS=1;		
	window.addEventListener('resize', resizeCanvas);		
	resizeCanvas();		
	function resizeCanvas() {			
		var w = lib.properties.width, h = lib.properties.height;			
		var iw = window.innerWidth, ih=window.innerHeight;			
		var pRatio = window.devicePixelRatio || 1, xRatio=iw/w, yRatio=ih/h, sRatio=1;			
		if(isResp) {                
			if((respDim=='width'&&lastW==iw) || (respDim=='height'&&lastH==ih)) {                    
				sRatio = lastS;                
			}				
			else if(!isScale) {					
				if(iw<w || ih<h)						
					sRatio = Math.min(xRatio, yRatio);				
			}				
			else if(scaleType==1) {					
				sRatio = Math.min(xRatio, yRatio);				
			}				
			else if(scaleType==2) {					
				sRatio = Math.max(xRatio, yRatio);				
			}			
		}
		domContainers[0].width = w * pRatio * sRatio;			
		domContainers[0].height = h * pRatio * sRatio;
		domContainers.forEach(function(container) {				
			container.style.width = w * sRatio + 'px';				
			container.style.height = h * sRatio + 'px';			
		});
		stage.scaleX = pRatio*sRatio;			
		stage.scaleY = pRatio*sRatio;
		lastW = iw; lastH = ih; lastS = sRatio;            
		stage.tickOnUpdate = false;            
		stage.update();            
		stage.tickOnUpdate = true;		
	}
}
an.handleSoundStreamOnTick = function(event) {
	if(!event.paused){
		var stageChild = stage.getChildAt(0);
		if(!stageChild.paused || stageChild.ignorePause){
			stageChild.syncStreamSounds();
		}
	}
}
an.handleFilterCache = function(event) {
	if(!event.paused){
		var target = event.target;
		if(target){
			if(target.filterCacheList){
				for(var index = 0; index < target.filterCacheList.length ; index++){
					var cacheInst = target.filterCacheList[index];
					if((cacheInst.startFrame <= target.currentFrame) && (target.currentFrame <= cacheInst.endFrame)){
						cacheInst.instance.cache(cacheInst.x, cacheInst.y, cacheInst.w, cacheInst.h);
					}
				}
			}
		}
	}
}


})(createjs = createjs||{}, AdobeAn = AdobeAn||{});
var createjs, AdobeAn;