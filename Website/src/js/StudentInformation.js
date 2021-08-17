let tableData = [{
    'Subject':'Computer Programming',
    'Date':'March 16, 2020',
    'Time':'08:00AM - 11:00AM',
    'Status':'Absent',
    'Remarks':'Sick'
},
{
    'Subject':'Computer Programming',
    'Date':'March 16, 2020',
    'Time':'08:00AM - 11:00AM',
    'Status':'Present',
    'Remarks':'-'
},
{
    'Subject':'Computer Programming',
    'Date':'March 16, 2020',
    'Time':'08:00AM - 11:00AM',
    'Status':'Late',
    'Remarks':'No Valid Reason'
},
{
    'Subject':'Computer Programming',
    'Date':'March 16, 2020',
    'Time':'08:00AM - 11:00AM',
    'Status':'Late',
    'Remarks':'Traffic'
},
{
    'Subject':'Computer Programming',
    'Date':'March 16, 2020',
    'Time':'08:00AM - 11:00AM',
    'Status':'Present',
    'Remarks':'-'
},
{
    'Subject':'Computer Programming',
    'Date':'March 16, 2020',
    'Time':'08:00AM - 11:00AM',
    'Status':'Present',
    'Remarks':'-'
},
{
    'Subject':'Computer Programming',
    'Date':'March 16, 2020',
    'Time':'08:00AM - 11:00AM',
    'Status':'Absent',
    'Remarks':'No Valid Reason'
},
{
    'Subject':'Computer Programming',
    'Date':'March 16, 2020',
    'Time':'08:00AM - 11:00AM',
    'Status':'Absent',
    'Remarks':'No Valid Reason'
},
{
    'Subject':'Computer Programming',
    'Date':'March 16, 2020',
    'Time':'08:00AM - 11:00AM',
    'Status':'Absent',
    'Remarks':'No Valid Reason'
},
{
    'Subject':'Computer Programming',
    'Date':'March 16, 2020',
    'Time':'08:00AM - 11:00AM',
    'Status':'Absent',
    'Remarks':'No Valid Reason'
},
{
    'Subject':'Computer Programming',
    'Date':'March 16, 2020',
    'Time':'08:00AM - 11:00AM',
    'Status':'Absent',
    'Remarks':'No Valid Reason'
},
{
    'Subject':'Computer Programming',
    'Date':'March 16, 2020',
    'Time':'08:00AM - 11:00AM',
    'Status':'Absent',
    'Remarks':'No Valid Reason'
},
{
    'Subject':'Computer Programming',
    'Date':'March 16, 2020',
    'Time':'08:00AM - 11:00AM',
    'Status':'Absent',
    'Remarks':'No Valid Reason'
},
{
    'Subject':'Computer Programming',
    'Date':'March 16, 2020',
    'Time':'08:00AM - 11:00AM',
    'Status':'Absent',
    'Remarks':'No Valid Reason'
},
{
    'Subject':'Computer Programming',
    'Date':'March 16, 2020',
    'Time':'08:00AM - 11:00AM',
    'Status':'Absent',
    'Remarks':'No Valid Reason'
},
{
    'Subject':'Computer Programming',
    'Date':'March 16, 2020',
    'Time':'08:00AM - 11:00AM',
    'Status':'Absent',
    'Remarks':'No Valid Reason'
},
{
    'Subject':'Computer Programming',
    'Date':'March 16, 2020',
    'Time':'08:00AM - 11:00AM',
    'Status':'Absent',
    'Remarks':'No Valid Reason'
},
{
    'Subject':'Computer Programming',
    'Date':'March 16, 2020',
    'Time':'08:00AM - 11:00AM',
    'Status':'Absent',
    'Remarks':'No Valid Reason'
},
{
    'Subject':'Computer Programming',
    'Date':'March 16, 2020',
    'Time':'08:00AM - 11:00AM',
    'Status':'Absent',
    'Remarks':'No Valid Reason'
},
{
    'Subject':'Computer Programming',
    'Date':'March 16, 2020',
    'Time':'08:00AM - 11:00AM',
    'Status':'Absent',
    'Remarks':'No Valid Reason'
},
{
    'Subject':'Computer Programming',
    'Date':'March 16, 2020',
    'Time':'08:00AM - 11:00AM',
    'Status':'Absent',
    'Remarks':'No Valid Reason'
},
{
    'Subject':'Computer Programming',
    'Date':'March 16, 2020',
    'Time':'08:00AM - 11:00AM',
    'Status':'Absent',
    'Remarks':'No Valid Reason'
},
{
    'Subject':'Computer Programming',
    'Date':'March 16, 2020',
    'Time':'08:00AM - 11:00AM',
    'Status':'Absent',
    'Remarks':'No Valid Reason'
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
                  <td>${myList[i].Subject}</td>
                  <td>${myList[i].Date}</td>
                  <td>${myList[i].Time}</td>
                  <td>${myList[i].Status}</td>
                  <td>${myList[i].Remarks}</td>
                  `
        table.append(row)
    }

    pageButtons(data.pages)
}
