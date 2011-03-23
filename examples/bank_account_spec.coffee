class BankAccount
  constructor: ->
    @balance = 0
  deposit: (amount) ->
    @balance += amount
  is_in_the_red: ->
    @balance < 0

describe 'BankAccount', ->

  subject -> new BankAccount()

  shared_examples_for 'a store of money', ->
    it -> @should respond_to('deposit')

  context 'initially', ->
    it_should_behave_like 'a store of money', ->
      its 'balance', -> @should equal(0)

  let_ 'paycheck', -> 5

  when_ 'depositing moneys', ->
    subject.deposit paycheck

  then_ ->
    the 'paycheck', -> @should equal(subject.balance)
    its 'balance', -> @should equal(paycheck)
    it -> @should_not be('in_the_red')

    when_ 'i get payed some more', ->
      subject.deposit paycheck
      subject.deposit paycheck

    then_ ->
      its 'balance', -> @should be_divisible_by(paycheck)
