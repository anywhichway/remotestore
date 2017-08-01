(function() {
	"use strict";
	
	var fetch;
	if(typeof(module)!=="undefined" && typeof(window)==="undefined") {
		fetch = require("node-fetch");
	} else {
		fetch = window.fetch;
	}

	function RemoteStore(location,options={clear:false,encoding:"utf8",cache:true}) {
		this.location = location;
		this.cache = !options.cache || {};
		if(options.clear) {
			this.clear();
		}
	}
	RemoteStore.prototype.apply = async function(name,args=[]) {
		const response = await fetch(this.location+"/"+name,{method:"POST",body:JSON.stringify(args)}).catch((e) => { return {status:e.code}; });
		if(response.status!==200) {
			throw new Error("Server return non-200 status " + response.status);
		}
		try {
			return await response.json(); 
		} catch(e) {
			// if error, then remote call returned undefined
		}
	}
	RemoteStore.prototype.clear = async function() {
		const response = await fetch("clear",{method:"POST"}).catch((e) => { return {status:e.code}; });
		if(response.status!==200) {
			throw new Error("Server return non-200 status " + response.status);
		}
		return response.json();
	}
	RemoteStore.prototype.count = async function() {
		return await this.apply("count");
	}
	RemoteStore.prototype.delete = async function(id) {
		const response = await fetch(this.location+"/"+id,{method:"DELETE"}).catch((e) => { return {status:e.code}; }); // ctach of await doe snot work, use block
		if(response.status!==200) {
			throw new Error("Server return non-200 status " + response.status);
		}
	}
	RemoteStore.prototype.removeItem = RemoteStore.prototype.delete;
	RemoteStore.prototype.flush = async function(id) {
		if(this.cache) {
			if(typeof(this.cache)!=="object") {
				this.cache = {};
			} else if(id) {
				delete this.cache[id];
			} else {
				this.cache = {};
			}
		}
	}
	RemoteStore.prototype.get = async function(id) {
		const hit = (this.cache ? this.cache[id] : null);
		let result;
		if(hit) {
			hit.hits++;
			result = hit.value;
		} else {
			if(this.cache && typeof(this.cache)!=="object") {
				this.cache = {};
			}
			const response = await fetch(this.location+"/"+id,{method:"GET"}).catch((e) => { return {status:e.code}; });
			if(response.status!==200) {
				throw new Error("Server return non-200 status " + response.status);
			}
			result = await response.json();
			if(this.cache) {
				this.cache[id] = {value:result,hits:0};
			}
		}
		return result;
	}
	RemoteStore.prototype.getItem = RemoteStore.prototype.get;
	RemoteStore.prototype.key = async function(number) {
		return await this.apply("key",[number]);
	}
	RemoteStore.prototype.set = async function(id,data) {
		const response = await fetch(this.location+"/"+id,{method:"PUT",body:JSON.stringify(data)}).catch((e) => { return {status:e.code}; });
		if(response.status!==200) {
			throw new Error("Server returned non-200 status " + response.status);
		}
	}
	RemoteStore.prototype.setItem = RemoteStore.prototype.set;
	
	if(typeof(module)!=="undefined") {
		module.exports = RemoteStore;
	}
	if(typeof(window)!=="undefined") {
		window.RemoteStore = RemoteStore;
	}
	
}).call(this);