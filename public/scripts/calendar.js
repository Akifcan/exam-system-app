fetch('/mock/exams.json')
    .then(response => response.json())
    .then(data => {
        const days_element = document.querySelector('.days')
        const monthName = document.getElementById('month-name')
        const year = document.getElementById('year')
        const events_elements = document.getElementById('events')

        const back_button = document.getElementById('back')
        const now_button = document.getElementById('now')
        const forward_button = document.getElementById('forward')

        const months = [
            "ocak",
            "şubat",
            "mart",
            "nisan",
            "mayıs",
            "haziran",
            "temmuz",
            "ağustos",
            "eylül",
            "ekim",
            "kasım",
            "aralık"
        ]

        const date = new Date()
        let yearLabel = date.getFullYear()
        let currentMonth = date.getMonth()

        back_button.addEventListener('click', _ => {
            currentMonth--
            if (currentMonth < 1) {
                currentMonth = 11
                yearLabel--
            }
            setCalendar(yearLabel, currentMonth)
        })

        now_button.addEventListener('click', _ => {
            setCalendar(date.getFullYear(), date.getMonth())
        })

        forward_button.addEventListener('click', _ => {
            currentMonth++
            if (currentMonth > 11) {
                currentMonth = 0
                yearLabel++
            }
            setCalendar(yearLabel, currentMonth)
        })


        function setCalendar(yearInfo, monthInfo) {
            year.innerText = yearInfo
            monthName.innerText = months[monthInfo]

            const skip = new Date(yearLabel, currentMonth, 1).getDay() - 1
            const totalDays = new Date(yearLabel, currentMonth + 1, 0).getDate()
            days_element.innerHTML = ''
            for (let i = 0; i < skip; i++) {
                const day = document.createElement('div')
                days_element.appendChild(day)
            }
            for (let i = 1; i <= totalDays; i++) {
                const day = document.createElement('div')
                const forFilter = `${yearInfo}/${monthInfo + 1}/${i < 10 ? '0' + i : i}`
                const events = data.filter(exam => exam.date === forFilter)
                day.addEventListener('click', _ => {
                    events_elements.innerHTML = events.map((event) => {
                        return `
                          <li class="list-group-item">${event.title} sınavı.</li>
                        `
                    }).join('')
                })
                day.classList.add('day')
                if (events.length) {
                    day.classList.add('active')
                }
                day.innerText = i
                days_element.appendChild(day)
            }
        }

        const forFilter = `${yearLabel}/${currentMonth + 1}/${date.getDate() < 10 ? '0' + date.getDate() : date.getDate()}`
        const events = data.filter(exam => exam.date === forFilter)
        if (events.length) {
            events_elements.innerHTML = events.map((event) => {
                return `
                    <li class="list-group-item">${event.title} sınavı.</li>
                `
            }).join('')
        }

        setCalendar(yearLabel, currentMonth)


    })

