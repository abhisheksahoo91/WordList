from flask import Flask, request, Response, render_template, flash
import itertools
from flask_wtf.csrf import CSRFProtect
from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField, IntegerField, validators
import os
from wtforms.validators import Regexp, NumberRange, ValidationError
import re

def validate_pattern(form, field):
    if(not form.avail_letters.data and not form.pattern.data):
        raise ValidationError("Pattern must be provided if the letters field is empty.")

    if(form.word_length.data and form.pattern.data and 
        form.word_length.data != len(form.pattern.data)):
        raise ValidationError("Pattern length must be the same as the word length given.")

class WordForm(FlaskForm):
    word_length = IntegerField(u'Word Length', [validators.optional(),
        validators.NumberRange(min=3, max=10, message="The number must be between 3 and 10")])
    avail_letters = StringField(u'Letters', [validators.Regexp(r'^[a-z]*$', message="must contain letters only")
    ])
    pattern = StringField(u'Pattern', [validators.Regexp(r'^[a-z\.]*$', message="must contain either letters or the character dot(.)"), 
        validate_pattern
    ])
    submit = SubmitField("Go")

csrf = CSRFProtect()
app = Flask(__name__)
SECRET_KEY = os.urandom(32)
app.config["SECRET_KEY"] = SECRET_KEY
csrf.init_app(app)

@app.route('/index')
def index():
    form = WordForm()
    return render_template("index.html", form=form)

#def getWordByPattern():


@app.route('/words', methods=['POST','GET'])
def letters_2_words():

    form = WordForm()
    if form.validate_on_submit():
        word_len = form.word_length.data
        letters = form.avail_letters.data
        pattern = form.pattern.data
    else:
        return render_template("index.html", form=form)

    with open('sowpods.txt') as f:
        good_words = set(x.strip().lower() for x in f.readlines())

    word_set = set()
    if letters:
        if word_len:
            possible_len = [word_len]
        else:
            possible_len = range(3,len(letters)+1)
        for l in possible_len:
            for word in itertools.permutations(letters,l):
                w = "".join(word)
                if pattern:
                    w = str(re.findall(pattern, w))[2:-2]

                if w in good_words:
                    word_set.add(w)
    else:
        word_list = re.findall(("'"+pattern+"'"), repr(good_words))
        word_list = [sub[1:-1] for sub in word_list]
        word_set = set(word_list)

    return render_template('wordlist.html',
        wordlist = sorted(sorted(word_set), key=len),
        name="Abhishek")

@app.route('/proxy')
def proxy():
    result = requests.get(request.args['url'])
    resp = Response(result.text)
    resp.headers['Content-Type'] = 'application/json'
    return resp


