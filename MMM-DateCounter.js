/* Magic Mirror
*  Module: Date Counter
*
*  By Jesse Alltop
*/

Module.register("MMM-DateCounter", {

	//Module config defaults
	defaults: {
		updateInterval: 1000,
		remoteFile: null,
		eventDate: "2020-07-15",
		eventStartTime: "0:00",
		eventTitle: "Happy Birthday!",
		showLongCountdown: true,
		longCountdownFormat: "year,month,week,day,hour,minute,second",
		longCountdownAutoSize: true,
		// icon: "/modules/MMM-DateCounter/Flat_tick_icon.svg"
		// icon: "https://upload.wikimedia.org/wikipedia/commons/7/73/Flat_tick_icon.svg"
		icon: null,
		hideOnExpiration: false
	},

	// Define required scripts.
	getScripts: function () {
		return ["moment.js"];
	},

	getStyles: function () {
		return ["MMM-DateCounter.css"];
	},

	// Define start sequence.
	start: function () {
		Log.info("Starting module: " + this.name);

		var self = this;
		if (this.config.remoteFile !== null) {
			this.eventFile(function (response) {
				self.config.dateCounter = JSON.parse(response);
				self.updateDom();
			});
		}

		// Schedule update timer.
		setInterval(function () {
			self.updateDom();
		}, this.config.updateInterval);
	},

	eventFile: function (callback) {
		var xobj = new XMLHttpRequest(),
			isRemote = this.config.remoteFile.indexOf("http://") === 0 || this.config.remoteFile.indexOf("https://") === 0,
			path = isRemote ? this.config.remoteFile : this.file(this.config.remoteFile);
		xobj.overrideMimeType("application/json");
		xobj.open("GET", path, true);
		xobj.onreadystatechange = function () {
			if (xobj.readyState === 4 && xobj.status === 200) {
				callback(xobj.responseText);
			}
		};
		xobj.send(null);
	},

	// Override dom generator.
	getDom: function () {
		var wrapper = document.createElement("div");
		wrapper.id = this.config.classes ? this.config.classes : "DATE_COUNTER";
		if(this.config.hideOnExpiration && !this.isFutureDate(moment(this.config.eventDate + "T" + this.config.eventStartTime, "YYYY-MM-DDThh:mm"))) {
			wrapper.hidden = true;
			return wrapper;
		}
		// get the eventTitle text

		var titleDiv = document.createElement("div");
		titleDiv.id = "DATE_COUNTER_TITLE";
		var eventTitleText = this.config.eventTitle;
		titleDiv.appendChild(document.createTextNode(eventTitleText));

		//get the countdown to date
		var countdownTextDiv = document.createElement("div");
		countdownTextDiv.id = "DATE_COUNTER_COUNTDOWN_TEXT";

		var remainingTime;

		if (this.config.showLongCountdown) {
			remainingTime = this.getDuration(moment(this.config.eventDate + "T" + this.config.eventStartTime, "YYYY-MM-DDThh:mm"));
		} else {
			remainingTime = moment(this.config.eventDate + "T" + this.config.eventStartTime, "YYYY-MM-DDThh:mm").fromNow();
		}

		countdownTextDiv.appendChild(document.createTextNode(remainingTime));

		if (this.config.longCountdownAutoSize) {
			var count = (remainingTime.match(/,/g) || []).length;
			var newFontSize = 20 - (count);
			countdownTextDiv.innerHTML = "<span style=\"font-size:" + newFontSize + "pt\">" + remainingTime + "</span>";
		}

		var event = document.createElement("div");
		event.id = "DATE_COUNTER_TEXT_GROUP";
		// process all the parts of the compliment text

		event.appendChild(titleDiv);
		//add line
		var hr = document.createElement("hr");
		hr.classList.add("date_counter_hr")
		event.appendChild(hr);
		//add differnece between current time and event date/time
		event.appendChild(countdownTextDiv);

		wrapper.appendChild(event);

		if (this.config.icon !== null) {
			var iconDiv = document.createElement("div");
			iconDiv.id = "DATE_COUNTER_ICON";

			var icon = document.createElement("img");
			icon.src = this.config.icon;

			iconDiv.appendChild(icon);
			wrapper.appendChild(iconDiv);

			wrapper.style.display = "grid";
		}

		return wrapper;
	},

	isFutureDate: function(time) {
		return (moment().diff(time) < 0);
	},

	getDuration: function (time) {
		var units = new Map();

		if (this.isFutureDate(time)) {
			this.updateMapAndRemoveUnitFuture(units, "year", "years", time);
			this.updateMapAndRemoveUnitFuture(units, "month", "months", time);
			this.updateMapAndRemoveUnitFuture(units, "week", "weeks", time);
			this.updateMapAndRemoveUnitFuture(units, "day", "days", time);
			this.updateMapAndRemoveUnitFuture(units, "hour", "hours", time);
			this.updateMapAndRemoveUnitFuture(units, "minute", "minutes", time);
			this.updateMapAndRemoveUnitFuture(units, "second", "seconds", time);
		} else {
			this.updateMapAndRemoveUnitPast(units, "year", "years", time);
			this.updateMapAndRemoveUnitPast(units, "month", "months", time);
			this.updateMapAndRemoveUnitPast(units, "week", "weeks", time);
			this.updateMapAndRemoveUnitPast(units, "day", "days", time);
			this.updateMapAndRemoveUnitPast(units, "hour", "hours", time);
			this.updateMapAndRemoveUnitPast(units, "minute", "minutes", time);
			this.updateMapAndRemoveUnitPast(units, "second", "seconds", time);
		}
		units.forEach(this.buildDurationString);

		return this.buildCountdownDisplay(units);
	},

	updateMapAndRemoveUnitFuture: function (map, key, unit, time) {
		if (this.config.longCountdownFormat.toLowerCase().indexOf(key) === -1) {
			console.log(key + " was not setup in the config");
			return;
		}
		map.set(key, Math.abs(moment().diff(time, unit, false)));
		time = time.subtract(map.get(key), unit);
	},

	updateMapAndRemoveUnitPast: function (map, key, unit, time) {
		if (this.config.longCountdownFormat.toLowerCase().indexOf(key) === -1) {
			console.log(key + " was not setup in the config");
			return;
		}
		map.set(key, moment().diff(time, unit, false));
		time = time.add(map.get(key), unit);
	},

	buildCountdownDisplay(units) {
		var displayText = "";
		for (const [key, value] of units.entries()) {
			if (key === "second" || value !== 0) {
				displayText = displayText.concat(displayText.length === 0 ? "" : ", ", value, " ", key, value > 1 ? "s" : "");
			}
		}

		displayText = displayText.split(/,/).reduce((a, b, i) => i % 2 == 0 ? a + ",\n" + b : a + "," + b);

		return displayText;
	},

	buildDurationString: function (value, key) {
		if (value !== 0) {
			return value + key + value > 1 ? "s" : "";
		}
	}
});
