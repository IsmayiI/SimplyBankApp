'use strict';

// =========================================== Simply Bank App

const account1 = {
   userName: 'Cecil Ireland',
   transactions: [500, 250, -300, 5000, -850, -110, -170, 1100],
   interest: 1.5,
   pin: 1111,
   transactionsDates: [
      '2020-10-02T14:43:31.074Z',
      '2020-10-29T11:24:19.761Z',
      '2020-11-15T10:45:23.907Z',
      '2021-01-22T12:17:46.255Z',
      '2021-02-12T15:14:06.486Z',
      '2021-03-09T11:42:26.371Z',
      '2021-05-21T07:43:59.331Z',
      '2021-06-22T15:21:20.814Z',
   ],
   currency: 'USD',
   locale: 'en-US',
};

const account2 = {
   userName: 'Amani Salt',
   transactions: [2000, 6400, -1350, -70, -210, -2000, 5500, -30],
   interest: 1.3,
   pin: 2222,
   transactionsDates: [
      '2020-10-02T14:43:31.074Z',
      '2020-10-29T11:24:19.761Z',
      '2020-11-15T10:45:23.907Z',
      '2021-01-22T12:17:46.255Z',
      '2021-02-12T15:14:06.486Z',
      '2021-03-09T11:42:26.371Z',
      '2021-05-21T07:43:59.331Z',
      '2021-06-22T15:21:20.814Z',
   ],
   currency: 'UAH',
   locale: 'uk-UA',
};

const account3 = {
   userName: 'Corey Martinez',
   transactions: [900, -200, 280, 300, -200, 150, 1400, -400],
   interest: 0.8,
   pin: 3333,
   transactionsDates: [
      '2020-10-02T14:43:31.074Z',
      '2020-10-29T11:24:19.761Z',
      '2020-11-15T10:45:23.907Z',
      '2021-01-22T12:17:46.255Z',
      '2021-02-12T15:14:06.486Z',
      '2021-03-09T11:42:26.371Z',
      '2021-05-21T07:43:59.331Z',
      '2021-06-22T15:21:20.814Z',
   ],
   currency: 'RUB',
   locale: 'ru-RU',
};

const account4 = {
   userName: 'Kamile Searle',
   transactions: [530, 1300, 500, 40, 190],
   interest: 1,
   pin: 4444,
   transactionsDates: [
      '2020-10-02T14:43:31.074Z',
      '2020-10-29T11:24:19.761Z',
      '2020-11-15T10:45:23.907Z',
      '2021-01-22T12:17:46.255Z',
      '2021-02-12T15:14:06.486Z',
   ],
   currency: 'CAD',
   locale: 'fr-CA',
};

const account5 = {
   userName: 'Oliver Avila',
   transactions: [630, 800, 300, 50, 120],
   interest: 1.1,
   pin: 5555,
   transactionsDates: [
      '2020-10-02T14:43:31.074Z',
      '2020-10-29T11:24:19.761Z',
      '2020-11-15T10:45:23.907Z',
      '2021-01-22T12:17:46.255Z',
      '2021-02-12T15:14:06.486Z',
   ],
   currency: 'USD',
   locale: 'en-US',
};

const enterText = 'Войдите в свой аккаунт'
let accounts = [account1, account2, account3, account4, account5];
let account;
let sortedTransactions = false
let timer;

// =========================================== Elements

const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.total__value--in');
const labelSumOut = document.querySelector('.total__value--out');
const labelSumInterest = document.querySelector('.total__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerTransactions = document.querySelector('.transactions');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

// =========================================== Functions


const displayTransactions = (transactions) => {
   containerTransactions.innerHTML = ''

   transactions.forEach((trans, i) => {
      const date = displayDate(account.transactionsDates[i])
      const transTypeClass = trans > 0 ? 'deposit' : 'withdrawal'
      const transTypeString = trans > 0 ? 'депозит' : 'вывод средств'
      const transactionRow = `
         <div class="transactions__row">
             <div class="transactions__type transactions__type--${transTypeClass}">
               ${++i} ${transTypeString}
             </div>
             <div class="transactions__date">${date}</div>
             <div class="transactions__value transactions__value_${transTypeClass}">${transactionsCurrency(trans)}</div>
           </div>
         `

      containerTransactions.insertAdjacentHTML('afterbegin', transactionRow)
   })
}

const displayBalance = (transactions) => {
   const balance = transactions.reduce((sum, trans) => sum += trans, 0)
   labelBalance.textContent = `${transactionsCurrency(balance)}`
   account.balance = balance
   labelDate.textContent = displayDate()
}

const displayTotalValue = (transactions, interest) => {
   const depositTotal = transactions.filter(trans => trans > 0)
      .reduce((sum, trans) => sum + trans, 0)
   const withdrawalTotal = transactions.filter(trans => trans < 0)
      .reduce((sum, trans) => sum + trans, 0)
   const interestTotal = transactions.filter(trans => trans > 0)
      .map(trans => (trans * interest) / 100)
      .filter(int => int >= 5)
      .reduce((sum, int) => sum + int, 0)


   labelSumIn.textContent = transactionsCurrency(depositTotal)
   labelSumOut.textContent = transactionsCurrency(withdrawalTotal)
   labelSumInterest.textContent = transactionsCurrency(interestTotal)
}

const displayUI = (text = enterText, opacity = 0) => {
   labelWelcome.textContent = text
   containerApp.style.opacity = opacity
}

const firstLetters = (str) => {
   return str.toLowerCase()
      .split(' ')
      .map(word => word[0])
      .join('')
}

const createNicknames = (arr) => {
   arr.forEach((obj) => {
      obj.nickname = firstLetters(obj.userName)
   })
}

const resetData = (input1, input2) => {
   input1.value = ''
   input2.value = ''
   input2.blur()
}

const displayAccount = () => {
   const { transactions, interest, userName } = account
   displayTransactions(transactions)
   displayBalance(transactions)
   displayTotalValue(transactions, interest)
   displayUI(userName, 1)
}

const displayUserAccount = () => {
   account = accounts.find(({ nickname, pin }) =>
      inputLoginUsername.value.trim() === nickname && +inputLoginPin.value === pin)
   resetData(inputLoginUsername, inputLoginPin)
   if (account) {
      displayAccount()
   } else {
      displayUI()
   }
}

const transferToAccount = () => {
   const accForTransfer = accounts.find(({ nickname }) => inputTransferTo.value.trim() === nickname)
   if (accForTransfer
      && +inputTransferAmount.value > 0
      && +inputTransferAmount.value <= account.balance
      && accForTransfer.nickname !== account.nickname) {
      accForTransfer.transactions.push(+inputTransferAmount.value)
      account.transactions.push(-(+inputTransferAmount.value))
      account.transactionsDates.push(new Date().toISOString())
      accForTransfer.transactionsDates.push(new Date().toISOString())
      displayAccount()


   }
   resetData(inputTransferTo, inputTransferAmount)
}

const closeAccount = () => {
   const { nickname, pin } = account
   if (inputCloseUsername.value.trim() === nickname && +inputClosePin.value === pin) {
      accounts = accounts.filter(obj => obj !== account)
      displayUI()
   }
   resetData(inputCloseUsername, inputClosePin)
}

const addLoan = () => {
   const loanAmount = +inputLoanAmount.value
   if (loanAmount > 0 && account.transactions.some(trans => trans >= (loanAmount * 10) / 100)) {
      setTimeout(() => {
         account.transactions.push(loanAmount)
         account.transactionsDates.push(new Date().toISOString())
         displayAccount()
      }, 5000)

   }
   resetData(inputLoanAmount, inputLoanAmount)
}

const sortTransactions = (transactions) => {
   sortedTransactions = !sortedTransactions
   const transacs = sortedTransactions ? transactions.slice().sort((a, b) => a - b) : transactions
   displayTransactions(transacs)
}

const displayDate = (arg) => {
   const options = {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
   }

   if (arg) {
      const date = new Date(arg)
      const variance = dateBetweenDays(new Date, date)

      if (variance <= 1) return 'Сегодня'
      if (variance === 2) return 'Вчера'
      if (variance < 5) return `${variance} дня назад`

      return new Intl.DateTimeFormat(account.locale, options).format(date)
   }

   return new Intl.DateTimeFormat(account.locale, options).format(new Date())

}

const transactionsCurrency = (trans) => {
   const options = {
      style: 'currency',
      currency: account.currency
   }

   return new Intl.NumberFormat(account.locale, options).format(trans)
}

const startLogoutTimer = () => {
   let time = 300

   timer = setInterval(() => {
      --time

      const min = `${Math.trunc(time / 60)}`.padStart(2, '0')
      const sec = `${time % 60}`.padStart(2, '0')


      labelTimer.textContent = `${min}:${sec}`
      if (time === 0) {
         clearInterval(timer)
         displayUI()
         account = null
      }

   }, 1000)
}

const resetTimer = () => {
   clearInterval(timer)
   startLogoutTimer()
}

const dateBetweenDays = (date1, date2) => Math.trunc(Math.abs(date1 - date2) / (1000 * 60 * 60 * 24))

// =========================================== Code

createNicknames(accounts)

// =========================================== Events

btnLogin.addEventListener('click', (e) => {
   e.preventDefault()
   displayUserAccount()
   if (timer) clearInterval(timer)
   startLogoutTimer()
})

btnTransfer.addEventListener('click', (e) => {
   e.preventDefault()
   transferToAccount()
   resetTimer()
})

btnClose.addEventListener('click', (e) => {
   e.preventDefault()
   closeAccount()
})

btnLoan.addEventListener('click', (e) => {
   e.preventDefault()
   addLoan()
   resetTimer()
})

btnSort.addEventListener('click', (e) => {
   e.preventDefault()
   sortTransactions(account.transactions)
   resetTimer()
})





