# DateBook
DateBook is simple to use module that allows you to create .ics files.

## Installation
```js
npm install @kamkam1_0/datebook
```

## Functionalities
- Create a .ics file
- Get the buffer of that .ics file
- Get the text of that .ics file
- Download that ics file

## How to use

### Accepted date formats

- 1990/01/01
- 01/01/1990
- 1990-01-01
- 01-01-1990
- 1990/01/01T00:00:00
- 01/01/1990T00:00:00
- 1990-01-01T00:00:00
- 01-01-1990T00:00:00

### Required infos

```js
const DateBook = require("@kamkam1_0/datebook")
let Calendar = new DateBook.Calendar()
.AddStart("01/01/1990T09:00:00")
.AddEnd("01/01/1990T19:00:00")
.AddTitle("Work")
```

### Optional Infos
```js
const DateBook = require("@kamkam1_0/datebook")
let Calendar = new DateBook.Calendar()
.AddDescription("This is a description")
.AddGeo("48.861919983985295, 2.3379453552360845")
.AddLocation("91, Rue de Rivoli, 75001 Paris")
```

### Recurrence
Frequencies
- hourly
- daily
- weekly
- monthly
- yearly

You can add two types of recurrence.

You can add one until a specific date.
```js
const DateBook = require("@kamkam1_0/datebook")
let Calendar = new DateBook.Calendar()
.AddRecurrence("daily", "02/01/1990")
```

You can also add a recurrence for a precise number of time.
```js
const DateBook = require("@kamkam1_0/datebook")
let Calendar = new DateBook.Calendar()
.AddRecurrence("daily", "2")
```

## Download

There different ways you can get the infos of your calendar.

### Download name
You have the possiblity to add a name to the file that will be created. By default, the name of the file is the date of the event.

```js
const DateBook = require("@kamkam1_0/datebook")
let Calendar = new DateBook.Calendar()
Calendar.AddDownloadName("#name")//->01/01/1990-name.ics
Calendar.AddDownloadName("name")//->name.ics
```


### Get the infos without downloading

```js
const DateBook = require("@kamkam1_0/datebook")
let Calendar = new DateBook.Calendar()

Calendar.ToText()
Calendar.ToBuffer()
Calendar.getDownloadInfos()//Gives you the infos based on the simulation of the download-> {name: "01/01/1190", extension: "ics", buffer}
```

### Downloading

There are three ways to download a file.

You can simply download the file in the directory of the process.
```js
const DateBook = require("@kamkam1_0/datebook")
let Calendar = new DateBook.Calendar()
Calendar.Download()
```

You can also indicate, based on the process directory, the path to follow.
```js
const DateBook = require("@kamkam1_0/datebook")
let Calendar = new DateBook.Calendar()
Calendar.Download("/ics")
```

Finally, you can indicate the entire path to follow.
```js
const DateBook = require("@kamkam1_0/datebook")
let Calendar = new DateBook.Calendar()
Calendar.Download("/Users/johndoe/Desktop/Dev/Bot")
```



["daily", "2"]

/*

    AddDownloadName(name){
        if(!name || typeof name !== "string" || name.length > 20) return this
        this.download_name = name
        return this
    }