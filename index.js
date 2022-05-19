class Calculator{
    constructor(previousOperandElement, currentOperandElement, deleteButton){
        this.previousOperandElement = previousOperandElement
        this.currentOperandElement = currentOperandElement
        this.deleteButton = deleteButton
        this.rawInput = ''
        this.result = ''
        this.styledOutput = ''
        this.currentOperandString = ''
        this.operator = ''
    }

    wrapTag(str, sub, tag){
        let string = str
        for (let i=0; i< sub.length; i++){
            let re = new RegExp(`[${sub[i]}]`, 'g')
            string = string.replace(re, `<${tag}>${sub[i]}</${tag}>`)
        }
        return string
    }

    append(button){
        if (this.currentOperandString.match(/\d{10}(?!\.)/) && button.dataset.value.match(/[0-9]/)){
            alert("بیشتر از ۱۰ رقم نمی‌توان وارد کرد")
            return
        }
        if (this.currentOperandString.match(/\.\d{7}/) && button.dataset.value.match(/[0-9]/)){
            alert("بیشتر از ۷ رقم اعشار نمی‌توان وارد کرد")
            return
        }
        
        let isOperatorLast = this.rawInput.match('[-+*/]$')
        let isButtonOperator = '-+*/'.includes(button.dataset.value)
        if ((this.rawInput === '' || isOperatorLast) && button.dataset.value === '.'){
            this.rawInput += '0.'
            let temp = 0
            this.currentOperandString += '0.'
            this.styledOutput += temp.toLocaleString('fa') + '٫'
            if (isOperatorLast) this.compute()
            
        } else{
            if ((isButtonOperator || button.dataset.value === '%') && (this.rawInput === '')) return
            if (isButtonOperator && isOperatorLast){
                this.rawInput = this.rawInput.slice(0, -1) + button.dataset.value
                this.styledOutput = this.styledOutput.slice(0, -1) + button.dataset.symbol
                return
            }
            if (button.dataset.value === '.' && this.currentOperandString.includes('.')) return
            if (isButtonOperator){
                this.styledOutput += button.dataset.symbol
                this.currentOperandString = ''
            }else{
                if (button.dataset.value === '%'){
                    this.currentOperandString = ''
                    if ('-+*/%'.includes(this.rawInput.slice(-1))){
                        alert('فرمت نادرست می‌باشد')
                    }else{
                        this.styledOutput += button.dataset.symbol
                        this.rawInput += button.dataset.value
                        this.compute()
                    }
                    return
                }
                if (this.rawInput.slice(-1) ==='%'){
                    this.styledOutput += '×'
                    this.rawInput += '*'
                }
                this.currentOperandString += button.dataset.value
                this.slicedStyleOutput = undefined
                if (this.currentOperandString.length !== 1){
                    if (this.currentOperandString.slice(-2, -1) === '.'){
                        this.slicedStyleOutput = -(parseFloat(this.currentOperandString.slice(0,-1)).toLocaleString('fa').length + 1)
                    } else{
                        this.slicedStyleOutput = -(parseFloat(this.currentOperandString.slice(0,-1)).toLocaleString('fa',{maximumFractionDigits: 10}).length)
                    }
                }
                if (button.dataset.value !== '.'){
                    this.currentOperand = parseFloat(this.currentOperandString).toLocaleString('fa', {maximumFractionDigits: 10})
                    this.styledOutput = this.styledOutput.slice(0, this.slicedStyleOutput)
                        + this.currentOperand
                }else{
                    this.styledOutput += '٫'
                }
            }
            this.rawInput += button.dataset.value
            this.result = ''
            if (!(isButtonOperator) && this.rawInput.match('[-+*/%]')){
                this.compute()
            }
        }
    }

    display(){
        this.previousOperandElement.classList.remove('move')
        if (this.rawInput.length > 16){
            this.currentOperandElement.style.fontSize = '1.5rem'
        } else{
            this.currentOperandElement.style.fontSize = '2rem'
        }
        this.currentOperandElement.innerHTML = this.wrapTag(this.styledOutput, '-+÷×٪', 'span')
        if (this.result === '') {
            this.previousOperandElement.innerText = this.result
        } else{
            this.previousOperandElement.innerText = parseFloat(this.result).toLocaleString('fa', {maximumFractionDigits: 10})
        }
        if (this.rawInput !== ''){
            this.deleteButton.style.color = 'rgb(0, 172, 0)'
            this.deleteButton.removeAttribute('disabled')
        } else{
            this.deleteButton.style.color = 'rgba(0, 172, 0, .25)'
            clearInterval(timeIntervalId)
            this.deleteButton.setAttribute('disabled', 'true')
        }
    }

    eval2(string){
        let str = string
        let percentNumber
        let percentResult
        let re
        let percentRegex = string.match(/\d+(\.\d+)?\%/g)
        if (percentRegex){
            for (let i=0; i< percentRegex.length; i++){
                percentNumber = percentRegex[i].slice(0, -1)
                percentResult = parseFloat(percentNumber) / 100
                re = new RegExp(`${percentNumber}%`, 'g')
                str = str.replace(re, percentResult)
            }
            return eval(str)
        } else{
            return eval(string)
        }
    }

    compute(){
        this.result = this.eval2(this.rawInput)
    }

    equalSet(){
        if (this.result === '') return
        if (this.rawInput !== ''){
            this.rawInput = String(this.result)
            this.currentOperandString = this.rawInput 
            this.styledOutput = parseFloat(this.result).toLocaleString('fa', {maximumFractionDigits: 10})
            this.currentOperandElement.innerHTML = ''
            setTimeout(() => {
                this.result = ''
                this.currentOperandElement.innerHTML = `<span>${this.styledOutput}</span>`
                this.previousOperandElement.innerText = ''
            }, 250)
        }
    }

    delete(){
        let lastItem = this.rawInput.slice(-1)
        this.styledOutput = this.styledOutput.slice(0, -1)
        this.rawInput = this.rawInput.slice(0, -1)
        let lastOperandRegex = this.rawInput.match(/(\d+(\.\d+)?)$/)
        if (lastOperandRegex && !(lastOperandRegex[0].includes('.')) && !('+-*/.()'.includes(lastItem))){
            let lastOperand = parseFloat(lastOperandRegex[0]).toLocaleString('fa', {maximumFractionDigits: 10})
            let temp = parseInt(lastOperandRegex[0].length / 3)
            let slicedStyleOutput = -(lastOperandRegex[0].length + temp)
            this.styledOutput = this.styledOutput.slice(0, slicedStyleOutput) + lastOperand
        }
        this.currentOperandString = lastOperandRegex ? lastOperandRegex[0] : ''
        if (this.rawInput.match('[-+*/%]') && !(this.rawInput.match('[-+*/]$'))){    
            this.compute()
            return
        }
        this.result = ''
    }

    clearAll(){
        this.currentOperandString = ''
        this.styledOutput = ''
        this.rawInput = ''
        this.result = ''
        this.display()
    }

}

let AllButtons = document.querySelectorAll('.button')
let Buttons = document.querySelectorAll('[data-value]')
let resultLarge = document.querySelector('.result-large')
let resultSmall = document.querySelector('.result-small span')
let clearAllButton = document.querySelector('.clear-all')
let deleteButton = document.querySelector('.delete')
let equalButton = document.querySelector('.equal')
let calculatorElement = document.querySelector('.calculator')



Buttons.forEach(button=>{
    button.addEventListener('click', e=>{
        calculator.append(button)
        calculator.display()
    })
})

clearAllButton.addEventListener('click', ()=>{
    calculator.clearAll()
})

deleteButton.addEventListener('click', ()=>{
    calculator.delete()
    calculator.display()
})


equalButton.addEventListener('click', e=>{
    resultSmall.classList.add('move')
    calculator.equalSet()
})

let timeoutId = 0
let timeIntervalId = 0

deleteButton.addEventListener('mousedown', ()=>{
    timeoutId = setTimeout(() => {
        timeIntervalId = setInterval(() => {
            calculator.delete()
            calculator.display()
        }, 80);
    }, 300);
    
})


deleteButton.addEventListener('mouseup', ()=>{
    clearTimeout(timeoutId)
    clearInterval(timeIntervalId)
})

AllButtons.forEach(button=>{
    button.addEventListener('mousedown', e=>{
        e.target.classList.add('active')
        activeId = setTimeout(() => {
            e.target.classList.remove('active')
        }, 200);
    })
})


let infoTimeoutId
let infoOverlays = document.querySelectorAll('.info')
infoOverlays.forEach(info=>{
    info.parentElement.addEventListener('mousedown', e=>{
        infoTimeoutId = setTimeout(() => {
                info.style.visibility = 'visible'
                info.style.opacity = '1'
                
        }, 600);
    })
})

infoOverlays.forEach(info=>{
    info.parentElement.addEventListener('mouseup', e=>{
        clearTimeout(infoTimeoutId)
        setTimeout(() => {
            info.style.opacity = '0'
            info.style.visibility = 'hidden'
            
        }, 1000);
        
    })
})


let calculator = new Calculator(resultSmall, resultLarge, deleteButton)

