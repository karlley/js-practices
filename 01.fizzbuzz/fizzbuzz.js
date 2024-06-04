#!/usr/bin/env node

const numbers = [...Array(20).keys()].map(i => i + 1);
numbers.forEach((number) => {
    if (number % 15 === 0) {
        console.log('FizzBuzz');
    } else if (number % 5 === 0) {
        console.log('Buzz');
    } else if (number % 3 === 0) {
        console.log('Fizz');
    } else {
        console.log(number.toString());
    }
});
