import React, { useState, useEffect } from 'react';
import { Plus, Minus, X, Divide, Star, Trophy, BookOpen, Printer, Sparkles, TrendingUp } from 'lucide-react';

const GoodMath = () => {
  const [mode, setMode] = useState('home');
  const [operation, setOperation] = useState('addition');
  const [difficulty, setDifficulty] = useState('easy');
  const [currentProblem, setCurrentProblem] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [testProblems, setTestProblems] = useState([]);
  const [testName, setTestName] = useState('');
  const [streak, setStreak] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [num1Input, setNum1Input] = useState('');
  const [num2Input, setNum2Input] = useState('');
  const [selectedOp, setSelectedOp] = useState('+');

  useEffect(() => {
    const saved = localStorage.getItem('goodMathProblems');
    if (saved) setSolvedProblems(JSON.parse(saved));
  }, []);

  const getRandomNumber = (difficulty) => {
    const ranges = {
      easy: [1, 10],
      medium: [1, 20],
      hard: [1, 50]
    };
    const [min, max] = ranges[difficulty];
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const generateProblem = () => {
    let num1 = getRandomNumber(difficulty);
    let num2 = getRandomNumber(difficulty);
    
    if (operation === 'subtraction' && num2 > num1) {
      [num1, num2] = [num2, num1];
    }
    
    if (operation === 'division') {
      const divisor = getRandomNumber('easy');
      const answer = getRandomNumber(difficulty);
      return {
        num1: divisor * answer,
        num2: divisor,
        operation,
        answer
      };
    }

    let answer;
    switch (operation) {
      case 'addition': answer = num1 + num2; break;
      case 'subtraction': answer = num1 - num2; break;
      case 'multiplication': answer = num1 * num2; break;
      default: answer = num1 + num2;
    }

    return { num1, num2, operation, answer };
  };

  const startPractice = (op, diff) => {
    setOperation(op);
    setDifficulty(diff);
    setCurrentProblem(generateProblem());
    setMode('practice');
    setUserAnswer('');
    setShowFeedback(false);
  };

  const checkAnswer = () => {
    const correct = parseInt(userAnswer) === currentProblem.answer;
    setIsCorrect(correct);
    setShowFeedback(true);

    if (correct) {
      const newProblem = {
        ...currentProblem,
        userAnswer: parseInt(userAnswer),
        date: new Date().toISOString(),
        difficulty
      };
      const updated = [...solvedProblems, newProblem];
      setSolvedProblems(updated);
      localStorage.setItem('goodMathProblems', JSON.stringify(updated));
      setStreak(streak + 1);

      setTimeout(() => {
        setCurrentProblem(generateProblem());
        setUserAnswer('');
        setShowFeedback(false);
      }, 1500);
    } else {
      setStreak(0);
    }
  };

  const addTestProblem = () => {
    if (currentProblem) {
      setTestProblems([...testProblems, { ...currentProblem, id: Date.now() }]);
      setCurrentProblem(generateProblem());
      setUserAnswer('');
    }
  };

  const printTest = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>${testName || 'Math Test'}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; }
            h1 { color: #6366f1; text-align: center; }
            .header { text-align: center; margin-bottom: 30px; }
            .problem { margin: 20px 0; font-size: 18px; }
            .answer-line { border-bottom: 2px solid #000; width: 100px; display: inline-block; margin-left: 10px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>⭐ ${testName || 'Math Test'} ⭐</h1>
            <p>Name: ________________  Date: ________________</p>
          </div>
          ${testProblems.map((p, i) => {
            const symbol = p.operation === 'addition' ? '+' : 
                          p.operation === 'subtraction' ? '-' : 
                          p.operation === 'multiplication' ? '×' : '÷';
            return `<div class="problem">${i + 1}. ${p.num1} ${symbol} ${p.num2} = <span class="answer-line"></span></div>`;
          }).join('')}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const getOperationSymbol = (op) => {
    switch(op) {
      case 'addition': return '+';
      case 'subtraction': return '-';
      case 'multiplication': return '×';
      case 'division': return '÷';
      default: return '+';
    }
  };

  const [calcDisplay, setCalcDisplay] = useState('0');
  const [calcPrevious, setCalcPrevious] = useState(null);
  const [calcOperation, setCalcOperation] = useState(null);
  const [calcHistory, setCalcHistory] = useState([]);
  const [calcJustCalculated, setCalcJustCalculated] = useState(false);

  const OperationButton = ({ op, icon: Icon, label, color }) => {
    const colorClasses = {
      green: operation === op
        ? 'bg-green-500 text-white shadow-lg scale-105'
        : 'bg-white text-gray-700 hover:bg-green-50',
      blue: operation === op
        ? 'bg-blue-500 text-white shadow-lg scale-105'
        : 'bg-white text-gray-700 hover:bg-blue-50',
      purple: operation === op
        ? 'bg-purple-500 text-white shadow-lg scale-105'
        : 'bg-white text-gray-700 hover:bg-purple-50',
      orange: operation === op
        ? 'bg-orange-500 text-white shadow-lg scale-105'
        : 'bg-white text-gray-700 hover:bg-orange-50',
    };

    return (
      <button
        onClick={() => setOperation(op)}
        className={`flex flex-col items-center gap-2 p-6 rounded-xl transition-all ${colorClasses[color]}`}
      >
        <Icon size={32} />
        <span className="font-semibold">{label}</span>
      </button>
    );
  };

  const handleCalcNumber = (num) => {
    if (calcJustCalculated) {
      // Start fresh after a calculation
      setCalcDisplay(num);
      setCalcJustCalculated(false);
    } else if (calcDisplay === '0') {
      setCalcDisplay(num);
    } else {
      setCalcDisplay(calcDisplay + num);
    }
  };

  const handleCalcOperation = (op) => {
    setCalcPrevious(parseFloat(calcDisplay));
    setCalcOperation(op);
    setCalcDisplay('0');
    setCalcJustCalculated(false);
  };

  const handleCalcBackspace = () => {
    if (calcDisplay.length > 1) {
      setCalcDisplay(calcDisplay.slice(0, -1));
    } else {
      setCalcDisplay('0');
    }
    setCalcJustCalculated(false);
  };

  const calculateResult = () => {
    const current = parseFloat(calcDisplay);
    const previous = calcPrevious;
    let result;

    switch(calcOperation) {
      case '+': result = previous + current; break;
      case '-': result = previous - current; break;
      case '×': result = previous * current; break;
      case '÷': result = previous / current; break;
      default: return;
    }

    const historyEntry = `${previous} ${calcOperation} ${current} = ${result}`;
    setCalcHistory([historyEntry, ...calcHistory]);
    setCalcDisplay(result.toString());
    setCalcOperation(null);
    setCalcPrevious(null);
    setCalcJustCalculated(true);
  };

  const clearCalc = () => {
    setCalcDisplay('0');
    setCalcPrevious(null);
    setCalcOperation(null);
    setCalcJustCalculated(false);
  };

  if (mode === 'home') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-blue-400 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-6xl font-bold text-white mb-4 drop-shadow-lg">
              ⭐ Good Math ⭐
            </h1>
            <p className="text-2xl text-white font-semibold">Let's have fun with numbers!</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <button
              onClick={() => setMode('setup-practice')}
              className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all hover:scale-105"
            >
              <div className="flex flex-col items-center gap-4">
                <Sparkles size={48} className="text-purple-500" />
                <h2 className="text-2xl font-bold text-gray-800">Practice Mode</h2>
                <p className="text-gray-600">Solve problems and build your skills!</p>
              </div>
            </button>

            <button
              onClick={() => setMode('calculator')}
              className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all hover:scale-105"
            >
              <div className="flex flex-col items-center gap-4">
                <div className="text-5xl">🧮</div>
                <h2 className="text-2xl font-bold text-gray-800">Calculator</h2>
                <p className="text-gray-600">Do your own math!</p>
              </div>
            </button>

            <button
              onClick={() => setMode('history')}
              className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all hover:scale-105"
            >
              <div className="flex flex-col items-center gap-4">
                <BookOpen size={48} className="text-blue-500" />
                <h2 className="text-2xl font-bold text-gray-800">My Progress</h2>
                <p className="text-gray-600">See all the problems you've solved!</p>
              </div>
            </button>

            <button
              onClick={() => setMode('test-creator')}
              className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all hover:scale-105"
            >
              <div className="flex flex-col items-center gap-4">
                <Printer size={48} className="text-green-500" />
                <h2 className="text-2xl font-bold text-gray-800">Create a Test</h2>
                <p className="text-gray-600">Make your own math quiz!</p>
              </div>
            </button>
          </div>

          {solvedProblems.length > 0 && (
            <div className="mt-8 bg-white rounded-2xl p-6 shadow-xl">
              <div className="flex items-center justify-center gap-4">
                <Trophy className="text-yellow-500" size={32} />
                <p className="text-xl font-bold text-gray-800">
                  You've solved {solvedProblems.length} problems! Keep it up!
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (mode === 'calculator') {
    const CalcButton = ({ value, onClick, className = '', span = false }) => (
      <button
        onClick={() => onClick(value)}
        className={`p-4 rounded-lg text-xl font-bold transition-all hover:scale-105 active:scale-95 ${
          span ? 'col-span-2' : ''
        } ${className}`}
      >
        {value}
      </button>
    );

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-blue-400 p-4">
        <div className="max-w-lg mx-auto">
          <button
            onClick={() => setMode('home')}
            className="mb-4 px-4 py-2 bg-white rounded-lg font-semibold hover:bg-gray-100 text-sm"
          >
            ← Back
          </button>

          <div className="bg-white rounded-2xl p-4 shadow-xl">
            <div className="flex items-center gap-2 mb-4">
              <div className="text-2xl">🧮</div>
              <h2 className="text-2xl font-bold text-gray-800">Fun Calculator</h2>
            </div>

            <div className="mb-4 p-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl">
              <div className="text-right">
                {calcOperation && calcPrevious !== null && (
                  <div className="text-gray-600 text-lg mb-1">
                    {calcPrevious} {calcOperation}
                  </div>
                )}
                <div className="text-3xl font-bold text-gray-800 break-all">
                  {calcDisplay}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2 mb-4">
              <CalcButton value="7" onClick={handleCalcNumber} className="bg-blue-100 hover:bg-blue-200 text-blue-800" />
              <CalcButton value="8" onClick={handleCalcNumber} className="bg-blue-100 hover:bg-blue-200 text-blue-800" />
              <CalcButton value="9" onClick={handleCalcNumber} className="bg-blue-100 hover:bg-blue-200 text-blue-800" />
              <CalcButton value="÷" onClick={handleCalcOperation} className="bg-orange-400 hover:bg-orange-500 text-white" />
              
              <CalcButton value="4" onClick={handleCalcNumber} className="bg-blue-100 hover:bg-blue-200 text-blue-800" />
              <CalcButton value="5" onClick={handleCalcNumber} className="bg-blue-100 hover:bg-blue-200 text-blue-800" />
              <CalcButton value="6" onClick={handleCalcNumber} className="bg-blue-100 hover:bg-blue-200 text-blue-800" />
              <CalcButton value="×" onClick={handleCalcOperation} className="bg-purple-400 hover:bg-purple-500 text-white" />
              
              <CalcButton value="1" onClick={handleCalcNumber} className="bg-blue-100 hover:bg-blue-200 text-blue-800" />
              <CalcButton value="2" onClick={handleCalcNumber} className="bg-blue-100 hover:bg-blue-200 text-blue-800" />
              <CalcButton value="3" onClick={handleCalcNumber} className="bg-blue-100 hover:bg-blue-200 text-blue-800" />
              <CalcButton value="-" onClick={handleCalcOperation} className="bg-blue-400 hover:bg-blue-500 text-white" />

              <CalcButton value="C" onClick={clearCalc} className="bg-red-400 hover:bg-red-500 text-white" />
              <CalcButton value="0" onClick={handleCalcNumber} className="bg-blue-100 hover:bg-blue-200 text-blue-800" />
              <CalcButton value="⌫" onClick={handleCalcBackspace} className="bg-yellow-400 hover:bg-yellow-500 text-white" />
              <CalcButton value="+" onClick={handleCalcOperation} className="bg-green-400 hover:bg-green-500 text-white" />
            </div>

            <button
              onClick={calculateResult}
              disabled={!calcOperation || calcPrevious === null}
              className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-bold text-xl hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              = Calculate!
            </button>

            {calcHistory.length > 0 && (
              <div className="mt-4">
                <h3 className="text-lg font-bold text-gray-700 mb-2">Your Calculations:</h3>
                <div className="max-h-32 overflow-y-auto space-y-1">
                  {calcHistory.slice(0, 5).map((calc, idx) => (
                    <div key={idx} className="p-2 bg-gray-50 rounded text-sm font-semibold text-gray-700">
                      {calc}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'setup-practice') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-blue-400 p-6">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => setMode('home')}
            className="mb-6 px-6 py-3 bg-white rounded-lg font-semibold hover:bg-gray-100"
          >
            ← Back
          </button>

          <div className="bg-white rounded-2xl p-8 shadow-xl">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Choose Your Challenge!</h2>

            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-700 mb-4">Pick an Operation:</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <OperationButton op="addition" icon={Plus} label="Addition" color="green" />
                <OperationButton op="subtraction" icon={Minus} label="Subtraction" color="blue" />
                <OperationButton op="multiplication" icon={X} label="Multiply" color="purple" />
                <OperationButton op="division" icon={Divide} label="Division" color="orange" />
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-700 mb-4">Pick Difficulty:</h3>
              <div className="grid grid-cols-3 gap-4">
                {['easy', 'medium', 'hard'].map(diff => (
                  <button
                    key={diff}
                    onClick={() => setDifficulty(diff)}
                    className={`p-4 rounded-xl font-semibold transition-all ${
                      difficulty === diff
                        ? 'bg-purple-500 text-white shadow-lg scale-105'
                        : 'bg-gray-100 text-gray-700 hover:bg-purple-50'
                    }`}
                  >
                    {diff.charAt(0).toUpperCase() + diff.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => startPractice(operation, difficulty)}
              className="w-full py-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold text-2xl hover:shadow-xl transition-all hover:scale-105"
            >
              Start Practicing! 🚀
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'practice') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-blue-400 p-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={() => setMode('home')}
              className="px-6 py-3 bg-white rounded-lg font-semibold hover:bg-gray-100"
            >
              ← Home
            </button>
            <div className="flex items-center gap-2 bg-white px-6 py-3 rounded-lg shadow-lg">
              <Star className="text-yellow-500" />
              <span className="font-bold text-lg">Streak: {streak}</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-12 shadow-xl">
            {currentProblem && (
              <>
                <div className="text-center mb-8">
                  <p className="text-gray-600 text-xl mb-4 capitalize">{operation} • {difficulty}</p>
                  <div className="text-6xl font-bold text-gray-800 mb-8">
                    {currentProblem.num1} {getOperationSymbol(operation)} {currentProblem.num2} = ?
                  </div>
                </div>

                {!showFeedback ? (
                  <>
                    <input
                      type="number"
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && userAnswer && checkAnswer()}
                      placeholder="Your answer"
                      className="w-full text-4xl text-center p-6 border-4 border-purple-300 rounded-xl mb-6 focus:border-purple-500 focus:outline-none"
                      autoFocus
                    />
                    <button
                      onClick={checkAnswer}
                      disabled={!userAnswer}
                      className="w-full py-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold text-2xl hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Check Answer
                    </button>
                  </>
                ) : (
                  <div className={`text-center p-8 rounded-xl ${isCorrect ? 'bg-green-100' : 'bg-red-100'}`}>
                    <p className="text-4xl font-bold mb-4">
                      {isCorrect ? '🎉 Awesome!' : '❌ Not quite!'}
                    </p>
                    <p className="text-2xl text-gray-700">
                      {isCorrect ? 'You got it right!' : `The answer is ${currentProblem.answer}`}
                    </p>
                    {!isCorrect && (
                      <button
                        onClick={() => {
                          setCurrentProblem(generateProblem());
                          setUserAnswer('');
                          setShowFeedback(false);
                        }}
                        className="mt-6 px-8 py-4 bg-blue-500 text-white rounded-lg font-bold hover:bg-blue-600"
                      >
                        Try Another One
                      </button>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'history') {
    const todayProblems = solvedProblems.filter(p => {
      const problemDate = new Date(p.date).toDateString();
      const today = new Date().toDateString();
      return problemDate === today;
    });

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-blue-400 p-6">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => setMode('home')}
            className="mb-6 px-6 py-3 bg-white rounded-lg font-semibold hover:bg-gray-100"
          >
            ← Back
          </button>

          <div className="bg-white rounded-2xl p-8 shadow-xl">
            <div className="flex items-center gap-4 mb-8">
              <TrendingUp className="text-purple-500" size={36} />
              <h2 className="text-3xl font-bold text-gray-800">My Progress</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-4 mb-8">
              <div className="bg-purple-100 rounded-xl p-6 text-center">
                <p className="text-4xl font-bold text-purple-600">{solvedProblems.length}</p>
                <p className="text-gray-700 font-semibold">Total Problems</p>
              </div>
              <div className="bg-blue-100 rounded-xl p-6 text-center">
                <p className="text-4xl font-bold text-blue-600">{todayProblems.length}</p>
                <p className="text-gray-700 font-semibold">Solved Today</p>
              </div>
              <div className="bg-green-100 rounded-xl p-6 text-center">
                <p className="text-4xl font-bold text-green-600">{streak}</p>
                <p className="text-gray-700 font-semibold">Current Streak</p>
              </div>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {solvedProblems.slice().reverse().map((problem, idx) => (
                <div key={idx} className="border-b border-gray-200 py-4 flex justify-between items-center">
                  <span className="text-xl font-semibold text-gray-800">
                    {problem.num1} {getOperationSymbol(problem.operation)} {problem.num2} = {problem.answer}
                  </span>
                  <div className="text-right">
                    <span className="text-sm text-gray-600 block capitalize">{problem.difficulty}</span>
                    <span className="text-xs text-gray-500">{new Date(problem.date).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'test-creator') {
    const addManualProblem = () => {
      if (num1Input && num2Input) {
        const n1 = parseFloat(num1Input);
        const n2 = parseFloat(num2Input);
        
        let answer;
        let opName;
        switch(selectedOp) {
          case '+': 
            answer = n1 + n2; 
            opName = 'addition';
            break;
          case '-': 
            answer = n1 - n2; 
            opName = 'subtraction';
            break;
          case '×': 
            answer = n1 * n2; 
            opName = 'multiplication';
            break;
          case '÷': 
            answer = n1 / n2; 
            opName = 'division';
            break;
        }

        const newProblem = {
          num1: n1,
          num2: n2,
          operation: opName,
          answer,
          id: Date.now()
        };

        setTestProblems([...testProblems, newProblem]);
        setNum1Input('');
        setNum2Input('');
      }
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-blue-400 p-6">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => {
              setMode('home');
              setTestProblems([]);
              setTestName('');
            }}
            className="mb-6 px-6 py-3 bg-white rounded-lg font-semibold hover:bg-gray-100"
          >
            ← Back
          </button>

          <div className="bg-white rounded-2xl p-8 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <Printer className="text-green-500" size={36} />
              <h2 className="text-3xl font-bold text-gray-800">Create Your Own Test!</h2>
            </div>

            <div className="mb-8">
              <label className="block text-lg font-bold text-gray-700 mb-3">
                📝 Name Your Test:
              </label>
              <input
                type="text"
                value={testName}
                onChange={(e) => setTestName(e.target.value)}
                placeholder="e.g., 'Eilidh's Super Challenge' or 'Friday Math Quiz'"
                className="w-full text-xl p-4 border-2 border-purple-300 rounded-lg focus:border-purple-500 focus:outline-none"
              />
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4">✨ Create a Problem:</h3>
              
              <div className="grid grid-cols-5 gap-3 items-center mb-4">
                <input
                  type="number"
                  value={num1Input}
                  onChange={(e) => setNum1Input(e.target.value)}
                  placeholder="First number"
                  className="col-span-2 text-2xl text-center p-4 border-2 border-purple-300 rounded-lg focus:border-purple-500 focus:outline-none"
                />
                
                <select
                  value={selectedOp}
                  onChange={(e) => setSelectedOp(e.target.value)}
                  className="text-3xl text-center p-4 border-2 border-purple-300 rounded-lg focus:border-purple-500 focus:outline-none bg-white font-bold"
                >
                  <option value="+">+</option>
                  <option value="-">-</option>
                  <option value="×">×</option>
                  <option value="÷">÷</option>
                </select>

                <input
                  type="number"
                  value={num2Input}
                  onChange={(e) => setNum2Input(e.target.value)}
                  placeholder="Second number"
                  className="col-span-2 text-2xl text-center p-4 border-2 border-purple-300 rounded-lg focus:border-purple-500 focus:outline-none"
                />
              </div>

              <button
                onClick={addManualProblem}
                disabled={!num1Input || !num2Input}
                className="w-full py-4 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg font-bold text-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ➕ Add This Problem to Test
              </button>
            </div>

            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-700">
                  📋 Problems in Your Test: {testProblems.length}
                </h3>
                {testProblems.length > 0 && (
                  <button
                    onClick={() => setTestProblems([])}
                    className="px-4 py-2 bg-red-100 text-red-600 rounded-lg font-semibold hover:bg-red-200"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {testProblems.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-xl">
                  <p className="text-gray-500 text-lg">No problems yet! Create some problems above.</p>
                </div>
              ) : (
                <div className="max-h-80 overflow-y-auto space-y-2 bg-gray-50 rounded-xl p-4">
                  {testProblems.map((p, idx) => (
                    <div key={p.id} className="flex justify-between items-center p-4 bg-white rounded-lg shadow-sm">
                      <span className="text-lg font-semibold text-gray-800">
                        {idx + 1}. {p.num1} {getOperationSymbol(p.operation)} {p.num2} = ?
                      </span>
                      <button
                        onClick={() => setTestProblems(testProblems.filter(prob => prob.id !== p.id))}
                        className="px-4 py-2 text-red-500 hover:bg-red-50 rounded-lg font-bold transition-all"
                      >
                        ✕ Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {testProblems.length > 0 && (
              <button
                onClick={printTest}
                className="w-full py-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold text-2xl hover:shadow-xl transition-all flex items-center justify-center gap-3"
              >
                <Printer size={28} />
                🖨️ Print My Test!
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default GoodMath;