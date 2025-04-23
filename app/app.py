from flask import Flask, request, jsonify
from flask_cors import CORS 
from datetime import datetime

app = Flask(__name__)
CORS(app)     
# In-memory storage for user interactions
LESSON_ACTIVITIES = []
QUIZ_ANSWERS = []

# Quiz data definitions matching your frontend
QUESTIONS = [
    {
        'id': 0,
        'type': 'matching',
        'question': 'MATCH THE DEFENSE TO ITS DESCRIPTION',
        'items': [
            { 'term': 'Each player guards one opponent', 'options': ['One-on-one','Zone','Box and 1'], 'correct': 'One-on-one' },
            { 'term': 'Guards space instead of players', 'options': ['One-on-one','Zone','Box and 1'], 'correct': 'Zone' },
            { 'term': 'A mix: 4 in zone, 1 on star player', 'options': ['One-on-one','Zone','Box and 1'], 'correct': 'Box and 1' }
        ],
        'points': 15
    },
    {
        'id': 1,
        'type': 'multiple-choice-explanation',
        'question': 'YOU ARE COACHING A TEAM WITH SLOW DEFENDERS. WHICH STRATEGY DO YOU USE AND WHY?',
        'options': ['Box and 1','Zone','One-on-one'],
        'correct': 'Zone',
        'points': 20
    },
    {
        'id': 2,
        'type': 'multiple-choice-explanation',
        'question': 'YOUR OPPONENT HAS A SUPERSTAR. WHICH STRATEGY DO YOU USE AND WHY?',
        'options': ['Box and 1','Zone','One-on-one'],
        'correct': 'Box and 1',
        'points': 20
    },
    {
        'id': 3,
        'type': 'multiple-select',
        'question': 'WHAT ARE THE PROS OF ONE-ON-ONE DEFENSE?',
        'options': [
            'Great for team with slow or undersized players','Coverage Flexibility',
            'Builds individual accountability','High pressure on ball-handler'
        ],
        'correct': ['Builds individual accountability','High pressure on ball-handler'],
        'points': 15
    },
    {
        'id': 4,
        'type': 'multiple-select',
        'question': 'WHAT ARE THE PROS OF ZONE DEFENSE?',
        'options': [
            'Lockdown players','Great for team with slow or undersized players',
            'Builds individual accountability','High pressure on ball-handler'
        ],
        'correct': ['Great for team with slow or undersized players'],
        'points': 15
    }
]
TOTAL_QUESTIONS = len(QUESTIONS)

@app.route('/')
def home():
    return jsonify({'message': 'Welcome to Defensive IQ', 'start': '/learn/1'})

@app.route('/learn/<int:lesson_id>', methods=['GET','POST'])
def learn(lesson_id):
    if request.method == 'POST':
        data = request.get_json() or {}
        LESSON_ACTIVITIES.append({
            'lesson_id': lesson_id,
            'selection': data.get('selection'),
            'timestamp': datetime.utcnow().isoformat()
        })
        return jsonify({'next': f'/learn/{lesson_id+1}'})
    return jsonify({'lesson_id': lesson_id, 'content': f'Content for lesson {lesson_id}'})

@app.route('/quiz/<int:question_id>', methods=['GET','POST'])
def quiz(question_id):
    if request.method == 'POST':
        data = request.get_json() or {}
        ans = data.get('answer')
        q = next((q for q in QUESTIONS if q['id']==question_id), None)
        correct_flag = False
        if q:
            if q['type']=='multiple-select':
                correct_flag = set(ans)==set(q['correct'])
            else:
                correct_flag = ans==q['correct']
        QUIZ_ANSWERS.append({
            'question_id': question_id,
            'answer': ans,
            'correct': correct_flag,
            'timestamp': datetime.utcnow().isoformat()
        })
        if question_id < TOTAL_QUESTIONS-1:
            return jsonify({'next': f'/quiz/{question_id+1}'})
        return jsonify({'next': '/result'})
    q = next((q for q in QUESTIONS if q['id']==question_id), None)
    if not q:
        return jsonify({'error': 'Question not found'}), 404
    return jsonify(q)

@app.route('/result', methods=['GET'])
def result():
    total = len(QUIZ_ANSWERS)
    score = sum(1 for r in QUIZ_ANSWERS if r['correct'])
    return jsonify({'score': score, 'total': total})

if __name__ == '__main__':
    app.run(debug=True)
