var express = require('express');

var app = express();

var Quiz = require('../models/quiz');
var Pregunta = require('../models/pregunta');
var mdMiddlewares = require('../middlewares/autenticacion');

// ============================================
// Listado de Quiz
// ============================================

app.get('/quiz', mdMiddlewares.verificaToken, (req, res, next) => {

    Quiz.find({}, (err, quizes) => {

        if(err){
            return res.status(500).json({
                ok: false,
                mensaje: 'Error cargando quiz',
                errors: err
            });
        }

        res.status(200).json({
            ok: true,
            quiz: quizes
        });

    });

});


// ============================================
// Crear un nuevo quiz
// ============================================

app.post('/quiz', mdMiddlewares.verificaToken, (req, res) => {

    var body = req.body;

    var quiz = new Quiz({
        quizname: body.quizname,
        quizdescription: body.quizdescription,
        upload: body.upload
    });

    quiz.save((err, quizGuardada) => {

        if(err){
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear quiz',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            quiz: quizGuardada
        });

    });

});

// ============================================
// Borrar un quiz por id
// ============================================

app.delete('/quiz/:id', mdMiddlewares.verificaToken, (req, res) => {

	var id = req.params.id;

	Quiz.findByIdAndRemove(id, (err, quizBorrado) => {

		if (err) {
			return res.status(500).json({
				ok:false,
				mensaje: 'Error al borrar quiz',
				errors: err
			});
		}

		if (!quizBorrado) {
			return res.status(400).json({
				ok:false,
				mensaje: 'No existe un quiz con ese ID',
				errors: { message: 'No existe un quiz con ese ID'}
			});
		}

		res.status(200).json({
			ok:true,
			medico: quizBorrado
		});
	});

});

module.exports = app;


// ============================================
// Listado de preguntas
// ============================================

app.get('/pregunta', mdMiddlewares.verificaToken, (req, res) => {

    var id = req.params.id;

    // Pregunta.find({ questionId: req.params.id }, (err, qz) => {

    //     if (err) {
	// 		return res.status(500).json({
	// 			ok:false,
	// 			mensaje: 'Error al borrar quiz',
	// 			errors: err
	// 		});
	// 	}

    //     else {
    //         res.status(200).json({
	// 		ok: true,
	// 		pregunta: qz
	// 	});
    //     }
    // })

    Pregunta.find({ quizid: req.params.id }, (err, qz) => {
        if (err) {
            console.log(error);
            res.json({ errormsg: "some error!" });
        }
        else {
            res.json({ msg: qz });
        }
    })

});


// ============================================
// Crear una nueva pregunta
// ============================================

app.post('/pregunta', mdMiddlewares.verificaToken, (req, res) => {

    Pregunta.find({ quizid: req.body.quizid }, (err, preguntaGuardada) => {

        if(err){
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear una pregunta',
                errors: err
            });
        }
        else {

            var pregunta = new Pregunta({
                quizid: req.body.quizid,
                questionId: preguntaGuardada.length + 1,
                questionText: req.body.questionText,
                answer: req.body.answer,
                options: req.body.options
            });

            pregunta.save((error, qsn) => {
                if (error) {
                    //console.log(error);
                    res.json({ msg: "some error!" });
                }
                else {
                    res.status(201).json({
                        ok: true,
                        pregunta: qsn
                    });
                }
            })
        }
    })

})


app.post('/pregunta/uploadquiz', mdMiddlewares.verificaToken, (req, res) => {

    console.log("upload back");
    console.log(req.body);
    Pregunta.find({ quizid: req.body.id }, (err, qz) => {
        if (err) {
            console.log(error);
            res.json({ msg: "some error!" });
        }
        else {
            console.log(qz.length);
            if (qz.length < 5) {
                res.json({ msg: "You must have 5 question in the quiz for upload quiz!!" });
            }
            else {
                Pregunta.updateOne({ _id: req.body.id }, { upload: true }, function (err, user) {
                    if (err) {
                        console.log(err)
                        res.json({ msg: "something went wrong!!" })
                    }
                    else {
                        const io = req.app.get('io');
                        io.emit("quizcrud", "Quiz Curd done here");
                        res.json({ message: "quiz uploaded!" });
                    }
                })

            }

        }
    })

});

