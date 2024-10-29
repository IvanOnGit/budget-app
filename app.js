class Spending {
    constructor(year, month, day, type, description, value) {
        this.year = year
        this.month = month
        this.day = day
        this.type = type
        this.description = description
        this.value = value
    }

    validateData() {
        for (let i in this) {
            if (this[i] == undefined || this[i] == '' || this[i] == null) {
                return false
            }
        }
        return true
    }
}

class Bd {

    constructor() {
        let id = localStorage.getItem('id')

        if (id === null) {
            localStorage.setItem('id', 0)
        }
    }

    getNextId() {
        let nextId = localStorage.getItem('id')
        return parseInt(nextId)
    }

    save(s) {
        let id = this.getNextId()

        localStorage.setItem(id, JSON.stringify(s))

        localStorage.setItem('id', id + 1)
    }

    getAllSaved() {

        let spendings = Array()

        let id = localStorage.getItem('id')

        for (let i = 1; i <= id; i++) {

            let spending = JSON.parse(localStorage.getItem(i))

            if (spending === null) {
                continue
            }

            spending.id = i
            spendings.push(spending)
        }

        return spendings
    }

    search(spending) {
        let filteredSpendings = Array()

        filteredSpendings = this.getAllSaved()

        console.log(spending)
        console.log(filteredSpendings)

        if (spending.year != '') {
             filteredSpendings = filteredSpendings.filter(d => d.year == spending.year)
        }

        if (spending.month != '') {
            filteredSpendings = filteredSpendings.filter(d => d.month == spending.month)
        }

        if (spending.day != '') {
            filteredSpendings = filteredSpendings.filter(d => d.day == spending.day)
        }

        if (spending.type != '') {
            filteredSpendings = filteredSpendings.filter(d => d.type == spending.type)
        }

        if (spending.description != '') {
            filteredSpendings = filteredSpendings.filter(d => d.description == spending.description)
        }

        if (spending.value != '') {
            filteredSpendings = filteredSpendings.filter(d => d.value == spending.value)
        }

        return filteredSpendings

    }

    remove(id) {
        localStorage.removeItem(id)
    }
}

let bd = new Bd()

function registerSpending() {
    let year = document.getElementById('year')
    let month = document.getElementById('month')
    let day = document.getElementById('day')
    let type = document.getElementById('type')
    let description = document.getElementById('description')
    let value = document.getElementById('value')

    let spending = new Spending(
        year.value,
        month.value,
        day.value,
        type.value,
        description.value,
        value.value
    )

    if (spending.validateData()) {
        bd.save(spending)

        document.getElementById('modalTitle').innerHTML = 'Saved'
        document.getElementById('modalContent').innerHTML = 'Information saved correctly'
        document.getElementById('modalBackButton').className = 'btn btn-success'

        $('#registerSpendingModal').modal('show')

        year.value = ''
        month.value = ''
        day.value = ''
        type.value = ''
        description.value = ''
        value.value = ''
    } else {

        document.getElementById('modalTitle').innerHTML = 'Error'
        document.getElementById('modalContent').innerHTML = 'Error on saving, empty fields'
        document.getElementById('modalBackButton').className = 'btn btn-danger'

        $('#registerSpendingModal').modal('show')
    }
}

function loadSpendingList(spendings = Array(), filter = false) {

    if(spendings.length == 0 && filter == false) {
        spendings = bd.getAllSaved()
    }

    let spendingsList = document.getElementById('spendingsList')
    spendingsList.innerHTML = ''

    spendings.forEach(function (d) {
        
        let line = spendingsList.insertRow()

        line.insertCell(0).innerHTML = `${d.day}/${d.month}/${d.year}`

        switch(d.type) {
            case '1': d.type = 'Alimentación'
                break
            case '2': d.type = 'Educación'
                break
            case '3': d.type = 'Ocio'
                break
            case '4': d.type = 'Salud'
                break
            case '5': d.type = 'Transporte'
                break
            case '6': d.type = 'Trámites'
                break
            case '7': d.type = 'Casa'
                break
        }
        line.insertCell(1).innerHTML = d.type

        line.insertCell(2).innerHTML = d.description
        line.insertCell(3).innerHTML = d.value

        let btn = document.createElement("button")
        btn.className = 'btn btn-danger'
        btn.innerHTML = '<i class="fas fa-times"></i>'
        btn.id = `spending_id${d.id}`
        btn.onclick = function () {
            let id = this.id.replace('spending_id', '')

            bd.remove(id)

            window.location.reload()
        }
        line.insertCell(4).append(btn)

        console.log(d)
    })
}

function searchSpending() {
    let year = document.getElementById('year').value
    let month = document.getElementById('month').value
    let day = document.getElementById('day').value
    let type = document.getElementById('type').value
    let description = document.getElementById('description').value
    let value = document.getElementById('value').value

    let spending = new Spending(year, month, day, type, description, value)

    let spendings = bd.search(spending)

    loadSpendingList(spendings, true)
}

