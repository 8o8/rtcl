import Vue from 'vue'

const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
]

// const dateFilter = dateStr => {
//     return formatDate(dateStr)
// }

// function formatDate(dateStr) {
//     const d = new Date(dateStr)
//     const year = d.getFullYear()
//     const month = d.getMonth()
//     const date = d.getDate()
//
//     return `${date} ${months[month]} ${year}`
// }

const displayDate = dateStr => {
    const d = new Date(dateStr)
    const options = {year: 'numeric', month: 'short', day: '2-digit', formatMatcher: 'best fit'}
    return d.toLocaleDateString('en-GB', options)
}

Vue.filter('displayDate', displayDate)
