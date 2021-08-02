let tableData = [{
    'id':'1',
    'name':'Alexander P. Saga',
    'day':'Monday',
    'time':'08:00AM - 10:00AM',
    'room':'B1201',
    'professor':'Craig N. Hill',
    'pfp': '<img src="src/assets/profile.jpg">'
},
{
    'id':'2',
    'name':'Mitch A. Serrano',
    'day':'Tuesday',
    'time':'08:00AM - 10:00AM',
    'room':'B2302',
    'professor':'Craig N. Hill',
    'pfp': '<img src="src/assets/profile.jpg">'
},
{
    'id':'3',
    'name':'John P. Doe',
    'day':'Wednesday',
    'time':'10:30AM - 04:00PM',
    'room':'B2302',
    'professor':'Craig N. Hill',
    'pfp': '<img src="src/assets/profile.jpg">'
},
{
    'id':'4',
    'name':'John P. Doe',
    'day':'Wednesday',
    'time':'10:30AM - 04:00PM',
    'room':'B2302',
    'professor':'Craig N. Hill',
    'pfp': '<img src="src/assets/profile.jpg">'
},
{
    'id':'5',
    'name':'John P. Doe',
    'day':'Wednesday',
    'time':'10:30AM - 04:00PM',
    'room':'B2302',
    'professor':'Craig N. Hill',
    'pfp': '<img src="src/assets/profile.jpg">'
},
{
    'id':'6',
    'name':'John P. Doe',
    'day':'Wednesday',
    'time':'10:30AM - 04:00PM',
    'room':'B2302',
    'professor':'Craig N. Hill',
    'pfp': '<img src="src/assets/profile.jpg">'
},
{
    'id':'7',
    'name':'John P. Doe',
    'day':'Wednesday',
    'time':'10:30AM - 04:00PM',
    'room':'B2302',
    'professor':'Craig N. Hill',
    'pfp': '<img src="src/assets/profile.jpg">'
},
{
    'id':'8',
    'name':'John P. Doe',
    'day':'Wednesday',
    'time':'10:30AM - 04:00PM',
    'room':'B2302',
    'professor':'Craig N. Hill',
    'pfp': '<img src="src/assets/profile.jpg">'
},
{
    'id':'9',
    'name':'John P. Doe',
    'day':'Wednesday',
    'time':'10:30AM - 04:00PM',
    'room':'B2302',
    'professor':'Craig N. Hill',
    'pfp': '<img src="src/assets/profile.jpg">'
},
{
    'id':'10',
    'name':'John P. Doe',
    'day':'Wednesday',
    'time':'10:30AM - 04:00PM',
    'room':'B2302',
    'professor':'Craig N. Hill',
    'pfp': '<img src="src/assets/profile.jpg">'
},
{
    'id':'11',
    'name':'John P. Doe',
    'day':'Wednesday',
    'time':'10:30AM - 04:00PM',
    'room':'B2302',
    'professor':'Craig N. Hill',
    'pfp': '<img src="src/assets/profile.jpg">'
},
{
    'id':'12',
    'name':'John P. Doe',
    'day':'Wednesday',
    'time':'10:30AM - 04:00PM',
    'room':'B2302',
    'professor':'Craig N. Hill',
    'pfp': '<img src="src/assets/profile.jpg">'
},
{
    'id':'13',
    'name':'John P. Doe',
    'day':'Wednesday',
    'time':'10:30AM - 04:00PM',
    'room':'B2302',
    'professor':'Craig N. Hill',
    'pfp': '<img src="src/assets/profile.jpg">'
},
{
    'id':'14',
    'name':'John P. Doe',
    'day':'Wednesday',
    'time':'10:30AM - 04:00PM',
    'room':'B2302',
    'professor':'Craig N. Hill',
    'pfp': '<img src="src/assets/profile.jpg">'
},
{
    'id':'15',
    'name':'John P. Doe',
    'day':'Wednesday',
    'time':'10:30AM - 04:00PM',
    'room':'B2302',
    'professor':'Craig N. Hill',
    'pfp': '<img src="src/assets/profile.jpg">'
},
{
    'id':'16',
    'name':'John P. Doe',
    'day':'Wednesday',
    'time':'10:30AM - 04:00PM',
    'room':'B2302',
    'professor':'Craig N. Hill',
    'pfp': '<img src="src/assets/profile.jpg">'
},
{
    'id':'17',
    'name':'John P. Doe',
    'day':'Wednesday',
    'time':'10:30AM - 04:00PM',
    'room':'B2302',
    'professor':'Craig N. Hill',
    'pfp': '<img src="src/assets/profile.jpg">'
},
{
    'id':'18',
    'name':'John P. Doe',
    'day':'Wednesday',
    'time':'10:30AM - 04:00PM',
    'room':'B2302',
    'professor':'Craig N. Hill',
    'pfp': '<img src="src/assets/profile.jpg">'
},
{
    'id':'15',
    'name':'John P. Doe',
    'day':'Wednesday',
    'time':'10:30AM - 04:00PM',
    'room':'B2302',
    'professor':'Craig N. Hill',
    'pfp': '<img src="src/assets/profile.jpg">'
},
{
    'id':'15',
    'name':'John P. Doe',
    'day':'Wednesday',
    'time':'10:30AM - 04:00PM',
    'room':'B2302',
    'professor':'Craig N. Hill',
    'pfp': '<img src="src/assets/profile.jpg">'
},
{
    'id':'15',
    'name':'John P. Doe',
    'day':'Wednesday',
    'time':'10:30AM - 04:00PM',
    'room':'B2302',
    'professor':'Craig N. Hill',
    'pfp': '<img src="src/assets/profile.jpg">'
}]

var state = {
    'querySet': tableData,

    'page': 1,
    'rows': 8,
    'window': 5,
}

buildTable()

function pagination(querySet, page, rows) {

    var trimStart = (page - 1) * rows
    var trimEnd = trimStart + rows

    var trimmedData = querySet.slice(trimStart, trimEnd)

    var pages = Math.round(querySet.length / rows);

    return {
        'querySet': trimmedData,
        'pages': pages,
    }
}
function pageButtons(pages) {
    var wrapper = document.getElementById('pagination-wrapper')

    wrapper.innerHTML = ``
	console.log('Pages:', pages)

    var maxLeft = (state.page - Math.floor(state.window / 2))
    var maxRight = (state.page + Math.floor(state.window / 2))

    if (maxLeft < 1) {
        maxLeft = 1
        maxRight = state.window
    }

    if (maxRight > pages) {
        maxLeft = pages - (state.window - 1)
        
        if (maxLeft < 1){
        	maxLeft = 1
        }
        maxRight = pages
    }
    
    

    for (var page = maxLeft; page <= maxRight; page++) {
    	wrapper.innerHTML += `<button value=${page} class="page pagination-pages">${page}</button>`
    }

    if (state.page != 1) {
        wrapper.innerHTML = `<button value=${1} class="page pagination-first"> < </button>` + wrapper.innerHTML
    }

    if (state.page != pages) {
        wrapper.innerHTML += `<button value=${pages} class="page pagination-last"> > </button>`
    }

    $('.page').on('click', function() {
        $('#table-body').empty()

        state.page = Number($(this).val())

        buildTable()
    })

}


function buildTable() {
    var table = $('#table-body')

    var data = pagination(state.querySet, state.page, state.rows)
    var myList = data.querySet

    for (var i = 1 in myList) {
        var row = `<tr>
                  <td>${myList[i].id}</td>
                  <td>${myList[i].name}</td>
                  <td>${myList[i].day}</td>
                  <td>${myList[i].time}</td>
                  <td>${myList[i].room}</td>
                  <td>${myList[i].professor}</td>
                  <td>${myList[i].pfp}</td>
                  `
        table.append(row)
    }

    pageButtons(data.pages)
}
