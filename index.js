import express from 'express'
import questions from './public/mock/questions.json'
import fileupload from 'express-fileupload'
import { engine } from 'express-handlebars';

const app = express()



app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', './views')
app.use(express.static('public'))
app.use(fileupload())
app.use('/modules', express.static('node_modules'))

const PORT = process.env.PORT || 3000

app.get('/', (req, res) => {
    res.render('home')
})

app.get('/exam-end', (_, res) => res.render('examSuccess'))
app.get('/exam-cancelled', (_, res) => res.render('examCancelled'))

app.post('/upload', (req, res) => {
    console.log(req.files.video);
    req.files.video.mv(`public/uploads/${req.files.video.name}.mp4`)
})



app.get('/:id', (req, res) => {
    const id = req.params.id.toString()
    const exam = questions.find(question => question.examId === id)
    console.log(exam);
    res.render('exam', { exam })
})


app.listen(PORT, () => {
    console.log(`Working ${PORT}`)
})