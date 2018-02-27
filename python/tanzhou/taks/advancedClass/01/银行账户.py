#!/usr/bin/env python
# coding=UTF-8
class Account:
    def init(self,name,number,balance):
        self.name = name;
        self.number = number;
        self.balance = balance;
    def deposit(self,amount):
        if amount <= 0:
            print('存款金额不能为负数');
        else:
            self.balance += amount;
    def withdraw(self,amount):
        if amount > self.balance:
            print('金额不足');
        else:
            self.balance -= amount;
    def desc(self):
        return 'Account({name},{number},{balance})'.format(name=self.name,number=self.number,balance=self.balance)
a1 = Account();
a1.init('a1',1,0);
a1.deposit(100);
a1.withdraw(50);
print(a1.desc());

a2 = Account();
a2.init('a2',2,10);
a2.deposit(100);
a2.withdraw(50);
print(a2.desc());
