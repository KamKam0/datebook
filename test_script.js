const index = require('./src/index')

const datebook = new index.Calendar()
.AddDescription('this is a description')
.AddStart('2024-01-01T05:30:00')
.AddEnd('2024-01-01T08:00:00')
.AddTitle('this is a title')
.AddDownloadName('downloadedcalendar')
.AddTriger('-PT2H')
.AddLocation('101, Av. des Champs-Élysées, 75008 Paris')
.AddGeo('48.87175623071544, 2.3007789558675404')
.AddRecurrence('daily', 10)
.AddExceptionDate('2024-01-05')
.SetTimeZone('UTC')
console.log('datebook success')
console.log(datebook)

let textCalendar = datebook.toText()
console.log('textCalendar success: ' + textCalendar)

let bufferCalendar = datebook.toBuffer()
console.log('bufferCalendar success: ')
console.log(bufferCalendar)

datebook.downloadInfos()
.then(data => {
    console.log('downloadInfos success')
    console.log(data)
})
.catch(err => {
    console.log('downloadInfos error')
    console.log(err)
})

datebook.download()
.then(data => {
    console.log('download success')
    console.log(data)
})
.catch(err => {
    console.log('download error')
    console.log(err)
})

const joinedCalendar = index.joinCalendars([datebook, datebook], 'testjoincalendar')

let textJoinCalendar = joinedCalendar.toText()
console.log('textJoinCalendar success: ' + textJoinCalendar)

let bufferJoinCalendar = joinedCalendar.toBuffer()
console.log('bufferJoinCalendar success: ')
console.log(bufferJoinCalendar)

joinedCalendar.downloadInfos()
.then(data => {
    console.log('downloadInfos Join success')
    console.log(data)
})
.catch(err => {
    console.log('downloadInfos Join error')
    console.log(err)
})

joinedCalendar.download()
.then(data => {
    console.log('download Join success')
    console.log(data)
})
.catch(err => {
    console.log('download Join error')
    console.log(err)
})