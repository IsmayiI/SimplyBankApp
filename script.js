'use strict';

// =========================================== Simply Bank App

const account1 = {
   userName: 'Cecil Ireland',
   transactions: [500, 250, -300, 5000, -850, -110, -170, 1100],
   interest: 1.5,
   pin: 1111,
};

const account2 = {
   userName: 'Amani Salt',
   transactions: [2000, 6400, -1350, -70, -210, -2000, 5500, -30],
   interest: 1.3,
   pin: 2222,
};

const account3 = {
   userName: 'Corey Martinez',
   transactions: [900, -200, 280, 300, -200, 150, 1400, -400],
   interest: 0.8,
   pin: 3333,
};

const account4 = {
   userName: 'Kamile Searle',
   transactions: [530, 1300, 500, 40, 190],
   interest: 1,
   pin: 4444,
};

const account5 = {
   userName: 'Oliver Avila',
   transactions: [630, 800, 300, 50, 120],
   interest: 1.1,
   pin: 5555,
};

const accounts = [account1, account2, account3, account4, account5];

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

const enterText = 'Войдите в свой аккаунт'
let account;

// =========================================== Functions


const displayTransactions = (transactions) => {
   containerTransactions.innerHTML = ''

   transactions.forEach((trans, i) => {
      const transTypeClass = trans > 0 ? 'deposit' : 'withdrawal'
      const transTypeString = trans > 0 ? 'депозит' : 'вывод средств'
      const transactionRow = `
      <div class="transactions__row">
          <div class="transactions__type transactions__type--${transTypeClass}">
            ${++i} ${transTypeString}
          </div>
          <div class="transactions__value transactions__value_${transTypeClass}">${Math.abs(trans)}$</div>
        </div>
      `

      containerTransactions.insertAdjacentHTML('afterbegin', transactionRow)
   })
}

const displayBalance = (transactions) => {
   const balance = transactions.reduce((sum, trans) => sum += trans, 0)
   labelBalance.textContent = `${balance}$`
   account.balance = balance
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


   labelSumIn.textContent = depositTotal + '$'
   labelSumOut.textContent = Math.abs(withdrawalTotal) + '$'
   labelSumInterest.textContent = interestTotal + '$'
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
      displayAccount()


   }
   resetData(inputTransferTo, inputTransferAmount)
}

const closeAccount = () => {
   const { nickname, pin } = account
   if (inputCloseUsername.value.trim() === nickname && +inputClosePin.value === pin) {
      const deleteAccountIndex = accounts.findIndex(obj => obj.nickname === nickname && obj.pin === pin)
      accounts.splice(deleteAccountIndex, 1)
      displayUI()
   }
   resetData(inputCloseUsername, inputClosePin)
}

// =========================================== Code

createNicknames(accounts)

// =========================================== Events

btnLogin.addEventListener('click', (e) => {
   e.preventDefault()
   displayUserAccount()
})

btnTransfer.addEventListener('click', (e) => {
   e.preventDefault()
   transferToAccount()
})


btnClose.addEventListener('click', (e) => {
   e.preventDefault()
   closeAccount()
})




