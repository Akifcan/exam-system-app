const examList = document.getElementById('exam-list')
const announcementList = document.getElementById('announcement-wrapper')

async function loadExams() {

    const teacherResponse = await fetch('/mock/users.json')
    const examResponse = await fetch('/mock/exams.json')

    const examData = await examResponse.json()
    const teacherData = await teacherResponse.json()


    examList.innerHTML = examData.map((exam, index) => {
        const teacher = teacherData.find(teacher => teacher.id === exam.teacher)
        const formattedDate = new Date(Date.parse(exam.date)).toDateString()
        const isDisabled = formattedDate === new Date().toDateString() ? '' : 'disabled'
        return `
                <tr>
                    <th scope="row">${index + 1}</th>
                    <td><div class="avatar" style="--avatar-url: url(${teacher.profilePhoto})"></div></td>
                    <td>${teacher.name}</td>
                    <td>${exam.title}</td>
                    <td>${exam.date}</td>
                    <td><a ${isDisabled} href="/${exam.id}"><button ${isDisabled} class="btn btn-primary">
                        <ion-icon name="arrow-redo-outline"></ion-icon>
                        Başla</button></a>
                    </td>
                </tr>
        `
    }).join('')

}

async function loadAnnouncements() {
    timeago.register('tr', trLocale);
    const teacherResponse = await fetch('/mock/users.json')
    const announcementsResponse = await fetch('/mock/announcements.json')

    const teacherData = await teacherResponse.json()
    const announcementsData = await announcementsResponse.json()

    announcementList.innerHTML = announcementsData.map((announcement, index) => {
        const teacher = teacherData.find(teacher => teacher.id === announcement.teacher)
        const date = new Date(Date.parse(announcement.date))
        return `
            <div class="announcement">
                    <h3>${announcement.title}</h3>
                    <p class="detail">
                        ${announcement.description}
                    </p>
                    <div class="d-flex align-items-center" style="gap: 1rem;">
                <div class="avatar" style="--avatar-url: url(${teacher.profilePhoto})"></div>
                    <p class="text-muted m-0">${teacher.name}</p>
                    <time>${timeago.format(date, 'tr')}</time>
                </div>
                <button class="btn btn-primary my-3 w-100" data-bs-toggle="modal" data-bs-target="#announcement-${index}">
                    <ion-icon name="book-outline"></ion-icon>
                    Oku
                </button>
            </div>
            <div class="modal fade" id="announcement-${index}" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">${announcement.title}</h5>&nbsp;
                        <span><time>${timeago.format(date, 'tr')}</time> Paylaşıldı</span>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        ${announcement.description}
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Kapat</button>
                    </div>
                    </div>
                </div>
            </div>
        `
    }).join('')
}

loadExams()
loadAnnouncements()