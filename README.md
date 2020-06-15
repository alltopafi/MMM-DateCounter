## MMM-DateCounter

Display a countdown or count up to a specfic date.

## Screenshots

### Long format with icon
![Long format with icon](https://github.com/alltopafi/MMM-DateCounter/blob/master/screenshots/long-format-with-icon.png)

### Long format without hours, minutes, or seconds
![Long format without hours, minutes, or seconds](https://github.com/alltopafi/MMM-DateCounter/blob/master/screenshots/long-format-without-hours-min-sec.png)

### Default moment fromNow no icon
![Default moment fromNow no icon](https://github.com/alltopafi/MMM-DateCounter/blob/master/screenshots/default-moment-fromNow-no-icon.png)

### Default momenent fromNow with icon
![Default momenent fromNow with icon](https://github.com/alltopafi/MMM-DateCounter/blob/master/screenshots/default-moment-fromNow-with-icon.png)

## Regular installation


```
git clone https://github.com/alltopafi/MMM-DateCounter.git
cd MMM-DateCounter
npm install
```

## Configuration

```
{
    module: "MMM-DateCounter",
    position: "top_left",
    config: {
        updateInterval: 1000,
        remoteFile: null,
        eventDate: "2020-07-15",
        eventStartTime: "0:00",
        eventTitle: "Happy Birthday!",
        showLongCountdown: true,
        longCountdownFormat: "year,month,week,day,hour,minute,second",
        longCountdownAutoSize: true,
        icon: "/modules/MMM-DateCounter/birthday_cake.svg"
    }
}

```

### Usage

#### **`updateInterval`**

How often the the module will update the countdown. Tip: If you using longCountdown set this to whatever your smallest unit is ie if including seconds set to 1000, if using minute as smallest unit use 60000.

##### Default:
```updateInterval: 1000,```

#### **`updateInterval`**

You can point to a remote config file instead of a local file.

##### Default:
```remoteFile: null,```

#### **`eventDate`**

The ISO 8601 date (YYYY-MM-dd) of the event you are counting to/from/

##### Default:
```eventDate: "2020-07-15",```

#### **`eventStartTime`**

The time (h:mm:-ss) that you the event starts/occurs.

##### Default:
```eventStartTime: "0:00",```

#### **`eventTitle`**

The title to be displayed above the counter.

##### Default:
```eventTitle: "Happy Birthday!",```

#### **`showLongCountdown`**

You can either use the default message from [moment.js fromNow](https://momentjs.com/docs/#/displaying/fromnow/) or a long countdown that will show a long format of any units included in longCountdownFormat that are applicable. ie If the event is 10 months away it would not show years.

##### Default:
```showLongCountdown: true,```

#### **`longCountdownFormat`**

List of units that you would like incuded in the longCountdown if applicable. Allowed values include year, month, week, day, hour, minute, second.

##### Default:
```longCountdownFormat: "year,month,week,day,hour,minute,second",```

#### **`longCountdownAutoSize`**

If this is enabled the font size will get larger as units fall off. ie When the countdown crosses from 1 month to 4 weeks, month will no longer be displayed and the font size will incrase to compensate for the new amount of space.

##### Default:
```longCountdownAutoSize: true,```

#### **`icon`**

You may include an image to show next to the countdown, this can be a local image (/modules/MMM-DateCounter/Flat_tick_icon.svg") (recommend adding to the root folder if this module), or you can use an image hosted on online. (https://upload.wikimedia.org/wikipedia/commons/7/73/Flat_tick_icon.sv). The module will automatically resize and place the image on the right side of the module.

##### Default:
```icon: null,```